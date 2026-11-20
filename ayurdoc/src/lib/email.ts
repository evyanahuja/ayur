import nodemailer from "nodemailer";
import { PLANS } from "@/content/site";

type InquiryPayload = {
  parentName: string;
  phone: string;
  email?: string;
  childName: string;
  childAge: string;
  childGender?: string;
  concernCategory: string;
  symptoms?: string;
  preferredMode: string;
  preferredDate?: string;
  preferredTime?: string;
  planInterest?: string;
  currency?: string;
  message?: string;
};

type MailResult =
  | { sent: true; reason: string; provider: "resend" | "smtp" }
  | {
      sent: false;
      reason: string;
      code: "recipient_missing" | "provider_missing" | "provider_rejected" | "provider_error";
    };

const CONCERN_LABELS: Record<string, string> = {
  skin: "Skin Diseases (Eczema, Psoriasis, Rashes)",
  neurodevelopmental: "Neurodevelopmental (Speech Delay, ADHD, Autism Support)",
  growth: "Growth & Nutrition (Height, Weight, Appetite)",
  respiratory: "Respiratory (Asthma, Cold, Cough, Tonsils)",
  allergy_immunity: "Allergies & Low Immunity",
  lifestyle: "Lifestyle Disorders (Obesity, Constipation, Sleep)",
  general: "General Child Wellness / Suvarnaprashan",
  other: "Other Concern",
};

const PLAN_NAMES: Record<string, string> = {
  first: "First Consultation",
  followup: "Follow-up Care",
  suvarna: "Suvarnaprashan Only",
  unsure: "Not sure — needs guidance",
};

/** Turn a plan key like "first" into "First Consultation — ₹400" for the doctor. */
export function planLabel(key: string | undefined, currency?: string) {
  if (!key) return "";
  const name = PLAN_NAMES[key] ?? key;
  const plan = PLANS.find((p) => p.id === key);
  if (!plan) return name;
  const price = currency === "USD" ? `${plan.usdPrice} (USD)` : plan.price;
  return `${name} — ${price}`;
}

export function concernLabel(key: string) {
  return CONCERN_LABELS[key] ?? key;
}

