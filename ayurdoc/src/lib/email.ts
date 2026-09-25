import nodemailer from "nodemailer";

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

function referenceLabel(id: number | null) {
  return id ? ` #${id}` : "";
}

function buildHtml(p: InquiryPayload, id: number | null) {
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
  const planInterest = escapeHtml(p.planInterest) || "Not specified";
  const message = escapeHtml(p.message);

  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fffdf8;border:1px solid #e7e0cf;border-radius:16px;overflow:hidden">
    <div style="background:#0e2b21;color:#fdf0d3;padding:24px 28px">
      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#f4bc4f">New Patient Inquiry${referenceLabel(id)}</p>
      <h2 style="margin:8px 0 0;font-size:22px">🌿 ${parentName} — for ${childName} (${childAge})</h2>
      <p style="margin:6px 0 0;font-size:14px;color:#d2e2c9">${concern} • ${p.preferredMode === "online" ? "Online Consultation" : "In-Clinic Visit"}</p>
    </div>
    <div style="padding:24px 28px;color:#1a2b23">
      <table style="width:100%;font-size:14px;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#6b7d73;width:150px">Parent</td><td><strong>${parentName}</strong> — ${phone}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7d73">Parent Email</td><td>${email}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7d73">Child</td><td><strong>${childName}</strong>, ${childAge}${childGender ? ` • ${childGender}` : ""}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7d73">Concern</td><td>${concern}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7d73">Symptoms</td><td>${symptoms}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7d73">Preferred Slot</td><td>${preferredDate} ${preferredTime ? `• ${preferredTime}` : ""}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7d73">Plan Interest</td><td>${planInterest}</td></tr>
      </table>
      ${message ? `<div style="margin-top:16px;background:#fff9ec;border:1px solid #f0dfb8;border-radius:12px;padding:14px 16px"><p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#a85e14">Message from parent</p><p style="margin:0;font-size:14px;line-height:1.6">${message}</p></div>` : ""}
      <p style="margin:20px 0 0;font-size:12px;color:#6b7d73">Received via drpriyankalikhar.in landing page • Reply directly or call ${phone}</p>
    </div>
  </div>`;
}

function buildText(p: InquiryPayload, id: number | null) {
  return `New Patient Inquiry${referenceLabel(id)}
Parent: ${p.parentName} (${p.phone}, ${p.email || "no email"})
Child: ${p.childName}, ${p.childAge}${p.childGender ? `, ${p.childGender}` : ""}
Concern: ${concernLabel(p.concernCategory)}
Symptoms: ${p.symptoms || "-"}
Mode: ${p.preferredMode} | Slot: ${p.preferredDate || "Flexible"} ${p.preferredTime || ""}
Plan: ${p.planInterest || "-"}
Message: ${p.message || "-"}`;
}

export async function sendDoctorNotification(
  payload: InquiryPayload,
  id: number | null
): Promise<MailResult> {
  const doctorEmail =
    process.env.DOCTOR_EMAIL?.trim() ||
    process.env.NOTIFY_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim() ||
    "";

  console.log(
    `[inquiry${referenceLabel(id)}] Notification requested for ${payload.childName}. Recipient configured: ${Boolean(doctorEmail)}`
  );

  if (!doctorEmail) {
    return {
      sent: false,
      code: "recipient_missing",
      reason: "Doctor notification recipient is not configured.",
    };
  }

  const subject = `🌿 New Patient: ${payload.childName} (${payload.childAge}) — ${concernLabel(payload.concernCategory)}`;

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
          html: buildHtml(payload, id),
          text: buildText(payload, id),
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
        text: buildText(payload, id),
        html: buildHtml(payload, id),
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
