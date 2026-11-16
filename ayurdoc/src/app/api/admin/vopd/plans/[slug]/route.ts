import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/db";
import { requireAdmin } from "@/lib/vopd/admin";
import { deleteCustomPlan, updateCustomPlan, VopdConflictError } from "@/lib/vopd/store";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });

  const { slug } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  try {
    const patch: Parameters<typeof updateCustomPlan>[1] = {};
    if (typeof body.active === "boolean") patch.active = body.active;
    if (typeof body.showOnPricing === "boolean") patch.showOnPricing = body.showOnPricing;
    if (typeof body.featured === "boolean") patch.featured = body.featured;
    if (typeof body.name === "string") patch.name = body.name;
    if (typeof body.description === "string") patch.description = body.description;
    if (typeof body.subtitle === "string") patch.subtitle = body.subtitle.trim() || null;
    if (typeof body.period === "string") patch.period = body.period.trim() || null;
    if (body.durationMinutes !== undefined) patch.durationMinutes = Number(body.durationMinutes);
    if (body.priceInr !== undefined) {
      const n = Number(body.priceInr);
      patch.amountMinorInr = Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null;
    }
    if (body.priceUsd !== undefined) {
      const n = Number(body.priceUsd);
      patch.amountMinorUsd = Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null;
    }
    if (body.followUpCount !== undefined) patch.followUpCount = Number(body.followUpCount);
    if (body.followUpMinutes !== undefined) patch.followUpMinutes = Number(body.followUpMinutes);
    if (typeof body.requiresPayment === "boolean") patch.requiresPayment = body.requiresPayment;
    if (typeof body.features === "string") {
      patch.features = body.features.split(/\r?\n|,/).map((s) => s.trim()).filter(Boolean).slice(0, 8);
    } else if (Array.isArray(body.features)) {
      patch.features = body.features.map((s) => String(s).trim()).filter(Boolean).slice(0, 8);
    }
    const plan = await updateCustomPlan(slug, patch, admin);
    return NextResponse.json({ ok: true, plan });
  } catch (error) {
    if (error instanceof VopdConflictError) {
      return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: 404 });
    }
    console.error("Failed to update consultation plan:", error);
    return NextResponse.json({ ok: false, error: "Could not update consultation plan." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false, error: "Database is not configured." }, { status: 503 });

  const { slug } = await context.params;
  try {
    await deleteCustomPlan(slug, admin);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof VopdConflictError) {
      return NextResponse.json({ ok: false, error: error.message, code: error.code }, { status: 404 });
    }
    console.error("Failed to delete consultation plan:", error);
    return NextResponse.json({ ok: false, error: "Could not delete consultation plan." }, { status: 500 });
  }
}
