"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Baby,
  Brain,
  Leaf,
  BookOpen,
  MapPin,
  Stethoscope,
  MessageCircleQuestion,
  Check,
  AlertTriangle,
  HeartHandshake,
  ChevronDown,
  Phone,
  Mail,
  ExternalLink,
  CalendarCheck,
  Home,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { SITE, IMAGES, telLink, mailLink } from "@/content/site";
import { CLINIC_MAPS_URL } from "@/seo/config";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { DoctorIntro } from "@/components/DoctorIntro";
import { Specialties } from "@/components/Specialties";
import { MethodShowcase } from "@/components/MethodShowcase";
import { Benefits } from "@/components/Benefits";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { BookingSection } from "@/components/BookingSection";
import { Breadcrumbs, AuthorBox, MedicalDisclaimer, CtaBand, LanguageTitleSync } from "@/components/seo";
import { CONDITIONS_1, type ConditionPage } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS, type TreatmentPage } from "@/content/treatments";
import { ARTICLES, type Article } from "@/content/articles";
import { LOCAL_PAGES, type LocalPage } from "@/content/local";
import { useLanguage } from "@/i18n/LanguageContext";
import { usePagesDict } from "@/i18n/pagesDictionary";
import {
  trText,
  localizeCondition,
  localizeTreatment,
  localizeArticle,
  localizeLocalPage,
} from "@/i18n/contentTranslations";

export const ALL_CONDITIONS = [...CONDITIONS_1, ...CONDITIONS_2];

const FEATURED_CONDITIONS = [
  ...CONDITIONS_1.slice(0, 3),
  ...CONDITIONS_2.filter((c) =>
    ["speech-delay-in-children", "poor-appetite-children", "constipation-children"].includes(c.slug)
  ),
];

const CONDITION_CATS = [
  "Development & Behaviour",
  "Neurological",
  "Growth & Nutrition",
  "Respiratory & Immunity",
  "Digestion & Gut",
  "Sleep & Habits",
] as const;

/* ================= SHARED LAYOUT PRIMITIVES ================= */
function PageHero({
  eyebrow,
  h1,
  intro,
  meta,
  centered = false,
}: {
  eyebrow: string;
  h1: string;
  intro: string;
  meta?: string;
  centered?: boolean;
}) {
  return (
    <div className="relative overflow-hidden bg-forest-950 text-cream-50">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-saffron-500/20 blur-[100px]" aria-hidden />
      <div
        className={cn(
          "relative mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-10",
          centered ? "max-w-5xl text-center" : "max-w-4xl"
        )}
      >
        <p className="eyebrow text-saffron-300">{eyebrow}</p>
        <h1 className="mt-3 font-display font-light text-[clamp(2rem,5vw,3rem)] leading-tight">{h1}</h1>
        <p
          className={cn(
            "mt-3 text-[15px] text-cream-100/80 leading-relaxed",
            centered ? "max-w-3xl mx-auto" : "max-w-3xl"
          )}
        >
          {intro}
        </p>
        {meta && <p className="mt-3 text-[12.5px] text-saffron-200/75">{meta}</p>}
      </div>
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
      <p className="eyebrow text-saffron-700">{eyebrow}</p>
      <h2 id={`${id}-h`} className="mt-1.5 font-display text-[24px] sm:text-[26px] text-forest-950">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-[1.78] text-forest-900/80">{children}</div>
    </section>
  );
}

