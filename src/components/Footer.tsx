import { Leaf, Phone, Mail, MapPin, Clock, Heart, ShieldCheck, ArrowUpRight, Star } from "lucide-react";
import { SITE, STATS, telLink, mailLink } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-forest-950 text-cream-100 overflow-hidden" aria-label="Footer">
      <div className="absolute inset-0 opacity-10" aria-hidden>
        <div className="absolute -top-32 left-1/3 w-96 h-96 rounded-full bg-saffron-400 blur-[100px]" />
      </div>

      {/* CTA strip */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="text-center md:text-left">
            <p className="flex items-center justify-center md:justify-start gap-1.5 text-saffron-300 text-sm font-semibold">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5" fill="currentColor" />
              ))}
              <span className="ml-1.5">{STATS.rating} from {STATS.reviewCount}+ parent reviews</span>
            </p>
            <p className="mt-3 font-display font-light text-[26px] sm:text-[34px] text-white leading-[1.12]">
              Every week of waiting is another flare, fever or sleepless night.
            </p>
            <p className="mt-1.5 text-white/60 text-[15px]">Give your child the gentle healing they deserve — starting this week.</p>
          </div>
          <a
            href="#book"
            className="btn-shine shrink-0 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-saffron-300 via-saffron-400 to-saffron-500 text-forest-950 font-medium tracking-wide px-8 py-4 shadow-luxe hover:brightness-110 hover:-translate-y-0.5 transition-all duration-700"
          >
            Book now — slots fill fast <ArrowUpRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr]">
        <div>
          <a href="#top" className="flex items-center gap-3">
            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 text-forest-950">
              <Leaf className="w-6 h-6" />
            </span>
            <span>
              <span className="block font-display font-normal text-[21px] text-white">{SITE.doctorName}</span>
              <span className="block text-xs tracking-widest uppercase text-saffron-300 font-semibold">{SITE.shortCreds}</span>
            </span>
          </a>
          <p className="mt-4 text-[14px] leading-relaxed text-white/60 max-w-sm">
            Ayurvedic child health specialist helping {STATS.patientsTreated.toLocaleString("en-IN")}+ kids heal skin, growth,
            respiratory, allergy & developmental concerns from the root — gently, safely, and with love.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs text-white/50">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Registered Ayurvedic Practitioner • Ethical, evidence-conscious care
          </div>
        </div>

        <nav aria-label="Explore">
          <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-saffron-400">Explore</p>
          <ul className="mt-4 space-y-2.5 text-[14px]">
            {[
              ["Meet the Doctor", "#doctor"],
              ["Specialties", "#specialties"],
              ["Healing Method", "#method"],
              ["Parent Stories", "#stories"],
              ["Plans & Pricing", "#plans"],
              ["FAQs", "#faq"],
            ].map(([l, h]) => (
              <li key={h + l}>
                <a href={h} className="text-white/65 hover:text-saffron-300 transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Specialties">
          <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-saffron-400">Specialties</p>
          <ul className="mt-4 space-y-2.5 text-[14px] text-white/65">
            <li>Skin Diseases in Kids</li>
            <li>Speech, ADHD & Development</li>
            <li>Growth & Appetite</li>
            <li>Asthma & Recurrent Cold</li>
            <li>Allergies & Immunity</li>
            <li>Suvarnaprashan Sanskar</li>
          </ul>
        </nav>

        <div>
          <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-saffron-400">Reach the clinic</p>
          <ul className="mt-4 space-y-3 text-[14px]">
            <li><a href={telLink} className="flex items-start gap-2.5 text-white/70 hover:text-saffron-300 transition-colors"><Phone className="w-4 h-4 mt-0.5 text-saffron-300 shrink-0" /> {SITE.phoneDisplay} (Call / WhatsApp)</a></li>
            <li><a href={mailLink} className="flex items-start gap-2.5 text-white/70 hover:text-saffron-300 transition-colors"><Mail className="w-4 h-4 mt-0.5 text-saffron-300 shrink-0" /> {SITE.email}</a></li>
            <li className="flex items-start gap-2.5 text-white/70"><Clock className="w-4 h-4 mt-0.5 text-saffron-300 shrink-0" /> {SITE.hours}</li>
            <li className="flex items-start gap-2.5 text-white/70"><MapPin className="w-4 h-4 mt-0.5 text-saffron-300 shrink-0" /> {SITE.addressShort}</li>
          </ul>
          <a href="#book" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 text-white text-sm font-semibold px-5 py-3 hover:bg-white/15 transition-colors">
            Fill patient enquiry form <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/45">
          <p>© {year} {SITE.doctorName} • {SITE.clinicName}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-400" fill="currentColor" /> for healthier childhoods
          </p>
        </div>
        <p className="relative mx-auto max-w-7xl px-4 sm:px-6 pb-6 text-[11px] leading-relaxed text-white/30">
          Disclaimer: Content on this page is for education and does not replace emergency medical advice. For high fever, breathing
          difficulty, dehydration or any emergency, seek urgent care immediately. Results vary by child and consistency of treatment.
        </p>
      </div>
    </footer>
  );
}