function escapeHtml(value: string | undefined) {
  return (value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/** Display dates from `<input type="date">` (YYYY-MM-DD) as DD-MM-YYYY. */
function toDDMMYYYY(value: string | undefined): string {
  const match = (value ?? "").match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : (value ?? "");
}

function referenceLabel(ref: string | null) {
  return ref ? ` ${ref}` : "";
}

function buildHtml(p: InquiryPayload, ref: string | null) {
  const parentName = escapeHtml(p.parentName);
  const phone = escapeHtml(p.phone);
  const email = escapeHtml(p.email) || "—";
  const childName = escapeHtml(p.childName);
  const childAge = escapeHtml(p.childAge);
  const childGender = escapeHtml(p.childGender);
  const concern = escapeHtml(concernLabel(p.concernCategory));
  const symptoms = escapeHtml(p.symptoms) || "—";
  const preferredDate = escapeHtml(toDDMMYYYY(p.preferredDate)) || "Flexible";
  const preferredTime = escapeHtml(p.preferredTime);
  const planInterest = escapeHtml(planLabel(p.planInterest, p.currency)) || "Not specified";
  const message = escapeHtml(p.message);

  return `
  <style>@media only screen and (max-width:480px){.bc-wrap{width:100%!important}.bc-pad{padding:18px 16px!important}.bc-hd{padding:20px 16px!important}.bc-row td{display:block!important;width:100%!important;padding:2px 0!important}.bc-row td.bc-k{padding-top:8px!important}}</style>
  <div class="bc-wrap" style="font-family:Arial,sans-serif;width:100%;max-width:600px;margin:0 auto;background:#fffdf8;border:1px solid #e7e0cf;border-radius:16px;overflow:hidden">
    <div class="bc-hd" style="background:#0e2b21;color:#fdf0d3;padding:24px 28px;word-break:break-word;overflow-wrap:anywhere">
      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#f4bc4f">New Patient Inquiry${ref ? ` &middot; Reference <strong>${ref}</strong>` : ""}</p>
      <h2 style="margin:8px 0 0;font-size:22px;line-height:1.3;word-break:break-word;overflow-wrap:anywhere">🌿 ${parentName} — for ${childName} (${childAge})</h2>
      <p style="margin:6px 0 0;font-size:14px;color:#d2e2c9">${concern} • ${p.preferredMode === "online" ? "Online Consultation" : "In-Clinic Visit"}</p>
    </div>
    <div class="bc-pad" style="padding:24px 28px;color:#1a2b23">
      <table style="width:100%;max-width:100%;font-size:14px;border-collapse:collapse;table-layout:fixed">
        <tr class="bc-row"><td class="bc-k" style="padding:8px 8px 8px 0;color:#6b7d73;width:34%;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">Parent</td><td style="padding:8px 0;vertical-align:top;word-break:break-word;overflow-wrap:anywhere"><strong>${parentName}</strong> — ${phone}</td></tr>
        <tr class="bc-row"><td class="bc-k" style="padding:8px 8px 8px 0;color:#6b7d73;width:34%;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">Parent Email</td><td style="padding:8px 0;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">${email}</td></tr>
        <tr class="bc-row"><td class="bc-k" style="padding:8px 8px 8px 0;color:#6b7d73;width:34%;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">Child</td><td style="padding:8px 0;vertical-align:top;word-break:break-word;overflow-wrap:anywhere"><strong>${childName}</strong>, ${childAge}${childGender ? ` • ${childGender}` : ""}</td></tr>
        <tr class="bc-row"><td class="bc-k" style="padding:8px 8px 8px 0;color:#6b7d73;width:34%;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">Concern</td><td style="padding:8px 0;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">${concern}</td></tr>
        <tr class="bc-row"><td class="bc-k" style="padding:8px 8px 8px 0;color:#6b7d73;width:34%;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">Symptoms</td><td style="padding:8px 0;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">${symptoms}</td></tr>
        <tr class="bc-row"><td class="bc-k" style="padding:8px 8px 8px 0;color:#6b7d73;width:34%;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">Preferred Slot</td><td style="padding:8px 0;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">${preferredDate} ${preferredTime ? `• ${preferredTime}` : ""}</td></tr>
        <tr class="bc-row"><td class="bc-k" style="padding:8px 8px 8px 0;color:#6b7d73;width:34%;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">Plan Interest</td><td style="padding:8px 0;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">${planInterest}</td></tr>
      </table>
      ${message ? `<div style="margin-top:16px;background:#fff9ec;border:1px solid #f0dfb8;border-radius:12px;padding:14px 16px"><p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#a85e14">Message from parent</p><p style="margin:0;font-size:14px;line-height:1.6;word-break:break-word;overflow-wrap:anywhere">${message}</p></div>` : ""}
      <p style="margin:20px 0 0;font-size:12px;color:#6b7d73;word-break:break-word;overflow-wrap:anywhere">Received via drpriyankalikhar.in landing page • Reply directly or call ${phone}</p>
    </div>
  </div>`;
}

function buildText(p: InquiryPayload, ref: string | null) {
  return `New Patient Inquiry${referenceLabel(ref)}
Parent: ${p.parentName} (${p.phone}, ${p.email || "no email"})
Child: ${p.childName}, ${p.childAge}${p.childGender ? `, ${p.childGender}` : ""}
Concern: ${concernLabel(p.concernCategory)}
Symptoms: ${p.symptoms || "-"}
Mode: ${p.preferredMode} | Slot: ${toDDMMYYYY(p.preferredDate) || "Flexible"} ${p.preferredTime || ""}
Plan: ${planLabel(p.planInterest, p.currency) || "-"}
Message: ${p.message || "-"}`;
}

// --- Shared delivery core -----------------------------------------------------
// ONE place decides how mail leaves the server. Order: Resend (if a key is set),
// then SMTP (e.g. a Gmail app password) as an automatic fallback. This matters
// when there is no verified domain: Resend then only delivers to the account
// owner, so patient emails are rejected and must fall through to SMTP.
type DeliveryInput = { to: string; subject: string; html: string; text: string; replyTo?: string };
type DeliveryResult =
  | { sent: true; provider: "resend" | "smtp"; note?: string }
  | { sent: false; reason: string; code: "recipient_missing" | "provider_missing" | "provider_rejected" | "provider_error" };

const resendConfigured = () => Boolean(process.env.RESEND_API_KEY?.trim());
const smtpConfigured = () =>
  Boolean(process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim());

/** Which provider(s) are available - surfaced in the admin console. */
export function emailProviderStatus(): { resend: boolean; smtp: boolean } {
  return { resend: resendConfigured(), smtp: smtpConfigured() };
}

function shorten(value: string, max = 180) {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}...` : clean;
}

/** Gmail (and most hosted SMTP) rewrite or reject a From address that is not the
 *  authenticated mailbox, so those always send from the SMTP login. Only the
 *  display name is taken from FROM_EMAIL. Exported for unit testing. */
export function smtpSenderFor(host: string, user: string, fromEmail: string): string {
  const configured = fromEmail.trim();
  const named = configured.match(/^\s*(.+?)\s*<[^>]+>\s*$/);
  // Quotes, backslashes and line breaks are stripped so the display name can
  // neither break the header nor inject extra headers.
  const cleanName = (named?.[1] ?? "").replace(/["\\\r\n]/g, "").trim();
  const name = cleanName || "Prakriti Ayurveda Clinic";
  const forcesLogin = /gmail|googlemail|office365|outlook/.test(host.toLowerCase());
  const bareAddress = configured.match(/<([^>]+)>/)?.[1] || (configured.includes("@") ? configured : "");
  const address = forcesLogin || !bareAddress ? user.trim() : bareAddress;
  return `"${name}" <${address}>`;
}

const smtpFrom = () =>
  smtpSenderFor(process.env.SMTP_HOST || "", process.env.SMTP_USER || "", process.env.FROM_EMAIL || "");

async function deliverViaResend(input: DeliveryInput): Promise<DeliveryResult> {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL?.trim() || "Prakriti Ayurveda Clinic <onboarding@resend.dev>",
        to: [input.to],
        reply_to: input.replyTo || undefined,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
    });
    const body = await response.text();
    if (!response.ok) {
      let detail = body;
      try { detail = (JSON.parse(body) as { message?: string }).message || body; } catch { /* keep raw body */ }
      console.error(`Resend rejected email to ${input.to} (${response.status}):`, body);
      const sandbox = /verify a domain|own email|testing emails|not verified|domain is not/i.test(detail);
      return {
        sent: false,
        code: "provider_rejected",
        reason: `Resend (${response.status}): ${shorten(detail)}${sandbox ? " - Resend only delivers to the account owner until a domain is verified; configure SMTP (Gmail app password) instead." : ""}`,
      };
    }
    return { sent: true, provider: "resend" };
  } catch (error) {
    console.error("Resend request failed:", error);
    return { sent: false, code: "provider_error", reason: `Resend could not be reached: ${shorten(error instanceof Error ? error.message : String(error), 120)}` };
  }
}

async function deliverViaSmtp(input: DeliveryInput): Promise<DeliveryResult> {
  try {
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!.trim(),
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER!.trim(), pass: process.env.SMTP_PASS },
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 20_000,
    });
    await transporter.sendMail({
      from: smtpFrom(),
      to: input.to,
      replyTo: input.replyTo || undefined,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    return { sent: true, provider: "smtp" };
  } catch (error) {
    console.error("SMTP email failed:", error);
    const raw = error instanceof Error ? error.message : String(error);
    const authFailure = /535|invalid login|username and password|application-specific|auth/i.test(raw);
    return {
      sent: false,
      code: "provider_error",
      reason: `SMTP: ${shorten(raw, 140)}${authFailure ? " - for Gmail use a 16-character App Password (2-Step Verification must be on), not your normal password." : ""}`,
    };
  }
}

