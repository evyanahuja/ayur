import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/db";
import { getPublicBooking } from "@/lib/vopd/store";
import { isBookingReference } from "@/content/vopd";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ reference: string }> }) {
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const { reference } = await params;
  if (!isBookingReference(reference)) return NextResponse.json({ ok: false, error: "Invalid reference." }, { status: 400 });
  const booking = await getPublicBooking(reference);
  if (!booking) return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
  // Public status view intentionally excludes phone, email, clinical notes and UTR.
  return NextResponse.json({ ok: true, booking });
}
