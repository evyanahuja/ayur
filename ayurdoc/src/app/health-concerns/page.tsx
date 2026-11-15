import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, MedicalDisclaimer } from "@/components/seo";
import { AppointmentCta, CATEGORY_ICONS } from "@/components/Conversion";
import { HEALTH_CATEGORIES } from "@/content/categories";
import { breadcrumbJsonLd, canonical } from "@/seo/config";

const TITLE = "Health Concerns We Help With | Ayurvedic Care for All Ages in Indore";
const DESCRIPTION =
  "Explore Ayurvedic care in Indore for children, skin and hair, digestion, respiratory, neurological, joint, women's, men's, metabolic and senior health. Dr. Priyanka Likhar, BAMS, MD.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: canonical("/health-concerns") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonical("/health-concerns"),
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
};

export default function HealthConcernsHub() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Health Concerns", path: "/health-concerns" },
            ])
          ).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main">
        <div className="relative overflow-hidden bg-forest-950 text-cream-50">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-saffron-500/20 blur-[100px]" aria-hidden />
          <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-28 text-center sm:px-6 sm:pt-32">
            <p className="eyebrow text-saffron-300">Health concerns</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-light leading-tight">
              What health concern are you looking for help with?
            </h1>
            <p className="mx-auto mt-3 max-w-3xl text-[15px] leading-relaxed text-cream-100/80">
              Read about common conditions in each area, the Ayurvedic approach, and how a consultation with Dr. Priyanka
              Likhar at our Indore clinic can help. Care is individualised for children, adults and senior citizens.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Health Concerns" }]} />
        </div>

        <div className="mx-auto max-w-6xl space-y-12 px-4 pb-16 sm:px-6">
          <section aria-labelledby="cats-h" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <h2 id="cats-h" className="sr-only">
              Health concern categories
            </h2>
            {HEALTH_CATEGORIES.map((c) => {
              const Icon = CATEGORY_ICONS[c.icon];
              return (
                <Link
                  key={c.slug}
                  href={`/health-concerns/${c.slug}`}
                  className="group flex flex-col rounded-3xl border border-forest-900/10 bg-white p-6 transition-all hover:border-saffron-500/50 hover:shadow-luxe"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-950 text-saffron-300">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="mt-4 font-display text-[21px] text-forest-950">{c.title}</span>
                  <span className="mt-2 text-[14px] leading-relaxed text-forest-800/70">{c.navHint}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13.5px] font-semibold text-forest-800">
                    Read the guide <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              );
            })}
          </section>

          <AppointmentCta />
          <MedicalDisclaimer />
        </div>
      </main>
    </>
  );
}