async function deliverEmail(input: DeliveryInput): Promise<DeliveryResult> {
  const to = input.to?.trim();
  if (!to) return { sent: false, code: "recipient_missing", reason: "No recipient email." };
  const message = { ...input, to };

  const failures: string[] = [];
  let lastCode: "provider_rejected" | "provider_error" = "provider_error";

  if (resendConfigured()) {
    const result = await deliverViaResend(message);
    if (result.sent) return result;
    failures.push(result.reason);
    lastCode = result.code === "provider_rejected" ? "provider_rejected" : "provider_error";
    if (smtpConfigured()) console.warn("Resend failed; falling back to SMTP for", to);
  }
  if (smtpConfigured()) {
    const result = await deliverViaSmtp(message);
    if (result.sent) return failures.length ? { ...result, note: `Delivered by SMTP after: ${failures[0]}` } : result;
    failures.push(result.reason);
    lastCode = result.code === "provider_rejected" ? "provider_rejected" : "provider_error";
  }
  if (!failures.length) return { sent: false, code: "provider_missing", reason: "No email provider is configured." };
  return { sent: false, code: lastCode, reason: failures.join(" | ") };
}

export async function sendDoctorNotification(
  payload: InquiryPayload,
  ref: string | null
): Promise<MailResult> {
  const doctorEmail =
    process.env.DOCTOR_EMAIL?.trim() ||
    process.env.NOTIFY_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim() ||
    "";

  console.log(
    `[inquiry${referenceLabel(ref)}] Notification requested for ${payload.childName}. Recipient configured: ${Boolean(doctorEmail)}`
  );

  if (!doctorEmail) {
    return { sent: false, code: "recipient_missing", reason: "Doctor notification recipient is not configured." };
  }

  const result = await deliverEmail({
    to: doctorEmail,
    replyTo: payload.email || undefined,
    subject: `🌿 New Patient${referenceLabel(ref)}: ${payload.childName} (${payload.childAge}) — ${concernLabel(payload.concernCategory)}`,
    html: buildHtml(payload, ref),
    text: buildText(payload, ref),
  });
  if (!result.sent) return result;
  return { sent: true, provider: result.provider, reason: result.note || "Email notification sent." };
}

