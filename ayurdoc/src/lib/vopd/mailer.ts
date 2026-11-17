/* VOPD emails. Reuses the shared Resend/SMTP transport from src/lib/email.ts. */
import { sendSystemEmail } from "@/lib/email";
import { formatClinicDateTime, formatMinor, VOPD_CONCERN_LABELS, type VopdConcernId } from "@/content/vopd";
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
  // Email-client-safe layout: percentage label column, explicit word wrapping and
  // a mobile media query that stacks each row, so nothing is clipped on phones.
  const cellKey = "padding:6px 8px 6px 0;color:#6b7d73;width:34%;vertical-align:top;word-break:break-word;overflow-wrap:anywhere";
  const cellVal = "padding:6px 0;vertical-align:top;word-break:break-word;overflow-wrap:anywhere";
  return `<style>@media only screen and (max-width:480px){.bc-wrap{width:100%!important}.bc-pad{padding:18px 16px!important}.bc-hd{padding:20px 16px!important}.bc-row td{display:block!important;width:100%!important;padding:2px 0!important}.bc-row td.bc-k{padding-top:8px!important}}</style>
  <div class="bc-wrap" style="font-family:Arial,sans-serif;width:100%;max-width:600px;margin:0 auto;background:${CREAM};border:1px solid #e7e0cf;border-radius:16px;overflow:hidden">
  <div class="bc-hd" style="background:${BRAND};color:#fdf0d3;padding:22px 26px;word-break:break-word;overflow-wrap:anywhere">
    <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${GOLD}">${esc(subtitle)}</p>
    <h2 style="margin:8px 0 0;font-size:21px;line-height:1.3;word-break:break-word;overflow-wrap:anywhere">${esc(title)}</h2>
  </div>
  <div class="bc-pad" style="padding:22px 26px;color:#1a2b23;font-size:14px;line-height:1.6;word-break:break-word;overflow-wrap:anywhere">
    <table style="width:100%;max-width:100%;border-collapse:collapse;table-layout:fixed">${rows
      .map(([k, v]) => `<tr class="bc-row"><td class="bc-k" style="${cellKey}">${esc(k)}</td><td style="${cellVal}"><strong>${esc(v)}</strong></td></tr>`)
      .join("")}</table>
    ${cta ? `<p style="margin:20px 0 0"><a href="${esc(cta.url)}" style="display:inline-block;max-width:100%;background:${BRAND};color:#fdf0d3;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:bold;word-break:break-word;overflow-wrap:anywhere">${esc(cta.label)}</a></p>` : ""}
    <p style="margin:18px 0 0">${esc(note)}</p>
    <p style="margin:16px 0 0;font-size:12px;color:#6b7d73">Dr. Priyanka Likhar · BalChikitsa Ayurved Clinic · ${esc(CLINIC_PHONE)}</p>
  </div></div>`;
}

function concernLabel(id: string): string {
  return VOPD_CONCERN_LABELS[id as VopdConcernId] ?? id;
}

function feeLabel(booking: VopdBooking): string {
  if (booking.amountMinor == null) return "Enquiry only — fee confirmed by the clinic";
  return formatMinor(booking.amountMinor, booking.currency === "USD" ? "USD" : "INR");
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
    ["Gender", booking.gender || "Not provided"],
    ["Consultation", booking.mode.toUpperCase()],
    [d.review.dob, booking.ageOrDob],
    ...(booking.guardianName ? [[d.review.guardian, booking.guardianName] as [string, string]] : []),
    [d.review.plan, `${booking.planName} · ${booking.durationMinutes} ${d.review.mins}`],
    [d.review.when, `${formatClinicDateTime(booking.slotStart.toISOString())} (IST)`],
    [d.review.category, concernLabel(booking.concernCategory)],
    [d.review.fee, feeLabel(booking)],
    ["Payment method", booking.paymentMethod === "MANUAL_USD" ? "International transfer (manual)" : booking.paymentMethod],
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
    subject: `VOPD payment submitted — ${booking.reference} — verify in clinic account`,
    html: shell(
      "Payment reference submitted",
      "Manual verification required",
      [...baseRows(booking), ["Payer name", booking.payerName || "—"], ["Transaction reference", booking.upiReference || "—"], ["Status", `${booking.status} / ${booking.paymentStatus}`]],
      "This is NOT a verification. Check the clinic bank/UPI account, then verify in the admin console."
    ),
    text: `Payment submitted for ${booking.reference}: ${booking.patientName}, ${booking.planName}, ${booking.concernCategory}, ${feeLabel(booking)}, ${booking.paymentMethod}, ${formatClinicDateTime(booking.slotStart.toISOString())}. Reference ${booking.upiReference}. Status: PENDING MANUAL VERIFICATION. Verify in the clinic account before confirming.`,
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
        [d.review.duration, `${booking.durationMinutes} ${d.review.mins}`],
        ...(booking.followUpCount
          ? [[d.review.plan, `${booking.followUpCount} × ${booking.followUpMinutes} ${d.review.mins}`] as [string, string]]
          : []),
      ],
      meet ? d.emails.confirmNote : d.emails.confirmNoMeet,
      meet ? { label: d.emails.meetCta, url: meet } : undefined
    ),
    text: [d.emails.confirmTitle, ...baseRows(booking).map(([key, value]) => `${key}: ${value}`), meet ? `${d.pay.meeting}: ${meet}` : d.emails.confirmNoMeet].join("\n"),
  });
  return result;
}

/** Clinic-side confirmation. The doctor never received one before: only the
 *  patient was notified when an appointment became CONFIRMED. */
export async function sendAdminConfirmation(booking: VopdBooking) {
  const meet = booking.meetUrl;
  const d = vopdDict(mailLocale(booking));
  const rows: [string, string][] = [
    ...baseRows(booking),
    ["Status", `${booking.status} · ${booking.paymentStatus}`],
    ...(meet ? [["Meet link", meet] as [string, string]] : []),
    ["Verified by", booking.verifiedBy || "—"],
  ];
  return sendSystemEmail({
    to: CLINIC_EMAIL,
    replyTo: booking.email || undefined,
    subject: `Appointment confirmed — ${booking.reference} — ${booking.planName}`,
    html: shell(
      `Appointment confirmed — ${booking.reference}`,
      "Patient notification sent",
      rows,
      meet
        ? "The patient has been emailed the appointment details and the Google Meet link. Add this appointment to your calendar if it is not already there."
        : "No Meet link is attached yet — add one to confirm the patient has join details.",
      meet ? { label: "Open Google Meet", url: meet } : undefined
    ),
    text: [
      `Appointment confirmed — ${booking.reference}`,
      ...rows.map(([key, value]) => `${key}: ${value}`),
    ].join("\n"),
  });
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
