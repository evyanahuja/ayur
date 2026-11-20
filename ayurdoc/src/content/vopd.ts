/* VOPD configuration and pure domain types shared by server and client.
   No secrets here. Base prices/durations come from PLANS (site.ts), and custom
   plans created by the administrator merge seamlessly into the Consultation Plan list. */

export const VOPD_TIME_ZONE = "Asia/Kolkata";

export type ConsultationMode = "vopd" | "opd";
export type PatientKind = "child" | "adult";

export const BOOKING_STATUSES = [
  "SLOT_RESERVED",
  "PAYMENT_PENDING",
  "PAYMENT_VERIFICATION_PENDING",
  "PAYMENT_VERIFIED",
  "CONFIRMED",
  "REJECTED",
  "CANCELLED",
  "COMPLETED",
  "EXPIRED",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

/** Status changes allowed by the server. CONFIRMED is reachable only after PAYMENT_VERIFIED. */
export const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  SLOT_RESERVED: ["PAYMENT_PENDING", "PAYMENT_VERIFICATION_PENDING", "EXPIRED", "CANCELLED"],
  PAYMENT_PENDING: ["PAYMENT_VERIFICATION_PENDING", "EXPIRED", "CANCELLED"],
  PAYMENT_VERIFICATION_PENDING: ["PAYMENT_VERIFIED", "REJECTED", "CANCELLED", "EXPIRED"],
  PAYMENT_VERIFIED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  REJECTED: [],
  CANCELLED: [],
  COMPLETED: [],
  EXPIRED: [],
};

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export const PAYMENT_STATUSES = [
  "PENDING",
  "SUBMITTED",
  "VERIFIED",
  "REJECTED",
  "NOT_REQUIRED",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const BUILTIN_PLAN_IDS = ["first", "followup", "suvarna", "unsure"] as const;
export type BuiltinPlanId = (typeof BUILTIN_PLAN_IDS)[number];
/** PlanId supports both built-in clinic plans and custom admin-added consultation plans. */
export type PlanId = BuiltinPlanId | (string & {});

export type VopdPlan = {
  id: PlanId;
  name: string;
  subtitle?: string;
  period?: string;
  /** Human-readable INR price label. */
  priceLabel: string;
  strikeLabel?: string;
  /** Human-readable USD reference label for international visitors. */
  usdPrice?: string;
  usdStrike?: string;
  /** Minor units (paise for INR). Null for enquiry-only plans. */
  amountMinor: number | null;
  amountMinorUsd?: number | null;
  currency: "INR" | "USD";
  /** Calendar time reserved for the appointment (in minutes). */
  bookingMinutes: number;
  followUpCount: number;
  followUpMinutes: number;
  requiresPayment: boolean;
  description: string;
  inclusions: string[];
  showOnPricing?: boolean;
  featured?: boolean;
  isCustom?: boolean;
  active?: boolean;
  sortOrder?: number;
};

/** Machine-readable amounts derived from PLANS (single source of truth) plus
 *  VOPD booking metadata. Additional consultation plans can be added dynamically
 *  via the VOPD Admin Console (/admin/vopd) or appended here + in PLANS. */
export const VOPD_PLAN_META: Record<BuiltinPlanId, {
  bookingMinutes: number;
  followUpCount: number;
  followUpMinutes: number;
  requiresPayment: boolean;
  amountMinorINR: number | null;
  amountMinorUSD: number | null;
  sortOrder: number;
}> = {
  first: { bookingMinutes: 30, followUpCount: 0, followUpMinutes: 0, requiresPayment: true, amountMinorINR: 40000, amountMinorUSD: 7500, sortOrder: 10 },
  followup: { bookingMinutes: 20, followUpCount: 0, followUpMinutes: 0, requiresPayment: true, amountMinorINR: 30000, amountMinorUSD: 5000, sortOrder: 20 },
  suvarna: { bookingMinutes: 30, followUpCount: 0, followUpMinutes: 0, requiresPayment: false, amountMinorINR: null, amountMinorUSD: null, sortOrder: 90 },
  unsure: { bookingMinutes: 30, followUpCount: 0, followUpMinutes: 0, requiresPayment: false, amountMinorINR: null, amountMinorUSD: null, sortOrder: 100 },
};

export type VopdConfig = {
  slotIntervalMinutes: number;
  bufferMinutes: number;
  reservationHoldMinutes: number;
  advanceBookingDays: number;
  contactPhone: string;
  whatsappNumber: string;
  upi: {
    configured: boolean;
    beneficiaryName: string;
    upiId: string;
    /** Optional static QR override. Empty string means "generate the QR server-side". */
    qrImagePath: string;
    /** True only when VOPD_UPI_DEMO=true (sandbox testing). Never enable in production. */
    demo: boolean;
    instructions: string[];
  };
  google: { configured: boolean };
  /** Public instructions for arranging a manual USD transfer; never a card/UPI conversion. */
  usdPaymentInstructions: string;
};

export const VOPD_DEFAULTS = {
  slotIntervalMinutes: 30,
  bufferMinutes: 0,
  reservationHoldMinutes: 15,
  advanceBookingDays: 30,
  sessionStart: "10:00",
  sessionEnd: "14:00",
  eveningStart: "17:00",
  eveningEnd: "20:00",
  minSameDayLeadMinutes: 30,
} as const;

export const PATIENT_KIND_LABEL: Record<PatientKind, string> = {
  child: "Child",
  adult: "Adult",
};

/** Stable VOPD category IDs. The first ten reuse the existing health-concern
 *  categories; the last three cover treatments and general enquiries. */
export const VOPD_CONCERN_IDS = [
  "childrens-health",
  "skin-hair-conditions",
  "digestive-disorders",
  "respiratory-conditions",
  "neurological-conditions",
  "joint-bone-disorders",
  "womens-health",
  "mens-health",
  "metabolic-lifestyle-disorders",
  "senior-citizen-health",
  "panchakarma",
  "general",
  "other",
] as const;

export type VopdConcernId = (typeof VOPD_CONCERN_IDS)[number];

export const VOPD_CONCERN_LABELS: Record<VopdConcernId, string> = {
  "childrens-health": "Children's Health",
  "skin-hair-conditions": "Skin & Hair",
  "digestive-disorders": "Digestive Health",
  "respiratory-conditions": "Respiratory Health",
  "neurological-conditions": "Neurological & Mental Wellness",
  "joint-bone-disorders": "Joint & Bone Health",
  "womens-health": "Women's Health",
  "mens-health": "Men's Health",
  "metabolic-lifestyle-disorders": "Metabolic & Lifestyle Disorders",
  "senior-citizen-health": "Senior Citizen Health",
  panchakarma: "Panchakarma",
  general: "General Consultation",
  other: "Other",
};

export function isVopdConcernId(value: unknown): value is VopdConcernId {
  return typeof value === "string" && (VOPD_CONCERN_IDS as readonly string[]).includes(value);
}

/** One shared eligibility policy for browser, OPD enquiry, and VOPD API.
 *  Neutral skin, digestive, respiratory and neurological concerns suit children
 *  and adults; senior/joint/metabolic/Panchakarma are adult-only in this list. */
const CHILD_CATEGORIES: ReadonlySet<VopdConcernId> = new Set([
  "childrens-health", "skin-hair-conditions", "digestive-disorders",
  "respiratory-conditions", "neurological-conditions", "general", "other",
]);

export function allowedConcerns(patientKind: PatientKind, gender?: string): VopdConcernId[] {
  return VOPD_CONCERN_IDS.filter((category) => {
    if (patientKind === "child") return CHILD_CATEGORIES.has(category);
    if (category === "childrens-health") return false;
    if (category === "womens-health") return gender === "Female";
    if (category === "mens-health") return gender === "Male";
    return true;
  });
}

export function isAllowedConcern(category: unknown, patientKind: PatientKind, gender?: string): category is VopdConcernId {
  return isVopdConcernId(category) && allowedConcerns(patientKind, gender).includes(category);
}

export function formatMinor(amountMinor: number, currency: "INR" | "USD"): string {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amountMinor % 100 === 0 ? 0 : 2,
  }).format(amountMinor / 100);
}

