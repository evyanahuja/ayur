/* VOPD configuration and pure domain types shared by server and client.
   No secrets here. Prices/durations come from the existing PLANS configuration
   (site.ts) plus the VOPD metadata added alongside it. */

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

export type PlanId = "first" | "wellness" | "followup" | "suvarna" | "unsure";

export type VopdPlan = {
  id: PlanId;
  name: string;
  /** Human-readable price label straight from PLANS. */
  priceLabel: string;
  /** Minor units (paise for INR, cents for USD). Null for enquiry-only plans. */
  amountMinor: number | null;
  currency: "INR" | "USD";
  /** Calendar time reserved for the first appointment of this plan. */
  bookingMinutes: number;
  followUpCount: number;
  followUpMinutes: number;
  requiresPayment: boolean;
  description: string;
  inclusions: string[];
};

/** Machine-readable amounts derived from PLANS (single source of truth) plus
 *  VOPD booking metadata. Edit the display price in PLANS and the deposit amount
 *  here together; the server never trusts a client-supplied amount. */
export const VOPD_PLAN_META: Record<PlanId, {
  bookingMinutes: number;
  followUpCount: number;
  followUpMinutes: number;
  requiresPayment: boolean;
  amountMinorINR: number | null;
  amountMinorUSD: number | null;
}> = {
  first: { bookingMinutes: 45, followUpCount: 0, followUpMinutes: 0, requiresPayment: true, amountMinorINR: 40000, amountMinorUSD: 7500 },
  wellness: { bookingMinutes: 45, followUpCount: 6, followUpMinutes: 20, requiresPayment: true, amountMinorINR: 499900, amountMinorUSD: 30000 },
  followup: { bookingMinutes: 20, followUpCount: 0, followUpMinutes: 0, requiresPayment: true, amountMinorINR: 30000, amountMinorUSD: 5000 },
  suvarna: { bookingMinutes: 30, followUpCount: 0, followUpMinutes: 0, requiresPayment: false, amountMinorINR: null, amountMinorUSD: null },
  unsure: { bookingMinutes: 30, followUpCount: 0, followUpMinutes: 0, requiresPayment: false, amountMinorINR: null, amountMinorUSD: null },
};

export type VopdConfig = {
  slotIntervalMinutes: number;
  bufferMinutes: number;
  reservationHoldMinutes: number;
  advanceBookingDays: number;
  contactPhone: string;
  whatsappNumber: string;
  upi: { configured: boolean; beneficiaryName: string; upiId: string; qrImagePath: string; instructions: string[] };
  google: { configured: boolean };
};

export const VOPD_DEFAULTS = {
  slotIntervalMinutes: 30,
  bufferMinutes: 10,
  reservationHoldMinutes: 15,
  advanceBookingDays: 30,
  sessionStart: "10:00",
  sessionEnd: "14:00",
  eveningStart: "17:00",
  eveningEnd: "20:00",
  minSameDayLeadMinutes: 60,
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

export function formatMinor(amountMinor: number, currency: "INR" | "USD"): string {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amountMinor % 100 === 0 ? 0 : 2,
  }).format(amountMinor / 100);
}

/** Format an ISO instant into the clinic's wall-clock time (Asia/Kolkata). */
export function formatClinicDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: VOPD_TIME_ZONE,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

/** Booking reference shown to the patient and used in the admin screen. */
export function isBookingReference(value: string): boolean {
  return /^VOPD-[A-Z0-9]{6,12}$/.test(value);
}