// --- Parent confirmation email ------------------------------------------------
// Sent to the parent (if they gave an email address) so they have a written
// record of the reference number and the plan they asked about. Best-effort:
// the doctor notification already went out, so a parent email failure must
// never fail the request.
function buildParentHtml(p: InquiryPayload, ref: string | null) {
  const parentName = escapeHtml(p.parentName);
  const childName = escapeHtml(p.childName);
  const childAge = escapeHtml(p.childAge);
  const plan = escapeHtml(planLabel(p.planInterest, p.currency)) || "&mdash;";
  const slot =
    escapeHtml(toDDMMYYYY(p.preferredDate) || "Flexible") +
    (p.preferredTime ? ` &middot; ${escapeHtml(p.preferredTime)}` : "");
  const refRow = ref ? escapeHtml(ref) : "&mdash;";
  return `
  <style>@media only screen and (max-width:480px){.bc-wrap{width:100%!important}.bc-pad{padding:18px 16px!important}.bc-hd{padding:20px 16px!important}.bc-row td{display:block!important;width:100%!important;padding:2px 0!important}.bc-row td.bc-k{padding-top:8px!important}}</style>
  <div class="bc-wrap" style="font-family:Arial,sans-serif;width:100%;max-width:600px;margin:0 auto;background:#fffdf8;border:1px solid #e7e0cf;border-radius:16px;overflow:hidden">
    <div class="bc-hd" style="background:#0e2b21;color:#fdf0d3;padding:24px 28px;word-break:break-word;overflow-wrap:anywhere">
      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#f4bc4f">We received your enquiry${ref ? ` &middot; Ref <strong>${refRow}</strong>` : ""}</p>
      <h2 style="margin:8px 0 0;font-size:22px;line-height:1.3;word-break:break-word;overflow-wrap:anywhere">Thank you, ${parentName} 🌿</h2>
      <p style="margin:6px 0 0;font-size:14px;color:#d2e2c9">Dr. Priyanka Likhar &middot; MD Kaumarbhritya</p>
    </div>
    <div class="bc-pad" style="padding:24px 28px;color:#1a2b23;font-size:14px;line-height:1.6;word-break:break-word;overflow-wrap:anywhere">
      <p style="margin:0 0 14px">We&rsquo;ve sent your enquiry to the clinic. Expect a personal call or WhatsApp within 24 hours (usually the same day, Mon&ndash;Sat).</p>
      <table style="width:100%;max-width:100%;font-size:14px;border-collapse:collapse;table-layout:fixed;background:#fff9ec;border:1px solid #f0dfb8;border-radius:12px">
        <tr class="bc-row"><td class="bc-k" style="padding:6px 8px 6px 14px;color:#6b7d73;width:34%;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">Reference</td><td style="padding:6px 14px 6px 0;vertical-align:top;word-break:break-word;overflow-wrap:anywhere"><strong>${refRow}</strong></td></tr>
        <tr class="bc-row"><td class="bc-k" style="padding:6px 8px 6px 14px;color:#6b7d73;width:34%;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">Child</td><td style="padding:6px 14px 6px 0;vertical-align:top;word-break:break-word;overflow-wrap:anywhere"><strong>${childName}</strong>, ${childAge}</td></tr>
        <tr class="bc-row"><td class="bc-k" style="padding:6px 8px 6px 14px;color:#6b7d73;width:34%;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">Preferred slot</td><td style="padding:6px 14px 6px 0;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">${slot}</td></tr>
        <tr class="bc-row"><td class="bc-k" style="padding:6px 8px 6px 14px;color:#6b7d73;width:34%;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">Plan of interest</td><td style="padding:6px 14px 6px 0;vertical-align:top;word-break:break-word;overflow-wrap:anywhere">${plan}</td></tr>
      </table>
      <p style="margin:18px 0 0">If urgent, please WhatsApp us and <strong>mention this reference</strong> so we can match you to your enquiry instantly.</p>
      <p style="margin:18px 0 0;font-size:12px;color:#6b7d73">With care, Dr. Priyanka Likhar &middot; Prakriti Ayurveda Clinic</p>
    </div>
  </div>`;
}

