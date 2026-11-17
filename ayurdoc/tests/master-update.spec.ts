import { test, expect, type APIRequestContext } from "@playwright/test";

const ADMIN_PASSWORD = process.env.VOPD_TEST_ADMIN_PASSWORD ?? process.env.VOPD_ADMIN_PASSWORD ?? "";
const ADMIN_READY = Boolean(ADMIN_PASSWORD && process.env.VOPD_ADMIN_SESSION_SECRET);

function clinicDate(offset: number): string {
  const target = new Date(Date.now() + offset * 86_400_000);
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(target);
  return new Date(`${date}T00:00:00Z`).getUTCDay() === 0 ? clinicDate(offset + 1) : date;
}
let ip = 0;
const freshIp = () => ({ "x-forwarded-for": `10.20.${Math.floor(++ip / 250)}.${(ip % 250) + 1}` });

async function login(request: APIRequestContext) {
  test.skip(!ADMIN_READY, "Admin credentials not configured in this sandbox.");
  const response = await request.post("/api/admin/vopd/login", { data: { password: ADMIN_PASSWORD } });
  expect(response.status()).toBe(200);
}

async function firstSlot(request: APIRequestContext, date: string, plan = "first") {
  const data = await (await request.get(`/api/vopd/availability?date=${date}&plan=${plan}`)).json();
  expect(data.ok).toBe(true);
  return data.slots?.[0]?.startIso as string | undefined;
}

function bookingPayload(slot: string, overrides: Record<string, unknown> = {}) {
  return {
    patientKind: "adult", gender: "Male", patientName: "Master Update Test", ageOrDob: "1990-01-01",
    phone: "+919999999991", email: "master-update@example.invalid", concernCategory: "general",
    symptoms: "Automated regression test symptoms.", planId: "first", currency: "INR",
    slotStartIso: slot, consent: true, ...overrides,
  };
}

