import { test, expect, type APIRequestContext } from "@playwright/test";
import { VOPD_I18N, type VopdLocale } from "@/i18n/vopd";

/* VOPD release tests. They create real booking rows in the sandbox database and are
   cleaned by the documented test-cleanup SQL after the run. Patient emails are not
   configured in the sandbox, so no clinic email is delivered; Google Calendar is not
   configured, which is asserted explicitly rather than faked. */

function clinicDate(offsetDays: number): string {
  const target = new Date(Date.now() + offsetDays * 86_400_000);
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(target);
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  return weekday === 0 ? clinicDate(offsetDays + 1) : date;
}

const ADMIN_TEST_PASSWORD = process.env.VOPD_TEST_ADMIN_PASSWORD ?? process.env.VOPD_ADMIN_PASSWORD ?? "";
const ADMIN_READY = Boolean(ADMIN_TEST_PASSWORD && process.env.VOPD_ADMIN_SESSION_SECRET);

async function login(request: APIRequestContext) {
  test.skip(!ADMIN_READY, "Set VOPD_ADMIN_PASSWORD (or VOPD_TEST_ADMIN_PASSWORD) and VOPD_ADMIN_SESSION_SECRET to run admin tests.");
  const response = await request.post("/api/admin/vopd/login", { data: { password: ADMIN_TEST_PASSWORD } });
  expect(response.status()).toBe(200);
}

let ipCounter = 0;
function freshIp(): Record<string, string> {
  ipCounter += 1;
  return { "x-forwarded-for": `10.10.${Math.floor(ipCounter / 250)}.${(ipCounter % 250) + 1}` };
}

async function createBooking(
  request: APIRequestContext,
  overrides: Record<string, unknown> = {},
  dayOffset = 7
): Promise<{ status: number; body: Record<string, unknown> }> {
  const date = clinicDate(dayOffset);
  const availability = await (await request.get(`/api/vopd/availability?date=${date}&plan=first`)).json();
  const slot = availability.slots?.[0]?.startIso as string | undefined;
  expect(slot, "A free first-consultation slot must exist").toBeTruthy();
  const response = await request.post("/api/vopd/bookings", {
    headers: freshIp(),
    data: {
      patientKind: "adult",
      patientName: "VOPD Test Patient",
      ageOrDob: "1990-01-01",
      phone: "+919999999991",
      email: "vopd-test@example.invalid",
      city: "Indore",
      state: "Madhya Pradesh",
      concernCategory: "digestive-disorders",
      symptoms: "Test symptoms for automated verification of booking flow.",
      duration: "2 weeks",
      planId: "first",
      slotStartIso: slot,
      consent: true,
      ...overrides,
    },
  });
  return { status: response.status(), body: await response.json() };
}

