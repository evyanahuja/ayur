import { test, expect } from "@playwright/test";
import { EXPANSION } from "@/i18n/expansion";
import { CATEGORY_TRANSLATIONS } from "@/i18n/categoriesTranslations";
import { NEW_TREATMENT_TRANSLATIONS } from "@/i18n/newTreatmentsTranslations";
import { NEW_CONDITIONS_HI } from "@/i18n/newConditionsHi";
import { NEW_CONDITIONS_MR } from "@/i18n/newConditionsMr";
import { NEW_CONDITIONS_GU } from "@/i18n/newConditionsGu";
import { HEALTH_CATEGORIES } from "@/content/categories";
import { ALL_CONDITIONS } from "@/content/registry";
import { TREATMENTS } from "@/content/treatments";
import type { Language } from "@/i18n/config";

// Targeted release checks. All submissions are intercepted: these tests never create
// patient enquiries in PostgreSQL or send a clinic email. Use a running production preview.
const nativeNames: Record<Language, string> = { en: "English", hi: "हिन्दी", mr: "मराठी", gu: "ગુજરાતી" };
const conditionTranslations = { hi: NEW_CONDITIONS_HI, mr: NEW_CONDITIONS_MR, gu: NEW_CONDITIONS_GU };

for (const lang of ["en", "hi", "gu", "mr"] as const) {
  test(`four-language release: ${lang} navigation, pages and consent`, async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1280, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const ui = EXPANSION[lang];

    await page.goto("/");
    await page.locator('header button[aria-haspopup="listbox"]').click();
    await page.getByRole("option").filter({ hasText: nativeNames[lang] }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("main h1")).toContainText(ui.hero.line1);
    await expect(page.locator("#concerns-h")).toHaveText(ui.home.concernsTitle);
    await expect(page.locator("#treat-h")).toHaveText(ui.home.treatTitle);
    await expect(page.locator("#faq-home-h")).toHaveText(ui.home.faqTitle);
    await expect(page.locator('input[name="consent"]')).toHaveAttribute("required", "");

    await page.goto("/health-concerns");
    await expect(page.locator("main h1")).toHaveText(ui.categories.hubH1);
    const category = lang === "en"
      ? HEALTH_CATEGORIES.find((p) => p.slug === "womens-health")!
      : CATEGORY_TRANSLATIONS[lang]["womens-health"];
    await page.goto("/health-concerns/womens-health");
    await expect(page.locator("main h1")).toHaveText(category.title + ui.categories.catH1Suffix);
    await expect(page.locator("#intro-h + p")).toHaveText(category.intro);

    const therapy = lang === "en"
      ? TREATMENTS.find((p) => p.slug === "rasayana")!
      : NEW_TREATMENT_TRANSLATIONS[lang].rasayana;
    await page.goto("/treatments/rasayana");
    await expect(page.locator("main h1")).toHaveText(therapy.h1);

    const condition = lang === "en"
      ? ALL_CONDITIONS.find((p) => p.slug === "acidity-gerd")!
      : conditionTranslations[lang]["acidity-gerd"];
    await page.goto("/conditions/acidity-gerd");
    await expect(page.locator("main h1")).toHaveText(condition.h1);
    await expect(page.locator("main")).toContainText(ui.conversion.draftStrong);
    await expect(page.locator("main")).toContainText(ui.conversion.pendingReview);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator("#what-is")).toContainText(condition.whatIs[0]);
    await expect(page.locator("#red-flags")).toContainText(condition.redFlags[0]);

    await page.goto("/contact");
    await expect(page.locator('[data-patient-enquiry]')).toContainText(ui.form.consentText);
    await page.locator('input[name="parentName"]').fill("Release Test");
    await page.locator('input[name="phone"]').fill("+919999999999");
    await page.locator('input[name="childName"]').fill("Test Patient");
    await page.locator('input[name="childAge"]').fill("30");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('[data-patient-enquiry]')).toContainText(ui.form.consentError);

    await page.route("**/api/inquiries", async (route) => {
      expect(route.request().postDataJSON().consent).toBe(true);
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, ref: "MOCK-RELEASE-TEST", dbSaved: true, emailSent: true }),
      });
    });
    await page.locator('input[name="consent"]').check();
    await page.locator('button[type="submit"]').click();
    await expect(page.locator('[data-patient-enquiry]')).toContainText(ui.form.nonConfirmNote);
    expect(errors, "Uncaught browser errors").toEqual([]);
  });
}

test("mobile Gujarati language switch and all-age hub navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator('header button[aria-haspopup="dialog"]').first().click();
  await page.getByRole("dialog").getByRole("button").filter({ hasText: "ગુજરાતી" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "gu");
  await expect(page.locator("main h1")).toContainText(EXPANSION.gu.hero.line1);
  await page.locator('button[aria-controls="mobile-navigation"]').click();
  await page.locator('#mobile-navigation a[href="/health-concerns"]').click();
  await expect(page).toHaveURL(/\/health-concerns$/);
  await expect(page.locator("main h1")).toHaveText(EXPANSION.gu.categories.hubH1);
});

test("draft SEO is excluded from sitemap and reviewer schema", async ({ request }) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBe(true);
  const xml = await sitemapResponse.text();
  expect(xml).toContain("/health-concerns/womens-health");
  expect(xml).toContain("/treatments/rasayana");
  for (const draft of ALL_CONDITIONS.filter((p) => p.status === "draft")) {
    expect(xml).not.toContain(`/conditions/${draft.slug}`);
  }
  const draftResponse = await request.get("/conditions/acidity-gerd");
  expect(draftResponse.status()).toBe(200);
  const html = await draftResponse.text();
  expect(html).toContain("noindex");
  expect(html).toContain("Draft for physician review");
  expect(html).not.toContain('"@type":["MedicalWebPage"');
  expect(html).toContain(EXPANSION.en.conversion.doctorHelpTitle);
});

test("inquiry endpoint rejects missing consent before delivery", async ({ request }) => {
  const response = await request.post("/api/inquiries", { data: {} });
  expect(response.status()).toBe(400);
  expect((await response.json()).errors.consent).toBeTruthy();
});
