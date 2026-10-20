import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, AlertTriangle, ChevronDown, BookOpen, ArrowRight, Stethoscope, FlaskConical, Home } from "lucide-react";
import { Breadcrumbs, AuthorBox, MedicalDisclaimer, CtaBand, AdSlot, useSEO, breadcrumbJsonLd, faqJsonLd, medicalWebPageJsonLd } from "@/components/seo";
import type { ConditionPage } from "@/content/conditions";
import type { TreatmentPage } from "@/content/treatments";
import type { Article } from "@/content/articles";
import type { LocalPage } from "@/content/local";
import { CONDITIONS_1 } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS } from "@/content/treatments";
import { ARTICLES } from "@/content/articles";

const ALL_CONDITIONS = [...CONDITIONS_1, ...CONDITIONS_2];
const condBySlug = (s: string) => ALL_CONDITIONS.find((c) => c.slug === s);
const treatBySlug = (s: string) => TREATMENTS.find((t) => t.slug === s);
const artBySlug = (s: string) => ARTICLES.find((a) => a.slug === s);

function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="rounded-2xl border border-forest-900/10 bg-white overflow-hidden">
            <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left">
              <span className="font-medium text-[15px] text-forest-950">{f.q}</span>
              <ChevronDown className={`w-4 h-4 shrink-0 text-saffron-700 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <p className="px-5 pb-4 text-[14.5px] leading-relaxed text-forest-900/75">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
      <p className="eyebrow text-saffron-700">{eyebrow}</p>
      <h2 id={`${id}-h`} className="mt-2 font-display text-[26px] sm:text-[30px] text-forest-950 leading-tight">{title}</h2>
      <div className="mt-4 space-y-3 text-[15px] leading-[1.8] text-forest-900/80">{children}</div>
    </section>
  );
}

function BulletList({ items, icon = "check" }: { items: string[]; icon?: "check" | "alert" }) {
  return (
    <ul className="space-y-2.5">
      {items.map((it) => (
        <li key={it} className="flex gap-2.5 text-[14.5px] leading-relaxed">
          {icon === "check" ? <Check className="w-4 h-4 mt-1 shrink-0 text-forest-600" /> : <AlertTriangle className="w-4 h-4 mt-1 shrink-0 text-clay-500" />}
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function PageHero({ eyebrow, h1, intro, meta }: { eyebrow: string; h1: string; intro: string; meta?: string }) {
  return (
    <div className="relative overflow-hidden bg-forest-950 text-cream-50">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-saffron-500/20 blur-[100px]" aria-hidden />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-forest-500/30 blur-[100px]" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 pt-28 sm:pt-32 pb-10 sm:pb-14 text-center">
        <p className="eyebrow text-saffron-300">{eyebrow}</p>
        <h1 className="mt-3 font-display font-light text-[clamp(2rem,5vw,3.2rem)] leading-[1.1]">{h1}</h1>
        <p className="mt-4 text-[15px] sm:text-[16px] leading-relaxed text-cream-100/80 max-w-3xl mx-auto">{intro}</p>
        {meta && <p className="mt-3 text-[12px] tracking-wide text-cream-100/50">{meta}</p>}
      </div>
    </div>
  );
}

function RelatedGrid({ conditions, treatments, articles }: { conditions: string[]; treatments: string[]; articles: string[] }) {
  const cards: { label: string; href: string; kind: string }[] = [
    ...conditions.map((s) => { const c = condBySlug(s); return c ? { label: c.title, href: `/conditions/${s}/`, kind: "Condition" } : null; }).filter(Boolean) as { label: string; href: string; kind: string }[],
    ...treatments.map((s) => { const t = treatBySlug(s); return t ? { label: t.title, href: `/${t.base}/${s}/`, kind: "Treatment" } : null; }).filter(Boolean) as { label: string; href: string; kind: string }[],
    ...articles.map((s) => { const a = artBySlug(s); return a ? { label: a.title, href: `/articles/${s}/`, kind: "Article" } : null; }).filter(Boolean) as { label: string; href: string; kind: string }[],
  ].slice(0, 6);
  if (!cards.length) return null;
  return (
    <div>
      <h2 className="font-display text-[22px] text-forest-950">Related reading</h2>
      <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((c) => (
          <Link key={c.href} to={c.href} className="group rounded-2xl border border-forest-900/10 bg-white p-4 hover:border-saffron-500/50 hover:shadow-luxe transition-all">
            <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-saffron-700">{c.kind}</span>
            <span className="mt-1 flex items-center justify-between gap-2 font-medium text-[14.5px] text-forest-950">{c.label}<ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ================= CONDITION TEMPLATE ================= */
export function ConditionTemplate({ page }: { page: ConditionPage }) {
  const path = `/conditions/${page.slug}/`;
  useSEO({
    title: page.seoTitle,
    description: page.seoDescription,
    path,
    type: "article",
    jsonLd: [
      breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Conditions", path: "/conditions/" }, { name: page.title, path }]),
      medicalWebPageJsonLd({ path, name: page.h1, description: page.seoDescription, about: page.title }),
      faqJsonLd(page.faqs),
    ],
  });
  return (
    <main id="main">
      <PageHero eyebrow={`${page.category} • Medically reviewed`} h1={page.h1} intro={page.intro} meta={`Also searched as: ${page.hinglish.join(" • ")}`} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Conditions", href: "/conditions/" }, { label: page.title }]} /></div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 space-y-12">
        <AuthorBox />
        <Section id="what-is" eyebrow="Overview" title="What it is">{page.whatIs.map((p) => <p key={p}>{p}</p>)}</Section>
        <Section id="signs" eyebrow="Symptoms" title="Common signs & symptoms"><BulletList items={page.signs} /></Section>
        {page.ageNotes && <Section id="age" eyebrow="By age" title="Age-specific considerations"><BulletList items={page.ageNotes} /></Section>}
        <Section id="causes" eyebrow="Causes" title="Causes & risk factors"><BulletList items={page.causes} /></Section>
        <AdSlot slot="in-article" />
        <Section id="assess" eyebrow="Assessment" title="When assessment is needed"><BulletList items={page.whenToAssess} /></Section>
        <Section id="diagnosis" eyebrow="Diagnosis" title="How diagnosis is established"><BulletList items={page.diagnosis} /></Section>
        <Section id="management" eyebrow="Treatment" title="Evidence-based management"><BulletList items={page.management} /></Section>
        <Section id="home" eyebrow="Home care" title="Home care & supportive measures"><BulletList items={page.homeCare} /></Section>
        <section aria-labelledby="red-h" className="rounded-3xl border border-clay-500/30 bg-[#fdf6f2] p-5 sm:p-6 scroll-mt-28" id="red-flags">
          <h2 id="red-h" className="font-display text-[22px] text-forest-950 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-clay-500" /> Warning signs — seek prompt care</h2>
          <div className="mt-3"><BulletList items={page.redFlags} icon="alert" /></div>
        </section>
        <Section id="ayurveda" eyebrow="Ayurvedic co-care" title="Role of Ayurveda (and its limits)">
          <div className="rounded-2xl border border-forest-900/10 bg-forest-50 p-4"><p className="text-[13px] font-semibold text-forest-800 flex items-center gap-2"><Stethoscope className="w-4 h-4" /> What it can support</p><div className="mt-2"><BulletList items={page.ayurvedaRole} /></div></div>
          <div className="rounded-2xl border border-saffron-500/30 bg-cream-100 p-4"><p className="text-[13px] font-semibold text-forest-800 flex items-center gap-2"><FlaskConical className="w-4 h-4" /> Honest limits</p><div className="mt-2"><BulletList items={page.ayurvedaLimits} /></div></div>
        </Section>
        <section aria-labelledby="faq-h" id="faq" className="scroll-mt-28">
          <p className="eyebrow text-saffron-700">FAQ</p>
          <h2 id="faq-h" className="mt-2 font-display text-[26px] text-forest-950">Frequently asked questions</h2>
          <div className="mt-4"><FaqList faqs={page.faqs} /></div>
        </section>
        <section aria-labelledby="ref-h">
          <h2 id="ref-h" className="font-display text-[20px] text-forest-950 flex items-center gap-2"><BookOpen className="w-5 h-5 text-saffron-700" /> References</h2>
          <ul className="mt-3 space-y-1.5 text-[13.5px] text-forest-900/70 list-disc pl-5">
            {page.references.map((r) => <li key={r.label}>{r.label} — <em>{r.publisher}</em></li>)}
          </ul>
        </section>
        <RelatedGrid conditions={page.relatedConditions} treatments={page.relatedTreatments} articles={page.relatedArticles} />
        <MedicalDisclaimer />
        <CtaBand whatsappMsg={`Namaste Doctor Priyanka, I read your guide on ${page.title} and want guidance for my child.`} />
      </div>
    </main>
  );
}

/* ================= TREATMENT TEMPLATE ================= */
export function TreatmentTemplate({ page }: { page: TreatmentPage }) {
  const path = `/${page.base}/${page.slug}/`;
  useSEO({
    title: page.seoTitle, description: page.seoDescription, path, type: "article",
    jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.base === "services" ? "Services" : "Treatments", path: page.base === "services" ? "/treatments/" : "/treatments/" }, { name: page.title, path }]), medicalWebPageJsonLd({ path, name: page.h1, description: page.seoDescription }), faqJsonLd(page.faqs)],
  });
  return (
    <main id="main">
      <PageHero eyebrow={`${page.category} • ${page.base === "services" ? "Service" : "Treatment"}`} h1={page.h1} intro={page.intro} meta={page.hinglish.length ? `Also searched as: ${page.hinglish.join(" • ")}` : undefined} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Treatments", href: "/treatments/" }, { label: page.title }]} /></div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 space-y-10">
        <AuthorBox />
        {page.needsOwner && (
          <div className="rounded-2xl border border-amber-500/40 bg-amber-50 p-4 flex gap-3" role="note">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[13px] text-amber-900"><strong>Verification note:</strong> {page.needsOwner}</p>
          </div>
        )}
        {page.sections.map((s, i) => (
          <Section key={s.h} id={`sec-${i}`} eyebrow={`Part ${i + 1}`} title={s.h}>
            {s.p.map((p) => <p key={p}>{p}</p>)}
            {s.list && <BulletList items={s.list} />}
          </Section>
        ))}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-2xl border border-forest-900/10 bg-forest-50 p-4"><h2 className="font-semibold text-[15px] text-forest-950">Who it suits</h2><div className="mt-2"><BulletList items={page.suitability} /></div></div>
          <div className="rounded-2xl border border-clay-500/25 bg-[#fdf6f2] p-4"><h2 className="font-semibold text-[15px] text-forest-950">Who should avoid / ask first</h2><div className="mt-2"><BulletList items={page.notSuitable.length ? page.notSuitable : ["Ask at consultation — suitability is individual."]} icon="alert" /></div></div>
        </div>
        <Section id="risks" eyebrow="Safety" title="Risks, side effects & contraindications"><BulletList items={page.risks} icon="alert" /></Section>
        <Section id="process" eyebrow="Process" title="Consultation & course process"><BulletList items={page.process} /></Section>
        <AdSlot slot="in-article" />
        <section aria-labelledby="faq-h" id="faq" className="scroll-mt-28">
          <p className="eyebrow text-saffron-700">FAQ</p>
          <h2 id="faq-h" className="mt-2 font-display text-[26px] text-forest-950">Frequently asked questions</h2>
          <div className="mt-4"><FaqList faqs={page.faqs} /></div>
        </section>
        <RelatedGrid conditions={page.relatedConditions} treatments={page.relatedTreatments} articles={page.relatedArticles} />
        <MedicalDisclaimer />
        <CtaBand title={`Considering ${page.title}?`} body="Start with an assessment — you will get an honest answer on suitability, process, duration and cost before anything begins." whatsappMsg={`Namaste Doctor Priyanka, I want to ask about ${page.title}.`} />
      </div>
    </main>
  );
}

/* ================= ARTICLE TEMPLATE ================= */
export function ArticleTemplate({ page }: { page: Article }) {
  const path = `/articles/${page.slug}/`;
  useSEO({
    title: page.seoTitle, description: page.seoDescription, path, type: "article",
    jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Articles", path: "/articles/" }, { name: page.title, path }]), medicalWebPageJsonLd({ path, name: page.h1, description: page.seoDescription }), faqJsonLd(page.faqs)],
  });
  return (
    <main id="main">
      <PageHero eyebrow={`${page.category} • ${page.readMins} min read`} h1={page.h1} intro={page.intro} />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Articles", href: "/articles/" }, { label: page.title }]} /></div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-16 space-y-10">
        <AuthorBox />
        {page.sections.map((s, i) => (
          <Section key={s.h} id={`sec-${i}`} eyebrow={`Section ${i + 1}`} title={s.h}>
            {s.p.map((p) => <p key={p}>{p}</p>)}
            {s.list && <BulletList items={s.list} />}
          </Section>
        ))}
        <AdSlot slot="in-article" />
        <section aria-labelledby="faq-h"><p className="eyebrow text-saffron-700">FAQ</p><h2 id="faq-h" className="mt-2 font-display text-[26px] text-forest-950">Questions parents ask</h2><div className="mt-4"><FaqList faqs={page.faqs} /></div></section>
        <RelatedGrid conditions={page.relatedConditions} treatments={page.relatedTreatments} articles={page.relatedArticles} />
        <MedicalDisclaimer />
        <CtaBand />
      </div>
    </main>
  );
}

/* ================= LOCAL TEMPLATE ================= */
export function LocalTemplate({ page }: { page: LocalPage }) {
  const path = `/${page.slug}/`;
  useSEO({
    title: page.seoTitle, description: page.seoDescription, path, type: "website",
    jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.title, path }]), medicalWebPageJsonLd({ path, name: page.h1, description: page.seoDescription }), faqJsonLd(page.faqs)],
  });
  return (
    <main id="main">
      <PageHero eyebrow="Indore • Madhya Pradesh" h1={page.h1} intro={page.intro} meta={page.hinglish.length ? `Also searched as: ${page.hinglish.join(" • ")}` : undefined} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: page.title }]} /></div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 space-y-10">
        <section className="rounded-3xl border border-saffron-500/25 bg-cream-100 p-5 sm:p-6">
          <h2 className="font-display text-[22px] text-forest-950 flex items-center gap-2"><Home className="w-5 h-5 text-saffron-700" /> Why families choose this clinic</h2>
          <div className="mt-3"><BulletList items={page.bullets} /></div>
        </section>
        <section>
          <h2 className="font-display text-[22px] text-forest-950">Areas served</h2>
          <div className="mt-3 flex flex-wrap gap-2">{page.areasServed.map((a) => <span key={a} className="rounded-full border border-forest-900/12 bg-white px-3.5 py-1.5 text-[13px] text-forest-900/80">{a}</span>)}</div>
        </section>
        <section className="rounded-3xl bg-forest-950 text-cream-50 p-5 sm:p-6">
          <h2 className="font-display text-[22px]">Visit information</h2>
          <ul className="mt-3 space-y-2 text-[14px] text-cream-100/85">{page.consultInfo.map((c) => <li key={c} className="flex gap-2"><Check className="w-4 h-4 mt-1 text-saffron-300 shrink-0" />{c}</li>)}</ul>
        </section>
        <section aria-labelledby="faq-h"><p className="eyebrow text-saffron-700">FAQ</p><h2 id="faq-h" className="mt-2 font-display text-[26px] text-forest-950">Local questions, answered</h2><div className="mt-4"><FaqList faqs={page.faqs} /></div></section>
        <div>
          <h2 className="font-display text-[22px] text-forest-950">Continue exploring</h2>
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            {page.relatedLinks.map((l) => <Link key={l.href} to={l.href} className="rounded-2xl border border-forest-900/10 bg-white p-4 font-medium text-[14.5px] text-forest-950 hover:border-saffron-500/50 hover:shadow-luxe flex items-center justify-between gap-2">{l.label}<ArrowRight className="w-4 h-4 opacity-40" /></Link>)}
          </div>
        </div>
        <AuthorBox />
        <MedicalDisclaimer />
        <CtaBand />
      </div>
    </main>
  );
}
