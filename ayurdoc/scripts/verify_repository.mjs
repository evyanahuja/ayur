import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const directory = process.argv[2] || ".audit/ayur/ayurdoc";
const server = spawn(process.execPath, [resolve(directory, "node_modules/next/dist/bin/next"), "start", "--port", "4174"], {
  cwd: directory,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  stdio: "ignore",
});
const base = "http://localhost:4174";
const results = [];
const errors = [];
const policyErrors = [];
let browser;

try {
  let ready = false;
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch { /* Wait for Next.js. */ }
    await new Promise((done) => setTimeout(done, 250));
  }
  assert.ok(ready, "Production server did not start");
  const response = await fetch(base);
  const csp = response.headers.get("content-security-policy");
  assert.ok(csp.includes("https://fonts.googleapis.com") && csp.includes("https://fonts.gstatic.com"));
  results.push({ check: "Production CSP permits the configured font hosts", passed: true });
  browser = await chromium.launch();
  const page = await browser.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /violates.*Content Security Policy/i.test(message.text())) policyErrors.push(message.text());
  });

  for (const [width, height] of [[320, 568], [375, 812], [768, 1024], [1024, 768]]) {
    await page.setViewportSize({ width, height });
    await page.goto(base, { waitUntil: "load" });
    await page.locator("main h1").waitFor();
    await page.waitForFunction(() => document.documentElement.lang === "en");
    if (width < 1024) {
      const menuButton = page.locator('button[aria-controls="mobile-navigation"]');
      const box = await menuButton.boundingBox();
      assert.ok(box.x + box.width <= width, `Menu button offscreen at ${width}px`);
      await menuButton.click();
      const menu = page.locator("#mobile-navigation");
      const menuBox = await menu.boundingBox();
      assert.ok(menuBox.y + menuBox.height <= height, `Menu clipped at ${width}px`);
      assert.ok(!/\d/.test(await menu.locator('a[href^="tel:"]').innerText()));
      await menu.getByRole("button").click();
      const dialog = page.getByRole("dialog");
      const dialogBox = await dialog.boundingBox();
      assert.ok(dialogBox.x >= 0 && dialogBox.x + dialogBox.width <= width);
      assert.ok(dialogBox.y >= 0 && dialogBox.y + dialogBox.height <= height);
      await page.keyboard.press("Escape");
      assert.equal(await menuButton.getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
    }
    results.push({ check: `Patched Next.js navigation at ${width}px`, passed: true });
  }

  await page.goto(base + "/seo-readiness", { waitUntil: "load" });
  assert.ok((await page.locator('meta[name="robots"]').getAttribute("content")).includes("noindex"));
  assert.equal(await page.getByRole("button", { name: "IndexNow Not Configured" }).isDisabled(), true);
  results.push({ check: "Production diagnostic remains noindex and cannot submit without a key", passed: true });
  assert.deepEqual(policyErrors, [], "The browser still reports CSP errors");
  assert.deepEqual(errors, [], "The production browser reported a JavaScript/hydration error");
  results.push({ check: "No browser hydration or CSP errors in the patched repository build", passed: true });
  console.log(JSON.stringify(results, null, 2));
} catch (error) {
  results.push({ check: "Production repository runtime", passed: false, error: error.message });
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  await writeFile("reports/live-seo/repository-runtime.json", JSON.stringify({ checkedAt: new Date().toISOString(), results, errors, policyErrors }, null, 2));
}