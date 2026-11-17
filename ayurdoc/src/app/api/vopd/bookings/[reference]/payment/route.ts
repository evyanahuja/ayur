import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/db";
import { getBooking, submitPayment, VopdConflictError, type ScreenshotInput } from "@/lib/vopd/store";
import { validatePayment } from "@/lib/vopd/validation";
import { isBookingReference } from "@/content/vopd";
import { sendPaymentSubmitted } from "@/lib/vopd/mailer";

export const dynamic = "force-dynamic";

const MAX_BYTES = 2 * 1024 * 1024;
const MAX_BODY_BYTES = MAX_BYTES + 64 * 1024; // screenshot + small form fields
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp"]);

/** Detect the real image format from magic bytes — never trust the supplied MIME type. */
function sniffImageType(buf: Buffer): "image/png" | "image/jpeg" | "image/webp" | null {
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 && buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a) return "image/png";
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  return null;
}

export async function POST(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false, error: "Booking is temporarily unavailable." }, { status: 503 });
  const { reference } = await params;
  if (!isBookingReference(reference)) return NextResponse.json({ ok: false, error: "Invalid booking reference." }, { status: 400 });

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Upload too large. Keep the screenshot under 2 MB." }, { status: 413 });
  }

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ ok: false, error: "Invalid submission." }, { status: 400 });

  const parsed = validatePayment({ payerName: form.get("payerName"), upiReference: form.get("upiReference") });
  if (!parsed.ok) return NextResponse.json({ ok: false, errors: parsed.errors }, { status: 400 });

  let screenshot: ScreenshotInput | undefined;
  const file = form.get("screenshot");
  if (file && typeof file === "object" && "arrayBuffer" in file && file.size > 0) {
    if (!ALLOWED.has(file.type)) {
      return NextResponse.json({ ok: false, errors: { screenshot: "Upload a PNG, JPG or WebP image." } }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, errors: { screenshot: "Screenshot must be smaller than 2 MB." } }, { status: 400 });
    }
    const data = Buffer.from(await file.arrayBuffer());
    const sniffed = sniffImageType(data);
    if (!sniffed) {
      return NextResponse.json({ ok: false, errors: { screenshot: "The file is not a valid PNG, JPG or WebP image." } }, { status: 400 });
    }
    screenshot = { mimeType: sniffed, sizeBytes: file.size, data };
  }

  const existing = await getBooking(reference);
  if (!existing) return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
  if ((existing.status === "SLOT_RESERVED" || existing.status === "PAYMENT_PENDING") && existing.holdExpiresAt && existing.holdExpiresAt.getTime() < Date.now()) {
    return NextResponse.json(
      { ok: false, error: "Your slot hold expired before payment was submitted. The clinic will help resolve a payment made after expiry — call +91 98607 75010 with your reference.", code: "HOLD_EXPIRED" },
      { status: 409 }
    );
  }

  try {
    const booking = await submitPayment(reference, parsed.value, screenshot);
    await Promise.allSettled([sendPaymentSubmitted(booking)]); // notification failures never affect saved payment
    return NextResponse.json({
      ok: true,
      reference: booking.reference,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      message: "Payment details received. Your appointment remains pending until the clinic verifies the payment in its bank/UPI account.",
    });
  } catch (error) {
    if (error instanceof VopdConflictError) {
      return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: error.code === "NOT_FOUND" ? 404 : 409 });
    }
    console.error("VOPD payment submission failed:", error);
    return NextResponse.json({ ok: false, error: "Could not save the payment details. Please try again." }, { status: 500 });
  }
}
