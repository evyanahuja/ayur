import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  ConditionTemplateView,
  TreatmentTemplateView,
  ArticleTemplateView,
} from "@/components/PageViews";
import { CONDITIONS_1 } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS } from "@/content/treatments";
import { ARTICLES } from "@/content/articles";
import {
  canonical,
  breadcrumbJsonLd,
  faqJsonLd,
  medicalWebPageJsonLd,
} from "@/seo/config";

const ALL_CONDITIONS = [...CONDITIONS_1, ...CONDITIONS_2];

const NESTED_REDIRECTS: Record<string, string> = {
  "conditions/speech-delay": "/conditions/speech-delay-in-children",
  "conditions/adhd": "/conditions/adhd-in-children",
};

function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function generateStaticParams(): { section: string; slug: string }[] {
  return [
    ...ALL_CONDITIONS.map((c) => ({ section: "conditions", slug: c.slug })),
    ...TREATMENTS.map((t) => ({ section: t.base, slug: t.slug })),
    ...ARTICLES.map((a) => ({ section: "articles", slug: a.slug })),
  ];
}

function buildArticleMeta(title: string, description: string, path: string): Metadata {
  const url = canonical(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}): Promise<Metadata> {
  const { section, slug } = await params;
  const sec = section.toLowerCase();
  const sl = slug.toLowerCase();

  if (sec === "conditions") {
    const cond = ALL_CONDITIONS.find((c) => c.slug === sl);
    if (cond) return buildArticleMeta(cond.seoTitle, cond.seoDescription, `/conditions/${cond.slug}`);
  }

  if (sec === "treatments" || sec === "services") {
    const treat = TREATMENTS.find((t) => t.base === sec && t.slug === sl);
    if (treat) return buildArticleMeta(treat.seoTitle, treat.seoDescription, `/${treat.base}/${treat.slug}`);
  }

  if (sec === "articles") {
    const art = ARTICLES.find((a) => a.slug === sl);
    if (art) return buildArticleMeta(art.seoTitle, art.seoDescription, `/articles/${art.slug}`);
  }

  return {
    title: "Page Not Found | BalChikitsa Ayurved Clinic",
    robots: { index: false, follow: false },
  };
}

export default async function NestedDetailPage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const sec = section.toLowerCase();
  const sl = slug.toLowerCase();
  const fullKey = `${sec}/${sl}`;

  if (NESTED_REDIRECTS[fullKey]) {
    permanentRedirect(NESTED_REDIRECTS[fullKey]);
  }

  if (sec === "conditions") {
    const cond = ALL_CONDITIONS.find((c) => c.slug === sl);
    if (cond) {
      const path = `/conditions/${cond.slug}`;
      return (
        <>
          <JsonLd
            data={[
              breadcrumbJsonLd([
                { name: "Home", path: "/" },
                { name: "Conditions", path: "/conditions" },
                { name: cond.title, path },
              ]),
              medicalWebPageJsonLd({
                path,
                name: cond.h1,
                description: cond.seoDescription,
                about: cond.title,
              }),
              faqJsonLd(cond.faqs),
            ]}
          />
          <ConditionTemplateView page={cond} />
        </>
      );
    }
  }

  if (sec === "treatments" || sec === "services") {
    const treat = TREATMENTS.find((t) => t.base === sec && t.slug === sl);
    if (treat) {
      const path = `/${treat.base}/${treat.slug}`;
      return (
        <>
          <JsonLd
            data={[
              breadcrumbJsonLd([
                { name: "Home", path: "/" },
                { name: "Treatments", path: "/treatments" },
                { name: treat.title, path },
              ]),
              medicalWebPageJsonLd({
                path,
                name: treat.h1,
                description: treat.seoDescription,
              }),
              faqJsonLd(treat.faqs),
            ]}
          />
          <TreatmentTemplateView page={treat} />
        </>
      );
    }
  }

  if (sec === "articles") {
    const art = ARTICLES.find((a) => a.slug === sl);
    if (art) {
      const path = `/articles/${art.slug}`;
      return (
        <>
          <JsonLd
            data={[
              breadcrumbJsonLd([
                { name: "Home", path: "/" },
                { name: "Articles", path: "/articles" },
                { name: art.title, path },
              ]),
              medicalWebPageJsonLd({
                path,
                name: art.h1,
                description: art.seoDescription,
              }),
              faqJsonLd(art.faqs),
            ]}
          />
          <ArticleTemplateView page={art} />
        </>
      );
    }
  }

  notFound();
}
