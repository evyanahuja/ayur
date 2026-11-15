"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft, ArrowRight, CalendarCheck, CheckCircle2, Clock, CreditCard, Loader2, Lock,
  MessageCircle, Phone, Stethoscope, Upload, User, Baby, Copy, Check,
} from "lucide-react";
import { PLANS, SITE } from "@/content/site";
import { HEALTH_CATEGORIES } from "@/content/categories";
import {
  VOPD_CONCERN_IDS, VOPD_CONCERN_LABELS, formatClinicDateTime, type PatientKind, type VopdConcernId,
} from "@/content/vopd";
import type { VopdConfig, VopdPlan } from "@/content/vopd";
import { useLanguage } from "@/i18n/LanguageContext";
import { useExpansion } from "@/i18n/expansion";
import { localizeCategory } from "@/i18n/categoriesTranslations";
import { useRegionCurrency } from "@/lib/useRegionCurrency";
import { cn } from "@/lib/cn";

type AvailabilitySlot = { startIso: string; label: string };
type PlanOption = VopdPlan & { usdPrice?: string };

type CreatedBooking = {
  reference: string;
  amountMinor: number | null;
  currency: string;
  durationMinutes: number;
  slotStart: string;
  planName: string;
  holdExpiresAt: string | null;
  requiresPayment: boolean;
};

const STEPS = ["Patient details", "Health concern", "Consultation plan", "Date & time", "Review", "Payment"] as const;

const emptyPatient = {
  patientKind: "child" as PatientKind,
  patientName: "",
  guardianName: "",
  ageOrDob: "",
  gender: "",
  phone: "",
  email: "",
  city: "",
  state: "",
};

