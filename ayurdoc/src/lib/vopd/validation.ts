/* Server-side validation for VOPD bookings, payments, and custom consultation plans.
   The browser is never trusted for money, plan duration or slot validity. */
import { getResolvedVopdPlan } from "./config";
import { isDateString, isFutureSlot, todayInClinic } from "./slots";
import {
  computeAgeFromDob,
  isValidDobString,
  isAllowedConcern,
  type PatientKind,
  type VopdPlan,
} from "@/content/vopd";
import { isVopdLocale, type VopdLocale } from "@/i18n/vopd";

export type BookingInput = {
  patientKind: PatientKind;
  patientName: string;
  guardianName?: string;
  ageOrDob: string;
  gender?: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  concernCategory: string;
  symptoms: string;
  duration?: string;
  previousDiagnosis?: string;
  currentTreatment?: string;
  message?: string;
  planId: string;
  currency: "INR" | "USD";
  slotStartIso: string;
  consent: boolean;
  website?: string;
  locale: VopdLocale;
};

const PHONE = /^[+\d][\d\s\-()]{6,18}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: Record<string, string> };

function trim(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function validateBooking(raw: unknown): Promise<ValidationResult<BookingInput & {
  start: Date;
  durationMinutes: number;
  plan: VopdPlan;
}>> {
  const body = (raw ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const patientKind = body.patientKind === "adult" || body.patientKind === "child" ? body.patientKind : null;
  if (!patientKind) errors.patientKind = "Choose who the consultation is for.";

  const patientName = trim(body.patientName, 120);
  if (patientName.length < 2) errors.patientName = "Enter the patient's full name.";

  const guardianName = trim(body.guardianName, 120);
  if (patientKind === "child" && guardianName.length < 2) errors.guardianName = "Enter the parent or guardian's full name.";

  const rawDob = trim(body.ageOrDob, 40);
  const today = todayInClinic();
  const isoDob = rawDob.slice(0, 10);
  let normalizedDob = "";
  if (!rawDob || !isValidDobString(isoDob, today)) {
    errors.ageOrDob = "Please select a valid date of birth.";
  } else {
    const computed = computeAgeFromDob(isoDob, today);
    normalizedDob = computed ? `${isoDob} (${computed.short})` : isoDob;
  }

  const phone = trim(body.phone, 20);
  if (!PHONE.test(phone)) errors.phone = "Enter a valid mobile number.";

  const email = trim(body.email, 160);
  if (email && !EMAIL.test(email)) errors.email = "Enter a valid email address.";

  const gender = trim(body.gender, 20);
  if (patientKind === "adult" && !["Male", "Female"].includes(gender)) errors.gender = "Choose Male or Female for an adult consultation.";
  if (patientKind === "child" && gender && !["Boy", "Girl", "Other"].includes(gender)) errors.gender = "Choose a valid gender for the child.";

  const concernCategory = trim(body.concernCategory, 40);
  if (patientKind && !isAllowedConcern(concernCategory, patientKind, gender)) {
    errors.concernCategory = "This consultation category is not available for the selected patient type and gender.";
  }

  const symptoms = trim(body.symptoms, 2000);
  if (symptoms.length < 5) errors.symptoms = "Please describe the main symptoms.";

  const plan = typeof body.planId === "string" ? await getResolvedVopdPlan(body.planId) : undefined;
  if (!plan) errors.planId = "Choose an active consultation plan.";
  const currency: "INR" | "USD" = body.currency === "USD" ? "USD" : "INR";
  if (plan?.requiresPayment && (currency === "USD" ? plan.amountMinorUsd : plan.amountMinor) == null) {
    errors.currency = `This plan does not have an active ${currency} fee configured. Please contact the clinic to book.`;
  }

  const slotStartIso = trim(body.slotStartIso, 40);
  const start = slotStartIso ? new Date(slotStartIso) : null;
  if (!start || Number.isNaN(start.getTime())) errors.slotStartIso = "Choose a consultation date and time.";
  else if (!isFutureSlot(start)) errors.slotStartIso = "That time has passed. Please choose a later slot.";

  if (body.consent !== true) errors.consent = "Please accept the consent statement.";

  if (Object.keys(errors).length || !patientKind || !plan || !start) return { ok: false, errors };

  return {
    ok: true,
    value: {
      patientKind,
      patientName,
      guardianName: patientKind === "child" ? guardianName : undefined,
      ageOrDob: normalizedDob,
      gender: gender || undefined,
      phone,
      email: email || undefined,
      city: trim(body.city, 80) || undefined,
      state: trim(body.state, 80) || undefined,
      concernCategory,
      symptoms,
      duration: trim(body.duration, 120) || undefined,
      previousDiagnosis: trim(body.previousDiagnosis, 1000) || undefined,
      currentTreatment: trim(body.currentTreatment, 1000) || undefined,
      message: trim(body.message, 1000) || undefined,
      planId: plan.id,
      currency,
      slotStartIso,
      consent: true,
      website: trim(body.website, 100) || undefined,
      locale: isVopdLocale(body.locale) ? body.locale : "en",
      start,
      durationMinutes: plan.bookingMinutes,
      plan,
    },
  };
}

export type PaymentInput = { payerName: string; upiReference: string };

export function validatePayment(raw: unknown): ValidationResult<PaymentInput> {
  const body = (raw ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};
  const payerName = trim(body.payerName, 120);
  if (payerName.length < 2) errors.payerName = "Enter the name used to make the payment.";
  const upiReference = trim(body.upiReference, 80);
  if (!/^[A-Za-z0-9-]{6,40}$/.test(upiReference)) errors.upiReference = "Enter the UPI transaction reference (UTR) from your payment app.";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { payerName, upiReference } };
}

export type CustomPlanInput = {
  slug?: string;
  name: string;
  subtitle?: string;
  period?: string;
  description: string;
  features: string[];
  amountMinorInr: number | null;
  strikeMinorInr?: number | null;
  amountMinorUsd?: number | null;
  strikeMinorUsd?: number | null;
  durationMinutes: number;
  followUpCount: number;
  followUpMinutes: number;
  requiresPayment: boolean;
  showOnPricing: boolean;
  featured: boolean;
  active: boolean;
  sortOrder: number;
};

function parsePositiveRupeesToMinor(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  const num = Number(val);
  if (!Number.isFinite(num) || num <= 0 || num > 500_000) return null;
  return Math.round(num * 100);
}

export function validateCustomPlan(raw: unknown): ValidationResult<CustomPlanInput> {
  const body = (raw ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const name = trim(body.name, 120);
  if (name.length < 3) errors.name = "Enter a plan name (at least 3 characters).";

  const description = trim(body.description, 600);
  if (description.length < 6) errors.description = "Enter a short description for patients.";

  const durationMinutes = Number(body.durationMinutes ?? 30);
  if (!Number.isFinite(durationMinutes) || durationMinutes < 10 || durationMinutes > 120) {
    errors.durationMinutes = "Duration must be between 10 and 120 minutes.";
  }

  const requiresPayment = body.requiresPayment !== false;
  const amountMinorInr = parsePositiveRupeesToMinor(body.priceInr);
  if (requiresPayment && amountMinorInr == null) {
    errors.priceInr = "Enter a valid INR fee (or switch to enquiry-only).";
  }

  const strikeMinorInr = parsePositiveRupeesToMinor(body.strikeInr);
  const amountMinorUsd = parsePositiveRupeesToMinor(body.priceUsd);
  const strikeMinorUsd = parsePositiveRupeesToMinor(body.strikeUsd);
  if (requiresPayment && amountMinorUsd == null) errors.priceUsd = "Enter an independent USD fee for this plan.";
  if (/^bal\s+wellness\s+program$/i.test(name)) errors.name = "This retired plan cannot be recreated.";

  const followUpCount = Math.max(0, Math.min(24, Math.round(Number(body.followUpCount ?? 0) || 0)));
  const followUpMinutes = followUpCount > 0
    ? Math.max(10, Math.min(60, Math.round(Number(body.followUpMinutes ?? 20) || 20)))
    : 0;

  let features: string[] = [];
  if (Array.isArray(body.features)) {
    features = body.features.map((f) => trim(f, 140)).filter(Boolean).slice(0, 8);
  } else if (typeof body.features === "string") {
    features = body.features.split(/\r?\n|,/).map((f) => f.trim().slice(0, 140)).filter(Boolean).slice(0, 8);
  }

  const subtitle = trim(body.subtitle, 120) || undefined;
  const period = trim(body.period, 80) || `${Math.round(durationMinutes)} mins consultation`;
  const sortOrder = Math.max(1, Math.min(999, Math.round(Number(body.sortOrder ?? 30) || 30)));
  const slug = trim(body.slug, 36).toLowerCase().replace(/[^a-z0-9-]/g, "") || undefined;

  if (Object.keys(errors).length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      slug,
      name,
      subtitle,
      period,
      description,
      features,
      amountMinorInr: requiresPayment ? amountMinorInr : null,
      strikeMinorInr,
      amountMinorUsd,
      strikeMinorUsd,
      durationMinutes: Math.round(durationMinutes),
      followUpCount,
      followUpMinutes,
      requiresPayment,
      showOnPricing: body.showOnPricing !== false,
      featured: body.featured === true,
      active: body.active !== false,
      sortOrder,
    },
  };
}

export function normalizeSlotKey(slotStartIso: string): { date: string; start: Date } | null {
  const start = new Date(slotStartIso);
  if (Number.isNaN(start.getTime())) return null;
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(start);
  return isDateString(date) ? { date, start } : null;
}
