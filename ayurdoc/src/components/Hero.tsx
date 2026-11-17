"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CalendarCheck, Play, Leaf, BadgeCheck, HeartHandshake, ArrowRight, ShieldCheck } from "lucide-react";
import { SITE, IMAGES } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";
import { useExpansion } from "@/i18n/expansion";
import { LineReveal, CredentialGrid } from "./luxe";
import { SectionMandalas } from "./ScrollMandala";

/* Homepage hero: all-age positioning with pediatric expertise retained as a differentiator.
   Supports all 4 languages (EN, HI, MR, GU) via useExpansion(lang). */
export function Hero() {
  const { lang, t } = useLanguage();
  const h = useExpansion(lang).hero;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 90);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="top"
      className="home-hero mandala-section bg-gradient-to-b from-[#fffdf8] via-white to-cream-50/50 relative overflow-hidden pt-[96px] sm:pt-[112px] lg:pt-[104px] pb-8 lg:pb-6"
    >
      <SectionMandalas id="hero" hero />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.9fr)] gap-8 lg:gap-8 xl:gap-10 items-center">
          <div className="hero-copy max-w-xl lg:max-w-none">
            <div
              className={`hero-specialty-pill transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              <span className="hero-specialty-chip">
                <BadgeCheck className="w-3.5 h-3.5 shrink-0 text-saffron-400" /> {t.hero.badge}
              </span>
              <span className="hero-specialty-copy">{t.hero.badgeSub}</span>
            </div>

            <h1 className="hero-headline mt-4 sm:mt-5 font-display font-light leading-[1.05] text-forest-950">
              <LineReveal
                lines={[
                  <>{h.line1}</>,
                  <>
                    {h.line2Pre}{" "}
                    <span className="relative inline-block">
                      <em className="text-gradient-gold font-normal italic">{h.highlight}</em>
                      <svg viewBox="0 0 240 12" className="absolute -bottom-1 left-0 w-full" aria-hidden>
                        <path d="M4 8 C 70 2, 165 2, 236 6" stroke="url(#goldline)" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <defs>
                          <linearGradient id="goldline" x1="0" x2="1">
                            <stop offset="0%" stopColor="#d4a24c" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#e5c07b" />
                            <stop offset="100%" stopColor="#d4a24c" stopOpacity="0.2" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                  </>,
                  <>{h.line3}</>,
                ]}
                delay={180}
                step={100}
              />
            </h1>

            <p
              className={`mt-4 text-[15px] sm:text-[16px] leading-[1.65] text-forest-900/82 max-w-xl transition-all duration-1000 delay-[700ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              {h.subheadingPre} <strong className="text-forest-950 font-semibold">{t.site.doctorName}</strong>
              {h.subheadingPost}
            </p>

            <div
              className={`hero-actions mt-5 transition-opacity duration-1000 delay-[820ms] ${mounted ? "opacity-100" : "opacity-0"}`}
            >
              <a href="#book" className="hero-action hero-action--primary btn-shine group">
                <span className="hero-action__icon" aria-hidden="true">
                  <CalendarCheck className="w-[18px] h-[18px]" />
                </span>
                <span className="hero-action__label">{h.bookBtn}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href="#method" className="hero-action hero-action--secondary gold-hairline group">
                <span className="hero-action__icon" aria-hidden="true">
                  <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
                </span>
                <span className="hero-action__label">{h.methodBtn}</span>
              </a>
            </div>

            <div
              className={`hero-registration mt-5 flex items-start transition-all duration-1000 delay-[940ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              <div className="flex items-start gap-2.5 text-[12px] sm:text-[13px] font-medium leading-relaxed text-forest-800">
                <ShieldCheck className="mt-0.5 w-[18px] h-[18px] shrink-0 text-forest-600" />
                {t.site.qualification}
              </div>
            </div>
          </div>

          <div
            className={`relative mx-auto w-full min-w-0 max-w-[420px] lg:max-w-[440px] transition-opacity duration-[1400ms] delay-300 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="relative">
              <div className="absolute -inset-6 -z-10" aria-hidden>
                <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-saffron-300/50 via-cream-200 to-forest-200/60 blur-3xl animate-halo" />
              </div>
              <div
                data-portrait-frame="hero"
                className="relative p-1.5 sm:p-2 arch-frame bg-gradient-to-br from-saffron-400/70 via-cream-100 to-saffron-500/50 shadow-luxe-lg"
              >
                <div className="relative arch-frame overflow-hidden bg-forest-100">
                  <Image
                    src={IMAGES.doctorPortrait}
                    alt={`${SITE.doctorName} — ${SITE.qualification}`}
                    width={600}
                    height={900}
                    sizes="(min-width: 1024px) 440px, (min-width: 640px) 420px, calc(100vw - 2rem)"
                    priority
                    className="hero-portrait-image w-full object-cover object-top"
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-40 sm:h-44 bg-gradient-to-t from-forest-950 via-forest-950/45 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-left">
                    <p className="inline-flex items-center gap-2 rounded-full glass-dark text-white/90 text-[10px] sm:text-[11px] font-medium px-3 py-1.5 tracking-wide">
                      <span className="relative flex w-1.5 h-1.5 shrink-0">
                        <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </span>
                      {t.hero.accepting}
                    </p>
                    <p className="mt-2.5 font-display font-light text-white text-[17px] sm:text-[19px] leading-[1.3]">
                      {h.quote}
                    </p>
                    <p className="mt-1.5 text-[11px] sm:text-[12px] text-white/60 font-medium tracking-[0.14em] uppercase">
                      — {t.site.doctorName}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <CredentialGrid
              label={t.hero.credGridLabel}
              items={[
                {
                  id: "approach",
                  icon: <HeartHandshake className="w-[18px] h-[18px]" />,
                  title: h.credApproachTitle,
                  subtitle: h.credApproachSub,
                  tone: "gold",
                },
                {
                  id: "therapies",
                  icon: <Leaf className="w-[18px] h-[18px]" />,
                  title: h.credTherapiesTitle,
                  subtitle: h.credTherapiesSub,
                  tone: "sage",
                },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
