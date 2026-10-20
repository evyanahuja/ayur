import { Link } from "react-router-dom";
import { ArrowRight, Baby, Leaf, BookOpen, MapPin } from "lucide-react";
import { useSEO, localBusinessJsonLd, faqJsonLd, CtaBand, AdSlot, AuthorBox } from "@/components/seo";
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
import { CONDITIONS_1 } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS } from "@/content/treatments";
import { ARTICLES } from "@/content/articles";

const FEATURED_CONDITIONS = [...CONDITIONS_1.slice(0, 3), ...CONDITIONS_2.filter((c) => ["speech-delay-in-children", "poor-appetite-children", "constipation-children"].includes(c.slug))];

export function HomePage() {
  useSEO({
    title: "Ayurvedic Doctor in Indore for Children | Dr. Priyanka Likhar, BAMS MD",
    description: "Child-focused Ayurvedic care in Indore + online: ADHD support, speech delay, eczema, appetite, growth, recurrent colds, sleep & Suvarnaprashan. 45-min assessment. Book a visit.",
    path: "/",
    jsonLd: [
      localBusinessJsonLd(),
      { "@context": "https://schema.org", "@type": "WebSite", name: "BalChikitsa Ayurved Clinic", url: "https://ayurveddoctor.netlify.app/" },
      faqJsonLd([
        { q: "Where is the clinic located?", a: "BalChikitsa Ayurved Clinic, Sanchar Nagar Extension, Kanadia Road, Indore, MP 452016. Timings Mon–Sat 10–2 & 5–8 IST." },
        { q: "Do you offer online consultation?", a: "Yes — video consultation with written prescription and diet chart, medicines via courier or local pharmacy." },
      ]),
    ],
  });
  return (
    <main id="main">
      <Hero />
      <SocialProof />

      {/* SEO library entry — internal linking hub (new, preserves old sections below) */}
      <section aria-labelledby="lib-h" className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <p className="eyebrow text-saffron-700 text-center">Explore by need</p>
        <h2 id="lib-h" className="mt-2 font-display text-[30px] sm:text-[36px] text-center text-forest-950">Start from your child's concern</h2>
        <p className="mt-2 text-center text-[14.5px] text-forest-800/65 max-w-2xl mx-auto">Every topic below is a full guide — symptoms, assessment, home care, red flags and honest Ayurvedic co-care. No thin pages.</p>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURED_CONDITIONS.map((c) => (
            <Link key={c.slug} to={`/conditions/${c.slug}/`} className="group rounded-2xl border border-forest-900/10 bg-white p-5 hover:border-saffron-500/50 hover:shadow-luxe transition-all">
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-saffron-700">{c.category}</span>
              <span className="mt-1 block font-display text-[19px] text-forest-950">{c.title}</span>
              <span className="mt-1 block text-[13px] text-forest-800/60 line-clamp-2">{c.intro.slice(0, 140)}…</span>
              <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-forest-800">Read guide <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></span>
            </Link>
          ))}
        </div>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { to: "/conditions/", icon: Baby, t: "All 22 conditions", d: "A–Z library with red flags" },
            { to: "/treatments/customized-suvarnaprashan/", icon: Leaf, t: "Suvarnaprashan", d: "Customized drops, honestly explained" },
            { to: "/articles/", icon: BookOpen, t: "Parent articles", d: "Sleep, screens, iron & more" },
            { to: "/ayurvedic-doctor-indore/", icon: MapPin, t: "Visit in Indore", d: "Address, timings, booking" },
          ].map((c) => (
            <Link key={c.to} to={c.to} className="rounded-2xl bg-forest-950 text-cream-50 p-4 flex items-center gap-3 hover:bg-forest-900 transition-colors">
              <c.icon className="w-5 h-5 text-saffron-300 shrink-0" />
              <span><span className="block font-medium text-[14.5px]">{c.t}</span><span className="block text-[12px] text-cream-100/60">{c.d}</span></span>
            </Link>
          ))}
        </div>
        <div className="mt-6"><AdSlot slot="below-hero" /></div>
      </section>

      <DoctorIntro />
      <Specialties />

      {/* Treatments preview */}
      <section aria-labelledby="treat-h" className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <p className="eyebrow text-saffron-700 text-center">Treatments & services</p>
        <h2 id="treat-h" className="mt-2 font-display text-[30px] text-center text-forest-950">What the clinic offers</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TREATMENTS.slice(0, 4).map((t) => (
            <Link key={t.slug} to={`/${t.base}/${t.slug}/`} className="rounded-2xl border border-forest-900/10 bg-cream-100 p-5 hover:border-saffron-500/50 hover:shadow-luxe transition-all">
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-saffron-700">{t.category}</span>
              <span className="mt-1 block font-display text-[18px] text-forest-950">{t.title}</span>
              <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-forest-800">Learn more <ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-center"><Link to="/treatments/" className="text-[14px] font-semibold text-saffron-700 hover:text-forest-900">All {TREATMENTS.length} treatments & services →</Link></p>
      </section>

      <MethodShowcase />
      <Benefits />

      {/* Articles preview */}
      <section aria-labelledby="art-h" className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <p className="eyebrow text-saffron-700 text-center">Parent education</p>
        <h2 id="art-h" className="mt-2 font-display text-[30px] text-center text-forest-950">Latest health articles</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ARTICLES.slice(0, 3).map((a) => (
            <Link key={a.slug} to={`/articles/${a.slug}/`} className="rounded-2xl border border-forest-900/10 bg-white p-5 hover:border-saffron-500/50 hover:shadow-luxe transition-all">
              <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-saffron-700">{a.category} • {a.readMins} min</span>
              <span className="mt-1 block font-display text-[18px] text-forest-950">{a.title}</span>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-center"><Link to="/articles/" className="text-[14px] font-semibold text-saffron-700 hover:text-forest-900">Browse all {ARTICLES.length} articles →</Link></p>
      </section>

      <Testimonials />
      <Pricing />
      <FAQ />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8"><AuthorBox /></div>
      <BookingSection />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 pb-12"><CtaBand /></div>
    </main>
  );
}
