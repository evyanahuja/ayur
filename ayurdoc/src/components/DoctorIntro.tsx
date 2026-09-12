"use client";

import { GraduationCap, Award, Heart, CheckCircle2, Quote, ArrowRight, Languages, MapPin } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionMandalas } from "./ScrollMandala";
import { SITE, IMAGES } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";
import { CredentialGrid } from "./luxe";

const CRED_ICONS = [GraduationCap, Award, Heart];

export function DoctorIntro() {
  const { t } = useLanguage();
  const credentials = t.doctor.credentials.map((c, i) => ({ ...c, icon: CRED_ICONS[i] }));

  return (
    <section id="doctor" className="mandala-section relative py-12 sm:py-16 scroll-mt-24">
      <SectionMandalas id="doctor" palette="peacock" side="left" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-forest-50/60 to-transparent" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 lg:gap-14 items-center">
          <Reveal variant="left" className="relative mx-auto w-full min-w-0 max-w-[500px]">
            <div className="relative">
              <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-saffron-300/50 via-cream-200 to-forest-100 blur-xl opacity-80" aria-hidden />
              <div data-portrait-frame="doctor" className="relative rounded-[34px] p-2 bg-gradient-to-br from-saffron-400/70 via-cream-100 to-forest-200/60 shadow-luxe-lg">
                <div className="relative rounded-[27px] overflow-hidden group">
                  <img
                    src={IMAGES.clinicCare}
                    alt={`${SITE.doctorName} ${t.doctor.photoAlt}`}
                    className="w-full h-[440px] sm:h-[520px] object-cover group-hover:scale-[1.06] transition-transform duration-[1.6s] ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950 via-forest-950/55 to-transparent pt-20 pb-6 px-6">
                    <div className="flex items-center gap-3.5">
                      <img src={IMAGES.doctorPortrait} alt={SITE.doctorName} className="w-12 h-12 shrink-0 rounded-full object-cover ring-2 ring-saffron-400/80" />
                      <div className="min-w-0">
                        <p className="text-white font-display font-normal text-[19px] leading-tight">{SITE.doctorName}</p>
                        <p className="text-saffron-300/80 text-[10px] font-semibold tracking-[0.16em] uppercase mt-1">{SITE.qualification}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CredentialGrid
              label={t.doctor.credGridLabel}
              items={[
                {
                  id: "languages",
                  icon: <Languages className="w-[18px] h-[18px]" />,
                  title: t.doctor.langTitle,
                  subtitle: t.site.languages,
                },
                {
                  id: "consultations",
                  icon: <MapPin className="w-[18px] h-[18px]" />,
                  title: t.doctor.consultTitle,
                  subtitle: t.doctor.consultSub,
                  tone: "gold",
                },
              ]}
            />
          </Reveal>

          <div className="min-w-0">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-forest-900 text-cream-100 text-[11px] font-semibold tracking-[0.24em] uppercase px-4 py-2">
                <Quote className="w-3.5 h-3.5 text-saffron-400" /> {t.doctor.eyebrow}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-6 font-display font-light text-[clamp(2.1rem,4.4vw,3.3rem)] leading-[1.03] text-forest-950">
                {t.doctor.headingPre}{" "}
                <span className="italic text-gradient-gold">{t.doctor.headingHighlight}</span>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 text-[15.5px] sm:text-[17px] leading-relaxed text-forest-800/75">
                {t.doctor.para1} <strong className="text-forest-900">{t.doctor.paraStrong}</strong> {t.doctor.para2} <em>{t.doctor.agni}</em> {t.doctor.agniNote}, <em>{t.doctor.ojas}</em> {t.doctor.ojasNote} {t.doctor.para3}
              </p>
            </Reveal>

            <div className="mt-7 grid sm:grid-cols-3 gap-3">
              {credentials.map((c, i) => (
                <Reveal key={c.title} delay={180 + i * 90} variant="scale">
                  <div className="card-lift h-full rounded-2xl bg-white gold-hairline p-4 shadow-luxe">
                    <span className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-forest-800 to-forest-600 text-cream-100 mb-3">
                      <c.icon className="w-5 h-5" />
                    </span>
                    <p className="text-[13.5px] font-bold text-forest-900 leading-snug">{c.title}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-forest-700/70">{c.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={220}>
              <ul className="mt-8 space-y-3.5 rounded-[24px] bg-white/70 backdrop-blur gold-hairline p-6 sm:p-7 shadow-luxe" aria-label={t.doctor.promisesAria}>
                {t.doctor.promises.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[14px] sm:text-[15px] text-forest-900/85 leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-7 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a
                  href="#book"
                  className="btn-shine group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-saffron-400 to-saffron-600 text-white font-medium tracking-wide px-7 py-4 shadow-luxe hover:-translate-y-0.5 hover:shadow-luxe-lg transition-all duration-700"
                >
                  {t.doctor.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <p className="font-display font-light italic text-[20px] text-forest-700">{t.doctor.signaturePre} <span className="text-saffron-600">{t.doctor.signatureName}</span></p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