test.describe("category and currency policy", () => {
  test("child and adult gender category restrictions are enforced by the API", async ({ request }) => {
    const date = clinicDate(12);
    const slot = await firstSlot(request, date);
    expect(slot).toBeTruthy();
    const invalid = [
      { patientKind: "child", guardianName: "Test Guardian", ageOrDob: "2020-01-01", gender: "Boy", concernCategory: "mens-health" },
      { patientKind: "child", guardianName: "Test Guardian", ageOrDob: "2020-01-01", gender: "Girl", concernCategory: "womens-health" },
      { patientKind: "adult", gender: "Male", concernCategory: "womens-health" },
      { patientKind: "adult", gender: "Female", concernCategory: "mens-health" },
      { patientKind: "adult", gender: "", concernCategory: "general" },
    ];
    for (const overrides of invalid) {
      const response = await request.post("/api/vopd/bookings", { headers: freshIp(), data: bookingPayload(slot!, overrides) });
      expect(response.status()).toBe(400);
      const body = await response.json();
      expect(body.ok).toBe(false);
    }
  });

  test("INR and USD are independent stored prices; browser price is ignored", async ({ request }) => {
    const config = await (await request.get("/api/vopd/config")).json();
    const first = config.plans.find((p: { id: string }) => p.id === "first");
    expect(first.amountMinor).toBe(40000);
    expect(first.amountMinorUsd).toBe(7500);
    expect(config.plans.some((p: { id: string; name: string }) => p.id === "wellness" || /bal wellness program/i.test(p.name))).toBe(false);

    const date = clinicDate(13);
    const slot = await firstSlot(request, date);
    // International visitor attempting to force INR or tampered amount is still billed stored USD fee.
    const response = await request.post("/api/vopd/bookings", {
      headers: { ...freshIp(), "x-nf-country": "US" },
      data: bookingPayload(slot!, { currency: "INR", amountMinor: 1 }),
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.currency).toBe("USD");
    expect(body.amountMinor).toBe(7500);

    // Indian visitor attempting to force USD is still billed stored INR fee.
    const inSlot = (await (await request.get(`/api/vopd/availability?date=${date}&plan=first`)).json()).slots?.[0]?.startIso as string;
    const inResponse = await request.post("/api/vopd/bookings", {
      headers: { ...freshIp(), "x-nf-country": "IN" },
      data: bookingPayload(inSlot, { currency: "USD", amountMinor: 1 }),
    });
    expect(inResponse.status()).toBe(201);
    const inBody = await inResponse.json();
    expect(inBody.currency).toBe("INR");
    expect(inBody.amountMinor).toBe(40000);
  });

  test("currency is automatic with no manual currency selector anywhere on home or booking", async ({ page, request }) => {
    const geo = await (await request.get("/api/geo")).json();
    expect(["INR", "USD", null]).toContain(geo.currency);
    await page.goto("/");
    await expect(page.locator("[data-currency-choice]")).toHaveCount(0);
    await expect(page.getByText("Consultation currency")).toHaveCount(0);
    await page.goto("/contact");
    await expect(page.locator("[data-currency-choice]")).toHaveCount(0);
    await expect(page.getByText("Consultation currency")).toHaveCount(0);
  });
});

test.describe("availability and payment administration", () => {
  test("weekly breaks, holidays and special hours affect new slots only", async ({ request }) => {
    await login(request);
    const date = clinicDate(14);
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
    const schedule = { weekday, closed: false, intervalMinutes: 30,
      sessions: [{ start: "10:00", end: "12:00" }], breaks: [{ start: "10:30", end: "11:00" }] };
    expect((await request.patch("/api/admin/vopd/schedule", { data: schedule })).status()).toBe(200);
    let availability = await (await request.get(`/api/vopd/availability?date=${date}&plan=first`)).json();
    expect(availability.slots.map((s: { label: string }) => s.label)).toEqual(["10:00 AM", "11:00 AM", "11:30 AM"]);

    const holiday = clinicDate(15);
    expect((await request.post("/api/admin/vopd/schedule", { data: { date: holiday, closed: true, sessions: [], breaks: [], intervalMinutes: 30, reason: "Test holiday" } })).status()).toBe(200);
    availability = await (await request.get(`/api/vopd/availability?date=${holiday}&plan=first`)).json();
    expect(availability.slots).toHaveLength(0);

    const special = clinicDate(16);
    expect((await request.post("/api/admin/vopd/schedule", { data: { date: special, closed: false, sessions: [{ start: "09:00", end: "10:00" }], breaks: [], intervalMinutes: 30, reason: "Test special hours" } })).status()).toBe(200);
    availability = await (await request.get(`/api/vopd/availability?date=${special}&plan=first`)).json();
    expect(availability.slots.map((s: { label: string }) => s.label)).toEqual(["9:00 AM", "9:30 AM"]);
  });

  test("payment submission stays pending; admin approval/rejection is explicit and duplicate-safe", async ({ request }) => {
    await login(request);
    const date = clinicDate(17);
    const slot = await firstSlot(request, date);
    const created = await (await request.post("/api/vopd/bookings", { headers: freshIp(), data: bookingPayload(slot!) })).json();
    expect(created.reference).toBeTruthy();
    const reference = created.reference as string;

    const form = new FormData();
    form.set("payerName", "Test Payer");
    form.set("upiReference", "TESTUTR123456");
    const submitted = await request.post(`/api/vopd/bookings/${reference}/payment`, { multipart: form });
    expect(submitted.status()).toBe(200);
    expect((await submitted.json()).paymentStatus).toBe("SUBMITTED");

    const duplicate = await request.post(`/api/vopd/bookings/${reference}/payment`, { multipart: form });
    expect(duplicate.status()).toBe(409);

    const action = (body: Record<string, unknown>) => request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: body });
    const verified = await action({ action: "verify" });
    expect(verified.status()).toBe(200);
    const verifiedBody = await verified.json();
    expect(verifiedBody.booking.paymentStatus).toBe("VERIFIED");
    // Calendar/email are not configured in the sandbox; verification must still succeed.
    expect(["PAYMENT_VERIFIED", "CONFIRMED"]).toContain(verifiedBody.booking.status);
    expect((await action({ action: "verify" })).status()).toBe(409);

    const date2 = clinicDate(18);
    const slot2 = await firstSlot(request, date2);
    const created2 = await (await request.post("/api/vopd/bookings", { headers: freshIp(), data: bookingPayload(slot2!) })).json();
    const form2 = new FormData();
    form2.set("payerName", "Test Payer");
    form2.set("upiReference", "TESTUTR654321");
    await request.post(`/api/vopd/bookings/${created2.reference}/payment`, { multipart: form2 });
    const rejected = await request.post(`/api/admin/vopd/bookings/${created2.reference}/action`, { data: { action: "reject", reason: "Test rejection" } });
    expect(rejected.status()).toBe(200);
    expect((await rejected.json()).booking.paymentStatus).toBe("REJECTED");
  });

  test("independent plan price edits preserve historical charges; deactivation keeps references", async ({ request }) => {
    await login(request);
    const createdPlan = await request.post("/api/admin/vopd/plans", { data: {
      name: "Test Independent Pricing", description: "Regression test plan for independent currency prices.",
      priceInr: "400", priceUsd: "15", durationMinutes: 30, requiresPayment: true,
      showOnPricing: false, featured: false, active: true, features: [],
    } });
    expect(createdPlan.status()).toBe(201);
    const plan = (await createdPlan.json()).plan;
    const date = clinicDate(19);
    const slot = await firstSlot(request, date, plan.id);
    const booking = await (await request.post("/api/vopd/bookings", { headers: freshIp(),
      data: bookingPayload(slot!, { planId: plan.id, currency: "INR" }) })).json();
    expect(booking.amountMinor).toBe(40000);

    const usdDate = clinicDate(20);
    const usdSlot = await firstSlot(request, usdDate, plan.id);
    const usdBooking = await (await request.post("/api/vopd/bookings", { headers: freshIp(),
      data: bookingPayload(usdSlot!, { planId: plan.id, currency: "USD" }) })).json();
    expect(usdBooking.amountMinor).toBe(1500);

    expect((await request.patch(`/api/admin/vopd/plans/${plan.id}`, { data: { priceInr: "500" } })).status()).toBe(200);
    let config = await (await request.get("/api/vopd/config")).json();
    let updated = config.plans.find((p: { id: string }) => p.id === plan.id);
    expect(updated.amountMinor).toBe(50000);
    expect(updated.amountMinorUsd).toBe(1500);

    expect((await request.patch(`/api/admin/vopd/plans/${plan.id}`, { data: { priceUsd: "20" } })).status()).toBe(200);
    config = await (await request.get("/api/vopd/config")).json();
    updated = config.plans.find((p: { id: string }) => p.id === plan.id);
    expect(updated.amountMinor).toBe(50000);
    expect(updated.amountMinorUsd).toBe(2000);

    const historical = await (await request.get(`/api/admin/vopd/bookings/${booking.reference}`)).json();
    expect(historical.booking.amountMinor).toBe(40000);
    expect(historical.booking.currency).toBe("INR");
    const historicalUsd = await (await request.get(`/api/admin/vopd/bookings/${usdBooking.reference}`)).json();
    expect(historicalUsd.booking.amountMinor).toBe(1500);
    expect(historicalUsd.booking.currency).toBe("USD");

    expect((await request.delete(`/api/admin/vopd/plans/${plan.id}`)).status()).toBe(200);
    config = await (await request.get("/api/vopd/config")).json();
    expect(config.plans.some((p: { id: string }) => p.id === plan.id)).toBe(false);
    expect((await request.get(`/api/admin/vopd/bookings/${booking.reference}`)).status()).toBe(200);
  });

  test("closing a date after confirmation does not cancel the confirmed appointment", async ({ request }) => {
    await login(request);
    const date = clinicDate(21);
    const slot = await firstSlot(request, date);
    const created = await (await request.post("/api/vopd/bookings", { headers: freshIp(), data: bookingPayload(slot!) })).json();
    const form = new FormData();
    form.set("payerName", "Test Payer");
    form.set("upiReference", "TESTUTR777777");
    await request.post(`/api/vopd/bookings/${created.reference}/payment`, { multipart: form });
    await request.post(`/api/admin/vopd/bookings/${created.reference}/action`, { data: { action: "verify" } });
    const confirmed = await request.post(`/api/admin/vopd/bookings/${created.reference}/action`, {
      data: { action: "set-meet", meetUrl: "https://meet.google.com/abc-defg-hij" },
    });
    expect(confirmed.status()).toBe(200);
    expect((await confirmed.json()).booking.status).toBe("CONFIRMED");

    expect((await request.post("/api/admin/vopd/schedule", { data: { date, closed: true, sessions: [], breaks: [], intervalMinutes: 30, reason: "Post-confirmation closure test" } })).status()).toBe(200);
    const after = await (await request.get(`/api/admin/vopd/bookings/${created.reference}`)).json();
    expect(after.booking.status).toBe("CONFIRMED");
  });
});

