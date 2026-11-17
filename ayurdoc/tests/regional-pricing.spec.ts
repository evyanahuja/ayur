import { expect, test } from "@playwright/test";

async function openPricing(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.locator("#plans").scrollIntoViewIfNeeded();
}

test("host geo headers select INR for India and USD outside India; unknown returns null", async ({ request }) => {
  const india = await (await request.get("/api/geo", { headers: { "x-nf-country": "IN" } })).json();
  expect(india.currency).toBe("INR");
  const usa = await (await request.get("/api/geo", { headers: { "x-nf-country": "US" } })).json();
  expect(usa.currency).toBe("USD");
  const uae = await (await request.get("/api/geo", { headers: { "cf-ipcountry": "AE" } })).json();
  expect(uae.currency).toBe("USD");
  const unknownCf = await (await request.get("/api/geo", { headers: { "cf-ipcountry": "XX" } })).json();
  expect(unknownCf.currency).toBeNull();
  const unknown = await (await request.get("/api/geo")).json();
  expect(unknown.currency).toBeNull();
});

test("visitors in India automatically see INR pricing and no currency switcher exists", async ({ page }) => {
  await page.route("**/api/geo", (route) => route.fulfill({ json: { country: "IN", currency: "INR" } }));
  await openPricing(page);
  const plans = page.locator("#plans article");
  await expect(plans.nth(0)).toContainText("₹400");
  await expect(plans.nth(1)).toContainText("₹300");
  await expect(page.locator("#plans")).toContainText(/INR/);
  await expect(page.locator("[data-currency-choice]")).toHaveCount(0);
  await page.locator("#book").scrollIntoViewIfNeeded();
  await expect(page.locator("select[name='planInterest'] option[value='first']")).toContainText("₹400");
  await expect(page.locator("[data-currency-choice]")).toHaveCount(0);
});

test("visitors outside India automatically see independently stored USD pricing and no currency switcher exists", async ({ page }) => {
  await page.route("**/api/geo", (route) => route.fulfill({ json: { country: "US", currency: "USD" } }));
  await openPricing(page);
  const plans = page.locator("#plans article");
  await expect(plans.nth(0)).toContainText("$75");
  await expect(plans.nth(1)).toContainText("$50");
  await expect(page.locator("#plans")).toContainText(/USD/);
  await expect(page.locator("[data-currency-choice]")).toHaveCount(0);
  await page.locator("#book").scrollIntoViewIfNeeded();
  await expect(page.locator("select[name='planInterest'] option[value='first']")).toContainText("$75");
  await expect(page.locator("select[name='planInterest'] option[value='followup']")).toContainText("$50");
});

test("when CDN geo headers are absent, India timezone shows INR, non-India timezone shows USD, and UTC defaults to INR", async ({ browser }) => {
  const inContext = await browser.newContext({ timezoneId: "Asia/Kolkata", reducedMotion: "reduce" });
  const inPage = await inContext.newPage();
  await inPage.route("**/api/geo", (route) => route.fulfill({ json: { country: null, currency: null } }));
  await openPricing(inPage);
  await expect(inPage.locator("#plans article").first()).toContainText("₹400");
  await inContext.close();

  const usContext = await browser.newContext({ timezoneId: "America/New_York", reducedMotion: "reduce" });
  const usPage = await usContext.newPage();
  await usPage.route("**/api/geo", (route) => route.fulfill({ json: { country: null, currency: null } }));
  await openPricing(usPage);
  await expect(usPage.locator("#plans article").first()).toContainText("$75");
  await usContext.close();

  const utcContext = await browser.newContext({ timezoneId: "UTC", reducedMotion: "reduce" });
  const utcPage = await utcContext.newPage();
  await utcPage.route("**/api/geo", (route) => route.fulfill({ json: { country: null, currency: null } }));
  await openPricing(utcPage);
  await expect(utcPage.locator("#plans article").first()).toContainText("₹400");
  await utcContext.close();
});
