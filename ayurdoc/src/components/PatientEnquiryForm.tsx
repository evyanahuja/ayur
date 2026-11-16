"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import Link from "next/link";
import { Building2, CheckCircle2, Loader2, MessageCircle, PartyPopper, Send, Sparkles, Stethoscope, Video } from "lucide-react";
import { VopdBookingForm } from "@/components/VopdBookingForm";
import { PLANS, SITE } from "@/content/site";
import { clinicTodayIso, computeAgeFromDob, isValidDobString, type VopdPlan } from "@/content/vopd";
import { useLanguage } from "@/i18n/LanguageContext";
import { useExpansion } from "@/i18n/expansion";
import { vopdDict } from "@/i18n/vopd";
import { cn } from "@/lib/cn";
import { useRegionCurrency } from "@/lib/useRegionCurrency";

export type ConsultationMode = "online" | "in_clinic";

const initial = {
  parentName: "", phone: "", email: "", childName: "", childAge: "", childGender: "",
  concernCategory: "general", symptoms: "", preferredMode: "in_clinic" as ConsultationMode,
  preferredDate: "", preferredTime: "", planInterest: "first", message: "", website: "",
  consent: false,
};
const CONCERNS = ["skin", "neurodevelopmental", "growth", "respiratory", "allergy_immunity", "lifestyle", "general", "other"];
const BUILTIN_PLAN_KEYS = ["first", "followup", "suvarna", "unsure"];
const REQUIRED = ["parentName", "phone", "childName", "childAge"] as const;
type ErrorField = (typeof REQUIRED)[number] | "email" | "consent";
type Errors = Partial<Record<ErrorField | "form", boolean>>;
type Receipt = { ref: string | null; emailSent: boolean; childName: string };
type Props = {
  preferredMode?: ConsultationMode;
  onModeChange?: (mode: ConsultationMode) => void;
  headingLevel?: 2 | 3;
};

function withLivePrice(label: string, price: string) {
  const suffix = /\u2014\s*[\u20b9$][\d,]+/;
  return suffix.test(label) ? label.replace(suffix, `\u2014 ${price}`) : `${label} \u2014 ${price}`;
}

