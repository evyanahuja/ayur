import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ShieldCheck, AlertTriangle, Check, ExternalLink, ClipboardList } from "lucide-react";
import { SITE, telLink, mailLink } from "@/content/site";
import { NEEDS_OWNER, CLINIC_MAPS_URL } from "@/seo/config";
import { Breadcrumbs, CtaBand, AuthorBox, MedicalDisclaimer, useSEO, breadcrumbJsonLd, localBusinessJsonLd, faqJsonLd } from "@/components/seo";
import { CONDITIONS_1 } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS } from "@/content/treatments";
import { ARTICLES } from "@/content/articles";
import { LOCAL_PAGES } from "@/content/local";

function PageShell({ eyebrow, h1, intro, children, crumbs }: { eyebrow: string; h1: string; intro: string; children: React.ReactNode; crumbs: { label: string; href?: string }[] }) {
  return (
    <main id="main">
      <div className="relative overflow-hidden bg-forest-950 text-cream-50">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-saffron-500/20 blur-[100px]" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 pt-28 sm:pt-32 pb-10 text-center">
          <p className="eyebrow text-saffron-300">{eyebrow}</p>
          <h1 className="mt-3 font-display font-light text-[clamp(2rem,5vw,3rem)] leading-tight">{h1}</h1>
          <p className="mt-3 text-[15px] text-cream-100/75 max-w-3xl mx-auto leading-relaxed">{intro}</p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6"><Breadcrumbs items={crumbs} /></div>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-16 space-y-8">{children}</div>
    </main>
  );
}

export function AboutDoctor() {
  useSEO({
    title: "About Dr. Priyanka Likhar | BAMS, MD Kaumarbhritya (Balarog) Indore",
    description: "Doctor profile: BAMS + MD Kaumarbhritya, child-focused Ayurvedic practice in Indore, scope, approach, languages and how consultations work.",
    path: "/about-doctor/",
    jsonLd: [
      breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About Doctor", path: "/about-doctor/" }]),
      { "@context": "https://schema.org", "@type": "Person", name: SITE.doctorName, jobTitle: "Ayurvedic Doctor — BAMS, MD Kaumarbhritya (Balarog)", worksFor: { "@type": "MedicalClinic", name: SITE.clinicName }, address: { "@type": "PostalAddress", addressLocality: "Indore", addressRegion: "Madhya Pradesh", addressCountry: "IN" }, knowsLanguage: ["en", "hi", "mr", "gu"] },
      localBusinessJsonLd(),
    ],
  });
  return (
    <PageShell eyebrow="Doctor profile" h1={`About ${SITE.doctorName}`} intro={`${SITE.qualification} — Ayurvedic child healthcare (Kaumarbhritya / Balarog) at ${SITE.clinicName}, Indore. Scope stated precisely, with no invented credentials.`} crumbs={[{ label: "Home", href: "/" }, { label: "About Doctor" }]}>
      <div className="rounded-3xl border border-saffron-500/25 bg-cream-100 p-5 sm:p-6 grid sm:grid-cols-[120px_1fr] gap-4 items-start">
        <img src="/images/doctor.jpg" alt={`${SITE.doctorName}, ${SITE.qualification} — Ayurvedic doctor in Indore`} className="w-[120px] h-[150px] object-cover rounded-2xl border border-forest-900/10" loading="lazy" width={120} height={150} />
        <div>
          <p className="font-display text-[22px] text-forest-950">{SITE.doctorName}</p>
          <p className="text-[13px] font-semibold tracking-wide text-saffron-700 uppercase">{SITE.qualification}</p>
          <ul className="mt-3 space-y-1.5 text-[14px] text-forest-900/80">
            <li className="flex gap-2"><Check className="w-4 h-4 mt-1 text-forest-600" /> BAMS (Bachelor of Ayurvedic Medicine & Surgery) — verified from existing site</li>
            <li className="flex gap-2"><Check className="w-4 h-4 mt-1 text-forest-600" /> MD Kaumarbhritya / Balarog — Ayurvedic paediatrics specialty</li>
            <li className="flex gap-2"><Check className="w-4 h-4 mt-1 text-forest-600" /> Practice focus: children's growth, skin, digestion, immunity, sleep & developmental support</li>
            <li className="flex gap-2"><Check className="w-4 h-4 mt-1 text-forest-600" /> Languages: {SITE.languages}</li>
          </ul>
        </div>
      </div>
      <div className="rounded-2xl border border-amber-500/40 bg-amber-50 p-4 flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[13.5px] text-amber-900"><strong>Verification pending:</strong> {NEEDS_OWNER.registrationNumber}; {NEEDS_OWNER.registrationCouncil}. No registration number is published until the owner supplies it. No awards or affiliations are claimed.</p>
      </div>
      <section>
        <h2 className="font-display text-[24px] text-forest-950">Scope & approach</h2>
        <ul className="mt-3 space-y-2 text-[14.5px] text-forest-900/80">
          <li>• 45-minute structured first assessment: history, Prakriti–Agni–Bala, growth/records, diet, sleep, routine — with a written plan.</li>
          <li>• Steroid-conscious, antibiotic-aware; coordinated with paediatricians — complementary, never adversarial.</li>
          <li>• Clear referral discipline: emergencies, surgical, vaccination and ICU care stay paediatrician-led.</li>
          <li>• Honest evidence framing: traditional support + modern management, no cure claims for developmental conditions.</li>
        </ul>
      </section>
      <AuthorBox />
      <MedicalDisclaimer />
      <CtaBand />
    </PageShell>
  );
}

