import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/db";
import { createBooking, VopdConflictError } from "@/lib/vopd/store";
import { validateBooking } from "@/lib/vopd/validation";
import { sendAcknowledgement, sendAdminNewBooking } from "@/lib/vopd/mailer";

export const dynamic = "force-dynamic";

const RATE_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT = 6;
const attempts = new Map<string, { count: number; windowStart: number }>();

function clientKey(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  return forwarded.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function rateLimited(key: string) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    attempts.set(key, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Online booking is temporarily unavailable. Please call the clinic." }, { status: 503 });
  }
  if (rateLimited(clientKey(request))) {
    return NextResponse.json({ ok: false, error: "Too many booking attempts. Please wait a few minutes or call the clinic." }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  if (body && typeof body === "object" && (body as { website?: string }).website) {
    // Honeypot: pretend success, create nothing.
    return NextResponse.json({ ok: true, reference: null }, { status: 201 });
  }

  const parsed = validateBooking(body);
  if (!parsed.ok) return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 });

  try {
    const booking = await createBooking(parsed.value);
    // Notifications are best-effort; the booking is already persisted.
    void Promise.allSettled([sendAcknowledgement(booking), sendAdminNewBooking(booking)]);
    return NextResponse.json(
      {
        ok: true,
        reference: booking.reference,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        holdExpiresAt: booking.holdExpiresAt?.toISOString() ?? null,
        amountMinor: booking.amountMinor,
        currency: booking.currency,
        durationMinutes: booking.durationMinutes,
        slotStart: booking.slotStart.toISOString(),
        planName: booking.planName,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof VopdConflictError) {
      return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: error.code === "SLOT_TAKEN" ? 409 : 400 });
    }
    console.error("VOPD booking failed:", error);
    return NextResponse.json({ ok: false, error: "Could not reserve that slot. Please try again." }, { status: 500 });
  }
}
