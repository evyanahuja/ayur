"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, LanguageTitleSync, MedicalDisclaimer } from "@/components/seo";
import { AppointmentCta, CATEGORY_ICONS } from "@/components/Conversion";
import { PageMandalas, SectionMandalas } from "@/components/ScrollMandala";
import { HEALTH_CATEGORIES } from "@/content/categories";
import { useLanguage } from "@/i18n/LanguageContext";
import { useExpansion } from "@/i18n/expansion";
import { localizeCategory } from "@/i18n/categoriesTranslations";

export function HealthConcernsHubView() {
  const { lang } = useLanguage();
  const ui = useExpansion(lang).categories;

  return (
    <main id="main">
      <LanguageTitleSync title={ui.hubSeoTitle} />
      <div className="mandala-section relative overflow-hidden bg-forest-950 text-cream-50">
        <SectionMandalas id="hc-hub-hero" palette="marigold" side="left" dark innerHero />
        <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-saffron-500/20 blur-[100px]" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-28 text-center sm:px-6 sm:pt-32">
          <div className="page-hero-glass">
            <p className="eyebrow text-saffron-300">{ui.hubEyebrow}</p>
            <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-light leading-tight">{ui.hubH1}</h1>
            <p className="mx-auto mt-3 max-w-3xl text-[15px] leading-relaxed text-cream-100/85">{ui.hubIntro}</p>
          </div>
        </div>
      </div>

      <div className="mandala-section relative overflow-hidden">
        <PageMandalas id="hc-hub-body" tall />
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <Breadcrumbs items={[{ label: ui.homeCrumb, href: "/" }, { label: ui.hubCrumb }]} />
        </div>

        <div className="mx-auto max-w-6xl space-y-12 px-4 pb-16 sm:px-6">
        <section aria-labelledby="cats-h" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <h2 id="cats-h" className="sr-only">
            {ui.hubSrHeading}
          </h2>
          {HEALTH_CATEGORIES.map((raw) => {
            const c = localizeCategory(raw, lang);
            const Icon = CATEGORY_ICONS[raw.icon];
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
                  {ui.readCategoryGuide}{" "}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            );
          })}
        </section>

        <AppointmentCta />
        <MedicalDisclaimer />
        </div>
      </div>
    </main>
  );
}
