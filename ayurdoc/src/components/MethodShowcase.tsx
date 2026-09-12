"use client";

import { useState } from "react";
import { Leaf, ArrowRight, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionMandalas } from "./ScrollMandala";
import { cn } from "@/lib/cn";
import { METHOD_STEPS, THERAPIES } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";
import { STATS } from "@/content/site";
import { formatCount } from "@/i18n";

export function MethodShowcase() {
  const { t } = useLanguage();
  const [tab, setTab] = useState(0);
  const STEPS = METHOD_STEPS.map((s, i) => ({ ...s, ...t.method.steps[i] }));
  const TH = THERAPIES.map((th, i) => ({
    ...th,
    name: t.method.therapies[i].name,
    tag: t.method.therapies[i].tag,
    desc: i === 0 ? formatCount(t.method.therapies[i].desc, STATS.suvarnaprashanKids) : t.method.therapies[i].desc,
  }));
  const cur = TH[tab];

  return (
    <section id="method" className="mandala-section relative py-12 sm:py-16 scroll-mt-24 overflow-hidden">
      <SectionMandalas id="method" palette="marigold" side="left" dark />
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900 to-forest-950" />
        <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[120px] animate-blob" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-saffron-500/20 blur-[120px] animate-blob" style={{ animationDelay: "-9s" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 rounded-full glass-dark text-saffron-300 text-[10px] font-semibold tracking-[0.28em] uppercase px-5 py-2.5">
            <Leaf className="w-3.5 h-3.5" /> {t.method.eyebrow}
          </p>
          <h2 className="mt-6 font-display font-light text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.02] text-white">
            {t.method.headingPre} <span className="italic text-saffron-300">{t.method.headingHighlight}</span>
          </h2>
          <p className="mt-5 text-[16px] sm:text-[17.5px] text-white/60 leading-[1.75]">
            {t.method.desc}
          </p>
        </Reveal>

        <ol className="mt-9 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 100} variant="scale">
              <li className="group relative h-full rounded-[26px] bg-white/[0.05] backdrop-blur-xl gold-hairline p-7 hover:bg-white/[0.08] hover:-translate-y-2 transition-all duration-700 overflow-hidden">
                <span className="absolute -right-2 -top-4 font-display text-[88px] leading-none text-white/[0.06] font-semibold select-none group-hover:text-saffron-400/10 transition-colors" aria-hidden>
                  {s.n}
                </span>
                <span className="relative grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 text-forest-950 shadow-lg shadow-saffron-500/25">
                  <s.icon className="w-6 h-6" strokeWidth={2} />
                </span>
                <p className="relative mt-4 text-[9.5px] font-semibold tracking-[0.22em] uppercase text-saffron-400">{s.time}</p>
                <h3 className="relative mt-2 font-display font-normal text-[21px] text-white leading-snug">{s.title}</h3>
                <p className="relative mt-2.5 text-[13.5px] leading-relaxed text-white/60">{s.desc}</p>
                {i < 3 && (
                  <span className="hidden xl:block absolute top-1/2 -right-3 text-saffron-400/50" aria-hidden>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </li>
            </Reveal>
          ))}
        </ol>

        <div className="mt-9 grid lg:grid-cols-[0.95fr_1.05fr] gap-6 items-stretch">
          <Reveal variant="left" className="rounded-[28px] overflow-hidden border border-white/10 bg-white/[0.05] backdrop-blur-xl">
            <div className="p-6 sm:p-8">
              <h3 className="font-display font-normal text-[25px] text-white">{t.method.therapiesTitle}</h3>
              <p className="mt-2 text-sm text-white/55">{t.method.therapiesDesc}</p>
              <div className="mt-6 grid gap-3" role="tablist" aria-label={t.method.therapiesAria}>
                {TH.map((th, i) => (
                  <button
                    key={th.name}
                    role="tab"
                    aria-selected={tab === i}
                    onClick={() => setTab(i)}
                    className={cn(
                      "flex items-center gap-4 rounded-2xl p-4 text-left border transition-all duration-300",
                      tab === i
                        ? "bg-gradient-to-r from-saffron-400 to-saffron-500 border-transparent shadow-lg shadow-saffron-500/25 text-forest-950"
                        : "bg-white/[0.05] border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                    )}
                  >
                    <span className={cn("grid place-items-center w-11 h-11 rounded-xl shrink-0", tab === i ? "bg-forest-950 text-saffron-300" : "bg-white/10 text-saffron-300")}>
                      <th.icon className="w-5 h-5" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-bold text-[15px] leading-tight">{th.name}</span>
                      <span className={cn("block text-xs mt-0.5", tab === i ? "text-forest-900/70" : "text-white/50")}>{th.tag}</span>
                    </span>
                    <span className={cn("grid place-items-center w-7 h-7 rounded-full shrink-0", tab === i ? "bg-forest-950 text-white" : "bg-white/10 text-white/60")}>
                      {tab === i ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal variant="right" delay={120} className="relative rounded-[28px] overflow-hidden border border-white/10 min-h-[420px] group">
            <img
              key={cur.img}
              src={cur.img}
              alt={cur.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/35 to-transparent" aria-hidden />
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full glass-dark text-white text-xs font-semibold px-4 py-2">
                <cur.icon className="w-4 h-4 text-saffron-300" /> {cur.tag}
              </span>
              <span className="rounded-full glass-dark text-saffron-300 text-xs font-bold px-3 py-2">
                {String(tab + 1).padStart(2, "0")} / 04
              </span>
            </div>
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8" key={cur.name}>
              <h4 className="font-display font-light text-[26px] sm:text-[32px] text-white leading-tight">{cur.name}</h4>
              <p className="mt-2.5 text-[14px] sm:text-[15px] leading-relaxed text-white/75 max-w-xl">{cur.desc}</p>
              <a href="#book" className="mt-6 btn-shine inline-flex items-center gap-2.5 rounded-full bg-white text-forest-950 font-medium tracking-wide text-[14px] px-6 py-3.5 hover:bg-saffron-300 transition-colors duration-500">
                {t.method.askBtn} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