export function PatientEnquiryForm({ preferredMode, onModeChange, headingLevel = 2 }: Props) {
  const { t, lang } = useLanguage();
  const f = useExpansion(lang).form;
  const v = vopdDict(lang);
  const sel = v.selector;
  const currency = useRegionCurrency();
  const prefix = `enquiry-${useId().replace(/:/g, "")}`;
  const formRef = useRef<HTMLFormElement>(null);
  const pending = useRef<AbortController | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [today, setToday] = useState(() => clinicTodayIso());
  // Original behaviour preserved: the enquiry (OPD) form is the default view;
  // VOPD is opt-in via the selector. The online/clinic preference stays a
  // separate field inside the OPD form, exactly as before.
  const [consultType, setConsultType] = useState<"opd" | "vopd">("opd");
  const [selectedPlanId, setSelectedPlanId] = useState("first");
  const [customPlans, setCustomPlans] = useState<VopdPlan[]>([]);
  const mode = preferredMode ?? form.preferredMode;
  const Heading = headingLevel === 3 ? "h3" : "h2";

  const switchConsultType = (next: "opd" | "vopd") => setConsultType(next);

  const errorMessage = (name: ErrorField): string => {
    if (name === "consent") return f.consentError;
    if (name === "parentName") return f.contactNameError;
    if (name === "childName") return f.patientNameError;
    if (name === "childAge") return v.patient.eDob;
    return t.booking.errors[name];
  };

  useEffect(() => {
    setToday(clinicTodayIso());
    let cancelled = false;
    fetch("/api/vopd/config", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data?.ok) return;
        if (typeof data.today === "string") setToday(data.today);
        if (Array.isArray(data.plans)) {
          setCustomPlans((data.plans as VopdPlan[]).filter((p) => p.isCustom && p.active !== false));
        }
      })
      .catch(() => { /* ignore */ });
    return () => {
      cancelled = true;
      pending.current?.abort();
    };
  }, []);

  useEffect(() => {
    const selectPlan = (event: Event) => {
      const detail = (event as CustomEvent<string | { planId: string; mode?: "online" | "clinic" }>).detail;
      const plan = typeof detail === "string" ? detail : detail?.planId;
      const targetMode = typeof detail === "object" ? detail?.mode : undefined;
      if (targetMode === "clinic") {
        setConsultType("opd");
        setForm((value) => ({ ...value, preferredMode: "in_clinic" }));
        onModeChange?.("in_clinic");
      } else if (targetMode === "online") {
        setConsultType("vopd");
        onModeChange?.("online");
      }
      if (plan) {
        setSelectedPlanId(plan);
        setForm((value) => ({ ...value, planInterest: plan }));
      }
    };
    window.addEventListener("select-plan", selectPlan);
    return () => window.removeEventListener("select-plan", selectPlan);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (status === "success") successRef.current?.focus(); }, [status]);

  const set = <K extends keyof typeof initial>(key: K, value: typeof initial[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    if (key === "preferredMode") onModeChange?.(value as ConsultationMode);
    setErrors((current) => ({ ...current, [key]: false, form: false }));
  };

  const focusError = () => requestAnimationFrame(() => {
    formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const fields = Object.fromEntries(
      Object.entries(form).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
    ) as typeof initial;
    const invalid: Errors = {};
    if (fields.parentName.length < 2) invalid.parentName = true;
    if (!/^[+\d][\d\s\-()]{6,18}$/.test(fields.phone)) invalid.phone = true;
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) invalid.email = true;
    if (fields.childName.length < 2) invalid.childName = true;
    if (!isValidDobString(fields.childAge, today)) invalid.childAge = true;
    if (!fields.consent) invalid.consent = true;
    setErrors(invalid);
    if (Object.keys(invalid).length) { focusError(); return; }

    const controller = new AbortController();
    pending.current = controller;
    setStatus("sending");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, preferredMode: mode, currency }),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok || data.ok !== true || (data.dbSaved !== true && data.emailSent !== true)) {
        const mapped: Errors = {};
        for (const key of [...REQUIRED, "email", "consent"] as ErrorField[]) {
          if (data.errors?.[key]) mapped[key] = true;
        }
        setErrors(Object.keys(mapped).length ? mapped : { form: true });
        setStatus("error");
        focusError();
        return;
      }
      const ref = typeof data.ref === "string" && data.ref.trim()
        ? data.ref
        : typeof data.id === "number" && data.id > 0
          ? `#${data.id}`
          : null;
      setReceipt({ ref, emailSent: data.emailSent === true, childName: fields.childName });
      setForm(initial);
      setStatus("success");
    } catch {
      if (controller.signal.aborted) return;
      setErrors({ form: true });
      setStatus("error");
    } finally {
      if (pending.current === controller) pending.current = null;
    }
  }

  const inputCls = (bad = false) => cn(
    "min-w-0 w-full rounded-xl border bg-white px-4 py-3 text-[14.5px] text-forest-950 placeholder:text-forest-400/55 transition-colors",
    bad ? "border-red-400 focus:border-red-500" : "border-saffron-500/25 focus:border-saffron-500 hover:border-saffron-500/45"
  );
  const labelCls = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-800";
  const id = (name: string) => `${prefix}-${name}`;
  const errorText = (name: ErrorField) => errors[name] && (
    <p id={id(`${name}-error`)} className="mt-1 text-xs font-medium text-red-600" role="alert">{errorMessage(name)}</p>
  );
  const input = (name: ErrorField, label: string, placeholder: string, options: InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="min-w-0">
      <label htmlFor={id(name)} className={labelCls}>{label}</label>
      <input
        {...options}
        id={id(name)}
        name={name}
        value={form[name as keyof typeof initial] as string}
        onChange={(event) => set(name as keyof typeof initial, event.target.value as never)}
        placeholder={placeholder}
        className={inputCls(errors[name])}
        required={name !== "email"}
        aria-invalid={errors[name] || undefined}
        aria-describedby={errors[name] ? id(`${name}-error`) : undefined}
      />
      {errorText(name)}
    </div>
  );

  // Merge built-in plans + any active admin-added consultation plans
  const combinedPlanOptions: { value: string; label: string }[] = [
    ...BUILTIN_PLAN_KEYS.slice(0, 2).map((key, index) => {
      const baseLabel = t.booking.planOptions[index] ?? key;
      const plan = PLANS.find((entry) => entry.id === key);
      return {
        value: key,
        label: plan ? withLivePrice(baseLabel, currency === "USD" ? plan.usdPrice : plan.price) : baseLabel,
      };
    }),
    ...customPlans.map((cp) => {
      const fee = cp.amountMinor != null
        ? currency === "USD" && cp.usdPrice
          ? cp.usdPrice
          : cp.priceLabel
        : "";
      return {
        value: cp.id,
        label: fee ? `${cp.name} (${cp.bookingMinutes} mins) — ${fee}` : `${cp.name} (${cp.bookingMinutes} mins)`,
      };
    }),
    ...BUILTIN_PLAN_KEYS.slice(2).map((key, idx) => ({
      value: key,
      label: t.booking.planOptions[idx + 2] ?? key,
    })),
  ];

  const computedDobAge = form.childAge ? computeAgeFromDob(form.childAge, today) : null;
  const submitLabel = t.booking.submit.replace("{doctor}", t.site.shortDoctorName);
  const confirmation = receipt?.ref
    ? t.booking.whatsappConfirmation.replace("{child}", receipt.childName).replace("{ref}", receipt.ref)
    : t.site.whatsappMessage;
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(confirmation)}`;

  return (
    <div id="vopd-card" data-patient-enquiry className="relative min-w-0 overflow-hidden rounded-[32px] bg-cream-50 shadow-luxe-lg gold-hairline">
      <div className="flex items-center gap-4 bg-gradient-to-r from-saffron-300 via-saffron-400 to-saffron-500 px-6 py-5 sm:px-8 sm:py-6">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest-950 text-saffron-300 shadow-lg">
          <Stethoscope className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <Heading id={id("title")} className="font-display text-[22px] font-normal leading-snug text-forest-950 sm:text-[25px]">
            {t.booking.formTitle}
          </Heading>
          <p className="text-[13px] font-medium text-forest-900/75">{t.booking.formSub}</p>
        </div>
      </div>

      <div className="border-b border-forest-900/10 bg-cream-100/75 px-5 py-4 sm:px-8 sm:py-5">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-forest-800">{sel.question}</p>
        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2" role="radiogroup" aria-label={sel.question}>
          <button
            type="button"
            role="radio"
            aria-checked={consultType === "vopd"}
            onClick={() => switchConsultType("vopd")}
            className={cn(
              "flex items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition-all",
              consultType === "vopd"
                ? "border-forest-900 bg-white shadow-sm"
                : "border-forest-900/10 bg-white/60 hover:border-saffron-400"
            )}
          >
            <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", consultType === "vopd" ? "bg-forest-950 text-saffron-300" : "bg-forest-50 text-forest-700")}>
              <Video className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold leading-snug text-forest-950">{sel.vopdTitle}</span>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-forest-800/70">{sel.vopdSub}</span>
            </span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={consultType === "opd"}
            onClick={() => switchConsultType("opd")}
            className={cn(
              "flex items-start gap-3 rounded-2xl border-2 p-3.5 text-left transition-all",
              consultType === "opd"
                ? "border-forest-900 bg-white shadow-sm"
                : "border-forest-900/10 bg-white/60 hover:border-saffron-400"
            )}
          >
            <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", consultType === "opd" ? "bg-forest-950 text-saffron-300" : "bg-forest-50 text-forest-700")}>
              <Building2 className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13.5px] font-semibold leading-snug text-forest-950">{sel.opdTitle}</span>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-forest-800/70">{sel.opdSub}</span>
            </span>
          </button>
        </div>
      </div>

      {consultType === "vopd" ? (
        <VopdBookingForm initialPlanId={selectedPlanId} />
      ) : status === "success" && receipt ? (
        <div ref={successRef} tabIndex={-1} className="px-6 py-10 text-center sm:px-8" role="status" aria-live="polite">
          <span className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
            <PartyPopper className="h-9 w-9" />
          </span>
          <h3 className="font-display text-[28px] font-light text-forest-950 sm:text-[34px]">{t.booking.successTitle}</h3>
          {receipt.ref && (
            <p className="mt-3 text-sm font-semibold text-forest-950">
              {t.booking.referenceLabel}: <strong>{receipt.ref}</strong>
            </p>
          )}
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-forest-700">
            {(receipt.emailSent ? t.booking.successEmailMessage : t.booking.successSavedMessage).replace("{doctor}", t.site.doctorName)}
          </p>
          <p className="mx-auto mt-3 max-w-md text-[13.5px] leading-relaxed text-forest-700/80">{f.nonConfirmNote}</p>
          {!receipt.emailSent && (
            <p className="mx-auto mt-4 max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
              {t.booking.successEmailDelayed}
            </p>
          )}
          <div className="mx-auto mt-6 max-w-md space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left">
            {t.booking.successTips.filter((tip) => receipt.ref || !tip.includes("{refId}")).map((tip) => (
              <p key={tip} className="flex items-start gap-2 text-[13.5px] text-emerald-900">
                <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0" />
                <span>
                  {tip.includes("{refId}") ? (
                    <a href={waHref} target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-400 underline-offset-2">
                      {tip.replace(/#?\{refId\}/g, receipt.ref || "").replace(/\s+$/, "")}
                    </a>
                  ) : (
                    tip
                  )}
                </span>
              </p>
            ))}
          </div>
          <button
            type="button"
            onClick={() => { setReceipt(null); setErrors({}); setStatus("idle"); }}
            className="mt-7 rounded-xl bg-forest-900 px-6 py-3 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-800"
          >
            {t.booking.successBtn}
          </button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby={id("title")} aria-busy={status === "sending"} className="space-y-5 px-5 py-6 sm:px-8 sm:py-7">
          <fieldset disabled={status === "sending"} className="min-w-0 space-y-4">
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={(event) => set("website", event.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {input("parentName", f.contactName, f.contactNamePh, { autoComplete: "name" })}
              {input("phone", t.booking.phone, t.booking.phonePh, { type: "tel", inputMode: "tel", autoComplete: "tel" })}
            </div>
            <div>
              <label htmlFor={id("email")} className={labelCls}>
                {t.booking.email} <span className="font-normal text-forest-500">{t.booking.emailHint}</span>
              </label>
              <input
                id={id("email")}
                name="email"
                type="email"
                value={form.email}
                onChange={(event) => set("email", event.target.value)}
                placeholder={t.booking.emailPh}
                className={inputCls(errors.email)}
                autoComplete="email"
                aria-invalid={errors.email || undefined}
                aria-describedby={errors.email ? id("email-error") : undefined}
              />
              {errorText("email")}
            </div>

            <div className="space-y-4 rounded-[22px] border border-saffron-500/15 bg-gradient-to-b from-cream-100 to-cream-50 p-4 sm:p-5" role="group" aria-labelledby={id("child-section")}>
              <p id={id("child-section")} className="flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-wider text-forest-700">
                <Sparkles className="h-4 w-4 shrink-0 text-saffron-600" />
                {f.patientSection}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {input("childName", f.patientName, f.patientNamePh, { autoComplete: "off" })}
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <label htmlFor={id("childAge")} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-800">
                      {v.patient.dob}
                    </label>
                    {computedDobAge && (
                      <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-forest-800">
                        {v.patient.agePrefix}: {computedDobAge.short}
                      </span>
                    )}
                  </div>
                  <input
                    id={id("childAge")}
                    name="childAge"
                    type="date"
                    min="1905-01-01"
                    max={today}
                    value={form.childAge}
                    onChange={(event) => set("childAge", event.target.value)}
                    className={inputCls(errors.childAge)}
                    required
                    autoComplete="bday"
                    aria-invalid={errors.childAge || undefined}
                    aria-describedby={errors.childAge ? id("childAge-error") : undefined}
                  />
                  {errorText("childAge")}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label htmlFor={id("childGender")} className={labelCls}>{t.booking.gender}</label>
                  <select id={id("childGender")} name="childGender" value={form.childGender} onChange={(event) => set("childGender", event.target.value)} className={inputCls()}>
                    <option value="">{f.genderSelect}</option>
                    <option value="Female">{f.genderFemale}</option>
                    <option value="Male">{f.genderMale}</option>
                    <option value="Girl">{f.genderGirl}</option>
                    <option value="Boy">{f.genderBoy}</option>
                    <option value="Other">{f.genderPreferNot}</option>
                  </select>
                </div>
                <div className="min-w-0">
                  <label htmlFor={id("concernCategory")} className={labelCls}>{t.booking.concern}</label>
                  <select id={id("concernCategory")} name="concernCategory" value={form.concernCategory} onChange={(event) => set("concernCategory", event.target.value)} className={inputCls()} required>
                    {CONCERNS.map((value, index) => <option key={value} value={value}>{t.booking.concerns[index]}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor={id("symptoms")} className={labelCls}>
                  {f.symptomsLabel} <span className="font-normal text-forest-500">{f.symptomsHint}</span>
                </label>
                <textarea id={id("symptoms")} name="symptoms" value={form.symptoms} onChange={(event) => set("symptoms", event.target.value)} rows={3} placeholder={f.symptomsPh} className={cn(inputCls(), "resize-y")} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="min-w-0" role="group" aria-labelledby={id("mode-label")}>
                <span id={id("mode-label")} className={labelCls}>{t.booking.mode}</span>
                <input type="hidden" name="preferredMode" value={mode} />
                <div className="flex overflow-hidden rounded-xl border-2 border-forest-100">
                  {([["online", t.booking.modeOnline], ["in_clinic", t.booking.modeClinic]] as const).map(([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => set("preferredMode", value)}
                      aria-pressed={mode === value}
                      className={cn("min-w-0 flex-1 px-1 py-2.5 text-[13px] font-bold transition-colors", mode === value ? "bg-forest-900 text-cream-100" : "bg-white text-forest-700 hover:bg-forest-50")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="min-w-0">
                <label htmlFor={id("preferredDate")} className={labelCls}>{t.booking.date}</label>
                <input id={id("preferredDate")} name="preferredDate" type="date" value={form.preferredDate} min={today || undefined} onChange={(event) => set("preferredDate", event.target.value)} className={inputCls()} />
              </div>
              <div className="min-w-0">
                <label htmlFor={id("preferredTime")} className={labelCls}>{t.booking.time}</label>
                <select id={id("preferredTime")} name="preferredTime" value={form.preferredTime} onChange={(event) => set("preferredTime", event.target.value)} className={inputCls()}>
                  <option value="">{t.booking.timeOptions[0]}</option>
                  {t.booking.timeOptions.slice(1).map((value) => <option key={value}>{value}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor={id("planInterest")} className={labelCls}>{t.booking.plan}</label>
              <select id={id("planInterest")} name="planInterest" value={form.planInterest} onChange={(event) => set("planInterest", event.target.value)} className={inputCls()}>
                {combinedPlanOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={id("message")} className={labelCls}>
                {t.booking.message} <span className="font-normal text-forest-500">{t.booking.messageHint}</span>
              </label>
              <textarea id={id("message")} name="message" value={form.message} onChange={(event) => set("message", event.target.value)} rows={2} placeholder={t.booking.messagePh} className={cn(inputCls(), "resize-y")} />
            </div>

            <div className="space-y-2">
              <label className="flex items-start gap-3 text-[13px] leading-relaxed text-forest-900/85">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={(event) => set("consent", event.target.checked)}
                  required
                  aria-invalid={errors.consent || undefined}
                  aria-describedby={errors.consent ? id("consent-error") : undefined}
                  className="mt-1 h-4 w-4 shrink-0 accent-forest-900"
                />
                <span>{f.consentText}</span>
              </label>
              <p className="pl-7 text-[12px] leading-relaxed text-forest-700/75">
                {f.privacyPre}{" "}
                <Link href="/privacy-policy" className="font-semibold underline underline-offset-2 hover:text-forest-950">
                  {f.privacyLink}
                </Link>
                {f.privacyPost}
              </p>
              {errors.consent && (
                <p id={id("consent-error")} className="pl-7 text-xs font-medium text-red-600" role="alert">
                  {errorMessage("consent")}
                </p>
              )}
            </div>

            {errors.form && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800">
                <p>{t.booking.deliveryError}</p>
                <a href={waHref} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 font-semibold underline underline-offset-2">
                  <MessageCircle className="h-4 w-4 shrink-0" />
                  {t.booking.whatsappAction}
                </a>
              </div>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="btn-shine inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-forest-950 px-5 py-4 text-center text-[15px] font-medium leading-relaxed tracking-wide text-cream-50 shadow-luxe transition-colors hover:bg-forest-900 disabled:opacity-70"
            >
              {status === "sending" ? <Loader2 className="h-5 w-5 shrink-0 animate-spin" /> : <Send className="h-5 w-5 shrink-0 text-saffron-400" />}
              <span>{status === "sending" ? t.booking.sending : submitLabel}</span>
            </button>
          </fieldset>
        </form>
      )}
    </div>
  );
}
