import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/vopd/admin";
import { blockDate, listBlockedDates, unblockDate } from "@/lib/vopd/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  return NextResponse.json({ ok: true, blocked: await listBlockedDates() });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const date = typeof body?.date === "string" ? body.date : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ ok: false, error: "Enter a date (YYYY-MM-DD)." }, { status: 400 });
  const row = await blockDate(date, admin, typeof body?.reason === "string" ? body.reason : undefined);
  return NextResponse.json({ ok: true, blocked: row });
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return NextResponse.json({ ok: false, error: "Invalid id." }, { status: 400 });
  const row = await unblockDate(id, admin);
  return NextResponse.json({ ok: Boolean(row) });
}
