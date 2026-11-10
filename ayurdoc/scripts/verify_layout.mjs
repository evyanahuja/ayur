// Layout regression checks for the nav brand and the home "Explore by need" grid.
//
//   node scripts/verify_layout.mjs                      # tests the Vite preview (dist/)
//   AYURDOC_DIR=/path/to/ayur/ayurdoc node scripts/...   # tests a built Next.js checkout
//
// Clipping detector: screenshot thin bands just above/below a label, switch the
// label and its ancestors to overflow:visible, screenshot again. Any pixel change
// means glyph ink was being cut off. A positive control (line-height 0.8) proves
// the detector can see clipping before its "no clipping" results are trusted.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const dir = process.env.AYURDOC_DIR ? resolve(process.env.AYURDOC_DIR) : null;
const target = dir ? "next-production" : "vite-preview";
const port = dir ? 4174 : 4173;
const base = `http://localhost:${port}`;
const server = dir
  ? spawn(process.execPath, [resolve(dir, "node_modules/next/dist/bin/next"), "start", "--port", String(port)], {
      cwd: dir,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: "ignore",
    })
  : spawn(process.execPath, ["node_modules/vite/bin/vite.js", "preview", "--port", String(port), "--strictPort"], { stdio: "ignore" });

const NAME = "header nav a[aria-label] .font-display";
const CREDS = "header nav a[aria-label] .font-display + span";
const EXPECTED_SIXTH = "/conditions/speech-delay-in-children";
const results = [];
let browser;

function record(name, fn) {
  return fn().then(
    () => { results.push({ name, passed: true }); console.log("PASS", name); },
    (error) => { results.push({ name, passed: false, error: error.message }); console.error("FAIL", name, "—", error.message.split("\n")[0]); }
  );
}

async function setLanguage(page, lang) {
  await page.goto(base, { waitUntil: "load" });
  await page.evaluate((l) => localStorage.setItem("balchikitsa-lang", l), lang);
  await page.reload({ waitUntil: "load" });
  await page.waitForFunction((l) => document.documentElement.lang === l, lang);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
}

async function freezeBackground(page, on) {
  await page.evaluate((enable) => {
    document.getElementById("layout-freeze")?.remove();
    if (!enable) return;
    const s = document.createElement("style");
    s.id = "layout-freeze";
    s.textContent = "*,*::before,*::after{animation:none!important;transition:none!important} main,footer{visibility:hidden!important}";
    document.head.append(s);
  }, on);
}

async function inkClipping(page, selector) {
  const loc = page.locator(selector).first();
  const box = await loc.boundingBox();
  assert.ok(box, `${selector} is not rendered`);
  const pad = 8;
  const bands = [
    { x: box.x, y: box.y - pad, width: box.width, height: pad },
    { x: box.x, y: box.y + box.height, width: box.width, height: pad },
  ];
  const shoot = () => Promise.all(bands.map((clip) => page.screenshot({ clip, animations: "disabled" })));
  const before = await shoot();
  await loc.evaluate((el) => {
    const stop = el.closest("nav");
    for (let n = el; n && n !== stop; n = n.parentElement) {
      n.setAttribute("data-prev-style", n.getAttribute("style") ?? "__none__");
      n.style.overflow = "visible";
      n.style.textOverflow = "clip";
    }
  });
  const moved = await loc.boundingBox();
  const after = await shoot();
  await loc.evaluate((el) => {
    const stop = el.closest("nav");
    for (let n = el; n && n !== stop; n = n.parentElement) {
      const prev = n.getAttribute("data-prev-style");
      if (prev === "__none__") n.removeAttribute("style"); else n.setAttribute("style", prev);
      n.removeAttribute("data-prev-style");
    }
  });
  const stable = ["x", "y", "width", "height"].every((k) => Math.abs(box[k] - moved[k]) < 0.01);
  return { top: !before[0].equals(after[0]), bottom: !before[1].equals(after[1]), stable };
}

