"use client";

import { Reveal } from "./Reveal";
import { CONDITIONS } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";

export function ConditionsStrip() {
  const { t } = useLanguage();
  const localized = CONDITIONS.map((c, i) => ({ icon: c.icon, label: t.socialProof.conditions[i] ?? c.label }));
  const doubled = [...localized, ...localized];

  return (
    <section aria-label={t.socialProof.aria} className="relative py-6 sm:py-8 border-b border-saffron-500/15">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal variant="scale" className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#fffdf8] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#fffdf8] to-transparent z-10 pointer-events-none" />
          <div className="overflow-hidden rounded-2xl">
            <div className="flex gap-3 w-max animate-marquee hover:[animation-play-state:paused] py-1" role="list">
              {doubled.map((c, i) => (
                <span
                  key={i}
                  role="listitem"
                  className="inline-flex items-center gap-3 rounded-full bg-white gold-hairline shadow-luxe pl-2 pr-6 py-2 text-[13.5px] font-medium tracking-wide text-forest-900 whitespace-nowrap"
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
      </div>
    </section>
  );
}
