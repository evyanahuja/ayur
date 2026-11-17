import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/db";
import { requireAdmin } from "@/lib/vopd/admin";
import { expireStaleHolds, getOverviewStats, listBookings, listBlockedDates, listCustomPlans } from "@/lib/vopd/store";
import { calendarHealth } from "@/lib/vopd/google";
import { getAdminVopdPlans, isUpiConfigured } from "@/lib/vopd/config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });

  const url = new URL(request.url);
  await expireStaleHolds();
  const [bookings, blocked, customPlans, calendar, summary] = await Promise.all([
    listBookings({ status: url.searchParams.get("status") ?? undefined, query: url.searchParams.get("q")?.trim() || undefined }),
    listBlockedDates(),
    listCustomPlans(),
    calendarHealth(),
    getOverviewStats(),
  ]);
  return NextResponse.json({
    ok: true,
    admin,
    bookings,
    summary,
    blocked,
    builtinPlans: (await getAdminVopdPlans()).filter((plan) => !plan.isCustom),
    customPlans,
    calendar,
    upiConfigured: isUpiConfigured(),
  });
}
