"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Baby, Calendar, CalendarCheck, Check, Clock, Copy, CreditCard,
  Loader2, Lock, MessageCircle, Moon, Phone, Sun, Upload, User,
} from "lucide-react";
import { SITE } from "@/content/site";
import { HEALTH_CATEGORIES } from "@/content/categories";
import {
  clinicTodayIso, computeAgeFromDob, formatDobDisplay, isValidDobString,
  allowedConcerns, isAllowedConcern, formatMinor, VOPD_CONCERN_LABELS, type PatientKind, type VopdConcernId,
  type VopdConfig, type VopdPlan,
} from "@/content/vopd";
import { useLanguage } from "@/i18n/LanguageContext";
import { useExpansion } from "@/i18n/expansion";
import { localizeCategory } from "@/i18n/categoriesTranslations";
import { formatShortClinicDate, formatVopdDateTime, vopdDict, vopdFill } from "@/i18n/vopd";
import { useRegionCurrency } from "@/lib/useRegionCurrency";
import { BOOKING_EXTRA } from "@/i18n/bookingExtras";
import { cn } from "@/lib/cn";

type AvailabilitySlot = { startIso: string; label: string; session?: "morning" | "evening" };
type CreatedBooking = {
  reference: string; amountMinor: number | null; currency: string; durationMinutes: number;
  slotStart: string; planName: string; holdExpiresAt: string | null; requiresPayment: boolean;
};

const emptyPatient = {
  patientKind: "child" as PatientKind, patientName: "", guardianName: "", ageOrDob: "",
  gender: "", phone: "", email: "", city: "", state: "",
};

type Props = { initialPlanId?: string };

