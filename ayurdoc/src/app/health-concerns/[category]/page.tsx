import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/CategoryView";
import { HEALTH_CATEGORIES, findCategory } from "@/content/categories";
import { breadcrumbJsonLd, canonical, faqJsonLd } from "@/seo/config";

export function generateStaticParams(): { category: string }[] {
  return HEALTH_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = findCategory(category.toLowerCase());
  if (!c) {
    return { title: "Page Not Found | Prakriti Ayurveda Clinic", robots: { index: false, follow: false } };
  }
  const url = canonical(`/health-concerns/${c.slug}`);
  return {
    title: { absolute: c.seoTitle },
    description: c.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: c.seoTitle,
      description: c.seoDescription,
      url,
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: c.seoTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.seoTitle,
      description: c.seoDescription,
      images: ["/opengraph-image"],
    },
  };
}

export default async function HealthConcernPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const c = findCategory(category.toLowerCase());
  if (!c) notFound();

  const path = `/health-concerns/${c.slug}`;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Health Concerns", path: "/health-concerns" },
              { name: c.title, path },
            ]),
            faqJsonLd(c.faqs),
          ]).replace(/</g, "\\u003c"),
        }}
      />
      <CategoryView category={c} />
    </>
  );
}
