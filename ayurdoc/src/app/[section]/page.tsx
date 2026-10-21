import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  AboutDoctorView,
  ChildHealthHubView,
  ConditionsIndexView,
  TreatmentsIndexView,
  ArticlesIndexView,
  FaqHubView,
  ContactPageView,
  PrivacyPageView,
  TermsPageView,
  SitemapPageView,
  LocalTemplateView,
} from "@/components/PageViews";
import { LOCAL_PAGES } from "@/content/local";
import {
  canonical,
  breadcrumbJsonLd,
  faqJsonLd,
  medicalWebPageJsonLd,
  localBusinessJsonLd,
} from "@/seo/config";
import { PAGES_DICTIONARY } from "@/i18n/pagesDictionary";

const TOP_LEVEL_REDIRECTS: Record<string, string> = {
  about: "/about-doctor",
  doctor: "/about-doctor",
  "contact-us": "/contact",
  privacy: "/privacy-policy",
  "owner-checklist": "/about-doctor",
};

function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function generateStaticParams(): { section: string }[] {
  return [
    { section: "about-doctor" },
    { section: "child-health" },
    { section: "conditions" },
    { section: "treatments" },
    { section: "articles" },
    { section: "faq" },
    { section: "contact" },
    { section: "privacy-policy" },
    { section: "terms" },
    { section: "sitemap" },
    ...LOCAL_PAGES.map((l) => ({ section: l.slug })),
  ];
}

function buildMeta(title: string, description: string, path: string): Metadata {
  const url = canonical(path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
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
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  const key = section.toLowerCase();
  const en = PAGES_DICTIONARY.en;

  if (key === "about-doctor") return buildMeta(en.staticPages.about.seoTitle, en.staticPages.about.seoDesc, "/about-doctor");
  if (key === "child-health") return buildMeta("Child Health Hub | Growth, Immunity, Behaviour & Nutrition", en.hubs.childHealthIntro, "/child-health");
  if (key === "conditions") return buildMeta("Child Health Conditions Library (A–Z) | BalChikitsa Indore", en.hubs.conditionsIntro, "/conditions");
  if (key === "treatments") return buildMeta("Treatments & Services | Suvarnaprashan, Panchakarma, Consultation", en.hubs.treatmentsIntro, "/treatments");
  if (key === "articles") return buildMeta("Health Articles Library | Child & Family Health Guides", en.hubs.articlesIntro, "/articles");
  if (key === "faq") return buildMeta("Frequently Asked Questions | BalChikitsa Ayurved Clinic", en.hubs.faqIntro, "/faq");
  if (key === "contact") return buildMeta(en.staticPages.contact.seoTitle, en.staticPages.contact.seoDesc, "/contact");
  if (key === "privacy-policy") return buildMeta(en.staticPages.privacy.seoTitle, en.staticPages.privacy.seoDesc, "/privacy-policy");
  if (key === "terms") return buildMeta(en.staticPages.terms.seoTitle, en.staticPages.terms.seoDesc, "/terms");
  if (key === "sitemap") return buildMeta(en.staticPages.sitemap.seoTitle, en.staticPages.sitemap.seoDesc, "/sitemap");

  const loc = LOCAL_PAGES.find((l) => l.slug === key);
  if (loc) return buildMeta(loc.seoTitle, loc.seoDescription, `/${loc.slug}`);

  return {
    title: "Page Not Found | BalChikitsa Ayurved Clinic",
    robots: { index: false, follow: false },
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const key = section.toLowerCase();

  if (TOP_LEVEL_REDIRECTS[key]) {
    permanentRedirect(TOP_LEVEL_REDIRECTS[key]);
  }

  const en = PAGES_DICTIONARY.en;

  if (key === "about-doctor") {
    return (
      <>
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "About the Doctor", path: "/about-doctor" },
            ]),
            localBusinessJsonLd(),
          ]}
        />
        <AboutDoctorView />
      </>
    );
  }

  if (key === "child-health") {
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Child Health", path: "/child-health" },
          ])}
        />
        <ChildHealthHubView />
      </>
    );
  }

  if (key === "conditions") {
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Conditions", path: "/conditions" },
          ])}
        />
        <ConditionsIndexView />
      </>
    );
  }

  if (key === "treatments") {
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Treatments", path: "/treatments" },
          ])}
        />
        <TreatmentsIndexView />
      </>
    );
  }

  if (key === "articles") {
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
          ])}
        />
        <ArticlesIndexView />
      </>
    );
  }

  if (key === "faq") {
    const allFaqs = en.hubs.faqGroups.flatMap((g) => g.faqs);
    return (
      <>
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "FAQ", path: "/faq" },
            ]),
            faqJsonLd(allFaqs),
          ]}
        />
        <FaqHubView />
      </>
    );
  }

  if (key === "contact") {
    return (
      <>
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
            localBusinessJsonLd(),
          ]}
        />
        <ContactPageView />
      </>
    );
  }

  if (key === "privacy-policy") return <PrivacyPageView />;
  if (key === "terms") return <TermsPageView />;
  if (key === "sitemap") return <SitemapPageView />;

  const loc = LOCAL_PAGES.find((l) => l.slug === key);
  if (loc) {
    const path = `/${loc.slug}`;
    return (
      <>
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: loc.title, path },
            ]),
            medicalWebPageJsonLd({
              path,
              name: loc.h1,
              description: loc.seoDescription,
            }),
            faqJsonLd(loc.faqs),
          ]}
        />
        <LocalTemplateView page={loc} />
      </>
    );
  }

  notFound();
}
