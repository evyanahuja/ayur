import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/db";
import { requireAdmin } from "@/lib/vopd/admin";
import { ensureVopdSchema } from "@/lib/vopd/store";
import { getScheduleSettings, removeDateSchedule, saveDateSchedule, saveWeeklySchedule, validateSchedule } from "@/lib/vopd/schedule";

export const dynamic = "force-dynamic";

async function authorised() {
  const admin = await requireAdmin();
  if (!admin) return { response: NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 }) };
  if (!isDatabaseConfigured()) return { response: NextResponse.json({ ok: false, error: "Database not configured." }, { status: 503 }) };
  await ensureVopdSchema();
  return { admin };
}

export async function GET() {
  const auth = await authorised();
  if (auth.response) return auth.response;
  return NextResponse.json({ ok: true, ...(await getScheduleSettings()) });
}

export async function PATCH(request: Request) {
  const auth = await authorised();
  if (auth.response) return auth.response;
  try {
    const body = await request.json();
    const weekday = Number(body.weekday);
    if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) throw new Error("Choose a valid weekday.");
    await saveWeeklySchedule(weekday, validateSchedule(body), auth.admin!);
    return NextResponse.json({ ok: true, ...(await getScheduleSettings()) });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid schedule." }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const auth = await authorised();
  if (auth.response) return auth.response;
  try {
    const body = await request.json();
    await saveDateSchedule(body.date, validateSchedule(body), auth.admin!);
    return NextResponse.json({ ok: true, ...(await getScheduleSettings()) });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid date override." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const auth = await authorised();
  if (auth.response) return auth.response;
  try {
    const date = new URL(request.url).searchParams.get("date") || "";
    await removeDateSchedule(date, auth.admin!);
    return NextResponse.json({ ok: true, ...(await getScheduleSettings()) });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Invalid date override." }, { status: 400 });
  }
}
