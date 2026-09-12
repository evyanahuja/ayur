"use client";

import { useEffect, useState } from "react";
import {
  Star,
  ShieldCheck,
  CalendarCheck,
  Play,
  Leaf,
  BadgeCheck,
  Stethoscope,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";
import { SITE, STATS, HERO_MINI_STATS, AVATARS, IMAGES } from "@/content/site";
import { LineReveal, Spotlight, CredentialGrid } from "./luxe";

function useCountUp(target: number, duration = 2200, started: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, started]);
  return val;
}

export function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 90);
    return () => clearTimeout(t);
  }, []);

  const happyKids = useCountUp(STATS.patientsTreated, 2400, mounted);

  return (
    <section id="top" className="relative overflow-hidden pt-[120px] sm:pt-[150px] pb-14 sm:pb-24">
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-cream-200 via-cream-50 to-[#fffefb]" />
        <div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-forest-200/45 blur-[130px] animate-blob" />
        <div className="absolute top-10 -right-40 w-[600px] h-[600px] rounded-full bg-saffron-300/45 blur-[140px] animate-blob" style={{ animationDelay: "-8s" }} />
        <div className="absolute bottom-0 left-1/3 w-[460px] h-[320px] rounded-full bg-sage-200/50 blur-[110px] animate-blob" style={{ animationDelay: "-15s" }} />
        <div className="absolute inset-0 mandala-bg opacity-60 animate-spin-slow" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron-500/40 to-transparent" />
      </div>

      <Spotlight className="mx-auto max-w-7xl px-4 sm:px-6" size={620}>
        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-12 lg:gap-10 items-center">
          <div className="hero-copy max-w-2xl">
            <div
              className={`inline-flex items-center gap-2.5 rounded-full glass gold-hairline pl-1.5 pr-5 py-1.5 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-950 text-cream-100 text-[11px] font-semibold px-3.5 py-1.5 tracking-wide">
                <BadgeCheck className="w-3.5 h-3.5 shrink-0 text-saffron-400" /> MD KAUMARBHRITYA
              </span>
              <span className="text-[12.5px] font-medium text-forest-800 tracking-wide">
                Ayurvedic Pediatrician · Balarog Specialist
              </span>
            </div>

            <h1 className="mt-8 font-display font-light text-[clamp(2.6rem,6.4vw,4.9rem)] leading-[0.98] text-forest-950">
              <LineReveal
                lines={[
                  <>Gentle Ayurvedic care</>,
                  <>for your child&apos;s</>,
                  <span key="l3" className="relative inline-block">
                    <em className="text-gradient-gold font-normal italic">healthiest</em>
                    <svg viewBox="0 0 240 12" className="absolute -bottom-1.5 left-0 w-full" aria-hidden>
                      <path d="M4 8 C 70 2, 165 2, 236 6" stroke="url(#goldline)" strokeWidth="3" strokeLinecap="round" fill="none" />
                      <defs>
                        <linearGradient id="goldline" x1="0" x2="1">
                          <stop offset="0%" stopColor="#d4a24c" stopOpacity="0.2" />
                          <stop offset="50%" stopColor="#e5c07b" />
                          <stop offset="100%" stopColor="#d4a24c" stopOpacity="0.2" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>,
                  <>childhood</>,
                ]}
                delay={220}
                step={125}
              />
            </h1>

            <p
              className={`mt-7 text-[16.5px] sm:text-[18px] leading-[1.75] text-forest-800/70 max-w-xl transition-all duration-1000 delay-[700ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              I&apos;m <strong className="text-forest-950 font-semibold">{SITE.doctorName}</strong> — helping parents heal the{" "}
              <em className="font-display italic text-forest-900">root cause</em> of skin, growth, respiratory, allergy &
              developmental concerns with safe, child-friendly Ayurveda. No steroids-first. No guesswork. Just thriving kids.
            </p>

            {/* Equal-size links: no independent movement or content-based heights. */}
            <div
              className={`hero-actions mt-9 transition-opacity duration-1000 delay-[820ms] ${mounted ? "opacity-100" : "opacity-0"}`}
            >
              <a href="#book" className="hero-action hero-action--primary btn-shine group">
                <span className="hero-action__icon" aria-hidden="true">
                  <CalendarCheck className="w-[18px] h-[18px]" />
                </span>
                <span className="hero-action__label">Book Your Child&apos;s Visit</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href="#method" className="hero-action hero-action--secondary gold-hairline group">
                <span className="hero-action__icon" aria-hidden="true">
                  <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
                </span>
                <span className="hero-action__label">See how healing works</span>
              </a>
            </div>

            <div
              className={`mt-10 flex flex-wrap items-center gap-x-8 gap-y-5 transition-all duration-1000 delay-[940ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              <div className="flex items-center gap-3.5">
                <div className="flex -space-x-3">
                  {AVATARS.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-cream-50 shadow-md hover:scale-110 hover:z-10 transition-transform duration-500"
                      loading="eager"
                    />
                  ))}
                  <span className="grid place-items-center w-11 h-11 rounded-full bg-forest-950 text-saffron-300 text-[10px] font-bold ring-2 ring-cream-50 shadow-md">
                    5k+
                  </span>
                </div>
                <div className="leading-tight">
                  <div className="flex items-center gap-1" aria-label={`Rated ${STATS.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-[13px] h-[13px] text-saffron-500" fill="currentColor" />
                    ))}
                    <span className="ml-1.5 text-[13px] font-bold text-forest-950">{STATS.rating}</span>
                  </div>
                  <p className="text-[12.5px] text-forest-700/65 font-medium mt-1">
                    <strong className="text-forest-950">{happyKids.toLocaleString("en-IN")}+</strong> happy little patients
                  </p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-11 bg-gradient-to-b from-transparent via-saffron-500/40 to-transparent" aria-hidden />
              <div className="flex items-center gap-2.5 text-[13px] font-medium text-forest-800 tracking-wide">
                <ShieldCheck className="w-[18px] h-[18px] shrink-0 text-forest-600" />
                Safe · Steroid-conscious · Kid-friendly herbs
              </div>
            </div>

            <dl
              className={`mt-9 grid grid-cols-3 max-w-md rounded-2xl glass gold-hairline p-1.5 transition-all duration-1000 delay-[1060ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              {HERO_MINI_STATS.map((s, i) => (
                <div
                  key={s.v}
                  className={`text-center px-2 py-3.5 rounded-xl hover:bg-white/70 transition-colors duration-500 ${i < 2 ? "border-r border-saffron-500/15" : ""}`}
                >
                  <dt className="font-display font-normal text-[22px] sm:text-[26px] text-forest-950 leading-none">{s.k}</dt>
                  <dd className="text-[10.5px] sm:text-[11px] text-forest-700/60 font-medium mt-1.5 tracking-wide">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Portrait and credentials share one column in normal document flow. */}
          <div
            className={`relative mx-auto w-full min-w-0 max-w-[500px] transition-opacity duration-[1400ms] delay-300 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="relative">
              <div className="absolute -inset-8 -z-10" aria-hidden>
                <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-saffron-300/50 via-cream-200 to-forest-200/60 blur-3xl animate-halo" />
              </div>
              <div data-portrait-frame="hero" className="relative p-2 arch-frame bg-gradient-to-br from-saffron-400/70 via-cream-100 to-saffron-500/50 shadow-luxe-lg">
                <div className="relative arch-frame overflow-hidden bg-forest-100">
                  <img
                    src={IMAGES.doctorPortrait}
                    alt={`${SITE.doctorName} — ${SITE.qualification}, Ayurvedic child health specialist`}
                    className="w-full h-[490px] sm:h-[580px] object-cover object-top"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-forest-950 via-forest-950/45 to-transparent" aria-hidden />
                  <div className="absolute bottom-0 inset-x-0 p-6 text-left">
                    <p className="inline-flex items-center gap-2 rounded-full glass-dark text-white/90 text-[11px] font-medium px-3.5 py-1.5 tracking-wide">
                      <span className="relative flex w-1.5 h-1.5 shrink-0">
                        <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </span>
                      Accepting new patients · Online & In-Clinic
                    </p>
                    <p className="mt-3 font-display font-light text-white text-[21px] leading-[1.3]">
                      “Every child deserves healing that <em className="text-saffron-300">nurtures</em>, not suppresses.”
                    </p>
                    <p className="mt-2 text-[12px] text-white/60 font-medium tracking-[0.14em] uppercase">— {SITE.doctorName}</p>
                  </div>
                </div>
              </div>
            </div>

            <CredentialGrid
              label="Qualifications and approach"
              items={[
                {
                  id: "qualification",
                  icon: <Stethoscope className="w-[18px] h-[18px]" />,
                  title: "MD · Kaumarbhritya",
                  subtitle: "Ayurvedic Pediatrics",
                },
                {
                  id: "approach",
                  icon: <HeartHandshake className="w-[18px] h-[18px]" />,
                  title: "Root-cause healing",
                  subtitle: `${STATS.patientsTreated.toLocaleString("en-IN")}+ families helped`,
                  tone: "gold",
                },
                {
                  id: "suvarnaprashan",
                  icon: <Leaf className="w-[18px] h-[18px]" />,
                  title: "Suvarnaprashan",
                  subtitle: "Immunity & intellect drops",
                  tone: "sage",
                },
              ]}
            />
          </div>
        </div>
      </Spotlight>
    </section>
  );
}
