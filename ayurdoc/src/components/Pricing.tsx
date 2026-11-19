"use client";

import { useEffect, useState } from "react";
import { Check, Sparkles, Video, Building2, Crown, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionMandalas } from "./ScrollMandala";
import { cn } from "@/lib/cn";
import { PLANS } from "@/content/site";
import type { VopdPlan } from "@/content/vopd";
import { useLanguage } from "@/i18n/LanguageContext";
import { useRegionCurrency } from "@/lib/useRegionCurrency";

export function Pricing({ showCurrencyNote = true }: { showCurrencyNote?: boolean }) {
  const { t } = useLanguage();
  const currency = useRegionCurrency();
  const [mode, setMode] = useState<"online" | "clinic">("online");
  const [publishedPlans, setPublishedPlans] = useState<VopdPlan[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/vopd/config", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.ok || !Array.isArray(data.plans)) return;
        setPublishedPlans(data.plans as VopdPlan[]);
      })
      .catch(() => { /* keep static plans */ });
    return () => { cancelled = true; };
  }, []);

  const builtinCards = PLANS.flatMap((p, i) => {
    const saved = publishedPlans?.find((item) => item.id === p.id);
    if (publishedPlans && (!saved || saved.showOnPricing === false)) return [];
    const localized = t.pricing.plans[i];
    return [{
      id: p.id,
      displayPrice: saved ? (currency === "USD" ? saved.usdPrice || "USD fee unavailable" : saved.priceLabel) : (currency === "USD" ? p.usdPrice : p.price),
      displayStrike: saved ? (currency === "USD" ? saved.usdStrike : saved.strikeLabel) : (currency === "USD" ? p.usdStrike : p.strike),
      name: saved?.name ?? localized?.name ?? p.name,
      hindi: saved?.subtitle ?? localized?.sub ?? p.hindi,
      period: saved?.period ?? localized?.period ?? p.period,
      desc: saved?.description ?? localized?.desc ?? p.desc,
      features: saved?.inclusions ?? localized?.features ?? p.features,
      cta: localized?.cta ?? p.cta,
      icon: p.icon,
      featured: saved?.featured ?? p.featured,
    }];
  });

  const dynamicCards = (publishedPlans ?? []).filter((plan) => plan.isCustom && plan.showOnPricing !== false).map((cp) => ({
    id: cp.id,
    displayPrice: currency === "USD" ? cp.usdPrice || "USD fee unavailable" : cp.priceLabel,
    displayStrike: currency === "USD" ? cp.usdStrike : cp.strikeLabel,
    name: cp.name,
    hindi: cp.subtitle || `${cp.bookingMinutes} mins`,
    period: cp.period || `${cp.bookingMinutes} mins consultation`,
    desc: cp.description,
    features: cp.inclusions.length
      ? cp.inclusions
      : [
          `${cp.bookingMinutes} mins video / in-clinic session`,
          ...(cp.followUpCount > 0 ? [`${cp.followUpCount} follow-up visits (${cp.followUpMinutes} mins each)`] : []),
          "Personalised Ayurvedic prescription & diet guidance",
        ],
    cta: t.pricing.plans[0]?.cta ?? "Book consultation",
    icon: cp.featured ? Crown : Sparkles,
    featured: Boolean(cp.featured),
  }));

  const plans = [...builtinCards, ...dynamicCards];
  const modes = [
    { id: "online" as const, label: t.pricing.online, icon: Video },
    { id: "clinic" as const, label: t.pricing.clinic, icon: Building2 },
  ];

  return (
    <section id="plans" className="mandala-section relative overflow-hidden py-12 sm:py-16 scroll-mt-24">
      <SectionMandalas id="plans" palette="marigold" side="left" />
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
          {showCurrencyNote && (
            <p className="mt-3 inline-flex items-center rounded-full bg-white/80 gold-hairline px-4 py-2 text-[11.5px] font-semibold tracking-wide text-forest-700 shadow-luxe">
              {currency === "USD" ? t.pricing.internationalNote : t.pricing.indiaNote}
            </p>
          )}

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

        <div
          className={cn(
            "mt-9 grid gap-6 items-stretch mx-auto",
            plans.length <= 2 ? "md:grid-cols-2 max-w-4xl" : "md:grid-cols-3 max-w-6xl"
          )}
        >
          {plans.map((p, i) => (
            <Reveal key={p.id} delay={i * 110} variant="scale" className="h-full">
              <article
                className={cn(
                  "relative h-full rounded-[32px] p-8 sm:p-9 flex flex-col overflow-hidden transition-all duration-700 hover:-translate-y-2 gold-hairline",
                  p.featured
                    ? "bg-gradient-to-b from-forest-900 to-forest-950 text-white shadow-luxe-lg"
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
                <p className={cn("mt-4 text-[13.5px] leading-[1.7]", p.featured ? "text-white/65" : "text-forest-700/70")}>{p.desc}</p>

                <div className="mt-6 flex items-end gap-3">
                  <span className={cn("font-display font-light text-[44px] leading-none tracking-tight", p.featured ? "text-gradient-gold" : "text-forest-950")}>{p.displayPrice}</span>
                  {p.displayStrike ? (
                    <span className={cn("text-[13px] line-through mb-1.5", p.featured ? "text-white/35" : "text-slate-400")}>{p.displayStrike}</span>
                  ) : null}
                </div>
                <p className={cn("mt-1.5 text-[13px] font-semibold", p.featured ? "text-saffron-300" : "text-forest-600")}>
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
                    window.dispatchEvent(new CustomEvent("select-plan", { detail: { planId: p.id, mode } }));
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
          <p className="rounded-[22px] bg-white/90 backdrop-blur gold-hairline px-7 py-5 text-[13.5px] text-forest-700 leading-[1.75] shadow-luxe">
            <strong>{t.pricing.footerStrong}</strong> {t.pricing.footerText}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
