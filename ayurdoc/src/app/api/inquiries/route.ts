import { NextResponse } from "next/server";
import { db, isDatabaseConfigured } from "@/db";
import { patientInquiries } from "@/db/schema";
import { sendDoctorNotification } from "@/lib/email";
import { desc, count } from "drizzle-orm";

export const dynamic = "force-dynamic";

function sanitize(v: unknown, max = 500) {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const parentName = sanitize(body.parentName, 120);
    const phone = sanitize(body.phone, 20);
    const email = sanitize(body.email, 160);
    const childName = sanitize(body.childName, 120);
    const childAge = sanitize(body.childAge, 20);
    const childGender = sanitize(body.childGender, 20);
    const concernCategory = sanitize(body.concernCategory, 40) || "general";
    const symptoms = sanitize(body.symptoms, 2000);
    const preferredMode = sanitize(body.preferredMode, 20) || "online";
    const preferredDate = sanitize(body.preferredDate, 40);
    const preferredTime = sanitize(body.preferredTime, 40);
    const planInterest = sanitize(body.planInterest, 60);
    const message = sanitize(body.message, 2000);

    // Validation
    const errors: Record<string, string> = {};
    if (parentName.length < 2) errors.parentName = "Please enter parent name";
    if (!/^[+\d][\d\s\-()]{6,18}$/.test(phone)) errors.phone = "Please enter a valid phone number";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Please enter a valid email";
    if (childName.length < 2) errors.childName = "Please enter child's name";
    if (!childAge) errors.childAge = "Please enter child's age";
    if (!concernCategory) errors.concernCategory = "Please choose a concern";

    // Honeypot anti-spam
    if (body.website) {
      return NextResponse.json({ ok: true, id: 0 }, { status: 200 });
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ ok: false, errors }, { status: 400 });
    }

    let id = 0;
    let dbSaved = false;

    if (isDatabaseConfigured()) {
      try {
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
            planInterest: planInterest || null,
            message: message || null,
            status: "new",
          })
          .returning({ id: patientInquiries.id });

        id = inserted[0]?.id ?? 0;
        dbSaved = true;
      } catch (dbErr) {
        console.error("Database insert for /api/inquiries failed, continuing with notification:", dbErr);
      }
    } else {
      console.warn("DATABASE_URL is not configured; skipping database insert for inquiry.");
    }

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
        message,
      },
      id
    );

    return NextResponse.json(
      { ok: true, id, dbSaved, emailSent: mail.sent, emailNote: mail.reason },
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
    // Only expose aggregate + recent count for social-proof, not PII
    return NextResponse.json({
      ok: true,
      total: Number(total[0]?.value ?? 0),
      recentCount: rows.length,
    });
  } catch {
    return NextResponse.json({ ok: true, total: 0, recentCount: 0 });
  }
}
