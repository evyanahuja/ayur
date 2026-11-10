"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { Baby, CheckCircle2, Loader2, MessageCircle, PartyPopper, Send, Sparkles } from "lucide-react";
import { PLANS, SITE } from "@/content/site";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/cn";
import { useRegionCurrency } from "@/lib/useRegionCurrency";

export type ConsultationMode = "online" | "in_clinic";

const initial = {
  parentName: "", phone: "", email: "", childName: "", childAge: "", childGender: "",
  concernCategory: "general", symptoms: "", preferredMode: "online" as ConsultationMode,
  preferredDate: "", preferredTime: "", planInterest: "unsure", message: "", website: "",
};
const CONCERNS = ["skin", "neurodevelopmental", "growth", "respiratory", "allergy_immunity", "lifestyle", "general", "other"];
const PLANS_KEYS = ["first", "wellness", "followup", "suvarna", "unsure"];
const REQUIRED = ["parentName", "phone", "childName", "childAge"] as const;
type ErrorField = typeof REQUIRED[number] | "email";
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

/** The same form, payload and delivery states on Home and Contact. */
export function PatientEnquiryForm({ preferredMode, onModeChange, headingLevel = 2 }: Props) {
  const { t } = useLanguage();
  const currency = useRegionCurrency();
  const prefix = `enquiry-${useId().replace(/:/g, "")}`;
  const formRef = useRef<HTMLFormElement>(null);
  const pending = useRef<AbortController | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [today, setToday] = useState("");
  const mode = preferredMode ?? form.preferredMode;
  const Heading = headingLevel === 3 ? "h3" : "h2";

  useEffect(() => {
    // Compute browser-local date after hydration, not during server rendering.
    const date = new Date();
    setToday(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`);
    return () => { pending.current?.abort(); };
  }, []);

  useEffect(() => {
    const selectPlan = (event: Event) => {
      const plan = (event as CustomEvent<string>).detail;
      if (PLANS_KEYS.includes(plan)) setForm((value) => ({ ...value, planInterest: plan }));
    };
    window.addEventListener("select-plan", selectPlan);
    return () => window.removeEventListener("select-plan", selectPlan);
  }, []);

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
    const fields = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])) as typeof initial;
    const invalid: Errors = {};
    if (fields.parentName.length < 2) invalid.parentName = true;
    if (!/^[+\d][\d\s\-()]{6,18}$/.test(fields.phone)) invalid.phone = true;
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) invalid.email = true;
    if (fields.childName.length < 2) invalid.childName = true;
    if (!fields.childAge) invalid.childAge = true;
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
        for (const key of [...REQUIRED, "email"] as ErrorField[]) {
          if (data.errors?.[key]) mapped[key] = true;
        }
        setErrors(Object.keys(mapped).length ? mapped : { form: true });
        setStatus("error");
        focusError();
        return;
      }
      const ref = typeof data.ref === "string" && data.ref.trim()
        ? data.ref : typeof data.id === "number" && data.id > 0 ? `#${data.id}` : null;
      setReceipt({ ref, emailSent: data.emailSent === true, childName: fields.childName });
      setForm(initial);
      onModeChange?.("online");
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
    "min-w-0 w-full rounded-xl border bg-white px-4 py-3.5 text-[14.5px] text-forest-950 placeholder:text-forest-400/50 transition-colors",
    bad ? "border-red-400 focus:border-red-500" : "border-saffron-500/20 focus:border-saffron-500 hover:border-saffron-500/45"
  );
  const labelCls = "mb-2 block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-forest-800";
  const id = (name: string) => `${prefix}-${name}`;
  const errorText = (name: ErrorField) => errors[name] && (
    <p id={id(`${name}-error`)} className="mt-1 text-xs font-medium text-red-600" role="alert">{t.booking.errors[name]}</p>
  );
  const input = (name: ErrorField, label: string, placeholder: string, options: InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="min-w-0">
      <label htmlFor={id(name)} className={labelCls}>{label}</label>
      <input {...options} id={id(name)} name={name} value={form[name]} onChange={(event) => set(name, event.target.value)} placeholder={placeholder}
        className={inputCls(errors[name])} required={name !== "email"} aria-invalid={errors[name] || undefined}
        aria-describedby={errors[name] ? id(`${name}-error`) : undefined} />
      {errorText(name)}
    </div>
  );
  const planOptions = t.booking.planOptions.map((label, index) => {
    const plan = PLANS.find((value) => value.id === PLANS_KEYS[index]);
    return plan ? withLivePrice(label, currency === "USD" ? plan.usdPrice : plan.price) : label;
  });
  const submitLabel = t.booking.submit.replace("{doctor}", t.site.shortDoctorName);
  const confirmation = receipt?.ref
    ? t.booking.whatsappConfirmation.replace("{child}", receipt.childName).replace("{ref}", receipt.ref)
    : t.site.whatsappMessage;
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(confirmation)}`;

  return (
    <div data-patient-enquiry className="relative min-w-0 overflow-hidden rounded-[32px] bg-cream-50 shadow-luxe-lg gold-hairline">
      <div className="flex items-center gap-4 bg-gradient-to-r from-saffron-300 via-saffron-400 to-saffron-500 px-6 py-6 sm:px-8">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-forest-950 text-saffron-300 shadow-lg"><Baby className="h-6 w-6" /></span>
        <div className="min-w-0">
          <Heading id={id("title")} className="font-display text-[22px] font-normal leading-snug text-forest-950 sm:text-[25px]">{t.booking.formTitle}</Heading>
          <p className="text-[13px] font-medium text-forest-900/70">{t.booking.formSub}</p>
        </div>
      </div>

      {status === "success" && receipt ? (
        <div ref={successRef} tabIndex={-1} className="px-6 py-10 text-center sm:px-8" role="status" aria-live="polite">
          <span className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600"><PartyPopper className="h-9 w-9" /></span>
          <h3 className="font-display text-[28px] font-light text-forest-950 sm:text-[34px]">{t.booking.successTitle}</h3>
          {receipt.ref && <p className="mt-3 text-sm font-semibold text-forest-950">{t.booking.referenceLabel}: <strong>{receipt.ref}</strong></p>}
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-forest-700">
            {(receipt.emailSent ? t.booking.successEmailMessage : t.booking.successSavedMessage).replace("{doctor}", t.site.doctorName)}
          </p>
          {!receipt.emailSent && <p className="mx-auto mt-4 max-w-md rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">{t.booking.successEmailDelayed}</p>}
          <div className="mx-auto mt-6 max-w-md space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left">
            {t.booking.successTips.filter((tip) => receipt.ref || !tip.includes("{refId}")).map((tip) => (
              <p key={tip} className="flex items-start gap-2 text-[13.5px] text-emerald-900">
                <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0" />
                <span>{tip.includes("{refId}")
                  ? <a href={waHref} target="_blank" rel="noopener noreferrer" className="underline decoration-emerald-400 underline-offset-2">{tip.replace(/#?\{refId\}/g, receipt.ref || "").replace(/\s+$/, "")}</a>
                  : tip}</span>
              </p>
            ))}
          </div>
          <button type="button" onClick={() => { setReceipt(null); setErrors({}); setStatus("idle"); }} className="mt-7 rounded-xl bg-forest-900 px-6 py-3 text-sm font-semibold text-cream-100 transition-colors hover:bg-forest-800">{t.booking.successBtn}</button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby={id("title")} aria-busy={status === "sending"} className="space-y-5 px-6 py-7 sm:px-8">
          <fieldset disabled={status === "sending"} className="min-w-0 space-y-5">
            <input type="text" name="website" value={form.website} onChange={(event) => set("website", event.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="grid gap-4 sm:grid-cols-2">
              {input("parentName", t.booking.parentName, t.booking.parentNamePh, { autoComplete: "name" })}
              {input("phone", t.booking.phone, t.booking.phonePh, { type: "tel", inputMode: "tel", autoComplete: "tel" })}
            </div>
            <div>
              <label htmlFor={id("email")} className={labelCls}>{t.booking.email} <span className="font-normal text-forest-500">{t.booking.emailHint}</span></label>
              <input id={id("email")} name="email" type="email" value={form.email} onChange={(event) => set("email", event.target.value)} placeholder={t.booking.emailPh} className={inputCls(errors.email)} autoComplete="email" aria-invalid={errors.email || undefined} aria-describedby={errors.email ? id("email-error") : undefined} />
              {errorText("email")}
            </div>

            <div className="space-y-4 rounded-[22px] border border-saffron-500/15 bg-gradient-to-b from-cream-100 to-cream-50 p-5" role="group" aria-labelledby={id("child-section")}>
              <p id={id("child-section")} className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider text-forest-700"><Sparkles className="h-4 w-4 shrink-0 text-saffron-600" />{t.booking.childSection}</p>
              <div className="grid gap-4 sm:grid-cols-3">
                {input("childName", t.booking.childName, t.booking.childNamePh, { autoComplete: "off" })}
                {input("childAge", t.booking.childAge, t.booking.childAgePh)}
                <div className="min-w-0">
                  <label htmlFor={id("childGender")} className={labelCls}>{t.booking.gender}</label>
                  <select id={id("childGender")} name="childGender" value={form.childGender} onChange={(event) => set("childGender", event.target.value)} className={inputCls()}>
                    <option value="">{t.booking.genderSelect}</option><option value="Boy">{t.booking.genderBoy}</option><option value="Girl">{t.booking.genderGirl}</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor={id("concernCategory")} className={labelCls}>{t.booking.concern}</label>
                <select id={id("concernCategory")} name="concernCategory" value={form.concernCategory} onChange={(event) => set("concernCategory", event.target.value)} className={inputCls()} required>
                  {CONCERNS.map((value, index) => <option key={value} value={value}>{t.booking.concerns[index]}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor={id("symptoms")} className={labelCls}>{t.booking.symptoms} <span className="font-normal text-forest-500">{t.booking.symptomsHint}</span></label>
                <textarea id={id("symptoms")} name="symptoms" value={form.symptoms} onChange={(event) => set("symptoms", event.target.value)} rows={3} placeholder={t.booking.symptomsPh} className={cn(inputCls(), "resize-y")} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="min-w-0" role="group" aria-labelledby={id("mode-label")}>
                <span id={id("mode-label")} className={labelCls}>{t.booking.mode}</span>
                <input type="hidden" name="preferredMode" value={mode} />
                <div className="flex overflow-hidden rounded-xl border-2 border-forest-100">
                  {([["online", t.booking.modeOnline], ["in_clinic", t.booking.modeClinic]] as const).map(([value, label]) => (
                    <button type="button" key={value} onClick={() => set("preferredMode", value)} aria-pressed={mode === value} className={cn("min-w-0 flex-1 px-1 py-2.5 text-[13px] font-bold transition-colors", mode === value ? "bg-forest-900 text-cream-100" : "bg-white text-forest-700 hover:bg-forest-50")}>{label}</button>
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
                {PLANS_KEYS.map((value, index) => <option key={value} value={value}>{planOptions[index]}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={id("message")} className={labelCls}>{t.booking.message} <span className="font-normal text-forest-500">{t.booking.messageHint}</span></label>
              <textarea id={id("message")} name="message" value={form.message} onChange={(event) => set("message", event.target.value)} rows={2} placeholder={t.booking.messagePh} className={cn(inputCls(), "resize-y")} />
            </div>
            {errors.form && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-800">
              <p>{t.booking.deliveryError}</p>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 font-semibold underline underline-offset-2"><MessageCircle className="h-4 w-4 shrink-0" />{t.booking.whatsappAction}</a>
            </div>}
            <button type="submit" disabled={status === "sending"} className="btn-shine inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-full bg-forest-950 px-5 py-[18px] text-center text-[15.5px] font-medium leading-relaxed tracking-wide text-cream-50 shadow-luxe transition-colors hover:bg-forest-900 disabled:opacity-70">
              {status === "sending" ? <Loader2 className="h-5 w-5 shrink-0 animate-spin" /> : <Send className="h-5 w-5 shrink-0 text-saffron-400" />}
              <span>{status === "sending" ? t.booking.sending : submitLabel}</span>
            </button>
          </fieldset>
          <p className="text-center text-xs leading-relaxed text-forest-600">{t.booking.agree}</p>
        </form>
      )}
    </div>
  );
}
