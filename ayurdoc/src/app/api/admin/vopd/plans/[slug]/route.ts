import { NextResponse } from "next/server";
import { isDatabaseConfigured } from "@/db";
import { requireAdmin } from "@/lib/vopd/admin";
import { deleteCustomPlan, updateCustomPlan, VopdConflictError } from "@/lib/vopd/store";

export const dynamic = "force-dynamic";

type Patch = Parameters<typeof updateCustomPlan>[1];
function amount(value: unknown, currency: string): number {
  if (typeof value !== "string" && typeof value !== "number") throw new Error(`Enter a valid ${currency} price.`);
  const raw = String(value);
  if (!/^(?:[1-9]\d{0,5})(?:\.\d{1,2})?$/.test(raw) || Number(raw) > 500_000) throw new Error(`Enter a valid ${currency} price (up to 2 decimals).`);
  return Math.round(Number(raw) * 100);
}

function parsePatch(body: Record<string, unknown>): Patch {
  const patch: Patch = {};
  for (const key of ["active", "showOnPricing", "featured", "requiresPayment"] as const) {
    if (body[key] !== undefined) {
      if (typeof body[key] !== "boolean") throw new Error(`Invalid ${key}.`);
      patch[key] = body[key];
    }
  }
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length < 3 || body.name.length > 120 || /^bal\s+wellness\s+program$/i.test(body.name.trim())) throw new Error("Enter a valid plan name; retired plans cannot be recreated.");
    patch.name = body.name.trim();
  }
  if (body.description !== undefined) {
    if (typeof body.description !== "string" || body.description.trim().length < 6 || body.description.length > 600) throw new Error("Enter a description of 6–600 characters.");
    patch.description = body.description.trim();
  }
  if (body.subtitle !== undefined) {
    if (typeof body.subtitle !== "string" || body.subtitle.length > 120) throw new Error("Invalid tagline.");
    patch.subtitle = body.subtitle.trim() || null;
  }
  if (body.period !== undefined) {
    if (typeof body.period !== "string" || body.period.length > 80) throw new Error("Invalid period.");
    patch.period = body.period.trim() || null;
  }
  for (const [key, min, max] of [["durationMinutes", 10, 120], ["followUpCount", 0, 24], ["followUpMinutes", 0, 60]] as const) {
    if (body[key] !== undefined) {
      const value = Number(body[key]);
      if (!Number.isInteger(value) || value < min || value > max) throw new Error(`Invalid ${key}.`);
      patch[key] = value;
    }
  }
  if (body.priceInr !== undefined) patch.amountMinorInr = amount(body.priceInr, "INR");
  if (body.priceUsd !== undefined) patch.amountMinorUsd = amount(body.priceUsd, "USD");
  if (body.features !== undefined) {
    if (typeof body.features !== "string" && !Array.isArray(body.features)) throw new Error("Invalid inclusions.");
    const values = typeof body.features === "string" ? body.features.split(/\r?\n/) : body.features;
    if (values.some((v) => typeof v !== "string" || v.length > 140) || values.length > 8) throw new Error("Use at most 8 short inclusions.");
    patch.features = values.map((v: string) => v.trim()).filter(Boolean);
  }
  if (!Object.keys(patch).length) throw new Error("No changes supplied.");
  return patch;
}

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false, error: "Database unavailable." }, { status: 503 });
  const { slug } = await context.params;
  try {
    const patch = parsePatch(await request.json());
    const plan = await updateCustomPlan(slug, patch, admin);
    return NextResponse.json({ ok: true, plan });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Could not update plan." },
      { status: error instanceof VopdConflictError ? 404 : 400 });
  }
}

/** Never hard-delete an appointment-referenced plan: DELETE is a soft archive. */
export async function DELETE(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: false, error: "Database unavailable." }, { status: 503 });
  try {
    await deleteCustomPlan((await context.params).slug, admin);
    return NextResponse.json({ ok: true, message: "Plan deactivated; historical appointments preserved." });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Could not deactivate plan." }, { status: 404 });
  }
}
