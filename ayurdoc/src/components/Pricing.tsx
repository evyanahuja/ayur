"use client";

import { useState } from "react";
import { Check, Sparkles, Video, Building2, Crown, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionMandalas } from "./ScrollMandala";
import { cn } from "@/lib/cn";
import { PLANS } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";

export function Pricing() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<"online" | "clinic">("online");
  const plans = PLANS.map((p, i) => ({
    ...p,
    name: t.pricing.plans[i].name,
    hindi: t.pricing.plans[i].sub,
    period: t.pricing.plans[i].period,
    desc: t.pricing.plans[i].desc,
    features: t.pricing.plans[i].features,
    cta: t.pricing.plans[i].cta,
  }));
  const modes = [
    { id: "online" as const, label: t.pricing.online, icon: Video },
    { id: "clinic" as const, label: t.pricing.clinic, icon: Building2 },
  ];

  return (
    <section id="plans" className="mandala-section relative py-12 sm:py-16 scroll-mt-24">
      <SectionMandalas id="plans" palette="marigold" side="right" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-forest-50/70 to-transparent" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="text-center max-w-3xl mx-auto">
          <p className="inline-flex items-center gap-2 rounded-full bg-saffron-500/10 border border-saffron-500/25 text-saffron-700 text-[11px] font-semibold tracking-[0.24em] uppercase px-4 py-2">
            <Sparkles className="w-3.5 h-3.5" /> {t.pricing.eyebrow}
          </p>
          <h2 className="mt-6 font-display font-light text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.02] text-forest-950">
            {t.pricing.headingPre} <span className="italic text-gradient-gold">{t.pricing.headingHighlight}</span>
          </h2>
          <p className="mt-5 text-[16px] text-forest-800/65 leading-[1.75]">
            {t.pricing.desc}
          </p>

          <div className="mt-6 inline-flex rounded-full bg-white gold-hairline p-1.5 shadow-luxe" role="tablist" aria-label={t.pricing.modeAria}>
            {modes.map((m) => (
              <button
                key={m.id}
                role="tab"
                aria-selected={mode === m.id}
                onClick={() => setMode(m.id)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-6 py-3 text-[13.5px] font-medium tracking-wide transition-all duration-500",
                  mode === m.id ? "bg-forest-950 text-saffron-300 shadow-luxe" : "text-forest-700 hover:bg-cream-100"
                )}
              >
                <m.icon className="w-4 h-4" /> {m.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-9 grid md:grid-cols-3 gap-5 items-stretch max-w-6xl mx-auto">
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 110} variant="scale" className="h-full">
              <article
                className={cn(
                  "relative h-full rounded-[32px] p-8 sm:p-9 flex flex-col overflow-hidden transition-all duration-700 hover:-translate-y-2.5 gold-hairline",
                  p.featured
                    ? "bg-gradient-to-b from-forest-900 to-forest-950 text-white shadow-luxe-lg lg:scale-[1.04]"
                    : "bg-white shadow-luxe hover:shadow-luxe-lg"
                )}
              >
                {p.featured && (
                  <>
                    <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-saffron-500/25 blur-3xl animate-halo" aria-hidden />
                    <span className="absolute top-6 right-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-saffron-300 via-saffron-400 to-saffron-500 text-forest-950 text-[9.5px] font-bold px-3.5 py-1.5 shadow-lg tracking-[0.16em] uppercase">
                      <Crown className="w-3 h-3" /> {t.pricing.mostLoved}
                    </span>
                  </>
                )}
                <span className={cn("grid place-items-center w-12 h-12 rounded-2xl mb-5", p.featured ? "bg-saffron-400 text-forest-950" : "bg-forest-900 text-saffron-300")}>
                  <p.icon className="w-6 h-6" />
                </span>
                <h3 className={cn("font-display font-normal text-[25px] leading-tight", p.featured ? "text-white" : "text-forest-950")}>{p.name}</h3>
                <p className={cn("text-[10px] font-semibold tracking-[0.2em] uppercase mt-2", p.featured ? "text-saffron-300" : "text-saffron-700")}>{p.hindi}</p>
                <p className={cn("mt-4 text-[13.5px] leading-[1.7]", p.featured ? "text-white/60" : "text-forest-700/65")}>{p.desc}</p>

                <div className="mt-6 flex items-end gap-3">
                  <span className={cn("font-display font-light text-[46px] leading-none tracking-tight", p.featured ? "text-gradient-gold" : "text-forest-950")}>{p.price}</span>
                  <span className={cn("text-[13px] line-through mb-1.5", p.featured ? "text-white/35" : "text-slate-400")}>{p.strike}</span>
                </div>
                <p className={cn("mt-1 text-[13px] font-semibold", p.featured ? "text-saffron-300" : "text-forest-600")}>
                  {p.period} • {mode === "online" ? t.booking.modeOnline : t.booking.modeClinic}
                </p>

                <ul className="mt-6 space-y-2.5 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className={cn("flex items-start gap-2.5 text-[13.5px] leading-relaxed", p.featured ? "text-white/85" : "text-forest-900/80")}>
                      <span className={cn("grid place-items-center w-5 h-5 rounded-full shrink-0 mt-0.5", p.featured ? "bg-saffron-400 text-forest-950" : "bg-emerald-100 text-emerald-700")}>
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={`#book?plan=${p.id}`}
                  data-plan={p.id}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
                    window.dispatchEvent(new CustomEvent("select-plan", { detail: p.id }));
                  }}
                  className={cn(
                    "btn-shine group mt-8 inline-flex items-center justify-center gap-2.5 rounded-full font-medium text-[14.5px] tracking-wide px-6 py-4 transition-all duration-700",
                    p.featured
                      ? "bg-gradient-to-r from-saffron-300 via-saffron-400 to-saffron-500 text-forest-950 hover:brightness-110 shadow-lg shadow-saffron-500/25"
                      : "bg-forest-950 text-cream-50 hover:bg-forest-900 shadow-luxe"
                  )}
                >
                  {p.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-8 max-w-3xl mx-auto text-center">
          <p className="rounded-[22px] bg-white gold-hairline px-7 py-5 text-[13.5px] text-forest-700 leading-[1.75] shadow-luxe">
            💛 <strong>{t.pricing.footerStrong}</strong> {t.pricing.footerText}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
