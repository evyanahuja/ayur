"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  CalendarCheck,
  Clock,
  Video,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Send,
  Baby,
  Sparkles,
  PartyPopper,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionMandalas } from "./ScrollMandala";
import { cn } from "@/lib/cn";
import { SITE } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";

type Status = "idle" | "sending" | "success" | "error";

const initial = {
  parentName: "",
  phone: "",
  email: "",
  childName: "",
  childAge: "",
  childGender: "",
  concernCategory: "general",
  symptoms: "",
  preferredMode: "online",
  preferredDate: "",
  preferredTime: "",
  planInterest: "unsure",
  message: "",
  website: "",
};

const CONCERN_VALUES = ["skin", "neurodevelopmental", "growth", "respiratory", "allergy_immunity", "lifestyle", "general", "other"];
const PLAN_KEYS = ["first", "wellness", "followup", "suvarna", "unsure"];

export function BookingSection() {
  const { t } = useLanguage();
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [refId, setRefId] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      if (id && PLAN_KEYS.includes(id)) {
        setForm((f) => ({ ...f, planInterest: id }));
      }
    };
    window.addEventListener("select-plan", handler);
    return () => window.removeEventListener("select-plan", handler);
  }, []);

  const set = (k: keyof typeof initial, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => {
      if (!e[k]) return e;
      const n = { ...e };
      delete n[k];
      return n;
    });
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        if (data.errors) {
          const mapped: Record<string, string> = {};
          if (data.errors.parentName) mapped.parentName = t.booking.errors.parentName;
          if (data.errors.phone) mapped.phone = t.booking.errors.phone;
          if (data.errors.email) mapped.email = t.booking.errors.email;
          if (data.errors.childName) mapped.childName = t.booking.errors.childName;
          if (data.errors.childAge) mapped.childAge = t.booking.errors.childAge;
          setErrors(Object.keys(mapped).length ? mapped : { form: t.booking.errors.form });
        } else setErrors({ form: t.booking.errors.form });
        setStatus("error");
        setTimeout(() => setStatus("idle"), 2500);
        return;
      }
      setRefId(data.id);
      setStatus("success");
      setForm(initial);
    } catch {
      setErrors({ form: t.booking.errors.form });
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  const inputCls = (bad?: string) =>
    cn(
      "w-full rounded-xl border bg-white px-4 py-3.5 text-[14.5px] text-forest-950 placeholder:text-forest-400/50 transition-all duration-500",
      bad ? "border-red-400 focus:border-red-500" : "border-saffron-500/20 focus:border-saffron-500 hover:border-saffron-500/45"
    );

  const labelCls = "block text-[10.5px] font-semibold tracking-[0.14em] uppercase text-forest-800 mb-2";
  const shortDoc = SITE.doctorName.split(" ").slice(0, 2).join(" ");

  return (
    <section id="book" className="mandala-section relative py-12 sm:py-16 scroll-mt-20 overflow-hidden">
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
                  onClick={() => set("preferredMode", "online")}
                  className={cn(
                    "flex items-center gap-3.5 rounded-2xl border p-4.5 text-left transition-all duration-500",
                    form.preferredMode === "online" ? "border-saffron-400/70 bg-saffron-400/10 shadow-lg" : "border-white/12 bg-white/[0.04] hover:border-white/25"
                  )}
                >
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-saffron-400 text-forest-950 shrink-0"><Video className="w-5 h-5" /></span>
                  <span>
                    <span className="block text-white font-bold text-sm">{t.booking.onlineTitle}</span>
                    <span className="block text-white/55 text-xs mt-0.5">{t.booking.onlineSub}</span>
                  </span>
                </button>
                <button
                  onClick={() => set("preferredMode", "in_clinic")}
                  className={cn(
                    "flex items-center gap-3.5 rounded-2xl border p-4.5 text-left transition-all duration-500",
                    form.preferredMode === "in_clinic" ? "border-saffron-400/70 bg-saffron-400/10 shadow-lg" : "border-white/12 bg-white/[0.04] hover:border-white/25"
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
                  { icon: MapPin, t: SITE.clinicName, s: t.site.addressFull },
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
            <div className="relative rounded-[32px] bg-cream-50 gold-hairline shadow-luxe-lg overflow-hidden">
              <div className="bg-gradient-to-r from-saffron-300 via-saffron-400 to-saffron-500 px-6 sm:px-8 py-6 flex items-center gap-4">
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-forest-950 text-saffron-300 shadow-lg shrink-0">
                  <Baby className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-display font-normal text-[22px] sm:text-[25px] text-forest-950 leading-tight">{t.booking.formTitle}</h3>
                  <p className="text-[13px] font-medium text-forest-900/70">{t.booking.formSub}</p>
                </div>
              </div>

              {status === "success" ? (
                <div className="px-6 sm:px-8 py-10 text-center" role="status" aria-live="polite">
                  <span className="mx-auto grid place-items-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-5 animate-bounce">
                    <PartyPopper className="w-9 h-9" />
                  </span>
                  <h3 className="font-display font-light text-[28px] sm:text-[34px] text-forest-950">{t.booking.successTitle}</h3>
                  <p className="mt-3 text-[15px] text-forest-700 leading-relaxed max-w-md mx-auto">
                    {t.booking.successDescPre} <strong>#{refId}</strong> {t.booking.successDescMid} {SITE.doctorName}{t.booking.successDescPost}
                  </p>
                  <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-left max-w-md mx-auto space-y-2">
                    {t.booking.successTips.map((tip, i) => (
                      <p key={i} className="flex items-start gap-2 text-[13.5px] text-emerald-900">
                        <CheckCircle2 className="w-[18px] h-[18px] shrink-0 mt-0.5" /> {tip}{i === 2 ? ` #{refId}` : ""}
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-7 rounded-xl bg-forest-900 text-cream-100 font-semibold text-sm px-6 py-3 hover:bg-forest-800 transition-colors"
                  >
                    {t.booking.successBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="px-6 sm:px-8 py-7 space-y-5" noValidate aria-label={t.booking.formTitle}>
                  <input type="text" name="website" value={form.website} onChange={(e) => set("website", e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="parentName" className={labelCls}>{t.booking.parentName}</label>
                      <input id="parentName" value={form.parentName} onChange={(e) => set("parentName", e.target.value)} placeholder={t.booking.parentNamePh} className={inputCls(errors.parentName)} autoComplete="name" required />
                      {errors.parentName && <p className="mt-1 text-xs text-red-600 font-medium">{errors.parentName}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelCls}>{t.booking.phone}</label>
                      <input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder={t.booking.phonePh} inputMode="tel" className={inputCls(errors.phone)} autoComplete="tel" required />
                      {errors.phone && <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className={labelCls}>{t.booking.email} <span className="font-normal text-forest-500">{t.booking.emailHint}</span></label>
                    <input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder={t.booking.emailPh} className={inputCls(errors.email)} autoComplete="email" />
                    {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>}
                  </div>

                  <div className="rounded-[22px] bg-gradient-to-b from-cream-100 to-cream-50 border border-saffron-500/15 p-5 space-y-4">
                    <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-forest-700">
                      <Sparkles className="w-4 h-4 text-saffron-600" /> {t.booking.childSection}
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-1">
                        <label htmlFor="childName" className={labelCls}>{t.booking.childName}</label>
                        <input id="childName" value={form.childName} onChange={(e) => set("childName", e.target.value)} placeholder={t.booking.childNamePh} className={inputCls(errors.childName)} required />
                        {errors.childName && <p className="mt-1 text-xs text-red-600 font-medium">{errors.childName}</p>}
                      </div>
                      <div>
                        <label htmlFor="childAge" className={labelCls}>{t.booking.childAge}</label>
                        <input id="childAge" value={form.childAge} onChange={(e) => set("childAge", e.target.value)} placeholder={t.booking.childAgePh} className={inputCls(errors.childAge)} required />
                        {errors.childAge && <p className="mt-1 text-xs text-red-600 font-medium">{errors.childAge}</p>}
                      </div>
                      <div>
                        <label htmlFor="childGender" className={labelCls}>{t.booking.gender}</label>
                        <select id="childGender" value={form.childGender} onChange={(e) => set("childGender", e.target.value)} className={inputCls()}>
                          <option value="">{t.booking.genderSelect}</option>
                          <option value="Boy">{t.booking.genderBoy}</option>
                          <option value="Girl">{t.booking.genderGirl}</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="concern" className={labelCls}>{t.booking.concern}</label>
                      <select id="concern" value={form.concernCategory} onChange={(e) => set("concernCategory", e.target.value)} className={inputCls()} required>
                        {CONCERN_VALUES.map((v, i) => (
                          <option key={v} value={v}>{t.booking.concerns[i]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="symptoms" className={labelCls}>{t.booking.symptoms} <span className="font-normal text-forest-500">{t.booking.symptomsHint}</span></label>
                      <textarea id="symptoms" value={form.symptoms} onChange={(e) => set("symptoms", e.target.value)} rows={3} placeholder={t.booking.symptomsPh} className={cn(inputCls(), "resize-none")} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <span className={labelCls}>{t.booking.mode}</span>
                      <div className="flex rounded-xl border-2 border-forest-100 overflow-hidden">
                        {([["online", t.booking.modeOnline], ["in_clinic", t.booking.modeClinic]] as const).map(([v, l]) => (
                          <button
                            type="button"
                            key={v}
                            onClick={() => set("preferredMode", v)}
                            aria-pressed={form.preferredMode === v}
                            className={cn("flex-1 py-2.5 text-[13px] font-bold transition-colors", form.preferredMode === v ? "bg-forest-900 text-cream-100" : "bg-white text-forest-700 hover:bg-forest-50")}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="pdate" className={labelCls}>{t.booking.date}</label>
                      <input id="pdate" type="date" value={form.preferredDate} min={new Date().toISOString().slice(0, 10)} onChange={(e) => set("preferredDate", e.target.value)} className={inputCls()} />
                    </div>
                    <div>
                      <label htmlFor="ptime" className={labelCls}>{t.booking.time}</label>
                      <select id="ptime" value={form.preferredTime} onChange={(e) => set("preferredTime", e.target.value)} className={inputCls()}>
                        <option value="">{t.booking.timeOptions[0]}</option>
                        {t.booking.timeOptions.slice(1).map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="plan" className={labelCls}>{t.booking.plan}</label>
                    <select id="plan" value={form.planInterest} onChange={(e) => set("planInterest", e.target.value)} className={inputCls()}>
                      {PLAN_KEYS.map((k, i) => (
                        <option key={k} value={k}>{t.booking.planOptions[i]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="msg" className={labelCls}>{t.booking.message} <span className="font-normal text-forest-500">{t.booking.messageHint}</span></label>
                    <textarea id="msg" value={form.message} onChange={(e) => set("message", e.target.value)} rows={2} placeholder={t.booking.messagePh} className={cn(inputCls(), "resize-none")} />
                  </div>

                  {errors.form && (
                    <p role="alert" className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium px-4 py-3">{errors.form}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-shine w-full inline-flex items-center justify-center gap-2.5 rounded-full bg-forest-950 hover:bg-forest-900 disabled:opacity-70 text-cream-50 font-medium text-[15.5px] tracking-wide px-6 py-[18px] shadow-luxe hover:shadow-luxe-lg transition-all duration-700"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> {t.booking.sending}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 text-saffron-400" /> {t.booking.submit} {shortDoc}
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-forest-600 leading-relaxed">
                    {t.booking.agree}
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
