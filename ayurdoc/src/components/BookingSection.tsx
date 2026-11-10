"use client";

import { useState } from "react";
import { CalendarCheck, Clock, Video, Building2, Phone, Mail, MapPin, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionMandalas } from "./ScrollMandala";
import { PatientEnquiryForm, type ConsultationMode } from "./PatientEnquiryForm";
import { cn } from "@/lib/cn";
import { SITE } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";

export function BookingSection() {
  const { t } = useLanguage();
  const [preferredMode, setPreferredMode] = useState<ConsultationMode>("online");

  return (
    <section id="book" className="mandala-section relative py-12 sm:py-16 scroll-mt-24 overflow-hidden">
      <SectionMandalas id="book" palette="lotus" side="right" dark />
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-[#0f3527] to-forest-950" />
        <div className="absolute top-0 left-1/4 w-[440px] h-[440px] rounded-full bg-saffron-500/20 blur-[110px] animate-blob" />
        <div className="absolute bottom-0 right-1/4 w-[440px] h-[440px] rounded-full bg-emerald-400/20 blur-[110px] animate-blob" style={{ animationDelay: "-9s" }} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 items-start">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-300 to-saffron-500 text-forest-950 text-[10px] font-semibold tracking-[0.26em] uppercase px-5 py-2.5 shadow-lg">
                <CalendarCheck className="w-4 h-4" /> {t.booking.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display font-light text-[clamp(2.2rem,4.8vw,3.5rem)] leading-[1.02] text-white">
                {t.booking.headingPre} <span className="italic text-saffron-300">{t.booking.headingHighlight}</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 text-[16px] sm:text-[17.5px] leading-[1.75] text-white/65">
                {t.booking.descPre} <strong className="text-white">{t.booking.descStrong}</strong>{t.booking.descPost}
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-7 grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  aria-pressed={preferredMode === "online"}
                  onClick={() => setPreferredMode("online")}
                  className={cn(
                    "flex items-center gap-3.5 rounded-2xl border p-4.5 text-left transition-all duration-500",
                    preferredMode === "online" ? "border-saffron-400/70 bg-saffron-400/10 shadow-lg" : "border-white/12 bg-white/[0.04] hover:border-white/25"
                  )}
                >
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-saffron-400 text-forest-950 shrink-0"><Video className="w-5 h-5" /></span>
                  <span>
                    <span className="block text-white font-bold text-sm">{t.booking.onlineTitle}</span>
                    <span className="block text-white/55 text-xs mt-0.5">{t.booking.onlineSub}</span>
                  </span>
                </button>
                <button
                  type="button"
                  aria-pressed={preferredMode === "in_clinic"}
                  onClick={() => setPreferredMode("in_clinic")}
                  className={cn(
                    "flex items-center gap-3.5 rounded-2xl border p-4.5 text-left transition-all duration-500",
                    preferredMode === "in_clinic" ? "border-saffron-400/70 bg-saffron-400/10 shadow-lg" : "border-white/12 bg-white/[0.04] hover:border-white/25"
                  )}
                >
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-white text-forest-900 shrink-0"><Building2 className="w-5 h-5" /></span>
                  <span>
                    <span className="block text-white font-bold text-sm">{t.booking.clinicTitle}</span>
                    <span className="block text-white/55 text-xs mt-0.5">{t.booking.clinicSub}</span>
                  </span>
                </button>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <ul className="mt-7 space-y-3.5 rounded-[24px] bg-white/[0.05] backdrop-blur gold-hairline p-6">
                {[
                  { icon: Clock, t: t.site.hours, s: t.site.hoursNote },
                  { icon: Phone, t: SITE.phoneDisplay, s: t.booking.repliesSameDay },
                  { icon: Mail, t: SITE.email, s: t.booking.formAlerts },
                  { icon: MapPin, t: t.site.clinicName, s: t.site.addressFull },
                ].map((c) => (
                  <li key={c.t} className="flex items-center gap-3.5">
                    <span className="grid place-items-center w-10 h-10 rounded-xl bg-white/10 text-saffron-300 shrink-0"><c.icon className="w-[18px] h-[18px]" /></span>
                    <span>
                      <span className="block text-white text-sm font-semibold">{c.t}</span>
                      <span className="block text-white/50 text-xs">{c.s}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-4 flex items-center gap-2.5 text-xs text-white/55 px-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                {t.booking.secureNote}
              </div>
            </Reveal>
          </div>

          <Reveal variant="scale" delay={150}>
            <PatientEnquiryForm preferredMode={preferredMode} onModeChange={setPreferredMode} headingLevel={3} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
