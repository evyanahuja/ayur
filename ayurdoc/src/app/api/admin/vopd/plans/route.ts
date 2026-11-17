import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/db";
import { requireAdmin } from "@/lib/vopd/admin";
import { getAdminVopdPlans } from "@/lib/vopd/config";
import { createCustomPlan, ensureVopdSchema, VopdConflictError } from "@/lib/vopd/store";
import { validateCustomPlan } from "@/lib/vopd/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });

  await ensureVopdSchema();
  const plans = await getAdminVopdPlans();
  return NextResponse.json({ ok: true, builtin: plans.filter((plan) => !plan.isCustom), custom: plans.filter((plan) => plan.isCustom) });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const parsed = validateCustomPlan(body);
  if (!parsed.ok) {
    const firstMsg = Object.values(parsed.errors)[0] || "Please check plan details.";
    return NextResponse.json({ ok: false, error: firstMsg, errors: parsed.errors }, { status: 400 });
  }

  try {
    const plan = await createCustomPlan(parsed.value, admin);
    return NextResponse.json({ ok: true, plan }, { status: 201 });
  } catch (error) {
    if (error instanceof VopdConflictError) {
      return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: 400 });
    }
    console.error("Failed to create consultation plan:", error);
    return NextResponse.json({ ok: false, error: "Could not save consultation plan." }, { status: 500 });
  }
}
