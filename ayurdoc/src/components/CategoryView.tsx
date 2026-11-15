"use client";

/* Health-concern category landing page. SSR-rendered for crawlability, switches cleanly
   between English, Hindi, Marathi and Gujarati via LanguageContext. */
import Link from "next/link";
import { Check } from "lucide-react";
import { AuthorBox, Breadcrumbs, LanguageTitleSync, MedicalDisclaimer } from "@/components/seo";
import { AppointmentCta, CATEGORY_ICONS, DoctorHelp } from "@/components/Conversion";
import { HEALTH_CATEGORIES, type HealthCategory } from "@/content/categories";
import { PUBLISHED_CONDITIONS } from "@/content/registry";
import { TREATMENTS } from "@/content/treatments";
import { useLanguage } from "@/i18n/LanguageContext";
import { useExpansion } from "@/i18n/expansion";
import { localizeCategory } from "@/i18n/categoriesTranslations";
import { localizeCondition, localizeTreatment } from "@/i18n/contentTranslations";

export function CategoryView({ category: raw }: { category: HealthCategory }) {
  const { lang } = useLanguage();
  const ui = useExpansion(lang).categories;
  const c = localizeCategory(raw, lang);
  const Icon = CATEGORY_ICONS[raw.icon];

  const conditions = raw.conditionSlugs.flatMap((slug) =>
    PUBLISHED_CONDITIONS.filter((x) => x.slug === slug).map((x) => localizeCondition(x, lang))
  );
  const treatments = raw.treatmentSlugs.flatMap((slug) =>
    TREATMENTS.filter((t) => t.slug === slug && t.base === "treatments").map((t) => localizeTreatment(t, lang))
  );
  const otherCategories = HEALTH_CATEGORIES.filter((x) => x.slug !== raw.slug).map((x) => localizeCategory(x, lang));

  return (
    <main id="main">
      <LanguageTitleSync title={c.seoTitle} />
      <div className="relative overflow-hidden bg-forest-950 text-cream-50">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-saffron-500/20 blur-[100px]" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-28 sm:px-6 sm:pt-32">
          <p className="eyebrow flex items-center gap-2 text-saffron-300">
            <Icon className="h-4 w-4" aria-hidden /> {ui.catEyebrow}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] font-light leading-tight">
            {c.title}
            {ui.catH1Suffix}
          </h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-cream-100/80">{c.seoDescription}</p>
          <p className="mt-3 text-[12.5px] text-saffron-200/75">{ui.catMeta}</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <Breadcrumbs
          items={[
            { label: ui.homeCrumb, href: "/" },
            { label: ui.hubCrumb, href: "/health-concerns" },
            { label: c.title },
          ]}
        />
      </div>

      <div className="mx-auto max-w-4xl space-y-12 px-4 pb-16 sm:px-6">
        <AuthorBox date="pending" />

        <section aria-labelledby="intro-h" className="space-y-4">
          <h2 id="intro-h" className="font-display text-[26px] text-forest-950">
            {ui.understandingTitle(c.title)}
          </h2>
          <p className="text-[15px] leading-[1.8] text-forest-900/80">{c.intro}</p>
        </section>

        <AppointmentCta compact title={ui.compactCtaTitle} body={ui.compactCtaBody} />

        <section aria-labelledby="approach-h" className="space-y-4">
          <h2 id="approach-h" className="font-display text-[26px] text-forest-950">
            {ui.approachTitle}
          </h2>
          <ul className="space-y-3">
            {c.approach.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-forest-900/80">
                <Check className="mt-1 h-4 w-4 shrink-0 text-forest-600" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="concerns-h" className="space-y-4">
          <h2 id="concerns-h" className="font-display text-[26px] text-forest-950">
            {ui.concernsTitle}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {c.concerns.map((item) => (
              <li
                key={item}
                className="rounded-full border border-saffron-500/25 bg-cream-100 px-3.5 py-1.5 text-[13.5px] text-forest-900/85"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {conditions.length > 0 && (
          <section aria-labelledby="guides-h" className="space-y-4">
            <h2 id="guides-h" className="font-display text-[26px] text-forest-950">
              {ui.guidesTitle}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {conditions.map((cond) => (
                <Link
                  key={cond.slug}
                  href={`/conditions/${cond.slug}`}
                  className="group rounded-2xl border border-forest-900/10 bg-white p-5 transition-all hover:border-saffron-500/50 hover:shadow-luxe"
                >
                  <span className="block font-display text-[18px] text-forest-950 group-hover:text-saffron-700">
                    {cond.title}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[13.5px] text-forest-800/65">{cond.seoDescription}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {treatments.length > 0 && (
          <section aria-labelledby="treat-links-h" className="space-y-4">
            <h2 id="treat-links-h" className="font-display text-[26px] text-forest-950">
              {ui.treatmentsTitle}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {treatments.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${t.base}/${t.slug}`}
                  className="group rounded-2xl border border-forest-900/10 bg-cream-100 p-5 transition-all hover:border-saffron-500/50 hover:shadow-luxe"
                >
                  <span className="block font-display text-[18px] text-forest-950 group-hover:text-saffron-700">
                    {t.title}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-[13.5px] text-forest-800/65">{t.seoDescription}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="faq-h" className="space-y-4">
          <h2 id="faq-h" className="font-display text-[26px] text-forest-950">
            {ui.faqTitle}
          </h2>
          <div className="space-y-3">
            {c.faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-forest-900/10 bg-white p-5">
                <summary className="cursor-pointer list-none pr-6 font-medium text-[15.5px] text-forest-950">{f.q}</summary>
                <p className="mt-3 text-[14.5px] leading-relaxed text-forest-800/80">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <MedicalDisclaimer />
        <DoctorHelp />
        <AppointmentCta />

        <section aria-labelledby="other-h" className="space-y-4">
          <h2 id="other-h" className="font-display text-[22px] text-forest-950">
            {ui.otherTitle}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {otherCategories.map((o) => (
              <Link
                key={o.slug}
                href={`/health-concerns/${o.slug}`}
                className="rounded-2xl border border-forest-900/10 bg-cream-100 p-4 transition-all hover:border-saffron-500/50"
              >
                <span className="block font-medium text-forest-950">{o.title}</span>
                <span className="mt-1 block text-[13px] text-forest-800/65">{o.navHint}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
