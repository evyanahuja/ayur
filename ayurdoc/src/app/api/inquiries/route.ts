import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { patientInquiries } from "@/db/schema";
import { planLabel, sendDoctorNotification, sendParentConfirmation } from "@/lib/email";
import { getResolvedVopdPlan } from "@/lib/vopd/config";
import { ensureVopdSchema } from "@/lib/vopd/store";
import { computeAgeFromDob, isValidDobString } from "@/content/vopd";
import { todayInClinic } from "@/lib/vopd/slots";
import { desc, count } from "drizzle-orm";

export const dynamic = "force-dynamic";

/* Simple per-client rate limit (best effort, in-memory). Protects the clinic inbox from
   automated floods; a shared store would be needed for strict limits across instances. */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 8;
const requestLog = new Map<string, { count: number; windowStart: number }>();

function clientKey(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  return forwarded.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string) {
  const now = Date.now();
  const entry = requestLog.get(key);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    requestLog.set(key, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function sanitize(v: unknown, max = 500) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

export async function POST(req: Request) {
  if (isRateLimited(clientKey(req))) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many enquiries from this device. Please try again later or contact the clinic on WhatsApp.",
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));

    const parentName = sanitize(body.parentName, 120);
    const phone = sanitize(body.phone, 20);
    const email = sanitize(body.email, 160);
    const childName = sanitize(body.childName, 120);
    const rawChildAge = sanitize(body.childAge, 40);
    const isoDob = rawChildAge.slice(0, 10);
    const dobAge = isValidDobString(isoDob, todayInClinic()) ? computeAgeFromDob(isoDob, todayInClinic()) : null;
    const childAge = dobAge ? `${isoDob} (${dobAge.short})` : rawChildAge;
    const childGender = sanitize(body.childGender, 20);
    const concernCategory = sanitize(body.concernCategory, 40) || "general";
    const symptoms = sanitize(body.symptoms, 2000);
    const preferredMode = sanitize(body.preferredMode, 20) || "online";
    const preferredDate = sanitize(body.preferredDate, 40);
    const preferredTime = sanitize(body.preferredTime, 40);
    const planInterest = sanitize(body.planInterest, 60);
    const message = sanitize(body.message, 2000);
    const currency = sanitize(body.currency, 3) === "USD" ? "USD" : "INR";

    // Validation
    const errors: Record<string, string> = {};
    if (parentName.length < 2) errors.parentName = "Please enter the patient's or contact person's name";
    if (!/^[+\d][\d\s\-()]{6,18}$/.test(phone)) errors.phone = "Please enter a valid phone number";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email";
    if (childName.length < 2) errors.childName = "Please enter the patient's name";
    // The UI sends an ISO date of birth; legacy API clients may still send a free-text
    // age (e.g. "6 years"). Accept both so the existing API contract keeps working.
    const legacyAgeOk = rawChildAge.length > 0 && rawChildAge.length <= 40 && /\d/.test(rawChildAge);
    if (!rawChildAge || (!isValidDobString(isoDob, todayInClinic()) && !legacyAgeOk)) {
      errors.childAge = "Please select a valid date of birth";
    }
    if (!concernCategory) errors.concernCategory = "Please choose a concern";
    if (body.consent !== true) errors.consent = "Please confirm consent so we can process your enquiry.";

    // Honeypot anti-spam: bots that fill the hidden field receive a harmless success response.
    if (body.website) {
      return NextResponse.json({ ok: true, id: null, dbSaved: false, emailSent: false }, { status: 200 });
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    let id: number | null = null;
    let dbSaved = false;

    const customResolved = planInterest ? await getResolvedVopdPlan(planInterest) : undefined;
    const resolvedPlanText = customResolved?.isCustom
      ? `${customResolved.name}${customResolved.priceLabel ? ` — ${currency === "USD" && customResolved.usdPrice ? customResolved.usdPrice : customResolved.priceLabel}` : ""}`
      : planLabel(planInterest, currency);

    if (isDatabaseConfigured()) {
      try {
        await ensureVopdSchema();
        const inserted = await db
          .insert(patientInquiries)
          .values({
            parentName,
            phone,
            email: email || null,
            childName,
            childAge,
            childGender: childGender || null,
            concernCategory,
            symptoms: symptoms || null,
            preferredMode,
            preferredDate: preferredDate || null,
            preferredTime: preferredTime || null,
            planInterest: resolvedPlanText.slice(0, 60) || null,
            message: message || null,
            status: "new",
          })
          .returning({ id: patientInquiries.id });

        id = inserted[0]?.id ?? null;
        dbSaved = id !== null;
      } catch (dbErr) {
        console.error("Database insert for /api/inquiries failed, continuing with notification:", dbErr);
      }
    } else {
      console.warn("DATABASE_URL is not configured; skipping database insert for inquiry.");
    }

    // Always produce a human-friendly reference, even if the DB is unavailable,
    // so the patient can quote it on WhatsApp and the doctor sees it in the email.
    const ref = id
      ? `PL-${String(id).padStart(4, "0")}`
      : `PL-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.floor(Math.random() * 1296)
          .toString(36)
          .padStart(2, "0")
          .toUpperCase()}`;

    const mail = await sendDoctorNotification(
      {
        parentName,
        phone,
        email,
        childName,
        childAge,
        childGender,
        concernCategory,
        symptoms,
        preferredMode,
        preferredDate,
        preferredTime,
        planInterest,
        currency,
        message,
      },
      ref
    );

    // Best-effort: send the patient a copy of their enquiry with the reference number.
    // Never fail the request if this fails.
    let parentMail: { sent: boolean; reason?: string } = { sent: false, reason: "skipped" };
    if (email) {
      try {
        const r = await sendParentConfirmation(
          {
            parentName,
            phone,
            email,
            childName,
            childAge,
            childGender,
            concernCategory,
            symptoms,
            preferredMode,
            preferredDate,
            preferredTime,
            planInterest,
            currency,
            message,
          },
          ref
        );
        parentMail = { sent: r.sent, reason: r.sent ? undefined : r.reason };
      } catch (e) {
        console.error("sendParentConfirmation threw:", e);
      }
    }

    if (!dbSaved && !mail.sent) {
      console.error("Inquiry could not be saved or emailed:", mail.reason);
      return NextResponse.json(
        {
          ok: false,
          error: "We could not deliver your enquiry. Please contact the clinic by phone or WhatsApp.",
          dbSaved,
          emailSent: false,
          emailCode: mail.code,
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        id,
        ref,
        dbSaved,
        emailSent: mail.sent,
        emailNote: mail.reason,
        emailCode: mail.sent ? null : mail.code,
        parentEmailSent: parentMail.sent,
      },
      { status: 201 }
    );
  } catch (e) {
    console.error("POST /api/inquiries failed", e);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again or WhatsApp us." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ ok: true, total: 0, recentCount: 0 });
    }

    const rows = await db
      .select()
      .from(patientInquiries)
      .orderBy(desc(patientInquiries.createdAt))
      .limit(5);
    const total = await db.select({ value: count() }).from(patientInquiries);
    // Only expose aggregate + recent count, not personal data
    return NextResponse.json({
      ok: true,
      total: Number(total[0]?.value ?? 0),
      recentCount: rows.length,
    });
  } catch {
    return NextResponse.json({ ok: true, total: 0, recentCount: 0 });
  }
}
