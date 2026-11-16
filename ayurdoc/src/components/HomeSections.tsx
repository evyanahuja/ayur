"use client";

/* Homepage sections (SSR-rendered in English by default, dynamically switches to HI/MR/GU).
   Every section carries the clinic's signature ScrollMandala backdrop for cohesive visual flow. */
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  Clock,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";
import { ARTICLES } from "@/content/articles";
import { PUBLISHED_CONDITIONS } from "@/content/registry";
import { HOME_CONCERN_CARDS, HOME_TREATMENT_CARDS } from "@/content/categories";
import {
  CLINIC_ADDRESS_FULL,
  CLINIC_EMAIL,
  CLINIC_MAPS_URL,
  CLINIC_PHONE_DISPLAY,
  CLINIC_PHONE_HREF,
  waLink,
} from "@/seo/config";
import { CATEGORY_ICONS } from "@/components/Conversion";
import { SectionMandalas } from "@/components/ScrollMandala";
import { useLanguage } from "@/i18n/LanguageContext";
import { useExpansion } from "@/i18n/expansion";
import { localizeArticle, localizeCondition } from "@/i18n/contentTranslations";

const POPULAR_GUIDE_SLUGS = [
  "constipation-children",
  "poor-appetite-children",
  "speech-delay-in-children",
  "adhd-in-children",
  "frequent-colds-cough-children",
  "sleep-problems-children",
];

const WHY_ICONS = [Stethoscope, Users, ShieldCheck, ClipboardList, HeartHandshake, Video];

