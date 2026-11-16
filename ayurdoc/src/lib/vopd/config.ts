/* Server-only VOPD settings. Never import this module from a client component.
   UPI details and Google credentials are read from environment variables so the
   repository never contains clinic secrets. */
import { asc, eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/db";
import { vopdConsultationPlans, type VopdConsultationPlanRow } from "@/db/schema";
import { PLANS } from "@/content/site";
import {
  BUILTIN_PLAN_IDS,
  formatMinor,
  VOPD_DEFAULTS,
  VOPD_PLAN_META,
  type VopdConfig,
  type VopdPlan,
} from "@/content/vopd";

export const TIME_ZONE = "Asia/Kolkata";
export const SLOT_INTERVAL_MINUTES = Number(process.env.VOPD_SLOT_INTERVAL_MINUTES || VOPD_DEFAULTS.slotIntervalMinutes);
export const BUFFER_MINUTES = Number(process.env.VOPD_BUFFER_MINUTES ?? VOPD_DEFAULTS.bufferMinutes);
export const HOLD_MINUTES = Number(process.env.VOPD_HOLD_MINUTES ?? VOPD_DEFAULTS.reservationHoldMinutes);
export const ADVANCE_DAYS = Number(process.env.VOPD_ADVANCE_DAYS ?? VOPD_DEFAULTS.advanceBookingDays);
export const SESSIONS = [
  { start: VOPD_DEFAULTS.sessionStart, end: VOPD_DEFAULTS.sessionEnd },
  { start: VOPD_DEFAULTS.eveningStart, end: VOPD_DEFAULTS.eveningEnd },
];
export const MIN_LEAD_MINUTES = Number(process.env.VOPD_MIN_LEAD_MINUTES ?? VOPD_DEFAULTS.minSameDayLeadMinutes);

export const CLINIC_PHONE = process.env.CLINIC_PHONE || "+91 98607 75010";
export const CLINIC_WHATSAPP = process.env.CLINIC_WHATSAPP || "919860775010";
export const CLINIC_EMAIL = process.env.DOCTOR_EMAIL || process.env.NOTIFY_EMAIL || "drpriyankalikhar@gmail.com";

const planById = new Map(PLANS.map((plan) => [plan.id, plan]));

/* Options that exist in the site's plan labels but have no standalone online fee. */
const ENQUIRY_ONLY = [
  {
    id: "suvarna" as const,
    name: "Suvarnaprashan Guidance",
    description: "Monthly Pushya Nakshatra Suvarnaprashan assessment; fee confirmed by clinic.",
  },
  {
    id: "unsure" as const,
    name: "Need Guidance Choosing a Plan",
    description: "Speak with the clinic first to confirm the right plan before paying.",
  },
];

export function rowToVopdPlan(row: VopdConsultationPlanRow): VopdPlan {
  let inclusions: string[] = [];
  try {
    const parsed = JSON.parse(row.featuresJson || "[]");
    if (Array.isArray(parsed)) inclusions = parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  } catch {
    inclusions = [];
  }
  const hasFee = row.requiresPayment && row.amountMinorInr != null && row.amountMinorInr > 0;
  return {
    id: row.slug,
    name: row.name,
    subtitle: row.subtitle ?? undefined,
    period: row.period || `${row.durationMinutes} mins consultation`,
    priceLabel: hasFee && row.amountMinorInr != null ? formatMinor(row.amountMinorInr, "INR") : "Fee on confirmation",
    strikeLabel: row.strikeMinorInr != null && row.strikeMinorInr > 0 ? formatMinor(row.strikeMinorInr, "INR") : undefined,
    usdPrice: row.amountMinorUsd != null && row.amountMinorUsd > 0 ? formatMinor(row.amountMinorUsd, "USD") : undefined,
    usdStrike: row.strikeMinorUsd != null && row.strikeMinorUsd > 0 ? formatMinor(row.strikeMinorUsd, "USD") : undefined,
    amountMinor: hasFee ? row.amountMinorInr : null,
    amountMinorUsd: row.amountMinorUsd ?? null,
    currency: "INR",
    bookingMinutes: row.durationMinutes,
    followUpCount: row.followUpCount,
    followUpMinutes: row.followUpMinutes,
    requiresPayment: hasFee,
    description: row.description,
    inclusions,
    showOnPricing: row.showOnPricing,
    featured: row.featured,
    isCustom: true,
    active: row.active,
    sortOrder: row.sortOrder,
  };
}

/** Built-in consultation plans (synchronous fallback & baseline). */
export function getVopdPlans(): VopdPlan[] {
  const paid: VopdPlan[] = BUILTIN_PLAN_IDS.flatMap((id) => {
    const plan = planById.get(id);
    const meta = VOPD_PLAN_META[id];
    if (!plan) return [];
    return [{
      id,
      name: plan.name,
      subtitle: plan.hindi,
      period: plan.period,
      priceLabel: plan.price,
      strikeLabel: plan.strike,
      usdPrice: plan.usdPrice,
      usdStrike: plan.usdStrike,
      amountMinor: meta.requiresPayment ? meta.amountMinorINR : null,
      amountMinorUsd: meta.amountMinorUSD,
      currency: "INR" as const,
      bookingMinutes: meta.bookingMinutes,
      followUpCount: meta.followUpCount,
      followUpMinutes: meta.followUpMinutes,
      requiresPayment: meta.requiresPayment,
      description: plan.desc,
      inclusions: plan.features,
      showOnPricing: true,
      featured: plan.featured,
      isCustom: false,
      active: true,
      sortOrder: meta.sortOrder,
    }];
  });

  const extras: VopdPlan[] = ENQUIRY_ONLY.map((extra) => ({
    id: extra.id,
    name: extra.name,
    period: `${VOPD_PLAN_META[extra.id].bookingMinutes} mins`,
    priceLabel: "Fee on confirmation",
    amountMinor: null,
    amountMinorUsd: null,
    currency: "INR" as const,
    bookingMinutes: VOPD_PLAN_META[extra.id].bookingMinutes,
    followUpCount: 0,
    followUpMinutes: 0,
    requiresPayment: false,
    description: extra.description,
    inclusions: [],
    showOnPricing: false,
    featured: false,
    isCustom: false,
    active: true,
    sortOrder: VOPD_PLAN_META[extra.id].sortOrder,
  }));

  return [...paid, ...extras].sort((a, b) => (a.sortOrder ?? 50) - (b.sortOrder ?? 50));
}

/** Built-in + active custom consultation plans stored in PostgreSQL. */
export async function getAllActiveVopdPlans(): Promise<VopdPlan[]> {
  const builtin = getVopdPlans();
  if (!isDatabaseConfigured()) return builtin;
  try {
    const rows = await db
      .select()
      .from(vopdConsultationPlans)
      .where(eq(vopdConsultationPlans.active, true))
      .orderBy(asc(vopdConsultationPlans.sortOrder), asc(vopdConsultationPlans.id));
    if (!rows.length) return builtin;
    const custom = rows.map(rowToVopdPlan);
    const builtinIds = new Set(builtin.map((p) => p.id));
    const merged = [...builtin, ...custom.filter((p) => !builtinIds.has(p.id))];
    return merged.sort((a, b) => (a.sortOrder ?? 50) - (b.sortOrder ?? 50));
  } catch {
    return builtin;
  }
}

export function getVopdPlan(id: string): VopdPlan | undefined {
  return getVopdPlans().find((plan) => plan.id === id);
}

export async function getResolvedVopdPlan(id: string): Promise<VopdPlan | undefined> {
  const builtin = getVopdPlan(id);
  if (builtin) return builtin;
  if (!isDatabaseConfigured() || !id) return undefined;
  try {
    const [row] = await db
      .select()
      .from(vopdConsultationPlans)
      .where(eq(vopdConsultationPlans.slug, id))
      .limit(1);
    if (!row || !row.active) return undefined;
    return rowToVopdPlan(row);
  } catch {
    return undefined;
  }
}

export function isUpiConfigured(): boolean {
  return Boolean(process.env.VOPD_UPI_ID?.trim() && process.env.VOPD_UPI_NAME?.trim());
}

export function isGoogleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_OAUTH_CLIENT_ID?.trim() &&
      process.env.GOOGLE_OAUTH_CLIENT_SECRET?.trim() &&
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN?.trim()
  );
}

