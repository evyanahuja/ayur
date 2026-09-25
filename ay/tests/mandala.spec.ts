import { expect, test, type Page, type Locator } from "@playwright/test";

const SECTIONS = [
  { section: "top", art: "hero" },
  { section: "proof", art: "proof" },
  { section: "doctor", art: "doctor" },
  { section: "specialties", art: "specialties" },
  { section: "method", art: "method" },
  { section: "benefits", art: "benefits" },
  { section: "stories", art: "stories" },
  { section: "plans", art: "plans" },
  { section: "faq", art: "faq" },
  { section: "book", art: "book" },
  { section: "footer", art: "footer" },
];

async function open(page: Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => { await document.fonts.ready; });
  await expect(page.locator(".hero-actions")).toHaveCSS("opacity", "1");
}

async function center(page: Page, locator: Locator, offset = 0) {
  await locator.evaluate((el, extra) => {
    const r = el.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - window.innerHeight / 2 + extra, behavior: "instant" });
  }, offset);
}

/** Compare screenshots with ONLY the mandala layer toggled. This fails if the
 * SVG is in the DOM but hidden beneath a white section, unlike a node-count test. */
async function paintedPixelCount(page: Page, motif: Locator) {
  const clip = await motif.evaluate((el) => {
    const m = el.getBoundingClientRect();
    const s = el.closest("section, footer")!.getBoundingClientRect();
    const left = Math.max(0, m.left, s.left);
    const top = Math.max(115, m.top, s.top);
    const right = Math.min(innerWidth, m.right, s.right);
    const bottom = Math.min(innerHeight, m.bottom, s.bottom);
    return { x: Math.ceil(left), y: Math.ceil(top), width: Math.floor(right - left), height: Math.floor(bottom - top) };
  });
  expect(clip.width, "A substantial part of the half-mandala stays inside the screen").toBeGreaterThan(60);
  expect(clip.height).toBeGreaterThan(100);
  const shown = (await page.screenshot({ clip, animations: "disabled" })).toString("base64");
  await motif.evaluate((el) => { el.style.visibility = "hidden"; });
  const hidden = (await page.screenshot({ clip, animations: "disabled" })).toString("base64");
  await motif.evaluate((el) => { el.style.visibility = ""; });

  return page.evaluate(async ({ shown, hidden }) => {
    const decode = async (base64: string) => {
      const img = new Image();
      img.src = "data:image/png;base64," + base64;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    };
    const [a, b] = await Promise.all([decode(shown), decode(hidden)]);
    let visible = 0;
    for (let i = 0; i < a.length; i += 4) {
      if (Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2])) > 12) visible++;
    }
    return visible;
  }, { shown, hidden });
}

for (const width of [1440, 390]) {
  for (const { section, art } of SECTIONS) {
    test(`${section} has visibly rendered corner artwork at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await open(page);
      const parent = page.locator(`#${section}`);
      const layer = parent.locator(`:scope > [data-mandala-section="${art}"]`);
      await expect(layer).toHaveCount(1);
      await expect(layer).toHaveCSS("z-index", "-1");
      await expect(layer).toHaveCSS("pointer-events", "none");
      await expect(parent).toHaveCSS("isolation", "isolate");
      await expect(layer.locator("[data-scroll-mandala]")).toHaveCount(section === "top" ? 3 : 2);
      await expect(layer.locator('[data-motion="still"]')).toHaveCount(1);
      const bloom = layer.locator(`[data-mandala-id="${art}-bloom"]`);
      await center(page, bloom);
      expect(await paintedPixelCount(page, bloom), "Artwork must produce visible pixels above its section surface").toBeGreaterThan(180);
      expect(await layer.evaluate((el) => el.getBoundingClientRect().width)).toBeLessThanOrEqual(width);
    });
  }
}

test("the theme is distributed across the whole page and uses unique vector IDs", async ({ page }) => {
  await open(page);
  await expect(page.locator("[data-mandala-section]")).toHaveCount(11);
  await expect(page.locator("[data-scroll-mandala]")).toHaveCount(23);
  const ids = await page.locator(".mandala-svg [id]").evaluateAll((elements) => elements.map((el) => el.id));
  expect(new Set(ids).size).toBe(ids.length);
  for (const svg of await page.locator(".mandala-svg").all()) {
    await expect(svg).toHaveAttribute("aria-hidden", "true");
    await expect(svg).toHaveAttribute("focusable", "false");
    await expect(svg).toHaveCSS("pointer-events", "none");
  }
  await expect(page.locator("#top")).toHaveCSS("background-color", "rgb(255, 255, 255)");
});

test("scroll paints and unpaints the mandala while turning leaf rings", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await open(page);
  const motif = page.locator('[data-mandala-id="specialties-bloom"]');
  const paint = () => motif.evaluate((el) => parseFloat(el.style.getPropertyValue("--paint")));
  await center(page, motif);
  await expect.poll(paint).toBeGreaterThan(0.95);
  const initial = await motif.evaluate((el) => el.style.getPropertyValue("--outer-turn"));
  await center(page, motif, 210);
  await expect.poll(paint).toBeLessThan(0.85);
  await expect.poll(() => motif.evaluate((el) => el.style.getPropertyValue("--outer-turn"))).not.toBe(initial);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(paint).toBe(0);
  await expect(motif).toHaveAttribute("data-active", "false");
  await center(page, motif);
  await expect.poll(paint).toBeGreaterThan(0.95);
});

test("hero leaves turn gently at rest; static corner design remains still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await open(page);
  const hero = page.locator('[data-mandala-id="hero-bloom"]');
  const orbit = hero.locator(".mandala-orbit--outer");
  await expect(hero).toHaveAttribute("data-active", "true");
  await expect(orbit).toHaveCSS("animation-play-state", "running");
  const initial = await orbit.evaluate((el) => getComputedStyle(el).transform);
  await expect.poll(() => orbit.evaluate((el) => getComputedStyle(el).transform)).not.toBe(initial);
  const corner = page.locator('[data-mandala-id="hero-corner"] .mandala-orbit--outer');
  await expect(corner).toHaveCSS("animation-name", "none");
  await page.locator("#plans").evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await expect(hero).toHaveAttribute("data-active", "false");
  await expect(orbit).toHaveCSS("animation-play-state", "paused");
});

test("reduced-motion preference stops animation and keeps colourful designs visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await open(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const hero = page.locator('[data-mandala-id="hero-bloom"]');
  await expect(hero).toHaveAttribute("data-reduced", "true");
  await expect(hero.locator(".mandala-orbit--outer")).toHaveCSS("animation-name", "none");
  await expect(hero.locator(".mandala-ring--outer")).toHaveCSS("transform", "none");
  await expect(hero.locator(".mandala-colour").first()).toHaveCSS("opacity", "0.78");
});

test("theme layers do not intercept booking links, FAQ buttons, or form input", async ({ page }) => {
  await open(page);
  await page.locator('.hero-actions a[href="#book"]').click();
  await expect(page).toHaveURL(/#book$/);
  await page.getByLabel("Parent's name", { exact: false }).fill("Layout test parent");
  await expect(page.getByLabel("Parent's name", { exact: false })).toHaveValue("Layout test parent");
  const question = page.locator('#faq button[aria-controls="faq-panel-1"]');
  await question.click();
  await expect(question).toHaveAttribute("aria-expanded", "true");
});
