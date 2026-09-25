import { expect, test } from "@playwright/test";

async function open(page: import("@playwright/test").Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => { await document.fonts.ready; });
  await expect(page.locator(".hero-actions")).toHaveCSS("opacity", "1");
}

test("mobile credential badge stacks cleanly without an oversized empty pill", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page);
  const pill = page.locator(".hero-specialty-pill");
  const chip = page.locator(".hero-specialty-chip");
  const copy = page.locator(".hero-specialty-copy");
  await expect(pill).toBeVisible();
  await expect(chip).toBeVisible();
  await expect(copy).toBeVisible();
  const box = await pill.boundingBox();
  const chipBox = await chip.boundingBox();
  const copyBox = await copy.boundingBox();
  expect(box).toBeTruthy();
  expect(chipBox).toBeTruthy();
  expect(copyBox).toBeTruthy();
  // Stacked vertically: subtitle starts below the credential chip.
  expect(copyBox!.y).toBeGreaterThanOrEqual(chipBox!.y + chipBox!.height - 2);
  // Compact card, not a wide mostly-empty rounded pill.
  expect(box!.height).toBeLessThan(125);
  expect(box!.width).toBeLessThanOrEqual(342);
  expect(chipBox!.width).toBeLessThan(box!.width * 0.72);
  await expect(pill).toHaveCSS("flex-direction", "column");
});

test("desktop credential badge remains a compact horizontal pill", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 900 });
  await open(page);
  await expect(page.locator(".hero-specialty-pill")).toHaveCSS("flex-direction", "row");
  await expect(page.locator(".hero-specialty-chip")).toBeVisible();
});

test("social links normalize handles and render configured networks", async ({ page }) => {
  await open(page);
  // Only the doctor's configured Instagram is set; it must render with a valid URL.
  const links = page.getByRole("link", { name: /instagram|facebook|youtube/i });
  await expect(links).toHaveCount(1);
  const href = await links.first().getAttribute("href");
  expect(href).toBe("https://www.instagram.com/ayurvedoctor");
});
