import { test, expect } from "@playwright/test";

/* Focused regression coverage for the frosted-glass hero headline and the UPI
   payment QR / manual-verification / manual-Meet flow. Runs against a production
   preview with sandbox-only UPI + admin configuration (see docs/VOPD.md). */

const ADMIN_PASSWORD = process.env.VOPD_ADMIN_PASSWORD ?? "";

function clinicDate(offsetDays: number): string {
  const target = new Date(Date.now() + offsetDays * 86_400_000);
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).format(target);
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  return weekday === 0 ? clinicDate(offsetDays + 1) : date;
}

test("hero headline keeps its three authored lines inside the frosted panel", async ({ page }) => {
  for (const width of [1440, 1024, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.evaluate(async () => { await document.fonts.ready; });
    const masks = page.locator("h1 .line-mask");
    await expect(masks).toHaveCount(3);
    const ratios = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      if (!h1) return [];
      const lineHeight = parseFloat(getComputedStyle(h1).lineHeight);
      return Array.from(h1.querySelectorAll(".line-mask")).map(
        (mask) => (mask as HTMLElement).getBoundingClientRect().height / lineHeight
      );
    });
    expect(ratios).toHaveLength(3);
    for (const ratio of ratios) {
      // A wrapped line would measure ~2x the line height (plus mask padding).
      expect(ratio, `headline line wrapped at ${width}px`).toBeLessThan(1.45);
    }
  }
});

test("UPI QR is server-generated; payment stays pending until admin verifies; manual Meet confirms", async ({ request }) => {
  test.skip(!ADMIN_PASSWORD, "Sandbox admin password required (VOPD_ADMIN_PASSWORD).");

  const configResponse = await request.get("/api/vopd/config");
  const configBody = await configResponse.json();
  expect(configBody.config?.upi?.configured, `config status=${configResponse.status()}`).toBe(true);

  const date = clinicDate(28);
  const availability = await (await request.get(`/api/vopd/availability?date=${date}&plan=first`)).json();
  const slot = availability.slots?.[0]?.startIso as string | undefined;
  expect(slot, "a free first-consultation slot must exist").toBeTruthy();

  const createdRes = await request.post("/api/vopd/bookings", {
    data: {
      patientKind: "adult",
      gender: "Male",
      patientName: "QR Flow Test",
      ageOrDob: "1988-02-10",
      phone: "+919999999971",
      email: "qr-flow-test@example.invalid",
      concernCategory: "digestive-disorders",
      symptoms: "Automated verification of the UPI QR and verification flow.",
      planId: "first",
      currency: "INR",
      slotStartIso: slot,
      consent: true,
    },
  });
  expect(createdRes.status()).toBe(201);
  const created = await createdRes.json();
  const reference = created.reference as string;
  expect(reference).toMatch(/^VOPD-/);
  console.log(`TEST_BOOKING_REFERENCE=${reference}`);

  // QR is generated server-side with the stored amount and reference.
  const qr = await request.get(`/api/vopd/bookings/${reference}/upi-qr`);
  expect(qr.status()).toBe(200);
  expect(qr.headers()["content-type"]).toContain("image/svg+xml");
  expect(await qr.text()).toContain("<svg");
  expect((await request.get("/api/vopd/bookings/VOPD-ZZZZZZZZ/upi-qr")).status()).toBe(404);

  // A file that merely claims image/png must be rejected by signature sniffing.
  const fake = await request.post(`/api/vopd/bookings/${reference}/payment`, {
    multipart: {
      payerName: "QR Flow Test",
      upiReference: "123456789012",
      screenshot: { name: "fake.png", mimeType: "image/png", buffer: Buffer.from("this is not an image") },
    },
  });
  expect(fake.status()).toBe(400);

  // Valid UTR submission keeps the booking pending verification.
  const paid = await request.post(`/api/vopd/bookings/${reference}/payment`, {
    multipart: { payerName: "QR Flow Test", upiReference: "123456789012" },
  });
  expect(paid.status()).toBe(200);
  expect((await paid.json()).status).toBe("PAYMENT_VERIFICATION_PENDING");

  // Public status never exposes the UTR or contact details.
  const publicView = await (await request.get(`/api/vopd/bookings/${reference}`)).json();
  expect(publicView.booking.upiReference).toBeUndefined();
  expect(publicView.booking.phone).toBeUndefined();

  // Admin actions are protected.
  expect((await request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: { action: "verify" } })).status()).toBe(401);

  const login = await request.post("/api/admin/vopd/login", { data: { password: ADMIN_PASSWORD } });
  expect(login.status()).toBe(200);

  // Google is not configured in the sandbox: verification must NOT auto-confirm.
  const verified = await (await request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: { action: "verify" } })).json();
  expect(verified.booking.status).toBe("PAYMENT_VERIFIED");
  expect(verified.outcome.calendar).toBe("NOT_CONFIGURED");

  // Manual Meet fallback confirms the appointment and stores the link.
  const meetUrl = "https://meet.google.com/abc-defg-hij";
  const confirmed = await (await request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: { action: "set-meet", meetUrl } })).json();
  expect(confirmed.booking.status).toBe("CONFIRMED");
  expect(confirmed.booking.meetUrl).toBe(meetUrl);
  const publicAfter = await (await request.get(`/api/vopd/bookings/${reference}`)).json();
  expect(publicAfter.booking.meetUrl).toBe(meetUrl);

  // Duplicate verification is refused.
  expect((await request.post(`/api/admin/vopd/bookings/${reference}/action`, { data: { action: "verify" } })).status()).toBe(409);
});

test("payment step renders the scannable UPI QR with the demo warning", async ({ page }) => {
  await page.goto("/contact", { waitUntil: "networkidle" });
  const enquiry = page.locator("[data-patient-enquiry]");
  await enquiry.getByRole("radio", { name: /VOPD/ }).click();
  await enquiry.getByRole("button", { name: "Adult", exact: true }).click();
  // The required-field asterisk is part of the label for adults, so target the
  // control itself rather than an exact label-text match.
  await enquiry.locator('select[name="childGender"], select[id*="gender"]').first().selectOption("Male");
  await enquiry.getByLabel("Patient's full name *").fill("QR UI Test");
  await enquiry.getByLabel("Date of birth *").fill("1988-02-10");
  await enquiry.getByLabel("Mobile number *").fill("+919999999972");
  await enquiry.getByRole("button", { name: /Continue/ }).click();
  await enquiry.getByLabel("Consultation category *").selectOption("general");
  await enquiry.getByLabel("Main symptoms *").fill("Persistent acidity for interface verification.");
  await enquiry.getByRole("button", { name: /Continue/ }).click();
  await enquiry.getByRole("button", { name: /Continue/ }).click(); // default First Consultation plan
  const slotButton = enquiry.getByRole("button", { name: /^\d{1,2}:\d{2} (AM|PM)$/ }).first();
  await expect(slotButton).toBeVisible({ timeout: 20_000 });
  await slotButton.click();
  await enquiry.getByRole("button", { name: /Continue/ }).click();
  await enquiry.locator('input[type="checkbox"]').last().check();
  await enquiry.getByRole("button", { name: /Reserve Slot/ }).click();

  const qr = enquiry.locator('img[alt*="UPI QR code"]');
  await expect(qr).toBeVisible({ timeout: 20_000 });
  await expect(enquiry.getByText(/Test configuration/)).toBeVisible();
  const reference = (await enquiry.locator("dd").first().innerText()).trim();
  expect(reference).toMatch(/^VOPD-/);
  console.log(`TEST_BOOKING_REFERENCE_UI=${reference}`);
});
