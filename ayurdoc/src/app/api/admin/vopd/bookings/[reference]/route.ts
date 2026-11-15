import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/vopd/admin";
import { isBookingReference } from "@/content/vopd";
import { getAuditTrail, getBooking } from "@/lib/vopd/store";
import { googleConfigured } from "@/lib/vopd/google";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  const { reference } = await params;
  if (!isBookingReference(reference)) return NextResponse.json({ ok: false, error: "Invalid reference." }, { status: 400 });
  const booking = await getBooking(reference);
  if (!booking) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  return NextResponse.json({
    ok: true,
    booking,
    audit: await getAuditTrail(reference),
    googleConfigured: googleConfigured(),
  });
}