test.describe("multilingual doctor profile and location", () => {
  for (const [code, native, marker] of [["en", "English", "Thoughtful care"], ["hi", "हिन्दी", "समग्र स्वास्थ्य"], ["mr", "मराठी", "संपूर्ण आरोग्याचा"], ["gu", "ગુજરાતી", "સમગ્ર સ્વાસ્થ્ય"]] as const) {
    test(`About Doctor renders ${code} content and preserves language across navigation`, async ({ page }) => {
      await page.goto("/about-doctor");
      await page.getByRole("button", { name: "Select language" }).first().click();
      await page.getByRole("option", { name: native }).click();
      await expect(page.locator("main")).toContainText(marker);
      await expect(page.locator("main")).toContainText("Madhya Pradesh Ayurveda, Unani & Naturopathy Board");
      await page.goto("/");
      await page.goto("/about-doctor");
      await expect(page.locator("main")).toContainText(marker);
    });
  }

  test("map embed and directions use the same central coordinates", async ({ page }) => {
    await page.goto("/");
    const iframe = page.locator("#clinic iframe");
    await expect(iframe).toHaveAttribute("src", /22\.7256959%2C75\.9192861/);
    const directions = page.locator("#clinic a", { hasText: /directions|रास्ता|नकाशा|દિશા/i }).first();
    await expect(directions).toHaveAttribute("href", /destination=22\.7256959%2C75\.9192861/);
  });
});
