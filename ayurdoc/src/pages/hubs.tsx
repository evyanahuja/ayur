import { Link } from "react-router-dom";
import { ArrowRight, Baby, Brain, Leaf, BookOpen, Stethoscope, MessageCircleQuestion } from "lucide-react";
import { Breadcrumbs, CtaBand, AdSlot, useSEO, breadcrumbJsonLd, AuthorBox, MedicalDisclaimer } from "@/components/seo";
import { CONDITIONS_1 } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS } from "@/content/treatments";
import { ARTICLES } from "@/content/articles";

const ALL_CONDITIONS = [...CONDITIONS_1, ...CONDITIONS_2];
const CATS = ["Development & Behaviour", "Neurological", "Growth & Nutrition", "Respiratory & Immunity", "Digestion & Gut", "Sleep & Habits"] as const;

function HubHero({ eyebrow, h1, intro }: { eyebrow: string; h1: string; intro: string }) {
  return (
    <div className="relative overflow-hidden bg-forest-950 text-cream-50">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-saffron-500/20 blur-[100px]" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-28 sm:pt-32 pb-10 text-center">
        <p className="eyebrow text-saffron-300">{eyebrow}</p>
        <h1 className="mt-3 font-display font-light text-[clamp(2rem,5vw,3rem)] leading-tight">{h1}</h1>
        <p className="mt-3 text-[15px] text-cream-100/75 max-w-3xl mx-auto leading-relaxed">{intro}</p>
      </div>
    </div>
  );
}

export function ConditionsIndex() {
  useSEO({ title: "Child Health Conditions Library (A–Z) | BalChikitsa Indore", description: "Browse 22 evidence-aware guides: ADHD, cerebral palsy, speech delay, autism, appetite, constipation, sleep, growth and more. Each with symptoms, diagnosis and care.", path: "/conditions/", jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Conditions", path: "/conditions/" }])] });
  return (
    <main id="main">
      <HubHero eyebrow="22 parent guides" h1="Child Health Conditions Library" intro="Every important topic gets its own page: what it is, signs by age, when to assess, how diagnosis works, home care, red flags, and the honest role of Ayurvedic co-care." />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Conditions" }]} /></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 space-y-10">
        {CATS.map((cat) => (
          <section key={cat} aria-labelledby={cat}>
            <h2 id={cat} className="font-display text-[24px] text-forest-950 flex items-center gap-2">
              {cat === "Development & Behaviour" ? <Brain className="w-5 h-5 text-saffron-700" /> : cat === "Neurological" ? <Stethoscope className="w-5 h-5 text-saffron-700" /> : <Baby className="w-5 h-5 text-saffron-700" />}{cat}
            </h2>
            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ALL_CONDITIONS.filter((c) => c.category === cat).map((c) => (
                <Link key={c.slug} to={`/conditions/${c.slug}/`} className="group rounded-2xl border border-forest-900/10 bg-white p-5 hover:border-saffron-500/50 hover:shadow-luxe transition-all">
                  <span className="font-display text-[18px] text-forest-950 group-hover:text-saffron-700 transition-colors">{c.title}</span>
                  <span className="mt-1 block text-[13px] text-forest-800/60 line-clamp-2">{c.seoDescription}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-forest-800">Read guide <ArrowRight className="w-3.5 h-3.5" /></span>
                </Link>
              ))}
            </div>
          </section>
        ))}
        <AdSlot slot="below-list" />
        <AuthorBox />
        <MedicalDisclaimer />
        <CtaBand />
      </div>
    </main>
  );
}

export function TreatmentsIndex() {
  useSEO({ title: "Treatments & Services | Suvarnaprashan, Panchakarma, Consultation", description: "Explore Suvarnaprashan cluster, Panchakarma, Abhyanga, Shirodhara, Basti, Nasya and consultations — with suitability, safety and process for each.", path: "/treatments/", jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Treatments", path: "/treatments/" }])] });
  const groups: { title: string; desc: string; slugs: string[] }[] = [
    { title: "Customized Suvarnaprashan cluster", desc: "Main guide + safety, age, ingredients and what-it-is companions.", slugs: TREATMENTS.filter((t) => t.category === "Suvarnaprashan").map((t) => t.slug) },
    { title: "Panchakarma & classical therapies", desc: "Honest, assessment-first explainers. Only verified in-clinic offerings.", slugs: TREATMENTS.filter((t) => t.category === "Panchakarma" || t.category === "Therapies").map((t) => t.slug) },
    { title: "Consultations", desc: "In-clinic and online visit formats.", slugs: TREATMENTS.filter((t) => t.category === "Consultation").map((t) => t.slug) },
  ];
  return (
    <main id="main">
      <HubHero eyebrow="Services & therapies" h1="Treatments & Services" intro="Each therapy page states what it is, who it suits, who should avoid it, risks, and the exact process — so you arrive informed, not sold to." />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Treatments" }]} /></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16 space-y-10">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="font-display text-[24px] text-forest-950 flex items-center gap-2"><Leaf className="w-5 h-5 text-saffron-700" />{g.title}</h2>
            <p className="mt-1 text-[14px] text-forest-800/65">{g.desc}</p>
            <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {g.slugs.map((s) => { const t = TREATMENTS.find((x) => x.slug === s)!; return (
                <Link key={s} to={`/${t.base}/${s}/`} className="group rounded-2xl border border-forest-900/10 bg-white p-5 hover:border-saffron-500/50 hover:shadow-luxe transition-all">
                  <span className="font-display text-[18px] text-forest-950 group-hover:text-saffron-700">{t.title}</span>
                  <span className="mt-1 block text-[13px] text-forest-800/60 line-clamp-2">{t.seoDescription}</span>
                  <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-forest-800">Read guide <ArrowRight className="w-3.5 h-3.5" /></span>
                </Link>); })}
            </div>
          </section>
        ))}
        <MedicalDisclaimer />
        <CtaBand />
      </div>
    </main>
  );
}

