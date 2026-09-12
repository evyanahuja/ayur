"use client";

import { useState } from "react";
import { Plus, MessageCircleQuestionMark, PhoneCall } from "lucide-react";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/cn";
import { FAQS } from "@/content/site";



export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-32 scroll-mt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-forest-900 text-cream-100 text-[11px] font-semibold tracking-[0.24em] uppercase px-4 py-2">
            <MessageCircleQuestionMark className="w-3.5 h-3.5 text-saffron-400" /> Parents ask me this daily
          </p>
          <h2 className="mt-6 font-display font-light text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.02] text-forest-950">
            Everything you&apos;re wondering, <span className="italic text-gradient-gold">answered honestly.</span>
          </h2>
        </Reveal>

        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={Math.min(i * 60, 300)} variant="up">
                <div
                  className={cn(
                    "rounded-[22px] overflow-hidden transition-all duration-700",
                    isOpen ? "bg-white shadow-luxe gold-hairline" : "bg-white/60 hover:bg-white gold-hairline opacity-90 hover:opacity-100"
                  )}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="w-full flex items-center gap-4 text-left px-5 sm:px-6 py-5"
                  >
                    <span className={cn("grid place-items-center w-8 h-8 rounded-full text-sm font-bold shrink-0 transition-colors", isOpen ? "bg-forest-900 text-saffron-300" : "bg-forest-50 text-forest-700")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-display font-normal text-[16.5px] sm:text-[18px] text-forest-950 leading-snug">{f.q}</span>
                    <span className={cn("grid place-items-center w-9 h-9 rounded-full shrink-0 transition-all duration-700", isOpen ? "bg-gradient-to-br from-saffron-400 to-saffron-600 text-white rotate-[135deg]" : "bg-cream-200 text-forest-800")}>
                      <Plus className="w-5 h-5" />
                    </span>
                  </button>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    className={cn("grid transition-all duration-500 ease-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 sm:px-6 pb-7 pl-[68px] sm:pl-[76px] text-[14.5px] leading-[1.8] text-forest-800/70">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={150} className="mt-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 rounded-[26px] bg-gradient-to-r from-forest-900 to-forest-950 gold-hairline p-7 text-center sm:text-left">
            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-saffron-400 text-forest-950 shrink-0">
              <PhoneCall className="w-6 h-6" />
            </span>
            <p className="flex-1 text-white text-[14.5px] leading-relaxed">
              <strong>Still unsure if Ayurveda fits your child&apos;s case?</strong> Describe it in the form — I personally review
              every enquiry and will honestly tell you if I can help.
            </p>
            <a href="#book" className="btn-shine shrink-0 rounded-full bg-gradient-to-r from-saffron-300 to-saffron-500 text-forest-950 font-medium tracking-wide text-[14px] px-7 py-3.5 hover:brightness-110 transition-all duration-500">
              Ask Dr. Priyanka
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
