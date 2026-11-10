import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = process.env.UI_TEST_URL || "http://localhost:4173";
const server = process.env.UI_TEST_URL ? null : spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--port", "4173", "--strictPort"], { stdio: "ignore" });
const results = [];
const pageErrors = [];
let browser;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function check(name, run) {
  try {
    await run();
    results.push({ name, passed: true });
    console.log("PASS", name);
  } catch (error) {
    results.push({ name, passed: false, error: error.message });
    console.error("FAIL", name, error.message.slice(0, 220));
  }
}

function inViewport(box, width, height) {
  assert.ok(box && box.x >= 0 && box.y >= 0, "Control starts outside viewport");
  assert.ok(box.x + box.width <= width + 1, "Control extends beyond right edge");
  assert.ok(box.y + box.height <= height + 1, "Control extends below viewport");
}

try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch { /* Wait for preview. */ }
    await wait(250);
  }
  assert.ok(ready, "Preview did not start");
  browser = await chromium.launch();
  const page = await browser.newPage();
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const [width, height] of [[320, 568], [375, 812], [390, 844], [640, 700], [768, 1024], [1024, 768], [1280, 800], [1536, 900]]) {
    await check(`Header controls stay aligned at ${width}px`, async () => {
      await page.setViewportSize({ width, height });
      await page.goto(base, { waitUntil: "domcontentloaded" });
      await page.locator("header nav").waitFor();
      const nav = await page.locator("header nav").boundingBox();
      inViewport(nav, width, height);
      const controls = await page.locator("header nav button:visible, header nav > div:last-child > a:visible").all();
      for (const control of controls) {
        const box = await control.boundingBox();
        inViewport(box, width, height);
        assert.ok(box.x + box.width <= nav.x + nav.width + 1, "Control protrudes beyond navigation");
      }
      if (width < 1024) {
        const toggle = page.locator('button[aria-controls="mobile-navigation"]');
        const icon = await toggle.locator("svg").boundingBox();
        const button = await toggle.boundingBox();
        assert.ok(Math.abs((icon.x + icon.width / 2) - (button.x + button.width / 2)) < 1, "Menu icon is off-center");
      }
    });

    if (width < 1024) {
      await check(`Mobile navigation and language sheet work at ${width}px`, async () => {
        const toggle = page.locator('button[aria-controls="mobile-navigation"]');
        await toggle.click();
        const menu = page.locator("#mobile-navigation");
        await menu.waitFor();
        inViewport(await menu.boundingBox(), width, height);
        const phone = menu.locator('a[href^="tel:"]');
        assert.ok(!/\d/.test(await phone.innerText()), "Mobile menu displays the full phone number");
        assert.match(await phone.getAttribute("href"), /\+919860775010/);
        await menu.getByRole("button").click();
        const sheet = page.getByRole("dialog");
        await sheet.waitFor();
        inViewport(await sheet.boundingBox(), width, height);
        assert.equal(await sheet.locator("button[aria-pressed]").count(), 4);
        await page.keyboard.press("Escape");
        await sheet.waitFor({ state: "detached" });
        assert.equal(await toggle.getAttribute("aria-expanded"), "true", "Closing the language sheet also closed navigation");
        await toggle.click();
      });
    }
  }

  await check("All four languages fit mobile navigation and persist after reload", async () => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    for (const [index, language] of [[1, "hi"], [2, "mr"], [3, "gu"], [0, "en"]]) {
      await page.locator('header button[aria-haspopup="dialog"]').first().click();
      await page.getByRole("dialog").locator("button[aria-pressed]").nth(index).click();
      await page.waitForFunction((lang) => document.documentElement.lang === lang, language);
      inViewport(await page.locator('button[aria-controls="mobile-navigation"]').boundingBox(), 320, 568);
      await page.locator('button[aria-controls="mobile-navigation"]').click();
      inViewport(await page.locator("#mobile-navigation").boundingBox(), 320, 568);
      await page.locator('button[aria-controls="mobile-navigation"]').click();
    }
    await page.reload({ waitUntil: "domcontentloaded" });
    assert.equal(await page.locator("html").getAttribute("lang"), "en");
  });

  await check("Language selector stays fixed when the page is scrolled", async () => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.locator("main").waitFor();
    await page.evaluate(() => window.scrollTo(0, 1600));
    await wait(600);
    const language = page.locator('header button[aria-haspopup="dialog"]').first();
    const box = await language.boundingBox();
    inViewport(box, 375, 812);
    assert.ok(box.y < 100, "Language trigger is not in the fixed header");
    await language.click();
    inViewport(await page.getByRole("dialog").boundingBox(), 375, 812);
    await page.keyboard.press("Escape");
  });

  await check("Drawer actions remain reachable in a short landscape viewport", async () => {
    await page.setViewportSize({ width: 640, height: 360 });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.locator('button[aria-controls="mobile-navigation"]').click();
    const menu = page.locator("#mobile-navigation");
    inViewport(await menu.boundingBox(), 640, 360);
    inViewport(await menu.locator('a[href^="tel:"]').boundingBox(), 640, 360);
    await menu.getByRole("button").click();
    inViewport(await page.getByRole("dialog").boundingBox(), 640, 360);
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
  });

  await check("Every production sitemap route renders in the local preview", async () => {
    const audit = JSON.parse(await readFile("reports/live-seo/audit.json", "utf8"));
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    for (const entry of audit.pages) {
      const path = new URL(entry.url).pathname;
      await page.evaluate((value) => { window.location.hash = value; }, path);
      const expected = entry.h1.join("").replace(/\s+/g, "");
      await page.waitForFunction((text) => document.querySelector("main h1")?.textContent.replace(/\s+/g, "") === text, expected, { timeout: 8000 });
      assert.equal(await page.locator("main h1").count(), 1, path);
    }
  });

  await check("Readiness page uses saved live evidence and does not promise indexing", async () => {
    await page.goto(`${base}/#/seo-readiness`, { waitUntil: "domcontentloaded" });
    await page.getByText("75 of 75 return HTTP 200").waitFor();
    assert.equal(await page.locator('meta[name="robots"]').getAttribute("content"), "noindex, nofollow");
    assert.equal(await page.getByRole("button", { name: "IndexNow Not Configured" }).isDisabled(), true);
    assert.equal(await page.locator('a[href="https://ayurveddoctor.netlify.app/sitemap.xml"]').count(), 1);
    assert.match(await page.locator("main").innerText(), /Actual search listing/);
  });

  await check("Failed enquiry delivery does not display a false confirmation", async () => {
    await page.route("**/api/inquiries", (route) => route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ ok: false }) }));
    await page.goto(`${base}/#/contact`, { waitUntil: "domcontentloaded" });
    await page.locator("#cf-name").fill("Test Parent");
    await page.locator("#cf-phone").fill("9876543210");
    await page.locator("form textarea").fill("Testing error handling without submitting patient data.");
    await page.locator('form button[type="submit"]').click();
    await page.getByRole("alert").waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem("ayur-inquiries")), null);
    assert.equal(await page.getByRole("alert").locator('a[href^="https://wa.me/"]').count(), 1);
  });

  await check("No JavaScript page errors occurred during preview checks", async () => {
    assert.deepEqual(pageErrors, []);
  });

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.locator('button[aria-controls="mobile-navigation"]').click();
  await page.screenshot({ path: "reports/live-seo/fixed-mobile-menu.png" });
  await page.locator("#mobile-navigation button").click();
  await page.screenshot({ path: "reports/live-seo/fixed-mobile-language.png" });
} finally {
  await browser?.close();
  server?.kill("SIGTERM");
  await writeFile("reports/live-seo/ui-checks.json", JSON.stringify({ checkedAt: new Date().toISOString(), results, pageErrors }, null, 2));
}

const failed = results.filter((result) => !result.passed);
console.log(`${results.length - failed.length}/${results.length} UI checks passed`);
process.exitCode = failed.length ? 1 : 0;