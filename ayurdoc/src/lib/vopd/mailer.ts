/* VOPD emails. Reuses the shared Resend/SMTP transport from src/lib/email.ts. */
import { sendSystemEmail } from "@/lib/email";
import { formatClinicDateTime, VOPD_CONCERN_LABELS, type VopdConcernId } from "@/content/vopd";
import type { VopdBooking } from "@/db/schema";
import { CLINIC_EMAIL, CLINIC_PHONE } from "./config";
import { vopdDict } from "@/i18n/vopd";

const BRAND = "#0e2b21";
const GOLD = "#f4bc4f";
const CREAM = "#fffdf8";

function esc(value: string | null | undefined): string {
  return (value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function shell(title: string, subtitle: string, rows: [string, string][], note: string, cta?: { label: string; url: string }): string {
  return `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:${CREAM};border:1px solid #e7e0cf;border-radius:16px;overflow:hidden">
  <div style="background:${BRAND};color:#fdf0d3;padding:22px 26px">
    <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD}">${esc(subtitle)}</p>
    <h2 style="margin:8px 0 0;font-size:21px">${esc(title)}</h2>
  </div>
  <div style="padding:22px 26px;color:#1a2b23;font-size:14px;line-height:1.6">
    <table style="width:100%;border-collapse:collapse">${rows
      .map(([k, v]) => `<tr><td style="padding:6px 0;color:#6b7d73;width:150px">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`)
      .join("")}</table>
    ${cta ? `<p style="margin:20px 0 0"><a href="${esc(cta.url)}" style="background:${BRAND};color:#fdf0d3;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold">${esc(cta.label)}</a></p>` : ""}
    <p style="margin:18px 0 0">${esc(note)}</p>
    <p style="margin:16px 0 0;font-size:12px;color:#6b7d73">Dr. Priyanka Likhar · BalChikitsa Ayurved Clinic · ${esc(CLINIC_PHONE)}</p>
  </div></div>`;
}

function concernLabel(id: string): string {
  return VOPD_CONCERN_LABELS[id as VopdConcernId] ?? id;
}

function feeLabel(booking: VopdBooking): string {
  if (booking.amountMinor == null) return "Enquiry only — fee confirmed by the clinic";
  return `₹${(booking.amountMinor / 100).toLocaleString("en-IN")}`;
}

function mailLocale(booking: VopdBooking) {
  return (booking as VopdBooking & { locale?: string }).locale ?? "en";
}

function baseRows(booking: VopdBooking): [string, string][] {
  const d = vopdDict(mailLocale(booking));
  const kind = booking.patientKind === "child" ? d.patient.child : d.patient.adult;
  return [
    [d.pay.reference, booking.reference],
    [d.review.patient, `${booking.patientName} (${kind})`],
    ...(booking.guardianName ? [[d.review.guardian, booking.guardianName] as [string, string]] : []),
    [d.review.plan, `${booking.planName} · ${booking.durationMinutes} ${d.review.minutes}`],
    [d.review.when, `${formatClinicDateTime(booking.slotStart.toISOString())} (IST)`],
    [d.review.category, concernLabel(booking.concernCategory)],
    [d.review.fee, feeLabel(booking)],
  ];
}

export async function sendAcknowledgement(booking: VopdBooking) {
  if (!booking.email) return { sent: false as const, reason: "no_patient_email" };
  const d = vopdDict(mailLocale(booking));
  const result = await sendSystemEmail({
    to: booking.email,
    replyTo: CLINIC_EMAIL,
    subject: `${d.emails.ackTitle} — ${booking.reference}`,
    html: shell(d.emails.ackTitle, d.emails.ackBadge, baseRows(booking), d.emails.ackNote),
    text: [d.emails.ackTitle, ...baseRows(booking).map(([key, value]) => `${key}: ${value}`), d.emails.ackNote].join("\n"),
  });
  return result;
}

export async function sendAdminNewBooking(booking: VopdBooking) {
  return sendSystemEmail({
    to: CLINIC_EMAIL,
    replyTo: booking.email || undefined,
    subject: `New VOPD booking — ${booking.reference} — ${booking.planName}`,
    html: shell(
      "New VOPD booking received",
      booking.paymentStatus === "NOT_REQUIRED" ? "No-fee enquiry" : "Payment not yet verified",
      [...baseRows(booking), ["Phone", booking.phone], ["UTR", booking.upiReference || "Not submitted"], ["Status", `${booking.status} / ${booking.paymentStatus}`]],
      "Open the VOPD admin console to review the booking and verify payment only after it appears in the clinic account."
    ),
    text: `New VOPD booking ${booking.reference} for ${booking.patientName}. Review it in the admin console.`,
  });
}

export async function sendPaymentSubmitted(booking: VopdBooking) {
  return sendSystemEmail({
    to: CLINIC_EMAIL,
    replyTo: booking.email || undefined,
    subject: `VOPD payment submitted — ${booking.reference} — verify in bank/UPI`,
    html: shell(
      "Payment reference submitted",
      "Manual verification required",
      [...baseRows(booking), ["Payer name", booking.payerName || "—"], ["UTR", booking.upiReference || "—"], ["Status", `${booking.status} / ${booking.paymentStatus}`]],
      "This is NOT a verification. Check the clinic bank/UPI account, then verify in the admin console."
    ),
    text: `Payment submitted for ${booking.reference}. UTR ${booking.upiReference}. Verify in the clinic account before confirming.`,
  });
}

export async function sendConfirmation(booking: VopdBooking) {
  if (!booking.email) return { sent: false as const, reason: "no_patient_email" };
  const meet = booking.meetUrl;
  const d = vopdDict(mailLocale(booking));
  const result = await sendSystemEmail({
    to: booking.email,
    replyTo: CLINIC_EMAIL,
    subject: `${d.emails.confirmTitle} — ${booking.reference}`,
    html: shell(
      d.emails.confirmTitle,
      d.emails.confirmBadge,
      [
        ...baseRows(booking),
        [d.review.reserved, `${booking.durationMinutes} ${d.review.minutes}`],
        ...(booking.followUpCount
          ? [[d.review.plan, `${booking.followUpCount} × ${booking.followUpMinutes} ${d.review.minutes}`] as [string, string]]
          : []),
      ],
      meet ? d.emails.confirmNote : d.emails.confirmNoMeet,
      meet ? { label: d.emails.meetCta, url: meet } : undefined
    ),
    text: [d.emails.confirmTitle, ...baseRows(booking).map(([key, value]) => `${key}: ${value}`), meet ? `${d.pay.meeting}: ${meet}` : d.emails.confirmNoMeet].join("\n"),
  });
  return result;
}

export async function sendMeetLink(booking: VopdBooking) {
  if (!booking.email || !booking.meetUrl) return { sent: false as const, reason: "missing_email_or_link" };
  const d = vopdDict(mailLocale(booking));
  return sendSystemEmail({
    to: booking.email,
    replyTo: CLINIC_EMAIL,
    subject: `${d.emails.meetSubject} — ${booking.reference}`,
    html: shell(d.emails.meetSubject, d.emails.confirmBadge, baseRows(booking), d.emails.meetNote, { label: d.emails.meetCta, url: booking.meetUrl }),
    text: `${d.emails.meetSubject} (${booking.reference}): ${booking.meetUrl}`,
  });
}