export function ArticlesIndex() {
  useSEO({ title: "Health Articles Library | Child & Family Health Guides", description: "Practical, evidence-aware articles: sleep, screens, iron, immunity myths, growth charts, fibre, joint pain and detox facts. New guides added regularly.", path: "/articles/", jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Articles", path: "/articles/" }])] });
  return (
    <main id="main">
      <HubHero eyebrow="Health education library" h1="Health Articles for Parents & Families" intro="Short, practical, honestly-referenced guides. Each article links to related conditions and services so you can go deeper or book when ready." />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Articles" }]} /></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ARTICLES.map((a) => (
            <Link key={a.slug} to={`/articles/${a.slug}/`} className="group rounded-2xl border border-forest-900/10 bg-white p-5 hover:border-saffron-500/50 hover:shadow-luxe transition-all">
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-saffron-700">{a.category} • {a.readMins} min</span>
              <span className="mt-1.5 block font-display text-[18px] leading-snug text-forest-950 group-hover:text-saffron-700">{a.title}</span>
              <span className="mt-1 block text-[13px] text-forest-800/60 line-clamp-2">{a.intro}</span>
            </Link>
          ))}
        </div>
        <div className="mt-8"><AdSlot slot="below-list" /></div>
        <div className="mt-8"><CtaBand title="Want a topic covered?" body="Message the clinic with your question — popular requests become future articles (and get answered personally first)." /></div>
      </div>
    </main>
  );
}