export function ConcernCards() {
  const { lang } = useLanguage();
  const h = useExpansion(lang).home;

  return (
    <section aria-labelledby="concerns-h" className="mandala-section relative overflow-hidden py-12 sm:py-14">
      <SectionMandalas id="concerns" palette="lotus" side="right" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="eyebrow text-center text-saffron-700">{h.concernsEyebrow}</p>
        <h2 id="concerns-h" className="mt-2 text-center font-display text-[30px] leading-tight text-forest-950 sm:text-[36px]">
          {h.concernsTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[14.5px] leading-relaxed text-forest-800/75">
          {h.concernsDesc}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_CONCERN_CARDS.map((card) => {
            const Icon = CATEGORY_ICONS[card.icon];
            const tr = h.concernCards[card.slug];
            const title = tr?.title ?? card.title;
            const desc = tr?.desc ?? card.desc;
            return (
              <Link
                key={card.slug}
                href={`/health-concerns/${card.slug}`}
                className="group flex h-full flex-col rounded-3xl border border-forest-900/10 bg-white/92 backdrop-blur-sm p-6 transition-all hover:border-saffron-500/50 hover:bg-white hover:shadow-luxe"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-950 text-saffron-300">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="mt-4 font-display text-[21px] text-forest-950">{title}</span>
                <span className="mt-2 text-[14px] leading-relaxed text-forest-800/75">{desc}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13.5px] font-semibold text-forest-800">
                  {h.concernsExplorePrefix} {title}{" "}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-6 text-center text-[14px]">
          <Link href="/health-concerns" className="font-semibold text-saffron-700 hover:text-forest-950">
            {h.concernsViewAll}
          </Link>
        </p>
      </div>
    </section>
  );
}

export function PopularGuides() {
  const { lang } = useLanguage();
  const h = useExpansion(lang).home;
  const guides = POPULAR_GUIDE_SLUGS.flatMap((slug) => PUBLISHED_CONDITIONS.filter((c) => c.slug === slug));
  if (!guides.length) return null;

  return (
    <section aria-labelledby="guides-h" className="mandala-section relative overflow-hidden py-12 sm:py-14">
      <SectionMandalas id="popular-guides" palette="lotus" side="left" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="eyebrow text-center text-saffron-700">{h.guidesEyebrow}</p>
        <h2 id="guides-h" className="mt-2 text-center font-display text-[30px] text-forest-950 sm:text-[36px]">
          {h.guidesTitle}
        </h2>
        <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((raw) => {
            const guide = localizeCondition(raw, lang);
            return (
              <Link
                key={guide.slug}
                href={`/conditions/${guide.slug}`}
                className="group rounded-2xl border border-forest-900/10 bg-white/92 backdrop-blur-sm p-5 transition-all hover:border-saffron-500/50 hover:bg-white hover:shadow-luxe"
              >
                <span className="block font-display text-[19px] text-forest-950 group-hover:text-saffron-700">{guide.title}</span>
                <span className="mt-1 line-clamp-2 block text-[13px] text-forest-800/70">{guide.seoDescription}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-forest-800">
                  {h.readGuide} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function TreatmentCards() {
  const { lang } = useLanguage();
  const h = useExpansion(lang).home;

  return (
    <section aria-labelledby="treat-h" className="mandala-section relative overflow-hidden bg-cream-100/60 py-12 sm:py-14">
      <SectionMandalas id="treatments" palette="marigold" side="right" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="eyebrow text-center text-saffron-700">{h.treatEyebrow}</p>
        <h2 id="treat-h" className="mt-2 text-center font-display text-[30px] leading-tight text-forest-950 sm:text-[36px]">
          {h.treatTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[14.5px] leading-relaxed text-forest-800/75">
          {h.treatDesc}
        </p>
        <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_TREATMENT_CARDS.map((item) => {
            const tr = h.treatmentCards[item.slug];
            return (
              <Link
                key={item.slug}
                href={`/treatments/${item.slug}`}
                className="group rounded-2xl border border-forest-900/10 bg-white/92 backdrop-blur-sm p-5 transition-all hover:border-saffron-500/50 hover:bg-white hover:shadow-luxe"
              >
                <span className="block font-display text-[18px] text-forest-950 group-hover:text-saffron-700">
                  {tr?.title ?? item.title}
                </span>
                <span className="mt-1.5 block text-[13.5px] leading-relaxed text-forest-800/75">
                  {tr?.desc ?? item.desc}
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-6 text-center text-[14px]">
          <Link href="/treatments" className="font-semibold text-saffron-700 hover:text-forest-950">
            {h.treatExploreAll}
          </Link>
        </p>
      </div>
    </section>
  );
}

export function ConsultationSteps() {
  const { lang } = useLanguage();
  const h = useExpansion(lang).home;

  return (
    <section id="method" aria-labelledby="steps-h" className="mandala-section relative overflow-hidden scroll-mt-28 py-12 sm:py-14">
      <SectionMandalas id="steps" palette="peacock" side="left" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="eyebrow text-center text-saffron-700">{h.stepsEyebrow}</p>
        <h2 id="steps-h" className="mt-2 text-center font-display text-[30px] leading-tight text-forest-950 sm:text-[36px]">
          {h.stepsTitle}
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {h.steps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col rounded-3xl border border-forest-900/10 bg-white/92 backdrop-blur-sm p-6 shadow-sm transition-shadow hover:shadow-luxe"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-forest-950 font-sans text-[13px] font-bold tracking-wider text-saffron-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-[19.5px] leading-snug text-forest-950">{step.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.68] text-forest-800/78">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function WhyChoose() {
  const { lang } = useLanguage();
  const h = useExpansion(lang).home;

  return (
    <section aria-labelledby="why-h" className="mandala-section relative overflow-hidden bg-forest-950 py-12 text-cream-50 sm:py-14">
      <SectionMandalas id="why-choose" palette="marigold" side="right" dark />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="eyebrow text-center text-saffron-300">{h.whyEyebrow}</p>
        <h2 id="why-h" className="mt-2 text-center font-display text-[30px] leading-tight sm:text-[36px]">
          {h.whyTitle}
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {h.whyPoints.map((point, idx) => {
            const Icon = WHY_ICONS[idx] ?? ShieldCheck;
            return (
              <div key={point.title} className="rounded-3xl border border-white/12 bg-forest-950/55 backdrop-blur-sm p-6">
                <Icon className="h-6 w-6 text-saffron-300" aria-hidden />
                <h3 className="mt-4 font-display text-[19px]">{point.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-cream-100/80">{point.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ArticlePreview() {
  const { lang } = useLanguage();
  const h = useExpansion(lang).home;
  const articles = ["joint-pain-osteoarthritis-ayurveda", "detox-myths-ayurveda", "growth-chart-reading-guide"]
    .flatMap((slug) => ARTICLES.filter((a) => a.slug === slug));
  if (!articles.length) return null;

  return (
    <section aria-labelledby="art-h" className="mandala-section relative overflow-hidden bg-cream-50/60 py-12 sm:py-14">
      <SectionMandalas id="articles-home" palette="peacock" side="right" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="eyebrow text-center text-saffron-700">{h.articlesEyebrow}</p>
        <h2 id="art-h" className="mt-2 text-center font-display text-[30px] text-forest-950 sm:text-[36px]">
          {h.articlesTitle}
        </h2>
        <div className="mt-6 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((raw) => {
            const article = localizeArticle(raw, lang);
            return (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="rounded-2xl border border-forest-900/10 bg-white/92 backdrop-blur-sm p-5 transition-all hover:border-saffron-500/50 hover:bg-white hover:shadow-luxe"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-saffron-700">
                  {article.readMins} {h.minRead}
                </span>
                <span className="mt-1 block font-display text-[18px] text-forest-950">{article.title}</span>
              </Link>
            );
          })}
        </div>
        <p className="mt-5 text-center text-[14px]">
          <Link href="/articles" className="font-semibold text-saffron-700 hover:text-forest-950">
            {h.browseArticles}
          </Link>
        </p>
      </div>
    </section>
  );
}

export function HomeFaq() {
  const { lang } = useLanguage();
  const h = useExpansion(lang).home;

  return (
    <section aria-labelledby="faq-home-h" className="mandala-section relative overflow-hidden py-12 sm:py-14">
      <SectionMandalas id="faq-home" palette="lotus" side="right" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="eyebrow text-center text-saffron-700">{h.faqEyebrow}</p>
        <h2 id="faq-home-h" className="mt-2 text-center font-display text-[30px] text-forest-950 sm:text-[36px]">
          {h.faqTitle}
        </h2>
        <div className="mt-8 space-y-3">
          {h.faqs.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-forest-900/10 bg-white/92 backdrop-blur-sm p-5">
              <summary className="cursor-pointer list-none pr-6 font-medium text-[15.5px] text-forest-950">{item.q}</summary>
              <p className="mt-3 text-[14.5px] leading-relaxed text-forest-800/80">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ClinicLocation() {
  const { lang } = useLanguage();
  const h = useExpansion(lang).home;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(CLINIC_ADDRESS_FULL)}&output=embed`;

  return (
    <section id="clinic" aria-labelledby="clinic-h" className="mandala-section relative overflow-hidden scroll-mt-28 py-12 sm:py-14">
      <SectionMandalas id="clinic" palette="peacock" side="right" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow text-center text-saffron-700">{h.clinicEyebrow}</p>
        <h2 id="clinic-h" className="mt-2 text-center font-display text-[30px] leading-tight text-forest-950 sm:text-[36px]">
          {h.clinicTitle}
        </h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="space-y-4 rounded-3xl border border-forest-900/10 bg-white/92 backdrop-blur-sm p-6">
            <p className="font-display text-[22px] text-forest-950">{h.clinicName}</p>
            <p className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-forest-800/80">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron-700" aria-hidden />
              <span>{h.clinicAddress}</span>
            </p>
            <p className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-forest-800/80">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-saffron-700" aria-hidden />
              <span>{h.clinicHours}</span>
            </p>
            <p className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-forest-800/80">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-saffron-700" aria-hidden />
              <a href={`tel:${CLINIC_PHONE_HREF}`} className="hover:text-forest-950 hover:underline">
                {CLINIC_PHONE_DISPLAY}
              </a>
            </p>
            <p className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-forest-800/80">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-saffron-700" aria-hidden />
              <a href={`mailto:${CLINIC_EMAIL}`} className="break-all hover:text-forest-950 hover:underline">
                {CLINIC_EMAIL}
              </a>
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={CLINIC_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-forest-950 px-5 py-2.5 text-[13.5px] font-medium text-cream-50 hover:bg-forest-900"
              >
                <MapPin className="h-4 w-4 text-saffron-400" aria-hidden /> {h.getDirections}
              </a>
              <a
                href={waLink(h.waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-forest-900/15 bg-white px-5 py-2.5 text-[13.5px] font-medium text-forest-900 hover:bg-forest-50"
              >
                <MessageCircle className="h-4 w-4" aria-hidden /> {h.whatsappEnquiry}
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-forest-900/15 bg-white px-5 py-2.5 text-[13.5px] font-medium text-forest-900 hover:bg-forest-50"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden /> {h.bookAppointment}
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-luxe">
            <iframe
              title={h.mapTitle}
              src={mapSrc}
              width="100%"
              height="380"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