function BulletList({ items, icon = "check" }: { items: string[]; icon?: "check" | "alert" }) {
  return (
    <ul className="space-y-2 text-[14.5px] leading-relaxed text-forest-900/80">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          {icon === "alert" ? (
            <AlertTriangle className="w-4 h-4 text-clay-500 shrink-0 mt-1" />
          ) : (
            <Check className="w-4 h-4 text-forest-600 shrink-0 mt-1" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="divide-y divide-forest-900/10 rounded-2xl border border-forest-900/10 bg-white overflow-hidden">
      {faqs.map((f, idx) => {
        const isOpen = openIdx === idx;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 font-medium text-[15px] text-forest-950 hover:bg-forest-50/50 transition-colors"
            >
              <span>{f.q}</span>
              <ChevronDown
                className={cn("w-4 h-4 shrink-0 text-saffron-700 transition-transform", isOpen && "rotate-180")}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 text-[14.5px] leading-relaxed text-forest-800/80">{f.a}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RelatedGrid({
  conditions = [],
  treatments = [],
  articles = [],
}: {
  conditions?: string[];
  treatments?: string[];
  articles?: string[];
}) {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);

  const cards: { kind: string; label: string; href: string }[] = [
    ...conditions
      .map((slug) => ALL_CONDITIONS.find((c) => c.slug === slug))
      .filter((x): x is ConditionPage => Boolean(x))
      .map((c) => ({
        kind: p.templates.relatedKindCondition,
        label: trText(c.title, lang),
        href: `/conditions/${c.slug}/`,
      })),
    ...treatments
      .map((slug) => TREATMENTS.find((t) => t.slug === slug))
      .filter((x): x is TreatmentPage => Boolean(x))
      .map((t) => ({
        kind: p.templates.relatedKindTreatment,
        label: trText(t.title, lang),
        href: `/${t.base}/${t.slug}/`,
      })),
    ...articles
      .map((slug) => ARTICLES.find((a) => a.slug === slug))
      .filter((x): x is Article => Boolean(x))
      .map((a) => ({
        kind: p.templates.relatedKindArticle,
        label: trText(a.title, lang),
        href: `/articles/${a.slug}/`,
      })),
  ];

  if (!cards.length) return null;

  return (
    <section>
      <h2 className="font-display text-[22px] text-forest-950">{p.templates.relatedTitle}</h2>
      <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-forest-900/10 bg-white p-4 hover:border-saffron-500/50 hover:shadow-luxe transition-all"
          >
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-saffron-700">{c.kind}</span>
            <span className="mt-1 flex items-center justify-between gap-2 font-medium text-[14.5px] text-forest-950">
              {c.label}
              <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function StaticShell({
  eyebrow,
  h1,
  intro,
  crumbs,
  children,
}: {
  eyebrow: string;
  h1: string;
  intro: string;
  crumbs: { label: string; href?: string }[];
  children: ReactNode;
}) {
  return (
    <main id="main">
      <PageHero eyebrow={eyebrow} h1={h1} intro={intro} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
        <Breadcrumbs items={crumbs} />
      </div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 space-y-10">{children}</div>
    </main>
  );
}

/* ================= 1. HOME CONTENT ================= */
export function HomeContent() {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);
  const CARD_ICONS = [Baby, Leaf, BookOpen, MapPin];

  return (
    <main id="main" className="relative bg-white">
      <Hero />
      <SocialProof />

      {/* Internal linking hub — Explore by child's concern */}
      <section aria-labelledby="lib-h" className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <p className="eyebrow text-saffron-700 text-center">{p.homeHubs.exploreEyebrow}</p>
        <h2 id="lib-h" className="mt-2 font-display text-[30px] sm:text-[36px] text-center text-forest-950">
          {p.homeHubs.exploreTitle}
        </h2>
        <p className="mt-2 text-center text-[14.5px] text-forest-800/65 max-w-2xl mx-auto">
          {p.homeHubs.exploreDesc}
        </p>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURED_CONDITIONS.map((raw) => {
            const c = localizeCondition(raw, lang);
            return (
              <Link
                key={c.slug}
                href={`/conditions/${c.slug}/`}
                className="group rounded-2xl border border-forest-900/10 bg-white p-5 hover:border-saffron-500/50 hover:shadow-luxe transition-all"
              >
                <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-saffron-700">
                  {p.categories[raw.category] ?? raw.category}
                </span>
                <span className="mt-1 block font-display text-[19px] text-forest-950">{c.title}</span>
                <span className="mt-1 block text-[13px] text-forest-800/65 line-clamp-2">{c.intro}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-forest-800">
                  {p.homeHubs.readGuide}{" "}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {p.homeHubs.cards.map((card, idx) => {
            const Icon = CARD_ICONS[idx] ?? Baby;
            return (
              <Link
                key={card.to}
                href={card.to}
                className="rounded-2xl bg-forest-950 text-cream-50 p-4 flex items-center gap-3 hover:bg-forest-900 transition-colors"
              >
                <Icon className="w-5 h-5 text-saffron-300 shrink-0" />
                <span>
                  <span className="block font-medium text-[14.5px]">{card.t}</span>
                  <span className="block text-[12px] text-cream-100/65">{card.d}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <DoctorIntro />
      <Specialties />

      {/* Treatments preview */}
      <section aria-labelledby="treat-h" className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <p className="eyebrow text-saffron-700 text-center">{p.homeHubs.treatEyebrow}</p>
        <h2 id="treat-h" className="mt-2 font-display text-[30px] text-center text-forest-950">
          {p.homeHubs.treatTitle}
        </h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TREATMENTS.slice(0, 4).map((raw) => {
            const tItem = localizeTreatment(raw, lang);
            return (
              <Link
                key={tItem.slug}
                href={`/${tItem.base}/${tItem.slug}/`}
                className="rounded-2xl border border-forest-900/10 bg-cream-100 p-5 hover:border-saffron-500/50 hover:shadow-luxe transition-all"
              >
                <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-saffron-700">
                  {p.categories[raw.category] ?? raw.category}
                </span>
                <span className="mt-1 block font-display text-[18px] text-forest-950">{tItem.title}</span>
                <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-forest-800">
                  {p.homeHubs.learnMore} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
        <p className="mt-4 text-center">
          <Link href="/treatments/" className="text-[14px] font-semibold text-saffron-700 hover:text-forest-900">
            {p.homeHubs.allTreatments.replace("{count}", String(TREATMENTS.length))}
          </Link>
        </p>
      </section>

      <MethodShowcase />
      <Benefits />

      {/* Articles preview */}
      <section aria-labelledby="art-h" className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <p className="eyebrow text-saffron-700 text-center">{p.homeHubs.artEyebrow}</p>
        <h2 id="art-h" className="mt-2 font-display text-[30px] text-center text-forest-950">
          {p.homeHubs.artTitle}
        </h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ARTICLES.slice(0, 3).map((raw) => {
            const art = localizeArticle(raw, lang);
            return (
              <Link
                key={art.slug}
                href={`/articles/${art.slug}/`}
                className="rounded-2xl border border-forest-900/10 bg-white p-5 hover:border-saffron-500/50 hover:shadow-luxe transition-all"
              >
                <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-saffron-700">
                  {p.categories[raw.category] ?? raw.category} • {art.readMins} {p.homeHubs.minRead}
                </span>
                <span className="mt-1 block font-display text-[18px] text-forest-950">{art.title}</span>
              </Link>
            );
          })}
        </div>
        <p className="mt-4 text-center">
          <Link href="/articles/" className="text-[14px] font-semibold text-saffron-700 hover:text-forest-900">
            {p.homeHubs.browseArticles.replace("{count}", String(ARTICLES.length))}
          </Link>
        </p>
      </section>

      <Testimonials />
      <Pricing />
      <FAQ />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <AuthorBox />
      </div>
      <BookingSection />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
        <CtaBand />
      </div>
    </main>
  );
}

/* ================= 2. HUB PAGES ================= */
export function ConditionsIndexView() {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);

  return (
    <main id="main">
      <LanguageTitleSync title={`${p.hubs.conditionsH1} | ${SITE.doctorName}`} />
      <PageHero
        eyebrow={p.hubs.conditionsEyebrow}
        h1={p.hubs.conditionsH1}
        intro={p.hubs.conditionsIntro}
        centered
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: p.hubs.homeCrumb, href: "/" }, { label: p.hubs.conditionsCrumb }]} />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 space-y-10">
        {CONDITION_CATS.map((cat) => (
          <section key={cat} aria-labelledby={cat}>
            <h2 id={cat} className="font-display text-[24px] text-forest-950 flex items-center gap-2">
              {cat === "Development & Behaviour" ? (
                <Brain className="w-5 h-5 text-saffron-700" />
              ) : cat === "Neurological" ? (
                <Stethoscope className="w-5 h-5 text-saffron-700" />
              ) : (
                <Baby className="w-5 h-5 text-saffron-700" />
              )}
              {p.categories[cat] ?? cat}
            </h2>
            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ALL_CONDITIONS.filter((c) => c.category === cat).map((raw) => {
                const c = localizeCondition(raw, lang);
                return (
                  <Link
                    key={c.slug}
                    href={`/conditions/${c.slug}/`}
                    className="group rounded-2xl border border-forest-900/10 bg-white p-5 hover:border-saffron-500/50 hover:shadow-luxe transition-all"
                  >
                    <span className="font-display text-[18px] text-forest-950 group-hover:text-saffron-700 transition-colors">
                      {c.title}
                    </span>
                    <span className="mt-1 block text-[13px] text-forest-800/65 line-clamp-2">
                      {c.seoDescription}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-forest-800">
                      {p.homeHubs.readGuide} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
        <AuthorBox />
        <MedicalDisclaimer />
        <CtaBand />
      </div>
    </main>
  );
}

export function TreatmentsIndexView() {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);

  const groups = [
    {
      ...p.hubs.treatGroups[0],
      slugs: TREATMENTS.filter((t) => t.category === "Suvarnaprashan").map((t) => t.slug),
    },
    {
      ...p.hubs.treatGroups[1],
      slugs: TREATMENTS.filter((t) => t.category === "Panchakarma" || t.category === "Therapies").map((t) => t.slug),
    },
    {
      ...p.hubs.treatGroups[2],
      slugs: TREATMENTS.filter((t) => t.category === "Consultation").map((t) => t.slug),
    },
  ];

  return (
    <main id="main">
      <LanguageTitleSync title={`${p.hubs.treatmentsH1} | ${SITE.doctorName}`} />
      <PageHero
        eyebrow={p.hubs.treatmentsEyebrow}
        h1={p.hubs.treatmentsH1}
        intro={p.hubs.treatmentsIntro}
        centered
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: p.hubs.homeCrumb, href: "/" }, { label: p.hubs.treatmentsCrumb }]} />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 space-y-10">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="font-display text-[24px] text-forest-950 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-saffron-700" />
              {g.title}
            </h2>
            <p className="mt-1 text-[14px] text-forest-800/65">{g.desc}</p>
            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {g.slugs.map((slug) => {
                const raw = TREATMENTS.find((x) => x.slug === slug)!;
                const item = localizeTreatment(raw, lang);
                return (
                  <Link
                    key={slug}
                    href={`/${item.base}/${slug}/`}
                    className="group rounded-2xl border border-forest-900/10 bg-white p-5 hover:border-saffron-500/50 hover:shadow-luxe transition-all"
                  >
                    <span className="font-display text-[18px] text-forest-950 group-hover:text-saffron-700">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-[13px] text-forest-800/65 line-clamp-2">
                      {item.seoDescription}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-forest-800">
                      {p.homeHubs.readGuide} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
        <AuthorBox />
        <MedicalDisclaimer />
        <CtaBand />
      </div>
    </main>
  );
}

export function ArticlesIndexView() {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);

  return (
    <main id="main">
      <LanguageTitleSync title={`${p.hubs.articlesH1} | ${SITE.doctorName}`} />
      <PageHero
        eyebrow={p.hubs.articlesEyebrow}
        h1={p.hubs.articlesH1}
        intro={p.hubs.articlesIntro}
        centered
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: p.hubs.homeCrumb, href: "/" }, { label: p.hubs.articlesCrumb }]} />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ARTICLES.map((raw) => {
            const a = localizeArticle(raw, lang);
            return (
              <Link
                key={a.slug}
                href={`/articles/${a.slug}/`}
                className="group rounded-2xl border border-forest-900/10 bg-white p-5 hover:border-saffron-500/50 hover:shadow-luxe transition-all"
              >
                <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-saffron-700">
                  {p.categories[raw.category] ?? raw.category} • {a.readMins} {p.homeHubs.minRead}
                </span>
                <span className="mt-1.5 block font-display text-[18px] leading-snug text-forest-950 group-hover:text-saffron-700">
                  {a.title}
                </span>
                <span className="mt-1 block text-[13px] text-forest-800/65 line-clamp-2">{a.intro}</span>
              </Link>
            );
          })}
        </div>
        <AuthorBox />
        <CtaBand title={p.hubs.articlesCtaTitle} body={p.hubs.articlesCtaBody} />
      </div>
    </main>
  );
}

export function ChildHealthHubView() {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);
  const PATH_ICONS = [Baby, Brain, Stethoscope, BookOpen];

  return (
    <main id="main">
      <LanguageTitleSync title={`${p.hubs.childHealthH1} | ${SITE.doctorName}`} />
      <PageHero
        eyebrow={p.hubs.childHealthEyebrow}
        h1={p.hubs.childHealthH1}
        intro={p.hubs.childHealthIntro}
        centered
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: p.hubs.homeCrumb, href: "/" }, { label: p.hubs.childHealthCrumb }]} />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 space-y-8">
        <div className="grid md:grid-cols-2 gap-4">
          {p.hubs.childHealthPaths.map((pathway, idx) => {
            const Icon = PATH_ICONS[idx] ?? Baby;
            return (
              <div key={pathway.title} className="rounded-3xl border border-forest-900/10 bg-white p-6">
                <Icon className="w-6 h-6 text-saffron-700" />
                <h2 className="mt-2 font-display text-[22px] text-forest-950">{pathway.title}</h2>
                <p className="text-[14px] text-forest-800/65">{pathway.desc}</p>
                <ul className="mt-3 space-y-1.5">
                  {pathway.links.map(([label, href]) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-[14px] font-medium text-forest-800 hover:text-saffron-700 flex items-center gap-1.5"
                      >
                        {label} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <AuthorBox />
        <CtaBand />
      </div>
    </main>
  );
}

export function FaqHubView() {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);

  return (
    <main id="main">
      <LanguageTitleSync title={`${p.hubs.faqH1} | ${SITE.doctorName}`} />
      <PageHero eyebrow={p.hubs.faqEyebrow} h1={p.hubs.faqH1} intro={p.hubs.faqIntro} centered />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: p.hubs.homeCrumb, href: "/" }, { label: p.hubs.faqCrumb }]} />
      </div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 space-y-8">
        {p.hubs.faqGroups.map((g) => (
          <section key={g.h}>
            <h2 className="font-display text-[22px] text-forest-950 flex items-center gap-2 mb-3">
              <MessageCircleQuestion className="w-5 h-5 text-saffron-700" />
              {g.h}
            </h2>
            <FaqAccordion faqs={g.faqs} />
          </section>
        ))}
        <AuthorBox />
        <MedicalDisclaimer />
        <CtaBand />
      </div>
    </main>
  );
}

/* ================= 3. STATIC PAGES ================= */
export function AboutDoctorView() {
  const { lang, t } = useLanguage();
  const p = usePagesDict(lang);
  const s = p.staticPages.about;

  return (
    <>
      <LanguageTitleSync title={s.seoTitle} />
      <StaticShell
        eyebrow={s.eyebrow}
        h1={s.h1}
        intro={s.intro}
        crumbs={[{ label: p.hubs.homeCrumb, href: "/" }, { label: s.crumb }]}
      >
        <div className="rounded-3xl border border-forest-900/10 bg-white p-6 sm:p-8 grid md:grid-cols-[220px_1fr] gap-6 items-start">
          <Image
            src={IMAGES.doctorPortrait}
            alt={t.site.doctorName}
            width={400}
            height={520}
            className="w-44 h-56 md:w-full md:h-64 object-cover object-top rounded-2xl shadow-md"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[13px] font-semibold tracking-wide text-saffron-700 uppercase">
                {t.site.qualification}
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[12px] font-semibold text-emerald-900">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {s.regBadgeLabel}
              </span>
            </div>
            <ul className="mt-4 space-y-2.5 text-[14.5px] text-forest-900/85">
              {s.qualsList.map((item) => (
                <li key={item} className="flex gap-2.5">
                  <Check className="w-4 h-4 mt-1 text-forest-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <section>
          <h2 className="font-display text-[24px] text-forest-950">{s.scopeHeading}</h2>
          <ul className="mt-3 space-y-2.5 text-[14.5px] leading-relaxed text-forest-900/80">
            {s.scopeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <AuthorBox />
        <MedicalDisclaimer />
        <CtaBand />
      </StaticShell>
    </>
  );
}

export function ContactPageView() {
  const { lang, t } = useLanguage();
  const p = usePagesDict(lang);
  const s = p.staticPages.contact;

  const [form, setForm] = useState({
    parentName: "",
    phone: "",
    childName: "",
    childAge: "",
    mode: "in_clinic",
    concern: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [doneRef, setDoneRef] = useState<string | null>(null);

  const update = (k: keyof typeof form, v: string) => setForm((prev) => ({ ...prev, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (form.parentName.trim().length < 2) errs.parentName = s.nameErr;
    if (!/^[+\d][\d\s\-()]{6,18}$/.test(form.phone.trim())) errs.phone = s.phoneErr;
    if (form.concern.trim().length < 5) errs.concern = s.concernErr;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: form.parentName.trim(),
          phone: form.phone.trim(),
          childName: form.childName.trim() || "Child",
          childAge: form.childAge.trim() || "Not specified",
          concernCategory: "general",
          symptoms: form.concern.trim(),
          preferredMode: form.mode === "online" ? "online" : "in_clinic",
          website: form.website,
        }),
      });
      const json = await res.json().catch(() => ({}));
      setDoneRef(json?.ref || "Submitted");
    } catch {
      setDoneRef("Submitted");
    } finally {
      setSubmitting(false);
    }
  };

  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `${t.site.whatsappMessage} (${form.parentName ? `${form.parentName} — ${form.concern}` : ""})`
  )}`;

  return (
    <>
      <LanguageTitleSync title={s.seoTitle} />
      <StaticShell
        eyebrow={s.eyebrow}
        h1={s.h1}
        intro={s.intro}
        crumbs={[{ label: p.hubs.homeCrumb, href: "/" }, { label: s.crumb }]}
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href={telLink}
            className="rounded-2xl border border-forest-900/10 bg-white p-4 flex gap-3 hover:border-saffron-500/50 transition-colors"
          >
            <Phone className="w-5 h-5 text-saffron-700 mt-0.5 shrink-0" />
            <span>
              <strong className="block text-forest-950">{s.callTitle}</strong>
              <span className="text-[14px] text-forest-800/70">
                {SITE.phoneDisplay} • {t.site.hours}
              </span>
            </span>
          </a>

          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t.site.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-forest-900/10 bg-white p-4 flex gap-3 hover:border-saffron-500/50 transition-colors"
          >
            <Phone className="w-5 h-5 text-saffron-700 mt-0.5 shrink-0" />
            <span>
              <strong className="block text-forest-950">{s.waTitle}</strong>
              <span className="text-[14px] text-forest-800/70">{s.waSub}</span>
            </span>
          </a>

          <a
            href={CLINIC_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-forest-900/10 bg-white p-4 flex gap-3 hover:border-saffron-500/50 transition-colors"
          >
            <MapPin className="w-5 h-5 text-saffron-700 mt-0.5 shrink-0" />
            <span>
              <strong className="block text-forest-950">
                {s.dirTitle} <ExternalLink className="w-3.5 h-3.5 inline" />
              </strong>
              <span className="text-[14px] text-forest-800/70">{t.site.addressFull}</span>
            </span>
          </a>

          <a
            href={mailLink}
            className="rounded-2xl border border-forest-900/10 bg-white p-4 flex gap-3 hover:border-saffron-500/50 transition-colors"
          >
            <Mail className="w-5 h-5 text-saffron-700 mt-0.5 shrink-0" />
            <span>
              <strong className="block text-forest-950">{s.emailTitle}</strong>
              <span className="text-[14px] text-forest-800/70">{SITE.email}</span>
            </span>
          </a>
        </div>

        <section aria-labelledby="form-h" className="rounded-3xl border border-forest-900/10 bg-white p-5 sm:p-6">
          <h2 id="form-h" className="font-display text-[22px] text-forest-950 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-saffron-700" /> {s.formHeading}
          </h2>
          <p className="mt-1 text-[13px] text-forest-800/65">{s.formSub}</p>

          {doneRef ? (
            <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 p-5 space-y-3">
              <p className="text-[15px] font-medium text-emerald-950">
                {s.thankYou} {doneRef !== "Submitted" ? `(${doneRef})` : ""}.
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-forest-950 text-cream-50 px-5 py-2.5 text-[13.5px] font-medium"
              >
                {s.openWaBtn}
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-4 grid gap-4">
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={(e) => update("website", e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cf-name" className="text-[13px] font-semibold text-forest-900">
                    {s.nameLabel}
                  </label>
                  <input
                    id="cf-name"
                    value={form.parentName}
                    onChange={(e) => update("parentName", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-forest-900/15 px-3.5 py-2.5 text-[14px] bg-cream-50"
                    placeholder={s.namePh}
                    autoComplete="name"
                  />
                  {errors.parentName && (
                    <p className="mt-1 text-[12.5px] text-red-700" role="alert">
                      {errors.parentName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="cf-phone" className="text-[13px] font-semibold text-forest-900">
                    {s.phoneLabel}
                  </label>
                  <input
                    id="cf-phone"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-forest-900/15 px-3.5 py-2.5 text-[14px] bg-cream-50"
                    placeholder={s.phonePh}
                    inputMode="tel"
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-[12.5px] text-red-700" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="cf-cname" className="text-[13px] font-semibold text-forest-900">
                    {s.childNameLabel}
                  </label>
                  <input
                    id="cf-cname"
                    value={form.childName}
                    onChange={(e) => update("childName", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-forest-900/15 px-3.5 py-2.5 text-[14px] bg-cream-50"
                    placeholder={s.childNamePh}
                  />
                </div>
                <div>
                  <label htmlFor="cf-cage" className="text-[13px] font-semibold text-forest-900">
                    {s.childAgeLabel}
                  </label>
                  <input
                    id="cf-cage"
                    value={form.childAge}
                    onChange={(e) => update("childAge", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-forest-900/15 px-3.5 py-2.5 text-[14px] bg-cream-50"
                    placeholder={s.childAgePh}
                  />
                </div>
                <div>
                  <label htmlFor="cf-mode" className="text-[13px] font-semibold text-forest-900">
                    {s.modeLabel}
                  </label>
                  <select
                    id="cf-mode"
                    value={form.mode}
                    onChange={(e) => update("mode", e.target.value)}
                    className="mt-1 w-full rounded-xl border border-forest-900/15 px-3.5 py-2.5 text-[14px] bg-cream-50"
                  >
                    <option value="in_clinic">{s.modes[0]}</option>
                    <option value="online">{s.modes[1]}</option>
                    <option value="guidance">{s.modes[2]}</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="cf-concern" className="text-[13px] font-semibold text-forest-900">
                  {s.concernLabel}
                </label>
                <textarea
                  id="cf-concern"
                  value={form.concern}
                  onChange={(e) => update("concern", e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-xl border border-forest-900/15 px-3.5 py-2.5 text-[14px] bg-cream-50"
                  placeholder={s.concernPh}
                />
                {errors.concern && (
                  <p className="mt-1 text-[12.5px] text-red-700" role="alert">
                    {errors.concern}
                  </p>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-shine rounded-full bg-forest-950 text-cream-50 px-6 py-3 text-[14px] font-semibold hover:bg-forest-900 transition-colors disabled:opacity-60"
                >
                  {submitting ? s.submittingBtn : s.submitBtn}
                </button>
              </div>
            </form>
          )}
        </section>

        <MedicalDisclaimer />
      </StaticShell>
    </>
  );
}

export function PrivacyPageView() {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);
  const s = p.staticPages.privacy;

  return (
    <>
      <LanguageTitleSync title={s.seoTitle} />
      <StaticShell
        eyebrow={s.eyebrow}
        h1={s.h1}
        intro={s.intro}
        crumbs={[{ label: p.hubs.homeCrumb, href: "/" }, { label: s.crumb }]}
      >
        <div className="space-y-4 text-[14.5px] leading-relaxed text-forest-900/80">
          {s.items.map((it, idx) => (
            <p key={it.strong}>
              <strong className="text-forest-950">{it.strong}</strong> {it.body}
              {idx === 4 ? ` ${SITE.email} / ${SITE.phoneDisplay}` : ""}
            </p>
          ))}
        </div>
      </StaticShell>
    </>
  );
}

export function TermsPageView() {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);
  const s = p.staticPages.terms;

  return (
    <>
      <LanguageTitleSync title={s.seoTitle} />
      <StaticShell
        eyebrow={s.eyebrow}
        h1={s.h1}
        intro={s.intro}
        crumbs={[{ label: p.hubs.homeCrumb, href: "/" }, { label: s.crumb }]}
      >
        <div className="space-y-4 text-[14.5px] leading-relaxed text-forest-900/80">
          {s.items.map((it) => (
            <p key={it.strong}>
              <strong className="text-forest-950">{it.strong}</strong> {it.body}
            </p>
          ))}
        </div>
      </StaticShell>
    </>
  );
}

export function SitemapPageView() {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);
  const s = p.staticPages.sitemap;

  const groups = [
    { h: s.mainHeading, links: s.mainLinks },
    {
      h: s.condHeading,
      links: ALL_CONDITIONS.map((c) => ({
        label: trText(c.title, lang),
        href: `/conditions/${c.slug}/`,
      })),
    },
    {
      h: s.treatHeading,
      links: TREATMENTS.map((t) => ({
        label: trText(t.title, lang),
        href: `/${t.base}/${t.slug}/`,
      })),
    },
    {
      h: s.artHeading,
      links: ARTICLES.map((a) => ({
        label: trText(a.title, lang),
        href: `/articles/${a.slug}/`,
      })),
    },
    {
      h: s.localHeading,
      links: LOCAL_PAGES.map((l) => ({
        label: trText(l.title, lang),
        href: `/${l.slug}/`,
      })),
    },
    {
      h: s.legalHeading,
      links: [
        { label: p.footer.privacy, href: "/privacy-policy/" },
        { label: p.footer.terms, href: "/terms/" },
      ],
    },
  ];

  const totalPages = groups.reduce((acc, g) => acc + g.links.length, 0);

  return (
    <>
      <LanguageTitleSync title={s.seoTitle} />
      <StaticShell
        eyebrow={`${totalPages} ${s.pagesCountSuffix}`}
        h1={s.h1}
        intro={s.intro}
        crumbs={[{ label: p.hubs.homeCrumb, href: "/" }, { label: s.crumb }]}
      >
        {groups.map((g) => (
          <section key={g.h}>
            <h2 className="font-display text-[20px] text-forest-950">{g.h}</h2>
            <ul className="mt-2 grid sm:grid-cols-2 gap-1.5">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[14px] text-forest-800 hover:text-saffron-700 hover:underline underline-offset-4"
                  >
                    {l.label}
                  </Link>{" "}
                  <span className="text-[11.5px] text-forest-800/40 font-mono">{l.href}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </StaticShell>
    </>
  );
}

export function NotFoundView() {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);
  const s = p.staticPages.notFound;

  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-28 text-center">
      <LanguageTitleSync title={s.seoTitle} />
      <p className="eyebrow text-saffron-700">404</p>
      <h1 className="mt-2 font-display text-4xl text-forest-950">{s.h1}</h1>
      <p className="mt-3 text-forest-800/70">{s.desc}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-forest-950 text-cream-50 px-6 py-3 text-[14px] font-medium">
          {s.homeBtn}
        </Link>
        <Link
          href="/conditions/"
          className="rounded-full border border-forest-900/15 px-6 py-3 text-[14px] font-medium text-forest-950"
        >
          {s.condBtn}
        </Link>
        <Link
          href="/contact/"
          className="rounded-full border border-forest-900/15 px-6 py-3 text-[14px] font-medium text-forest-950"
        >
          {s.contactBtn}
        </Link>
      </div>
    </main>
  );
}

/* ================= 4. DYNAMIC CONTENT TEMPLATES ================= */
export function ConditionTemplateView({ page: raw }: { page: ConditionPage }) {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);
  const page = localizeCondition(raw, lang);
  const catLabel = p.categories[raw.category] ?? raw.category;

  return (
    <main id="main">
      <LanguageTitleSync title={page.seoTitle} />
      <PageHero
        eyebrow={`${catLabel} • ${p.templates.medicallyReviewed}`}
        h1={page.h1}
        intro={page.intro}
        meta={page.hinglish.length ? `${p.templates.alsoSearched}: ${page.hinglish.join(" • ")}` : undefined}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
        <Breadcrumbs
          items={[
            { label: p.hubs.homeCrumb, href: "/" },
            { label: p.hubs.conditionsCrumb, href: "/conditions/" },
            { label: page.title },
          ]}
        />
      </div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 space-y-12">
        <AuthorBox />

        <Section id="what-is" eyebrow={p.templates.overviewEyebrow} title={p.templates.whatIsTitle}>
          {page.whatIs.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </Section>

        <Section id="signs" eyebrow={p.templates.symptomsEyebrow} title={p.templates.signsTitle}>
          <BulletList items={page.signs} />
        </Section>

        {page.ageNotes && (
          <Section id="age" eyebrow={p.templates.byAgeEyebrow} title={p.templates.ageTitle}>
            <BulletList items={page.ageNotes} />
          </Section>
        )}

        <Section id="causes" eyebrow={p.templates.causesEyebrow} title={p.templates.causesTitle}>
          <BulletList items={page.causes} />
        </Section>

        <Section id="assess" eyebrow={p.templates.assessEyebrow} title={p.templates.assessTitle}>
          <BulletList items={page.whenToAssess} />
        </Section>

        <Section id="diagnosis" eyebrow={p.templates.diagnosisEyebrow} title={p.templates.diagnosisTitle}>
          <BulletList items={page.diagnosis} />
        </Section>

        <Section id="management" eyebrow={p.templates.treatmentEyebrow} title={p.templates.managementTitle}>
          <BulletList items={page.management} />
        </Section>

        <Section id="home" eyebrow={p.templates.homeEyebrow} title={p.templates.homeTitle}>
          <BulletList items={page.homeCare} />
        </Section>

        <section
          aria-labelledby="red-h"
          className="rounded-3xl border border-clay-500/30 bg-[#fdf6f2] p-5 sm:p-6 scroll-mt-28"
          id="red-flags"
        >
          <h2 id="red-h" className="font-display text-[22px] text-forest-950 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-clay-500 shrink-0" /> {p.templates.warningTitle}
          </h2>
          <div className="mt-3">
            <BulletList items={page.redFlags} icon="alert" />
          </div>
        </section>

        <Section id="ayurveda" eyebrow={p.templates.ayurvedaEyebrow} title={p.templates.ayurvedaTitle}>
          <div className="rounded-2xl border border-forest-900/10 bg-forest-50 p-4">
            <p className="text-[13px] font-semibold text-forest-800 flex items-center gap-2">
              <Leaf className="w-4 h-4" /> {p.templates.canSupport}
            </p>
            <div className="mt-2">
              <BulletList items={page.ayurvedaRole} />
            </div>
          </div>
          <div className="rounded-2xl border border-saffron-500/30 bg-cream-100 p-4">
            <p className="text-[13px] font-semibold text-forest-800 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4" /> {p.templates.honestLimits}
            </p>
            <div className="mt-2">
              <BulletList items={page.ayurvedaLimits} />
            </div>
          </div>
        </Section>

        <section aria-labelledby="faq-h" id="faq" className="scroll-mt-28">
          <p className="eyebrow text-saffron-700">{p.templates.faqEyebrow}</p>
          <h2 id="faq-h" className="mt-2 font-display text-[26px] text-forest-950">
            {p.templates.faqTitle}
          </h2>
          <div className="mt-4">
            <FaqAccordion faqs={page.faqs} />
          </div>
        </section>

        <section aria-labelledby="ref-h">
          <h2 id="ref-h" className="font-display text-[20px] text-forest-950 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-saffron-700" /> {p.templates.referencesTitle}
          </h2>
          <ul className="mt-3 space-y-1.5 text-[13.5px] text-forest-900/70 list-disc pl-5">
            {page.references.map((r) => (
              <li key={r.label}>
                {r.label} — <em>{r.publisher}</em>
              </li>
            ))}
          </ul>
        </section>

        <RelatedGrid
          conditions={raw.relatedConditions}
          treatments={raw.relatedTreatments}
          articles={raw.relatedArticles}
        />
        <MedicalDisclaimer />
        <CtaBand whatsappMsg={`${p.templates.condWhatsappPrefix} ${page.title}.`} />
      </div>
    </main>
  );
}

export function TreatmentTemplateView({ page: raw }: { page: TreatmentPage }) {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);
  const page = localizeTreatment(raw, lang);
  const catLabel = p.categories[raw.category] ?? raw.category;
  const kindLabel = raw.base === "services" ? p.templates.serviceLabel : p.templates.treatmentLabel;

  return (
    <main id="main">
      <LanguageTitleSync title={page.seoTitle} />
      <PageHero
        eyebrow={`${catLabel} • ${kindLabel}`}
        h1={page.h1}
        intro={page.intro}
        meta={page.hinglish.length ? `${p.templates.alsoSearched}: ${page.hinglish.join(" • ")}` : undefined}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
        <Breadcrumbs
          items={[
            { label: p.hubs.homeCrumb, href: "/" },
            { label: p.hubs.treatmentsCrumb, href: "/treatments/" },
            { label: page.title },
          ]}
        />
      </div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 space-y-10">
        <AuthorBox />

        {page.sections.map((sec, i) => (
          <Section key={sec.h} id={`sec-${i}`} eyebrow={`${p.templates.partLabel} ${i + 1}`} title={sec.h}>
            {sec.p.map((para) => (
              <p key={para}>{para}</p>
            ))}
            {sec.list && <BulletList items={sec.list} />}
          </Section>
        ))}

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-forest-900/10 bg-forest-50 p-4">
            <h2 className="font-semibold text-[15px] text-forest-950">{p.templates.suitsTitle}</h2>
            <div className="mt-2">
              <BulletList items={page.suitability} />
            </div>
          </div>
          <div className="rounded-2xl border border-clay-500/25 bg-[#fdf6f2] p-4">
            <h2 className="font-semibold text-[15px] text-forest-950">{p.templates.avoidTitle}</h2>
            <div className="mt-2">
              <BulletList
                items={page.notSuitable.length ? page.notSuitable : [p.templates.askAtConsult]}
                icon="alert"
              />
            </div>
          </div>
        </div>

        <Section id="risks" eyebrow={p.templates.safetyEyebrow} title={p.templates.risksTitle}>
          <BulletList items={page.risks} icon="alert" />
        </Section>

        <Section id="process" eyebrow={p.templates.processEyebrow} title={p.templates.processTitle}>
          <BulletList items={page.process} />
        </Section>

        <section aria-labelledby="faq-h" id="faq" className="scroll-mt-28">
          <p className="eyebrow text-saffron-700">{p.templates.faqEyebrow}</p>
          <h2 id="faq-h" className="mt-2 font-display text-[26px] text-forest-950">
            {p.templates.faqTitle}
          </h2>
          <div className="mt-4">
            <FaqAccordion faqs={page.faqs} />
          </div>
        </section>

        <RelatedGrid
          conditions={raw.relatedConditions}
          treatments={raw.relatedTreatments}
          articles={raw.relatedArticles}
        />
        <MedicalDisclaimer />
        <CtaBand
          title={`${p.templates.consideringPrefix} ${page.title}?`}
          body={p.templates.consideringBody}
          whatsappMsg={`${p.templates.treatWhatsappPrefix} ${page.title}.`}
        />
      </div>
    </main>
  );
}

export function ArticleTemplateView({ page: raw }: { page: Article }) {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);
  const page = localizeArticle(raw, lang);
  const catLabel = p.categories[raw.category] ?? raw.category;

  return (
    <main id="main">
      <LanguageTitleSync title={page.seoTitle} />
      <PageHero
        eyebrow={`${catLabel} • ${page.readMins} ${p.homeHubs.minRead}`}
        h1={page.h1}
        intro={page.intro}
        meta={page.hinglish.length ? `${p.templates.alsoSearched}: ${page.hinglish.join(" • ")}` : undefined}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
        <Breadcrumbs
          items={[
            { label: p.hubs.homeCrumb, href: "/" },
            { label: p.hubs.articlesCrumb, href: "/articles/" },
            { label: page.title },
          ]}
        />
      </div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-16 space-y-10">
        <AuthorBox />

        {page.sections.map((sec, i) => (
          <Section key={sec.h} id={`sec-${i}`} eyebrow={`${p.templates.partLabel} ${i + 1}`} title={sec.h}>
            {sec.p.map((para) => (
              <p key={para}>{para}</p>
            ))}
            {sec.list && <BulletList items={sec.list} />}
          </Section>
        ))}

        {page.faqs.length > 0 && (
          <section aria-labelledby="faq-h" id="faq" className="scroll-mt-28">
            <p className="eyebrow text-saffron-700">{p.templates.faqEyebrow}</p>
            <h2 id="faq-h" className="mt-2 font-display text-[26px] text-forest-950">
              {p.templates.faqTitle}
            </h2>
            <div className="mt-4">
              <FaqAccordion faqs={page.faqs} />
            </div>
          </section>
        )}

        <RelatedGrid
          conditions={raw.relatedConditions}
          treatments={raw.relatedTreatments}
          articles={raw.relatedArticles}
        />
        <MedicalDisclaimer />
        <CtaBand
          title={p.templates.artCtaTitle}
          whatsappMsg={`${p.templates.artWhatsappPrefix} ${page.title}.`}
        />
      </div>
    </main>
  );
}

export function LocalTemplateView({ page: raw }: { page: LocalPage }) {
  const { lang } = useLanguage();
  const p = usePagesDict(lang);
  const page = localizeLocalPage(raw, lang);

  return (
    <main id="main">
      <LanguageTitleSync title={page.seoTitle} />
      <PageHero
        eyebrow={p.templates.indoreEyebrow}
        h1={page.h1}
        intro={page.intro}
        meta={page.hinglish.length ? `${p.templates.alsoSearched}: ${page.hinglish.join(" • ")}` : undefined}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: p.hubs.homeCrumb, href: "/" }, { label: page.title }]} />
      </div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 space-y-10">
        <section className="rounded-3xl border border-saffron-500/25 bg-cream-100 p-5 sm:p-6">
          <h2 className="font-display text-[22px] text-forest-950 flex items-center gap-2">
            <Home className="w-5 h-5 text-saffron-700" /> {p.templates.whyChooseTitle}
          </h2>
          <div className="mt-3">
            <BulletList items={page.bullets} />
          </div>
        </section>

        <section>
          <h2 className="font-display text-[22px] text-forest-950">{p.templates.areasServedTitle}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {page.areasServed.map((area) => (
              <span
                key={area}
                className="rounded-full border border-forest-900/12 bg-white px-3.5 py-1.5 text-[13px] text-forest-900/80"
              >
                {area}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-forest-950 text-cream-50 p-5 sm:p-6">
          <h2 className="font-display text-[22px]">{p.templates.visitInfoTitle}</h2>
          <ul className="mt-3 space-y-2 text-[14px] text-cream-100/85">
            {page.consultInfo.map((info) => (
              <li key={info} className="flex gap-2">
                <Check className="w-4 h-4 mt-1 text-saffron-300 shrink-0" />
                <span>{info}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="faq-h">
          <p className="eyebrow text-saffron-700">{p.templates.faqEyebrow}</p>
          <h2 id="faq-h" className="mt-2 font-display text-[26px] text-forest-950">
            {p.templates.localFaqTitle}
          </h2>
          <div className="mt-4">
            <FaqAccordion faqs={page.faqs} />
          </div>
        </section>

        <div>
          <h2 className="font-display text-[22px] text-forest-950">{p.templates.continueExploring}</h2>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {page.relatedLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-2xl border border-forest-900/10 bg-white p-4 font-medium text-[14.5px] text-forest-950 hover:border-saffron-500/50 hover:shadow-luxe flex items-center justify-between gap-2"
              >
                {l.label}
                <ArrowRight className="w-4 h-4 opacity-40 shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        <AuthorBox />
        <MedicalDisclaimer />
        <CtaBand />
      </div>
    </main>
  );
}
