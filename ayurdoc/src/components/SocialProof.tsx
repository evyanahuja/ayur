"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { SectionMandalas } from "./ScrollMandala";
import { CONDITIONS, STATS } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";

function Counter({ target, suffix = "", duration = 1600 }: { target: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let raf: number;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function SocialProof() {
  const { t } = useLanguage();
  const localized = CONDITIONS.map((c, i) => ({ icon: c.icon, label: t.socialProof.conditions[i] ?? c.label }));
  const doubled = [...localized, ...localized];
  const band = [
    { v: STATS.patientsTreated, suffix: "+", ...t.socialProof.stats[0] },
    { v: STATS.yearsExperience, suffix: "+", ...t.socialProof.stats[1] },
    { v: STATS.improvementPercent, suffix: "%", ...t.socialProof.stats[2] },
    { v: STATS.citiesServed, suffix: "+", ...t.socialProof.stats[3] },
  ];

  return (
    <section id="proof" aria-label={t.socialProof.aria} className="mandala-section relative py-10 sm:py-14">
      <SectionMandalas id="proof" palette="marigold" side="right" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="text-center text-[10.5px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-saffron-700/80">
            {t.socialProof.trustedByPre} {STATS.patientsTreated.toLocaleString("en-IN")}+ {t.socialProof.trustedByMid}
          </p>
        </Reveal>

        <Reveal delay={120} variant="scale" className="mt-6 relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#fffdf8] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#fffdf8] to-transparent z-10 pointer-events-none" />
          <div className="overflow-hidden rounded-2xl">
            <div className="flex gap-3 w-max animate-marquee hover:[animation-play-state:paused] py-1" role="list">
              {doubled.map((c, i) => (
                <span
                  key={i}
                  role="listitem"
                  className="inline-flex items-center gap-3 rounded-full bg-white gold-hairline shadow-luxe pl-2 pr-6 py-2 text-[13.5px] font-medium tracking-wide text-forest-900 whitespace-nowrap hover:-translate-y-0.5 transition-all duration-500"
                >
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-gradient-to-br from-forest-800 to-forest-600 text-cream-100">
                    <c.icon className="w-4 h-4" />
                  </span>
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={150} className="mt-8">
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-forest-900 to-forest-950 gold-hairline text-cream-50 shadow-luxe-lg">
            <div className="absolute inset-0 opacity-[0.14]" aria-hidden>
              <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-saffron-400 blur-[90px] animate-blob" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-emerald-400 blur-[90px] animate-blob" style={{ animationDelay: "-8s" }} />
            </div>
            <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1.2px, transparent 1.2px)" }} />
            <dl className="relative grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-saffron-500/15">
              {band.map((s) => (
                <div key={s.label} className="px-6 py-7 sm:py-9 text-center group hover:bg-white/5 transition-colors">
                  <dd className="font-display font-light text-[38px] sm:text-[46px] text-gradient-gold group-hover:scale-105 transition-transform duration-700">
                    <Counter target={s.v} suffix={s.suffix} />
                  </dd>
                  <dt className="mt-2 text-[13px] font-medium tracking-wide text-white">{s.label}</dt>
                  <p className="text-xs text-white/55 mt-0.5">{s.sub}</p>
                </div>
              ))}
            </dl>
            <p className="relative text-center text-[11px] text-white/40 pb-5 px-6">
              {t.socialProof.disclaimer}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
