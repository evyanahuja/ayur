import { expect, test } from "@playwright/test";

async function openPricing(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.locator("#plans").scrollIntoViewIfNeeded();
}

test("visitors in India see INR pricing and INR booking options", async ({ browser }) => {
  const context = await browser.newContext({ locale: "en-IN", timezoneId: "Asia/Kolkata", reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1366, height: 900 });
  await openPricing(page);
  const plans = page.locator("#plans article");
  await expect(plans.nth(0)).toContainText("₹400");
  await expect(plans.nth(1)).toContainText("₹4,999");
  await expect(plans.nth(2)).toContainText("₹300");
  await expect(page.locator("#plans")).toContainText(/INR/);
  await page.locator("#book").scrollIntoViewIfNeeded();
  await expect(page.locator("#plan option[value='first']")).toContainText("₹400");
  await context.close();
});

test("visitors outside India see USD pricing and USD booking options", async ({ browser }) => {
  const context = await browser.newContext({ locale: "en-US", timezoneId: "America/New_York", reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1366, height: 900 });
  await openPricing(page);
  const plans = page.locator("#plans article");
  await expect(plans.nth(0)).toContainText("$75");
  await expect(plans.nth(1)).toContainText("$500");
  await expect(plans.nth(2)).toContainText("$50");
  await expect(page.locator("#plans")).toContainText(/USD/);
  await page.locator("#book").scrollIntoViewIfNeeded();
  await expect(page.locator("#plan option[value='first']")).toContainText("$75");
  await expect(page.locator("#plan option[value='wellness']")).toContainText("$500");
  await expect(page.locator("#plan option[value='followup']")).toContainText("$50");
  await context.close();
});

test("Gulf timezone visitors also see USD pricing", async ({ browser }) => {
  const context = await browser.newContext({ locale: "en-AE", timezoneId: "Asia/Dubai", reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1366, height: 900 });
  await openPricing(page);
  await expect(page.locator("#plans article").nth(1)).toContainText("$500");
  await context.close();
});
