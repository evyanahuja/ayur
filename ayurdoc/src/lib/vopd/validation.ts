/* Server-side validation for VOPD. The browser is never trusted for money,
   plan duration or slot validity. */
import { getVopdPlan } from "./config";
import { clinicWallTimeToUtc, isDateString, isFutureSlot } from "./slots";
import { isVopdConcernId, type PatientKind } from "@/content/vopd";

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
  slotStartIso: string;
  consent: boolean;
  website?: string;
};

const PHONE = /^[+\d][\d\s\-()]{6,18}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: Record<string, string> };

function trim(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function validateBooking(raw: unknown): ValidationResult<BookingInput & {
  start: Date;
  durationMinutes: number;
  plan: NonNullable<ReturnType<typeof getVopdPlan>>;
}> {
  const body = (raw ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const patientKind = body.patientKind === "adult" || body.patientKind === "child" ? body.patientKind : null;
  if (!patientKind) errors.patientKind = "Choose who the consultation is for.";

  const patientName = trim(body.patientName, 120);
  if (patientName.length < 2) errors.patientName = "Enter the patient's full name.";

  const guardianName = trim(body.guardianName, 120);
  if (patientKind === "child" && guardianName.length < 2) errors.guardianName = "Enter the parent or guardian's full name.";

  const ageOrDob = trim(body.ageOrDob, 40);
  if (!ageOrDob) errors.ageOrDob = "Enter the patient's date of birth or age.";

  const phone = trim(body.phone, 20);
  if (!PHONE.test(phone)) errors.phone = "Enter a valid mobile number.";

  const email = trim(body.email, 160);
  if (email && !EMAIL.test(email)) errors.email = "Enter a valid email address.";

  const concernCategory = trim(body.concernCategory, 40);
  if (!isVopdConcernId(concernCategory)) errors.concernCategory = "Choose a consultation category.";

  const symptoms = trim(body.symptoms, 2000);
  if (symptoms.length < 10) errors.symptoms = "Please describe the main symptoms (at least 10 characters).";

  const plan = typeof body.planId === "string" ? getVopdPlan(body.planId) : undefined;
  if (!plan) errors.planId = "Choose a consultation plan.";

  const slotStartIso = trim(body.slotStartIso, 40);
  const start = slotStartIso ? new Date(slotStartIso) : null;
  if (!start || Number.isNaN(start.getTime())) errors.slotStartIso = "Choose a consultation date and time.";
  else if (!isFutureSlot(start)) errors.slotStartIso = "That time has passed. Please choose a later slot.";

  if (body.consent !== true) errors.consent = "Please accept the consent statement.";

  const gender = trim(body.gender, 20);
  if (gender && !["Female", "Male", "Other", "Girl", "Boy"].includes(gender)) errors.gender = "Choose a valid gender option.";

  if (Object.keys(errors).length || !patientKind || !plan || !start) return { ok: false, errors };

  return {
    ok: true,
    value: {
      patientKind,
      patientName,
      guardianName: patientKind === "child" ? guardianName : undefined,
      ageOrDob,
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
      slotStartIso,
      consent: true,
      website: trim(body.website, 100) || undefined,
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
  // UPI UTRs are typically 12 digits, but banks/apps vary; accept 6–40 safe characters.
  if (!/^[A-Za-z0-9-]{6,40}$/.test(upiReference)) errors.upiReference = "Enter the UPI transaction reference (UTR) from your payment app.";
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { payerName, upiReference } };
}

export function normalizeSlotKey(slotStartIso: string): { date: string; start: Date } | null {
  const start = new Date(slotStartIso);
  if (Number.isNaN(start.getTime())) return null;
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(start);
  return isDateString(date) ? { date, start } : null;
}
