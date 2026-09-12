import { expect, test, type Page, type Locator } from "@playwright/test";

type Box = { x: number; y: number; width: number; height: number };

function overlaps(a: Box, b: Box) {
  return (
    Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 1 &&
    Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 1
  );
}

async function box(locator: Locator): Promise<Box> {
  const result = await locator.boundingBox();
  expect(result).not.toBeNull();
  return result!;
}

async function openPage(page: Page) {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(async () => { await document.fonts.ready; });
  // Ensure React has hydrated rather than measuring only server HTML.
  await expect(page.locator(".hero-actions")).toHaveCSS("opacity", "1");
}

async function checkCards(page: Page, section: "top" | "doctor", count: number) {
  const group = page.locator(`#${section} .credential-grid`);
  const cards = group.locator(".credential-card");
  await expect(cards).toHaveCount(count);
  await group.scrollIntoViewIfNeeded();
  const groupBox = await box(group);
  const portrait = await box(page.locator(`#${section} [data-portrait-frame]`));
  expect(groupBox.y - (portrait.y + portrait.height)).toBeGreaterThanOrEqual(15);
  const boxes: Box[] = [];

  for (const card of await cards.all()) {
    await expect(card).toBeVisible();
    const rect = await box(card);
    expect(rect.width).toBeGreaterThan(100);
    expect(rect.x).toBeGreaterThanOrEqual(groupBox.x - 1);
    expect(rect.x + rect.width).toBeLessThanOrEqual(groupBox.x + groupBox.width + 1);
    expect(overlaps(rect, portrait), "Card must never overlap its portrait/caption").toBe(false);

    const styles = await card.evaluate((el) => {
      const style = getComputedStyle(el);
      return { position: style.position, transform: style.transform, animation: style.animationName };
    });
    expect(styles.position).toBe("relative");
    expect(styles.transform).toBe("none");
    expect(styles.animation).toBe("none");

    for (const text of await card.locator(".credential-card__title, .credential-card__subtitle").all()) {
      const dimensions = await text.evaluate((el) => ({
        clientWidth: el.clientWidth,
        scrollWidth: el.scrollWidth,
        whiteSpace: getComputedStyle(el).whiteSpace,
        textOverflow: getComputedStyle(el).textOverflow,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
      expect(dimensions.whiteSpace).toBe("normal");
      expect(dimensions.textOverflow).not.toBe("ellipsis");
      const textBox = await box(text);
      expect(textBox.y).toBeGreaterThanOrEqual(rect.y + 5);
      expect(textBox.y + textBox.height).toBeLessThanOrEqual(rect.y + rect.height - 5);
    }
    boxes.push(rect);
  }

  for (let i = 0; i < boxes.length; i++) {
    expect(Math.abs(boxes[i].width - boxes[0].width), "All cards in a set have equal widths").toBeLessThan(1);
    expect(Math.abs(boxes[i].height - boxes[0].height), "All cards in a set have equal heights").toBeLessThan(1);
    for (let j = i + 1; j < boxes.length; j++) {
      expect(overlaps(boxes[i], boxes[j]), `Cards ${i + 1} and ${j + 1} must not intersect`).toBe(false);
    }
  }
  expect(Math.abs(boxes[0].y - boxes[1].y)).toBeLessThan(1);
  expect(boxes[1].x - (boxes[0].x + boxes[0].width)).toBeGreaterThanOrEqual(11);
}

for (const width of [320, 375, 390, 430, 640, 768, 820, 1024, 1280, 1440, 1920]) {
  test(`matching buttons and non-overlapping readable cards at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await openPage(page);
    const buttons = page.locator(".hero-actions a");
    await expect(buttons).toHaveCount(2);
    const first = await box(buttons.nth(0));
    const second = await box(buttons.nth(1));
    expect(first.height).toBe(64);
    expect(second.height).toBe(64);
    expect(Math.abs(first.width - second.width)).toBeLessThan(1);
    expect(overlaps(first, second)).toBe(false);
    for (const button of await buttons.all()) {
      await expect(button.locator(".hero-action__icon")).toHaveCSS("width", "36px");
      await expect(button.locator(".hero-action__icon")).toHaveCSS("height", "36px");
      const rect = await box(button);
      const label = await box(button.locator(".hero-action__label"));
      expect(label.y).toBeGreaterThanOrEqual(rect.y);
      expect(label.y + label.height).toBeLessThanOrEqual(rect.y + rect.height);
      const hasOverflow = await button.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
      expect(hasOverflow).toBe(false);
    }
    await checkCards(page, "top", 3);
    await checkCards(page, "doctor", 2);
    expect(errors).toEqual([]);
  });
}

test("gold border does not override fixed or absolute utility positioning", async ({ page }) => {
  await openPage(page);
  for (const position of ["absolute", "fixed"]) {
    const computed = await page.evaluate((value) => {
      const probe = document.createElement("div");
      probe.className = `gold-hairline ${value}`;
      document.body.appendChild(probe);
      const result = getComputedStyle(probe).position;
      probe.remove();
      return result;
    }, position);
    expect(computed).toBe(position);
  }
});

test("longer edited qualifications and languages stay readable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 1000 });
  await openPage(page);
  await page.locator('[data-credential="qualification"] .credential-card__title').evaluate((el) => {
    el.textContent = "MD · Kaumarbhritya (Balarog) Specialist";
  });
  await page.locator('[data-credential="languages"] .credential-card__subtitle').evaluate((el) => {
    el.textContent = "Hindi • Marathi • English • Gujarati";
  });
  await checkCards(page, "top", 3);
  await checkCards(page, "doctor", 2);
});

test("hero action links still navigate to booking and the method section", async ({ page }) => {
  await openPage(page);
  await page.locator('.hero-actions a[href="#book"]').click();
  await expect(page).toHaveURL(/#book$/);
  await expect(page.getByRole("form", { name: "Patient enquiry form" })).toBeVisible();
  await page.goto("/");
  await expect(page.locator(".hero-actions")).toHaveCSS("opacity", "1");
  await page.locator('.hero-actions a[href="#method"]').click();
  await expect(page).toHaveURL(/#method$/);
});
