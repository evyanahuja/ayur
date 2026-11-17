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
  const preferredDate = escapeHtml(p.preferredDate) || "Flexible";
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
Mode: ${p.preferredMode} | Slot: ${p.preferredDate || "Flexible"} ${p.preferredTime || ""}
Plan: ${planLabel(p.planInterest, p.currency) || "-"}
Message: ${p.message || "-"}`;
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
    return {
      sent: false,
      code: "recipient_missing",
      reason: "Doctor notification recipient is not configured.",
    };
  }

  const subject = `🌿 New Patient${referenceLabel(ref)}: ${payload.childName} (${payload.childAge}) — ${concernLabel(payload.concernCategory)}`;

  if (process.env.RESEND_API_KEY?.trim()) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL?.trim() || "BalChikitsa <onboarding@resend.dev>",
          to: [doctorEmail],
          reply_to: payload.email || undefined,
          subject,
          html: buildHtml(payload, ref),
          text: buildText(payload, ref),
        }),
      });
      const responseText = await res.text();
      if (!res.ok) {
        console.error(`Resend rejected inquiry notification (${res.status}):`, responseText);
        return {
          sent: false,
          code: "provider_rejected",
          reason: "Email provider rejected the notification.",
        };
      }
      console.log("Resend accepted inquiry notification:", responseText);
      return { sent: true, provider: "resend", reason: "Email notification sent." };
    } catch (error) {
      console.error("Resend request failed:", error);
      return {
        sent: false,
        code: "provider_error",
        reason: "Email provider could not be reached.",
      };
    }
  }

  if (
    process.env.SMTP_HOST?.trim() &&
    process.env.SMTP_USER?.trim() &&
    process.env.SMTP_PASS?.trim()
  ) {
    try {
      const port = Number(process.env.SMTP_PORT || 587);
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST.trim(),
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER.trim(),
          pass: process.env.SMTP_PASS,
        },
      });
      const info = await transporter.sendMail({
        from:
          process.env.FROM_EMAIL?.trim() ||
          `"BalChikitsa Website" <${process.env.SMTP_USER.trim()}>`,
        to: doctorEmail,
        replyTo: payload.email || undefined,
        subject,
        text: buildText(payload, ref),
        html: buildHtml(payload, ref),
      });
      console.log("SMTP accepted inquiry notification:", info.messageId);
      return { sent: true, provider: "smtp", reason: "Email notification sent." };
    } catch (error) {
      console.error("SMTP notification failed:", error);
      return {
        sent: false,
        code: "provider_error",
        reason: "SMTP could not send the notification.",
      };
    }
  }

  return {
    sent: false,
    code: "provider_missing",
    reason: "No email provider is configured.",
  };
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
    escapeHtml(p.preferredDate || "Flexible") +
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
      <p style="margin:18px 0 0;font-size:12px;color:#6b7d73">With care, Dr. Priyanka Likhar &middot; BalChikitsa</p>
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
    `Preferred slot: ${p.preferredDate || "Flexible"}${p.preferredTime ? " " + p.preferredTime : ""}`,
    "",
    "You will hear back within 24 hours (usually the same day, Mon-Sat). For urgent help, please WhatsApp us and mention the reference above so we can match you to your enquiry instantly.",
    "",
    "- BalChikitsa",
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
  const subject = `🌿 Enquiry received — Ref ${ref || "pending"} — ${payload.childName}`;

  if (process.env.RESEND_API_KEY?.trim()) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL?.trim() || "BalChikitsa <onboarding@resend.dev>",
          to: [payload.email],
          subject,
          html: buildParentHtml(payload, ref),
          text: buildParentText(payload, ref),
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        console.error(`Resend rejected parent confirmation (${res.status}):`, t);
        return { sent: false, reason: "provider_rejected" };
      }
      return { sent: true, provider: "resend" };
    } catch (e) {
      console.error("Resend parent confirmation failed:", e);
      return { sent: false, reason: "provider_error" };
    }
  }

  if (
    process.env.SMTP_HOST?.trim() &&
    process.env.SMTP_USER?.trim() &&
    process.env.SMTP_PASS?.trim()
  ) {
    try {
      const port = Number(process.env.SMTP_PORT || 587);
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST.trim(),
        port,
        secure: port === 465,
        auth: { user: process.env.SMTP_USER.trim(), pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from:
          process.env.FROM_EMAIL?.trim() ||
          `"BalChikitsa Website" <${process.env.SMTP_USER.trim()}>`,
        to: payload.email,
        subject,
        text: buildParentText(payload, ref),
        html: buildParentHtml(payload, ref),
      });
      return { sent: true, provider: "smtp" };
    } catch (e) {
      console.error("SMTP parent confirmation failed:", e);
      return { sent: false, reason: "provider_error" };
    }
  }

  return { sent: false, reason: "no_provider" };
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
  const to = input.to?.trim();
  if (!to) return { sent: false, reason: "No recipient email.", code: "recipient_missing" };

  if (process.env.RESEND_API_KEY?.trim()) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY.trim()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL?.trim() || "BalChikitsa <onboarding@resend.dev>",
          to: [to],
          reply_to: input.replyTo || undefined,
          subject: input.subject,
          html: input.html,
          text: input.text,
        }),
      });
      if (!response.ok) {
        console.error(`Resend rejected system email (${response.status}):`, await response.text());
        return { sent: false, reason: "Email provider rejected the message.", code: "provider_rejected" };
      }
      return { sent: true, provider: "resend" };
    } catch (error) {
      console.error("Resend system email failed:", error);
      return { sent: false, reason: "Email provider could not be reached.", code: "provider_error" };
    }
  }

  if (process.env.SMTP_HOST?.trim() && process.env.SMTP_USER?.trim() && process.env.SMTP_PASS?.trim()) {
    try {
      const port = Number(process.env.SMTP_PORT || 587);
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST.trim(),
        port,
        secure: port === 465,
        auth: { user: process.env.SMTP_USER.trim(), pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: process.env.FROM_EMAIL?.trim() || `"BalChikitsa Website" <${process.env.SMTP_USER.trim()}>`,
        to,
        replyTo: input.replyTo || undefined,
        subject: input.subject,
        text: input.text,
        html: input.html,
      });
      return { sent: true, provider: "smtp" };
    } catch (error) {
      console.error("SMTP system email failed:", error);
      return { sent: false, reason: "SMTP could not send the message.", code: "provider_error" };
    }
  }

  return { sent: false, reason: "No email provider is configured.", code: "provider_missing" };
}