function buildParentText(p: InquiryPayload, ref: string | null) {
  return [
    `Thank you, ${p.parentName}!`,
    "",
    `We have received your enquiry for ${p.childName} (${p.childAge}) and sent it to Dr. Priyanka Likhar.`,
    "",
    `Reference: ${ref || "(pending)"}`,
    `Plan of interest: ${planLabel(p.planInterest, p.currency) || "-"}`,
    `Preferred slot: ${toDDMMYYYY(p.preferredDate) || "Flexible"}${p.preferredTime ? " " + p.preferredTime : ""}`,
    "",
    "You will hear back within 24 hours (usually the same day, Mon-Sat). For urgent help, please WhatsApp us and mention the reference above so we can match you to your enquiry instantly.",
    "",
    "- Prakriti Ayurveda Clinic",
  ].join("\n");
}

export type ParentMailResult =
  | { sent: true; provider: "resend" | "smtp" }
  | { sent: false; reason: string };

export async function sendParentConfirmation(
  payload: InquiryPayload,
  ref: string | null
): Promise<ParentMailResult> {
  if (!payload.email) return { sent: false, reason: "no_parent_email" };
  const result = await deliverEmail({
    to: payload.email,
    subject: `🌿 Enquiry received — Ref ${ref || "pending"} — ${payload.childName}`,
    html: buildParentHtml(payload, ref),
    text: buildParentText(payload, ref),
  });
  if (!result.sent) return { sent: false, reason: result.reason };
  return { sent: true, provider: result.provider };
}

/* --- Generic transactional transport (used by VOPD) --------------------------
   Reuses the same Resend → SMTP provider selection as the enquiry notifications.
   Existing OPD functions above are untouched. */
export type SystemMailInput = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SystemMailResult =
  | { sent: true; provider: "resend" | "smtp" }
  | { sent: false; reason: string; code: "recipient_missing" | "provider_missing" | "provider_rejected" | "provider_error" };

export async function sendSystemEmail(input: SystemMailInput): Promise<SystemMailResult> {
  const result = await deliverEmail(input);
  if (!result.sent) return result;
  return { sent: true, provider: result.provider };
}