try {
  let ready = false;
  for (let i = 0; i < 120; i++) {
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch { /* starting */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  assert.ok(ready, `${target} server did not start`);
  browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  page.on("pageerror", (e) => pageErrors.push(e.message));
  await mkdir("reports/live-seo", { recursive: true });

  const widths = [320, 375, 768, 1024, 1280, 1536, 1897];
  for (const lang of ["en", "hi", "mr", "gu"]) {
    await setLanguage(page, lang);
    if (lang !== "en") {
      await record(`[${lang}] Indic web font loaded (test is meaningful)`, async () => {
        const ok = await page.evaluate((l) => l === "gu"
          ? document.fonts.check('16px "Noto Sans Gujarati"', "પ્રિ")
          : document.fonts.check('16px "Noto Sans Devanagari"', "प्रि"), lang);
        assert.ok(ok, "Noto font did not load");
      });
    }
    await freezeBackground(page, true);
    await record(`[${lang}] Clipping detector positive control`, async () => {
      await page.setViewportSize({ width: 1280, height: 900 });
      await page.locator(NAME).first().evaluate((el) => { el.dataset.ctl = el.getAttribute("style") ?? ""; el.style.lineHeight = "0.8"; });
      const r = await inkClipping(page, NAME);
      await page.locator(NAME).first().evaluate((el) => { el.setAttribute("style", el.dataset.ctl); delete el.dataset.ctl; });
      assert.ok(r.top || r.bottom, "Detector failed to see clipping at line-height 0.8");
    });
    for (const width of widths) {
      await record(`[${lang}] Doctor name and credentials not clipped at ${width}px`, async () => {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(150);
        for (const [label, sel] of [["name", NAME], ["credentials", CREDS]]) {
          const r = await inkClipping(page, sel);
          assert.ok(r.stable, `${label}: layout moved while testing`);
          assert.ok(!r.top && !r.bottom, `${label} glyphs clipped (${r.top ? "top" : ""}${r.bottom ? " bottom" : ""})`);
        }
      });
    }
    if (lang === "hi") {
      await page.setViewportSize({ width: 1897, height: 900 });
      await freezeBackground(page, false);
      await page.locator("header nav").screenshot({ path: `reports/live-seo/${target}-hindi-nav-1897.png` });
    }
    await freezeBackground(page, false);
  }

  for (const lang of ["en", "hi", "mr", "gu"]) {
    await setLanguage(page, lang);
    for (const width of [1024, 1280, 1440, 1536, 1897, 2560]) {
      await record(`[${lang}] Every primary nav link is visible and clickable at ${width}px`, async () => {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(150);
        const info = await page.evaluate(() => {
          const nav = document.querySelector("header nav");
          const actions = nav.lastElementChild;
          const links = [...nav.querySelectorAll(":scope > div a")].filter(
            (a) => !actions.contains(a) && !a.closest("[class*='absolute']") && a.getBoundingClientRect().width > 0
          );
          const covered = links
            .filter((a) => {
              const r = a.getBoundingClientRect();
              const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
              return !(hit && a.contains(hit));
            })
            .map((a) => a.textContent.trim());
          const last = links.at(-1)?.getBoundingClientRect();
          return { count: links.length, covered, gap: last ? actions.getBoundingClientRect().left - last.right : null };
        });
        assert.equal(info.count, 7, `expected 7 primary links, found ${info.count}`);
        assert.deepEqual(info.covered, [], `links hidden under other controls: ${info.covered.join(", ")}`);
        assert.ok(info.gap >= 4, `links touch the action buttons (gap ${Math.round(info.gap)}px)`);
      });
    }
  }

  for (const lang of ["en", "hi"]) {
    await setLanguage(page, lang);
    for (const width of [375, 640, 768, 1024, 1280, 1897]) {
      await record(`[${lang}] Explore grid fills every row at ${width}px`, async () => {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(150);
        const grid = page.locator('section[aria-labelledby="lib-h"] > div.grid').first();
        const info = await grid.evaluate((el) => ({
          cols: getComputedStyle(el).gridTemplateColumns.split(" ").filter(Boolean).length,
          hrefs: [...el.children].map((a) => a.getAttribute("href")),
          titles: [...el.children].map((a) => a.querySelector(".font-display")?.textContent ?? ""),
        }));
        assert.equal(info.hrefs.length, 6, `expected 6 featured guides, found ${info.hrefs.length}`);
        assert.equal(info.hrefs.length % info.cols, 0, `${info.hrefs.length} cards in ${info.cols} columns leaves an empty slot`);
        assert.ok(info.hrefs[3].endsWith(EXPECTED_SIXTH), `Speech Delay guide missing (got ${info.hrefs[3]})`);
        if (lang === "hi") assert.ok(info.titles.every((t) => /[\u0900-\u097F]/.test(t)), "a featured title is not in Hindi");
      });
    }
    if (lang === "hi") {
      await page.setViewportSize({ width: 1897, height: 1000 });
      await page.locator('section[aria-labelledby="lib-h"]').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.locator('section[aria-labelledby="lib-h"] > div.grid').first().screenshot({ path: `reports/live-seo/${target}-hindi-explore-1897.png` });
    }
  }
  await record("No JavaScript page errors", async () => assert.deepEqual(pageErrors, []));
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  await writeFile(`reports/live-seo/layout-${target}.json`, JSON.stringify({ checkedAt: new Date().toISOString(), target, results }, null, 2));
}
const failed = results.filter((r) => !r.passed);
console.log(`${results.length - failed.length}/${results.length} layout checks passed (${target})`);
process.exitCode = failed.length ? 1 : 0;
