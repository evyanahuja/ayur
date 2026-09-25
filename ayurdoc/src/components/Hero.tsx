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
import { SITE, STATS, AVATARS, IMAGES } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";
import { formatCount } from "@/i18n";
import { LineReveal, CredentialGrid } from "./luxe";
import { SectionMandalas } from "./ScrollMandala";

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
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 90);
    return () => clearTimeout(t);
  }, []);

  const happyKids = useCountUp(STATS.patientsTreated, 2400, mounted);
  const miniStats = [
    { k: `${STATS.yearsExperience}+`, v: t.hero.miniStats[0] },
    { k: `${STATS.improvementPercent}%`, v: t.hero.miniStats[1] },
    { k: t.hero.miniStatsOnline, v: t.hero.miniStats[2] },
  ];

  return (
    <section id="top" className="mandala-section bg-white relative overflow-hidden pt-[96px] sm:pt-[112px] lg:pt-[104px] pb-10 sm:pb-14 lg:pb-16">
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
              <span className="hero-specialty-copy">
                {t.hero.badgeSub}
              </span>
            </div>

            <h1 className="mt-5 sm:mt-6 font-display font-light text-[clamp(2.15rem,4.2vw+0.6rem,3.35rem)] leading-[1.05] text-forest-950">
              <LineReveal
                lines={[
                  <>{t.hero.line1}</>,
                  <>
                    {t.hero.line2Pre}{" "}
                    <span className="relative inline-block">
                      <em className="text-gradient-gold font-normal italic">{t.hero.highlight}</em>
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
                  <>{t.hero.line3}</>,
                ]}
                delay={180}
                step={100}
              />
            </h1>

            <p
              className={`mt-4 sm:mt-5 text-[15px] sm:text-[16.5px] lg:text-[16px] leading-[1.7] text-forest-800/70 max-w-xl transition-all duration-1000 delay-[700ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              {t.hero.descPre} <strong className="text-forest-950 font-semibold">{SITE.doctorName}</strong> {t.hero.descMid1}{" "}
              <em className="font-display italic text-forest-900">{t.hero.rootCause}</em> {t.hero.descMid2}
            </p>

            <div
              className={`hero-actions mt-6 sm:mt-7 transition-opacity duration-1000 delay-[820ms] ${mounted ? "opacity-100" : "opacity-0"}`}
            >
              <a href="#book" className="hero-action hero-action--primary btn-shine group">
                <span className="hero-action__icon" aria-hidden="true">
                  <CalendarCheck className="w-[18px] h-[18px]" />
                </span>
                <span className="hero-action__label">{t.hero.bookBtn}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href="#method" className="hero-action hero-action--secondary gold-hairline group">
                <span className="hero-action__icon" aria-hidden="true">
                  <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
                </span>
                <span className="hero-action__label">{t.hero.methodBtn}</span>
              </a>
            </div>

            <div
              className={`mt-6 sm:mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 transition-all duration-1000 delay-[940ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
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
                    {STATS.patientsTreated >= 1000 ? `${Math.round(STATS.patientsTreated / 1000)}k+` : `${STATS.patientsTreated}+`}
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
                    <strong className="text-forest-950">{happyKids.toLocaleString("en-IN")}+</strong> {t.hero.happyPatients}
                  </p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-11 bg-gradient-to-b from-transparent via-saffron-500/40 to-transparent" aria-hidden />
              <div className="flex items-center gap-2.5 text-[13px] font-medium text-forest-800 tracking-wide">
                <ShieldCheck className="w-[18px] h-[18px] shrink-0 text-forest-600" />
                {t.hero.trust}
              </div>
            </div>

            <dl
              className={`mt-6 sm:mt-7 grid grid-cols-3 max-w-md rounded-2xl glass gold-hairline p-1.5 transition-all duration-1000 delay-[1060ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
            >
              {miniStats.map((s, i) => (
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

          <div
            className={`relative mx-auto w-full min-w-0 max-w-[420px] lg:max-w-[440px] transition-opacity duration-[1400ms] delay-300 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <div className="relative">
              <div className="absolute -inset-6 -z-10" aria-hidden>
                <div className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-saffron-300/50 via-cream-200 to-forest-200/60 blur-3xl animate-halo" />
              </div>
              <div data-portrait-frame="hero" className="relative p-1.5 sm:p-2 arch-frame bg-gradient-to-br from-saffron-400/70 via-cream-100 to-saffron-500/50 shadow-luxe-lg">
                <div className="relative arch-frame overflow-hidden bg-forest-100">
                  <img
                    src={IMAGES.doctorPortrait}
                    alt={`${SITE.doctorName} — ${SITE.qualification}, Ayurvedic child health specialist`}
                    className="w-full h-[360px] sm:h-[420px] lg:h-[460px] object-cover object-top"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-40 sm:h-44 bg-gradient-to-t from-forest-950 via-forest-950/45 to-transparent" aria-hidden />
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-left">
                    <p className="inline-flex items-center gap-2 rounded-full glass-dark text-white/90 text-[10px] sm:text-[11px] font-medium px-3 py-1.5 tracking-wide">
                      <span className="relative flex w-1.5 h-1.5 shrink-0">
                        <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </span>
                      {t.hero.accepting}
                    </p>
                    <p className="mt-2.5 font-display font-light text-white text-[17px] sm:text-[19px] leading-[1.3]">
                      “{t.hero.quote1} <em className="text-saffron-300">{t.hero.quoteHighlight}</em>{t.hero.quote2}”
                    </p>
                    <p className="mt-1.5 text-[11px] sm:text-[12px] text-white/60 font-medium tracking-[0.14em] uppercase">— {SITE.doctorName}</p>
                  </div>
                </div>
              </div>
            </div>

            <CredentialGrid
              label={t.hero.credGridLabel}
              items={[
                {
                  id: "qualification",
                  icon: <Stethoscope className="w-[18px] h-[18px]" />,
                  title: t.hero.credQualTitle,
                  subtitle: t.hero.credQualSub,
                },
                {
                  id: "approach",
                  icon: <HeartHandshake className="w-[18px] h-[18px]" />,
                  title: t.hero.credRootTitle,
                  subtitle: formatCount(t.hero.credRootSub, STATS.patientsTreated),
                  tone: "gold",
                },
                {
                  id: "suvarnaprashan",
                  icon: <Leaf className="w-[18px] h-[18px]" />,
                  title: t.hero.credSuvarnaTitle,
                  subtitle: t.hero.credSuvarnaSub,
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
