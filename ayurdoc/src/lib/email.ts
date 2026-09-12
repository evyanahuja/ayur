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

function buildHtml(p: InquiryPayload, id: number) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fffdf8;border:1px solid #e7e0cf;border-radius:16px;overflow:hidden">
    <div style="background:#0e2b21;color:#fdf0d3;padding:24px 28px">
      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#f4bc4f">New Patient Inquiry #${id}</p>
      <h2 style="margin:8px 0 0;font-size:22px">🌿 ${p.parentName} — for ${p.childName} (${p.childAge})</h2>
      <p style="margin:6px 0 0;font-size:14px;color:#d2e2c9">${concernLabel(p.concernCategory)} • ${p.preferredMode === "online" ? "Online Consultation" : "In-Clinic Visit"}</p>
    </div>
    <div style="padding:24px 28px;color:#1a2b23">
      <table style="width:100%;font-size:14px;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#6b7d73;width:150px">Parent</td><td><strong>${p.parentName}</strong> — ${p.phone}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7d73">Parent Email</td><td>${p.email || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7d73">Child</td><td><strong>${p.childName}</strong>, ${p.childAge}${p.childGender ? ` • ${p.childGender}` : ""}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7d73">Concern</td><td>${concernLabel(p.concernCategory)}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7d73">Symptoms</td><td>${p.symptoms || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7d73">Preferred Slot</td><td>${p.preferredDate || "Flexible"} ${p.preferredTime ? `• ${p.preferredTime}` : ""}</td></tr>
        <tr><td style="padding:8px 0;color:#6b7d73">Plan Interest</td><td>${p.planInterest || "Not specified"}</td></tr>
      </table>
      ${p.message ? `<div style="margin-top:16px;background:#fff9ec;border:1px solid #f0dfb8;border-radius:12px;padding:14px 16px"><p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#a85e14">Message from parent</p><p style="margin:0;font-size:14px;line-height:1.6">${p.message.replace(/</g, "&lt;")}</p></div>` : ""}
      <p style="margin:20px 0 0;font-size:12px;color:#6b7d73">Received via drpriyankalikhar.in landing page • Reply directly or call ${p.phone}</p>
    </div>
  </div>`;
}

function buildText(p: InquiryPayload, id: number) {
  return `New Patient Inquiry #${id}
Parent: ${p.parentName} (${p.phone}, ${p.email || "no email"})
Child: ${p.childName}, ${p.childAge}${p.childGender ? `, ${p.childGender}` : ""}
Concern: ${concernLabel(p.concernCategory)}
Symptoms: ${p.symptoms || "-"}
Mode: ${p.preferredMode} | Slot: ${p.preferredDate || "Flexible"} ${p.preferredTime || ""}
Plan: ${p.planInterest || "-"}
Message: ${p.message || "-"}`;
}

export async function sendDoctorNotification(payload: InquiryPayload, id: number) {
  const doctorEmail =
    process.env.DOCTOR_EMAIL || process.env.NOTIFY_EMAIL || process.env.SMTP_USER || "";

  // Always log for observability
  console.log(`[inquiry #${id}] New inquiry from ${payload.parentName} (${payload.phone}) for ${payload.childName}. Doctor email target: ${doctorEmail || "(not configured)"}`);

  if (!doctorEmail) {
    return { sent: false, reason: "DOCTOR_EMAIL not configured — inquiry saved to database." };
  }

  const subject = `🌿 New Patient: ${payload.childName} (${payload.childAge}) — ${concernLabel(payload.concernCategory)}`;

  // Option 1: Resend API if configured (simplest, no SMTP)
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.FROM_EMAIL || "BalChikitsa <onboarding@resend.dev>",
          to: [doctorEmail],
          reply_to: payload.email || undefined,
          subject,
          html: buildHtml(payload, id),
          text: buildText(payload, id),
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        console.error("Resend failed:", t);
        return { sent: false, reason: "Email provider error." };
      }
      return { sent: true, reason: "sent via Resend" };
    } catch (e) {
      console.error("Resend error", e);
      return { sent: false, reason: "Email send failed." };
    }
  }

  // Option 2: SMTP via nodemailer
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || `"BalChikitsa Website" <${process.env.SMTP_USER}>`,
        to: doctorEmail,
        replyTo: payload.email || undefined,
        subject,
        text: buildText(payload, id),
        html: buildHtml(payload, id),
      });
      return { sent: true, reason: "sent via SMTP" };
    } catch (e) {
      console.error("SMTP send failed", e);
      return { sent: false, reason: "SMTP send failed — saved to database." };
    }
  }

  return { sent: false, reason: "Email not configured — inquiry saved to database. Set DOCTOR_EMAIL + SMTP or RESEND_API_KEY." };
}
