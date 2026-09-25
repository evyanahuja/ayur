import { expect, test, type Page } from "@playwright/test";

type Rect = { left: number; right: number; top: number; bottom: number };

async function openLanguage(page: Page, language: "en" | "hi" | "mr" | "gu") {
  await page.addInitScript((lang) => localStorage.setItem("balchikitsa-lang", lang), language);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => { await document.fonts.ready; });
  await expect(page.locator(".hero-actions")).toHaveCSS("opacity", "1");
}

function intersect(a: Rect, b: Rect) {
  return Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
    Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
}

for (const language of ["en", "hi", "mr", "gu"] as const) {
  for (const width of [390, 1366]) {
    test(`hero copy has a protected reading area in ${language} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await openLanguage(page, language);

      const metrics = await page.evaluate(() => {
        const rect = (selector: string): Rect => {
          const r = document.querySelector(selector)!.getBoundingClientRect();
          return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
        };
        const copy = document.querySelector(".hero-copy")!;
        const h1 = document.querySelector("#top h1")!;
        const veil = getComputedStyle(copy, "::before");
        return {
          copy: rect(".hero-copy"),
          h1: rect("#top h1"),
          left: rect('[data-mandala-id="hero-bloom"]'),
          right: rect('[data-mandala-id="hero-orbit"]'),
          veil: { content: veil.content, background: veil.backgroundImage, zIndex: veil.zIndex },
          color: getComputedStyle(h1).color,
          language: document.documentElement.lang,
        };
      });

      expect(metrics.language).toBe(language);
      expect(metrics.color).toBe("rgb(5, 20, 16)");
      expect(metrics.veil.content).toBe('""');
      expect(metrics.veil.background).toContain("linear-gradient");
      expect(metrics.veil.zIndex).toBe("-1");

      if (width > 700) {
        // On laptop/desktop, neither main mandala intrudes into the copy column.
        expect(intersect(metrics.h1, metrics.left)).toBe(0);
        expect(intersect(metrics.h1, metrics.right)).toBe(0);
      } else {
        // On mobile the right ornament starts below the copy / CTA stack,
        // while the left half-mandala stops precisely at the text gutter.
        expect(metrics.right.top).toBeGreaterThanOrEqual(metrics.copy.bottom - 1);
        expect(intersect(metrics.h1, metrics.left)).toBe(0);
      }
    });
  }
}