export function VopdBookingForm() {
  const { lang } = useLanguage();
  const f = useExpansion(lang).form;
  const currency = useRegionCurrency();
  const prefix = `vopd-${useId().replace(/:/g, "")}`;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [patient, setPatient] = useState(emptyPatient);
  const [concern, setConcern] = useState<{ category: string; symptoms: string; duration: string; previousDiagnosis: string; currentTreatment: string; message: string }>({
    category: "", symptoms: "", duration: "", previousDiagnosis: "", currentTreatment: "", message: "",
  });
  const [planId, setPlanId] = useState("first");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [slotMessage, setSlotMessage] = useState("");
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotStartIso, setSlotStartIso] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [config, setConfig] = useState<VopdConfig | null>(null);
  const [bookingAvailable, setBookingAvailable] = useState(true);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<CreatedBooking | null>(null);
  const [payment, setPayment] = useState({ payerName: "", upiReference: "" });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [paymentState, setPaymentState] = useState<"idle" | "sending" | "submitted">("idle");
  const [bookingStatus, setBookingStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [meetUrl, setMeetUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedPlan = plans.find((plan) => plan.id === planId) ?? null;
  const id = (name: string) => `${prefix}-${name}`;
  const today = new Date();
  const minDate = today.toISOString().slice(0, 10);
  const maxDate = new Date(today.getTime() + 30 * 86400000).toISOString().slice(0, 10);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/vopd/config")
      .then((response) => response.json())
      .then((data) => {
        if (cancelled || !data?.ok) return;
        setPlans((data.plans as PlanOption[]).map((plan) => {
          const source = PLANS.find((entry) => entry.id === plan.id);
          return { ...plan, usdPrice: source?.usdPrice };
        }));
        setConfig(data.config as VopdConfig);
        setBookingAvailable(data.bookingAvailable !== false);
      })
      .catch(() => setBookingAvailable(false));
    return () => { cancelled = true; };
  }, []);

  const loadSlots = useCallback(async (selectedDate: string, plan: string) => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSlotMessage("");
    setSlotStartIso("");
    try {
      const response = await fetch(`/api/vopd/availability?date=${encodeURIComponent(selectedDate)}&plan=${encodeURIComponent(plan)}`);
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setSlots([]);
        setSlotMessage(data.error || "Could not check availability. Please try another date.");
      } else {
        setSlots(data.slots ?? []);
        setSlotMessage(data.message || ((data.slots ?? []).length ? "" : "No slots available on this date."));
      }
    } catch {
      setSlots([]);
      setSlotMessage("Could not check availability. Please check your connection and try again.");
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (date && planId && step === 3) void loadSlots(date, planId);
  }, [date, planId, step, loadSlots]);

  // Poll a submitted booking so the patient sees manual verification status.
  useEffect(() => {
    if (!created || paymentState !== "submitted" || !created.requiresPayment) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const response = await fetch(`/api/vopd/bookings/${created.reference}`, { cache: "no-store" });
        const data = await response.json();
        if (cancelled || !data?.ok) return;
        setBookingStatus(data.booking.status);
        setPaymentStatus(data.booking.paymentStatus);
        setMeetUrl(data.booking.meetUrl ?? null);
      } catch { /* ignore transient polling errors */ }
    };
    void poll();
    const timer = setInterval(poll, 20000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [created, paymentState]);

  const inputCls = (bad = false) => cn(
    "min-w-0 w-full rounded-xl border bg-white px-4 py-3.5 text-[14.5px] text-forest-950 placeholder:text-forest-400/50 transition-colors",
    bad ? "border-red-400 focus:border-red-500" : "border-saffron-500/20 focus:border-saffron-500 hover:border-saffron-500/45"
  );
  const labelCls = "mb-2 block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-forest-800";
  const err = (field: string, message: string) => errors[field] ? <p role="alert" className="mt-1 text-xs font-medium text-red-600">{message}</p> : null;

  const go = (next: number) => {
    setStep(next);
    setFormError("");
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const validateStep = (current: number): boolean => {
    const next: Record<string, boolean> = {};
    if (current === 0) {
      if (patient.patientName.trim().length < 2) next.patientName = true;
      if (patient.patientKind === "child" && patient.guardianName.trim().length < 2) next.guardianName = true;
      if (!patient.ageOrDob.trim()) next.ageOrDob = true;
      if (!/^[+\d][\d\s\-()]{6,18}$/.test(patient.phone.trim())) next.phone = true;
      if (patient.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email.trim())) next.email = true;
    }
    if (current === 1) {
      if (!concern.category) next.category = true;
      if (concern.symptoms.trim().length < 10) next.symptoms = true;
    }
    if (current === 3 && !slotStartIso) next.slot = true;
    if (current === 4 && !consent) next.consent = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const next = () => { if (validateStep(step)) go(step + 1); };

  async function createReservation() {
    if (!validateStep(4) || submitting) return;
    setSubmitting(true);
    setFormError("");
    try {
      const response = await fetch("/api/vopd/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientKind: patient.patientKind,
          patientName: patient.patientName,
          guardianName: patient.patientKind === "child" ? patient.guardianName : undefined,
          ageOrDob: patient.ageOrDob,
          gender: patient.gender || undefined,
          phone: patient.phone,
          email: patient.email || undefined,
          city: patient.city || undefined,
          state: patient.state || undefined,
          concernCategory: concern.category,
          symptoms: concern.symptoms,
          duration: concern.duration || undefined,
          previousDiagnosis: concern.previousDiagnosis || undefined,
          currentTreatment: concern.currentTreatment || undefined,
          message: concern.message || undefined,
          planId,
          slotStartIso,
          consent: true,
          website,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setFormError(data.error || "Could not reserve this slot. Please review your details and try again.");
        if (data.code === "SLOT_TAKEN") void loadSlots(date, planId);
        setErrors(data.errors ?? {});
        return;
      }
      setCreated({
        reference: data.reference,
        amountMinor: data.amountMinor,
        currency: data.currency,
        durationMinutes: data.durationMinutes,
        slotStart: data.slotStart,
        planName: data.planName,
        holdExpiresAt: data.holdExpiresAt,
        requiresPayment: Boolean(selectedPlan?.requiresPayment),
      });
      setBookingStatus(data.status ?? "PAYMENT_PENDING");
      setPaymentStatus(data.paymentStatus ?? "PENDING");
      setPayment((current) => ({ ...current, payerName: current.payerName || patient.patientName }));
      go(5);
    } catch {
      setFormError("Network error. Your details were not submitted. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitPaymentDetails() {
    if (!created || paymentState === "sending") return;
    const nextErrors: Record<string, boolean> = {};
    if (payment.payerName.trim().length < 2) nextErrors.payerName = true;
    if (!/^[A-Za-z0-9-]{6,40}$/.test(payment.upiReference.trim())) nextErrors.upiReference = true;
    if (screenshot && screenshot.size > 2 * 1024 * 1024) nextErrors.screenshot = true;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setPaymentState("sending");
    setFormError("");
    try {
      const form = new FormData();
      form.set("payerName", payment.payerName);
      form.set("upiReference", payment.upiReference);
      if (screenshot) form.set("screenshot", screenshot);
      const response = await fetch(`/api/vopd/bookings/${created.reference}/payment`, { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setFormError(data.error || "Could not submit payment details. Please contact the clinic on WhatsApp with your reference.");
        setErrors(data.errors ?? {});
        setPaymentState("idle");
        return;
      }
      setBookingStatus(data.status);
      setPaymentStatus(data.paymentStatus);
      setPaymentState("submitted");
    } catch {
      setPaymentState("idle");
      setFormError("Network error. Payment was not recorded. Please try again or contact the clinic.");
    }
  }

  const categoryOptions = VOPD_CONCERN_IDS.map((value) => {
    if (["panchakarma", "general", "other"].includes(value)) return { value, label: VOPD_CONCERN_LABELS[value as VopdConcernId] };
    const raw = HEALTH_CATEGORIES.find((category) => category.slug === value);
    return { value, label: raw ? localizeCategory(raw, lang).title : VOPD_CONCERN_LABELS[value as VopdConcernId] };
  });

  const feeLabel = selectedPlan
    ? selectedPlan.amountMinor != null
      ? `₹${(selectedPlan.amountMinor / 100).toLocaleString("en-IN")}`
      : "Fee confirmed by clinic"
    : "";

  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    created ? `Namaste, I need help with my VOPD booking ${created.reference}.` : "Namaste, I need help with a video consultation booking."
  )}`;

  const statusLabel = (status: string) => {
    switch (status) {
      case "PAYMENT_PENDING": return "Payment pending";
      case "PAYMENT_VERIFICATION_PENDING": return "Awaiting manual payment verification";
      case "PAYMENT_VERIFIED": return "Payment verified · confirming appointment";
      case "CONFIRMED": return "Appointment confirmed";
      case "REJECTED": return "Payment could not be verified — contact the clinic";
      case "CANCELLED": return "Booking cancelled";
      case "EXPIRED": return "Reservation expired";
      case "COMPLETED": return "Consultation completed";
      default: return status;
    }
  };

  if (!bookingAvailable) {
    return (
      <div className="px-6 py-8 sm:px-8">
        <p className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Online video consultation booking is temporarily unavailable. Please call{" "}
          <a className="font-semibold underline" href={`tel:${SITE.phoneHref}`}>{SITE.phoneDisplay}</a> or{" "}
          <a className="font-semibold underline" href={waHref} target="_blank" rel="noopener noreferrer">WhatsApp the clinic</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="px-6 py-7 sm:px-8">
      <ol className="mb-6 grid grid-cols-3 gap-2 text-[11px] sm:grid-cols-6" aria-label="Booking steps">
        {STEPS.map((label, index) => (
          <li key={label} className={cn("rounded-xl border px-2 py-2 text-center", index === step ? "border-saffron-500 bg-saffron-500/10 font-semibold text-forest-950" : index < step ? "border-forest-200 bg-forest-50 text-forest-700" : "border-forest-900/10 text-forest-700/60")}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      <h3 ref={headingRef} tabIndex={-1} className="font-display text-[20px] text-forest-950">
        {created && step === 5 ? "Complete your UPI payment" : STEPS[step]}
      </h3>

      <input type="text" name="vopd-website" value={website} onChange={(event) => setWebsite(event.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {formError && <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</p>}

      {/* Step 1 — patient details with adult/child conditional fields */}
      {step === 0 && (
        <div className="mt-4 space-y-4">
          <fieldset>
            <legend className={labelCls}>Who is the consultation for?</legend>
            <div className="grid grid-cols-2 gap-3">
              {([["child", "Child", Baby], ["adult", "Adult", User]] as const).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={patient.patientKind === value}
                  onClick={() => setPatient((current) => ({ ...current, patientKind: value, gender: "" }))}
                  className={cn("flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-colors", patient.patientKind === value ? "border-forest-900 bg-forest-900 text-cream-50" : "border-forest-100 bg-white text-forest-800 hover:border-saffron-400")}
                >
                  <Icon className="h-4 w-4" aria-hidden /> {label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[12.5px] text-forest-700/75">
              {patient.patientKind === "child" ? "Parent or guardian details are required for a child consultation." : "Adult patients do not need to provide guardian details."}
            </p>
          </fieldset>

          {patient.patientKind === "child" && (
            <div>
              <label htmlFor={id("guardianName")} className={labelCls}>Parent / Guardian full name *</label>
              <input id={id("guardianName")} value={patient.guardianName} onChange={(event) => setPatient((c) => ({ ...c, guardianName: event.target.value }))} className={inputCls(errors.guardianName)} autoComplete="name" aria-invalid={errors.guardianName || undefined} />
              {err("guardianName", "Enter the parent or guardian's full name.")}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id("patientName")} className={labelCls}>{patient.patientKind === "child" ? "Child's full name *" : "Patient's full name *"}</label>
              <input id={id("patientName")} value={patient.patientName} onChange={(event) => setPatient((c) => ({ ...c, patientName: event.target.value }))} className={inputCls(errors.patientName)} aria-invalid={errors.patientName || undefined} />
              {err("patientName", `Enter the ${patient.patientKind === "child" ? "child's" : "patient's"} full name.`)}
            </div>
            <div>
              <label htmlFor={id("ageOrDob")} className={labelCls}>Date of birth or age *</label>
              <input id={id("ageOrDob")} value={patient.ageOrDob} onChange={(event) => setPatient((c) => ({ ...c, ageOrDob: event.target.value }))} placeholder="e.g. 12 May 2018 or 6 years" className={inputCls(errors.ageOrDob)} aria-invalid={errors.ageOrDob || undefined} />
              {err("ageOrDob", "Enter the date of birth or age.")}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id("phone")} className={labelCls}>{patient.patientKind === "child" ? "Parent's mobile number *" : "Mobile number *"}</label>
              <input id={id("phone")} type="tel" inputMode="tel" autoComplete="tel" value={patient.phone} onChange={(event) => setPatient((c) => ({ ...c, phone: event.target.value }))} placeholder="+91 98765 43210" className={inputCls(errors.phone)} aria-invalid={errors.phone || undefined} />
              {err("phone", "Enter a valid mobile number.")}
            </div>
            <div>
              <label htmlFor={id("email")} className={labelCls}>Email address</label>
              <input id={id("email")} type="email" autoComplete="email" value={patient.email} onChange={(event) => setPatient((c) => ({ ...c, email: event.target.value }))} placeholder="you@example.com" className={inputCls(errors.email)} aria-invalid={errors.email || undefined} />
              {err("email", "Enter a valid email address.")}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor={id("gender")} className={labelCls}>Gender (optional)</label>
              <select id={id("gender")} value={patient.gender} onChange={(event) => setPatient((c) => ({ ...c, gender: event.target.value }))} className={inputCls()}>
                <option value="">Select</option>
                {patient.patientKind === "child" ? <><option>Girl</option><option>Boy</option></> : <><option>Female</option><option>Male</option></>}
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor={id("city")} className={labelCls}>City</label>
              <input id={id("city")} value={patient.city} onChange={(event) => setPatient((c) => ({ ...c, city: event.target.value }))} className={inputCls()} autoComplete="address-level2" />
            </div>
            <div>
              <label htmlFor={id("state")} className={labelCls}>State</label>
              <input id={id("state")} value={patient.state} onChange={(event) => setPatient((c) => ({ ...c, state: event.target.value }))} className={inputCls()} autoComplete="address-level1" />
            </div>
          </div>
          <p className="text-[12px] text-forest-700/70">Fields marked * are required. We collect only what is needed to arrange and deliver your consultation.</p>
        </div>
      )}

      {/* Step 2 — health concern */}
      {step === 1 && (
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor={id("category")} className={labelCls}>Select consultation category *</label>
            <select id={id("category")} value={concern.category} onChange={(event) => setConcern((c) => ({ ...c, category: event.target.value }))} className={inputCls(errors.category)} aria-invalid={errors.category || undefined}>
              <option value="">Choose a category</option>
              {categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            {err("category", "Choose a consultation category.")}
          </div>
          <div>
            <label htmlFor={id("symptoms")} className={labelCls}>Main symptoms *</label>
            <textarea id={id("symptoms")} rows={3} value={concern.symptoms} onChange={(event) => setConcern((c) => ({ ...c, symptoms: event.target.value }))} placeholder="Describe what the patient is experiencing. Do not share full identity documents." className={cn(inputCls(errors.symptoms), "resize-y")} aria-invalid={errors.symptoms || undefined} />
            {err("symptoms", "Please describe the main symptoms (at least 10 characters).")}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id("duration")} className={labelCls}>Duration of symptoms</label>
              <input id={id("duration")} value={concern.duration} onChange={(event) => setConcern((c) => ({ ...c, duration: event.target.value }))} placeholder="e.g. 3 weeks, 6 months" className={inputCls()} />
            </div>
            <div>
              <label htmlFor={id("previousDiagnosis")} className={labelCls}>Previous diagnosis (optional)</label>
              <input id={id("previousDiagnosis")} value={concern.previousDiagnosis} onChange={(event) => setConcern((c) => ({ ...c, previousDiagnosis: event.target.value }))} className={inputCls()} />
            </div>
          </div>
          <div>
            <label htmlFor={id("currentTreatment")} className={labelCls}>Existing treatment or medicines (optional)</label>
            <textarea id={id("currentTreatment")} rows={2} value={concern.currentTreatment} onChange={(event) => setConcern((c) => ({ ...c, currentTreatment: event.target.value }))} placeholder="List current medicines and doses, or write 'none'." className={cn(inputCls(), "resize-y")} />
            <p className="mt-1 text-[12px] text-forest-700/70">Do not stop any prescribed medicine. This form is for appointment booking, not diagnosis.</p>
          </div>
          <div>
            <label htmlFor={id("message")} className={labelCls}>Additional message (optional)</label>
            <textarea id={id("message")} rows={2} value={concern.message} onChange={(event) => setConcern((c) => ({ ...c, message: event.target.value }))} className={cn(inputCls(), "resize-y")} />
          </div>
        </div>
      )}

      {/* Step 3 — plan */}
      {step === 2 && (
        <div className="mt-4 space-y-3">
          {plans.length === 0 && <p className="flex items-center gap-2 text-sm text-forest-700"><Loader2 className="h-4 w-4 animate-spin" /> Loading consultation plans…</p>}
          {plans.map((plan) => (
            <label key={plan.id} className={cn("block cursor-pointer rounded-2xl border-2 p-4 transition-colors", planId === plan.id ? "border-forest-900 bg-forest-50" : "border-forest-100 bg-white hover:border-saffron-400")}>
              <span className="flex items-start justify-between gap-3">
                <span className="flex items-start gap-3">
                  <input type="radio" name={id("plan")} value={plan.id} checked={planId === plan.id} onChange={() => { setPlanId(plan.id); setSlotStartIso(""); }} className="mt-1 accent-forest-900" />
                  <span>
                    <span className="block font-semibold text-forest-950">{plan.name}</span>
                    <span className="block text-[13px] text-forest-800/75">{plan.description}</span>
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span className="block font-display text-[19px] text-forest-950">{plan.amountMinor != null ? `₹${(plan.amountMinor / 100).toLocaleString("en-IN")}` : "Fee on confirmation"}</span>
                  {plan.amountMinor != null && currency === "USD" && plan.usdPrice && <span className="block text-[11px] text-forest-700/70">≈ {plan.usdPrice} · UPI charged in INR</span>}
                  <span className="block text-[11px] text-forest-700/70">{plan.bookingMinutes} min session</span>
                </span>
              </span>
              <span className="mt-2 block text-[12.5px] text-forest-800/75">
                {plan.id === "wellness"
                  ? `Includes the first ${plan.bookingMinutes}-minute consultation plus ${plan.followUpCount} follow-ups of ${plan.followUpMinutes} minutes each, scheduled separately over 3 months. Not a single ${plan.followUpMinutes}-minute session.`
                  : plan.requiresPayment ? `Reserves ${plan.bookingMinutes} minutes of the doctor's calendar.` : "No online payment. The clinic will confirm scope, fee and timing."}
              </span>
            </label>
          ))}
          <p className="rounded-xl border border-forest-900/10 bg-cream-100 p-3 text-[12px] text-forest-800/80">
            Fees come from the clinic&apos;s existing pricing configuration. The payable amount is recalculated on the server when you reserve a slot.
          </p>
        </div>
      )}

      {/* Step 4 — date and time */}
      {step === 3 && (
        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id("date")} className={labelCls}>Select consultation date</label>
              <input id={id("date")} type="date" min={minDate} max={maxDate} value={date} onChange={(event) => { setDate(event.target.value); setSlotStartIso(""); }} className={inputCls()} />
              <p className="mt-1 text-[12px] text-forest-700/70">Monday–Saturday, Asia/Kolkata time. Bookings open for the next 30 days.</p>
            </div>
            <div className="rounded-xl border border-forest-900/10 bg-cream-100 p-3 text-[12.5px] text-forest-800/80">
              <p className="flex items-center gap-1.5 font-semibold text-forest-950"><Clock className="h-4 w-4" /> Clinic hours</p>
              <p className="mt-1">10:00 AM–2:00 PM &amp; 5:00 PM–8:00 PM IST</p>
              <p className="mt-1">Start times every 30 minutes; {selectedPlan?.bookingMinutes ?? 30}-minute reservation plus a scheduling buffer.</p>
            </div>
          </div>

          <div aria-live="polite">
            {loadingSlots && <p className="flex items-center gap-2 text-sm text-forest-700"><Loader2 className="h-4 w-4 animate-spin" /> Checking live availability…</p>}
            {!loadingSlots && slotMessage && <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-900">{slotMessage}</p>}
            {!loadingSlots && slots.length > 0 && (
              <>
                <p className="mb-2 text-[12.5px] font-semibold text-forest-800">Available start times ({slots.length})</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {slots.map((slot) => (
                    <button key={slot.startIso} type="button" aria-pressed={slotStartIso === slot.startIso} onClick={() => { setSlotStartIso(slot.startIso); setErrors({}); }} className={cn("rounded-xl border-2 px-3 py-2.5 text-[13px] font-semibold transition-colors", slotStartIso === slot.startIso ? "border-forest-900 bg-forest-950 text-cream-50" : "border-forest-100 bg-white text-forest-900 hover:border-saffron-400")}>
                      {slot.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {errors.slot && <p role="alert" className="text-xs font-medium text-red-600">Choose an available time slot.</p>}
        </div>
      )}

      {/* Step 5 — review and consent */}
      {step === 4 && (
        <div className="mt-4 space-y-4">
          <dl className="divide-y divide-forest-900/10 rounded-2xl border border-forest-900/10 bg-white p-4 text-[13.5px]">
            <div className="flex justify-between gap-4 py-2"><dt className="text-forest-700">Patient</dt><dd className="text-right font-semibold text-forest-950">{patient.patientName} ({patient.patientKind})</dd></div>
            {patient.guardianName && <div className="flex justify-between gap-4 py-2"><dt className="text-forest-700">Parent / Guardian</dt><dd className="text-right text-forest-950">{patient.guardianName}</dd></div>}
            <div className="flex justify-between gap-4 py-2"><dt className="text-forest-700">Category</dt><dd className="text-right text-forest-950">{categoryOptions.find((option) => option.value === concern.category)?.label}</dd></div>
            <div className="flex justify-between gap-4 py-2"><dt className="text-forest-700">Plan</dt><dd className="text-right text-forest-950">{selectedPlan?.name}</dd></div>
            <div className="flex justify-between gap-4 py-2"><dt className="text-forest-700">Fee</dt><dd className="text-right font-semibold text-forest-950">{feeLabel}</dd></div>
            <div className="flex justify-between gap-4 py-2"><dt className="text-forest-700">Date &amp; time</dt><dd className="text-right text-forest-950">{slotStartIso ? `${formatClinicDateTime(slotStartIso)} IST` : "—"}</dd></div>
            <div className="flex justify-between gap-4 py-2"><dt className="text-forest-700">Reserved time</dt><dd className="text-right text-forest-950">{selectedPlan?.bookingMinutes} minutes</dd></div>
          </dl>
          <label className="flex items-start gap-3 text-[13.5px] leading-relaxed text-forest-900/85">
            <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-forest-900" />
            <span>{f.consentText} I understand this is a video consultation request, not an emergency service, and that it is confirmed only after the clinic verifies payment.</span>
          </label>
          {errors.consent && <p role="alert" className="text-xs font-medium text-red-600">Please accept the consent statement.</p>}
          <p className="text-[12px] text-forest-700/75">Read our <a className="underline" href="/privacy-policy">privacy policy</a>. If this is an emergency, call local emergency services instead of booking online.</p>
        </div>
      )}

      {/* Step 6 — payment / confirmation */}
      {step === 5 && created && (
        <div className="mt-4 space-y-4">
          <dl className="divide-y divide-forest-900/10 rounded-2xl border border-forest-900/10 bg-white p-4 text-[13.5px]">
            <div className="flex justify-between gap-4 py-2"><dt className="text-forest-700">Booking reference</dt><dd className="font-mono font-semibold text-forest-950">{created.reference}</dd></div>
            <div className="flex justify-between gap-4 py-2"><dt className="text-forest-700">Plan</dt><dd className="text-right text-forest-950">{created.planName} · {created.durationMinutes} min</dd></div>
            <div className="flex justify-between gap-4 py-2"><dt className="text-forest-700">Date &amp; time</dt><dd className="text-right text-forest-950">{formatClinicDateTime(created.slotStart)} IST</dd></div>
            <div className="flex justify-between gap-4 py-2"><dt className="text-forest-700">Consultation fee</dt><dd className="text-right font-semibold text-forest-950">{created.amountMinor != null ? `₹${(created.amountMinor / 100).toLocaleString("en-IN")}` : "No online payment required"}</dd></div>
            {created.amountMinor != null && <div className="flex justify-between gap-4 py-2"><dt className="text-forest-700">Status</dt><dd className="text-right font-semibold text-amber-800">{statusLabel(bookingStatus || "PAYMENT_PENDING")}</dd></div>}
          </dl>

          {!created.requiresPayment ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-[13.5px] text-emerald-900">
              <p className="font-semibold">Your request is saved. No UPI payment is collected for this option.</p>
              <p className="mt-1">The clinic will confirm scope, fee if any, and your appointment. This is not yet a confirmed appointment.</p>
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 font-semibold underline"><MessageCircle className="h-4 w-4" /> Message the clinic on WhatsApp</a>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-saffron-500/30 bg-cream-100 p-4">
                <p className="flex items-center gap-2 font-semibold text-forest-950"><CreditCard className="h-4 w-4" /> Pay by UPI, then submit the transaction reference</p>
                {config?.upi.configured ? (
                  <div className="mt-3 grid gap-4 sm:grid-cols-[150px_1fr]">
                    <div className="rounded-xl border border-forest-900/10 bg-white p-2">
                      <Image src={config.upi.qrImagePath} alt="UPI QR code for BalChikitsa Ayurved Clinic" width={150} height={150} className="h-auto w-full rounded-lg object-contain" unoptimized onError={(event) => { (event.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    </div>
                    <div className="text-[13px] leading-relaxed text-forest-900/85">
                      <p><span className="font-semibold">Beneficiary:</span> {config.upi.beneficiaryName}</p>
                      <p className="mt-1"><span className="font-semibold">UPI ID:</span> {config.upi.upiId}</p>
                      <p className="mt-1"><span className="font-semibold">Amount:</span> {created.amountMinor != null ? `₹${(created.amountMinor / 100).toLocaleString("en-IN")}` : "—"}</p>
                      <p className="mt-1"><span className="font-semibold">Reference to mention:</span> {created.reference}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-4">{config.upi.instructions.map((line) => <li key={line}>{line}</li>)}</ul>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-[13px] text-amber-900">
                    Online UPI details are not configured yet. Please call the clinic on{" "}
                    <a className="font-semibold underline" href={`tel:${SITE.phoneHref}`}>{SITE.phoneDisplay}</a> or{" "}
                    <a className="font-semibold underline" href={waHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>{" "}
                    with reference <strong>{created.reference}</strong> to complete payment. Do not send money to an unverified account.
                  </div>
                )}
                {created.holdExpiresAt && paymentState !== "submitted" && (
                  <p className="mt-2 flex items-center gap-1.5 text-[12px] text-forest-700"><Lock className="h-3.5 w-3.5" /> Slot held until {formatClinicDateTime(created.holdExpiresAt)} IST. Submit payment details before then.</p>
                )}
              </div>

              {paymentState !== "submitted" ? (
                <div className="space-y-3 rounded-2xl border border-forest-900/10 bg-white p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor={id("payerName")} className={labelCls}>Name used to pay *</label>
                      <input id={id("payerName")} value={payment.payerName} onChange={(event) => setPayment((p) => ({ ...p, payerName: event.target.value }))} className={inputCls(errors.payerName)} aria-invalid={errors.payerName || undefined} />
                      {err("payerName", "Enter the payer name.")}
                    </div>
                    <div>
                      <label htmlFor={id("upiReference")} className={labelCls}>UPI transaction reference / UTR *</label>
                      <input id={id("upiReference")} value={payment.upiReference} onChange={(event) => setPayment((p) => ({ ...p, upiReference: event.target.value }))} placeholder="e.g. 123456789012" className={inputCls(errors.upiReference)} aria-invalid={errors.upiReference || undefined} />
                      {err("upiReference", "Enter the UTR from your UPI app (6–40 letters/numbers).")}
                    </div>
                  </div>
                  <div>
                    <label htmlFor={id("screenshot")} className={labelCls}>Payment screenshot (optional, max 2 MB)</label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-saffron-500/50 bg-cream-100/60 px-4 py-3 text-[13px] text-forest-800">
                      <Upload className="h-4 w-4" />
                      <span>{screenshot ? screenshot.name : "Choose PNG, JPG or WebP"}</span>
                      <input id={id("screenshot")} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => setScreenshot(event.target.files?.[0] ?? null)} />
                    </label>
                    {errors.screenshot && <p className="mt-1 text-xs font-medium text-red-600">Screenshot must be under 2 MB.</p>}
                  </div>
                  <button type="button" onClick={submitPaymentDetails} disabled={paymentState === "sending"} className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-950 px-5 py-3.5 text-[15px] font-medium text-cream-50 disabled:opacity-70">
                    {paymentState === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4 text-saffron-400" />}
                    I Have Completed Payment
                  </button>
                  <p className="text-center text-[12px] text-forest-700/75">Submitting a UTR or screenshot does <strong>not</strong> confirm your appointment. The clinic verifies the payment in its bank/UPI account.</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-[13.5px] text-amber-900">
                  <p className="font-semibold">Your online consultation request has been received.</p>
                  <p className="mt-1">Your appointment will be confirmed after payment verification. Your slot is held while the clinic checks its account. Reference: <span className="font-mono font-semibold">{created.reference}</span>.</p>
                  <p className="mt-2 rounded-lg bg-white/70 px-3 py-2 font-semibold">Status: {statusLabel(bookingStatus || "PAYMENT_VERIFICATION_PENDING")}</p>
                  {meetUrl && <p className="mt-2">Meeting link: <a className="font-semibold underline" href={meetUrl} target="_blank" rel="noopener noreferrer">Join Google Meet</a></p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={waHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/30 px-3 py-2 font-semibold"><MessageCircle className="h-4 w-4" /> WhatsApp the clinic</a>
                    <a href={`tel:${SITE.phoneHref}`} className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/30 px-3 py-2 font-semibold"><Phone className="h-4 w-4" /> {SITE.phoneDisplay}</a>
                    <button type="button" onClick={async () => { await navigator.clipboard?.writeText(created.reference); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="inline-flex items-center gap-1.5 rounded-full border border-amber-700/30 px-3 py-2 font-semibold">
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy reference"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex justify-between gap-3">
            <button type="button" onClick={() => { setCreated(null); setPaymentState("idle"); go(4); }} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-forest-700 hover:text-forest-950">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <a href="/contact#book" className="text-[13px] font-semibold text-saffron-700 hover:text-forest-950">Start another booking</a>
          </div>
        </div>
      )}

      {/* Navigation for steps 1–5 */}
      {step < 5 && (
        <div className="mt-6 flex items-center justify-between gap-3">
          <button type="button" onClick={() => go(Math.max(0, step - 1))} disabled={step === 0} className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/15 px-4 py-2.5 text-[13px] font-semibold text-forest-800 disabled:opacity-40">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < 4 ? (
            <button type="button" onClick={next} className="btn-shine inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-5 py-2.5 text-[13.5px] font-semibold text-cream-50">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={createReservation} disabled={submitting} className="btn-shine inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-5 py-2.5 text-[13.5px] font-semibold text-cream-50 disabled:opacity-70">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4 text-saffron-400" />} Reserve slot &amp; continue to payment
            </button>
          )}
        </div>
      )}

      <p className="mt-5 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-forest-700/70">
        <Stethoscope className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Video consultation is for assessment and advice. It does not replace emergency care or in-person examination when needed.
      </p>
    </div>
  );
}
