import { expect, test, type Page } from "@playwright/test";

const languages = ["en", "hi", "mr", "gu"] as const;

async function openDoctor(page: Page, language: (typeof languages)[number]) {
  await page.addInitScript((lang) => window.localStorage.setItem("balchikitsa-lang", lang), language);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => { await document.fonts.ready; });
  await expect(page.locator("html")).toHaveAttribute("lang", language);
  await page.locator("#doctor").scrollIntoViewIfNeeded();
}

function measure(page: Page) {
  return page.evaluate(() => {
    const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
    const frame = rect("#doctor [data-portrait-frame]");
    const photo = rect("#doctor .doctor-photo");
    const cta = rect("#doctor [data-doctor-cta]");
    const text = document.querySelector("#doctor h2")!.closest("div.min-w-0")!.getBoundingClientRect();
    const promises = rect("#doctor ul[aria-label]:not(.credential-grid)");
    return {
      leftTop: frame.top, leftBottom: cta.bottom, leftRight: cta.right,
      rightTop: text.top, rightBottom: promises.bottom, rightLeft: text.left,
      photoWidth: photo.width, photoHeight: photo.height,
      ctaTop: cta.top, promisesBottom: promises.bottom,
      overflowX: document.documentElement.scrollWidth > window.innerWidth,
    };
  });
}

for (const language of languages) {
  for (const width of [1024, 1267, 1440, 1920]) {
    test(`Meet your doctor columns are level at ${width}px in ${language}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await openDoctor(page, language);
      const m = await measure(page);
      // Side by side, starting and ending on the same lines.
      expect(m.leftRight).toBeLessThan(m.rightLeft);
      expect(Math.abs(m.leftTop - m.rightTop)).toBeLessThanOrEqual(1);
      expect(Math.abs(m.leftBottom - m.rightBottom)).toBeLessThanOrEqual(1);
      // The photo fills the spare height without becoming a thin strip.
      expect(m.photoHeight).toBeGreaterThanOrEqual(440);
      expect(m.photoWidth / m.photoHeight).toBeGreaterThanOrEqual(0.55);
      expect(m.overflowX).toBe(false);
      // Exactly one consultation CTA, in the left column under the photo.
      const cta = page.locator('#doctor a[href="#book"]');
      await expect(cta).toHaveCount(1);
      await expect(cta).toBeVisible();
      const box = (await cta.boundingBox())!;
      expect(box.x + box.width).toBeLessThanOrEqual(m.rightLeft);
    });
  }

  for (const width of [390, 768]) {
    test(`Meet your doctor stacks photo, text, then CTA at ${width}px in ${language}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await openDoctor(page, language);
      const m = await measure(page);
      expect(m.rightTop).toBeGreaterThan(m.leftTop + m.photoHeight);
      expect(m.ctaTop).toBeGreaterThanOrEqual(m.promisesBottom);
      expect(m.overflowX).toBe(false);
      const cta = page.locator('#doctor a[href="#book"]');
      await expect(cta).toHaveCount(1);
      expect((await cta.boundingBox())!.height).toBeGreaterThanOrEqual(48);
    });
  }
}

test("Meet your doctor CTA still opens the booking section", async ({ page }) => {
  await page.setViewportSize({ width: 1267, height: 800 });
  await openDoctor(page, "en");
  await page.locator('#doctor a[href="#book"]').click();
  await expect(page).toHaveURL(/#book$/);
  await expect(page.locator("#book").getByRole("form", { name: "Book a Consultation" })).toBeVisible();
});