export function publicVopdConfig(): VopdConfig {
  return {
    slotIntervalMinutes: SLOT_INTERVAL_MINUTES,
    bufferMinutes: BUFFER_MINUTES,
    reservationHoldMinutes: HOLD_MINUTES,
    advanceBookingDays: ADVANCE_DAYS,
    contactPhone: CLINIC_PHONE,
    whatsappNumber: CLINIC_WHATSAPP,
    upi: {
      configured: isUpiConfigured(),
      beneficiaryName: process.env.VOPD_UPI_NAME?.trim() || "",
      upiId: process.env.VOPD_UPI_ID?.trim() || "",
      qrImagePath: process.env.VOPD_UPI_QR_PATH?.trim() || "",
      demo: process.env.VOPD_UPI_DEMO?.trim() === "true",
      instructions: [
        "Scan the QR code with Google Pay, PhonePe, Paytm or any UPI app.",
        "Pay the exact consultation fee shown in your booking summary.",
        "Enter the UPI transaction reference (UTR) after paying.",
        "Your appointment is confirmed after the clinic verifies payment.",
      ],
    },
    google: { configured: isGoogleConfigured() },
  };
}

export function adminConfigured(): boolean {
  return Boolean(process.env.VOPD_ADMIN_PASSWORD && process.env.VOPD_ADMIN_SESSION_SECRET && process.env.VOPD_ADMIN_SESSION_SECRET.length >= 32);
}
