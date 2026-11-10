// Rendered check: the doctor's name must be spelled consistently in every language.
//   node scripts/verify_name.mjs                     # Vite preview (dist/)
//   AYURDOC_DIR=/path/to/ayur/ayurdoc node scripts/… # built Next.js checkout
// Scans visible text, <title>, meta description, aria-label/alt/title attributes
// and pre-filled WhatsApp messages on all 75 sitemap routes.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const dir = process.env.AYURDOC_DIR ? resolve(process.env.AYURDOC_DIR) : null;
const target = dir ? "next-production" : "vite-preview";
const port = dir ? 4174 : 4173;
const base = `http://localhost:${port}`;
const server = dir
  ? spawn(process.execPath, [resolve(dir, "node_modules/next/dist/bin/next"), "start", "--port", String(port)], { cwd: dir, env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" }, stdio: "ignore" })
  : spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--port", String(port), "--strictPort"], { stdio: "ignore" });

const CANONICAL = { hi: "डॉ. प्रियंका लिखार", mr: "डॉ. प्रियंका लिखार", gu: "ડૉ. પ્રિયંકા લિખાર" };
const FORBIDDEN = {
  hi: ["प्रियांक", "लिखर", "कौमरभृत्य", "About डॉ"],
  mr: ["प्रियांक", "लिखर", "कौमरभृत्य", "यांच्याबद्दल डॉ", "एमडी डॉ"],
  gu: ["લિખર", "ડો.પ્રિયંકા", "ડો. પ્રિયંકા", "કૌમરભૃત્ય", "લખે છે ડૉ"],
};
// Any first-name + surname pair must be exactly the canonical pair.
const PAIR = { hi: /प्रिय\S*\s+लि\S*/g, mr: /प्रिय\S*\s+लि\S*/g, gu: /પ્રિય\S*\s+લિ\S*/g };
const PAIR_OK = { hi: /^प्रियंका लिखार/, mr: /^प्रियंका लिखार/, gu: /^પ્રિયંકા લિખાર/ };

const routes = JSON.parse(await readFile("reports/live-seo/audit.json", "utf8")).pages.map((p) => new URL(p.url).pathname);
const failures = [];
let browser, checkedPages = 0;

async function collectText(page) {
  return page.evaluate(() => {
    const parts = [document.title, document.querySelector('meta[name="description"]')?.content ?? ""];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode()); ) {
      if (!n.parentElement?.closest("script,style,noscript")) parts.push(n.textContent);
    }
    for (const el of document.querySelectorAll("[aria-label],[alt],[title]")) {
      for (const attr of ["aria-label", "alt", "title"]) if (el.getAttribute(attr)) parts.push(el.getAttribute(attr));
    }
    for (const a of document.querySelectorAll('a[href*="wa.me"]')) {
      try { parts.push(decodeURIComponent(a.getAttribute("href"))); } catch { parts.push(a.getAttribute("href")); }
    }
    return parts.join("\n");
  });
}

try {
  for (let i = 0; i < 120; i++) { try { if ((await fetch(base)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 250)); }
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const navNames = {};
  for (const lang of ["mr", "hi", "gu"]) {
    await page.goto(base, { waitUntil: "load" });
    await page.evaluate((l) => localStorage.setItem("balchikitsa-lang", l), lang);
    // The preview reads the saved language on load, so reload once before hash-routing.
    if (!dir) await page.reload({ waitUntil: "load" });
    for (const path of routes) {
      if (dir) await page.goto(base + path, { waitUntil: "load" });
      else await page.evaluate((p) => { window.location.hash = p; }, path);
      await page.waitForFunction((l) => document.documentElement.lang === l, lang);
      // Wait until the nav is rendered in the target script (not for the
      // "right" spelling, so a wrong name fails fast instead of timing out).
      await page.waitForFunction(
        (script) => new RegExp(script).test(document.querySelector("header nav a[aria-label] .font-display")?.textContent ?? ""),
        lang === "gu" ? "[\\u0A80-\\u0AFF]" : "[\\u0900-\\u097F]", { timeout: 10000 }
      );
      await page.locator("main h1").first().waitFor();
      await page.waitForTimeout(dir ? 150 : 60);
      const nav = (await page.locator("header nav a[aria-label] .font-display").first().textContent()).trim();
      navNames[lang] = nav;
      if (nav !== CANONICAL[lang]) failures.push({ lang, path, issue: `nav name "${nav}"` });
      const text = await collectText(page);
      for (const bad of FORBIDDEN[lang]) if (text.includes(bad)) failures.push({ lang, path, issue: `contains "${bad}"` });
      for (const m of text.match(PAIR[lang]) ?? []) if (!PAIR_OK[lang].test(m)) failures.push({ lang, path, issue: `name pair "${m}"` });
      checkedPages++;
    }
  }
  console.log("Navigation name by language:", JSON.stringify(navNames));
  assert.equal(navNames.mr, navNames.hi, "Marathi navigation name differs from Hindi");
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  await writeFile(`reports/live-seo/name-${target}.json`, JSON.stringify({ checkedAt: new Date().toISOString(), target, checkedPages, failures }, null, 2));
}
console.log(`${checkedPages} page renders checked (${target}); ${failures.length} problems`);
for (const f of failures.slice(0, 25)) console.log(" ", f.lang, f.path, "—", f.issue);
process.exitCode = failures.length ? 1 : 0;