test.describe("VOPD domain", () => {
  test("plan prices come from existing PLANS configuration", async ({ request }) => {
    const data = await (await request.get("/api/vopd/config")).json();
    const byId = Object.fromEntries(data.plans.map((plan: { id: string; amountMinor: number | null; requiresPayment: boolean }) => [plan.id, plan]));
    expect(byId.first.amountMinor).toBe(40000);
    expect(byId.first.bookingMinutes).toBe(30);
    expect(byId.wellness).toBeUndefined();
    expect(byId.followup.amountMinor).toBe(30000);
    expect(byId.followup.bookingMinutes).toBe(20);
    expect(byId.suvarna.amountMinor).toBeNull();
    expect(byId.suvarna.requiresPayment).toBe(false);
    expect(typeof data.config.google.configured).toBe("boolean"); // Presence is configuration-dependent, not proof of a working integration.
  });

  test("30-minute start grid prevents same-slot reservations and respects the configured buffer", async ({ request }) => {
    const date = clinicDate(8);
    const availability = await (await request.get(`/api/vopd/availability?date=${date}&plan=first`)).json();
    expect(availability.slots.length).toBeGreaterThan(0);
    for (const slot of availability.slots) {
      expect(slot.label).toMatch(/^(10|11|12|1|5|6|7):(00|30) (AM|PM)$/);
    }
    const first = availability.slots[0].startIso as string;
    const created = await createBooking(request, { slotStartIso: first });
    expect(created.status).toBe(201);

    const after = await (await request.get(`/api/vopd/availability?date=${date}&plan=first`)).json();
    const remaining = after.slots.map((slot: { startIso: string }) => slot.startIso);
    expect(remaining).not.toContain(first);
    // Duration and buffer determine whether an adjacent 30-minute start remains free.
    const nextStart = new Date(new Date(first).getTime() + 30 * 60_000).toISOString();
    if (availability.slots.some((slot: { startIso: string }) => slot.startIso === nextStart)) {
      if (availability.bufferMinutes === 0) expect(remaining).toContain(nextStart);
      else expect(remaining).not.toContain(nextStart);
    }
    const overlap = await request.post("/api/vopd/bookings", {
      headers: freshIp(),
      data: {
        patientKind: "adult", patientName: "VOPD Overlap", ageOrDob: "1990-01-01", phone: "+919999999992",
        concernCategory: "other", symptoms: "Overlapping appointment test payload.", planId: "first",
        slotStartIso: first, consent: true,
      },
    });
    expect([409, 400]).toContain(overlap.status());
  });

  test("follow-up reserves 20 minutes and allows the next 30-minute start", async ({ request }) => {
    const date = clinicDate(9);
    const availability = await (await request.get(`/api/vopd/availability?date=${date}&plan=followup`)).json();
    const first = availability.slots[0]?.startIso as string;
    const second = availability.slots[1]?.startIso as string;
    expect(new Date(second).getTime() - new Date(first).getTime()).toBe(30 * 60_000);
    const one = await request.post("/api/vopd/bookings", {
      headers: freshIp(),
      data: {
        patientKind: "adult", patientName: "VOPD Test Followup A", ageOrDob: "1981-01-01", phone: "+919999999993",
        concernCategory: "joint-bone-disorders", symptoms: "Follow-up booking test payload for twenty minute slot.",
        planId: "followup", slotStartIso: first, consent: true,
      },
    });
    const two = await request.post("/api/vopd/bookings", {
      headers: freshIp(),
      data: {
        patientKind: "adult", patientName: "VOPD Test Followup B", ageOrDob: "1980-01-01", phone: "+919999999994",
        concernCategory: "joint-bone-disorders", symptoms: "Second follow-up booking payload for the next slot.",
        planId: "followup", slotStartIso: second, consent: true,
      },
    });
    expect(one.status()).toBe(201);
    expect(two.status()).toBe(201);
    const body = await two.json();
    expect(body.durationMinutes).toBe(20);
  });

  test("server validation rejects tampered amount, past slot and mismatched child fields", async ({ request }) => {
    const bad = await request.post("/api/vopd/bookings", { headers: freshIp(), data: { patientKind: "adult", planId: "first", amountMinor: 1, consent: true } });
    expect(bad.status()).toBe(400);
    const past = await request.post("/api/vopd/bookings", {
      headers: freshIp(),
      data: {
        patientKind: "adult", patientName: "Past Slot", ageOrDob: "1990-01-01", phone: "+919999999995",
        concernCategory: "other", symptoms: "Past appointment booking attempt payload.", planId: "first",
        slotStartIso: "2020-01-06T04:30:00.000Z", consent: true,
      },
    });
    expect(past.status()).toBe(400);
    const childMissingGuardian = await request.post("/api/vopd/bookings", {
      headers: freshIp(),
      data: {
        patientKind: "child", patientName: "Child", ageOrDob: "2020-01-01", phone: "+919999999996",
        concernCategory: "childrens-health", symptoms: "Child booking without guardian details test.",
        planId: "first", slotStartIso: clinicDate(10) + "T04:30:00.000Z", consent: true,
      },
    });
    expect(childMissingGuardian.status()).toBe(400);
    expect((await childMissingGuardian.json()).errors.guardianName).toBeTruthy();
  });

  test("manual UPI verification: pending until admin verifies, duplicate prevented, calendar failure preserves booking", async ({ request }) => {
    test.skip(!ADMIN_READY, "Admin credentials are required.");
    const created = await createBooking(request, {}, 15);
    expect(created.status).toBe(201);
    const reference = created.body.reference as string;
    expect(reference).toMatch(/^VOPD-/);
    expect(created.body.amountMinor).toBe(40000);
    expect(created.body.status).toBe("PAYMENT_PENDING");

    // Public status does not expose patient contact details or the UTR.
    const publicBefore = await (await request.get(`/api/vopd/bookings/${reference}`)).json();
    expect(publicBefore.booking).not.toHaveProperty("phone");
    expect(publicBefore.booking).not.toHaveProperty("upiReference");

    const unauthorised = await request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: { action: "verify" } });
    expect(unauthorised.status()).toBe(401);

    const duplicatePayment = await request.post(`/api/vopd/bookings/${reference}/payment`, {
      multipart: { payerName: "Test Payer", upiReference: "123456789012" },
    });
    expect(duplicatePayment.status()).toBe(200);
    const paymentBody = await duplicatePayment.json();
    expect(paymentBody.paymentStatus).toBe("SUBMITTED");
    expect(paymentBody.status).toBe("PAYMENT_VERIFICATION_PENDING");
    expect(paymentBody.message).toContain("pending");

    const resubmit = await request.post(`/api/vopd/bookings/${reference}/payment`, {
      multipart: { payerName: "Test Payer", upiReference: "123456789012" },
    });
    expect(resubmit.status()).toBe(409);

    await login(request);
    const verified = await request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: { action: "verify" } });
    expect(verified.status()).toBe(200);
    const verifiedBody = await verified.json();
    expect(verifiedBody.booking.paymentStatus).toBe("VERIFIED");
    // Google is intentionally unconfigured in this sandbox; booking must remain safe.
    expect(verifiedBody.booking.status).toBe("PAYMENT_VERIFIED");
    expect(verifiedBody.outcome.calendar).toBe("NOT_CONFIGURED");
    expect(verifiedBody.booking.calendarStatus).toBe("FAILED");
    expect(verifiedBody.booking.meetUrl).toBeNull();

    const duplicateVerify = await request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: { action: "verify" } });
    expect(duplicateVerify.status()).toBe(409);

    const retry = await request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: { action: "retry-calendar" } });
    expect(retry.status()).toBe(200);
    expect((await retry.json()).outcome.calendar).toBe("NOT_CONFIGURED");

    const audit = await (await request.get(`/api/admin/vopd/bookings/${reference}`)).json();
    const actions = audit.audit.map((entry: { action: string }) => entry.action);
    expect(actions).toContain("BOOKING_CREATED");
    expect(actions).toContain("PAYMENT_SUBMITTED");
    expect(actions).toContain("PAYMENT_VERIFIED");
    expect(actions).toContain("CALENDAR_EVENT_FAILED");

    const cancelled = await request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: { action: "cancel", reason: "Automated test cleanup" } });
    expect(cancelled.status()).toBe(200);
  });

  test("rejection requires an authenticated administrator", async ({ request }) => {
    test.skip(!ADMIN_READY, "Admin credentials are required.");
    const created = await createBooking(request, {}, 17);
    const reference = created.body.reference as string;
    await request.post(`/api/vopd/bookings/${reference}/payment`, { multipart: { payerName: "Reject Payer", upiReference: "998877665544" } });
    const unauthorised = await request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: { action: "reject", reason: "No payment seen" } });
    expect(unauthorised.status()).toBe(401);
    await login(request);
    const rejected = await request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: { action: "reject", reason: "No matching payment in clinic account" } });
    expect(rejected.status()).toBe(200);
    expect((await rejected.json()).booking.status).toBe("REJECTED");
  });

  test("optional screenshot is stored privately and only served to admins", async ({ request }) => {
    test.skip(!ADMIN_READY, "Admin credentials are required.");
    const created = await createBooking(request, {}, 19);
    const reference = created.body.reference as string;
    const png = Buffer.from("89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6360000002000154a24f5f0000000049454e44ae426082", "hex");
    const uploaded = await request.post(`/api/vopd/bookings/${reference}/payment`, {
      multipart: {
        payerName: "Screenshot Payer",
        upiReference: "556677889900",
        screenshot: { name: "payment.png", mimeType: "image/png", buffer: png },
      },
    });
    expect(uploaded.status()).toBe(200);
    const unauthenticated = await request.get(`/api/admin/vopd/bookings/${reference}/screenshot`);
    expect(unauthenticated.status()).toBe(401);
    await login(request);
    const image = await request.get(`/api/admin/vopd/bookings/${reference}/screenshot`);
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/png");
    await request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: { action: "cancel", reason: "Automated test cleanup" } });
  });

  test("blocked dates disappear from availability", async ({ request }) => {
    test.skip(!ADMIN_READY, "Admin credentials are required.");
    const date = clinicDate(12);
    await login(request);
    const block = await request.post("/api/admin/vopd/blocked", { data: { date, reason: "Automated test block" } });
    expect(block.status()).toBe(200);
    const availability = await (await request.get(`/api/vopd/availability?date=${date}&plan=first`)).json();
    expect(availability.slots).toEqual([]);
    expect(availability.message).toContain("unavailable");
    const id = (await block.json()).blocked.id;
    await request.delete(`/api/admin/vopd/blocked?id=${id}`);
  });
});

