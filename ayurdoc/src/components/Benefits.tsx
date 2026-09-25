"use client";

import { HeartHandshake, X, Check, Quote } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionMandalas } from "./ScrollMandala";
import { BENEFITS } from "@/content/site";
import { SITE } from "@/content/site";
import { FEATURED_QUOTE } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";

export function Benefits() {
  const { t } = useLanguage();
  const items = BENEFITS.map((b, i) => ({ ...b, ...t.benefits.items[i] }));
  const shortName = SITE.doctorName.split(" ").slice(0, 2).join(" ");

  return (
    <section id="benefits" className="mandala-section relative py-12 sm:py-16 scroll-mt-24">
      <SectionMandalas id="benefits" palette="peacock" side="right" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-forest-900 text-cream-100 text-[11px] font-semibold tracking-[0.24em] uppercase px-4 py-2">
                <HeartHandshake className="w-3.5 h-3.5 text-saffron-400" /> {t.benefits.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display font-light text-[clamp(2.1rem,4.4vw,3.2rem)] leading-[1.03] text-forest-950">
                {t.benefits.headingPre} <span className="italic text-gradient-gold">{t.benefits.headingHighlight}</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 text-[16px] text-forest-800/65 leading-[1.75] leading-relaxed">
                {t.benefits.desc}
              </p>
            </Reveal>

            <div className="mt-7 grid sm:grid-cols-2 gap-4">
              {items.map((b, i) => (
                <Reveal key={b.title} delay={i * 80} variant="scale">
                  <div className="card-lift h-full rounded-2xl bg-white gold-hairline p-5 shadow-luxe">
                    <span className="grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-forest-800 to-forest-600 text-cream-100 mb-3.5 shadow-md">
                      <b.icon className="w-5 h-5" />
                    </span>
                    <h3 className="font-bold text-[15px] text-forest-950 leading-snug">{b.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-forest-800/65">{b.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 self-start space-y-5">
            <Reveal variant="right">
              <div className="rounded-[28px] overflow-hidden bg-white gold-hairline shadow-luxe">
                <div className="grid grid-cols-[1fr_1fr_1.15fr] text-[12px] sm:text-[13px] font-bold">
                  <div className="px-4 py-4 text-forest-500 bg-forest-50/60">{t.benefits.tableConcern}</div>
                  <div className="px-4 py-4 text-center bg-slate-100/80 text-slate-500">{t.benefits.tableQuick}</div>
                  <div className="px-4 py-4 text-center bg-forest-900 text-saffron-300">{shortName}{t.benefits.tableAyurSuffix}</div>
                </div>
                {t.benefits.compare.map((r, i) => (
                  <div key={r.label} className={`grid grid-cols-[1fr_1fr_1.15fr] text-[12.5px] sm:text-[13.5px] ${i % 2 ? "bg-cream-50/60" : "bg-white"}`}>
                    <div className="px-4 py-3.5 font-semibold text-forest-900">{r.label}</div>
                    <div className="px-4 py-3.5 text-slate-500 flex items-start gap-1.5">
                      <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" /> {r.quick}
                    </div>
                    <div className="px-4 py-3.5 text-forest-900 font-medium flex items-start gap-1.5 bg-forest-50/50">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> {r.ayur}
                    </div>
                  </div>
                ))}
                <div className="px-5 py-4 bg-gradient-to-r from-saffron-500/10 to-forest-50 border-t border-forest-100">
                  <p className="text-xs text-forest-700 leading-relaxed">
                    <strong>{t.benefits.honestStrong}</strong> {t.benefits.honestText}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal variant="right" delay={140}>
              <figure className="relative rounded-[28px] bg-gradient-to-br from-forest-900 to-forest-950 gold-hairline p-7 sm:p-8 text-white overflow-hidden">
                <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-saffron-400/25 blur-2xl" aria-hidden />
                <Quote className="w-8 h-8 text-saffron-400" fill="currentColor" aria-hidden />
                <blockquote className="relative mt-4 font-display font-light text-[20px] sm:text-[23px] leading-[1.5]">
                  “{t.testimonials.featured.text}”
                </blockquote>
                <figcaption className="relative mt-4 flex items-center gap-3">
                  <img
                    src={FEATURED_QUOTE.img}
                    alt={t.benefits.parentAlt}
                    className="w-11 h-11 rounded-full object-cover border-2 border-saffron-300"
                  />
                  <span>
                    <span className="block text-sm font-bold">{t.testimonials.featured.name}</span>
                    <span className="block text-xs text-white/60">{t.testimonials.featured.detail}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
