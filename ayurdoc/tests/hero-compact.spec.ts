import { expect, test, type Page } from "@playwright/test";

const languages = ["en", "hi", "mr", "gu"] as const;
type Language = (typeof languages)[number];

async function openHero(page: Page, language: Language) {
  await page.addInitScript((lang) => {
    window.localStorage.setItem("balchikitsa-lang", lang);
  }, language);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => { await document.fonts.ready; });
  await expect(page.locator("html")).toHaveAttribute("lang", language);
  await expect(page.locator(".hero-actions")).toHaveCSS("opacity", "1");
  await expect(page.locator(".hero-registration")).toHaveCSS("opacity", "1");
}

for (const language of languages) {
  for (const viewport of [
    { width: 1024, height: 768 },
    { width: 1198, height: 716 },
    { width: 1280, height: 720 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
  ]) {
    test(`complete hero fits ${viewport.width}×${viewport.height} in ${language}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openHero(page, language);
      const hero = page.locator("#top");
      await expect(hero.locator(".credential-card")).toHaveCount(2);
      await expect(hero.locator('[data-credential="qualification"]')).toHaveCount(0);
      await expect(hero.locator("dl")).toHaveCount(0);
      await expect(hero.locator(".hero-registration")).toContainText("63934");
      await expect(hero.locator('a[href="#book"]')).toBeVisible();
      await expect(hero.locator('a[href="#method"]')).toBeVisible();

      const metrics = await page.evaluate(() => {
        const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
        const cards = Array.from(document.querySelectorAll("#top .credential-card"), (card) => {
          const r = card.getBoundingClientRect();
          return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
        });
        return {
          bottom: rect("#top").bottom,
          copyTop: rect(".hero-copy").top,
          portraitTop: rect('#top [data-portrait-frame="hero"]').top,
          headerBottom: rect("header nav").bottom,
          scrollY: window.scrollY,
          documentWidth: document.documentElement.scrollWidth,
          cards,
        };
      });
      expect(metrics.scrollY).toBe(0);
      expect(metrics.bottom, "The whole hero should fit without scrolling or clipping").toBeLessThanOrEqual(viewport.height + 1);
      expect(Math.min(metrics.copyTop, metrics.portraitTop)).toBeGreaterThanOrEqual(metrics.headerBottom + 8);
      expect(metrics.documentWidth).toBeLessThanOrEqual(viewport.width);
      expect(Math.abs(metrics.cards[0].top - metrics.cards[1].top)).toBeLessThan(1);
      expect(metrics.cards[0].right).toBeLessThan(metrics.cards[1].left);
      for (const card of metrics.cards) expect(card.bottom).toBeLessThanOrEqual(viewport.height);
    });
  }

  for (const width of [320, 390]) {
    test(`mobile hero stays readable without horizontal overflow at ${width}px in ${language}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await openHero(page, language);
      await expect(page.locator("#top .credential-card")).toHaveCount(2);
      await expect(page.locator("#top dl")).toHaveCount(0);
      const geometry = await page.evaluate(() => {
        const hero = document.querySelector("#top")!.getBoundingClientRect();
        const elements = Array.from(document.querySelectorAll("#top .hero-action, #top .credential-card, #top .hero-registration"));
        return {
          documentWidth: document.documentElement.scrollWidth,
          heroBottom: hero.bottom,
          elements: elements.map((el) => {
            const r = el.getBoundingClientRect();
            return { left: r.left, right: r.right, bottom: r.bottom, clientWidth: el.clientWidth, scrollWidth: el.scrollWidth };
          }),
        };
      });
      expect(geometry.documentWidth).toBeLessThanOrEqual(width);
      for (const element of geometry.elements) {
        expect(element.left).toBeGreaterThanOrEqual(0);
        expect(element.right).toBeLessThanOrEqual(width);
        expect(element.scrollWidth).toBeLessThanOrEqual(element.clientWidth + 1);
        expect(element.bottom).toBeLessThanOrEqual(geometry.heroBottom);
      }
      expect(errors).toEqual([]);
    });
  }
}
