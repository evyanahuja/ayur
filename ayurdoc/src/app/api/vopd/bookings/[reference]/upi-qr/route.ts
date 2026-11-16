import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/db";
import { getBooking } from "@/lib/vopd/store";
import { isUpiConfigured } from "@/lib/vopd/config";
import { isBookingReference } from "@/content/vopd";

export const dynamic = "force-dynamic";

/**
 * Generates the patient's UPI payment QR as an SVG.
 * The payee VPA/beneficiary come only from server environment variables and the
 * amount + reference come from the stored booking, so a patient can never alter
 * the payee or the amount by editing the client. Served from our own origin to
 * satisfy the site CSP (img-src 'self').
 */
export async function GET(_request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  if (!isBookingReference(reference)) {
    return NextResponse.json({ ok: false, error: "Invalid booking reference." }, { status: 400 });
  }
  if (!isDatabaseConfigured() || !isUpiConfigured()) {
    return NextResponse.json({ ok: false, error: "UPI payment is not configured." }, { status: 404 });
  }
  const booking = await getBooking(reference);
  if (!booking || booking.amountMinor == null) {
    return NextResponse.json({ ok: false, error: "No payable booking found for this reference." }, { status: 404 });
  }

  const vpa = process.env.VOPD_UPI_ID?.trim() || "";
  const beneficiary = process.env.VOPD_UPI_NAME?.trim() || "";
  const amount = (booking.amountMinor / 100).toFixed(2);
  const intent =
    `upi://pay?pa=${encodeURIComponent(vpa)}` +
    `&pn=${encodeURIComponent(beneficiary)}` +
    `&am=${amount}&cu=INR` +
    `&tn=${encodeURIComponent(reference)}`;

  const svg = await QRCode.toString(intent, {
    type: "svg",
    margin: 1,
    width: 232,
    errorCorrectionLevel: "M",
    color: { dark: "#0b2419", light: "#ffffff" },
  });

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