export function ChildHealthHub() {
  useSEO({ title: "Child Health Hub | Growth, Immunity, Behaviour & Nutrition", description: "Start here for child health: growth, appetite, immunity, sleep, behaviour and development — organized paths for parents, with Indore consult options.", path: "/child-health/", jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Child Health", path: "/child-health/" }])] });
  const paths = [
    { icon: Baby, title: "Growth & appetite not on track?", desc: "Weight, height, anaemia, picky eating.", links: [["Poor Appetite", "/conditions/poor-appetite-children/"], ["Growth & Nutrition", "/conditions/growth-nutrition-concerns/"], ["Constipation", "/conditions/constipation-children/"]] },
    { icon: Brain, title: "Speech, attention or milestones?", desc: "Developmental worries, sorted calmly.", links: [["Speech Delay", "/conditions/speech-delay-in-children/"], ["ADHD", "/conditions/adhd-in-children/"], ["Delayed Milestones", "/conditions/delayed-milestones/"], ["Autism signs", "/conditions/autism-signs-assessment/"]] },
    { icon: Stethoscope, title: "Always falling sick?", desc: "Colds, fever, immunity patterns.", links: [["Frequent Colds", "/conditions/frequent-colds-cough-children/"], ["Fever guide", "/conditions/fever-children/"], ["Suvarnaprashan", "/treatments/customized-suvarnaprashan/"]] },
    { icon: BookOpen, title: "Sleep, food & routine foundations", desc: "The habits that fix half the complaints.", links: [["Sleep Problems", "/conditions/sleep-problems-children/"], ["Bedwetting", "/conditions/bedwetting-children/"], ["Sleep routine", "/articles/sleep-routine-children/"]] },
  ];
  return (
    <main id="main">
      <HubHero eyebrow="Start here" h1="Child Health Hub" intro="Tell us the pattern — we'll point you to the right guide first. Every path below leads to full articles, FAQs in English + Hindi/Hinglish, and a clear next step." />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Child Health" }]} /></div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-4">
          {paths.map((p) => (
            <div key={p.title} className="rounded-3xl border border-forest-900/10 bg-white p-6">
              <p.icon className="w-6 h-6 text-saffron-700" />
              <h2 className="mt-2 font-display text-[22px] text-forest-950">{p.title}</h2>
              <p className="text-[14px] text-forest-800/65">{p.desc}</p>
              <ul className="mt-3 space-y-1.5">
                {p.links.map(([label, href]) => <li key={href}><Link to={href} className="text-[14px] font-medium text-forest-800 hover:text-saffron-700 flex items-center gap-1.5">{label} <ArrowRight className="w-3.5 h-3.5" /></Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8"><CtaBand /></div>
      </div>
    </main>
  );
}

export function FaqHub() {
  useSEO({ title: "Frequently Asked Questions | BalChikitsa Ayurved Clinic", description: "Consultation, fees, online visits, Suvarnaprashan, safety, languages and what to carry — honest answers in English with Hindi/Hinglish where parents search it.", path: "/faq/", jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq/" }])] });
  const groups: { h: string; faqs: { q: string; a: string }[] }[] = [
    { h: "Visits & booking", faqs: [
      { q: "How do I book an appointment?", a: "Use the contact form, call/WhatsApp +91 98607 75010, or request an online slot. You will get a confirmed time plus a short checklist (reports, growth record, diet note)." },
      { q: "What should we carry for the first visit?", a: "Prior reports, current medicine list, vaccination card (young children), weight/height record, and a 3-day note of meals, stools and sleep. Photos of skin/rashes in different lights help." },
      { q: "Which languages do you consult in?", a: "Hindi, Marathi, English and Gujarati — explain in whatever language you're most comfortable in." },
    ]},
    { h: "Online consultation", faqs: [
      { q: "Online consultation kaise hoti hai?", a: "Video par detailed history + reports + growth chart review hota hai, phir likhit prescription + diet chart WhatsApp/email par. Dawai courier ya local verified pharmacy se milti hai." },
      { q: "What can't be done online?", a: "Procedures (Abhyanga/Panchakarma sittings), precise infant examination, and emergencies need in-person care. The doctor will say so plainly when video is insufficient." },
    ]},
    { h: "Safety & scope", faqs: [
      { q: "Kya Ayurvedic dawai bachchon ke liye safe hai?", a: "Qualified doctor se age-dosed, quality-verified dawai aam taur par safe hai. Label/batch dekhein, red-flag symptoms par turant modern care lein, aur prescribed dawai kabhi khud band na karein." },
      { q: "Do you treat emergencies?", a: "No — breathing difficulty, seizures, dehydration, injury, high-risk fever in young infants and similar emergencies must go to emergency/paediatric care immediately, not OPD." },
    ]},
  ];
  return (
    <main id="main">
      <HubHero eyebrow="Help centre" h1="Frequently Asked Questions" intro="Short answers first; each links to the full guide where you need depth. Still stuck? Message the clinic — a human replies." />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} /></div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 space-y-8">
        {groups.map((g) => (
          <section key={g.h}>
            <h2 className="font-display text-[22px] text-forest-950 flex items-center gap-2"><MessageCircleQuestion className="w-5 h-5 text-saffron-700" />{g.h}</h2>
            <div className="mt-3 space-y-3">
              {g.faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-forest-900/10 bg-white px-5 py-4">
                  <summary className="cursor-pointer font-medium text-[15px] text-forest-950 list-none flex items-center justify-between gap-3">{f.q}<span className="text-saffron-700 group-open:rotate-45 transition-transform text-xl leading-none">+</span></summary>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-forest-900/75">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
        <MedicalDisclaimer />
        <CtaBand />
      </div>
    </main>
  );
}