test.describe("VOPD multilingual", () => {
  const languages: { locale: Exclude<VopdLocale, "en">; native: string }[] = [
    { locale: "hi", native: "हिन्दी" },
    { locale: "mr", native: "मराठी" },
    { locale: "gu", native: "ગુજરાતી" },
  ];

  test("booking API stores the visitor locale", async ({ request }) => {
    const created = await createBooking(request, { locale: "hi" }, 21);
    expect(created.status).toBe(201);
    const reference = created.body.reference as string;
    const publicView = await (await request.get(`/api/vopd/bookings/${reference}`)).json();
    expect(publicView.booking.locale).toBe("hi");
  });

  for (const { locale, native } of languages) {
    test(`VOPD patient flow renders fully in ${locale}`, async ({ page }) => {
      test.setTimeout(60_000);
      const d = VOPD_I18N[locale];
      await page.goto("/contact");
      await page.locator('header button[aria-haspopup="listbox"]').click();
      await page.getByRole("option").filter({ hasText: native }).click();
      await expect(page.locator("html")).toHaveAttribute("lang", locale);

      const enquiry = page.locator("[data-patient-enquiry]");
      await expect(enquiry.getByText(d.selector.question)).toBeVisible();
      await expect(enquiry.getByRole("radio", { name: new RegExp(d.selector.vopdTitle) })).toBeVisible();
      await enquiry.getByRole("radio", { name: new RegExp(d.selector.vopdTitle) }).click();

      // Step labels, child/adult copy and field labels must be translated.
      await expect(enquiry.getByText(d.steps[0], { exact: false }).first()).toBeVisible();
      await expect(enquiry.getByText(d.patient.who)).toBeVisible();
      await expect(enquiry.getByLabel(d.patient.guardian)).toBeVisible();
      await expect(enquiry.getByLabel(d.patient.phoneChild)).toBeVisible();
      await expect(enquiry.getByLabel(d.patient.dob)).toHaveAttribute("type", "date");

      await enquiry.getByRole("button", { name: d.patient.adult, exact: true }).click();
      await expect(enquiry.getByLabel(d.patient.childName)).toHaveCount(0);
      await expect(enquiry.getByLabel(d.patient.guardian)).toHaveCount(0);
      await expect(enquiry.getByLabel(d.patient.adultName)).toBeVisible();
      await expect(enquiry.getByLabel(d.patient.phoneAdult)).toBeVisible();

      // Validation messages are localized.
      await enquiry.getByRole("button", { name: new RegExp(d.nav.continue) }).first().click();
      await expect(enquiry.getByText(d.patient.eAdultName)).toBeVisible();
      await expect(enquiry.getByText(d.patient.ePhone)).toBeVisible();

      // Health-concern step is localized too.
      await enquiry.getByLabel(d.patient.adultName).fill("Multilingual Test");
      await enquiry.getByLabel(d.patient.dob).fill("1985-04-02");
      await enquiry.getByLabel(d.patient.phoneAdult).fill("+919999999998");
      await enquiry.getByRole("button", { name: new RegExp(d.nav.continue) }).first().click();
      await expect(enquiry.getByLabel(d.concern.category)).toBeVisible();
      await expect(enquiry.getByLabel(d.concern.symptoms)).toBeVisible();
      await expect(enquiry.getByLabel(d.concern.treatment)).toBeVisible();

      // Plan step keeps configured prices while explaining them in the local language.
      await enquiry.getByLabel(d.concern.category).selectOption("skin-hair-conditions");
      await enquiry.getByLabel(d.concern.symptoms).fill("Multilingual interface verification of symptoms text.");
      await enquiry.getByRole("button", { name: new RegExp(d.nav.continue) }).first().click();
      await expect(enquiry.getByText("₹400", { exact: false }).first()).toBeVisible();
      await expect(enquiry.getByText("Bal Wellness Program", { exact: true })).toHaveCount(0);
      await expect(enquiry.getByText("₹300", { exact: false }).first()).toBeVisible();
    });
  }

  test("VOPD sends the active locale to the booking API", async ({ page, request }) => {
    test.skip(!ADMIN_READY, "Admin credentials are required to inspect the stored locale.");
    let sentLocale: string | undefined;
    await page.route("**/api/vopd/bookings", async (route) => {
      const payload = route.request().postDataJSON();
      sentLocale = payload.locale;
      await route.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ ok: false, errors: {} }) });
    });
    await page.goto("/contact");
    await page.locator('header button[aria-haspopup="listbox"]').click();
    await page.getByRole("option").filter({ hasText: "ગુજરાતી" }).click();
    const enquiry = page.locator("[data-patient-enquiry]");
    const gu = VOPD_I18N.gu;
    await enquiry.getByRole("radio", { name: new RegExp(gu.selector.vopdTitle) }).click();
    await enquiry.getByRole("button", { name: gu.patient.adult, exact: true }).click();
    await enquiry.getByLabel(gu.patient.adultName).fill("Locale Test");
    await enquiry.getByLabel(gu.patient.dob).fill("1990-01-01");
    await enquiry.getByLabel(gu.patient.phoneAdult).fill("+919999999999");
    await enquiry.getByRole("button", { name: new RegExp(gu.nav.continue) }).first().click();
    await enquiry.getByLabel(gu.concern.category).selectOption("other");
    await enquiry.getByLabel(gu.concern.symptoms).fill("કસોટી માટે લક્ષણોનું વર્ણન પૂરતું લાંબું છે.");
    await enquiry.getByRole("button", { name: new RegExp(gu.nav.continue) }).first().click();
    await enquiry.getByRole("radio", { name: /Follow-up Care/ }).check();
    await enquiry.getByRole("button", { name: new RegExp(gu.nav.continue) }).first().click();
    const dateInput = enquiry.getByLabel(gu.slot.date);
    await dateInput.fill(clinicDate(22));
    const slotButtons = enquiry.getByRole("button", { name: /^\d{1,2}:\d{2} (AM|PM)$/ });
    await expect(slotButtons.first()).toBeVisible({ timeout: 20_000 });
    await slotButtons.first().click();
    await enquiry.getByRole("button", { name: new RegExp(gu.nav.continue) }).first().click();
    await enquiry.locator('input[type="checkbox"]').last().check();
    await enquiry.getByRole("button", { name: new RegExp(gu.nav.reserve) }).click();
    await expect.poll(() => sentLocale, { timeout: 20_000 }).toBe("gu");
  });
});

