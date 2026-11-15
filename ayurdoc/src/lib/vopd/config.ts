/* Server-only VOPD settings. Never import this module from a client component.
   UPI details and Google credentials are read from environment variables so the
   repository never contains clinic secrets. */
import { PLANS } from "@/content/site";
import {
  type PlanId,
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

/* Options that exist in the site's plan labels but have no standalone price.
   They remain enquiry-only: no amount is accepted or invented. */
const ENQUIRY_ONLY = [
  { id: "suvarna" as const, name: "Suvarnaprashan Only", description: "Standalone Suvarnaprashan enquiries are confirmed by the clinic; no online fee is collected." },
  { id: "unsure" as const, name: "Not sure — need guidance", description: "The clinic will help choose the right consultation and confirm any fee before payment." },
];

/** Plans exposed in VOPD, with server-authoritative amounts and durations. */
export function getVopdPlans(): VopdPlan[] {
  return (Object.keys(VOPD_PLAN_META) as PlanId[]).flatMap((id) => {
    const plan = planById.get(id);
    const meta = VOPD_PLAN_META[id];
    if (!plan) return [];
    return [{
      id,
      name: plan.name,
      priceLabel: plan.price,
      amountMinor: meta.requiresPayment ? meta.amountMinorINR : null,
      currency: "INR" as const,
      bookingMinutes: meta.bookingMinutes,
      followUpCount: meta.followUpCount,
      followUpMinutes: meta.followUpMinutes,
      requiresPayment: meta.requiresPayment,
      description: plan.desc,
      inclusions: plan.features,
    }];
  }).concat(
    ENQUIRY_ONLY.map((extra) => ({
      id: extra.id,
      name: extra.name,
      priceLabel: "Fee confirmed by clinic",
      amountMinor: null,
      currency: "INR" as const,
      bookingMinutes: VOPD_PLAN_META[extra.id].bookingMinutes,
      followUpCount: 0,
      followUpMinutes: 0,
      requiresPayment: false,
      description: extra.description,
      inclusions: [],
    }))
  );
}

export function getVopdPlan(id: string): VopdPlan | undefined {
  return getVopdPlans().find((plan) => plan.id === id);
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
      qrImagePath: process.env.VOPD_UPI_QR_PATH?.trim() || "/images/upi-qr.png",
      instructions: [
        "Scan the QR code with Google Pay, PhonePe, Paytm or any UPI app.",
        "Pay the exact consultation fee shown in your booking summary.",
        "Enter the UPI transaction reference (UTR) after paying.",
        "Your appointment is confirmed only after the clinic verifies the payment.",
      ],
    },
    google: { configured: isGoogleConfigured() },
  };
}

export function adminConfigured(): boolean {
  return Boolean(process.env.VOPD_ADMIN_PASSWORD && process.env.VOPD_ADMIN_SESSION_SECRET && process.env.VOPD_ADMIN_SESSION_SECRET.length >= 32);
}
