"use client";

import { useState } from "react";
import { ArrowUpRight, Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionMandalas } from "./ScrollMandala";
import { cn } from "@/lib/cn";
import { SPECIALTIES } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";
import { GoldRule, TiltCard } from "./luxe";

export function Specialties() {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const items = SPECIALTIES.map((s, i) => ({
    ...s,
    ...t.specialties.items[i],
  }));

  return (
    <section id="specialties" className="mandala-section relative py-12 sm:py-16 scroll-mt-24">
      <SectionMandalas id="specialties" palette="lotus" side="right" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 rounded-full bg-saffron-500/10 border border-saffron-500/25 text-saffron-700 text-[11px] font-semibold tracking-[0.24em] uppercase px-4 py-2">
            <Star className="w-3.5 h-3.5" fill="currentColor" /> {t.specialties.eyebrow}
          </p>
          <h2 className="mt-6 font-display font-light text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.02] text-forest-950">
            {t.specialties.headingPre}{" "}
            <span className="italic text-gradient-forest">{t.specialties.headingHighlight}</span>
          </h2>
          <p className="mt-4 text-[16px] sm:text-[17.5px] text-forest-800/65 leading-[1.75]">
            {t.specialties.desc}
          </p>
        </Reveal>

        <div className="mt-9 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {items.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 110} variant="scale" className="h-full">
              <TiltCard className="h-full" max={5}>
              <article
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                tabIndex={0}
                className={cn(
                  "group relative h-full rounded-[28px] bg-white gold-hairline p-7 sm:p-8 overflow-hidden text-left transition-shadow duration-700",
                  active === i ? "shadow-luxe-lg" : "shadow-luxe"
                )}
              >
                <div className={cn("absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r opacity-90", s.gradient)} aria-hidden />
                <div className={cn("absolute -right-14 -top-14 w-44 h-44 rounded-full opacity-60 blur-2xl transition-opacity", s.bg, active === i ? "opacity-100" : "opacity-40")} aria-hidden />

                <div className="relative flex items-start justify-between gap-3">
                  <span className={cn("grid place-items-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br text-white shadow-lg p-3", s.gradient)}>
                    <s.icon className="w-6 h-6" strokeWidth={2.1} />
                  </span>
                  <span className="inline-flex items-center rounded-full bg-forest-950 text-saffron-300 text-[9.5px] font-semibold px-3.5 py-1.5 tracking-[0.18em] uppercase">
                    {s.tag}
                  </span>
                </div>

                <h3 className="relative mt-6 font-display font-normal text-[25px] sm:text-[27px] text-forest-950 leading-tight">{s.title}</h3>
                <p className="relative mt-2 text-[10.5px] font-semibold text-saffron-700 tracking-[0.16em] uppercase">{s.subtitle}</p>
                <GoldRule className="relative mt-4 opacity-60" />
                <p className="relative mt-4 text-[14.5px] leading-[1.7] text-forest-800/65">{s.desc}</p>

                <ul className="relative mt-4 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-[13.5px] font-medium text-forest-900/85">
                      <span className={cn("w-1.5 h-1.5 rounded-full bg-gradient-to-r shrink-0", s.gradient)} />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="relative mt-6 flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-cream-100 to-forest-50/60 border border-saffron-500/15 px-4 py-3.5">
                  <span className="text-[12.5px] font-semibold text-forest-800 tracking-wide">✦ {s.result}</span>
                  <a
                    href="#book"
                    className="inline-flex items-center gap-1 text-[13px] font-bold text-forest-900 hover:text-saffron-600 transition-colors"
                    aria-label={`${t.specialties.bookFor} ${s.title}`}
                  >
                    {t.specialties.consult} <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-8 text-center">
          <p className="text-sm text-forest-700/70">
            {t.specialties.footerPre} <a href="#book" className="font-bold text-forest-900 underline decoration-saffron-400 decoration-2 underline-offset-4 hover:text-saffron-700">{t.specialties.footerLink}</a> {t.specialties.footerPost}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
