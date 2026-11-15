import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/vopd/admin";
import { getScreenshot } from "@/lib/vopd/store";
import { isBookingReference } from "@/content/vopd";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ reference: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  const { reference } = await params;
  if (!isBookingReference(reference)) return NextResponse.json({ ok: false }, { status: 400 });
  const shot = await getScreenshot(reference);
  if (!shot) return NextResponse.json({ ok: false, error: "No screenshot uploaded." }, { status: 404 });
  return new NextResponse(new Uint8Array(shot.data), {
    headers: {
      "Content-Type": shot.mimeType,
      "Content-Disposition": `inline; filename="${reference}-payment"`,
      "Cache-Control": "no-store, private",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