export function VopdBookingForm({ initialPlanId }: Props = {}) {
  const { lang } = useLanguage();
  const f = useExpansion(lang).form;
  const v = vopdDict(lang);
  const extra = BOOKING_EXTRA[lang];
  const currency = useRegionCurrency();
  const prefix = `vopd-${useId().replace(/:/g, "")}`;
  const headingRef = useRef<HTMLHeadingElement>(null);

  const [step, setStep] = useState(0);
  const [patient, setPatient] = useState(emptyPatient);
  const [concern, setConcern] = useState({
    category: "general", symptoms: "", duration: "", previousDiagnosis: "", currentTreatment: "", message: "",
  });
  const [planId, setPlanId] = useState(initialPlanId || "first");
  const [todayIso, setTodayIso] = useState(() => clinicTodayIso());
  const [maxDateIso, setMaxDateIso] = useState(() => {
    const dt = new Date(Date.now() + 30 * 86_400_000 + 330 * 60_000);
    return dt.toISOString().slice(0, 10);
  });
  const [openDates, setOpenDates] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [slotCode, setSlotCode] = useState("");
  const [slotMessage, setSlotMessage] = useState("");
  const [slotHours, setSlotHours] = useState("");
  const [nextOpenDate, setNextOpenDate] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotStartIso, setSlotStartIso] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [plans, setPlans] = useState<VopdPlan[]>([]);
  const [config, setConfig] = useState<VopdConfig | null>(null);
  const [bookingAvailable, setBookingAvailable] = useState(true);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<CreatedBooking | null>(null);
  const [payment, setPayment] = useState({ payerName: "", upiReference: "" });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [paymentState, setPaymentState] = useState<"idle" | "sending" | "submitted">("idle");
  const [bookingStatus, setBookingStatus] = useState("");
  const [meetUrl, setMeetUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedPlan = plans.find((plan) => plan.id === planId) ?? plans[0] ?? null;
  const computedAge = patient.ageOrDob ? computeAgeFromDob(patient.ageOrDob, todayIso) : null;
  const id = (name: string) => `${prefix}-${name}`;

  // The initial plan arrives via props at mount; later changes arrive through the
  // shared "select-plan" window event (handled below), so no prop-sync effect is needed.
  useEffect(() => {
    const onSelectPlan = (event: Event) => {
      const detail = (event as CustomEvent<string | { planId?: string }>).detail;
      const targetId = typeof detail === "string" ? detail : detail?.planId;
      if (targetId) {
        setPlanId(targetId);
        setSlotStartIso("");
      }
    };
    window.addEventListener("select-plan", onSelectPlan);
    return () => window.removeEventListener("select-plan", onSelectPlan);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/vopd/config", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (cancelled || !data?.ok) return;
        const incoming = data.plans as VopdPlan[];
        setPlans(incoming);
        if (incoming.length && !incoming.some((p) => p.id === planId)) {
          setPlanId(incoming[0].id);
        }
        setConfig(data.config as VopdConfig);
        setBookingAvailable(data.bookingAvailable !== false);
        if (typeof data.today === "string") setTodayIso(data.today);
        if (typeof data.maxDate === "string") setMaxDateIso(data.maxDate);
        const upcoming = Array.isArray(data.openDates) ? (data.openDates as string[]) : [];
        setOpenDates(upcoming);
        const initial = typeof data.defaultDate === "string" && data.defaultDate
          ? data.defaultDate
          : upcoming[0] ?? "";
        if (initial) {
          setDate((prev) => prev || initial);
        }
      })
      .catch(() => setBookingAvailable(false));
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSlots = useCallback(async (selectedDate: string, plan: string) => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    setSlotCode("");
    setSlotMessage("");
    setNextOpenDate(null);
    setSlotStartIso("");
    try {
      const response = await fetch(
        `/api/vopd/availability?date=${encodeURIComponent(selectedDate)}&plan=${encodeURIComponent(plan || "first")}`,
        { cache: "no-store" }
      );
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setSlots([]);
        setSlotMessage(data.error || v.genericError);
      } else {
        setSlots(Array.isArray(data.slots) ? data.slots : []);
        setSlotHours(typeof data.hoursLabel === "string" ? data.hoursLabel : "");
        setSlotCode(typeof data.code === "string" ? data.code : "");
        setSlotMessage(typeof data.message === "string" ? data.message : "");
        setNextOpenDate(typeof data.nextAvailableDate === "string" ? data.nextAvailableDate : null);
      }
    } catch {
      setSlots([]);
      setSlotMessage(v.genericError);
    } finally {
      setLoadingSlots(false);
    }
  }, [v.genericError]);

  const effectiveDate = date || openDates[0] || todayIso;

  useEffect(() => {
    if (step !== 3 || !effectiveDate) return;
    // Defer so no state is set synchronously in the effect body; cleanup also
    // cancels a pending reload when the date/plan changes quickly.
    const timer = setTimeout(() => {
      void loadSlots(effectiveDate, selectedPlan?.id || planId || "first");
    }, 0);
    return () => clearTimeout(timer);
  }, [effectiveDate, planId, selectedPlan?.id, step, loadSlots]);

  useEffect(() => {
    if (!created || paymentState !== "submitted" || !created.requiresPayment) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const response = await fetch(`/api/vopd/bookings/${created.reference}`, { cache: "no-store" });
        const data = await response.json();
        if (cancelled || !data?.ok) return;
        setBookingStatus(data.booking.status);
        setMeetUrl(data.booking.meetUrl ?? null);
      } catch { /* transient */ }
    };
    void poll();
    const timer = setInterval(poll, 20_000);
    return () => { cancelled = true; clearInterval(timer); };
  }, [created, paymentState]);

  const inputCls = (bad = false) => cn(
    "min-w-0 w-full rounded-xl border bg-white px-4 py-3 text-[14.5px] text-forest-950 placeholder:text-forest-400/55 transition-colors",
    bad ? "border-red-400 focus:border-red-500" : "border-saffron-500/25 focus:border-saffron-500 hover:border-saffron-500/45"
  );
  const labelCls = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-800";
  const err = (field: string, message: string) =>
    errors[field] ? <p role="alert" className="mt-1 text-xs font-medium text-red-600">{message}</p> : null;

  const go = (target: number) => {
    setStep(target);
    setFormError("");
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const validateStep = (current: number): boolean => {
    const invalid: Record<string, boolean> = {};
    if (current === 0) {
      if (patient.patientName.trim().length < 2) invalid.patientName = true;
      if (patient.patientKind === "child" && patient.guardianName.trim().length < 2) invalid.guardianName = true;
      if (!isValidDobString(patient.ageOrDob.trim(), todayIso)) invalid.ageOrDob = true;
      if (!/^[+\d][\d\s\-()]{6,18}$/.test(patient.phone.trim())) invalid.phone = true;
      if (patient.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email.trim())) invalid.email = true;
      if (patient.patientKind === "adult" && !["Male", "Female"].includes(patient.gender)) invalid.gender = true;
    }
    if (current === 1) {
      if (!isAllowedConcern(concern.category, patient.patientKind, patient.gender)) invalid.category = true;
      if (concern.symptoms.trim().length < 5) invalid.symptoms = true;
    }
    if (current === 3 && !slotStartIso) invalid.slot = true;
    if (current === 4 && !consent) invalid.consent = true;
    if (current === 4 && selectedPlan?.requiresPayment && currency === "USD" && !selectedPlan.amountMinorUsd) invalid.currency = true;
    setErrors(invalid);
    return Object.keys(invalid).length === 0;
  };

  const next = () => { if (validateStep(step)) go(step + 1); };

  const localizedError = (data: { code?: string; error?: string }) =>
    (data.code && v.codes[data.code]) || data.error || v.genericError;

  const localizedSlotNotice = () => {
    if (slotCode === "SUNDAY_CLOSED") return v.slot.sundayClosed;
    if (slotCode === "TODAY_ENDED") return v.slot.todayEnded;
    if (slotCode === "DAY_BLOCKED") return v.slot.dayBlocked;
    if (slotCode === "NO_SLOTS") return v.slot.noSlots;
    return slotMessage;
  };

  async function createReservation() {
    if (!validateStep(4) || submitting) return;
    setSubmitting(true);
    setFormError("");
    try {
      const activePlanId = selectedPlan?.id || planId || "first";
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
          planId: activePlanId,
          currency,
          slotStartIso,
          consent: true,
          locale: lang,
          website,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setFormError(localizedError(data));
        if (data.code === "SLOT_TAKEN") void loadSlots(date, activePlanId);
        if (data.errors && typeof data.errors === "object") {
          const flagged: Record<string, boolean> = {};
          for (const key of Object.keys(data.errors)) flagged[key] = true;
          setErrors(flagged);
        }
        return;
      }
      setCreated({
        reference: data.reference,
        amountMinor: data.amountMinor,
        currency: data.currency,
        durationMinutes: data.durationMinutes,
        slotStart: data.slotStart,
        planName: data.planName,
        holdExpiresAt: data.holdExpiresAt ?? null,
        requiresPayment: Boolean(selectedPlan?.requiresPayment && data.amountMinor != null),
      });
      setBookingStatus(data.status ?? "PAYMENT_PENDING");
      setPayment((current) => ({
        ...current,
        payerName: current.payerName || (patient.patientKind === "child" ? patient.guardianName : patient.patientName),
      }));
      go(5);
    } catch {
      setFormError(v.genericError);
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
        setFormError(localizedError(data));
        setPaymentState("idle");
        return;
      }
      setBookingStatus(data.status);
      setPaymentState("submitted");
    } catch {
      setPaymentState("idle");
      setFormError(v.genericError);
    }
  }

  function resetAll() {
    setCreated(null);
    setPaymentState("idle");
    setPayment({ payerName: "", upiReference: "" });
    setScreenshot(null);
    setSlotStartIso("");
    setConsent(false);
    setErrors({});
    setFormError("");
    setStep(0);
  }

  const categoryOptions = allowedConcerns(patient.patientKind, patient.gender).map((value) => {
    if (value === "general") return { value, label: extra.general };
    if (value === "other") return { value, label: extra.other };
    if (value === "panchakarma") return { value, label: extra.panchakarma };
    const raw = HEALTH_CATEGORIES.find((category) => category.slug === value);
    return { value, label: raw ? localizeCategory(raw, lang).title : VOPD_CONCERN_LABELS[value as VopdConcernId] };
  });
  const categoryLabel = (value: string) => categoryOptions.find((option) => option.value === value)?.label ?? value;

  const planFee = (plan: VopdPlan): string => {
    if (!plan.requiresPayment) return v.plan.feeOnConfirm;
    const amount = currency === "USD" ? plan.amountMinorUsd : plan.amountMinor;
    return amount != null && amount > 0 ? formatMinor(amount, currency) : extra.currencyMissing;
  };
  const feeLabel = selectedPlan ? planFee(selectedPlan) : "";
  const statusLabel = (st: string) => v.status[st] ?? st;
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    created ? `${v.pay.reference}: ${created.reference} (${created.planName})` : v.pay.whatsapp
  )}`;

  const morningSlots = slots.filter((s) => {
    if (s.session) return s.session === "morning";
    return s.label.endsWith("AM") || s.label.startsWith("12:") || s.label.startsWith("1:");
  });
  const eveningSlots = slots.filter((s) => !morningSlots.includes(s));

  if (!bookingAvailable) {
    return (
      <div className="px-6 py-8 sm:px-8">
        <p className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          {vopdFill(v.unavailable, { phone: SITE.phoneDisplay })}{" "}
          <a className="font-semibold underline" href={`tel:${SITE.phoneHref}`}>{SITE.phoneDisplay}</a>
        </p>
      </div>
    );
  }

  const totalSteps = v.steps.length;
  const progressPct = Math.round(((step + 1) / totalSteps) * 100);
  const noticeText = localizedSlotNotice();

  return (
    <div className="px-5 py-6 sm:px-8 sm:py-7">
      {/* Clean, balanced stepper — never wraps words awkwardly */}
      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between text-[11.5px] font-medium text-forest-700">
          <span className="font-semibold uppercase tracking-[0.14em] text-saffron-700">
            {vopdFill(v.stepCounter, { current: step + 1, total: totalSteps })}
          </span>
          <span className="text-forest-700/70">{progressPct}%</span>
        </div>

        <div className="mb-3.5 h-1.5 w-full overflow-hidden rounded-full bg-forest-900/10" aria-hidden="true">
          <div
            className="h-full rounded-full bg-gradient-to-r from-forest-900 via-forest-700 to-saffron-500 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <ol className="grid grid-cols-6 gap-1 sm:gap-1.5" aria-label="Booking progress">
          {v.steps.map((label, index) => {
            const isCurrent = index === step;
            const isDone = index < step;
            const canJump = isDone && !created;
            return (
              <li key={label} className="min-w-0">
                <button
                  type="button"
                  disabled={!canJump}
                  onClick={() => canJump && go(index)}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex w-full flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-center transition-colors",
                    canJump ? "cursor-pointer hover:bg-forest-50" : "cursor-default"
                  )}
                >
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11.5px] font-bold transition-all",
                      isCurrent
                        ? "bg-forest-950 text-saffron-300 ring-2 ring-saffron-400/60 shadow-sm"
                        : isDone
                          ? "bg-emerald-700 text-white"
                          : "bg-forest-900/8 text-forest-700/65"
                    )}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> : index + 1}
                  </span>
                  <span
                    className={cn(
                      "block max-w-full truncate text-[10.5px] leading-tight sm:text-[11px]",
                      isCurrent
                        ? "font-semibold text-forest-950"
                        : isDone
                          ? "font-medium text-forest-800"
                          : "text-forest-700/55"
                    )}
                  >
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <h3 ref={headingRef} tabIndex={-1} className="font-display text-[21px] text-forest-950 outline-none sm:text-[23px]">
        {created && step === 5 ? v.paymentHeading : (v.stepHeadings[step] ?? v.steps[step])}
      </h3>

      <input
        type="text"
        name="vopd-website"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {formError && (
        <p role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {formError}
        </p>
      )}

      {/* STEP 1: Patient details */}
      {step === 0 && (
        <div className="mt-4 space-y-4">
          <fieldset>
            <legend className={labelCls}>{v.patient.who}</legend>
            <div className="grid grid-cols-2 gap-3">
              {([["child", v.patient.child, Baby], ["adult", v.patient.adult, User]] as const).map(([value, label, Icon]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={patient.patientKind === value}
                  onClick={() => {
                    setPatient((current) => ({ ...current, patientKind: value, gender: "" }));
                    setConcern((current) => isAllowedConcern(current.category, value, "") ? current : { ...current, category: "general" });
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-colors",
                    patient.patientKind === value
                      ? "border-forest-900 bg-forest-950 text-cream-50"
                      : "border-forest-100 bg-white text-forest-800 hover:border-saffron-400"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden /> {label}
                </button>
              ))}
            </div>
          </fieldset>

          {patient.patientKind === "child" && (
            <div>
              <label htmlFor={id("guardianName")} className={labelCls}>{v.patient.guardian}</label>
              <input
                id={id("guardianName")}
                value={patient.guardianName}
                onChange={(event) => {
                  setPatient((c) => ({ ...c, guardianName: event.target.value }));
                  setErrors((e) => ({ ...e, guardianName: false }));
                }}
                className={inputCls(errors.guardianName)}
                autoComplete="name"
                aria-invalid={errors.guardianName || undefined}
              />
              {err("guardianName", v.patient.eGuardian)}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id("patientName")} className={labelCls}>
                {patient.patientKind === "child" ? v.patient.childName : v.patient.adultName}
              </label>
              <input
                id={id("patientName")}
                value={patient.patientName}
                onChange={(event) => {
                  setPatient((c) => ({ ...c, patientName: event.target.value }));
                  setErrors((e) => ({ ...e, patientName: false }));
                }}
                className={inputCls(errors.patientName)}
                aria-invalid={errors.patientName || undefined}
              />
              {err("patientName", patient.patientKind === "child" ? v.patient.eChildName : v.patient.eAdultName)}
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label htmlFor={id("ageOrDob")} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-800">
                  {v.patient.dob}
                </label>
                {computedAge && (
                  <span className="rounded-full bg-forest-50 px-2.5 py-0.5 text-[11px] font-semibold text-forest-800">
                    {v.patient.agePrefix}: {computedAge.short}
                  </span>
                )}
              </div>
              <input
                id={id("ageOrDob")}
                type="date"
                min="1905-01-01"
                max={todayIso}
                value={patient.ageOrDob}
                onChange={(event) => {
                  setPatient((c) => ({ ...c, ageOrDob: event.target.value }));
                  setErrors((e) => ({ ...e, ageOrDob: false }));
                }}
                className={inputCls(errors.ageOrDob)}
                autoComplete="bday"
                aria-invalid={errors.ageOrDob || undefined}
              />
              {err("ageOrDob", v.patient.eDob)}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id("phone")} className={labelCls}>
                {patient.patientKind === "child" ? v.patient.phoneChild : v.patient.phoneAdult}
              </label>
              <input
                id={id("phone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={patient.phone}
                onChange={(event) => {
                  setPatient((c) => ({ ...c, phone: event.target.value }));
                  setErrors((e) => ({ ...e, phone: false }));
                }}
                placeholder="+91 98765 43210"
                className={inputCls(errors.phone)}
                aria-invalid={errors.phone || undefined}
              />
              {err("phone", v.patient.ePhone)}
            </div>
            <div>
              <label htmlFor={id("email")} className={labelCls}>{v.patient.email}</label>
              <input
                id={id("email")}
                type="email"
                autoComplete="email"
                value={patient.email}
                onChange={(event) => {
                  setPatient((c) => ({ ...c, email: event.target.value }));
                  setErrors((e) => ({ ...e, email: false }));
                }}
                placeholder="you@example.com"
                className={inputCls(errors.email)}
                aria-invalid={errors.email || undefined}
              />
              {err("email", v.patient.eEmail)}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor={id("gender")} className={labelCls}>
                {v.patient.gender}
                {patient.patientKind === "adult" ? (
                  <span aria-hidden="true" className="ml-0.5 text-clay-500">*</span>
                ) : null}
              </label>
              <select
                id={id("gender")}
                aria-required={patient.patientKind === "adult"}
                value={patient.gender}
                onChange={(event) => {
                  const gender = event.target.value;
                  setPatient((current) => ({ ...current, gender }));
                  setConcern((current) => isAllowedConcern(current.category, patient.patientKind, gender) ? current : { ...current, category: "general" });
                  setErrors((current) => ({ ...current, gender: false }));
                }}
                className={inputCls()}
              >
                <option value="">{v.patient.select}</option>
                {patient.patientKind === "child" ? (
                  <>
                    <option value="Girl">{v.patient.girl}</option>
                    <option value="Boy">{v.patient.boy}</option>
                  </>
                ) : (
                  <>
                    <option value="Female">{v.patient.female}</option>
                    <option value="Male">{v.patient.male}</option>
                  </>
                )}
                {patient.patientKind === "child" && <option value="Other">{v.patient.other}</option>}
              </select>
              {err("gender", extra.genderRequired)}
            </div>
            <div>
              <label htmlFor={id("city")} className={labelCls}>{v.patient.city}</label>
              <input
                id={id("city")}
                value={patient.city}
                onChange={(event) => setPatient((c) => ({ ...c, city: event.target.value }))}
                className={inputCls()}
                autoComplete="address-level2"
              />
            </div>
            <div>
              <label htmlFor={id("state")} className={labelCls}>{v.patient.state}</label>
              <input
                id={id("state")}
                value={patient.state}
                onChange={(event) => setPatient((c) => ({ ...c, state: event.target.value }))}
                className={inputCls()}
                autoComplete="address-level1"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Health concern */}
      {step === 1 && (
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor={id("category")} className={labelCls}>{v.concern.category}</label>
            <select
              id={id("category")}
              value={concern.category}
              onChange={(event) => {
                setConcern((c) => ({ ...c, category: event.target.value }));
                setErrors((e) => ({ ...e, category: false }));
              }}
              className={inputCls(errors.category)}
              aria-invalid={errors.category || undefined}
            >
              <option value="">{v.concern.choose}</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            {err("category", v.concern.eCategory)}
          </div>
          <div>
            <label htmlFor={id("symptoms")} className={labelCls}>{v.concern.symptoms}</label>
            <textarea
              id={id("symptoms")}
              rows={3}
              value={concern.symptoms}
              onChange={(event) => {
                setConcern((c) => ({ ...c, symptoms: event.target.value }));
                setErrors((e) => ({ ...e, symptoms: false }));
              }}
              placeholder={v.concern.symptomsPh}
              className={cn(inputCls(errors.symptoms), "resize-y")}
              aria-invalid={errors.symptoms || undefined}
            />
            {err("symptoms", v.concern.eSymptoms)}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={id("duration")} className={labelCls}>{v.concern.duration}</label>
              <input
                id={id("duration")}
                value={concern.duration}
                onChange={(event) => setConcern((c) => ({ ...c, duration: event.target.value }))}
                placeholder={v.concern.durationPh}
                className={inputCls()}
              />
            </div>
            <div>
              <label htmlFor={id("previousDiagnosis")} className={labelCls}>{v.concern.previous}</label>
              <input
                id={id("previousDiagnosis")}
                value={concern.previousDiagnosis}
                onChange={(event) => setConcern((c) => ({ ...c, previousDiagnosis: event.target.value }))}
                className={inputCls()}
              />
            </div>
          </div>
          <div>
            <label htmlFor={id("currentTreatment")} className={labelCls}>{v.concern.treatment}</label>
            <textarea
              id={id("currentTreatment")}
              rows={2}
              value={concern.currentTreatment}
              onChange={(event) => setConcern((c) => ({ ...c, currentTreatment: event.target.value }))}
              placeholder={v.concern.treatmentPh}
              className={cn(inputCls(), "resize-y")}
            />
          </div>
          <div>
            <label htmlFor={id("message")} className={labelCls}>{v.concern.message}</label>
            <textarea
              id={id("message")}
              rows={2}
              value={concern.message}
              onChange={(event) => setConcern((c) => ({ ...c, message: event.target.value }))}
              className={cn(inputCls(), "resize-y")}
            />
          </div>
        </div>
      )}

      {/* STEP 3: Consultation plan (dynamically includes all active custom plans) */}
      {step === 2 && (
        <div className="mt-4 space-y-3">
          {plans.length === 0 && (
            <p className="flex items-center gap-2 text-sm text-forest-700">
              <Loader2 className="h-4 w-4 animate-spin" /> {v.plan.loading}
            </p>
          )}
          {plans.map((plan) => {
            const active = (selectedPlan?.id ?? planId) === plan.id;
            return (
              <label
                key={plan.id}
                className={cn(
                  "block cursor-pointer rounded-2xl border-2 p-4 transition-all",
                  active
                    ? "border-forest-900 bg-forest-50/80 shadow-sm"
                    : "border-forest-100 bg-white hover:border-saffron-400"
                )}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="flex items-start gap-3">
                    <input
                      type="radio"
                      name={id("plan")}
                      value={plan.id}
                      checked={active}
                      onChange={() => { setPlanId(plan.id); setSlotStartIso(""); }}
                      className="mt-1 accent-forest-900"
                    />
                    <span>
                      <span className="block font-semibold text-forest-950">{plan.name}</span>
                      <span className="mt-0.5 block text-[13px] leading-relaxed text-forest-800/75">{plan.description}</span>
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block font-display text-[19px] text-forest-950">
                      {planFee(plan)}
                    </span>

                    <span className="mt-0.5 inline-block rounded-full bg-saffron-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-forest-900">
                      {vopdFill(v.plan.minutes, { n: plan.bookingMinutes })}
                    </span>
                  </span>
                </span>
                {plan.followUpCount > 0 && (
                  <span className="mt-2 block pl-7 text-[12.5px] font-medium text-forest-800/80">
                    {vopdFill(v.plan.followUps, {
                      first: plan.bookingMinutes,
                      follows: plan.followUpCount,
                      followMin: plan.followUpMinutes,
                    })}
                  </span>
                )}
                {!plan.requiresPayment && (
                  <span className="mt-1.5 block pl-7 text-[12px] text-forest-700/75">{v.plan.enquiryOnly}</span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {/* STEP 4: Date & time slots */}
      {step === 3 && (
        <div className="mt-4 space-y-4">
          {openDates.length > 0 && (
            <div>
              <p className={labelCls}>{v.slot.quickPick}</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {openDates.map((d) => {
                  const formatted = formatShortClinicDate(d, lang);
                  const selected = effectiveDate === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => { setDate(d); setSlotStartIso(""); setErrors({}); }}
                      className={cn(
                        "flex flex-col items-center rounded-xl border-2 px-2 py-2 text-center transition-all",
                        selected
                          ? "border-forest-900 bg-forest-950 text-cream-50 shadow-sm"
                          : "border-forest-100 bg-white text-forest-900 hover:border-saffron-400"
                      )}
                    >
                      <span className={cn("text-[10px] font-semibold uppercase tracking-wider", selected ? "text-saffron-300" : "text-forest-600")}>
                        {formatted.weekday}
                      </span>
                      <span className="mt-0.5 text-[12.5px] font-bold leading-tight">{formatted.dayMonth}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={id("date")} className={labelCls}>{v.slot.date}</label>
              <input
                id={id("date")}
                type="date"
                min={todayIso}
                max={maxDateIso}
                value={date || effectiveDate}
                onChange={(event) => { setDate(event.target.value); setSlotStartIso(""); setErrors({}); }}
                className={inputCls()}
              />
            </div>
            <div className="flex flex-col justify-center rounded-xl border border-forest-900/10 bg-cream-100/90 px-3.5 py-3 text-[12.5px] text-forest-800/85">
              <p className="flex items-center gap-1.5 font-semibold text-forest-950">
                <Clock className="h-3.5 w-3.5 text-saffron-700" aria-hidden /> {v.slot.hours}
              </p>
              <p className="mt-0.5">{slotHours || v.slot.hoursValue}</p>
              <p className="mt-0.5 text-[11.5px] text-forest-700/75">
                {vopdFill(v.slot.sessionNote, { n: selectedPlan?.bookingMinutes ?? 30 })}
              </p>
            </div>
          </div>

          <div aria-live="polite" className="space-y-3">
            {loadingSlots && (
              <p className="flex items-center gap-2 py-3 text-sm text-forest-700">
                <Loader2 className="h-4 w-4 animate-spin text-saffron-600" /> {v.slot.checking}
              </p>
            )}

            {!loadingSlots && slots.length === 0 && noticeText && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-950">
                <p>{noticeText}</p>
                {nextOpenDate && (
                  <button
                    type="button"
                    onClick={() => { setDate(nextOpenDate); setSlotStartIso(""); }}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-3.5 py-1.5 text-[12px] font-semibold text-cream-50 hover:bg-forest-900"
                  >
                    <Calendar className="h-3.5 w-3.5 text-saffron-300" aria-hidden />
                    {vopdFill(v.slot.jumpNext, {
                      date: `${formatShortClinicDate(nextOpenDate, lang).weekday}, ${formatShortClinicDate(nextOpenDate, lang).dayMonth}`,
                    })}
                  </button>
                )}
              </div>
            )}

            {!loadingSlots && slots.length > 0 && (
              <div className="space-y-3.5">
                <p className="text-[12px] font-semibold text-emerald-800">
                  {vopdFill(v.slot.available, { n: slots.length })}
                </p>

                {morningSlots.length > 0 && (
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-700">
                      <Sun className="h-3.5 w-3.5 text-saffron-600" aria-hidden /> {v.slot.morning}
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {morningSlots.map((slot) => (
                        <button
                          key={slot.startIso}
                          type="button"
                          aria-pressed={slotStartIso === slot.startIso}
                          onClick={() => { setSlotStartIso(slot.startIso); setErrors({}); }}
                          className={cn(
                            "rounded-xl border-2 px-3 py-2.5 text-[13px] font-semibold transition-all",
                            slotStartIso === slot.startIso
                              ? "border-forest-900 bg-forest-950 text-cream-50 shadow-sm"
                              : "border-forest-100 bg-white text-forest-900 hover:border-saffron-400"
                          )}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {eveningSlots.length > 0 && (
                  <div>
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-forest-700">
                      <Moon className="h-3.5 w-3.5 text-forest-600" aria-hidden /> {v.slot.evening}
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {eveningSlots.map((slot) => (
                        <button
                          key={slot.startIso}
                          type="button"
                          aria-pressed={slotStartIso === slot.startIso}
                          onClick={() => { setSlotStartIso(slot.startIso); setErrors({}); }}
                          className={cn(
                            "rounded-xl border-2 px-3 py-2.5 text-[13px] font-semibold transition-all",
                            slotStartIso === slot.startIso
                              ? "border-forest-900 bg-forest-950 text-cream-50 shadow-sm"
                              : "border-forest-100 bg-white text-forest-900 hover:border-saffron-400"
                          )}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {errors.slot && <p role="alert" className="text-xs font-medium text-red-600">{v.slot.eSlot}</p>}
        </div>
      )}

      {/* STEP 5: Review */}
      {step === 4 && (
        <div className="mt-4 space-y-4">
          <dl className="divide-y divide-forest-900/10 rounded-2xl border border-forest-900/10 bg-white p-4 text-[13.5px]">
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-forest-700">{v.review.patient}</dt>
              <dd className="text-right font-semibold text-forest-950">
                {patient.patientName} ({patient.patientKind === "child" ? v.patient.child : v.patient.adult})
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-forest-700">{v.review.dob}</dt>
              <dd className="text-right text-forest-950">
                {formatDobDisplay(patient.ageOrDob, lang)}
                {computedAge ? ` (${computedAge.short})` : ""}
              </dd>
            </div>
            {patient.patientKind === "child" && patient.guardianName && (
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-forest-700">{v.review.guardian}</dt>
                <dd className="text-right text-forest-950">{patient.guardianName}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-forest-700">{v.review.category}</dt>
              <dd className="text-right text-forest-950">{categoryLabel(concern.category)}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-forest-700">{v.review.plan}</dt>
              <dd className="text-right text-forest-950">{selectedPlan?.name}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-forest-700">{v.review.when}</dt>
              <dd className="text-right font-medium text-forest-950">
                {slotStartIso ? `${formatVopdDateTime(slotStartIso, lang)} IST` : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-forest-700">{v.review.duration}</dt>
              <dd className="text-right text-forest-950">
                {selectedPlan?.bookingMinutes ?? 30} {v.review.mins}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-forest-700">{v.review.fee}</dt>
              <dd className="text-right font-semibold text-forest-950">{feeLabel}</dd>
            </div>
          </dl>
          {errors.currency && <p role="alert" className="mt-2 text-sm font-medium text-red-700">{extra.currencyMissing}</p>}

          <label className="flex items-start gap-3 text-[13px] leading-relaxed text-forest-900/85">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
                setErrors((e) => ({ ...e, consent: false }));
              }}
              className="mt-1 h-4 w-4 shrink-0 accent-forest-900"
            />
            <span>{f.consentText} {v.review.consent}</span>
          </label>
          {errors.consent && <p role="alert" className="text-xs font-medium text-red-600">{v.review.eConsent}</p>}
          <p className="text-[12px] text-forest-700/70">
            {v.review.privacyPre}{" "}
            <Link className="font-medium underline underline-offset-2" href="/privacy-policy">{v.review.privacyLink}</Link>
            {v.review.privacyPost}
          </p>
        </div>
      )}

      {/* STEP 6: Payment */}
      {step === 5 && created && (
        <div className="mt-4 space-y-4">
          <dl className="divide-y divide-forest-900/10 rounded-2xl border border-forest-900/10 bg-white p-4 text-[13.5px]">
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-forest-700">{v.pay.reference}</dt>
              <dd className="font-mono font-semibold text-forest-950">{created.reference}</dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-forest-700">{v.pay.plan}</dt>
              <dd className="text-right text-forest-950">
                {created.planName} · {created.durationMinutes} {v.review.mins}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-forest-700">{v.pay.when}</dt>
              <dd className="text-right text-forest-950">{formatVopdDateTime(created.slotStart, lang)} IST</dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-forest-700">{v.pay.fee}</dt>
              <dd className="text-right font-semibold text-forest-950">
                {created.amountMinor != null
                  ? formatMinor(created.amountMinor, created.currency === "USD" ? "USD" : "INR")
                  : v.plan.feeOnConfirm}
              </dd>
            </div>
            {created.amountMinor != null && (
              <div className="flex justify-between gap-4 py-2">
                <dt className="text-forest-700">{v.pay.status}</dt>
                <dd className="text-right font-semibold text-amber-800">
                  {statusLabel(bookingStatus || "PAYMENT_PENDING")}
                </dd>
              </div>
            )}
          </dl>

          {!created.requiresPayment ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-[13.5px] text-emerald-900">
              <p className="font-semibold">{v.pay.noPayTitle}</p>
              <p className="mt-1">{v.pay.noPayBody}</p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 font-semibold underline"
              >
                <MessageCircle className="h-4 w-4" /> {v.pay.whatsapp}
              </a>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-saffron-500/30 bg-cream-100 p-4">
                <p className="flex items-center gap-2 font-semibold text-forest-950">
                  <CreditCard className="h-4 w-4 text-saffron-700" /> {created.currency === "USD" ? extra.internationalTitle : v.pay.upiTitle}
                </p>
                {created.currency === "USD" ? (
                  <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-forest-900">
                    <p>{extra.internationalHelp}</p>
                    {config?.usdPaymentInstructions && <p className="rounded-lg bg-white p-3">{config.usdPaymentInstructions}</p>}
                    <a className="font-semibold underline" href={waHref} target="_blank" rel="noopener noreferrer">{v.pay.whatsapp}</a>
                  </div>
                ) : config?.upi.configured ? (
                  <div className="mt-3 grid gap-4 sm:grid-cols-[168px_1fr]">
                    <div className="rounded-xl border border-forest-900/10 bg-white p-2">
                      <Image
                        src={config.upi.qrImagePath || `/api/vopd/bookings/${created.reference}/upi-qr`}
                        alt={`UPI QR code — pay ${created.amountMinor != null ? formatMinor(created.amountMinor, "INR") : "the consultation fee"} to ${config.upi.beneficiaryName} with reference ${created.reference}`}
                        width={168}
                        height={168}
                        className="h-auto w-full rounded-lg object-contain"
                        unoptimized
                        onError={config.upi.qrImagePath ? (event) => { (event.currentTarget as HTMLImageElement).style.display = "none"; } : undefined}
                      />
                    </div>
                    <div className="text-[13px] leading-relaxed text-forest-900/85">
                      <p><span className="font-semibold">{v.pay.beneficiary}:</span> {config.upi.beneficiaryName}</p>
                      <p className="mt-1"><span className="font-semibold">{v.pay.upiId}:</span> {config.upi.upiId}</p>
                      <p className="mt-1">
                        <span className="font-semibold">{v.pay.amount}:</span>{" "}
                        {created.amountMinor != null ? formatMinor(created.amountMinor, "INR") : "—"}
                      </p>
                      <p className="mt-1"><span className="font-semibold">{v.pay.mention}:</span> {created.reference}</p>
                      <p className="mt-2 text-[12px] text-forest-700/80">{v.pay.scanHint}</p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-[13px] text-amber-900">
                    {vopdFill(v.pay.notConfigured, { ref: created.reference })}{" "}
                    <a className="font-semibold underline" href={`tel:${SITE.phoneHref}`}>{SITE.phoneDisplay}</a> ·{" "}
                    <a className="font-semibold underline" href={waHref} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                  </div>
                )}
                {created.currency === "INR" && config?.upi.configured && config.upi.demo && (
                  <p className="mt-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-[12px] font-medium text-amber-900">
                    {v.pay.demoNote}
                  </p>
                )}
                {created.holdExpiresAt && paymentState !== "submitted" && (
                  <p className="mt-2.5 flex items-center gap-1.5 text-[12px] text-forest-700">
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    {vopdFill(v.pay.hold, { time: formatVopdDateTime(created.holdExpiresAt, lang) })}
                  </p>
                )}
              </div>

              {paymentState !== "submitted" ? (
                <div className="space-y-3 rounded-2xl border border-forest-900/10 bg-white p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor={id("payerName")} className={labelCls}>{v.pay.payer}</label>
                      <input
                        id={id("payerName")}
                        value={payment.payerName}
                        onChange={(event) => setPayment((p) => ({ ...p, payerName: event.target.value }))}
                        className={inputCls(errors.payerName)}
                        aria-invalid={errors.payerName || undefined}
                      />
                      {err("payerName", v.pay.ePayer)}
                    </div>
                    <div>
                      <label htmlFor={id("upiReference")} className={labelCls}>{created.currency === "USD" ? extra.transactionReference : v.pay.utr}</label>
                      <input
                        id={id("upiReference")}
                        value={payment.upiReference}
                        onChange={(event) => setPayment((p) => ({ ...p, upiReference: event.target.value }))}
                        placeholder={v.pay.utrPh}
                        className={inputCls(errors.upiReference)}
                        aria-invalid={errors.upiReference || undefined}
                      />
                      {err("upiReference", created.currency === "USD" ? extra.referenceError : v.pay.eUtr)}
                    </div>
                  </div>
                  <div>
                    <label htmlFor={id("screenshot")} className={labelCls}>{v.pay.screenshot}</label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-saffron-500/50 bg-cream-100/60 px-4 py-3 text-[13px] text-forest-800 hover:bg-cream-100">
                      <Upload className="h-4 w-4 shrink-0" />
                      <span className="truncate">{screenshot ? screenshot.name : v.pay.chooseFile}</span>
                      <input
                        id={id("screenshot")}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="sr-only"
                        onChange={(event) => setScreenshot(event.target.files?.[0] ?? null)}
                      />
                    </label>
                    {errors.screenshot && <p className="mt-1 text-xs font-medium text-red-600">{v.pay.eScreenshot}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={submitPaymentDetails}
                    disabled={paymentState === "sending"}
                    className="btn-shine inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-950 px-5 py-3.5 text-[14.5px] font-semibold text-cream-50 hover:bg-forest-900 disabled:opacity-70"
                  >
                    {paymentState === "sending" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="h-4 w-4 text-saffron-400" />
                    )}
                    {v.pay.submit}
                  </button>
                  <p className="text-center text-[12px] text-forest-700/70">{v.pay.disclaimer}</p>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-[13.5px] text-forest-950">
                  <p className="font-semibold text-emerald-950">{v.pay.receivedTitle}</p>
                  <p className="mt-1 text-forest-800">{vopdFill(v.pay.receivedBody, { ref: created.reference })}</p>
                  <p className="mt-2.5 rounded-lg bg-white/80 px-3 py-2 text-[13px] font-semibold text-forest-900">
                    {v.pay.statusLabel}: {statusLabel(bookingStatus || "PAYMENT_VERIFICATION_PENDING")}
                  </p>
                  {meetUrl && (
                    <p className="mt-2">
                      {v.pay.meeting}:{" "}
                      <a className="font-semibold text-emerald-800 underline" href={meetUrl} target="_blank" rel="noopener noreferrer">
                        {v.pay.join}
                      </a>
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/20 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold"
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                    <a
                      href={`tel:${SITE.phoneHref}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/20 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold"
                    >
                      <Phone className="h-3.5 w-3.5" /> {SITE.phoneDisplay}
                    </a>
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard?.writeText(created.reference);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/20 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? v.pay.copied : v.pay.copy}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex items-center justify-end pt-1">
            <button
              type="button"
              onClick={resetAll}
              className="text-[13px] font-semibold text-saffron-700 hover:text-forest-950"
            >
              {v.nav.startAnother}
            </button>
          </div>
        </div>
      )}

      {step < 5 && (
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-forest-900/8 pt-4">
          <button
            type="button"
            onClick={() => go(Math.max(0, step - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/15 px-4 py-2.5 text-[13px] font-semibold text-forest-800 hover:bg-forest-50 disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> {v.nav.back}
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={next}
              className="btn-shine inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-5 py-2.5 text-[13.5px] font-semibold text-cream-50 hover:bg-forest-900"
            >
              {v.nav.continue} <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={createReservation}
              disabled={submitting}
              className="btn-shine inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-5 py-2.5 text-[13.5px] font-semibold text-cream-50 hover:bg-forest-900 disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CalendarCheck className="h-4 w-4 text-saffron-400" />
              )}{" "}
              {v.nav.reserve}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