test.describe("VOPD interface", () => {
  test("OPD enquiry remains accessible and VOPD shows adult/child fields with configured fees", async ({ page }) => {
    await page.goto("/contact");
    const enquiry = page.locator("[data-patient-enquiry]");
    const d = VOPD_I18N.en;
    await enquiry.getByRole("radio", { name: new RegExp(d.selector.opdTitle) }).click();
    await expect(enquiry.getByRole("radio", { name: new RegExp(d.selector.opdTitle) })).toHaveAttribute("aria-checked", "true");
    await expect(enquiry.locator('input[name="childName"]')).toBeVisible();

    await enquiry.getByRole("radio", { name: new RegExp(d.selector.vopdTitle) }).click();
    await expect(enquiry.getByText(d.patient.who)).toBeVisible();
    await expect(enquiry.getByLabel(/Parent \/ Guardian full name/)).toBeVisible();
    await expect(enquiry.getByLabel(/Child's full name/)).toBeVisible();

    await enquiry.getByRole("button", { name: "Adult", exact: true }).click();
    await expect(enquiry.getByLabel(/Parent \/ Guardian full name/)).toHaveCount(0);
    await expect(enquiry.getByLabel(/Patient's full name/)).toBeVisible();

    await enquiry.getByLabel(/Patient's full name/).fill("Test Adult");
    await enquiry.getByLabel(d.patient.dob).fill("1985-04-02");
    await enquiry.getByLabel(/Mobile number/).fill("+919999999997");
    await enquiry.getByRole("button", { name: /Continue/ }).click();
    await enquiry.getByLabel(d.concern.category).selectOption("skin-hair-conditions");
    await enquiry.getByLabel(/Main symptoms/).fill("Recurring skin rash for automated interface test.");
    await enquiry.getByRole("button", { name: /Continue/ }).click();

    await expect(enquiry.getByText("First Consultation", { exact: true })).toBeVisible();
    await expect(enquiry.getByText("₹400", { exact: false }).first()).toBeVisible();
    await expect(enquiry.getByText("Bal Wellness Program", { exact: true })).toHaveCount(0);
    await expect(enquiry.getByText("₹300", { exact: false }).first()).toBeVisible();
    await expect(enquiry.getByText("30 mins", { exact: true }).first()).toBeVisible();
  });
});
