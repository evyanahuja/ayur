import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { DoctorIntro } from "@/components/DoctorIntro";
import { Pricing } from "@/components/Pricing";
import { BookingSection } from "@/components/BookingSection";
import { SectionMandalas } from "@/components/ScrollMandala";
import { AuthorBox, CtaBand } from "@/components/seo";
import {
  ArticlePreview,
  ClinicLocation,
  ConcernCards,
  ConsultationSteps,
  HomeFaq,
  PopularGuides,
  TreatmentCards,
  WhyChoose,
} from "@/components/HomeSections";
import { EXPANSION } from "@/i18n/expansion";
import { SEO } from "@/content/site";

const HOME_FAQS = EXPANSION.en.home.faqs;
import { canonical, localBusinessJsonLd, physicianJsonLd, websiteJsonLd } from "@/seo/config";

export const metadata: Metadata = {
  title: { absolute: SEO.title },
  description: SEO.description,
  alternates: { canonical: canonical("/") },
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    url: canonical("/"),
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SEO.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
    images: ["/opengraph-image"],
  },
};

export default function HomePage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([websiteJsonLd(), localBusinessJsonLd(), physicianJsonLd(), faqJsonLd]).replace(
            /</g,
            "\\u003c"
          ),
        }}
      />
      <main id="main" className="relative bg-white">
        <Hero />
        <ConcernCards />
        <DoctorIntro />
        <TreatmentCards />
        <ConsultationSteps />
        <WhyChoose />
        <PopularGuides />
        <ArticlePreview />
        <Pricing />
        <HomeFaq />
        <section className="mandala-section relative overflow-hidden py-8">
          <SectionMandalas id="home-reviewer" palette="marigold" side="left" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <AuthorBox />
          </div>
        </section>
        <ClinicLocation />
        <BookingSection />
        <section className="mandala-section relative overflow-hidden py-12">
          <SectionMandalas id="home-cta" palette="peacock" side="right" />
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <CtaBand />
          </div>
        </section>
      </main>
    </>
  );
}