/** Site-wide display date: DD-MM-YYYY (e.g. 20-11-2026). Internal/SEO values stay ISO. */
export function formatIsoDateToDDMMYYYY(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

/** Format an ISO instant into the clinic's wall-clock time (Asia/Kolkata).
 *  Date part is always DD-MM-YYYY (e.g. "Fri, 20-11-2026, 10:30 AM"). */
export function formatClinicDateTime(iso: string): string {
  const dt = new Date(iso);
  try {
    const parts = new Intl.DateTimeFormat("en-IN", {
      timeZone: VOPD_TIME_ZONE,
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).formatToParts(dt);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return `${get("weekday")}, ${get("day")}-${get("month")}-${get("year")}, ${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()}`;
  } catch {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: VOPD_TIME_ZONE,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(dt);
  }
}

/** Current date (YYYY-MM-DD) in Asia/Kolkata timezone, safe in browser and Node. */
export function clinicTodayIso(now = new Date()): string {
  const shifted = new Date(now.getTime() + 330 * 60_000);
  return shifted.toISOString().slice(0, 10);
}

/** Validate a YYYY-MM-DD date of birth: real calendar date, >= 1905-01-01 and <= today (IST). */
export function isValidDobString(value: string, todayIso = clinicTodayIso()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return false;
  if (value < "1905-01-01" || value > todayIso) return false;
  return true;
}

/** Compute concise clinical age summary from a YYYY-MM-DD date of birth. */
export function computeAgeFromDob(dob: string, todayIso = clinicTodayIso()): { years: number; months: number; short: string } | null {
  if (!isValidDobString(dob, todayIso)) return null;
  const [by, bm, bd] = dob.split("-").map(Number);
  const [ty, tm, td] = todayIso.split("-").map(Number);
  let totalMonths = (ty - by) * 12 + (tm - bm);
  if (td < bd) totalMonths -= 1;
  if (totalMonths < 0) totalMonths = 0;
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) {
    return { years, months, short: months <= 1 ? `${Math.max(0, months)} mo` : `${months} mos` };
  }
  if (years < 5 && months > 0) {
    return { years, months, short: `${years} yr ${months} mo` };
  }
  return { years, months, short: years === 1 ? "1 yr" : `${years} yrs` };
}

/** Format a YYYY-MM-DD DOB as DD-MM-YYYY (e.g. "14-05-2020"). Locale-independent digits. */
export function formatDobDisplay(dob: string, _locale = "en"): string {
  return formatIsoDateToDDMMYYYY(dob);
}

/** Booking reference shown to the patient and used in the admin screen. */
export function isBookingReference(value: string): boolean {
  return /^VOPD-[A-Z0-9]{6,12}$/.test(value);
}