export function ContactPage() {
  useSEO({
    title: "Contact & Book Appointment | BalChikitsa Ayurved Clinic Indore",
    description: "Book an appointment: call/WhatsApp +91 98607 75010, clinic address in Kanadia Road Indore, timings, online slots and enquiry form.",
    path: "/contact/",
    jsonLd: [breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact/" }]), localBusinessJsonLd(), faqJsonLd([{ q: "How do I book?", a: "Call/WhatsApp +91 98607 75010 or submit the form; you get a confirmed slot plus a short preparation checklist." }])],
  });
  const [form, setForm] = useState({ name: "", phone: "", concern: "", mode: "In-clinic (Indore)" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const ne: Record<string, string> = {};
    if (form.name.trim().length < 2) ne.name = "Please enter your name.";
    if (!/^(\+?91[\s-]?)?[6-9]\d{9}$/.test(form.phone.replace(/[\s-]/g, ""))) ne.phone = "Enter a valid 10-digit Indian mobile number.";
    if (form.concern.trim().length < 10) ne.concern = "Briefly describe the concern (10+ characters). No sensitive reports needed here.";
    setErrs(ne);
    if (Object.keys(ne).length) return;
    const msg = `Namaste, I am ${form.name} (${form.phone}). Concern: ${form.concern}. Preferred: ${form.mode}.`;
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
  };
  return (
    <PageShell eyebrow="Appointments" h1="Contact & Book an Appointment" intro="Call, WhatsApp, or send the enquiry form — you get a confirmed slot and a short preparation checklist. Only necessary details are requested." crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}>
      <div className="grid sm:grid-cols-2 gap-3">
        <a href={telLink} className="rounded-2xl border border-forest-900/10 bg-white p-4 flex gap-3 hover:border-saffron-500/50"><Phone className="w-5 h-5 text-saffron-700 mt-0.5" /><span><strong className="block text-forest-950">Call the clinic</strong><span className="text-[14px] text-forest-800/70">{SITE.phoneDisplay} • {SITE.hours}</span></span></a>
        <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`} target="_blank" rel="noreferrer" className="rounded-2xl border border-forest-900/10 bg-white p-4 flex gap-3 hover:border-saffron-500/50"><Phone className="w-5 h-5 text-saffron-700 mt-0.5" /><span><strong className="block text-forest-950">WhatsApp enquiry</strong><span className="text-[14px] text-forest-800/70">Fastest for slot requests</span></span></a>
        <a href={CLINIC_MAPS_URL} target="_blank" rel="noreferrer" className="rounded-2xl border border-forest-900/10 bg-white p-4 flex gap-3 hover:border-saffron-500/50"><MapPin className="w-5 h-5 text-saffron-700 mt-0.5" /><span><strong className="block text-forest-950">Get directions <ExternalLink className="w-3.5 h-3.5 inline" /></strong><span className="text-[14px] text-forest-800/70">{SITE.addressFull}</span></span></a>
        <a href={mailLink} className="rounded-2xl border border-forest-900/10 bg-white p-4 flex gap-3 hover:border-saffron-500/50"><Mail className="w-5 h-5 text-saffron-700 mt-0.5" /><span><strong className="block text-forest-950">Email</strong><span className="text-[14px] text-forest-800/70">{SITE.email}</span></span></a>
      </div>
      <section aria-labelledby="form-h" className="rounded-3xl border border-forest-900/10 bg-white p-5 sm:p-6">
        <h2 id="form-h" className="font-display text-[22px] text-forest-950 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-saffron-700" /> Enquiry form (opens WhatsApp — nothing stored here)</h2>
        <p className="mt-1 text-[13px] text-forest-800/60">Only necessary details. Do not send ID documents or full medical files through this form — bring them to the visit.</p>
        {sent ? (
          <p className="mt-4 rounded-2xl bg-forest-50 border border-forest-900/10 p-4 text-[14px] text-forest-900">Thank you — WhatsApp should have opened with your message. If not, call {SITE.phoneDisplay} directly.</p>
        ) : (
          <form onSubmit={submit} noValidate className="mt-4 grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cf-name" className="text-[13px] font-semibold text-forest-900">Your name *</label>
                <input id="cf-name" value={form.name} onChange={(e) => set("name", e.target.value)} className="mt-1 w-full rounded-xl border border-forest-900/15 px-3.5 py-2.5 text-[14px] bg-cream-50" placeholder="e.g. Priya Sharma" autoComplete="name" />
                {errs.name && <p className="mt-1 text-[12.5px] text-red-700" role="alert">{errs.name}</p>}
              </div>
              <div>
                <label htmlFor="cf-phone" className="text-[13px] font-semibold text-forest-900">Mobile (WhatsApp) *</label>
                <input id="cf-phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1 w-full rounded-xl border border-forest-900/15 px-3.5 py-2.5 text-[14px] bg-cream-50" placeholder="10-digit mobile" inputMode="tel" autoComplete="tel" />
                {errs.phone && <p className="mt-1 text-[12.5px] text-red-700" role="alert">{errs.phone}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="cf-mode" className="text-[13px] font-semibold text-forest-900">Preferred mode</label>
              <select id="cf-mode" value={form.mode} onChange={(e) => set("mode", e.target.value)} className="mt-1 w-full rounded-xl border border-forest-900/15 px-3.5 py-2.5 text-[14px] bg-cream-50">
                <option>In-clinic (Indore)</option>
                <option>Online video consultation</option>
                <option>Not sure — need guidance</option>
              </select>
            </div>
            <div>
              <label htmlFor="cf-concern" className="text-[13px] font-semibold text-forest-900">Brief concern *</label>
              <textarea id="cf-concern" value={form.concern} onChange={(e) => set("concern", e.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-forest-900/15 px-3.5 py-2.5 text-[14px] bg-cream-50" placeholder="e.g. 4-year-old, frequent cold-cough since 6 months, poor appetite…" />
              {errs.concern && <p className="mt-1 text-[12.5px] text-red-700" role="alert">{errs.concern}</p>}
            </div>
            <button type="submit" className="btn-shine rounded-full bg-forest-950 text-cream-50 font-medium px-6 py-3.5 text-[15px] hover:bg-forest-900">Send via WhatsApp</button>
            <p className="text-[12px] text-forest-800/55 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> By submitting you agree to be contacted about your enquiry. See Privacy Policy.</p>
          </form>
        )}
      </section>
      <MedicalDisclaimer />
    </PageShell>
  );
}

export function PrivacyPage() {
  useSEO({ title: "Privacy Policy | BalChikitsa Ayurved Clinic", description: "How enquiry details are used, stored and protected. No data sale, minimal collection, contact for deletion requests.", path: "/privacy-policy/" });
  return (
    <PageShell eyebrow="Legal" h1="Privacy Policy" intro="Minimal collection, clinic use only, no sale of data. Contact us anytime to review or delete your enquiry details." crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}>
      <div className="space-y-4 text-[14.5px] leading-relaxed text-forest-900/80">
        <p><strong>What we collect:</strong> name, phone, brief concern and preferred mode — only what you submit in the enquiry form or messages.</p>
        <p><strong>How it's used:</strong> solely to respond, schedule and prepare for consultations. No marketing resale, no ad profiling.</p>
        <p><strong>Storage:</strong> enquiries arrive via WhatsApp/phone/email; clinical records follow standard medical confidentiality. Do not send ID documents or full reports through the web form — bring them to the visit.</p>
        <p><strong>Children's data:</strong> submitted by parents/guardians only; used only for the child's care.</p>
        <p><strong>Your rights:</strong> ask what is held, correct it, or request deletion (except where medical-record law requires retention) via {SITE.email} / {SITE.phoneDisplay}.</p>
        <p><strong>Cookies/analytics:</strong> privacy-conscious; no advertising trackers are installed in this build. If analytics is added later, it will be disclosed here first.</p>
      </div>
    </PageShell>
  );
}

export function TermsPage() {
  useSEO({ title: "Terms of Use | BalChikitsa Ayurved Clinic", description: "Terms for using this educational health website: no emergency care via site, no guaranteed outcomes, appointment and content policies.", path: "/terms/" });
  return (
    <PageShell eyebrow="Legal" h1="Terms of Use" intro="Please read: what this site is (education + appointment requests) and is not (emergency care, guaranteed outcomes, or a doctor-patient relationship by browsing)." crumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}>
      <div className="space-y-4 text-[14.5px] leading-relaxed text-forest-900/80">
        <p><strong>Educational only:</strong> content informs but does not diagnose, prescribe or replace professional advice.</p>
        <p><strong>No emergencies:</strong> this site and its forms are not monitored for emergencies. For urgent symptoms call emergency services or visit emergency care immediately.</p>
        <p><strong>Appointments:</strong> requests are confirmed by the clinic; slots, fees and availability are confirmed at booking.</p>
        <p><strong>No outcome promises:</strong> timelines describe typical patterns; individual results vary and nothing here guarantees a result.</p>
        <p><strong>Content use:</strong> you may share links; do not copy medical pages wholesale without permission.</p>
      </div>
    </PageShell>
  );
}

export function SitemapPage() {
  useSEO({ title: "Sitemap — All Pages | BalChikitsa Ayurved Clinic", description: "Browse every page: conditions A–Z, treatments, articles, local pages, and clinic info. Human-readable sitemap (XML at /sitemap.xml).", path: "/sitemap/" });
  const groups: { h: string; links: { label: string; href: string }[] }[] = [
    { h: "Main", links: [{ label: "Home", href: "/" }, { label: "About the Doctor", href: "/about-doctor/" }, { label: "Child Health Hub", href: "/child-health/" }, { label: "FAQ", href: "/faq/" }, { label: "Contact & Appointments", href: "/contact/" }] },
    { h: "Conditions (22)", links: [...CONDITIONS_1, ...CONDITIONS_2].map((c) => ({ label: c.title, href: `/conditions/${c.slug}/` })) },
    { h: "Treatments & Services", links: TREATMENTS.map((t) => ({ label: t.title, href: `/${t.base}/${t.slug}/` })) },
    { h: "Articles", links: ARTICLES.map((a) => ({ label: a.title, href: `/articles/${a.slug}/` })) },
    { h: "Local", links: LOCAL_PAGES.map((l) => ({ label: l.title, href: `/${l.slug}/` })) },
    { h: "Legal & Owner", links: [{ label: "Privacy Policy", href: "/privacy-policy/" }, { label: "Terms of Use", href: "/terms/" }, { label: "Owner Checklist", href: "/owner-checklist/" }] },
  ];
  return (
    <PageShell eyebrow={`${groups.reduce((n, g) => n + g.links.length, 0)} pages`} h1="Sitemap" intro="Every public page on this site — the same URLs listed in /sitemap.xml for search engines. New articles appear here automatically once added to the content files." crumbs={[{ label: "Home", href: "/" }, { label: "Sitemap" }]}>
      {groups.map((g) => (
        <section key={g.h}>
          <h2 className="font-display text-[20px] text-forest-950">{g.h}</h2>
          <ul className="mt-2 grid sm:grid-cols-2 gap-1.5">
            {g.links.map((l) => <li key={l.href}><Link to={l.href} className="text-[14px] text-forest-800 hover:text-saffron-700 hover:underline underline-offset-4">{l.label}</Link> <span className="text-[11.5px] text-forest-800/40 font-mono">{l.href}</span></li>)}
          </ul>
        </section>
      ))}
    </PageShell>
  );
}

export function OwnerChecklist() {
  useSEO({ title: "Owner Checklist — Verifications Needed | BalChikitsa", description: "What the clinic owner must verify: registration, geo, services offered, formulations, pricing. Placeholders are shown, nothing invented.", path: "/owner-checklist/", noindex: true });
  const items = [
    ["Registration", NEEDS_OWNER.registrationNumber, NEEDS_OWNER.registrationCouncil],
    ["Location", NEEDS_OWNER.clinicGeo, "Add to JSON-LD geo + footer map link once known."],
    ["Online consult", NEEDS_OWNER.onlineConsultAvailable, "Platforms, medicine dispatch, NRI slots."],
    ["Suvarnaprashan", NEEDS_OWNER.suvarnaprashanDetails, "Formulation, QC, schedule, price."],
    ["Panchakarma", NEEDS_OWNER.panchakarmaOffered, "Only verified therapies may keep their pages."],
    ["Awards", NEEDS_OWNER.awards, "None published until verified."],
  ];
  return (
    <PageShell eyebrow="For the clinic owner" h1="Owner Verification Checklist" intro="Nothing on this site invents credentials, prices or outcomes. Complete the items below and they flow into every page, JSON-LD block and the sitemap automatically." crumbs={[{ label: "Home", href: "/" }, { label: "Owner Checklist" }]}>
      <div className="space-y-3">
        {items.map(([h, ...lines]) => (
          <div key={h} className="rounded-2xl border border-amber-500/40 bg-amber-50 p-4">
            <p className="font-semibold text-[15px] text-amber-950">{h}</p>
            {lines.map((l) => <p key={l} className="mt-1 text-[13.5px] text-amber-900 font-mono">{l}</p>)}
          </div>
        ))}
      </div>
      <p className="text-[13.5px] text-forest-800/70">How to supply: edit <code className="font-mono text-[12.5px] bg-forest-950/5 px-1.5 py-0.5 rounded">src/seo/config.ts → NEEDS_OWNER</code> (and <code className="font-mono text-[12.5px] bg-forest-950/5 px-1.5 py-0.5 rounded">src/content/*</code> for formulation details), rebuild, redeploy. No template edits needed.</p>
    </PageShell>
  );
}

export function NotFoundPage() {
  useSEO({ title: "Page Not Found | BalChikitsa Ayurved Clinic", description: "The page you requested doesn't exist. Browse conditions, treatments, articles or contact the clinic.", path: "/404/", noindex: true });
  return (
    <main id="main" className="mx-auto max-w-2xl px-4 py-28 text-center">
      <p className="eyebrow text-saffron-700">404</p>
      <h1 className="mt-2 font-display text-4xl text-forest-950">That page doesn't exist</h1>
      <p className="mt-3 text-forest-800/70">It may have moved. Try the sitemap or search-free browsing below.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="rounded-full bg-forest-950 text-cream-50 px-6 py-3 text-[14px] font-medium">Home</Link>
        <Link to="/conditions/" className="rounded-full border border-forest-900/15 px-6 py-3 text-[14px] font-medium">Conditions</Link>
        <Link to="/contact/" className="rounded-full border border-forest-900/15 px-6 py-3 text-[14px] font-medium">Contact</Link>
      </div>
    </main>
  );
}
