#!/usr/bin/env node
/* Read-only release audit. Run from the application folder:
 *   node scripts/audit-expansion.cjs
 *   node scripts/audit-expansion.cjs --repo /path/to/ayur
 * The optional repo is the Git checkout ROOT (containing ayurdoc/).
 * Uses the existing TypeScript dev dependency; no database calls or patient writes.
 */
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const { execFileSync } = require("node:child_process");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
// Transpile pure content modules for this Node-only audit, including @/ imports.
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (name, parent, ...args) {
  if (name.startsWith("@/")) name = path.join(root, "src", name.slice(2));
  return originalResolve.call(this, name, parent, ...args);
};
require.extensions[".ts"] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    }).outputText,
    filename
  );
};
const load = (p) => require(path.join(root, p));
const { ALL_CONDITIONS, PUBLISHED_CONDITIONS } = load("src/content/registry.ts");
const { HEALTH_CATEGORIES } = load("src/content/categories.ts");
const { TREATMENTS } = load("src/content/treatments.ts");
const { ARTICLES } = load("src/content/articles.ts");
const { LOCAL_PAGES } = load("src/content/local.ts");
const { CATEGORY_TRANSLATIONS } = load("src/i18n/categoriesTranslations.ts");
const { NEW_TREATMENT_TRANSLATIONS } = load("src/i18n/newTreatmentsTranslations.ts");
const { NEW_CONDITIONS_HI } = load("src/i18n/newConditionsHi.ts");
const { NEW_CONDITIONS_MR } = load("src/i18n/newConditionsMr.ts");
const { NEW_CONDITIONS_GU } = load("src/i18n/newConditionsGu.ts");
const { EXPANSION } = load("src/i18n/expansion.ts");
const sitemap = load("src/app/sitemap.ts").default();
const drafts = ALL_CONDITIONS.filter((p) => p.status === "draft");

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const publishedPaths = new Set(sitemap.map((x) => new URL(x.url).pathname.replace(/\/$/, "") || "/"));
const draftPaths = new Set(drafts.map((p) => `/conditions/${p.slug}`));
const existingPaths = new Set([...publishedPaths, ...draftPaths]);
check(sitemap.length === publishedPaths.size, "Duplicate canonical URL in sitemap");
check(drafts.every((p) => !publishedPaths.has(`/conditions/${p.slug}`)), "A draft condition is in the sitemap");
check(new Set(ALL_CONDITIONS.map((p) => p.slug)).size === ALL_CONDITIONS.length, "Duplicate condition slug");

const conditionFields = [
  "title", "h1", "seoTitle", "seoDescription", "intro", "whatIs", "signs", "causes", "whenToAssess",
  "diagnosis", "management", "homeCare", "redFlags", "ayurvedaRole", "ayurvedaLimits", "faqs",
];
const treatmentFields = [
  "title", "h1", "seoTitle", "seoDescription", "intro", "sections", "suitability", "notSuitable", "risks", "process", "faqs",
];
const newTreatmentSlugs = ["rasayana", "ayurvedic-diet-lifestyle"];
const translations = { hi: NEW_CONDITIONS_HI, mr: NEW_CONDITIONS_MR, gu: NEW_CONDITIONS_GU };
const coverage = {};
for (const [lang, entries] of Object.entries(translations)) {
  for (const page of drafts) {
    const entry = entries[page.slug];
    check(!!entry, `Missing ${lang} condition translation: ${page.slug}`);
    if (!entry) continue;
    for (const field of conditionFields) check(!!entry[field]?.length, `Empty ${lang} field: ${page.slug}.${field}`);
    check(entry.faqs.length >= 6, `Fewer than 6 translated FAQs: ${lang}/${page.slug}`);
  }
  for (const category of HEALTH_CATEGORIES) {
    const entry = CATEGORY_TRANSLATIONS[lang]?.[category.slug];
    check(!!entry, `Missing ${lang} category translation: ${category.slug}`);
    if (entry) for (const field of ["title", "navHint", "seoTitle", "seoDescription", "intro", "approach", "concerns", "faqs"])
      check(!!entry[field]?.length, `Empty ${lang} category field: ${category.slug}.${field}`);
  }
  for (const slug of newTreatmentSlugs) {
    const entry = NEW_TREATMENT_TRANSLATIONS[lang]?.[slug];
    check(!!entry, `Missing ${lang} treatment translation: ${slug}`);
    if (entry) for (const field of treatmentFields) check(!!entry[field]?.length, `Empty ${lang} treatment field: ${slug}.${field}`);
  }
  check(EXPANSION[lang].home.faqs.length === EXPANSION.en.home.faqs.length, `Homepage FAQ count mismatch: ${lang}`);
  check(!!EXPANSION[lang].form.consentText && !!EXPANSION[lang].form.nonConfirmNote, `Consent copy missing: ${lang}`);
  coverage[lang] = { newConditionGuides: drafts.length, categoryPages: HEALTH_CATEGORIES.length, newTreatments: 2 };
}

for (const page of ALL_CONDITIONS) {
  for (const slug of page.relatedConditions) check(ALL_CONDITIONS.some((p) => p.slug === slug), `${page.slug} links to unknown condition ${slug}`);
  for (const slug of page.relatedTreatments) check(TREATMENTS.some((p) => p.slug === slug), `${page.slug} links to unknown treatment ${slug}`);
}

// CSV reader supports quoted fields, escaped quotes and embedded newlines.
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (quoted && text[i + 1] === '"') { field += '"'; i++; }
      else quoted = !quoted;
    } else if (ch === "," && !quoted) { row.push(field); field = ""; }
    else if (ch === "\n" && !quoted) { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (row.length || field.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  if (quoted) throw new Error("Unclosed CSV quote");
  return rows.filter((r) => r.some(Boolean));
}
const csv = parseCsv(fs.readFileSync(path.join(root, "docs/phase4-backlog.csv"), "utf8"));
const headers = csv.shift();
const backlog = csv.map((row) => {
  check(row.length === headers.length, `Malformed CSV row: ${row[0]}`);
  return Object.fromEntries(headers.map((h, i) => [h, row[i]]));
});
check(backlog.length === 142, "Backlog must map all 142 original target topics");
check(new Set(backlog.map((r) => r.id)).size === 142, "Backlog has duplicate topic IDs");
for (let id = 1; id <= 142; id++) check(backlog.some((r) => Number(r.id) === id), `Missing target ${id}`);
const allowedActions = new Set(["refresh", "review-draft", "merge-existing", "create-draft", "merge-planned", "specialist-gate"]);
const newTasks = backlog.filter((r) => ["create-draft", "specialist-gate"].includes(r.action));
const plannedPaths = new Set(newTasks.map((r) => r.target_path));
check(plannedPaths.size === newTasks.length, "Two new-page tasks compete for the same proposed URL");
for (const r of backlog) {
  check(allowedActions.has(r.action), `Unknown action for ${r.id}: ${r.action}`);
  check(/^\/(conditions|treatments|health-concerns|articles)\/[a-z0-9-]+$/.test(r.target_path), `Unexpected URL for target ${r.id}`);
  if (["refresh", "review-draft", "merge-existing"].includes(r.action))
    check(existingPaths.has(r.target_path), `Existing URL not found for target ${r.id}: ${r.target_path}`);
  if (r.action === "review-draft") check(draftPaths.has(r.target_path), `Target ${r.id} does not refer to a draft`);
  if (r.action === "merge-planned") check(plannedPaths.has(r.target_path), `Merge target has no new-page task: ${r.id}`);
  if (["create-draft", "specialist-gate"].includes(r.action))
    check(!existingPaths.has(r.target_path), `Proposed new URL already exists: target ${r.id}`);
}
const actions = {}, batches = {};
for (const r of backlog) {
  actions[r.action] = (actions[r.action] || 0) + 1;
  if (!batches[r.batch]) batches[r.batch] = { topicRows: 0, newUrls: 0 };
  batches[r.batch].topicRows++;
  if (["create-draft", "specialist-gate"].includes(r.action)) batches[r.batch].newUrls++;
}

let repository = null;
const repoIndex = process.argv.indexOf("--repo");
if (repoIndex !== -1) {
  if (!process.argv[repoIndex + 1]) throw new Error("--repo requires the Git checkout root");
  const repo = path.resolve(process.argv[repoIndex + 1]);
  const tracked = execFileSync("git", ["-C", repo, "ls-tree", "-rz", "--name-only", "HEAD"], { encoding: "utf8" }).split("\0");
  const commit = execFileSync("git", ["-C", repo, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  const missing = [], different = [];
  let compared = 0;
  for (const name of tracked.filter((p) => p.startsWith("ayurdoc/"))) {
    const rel = name.slice("ayurdoc/".length);
    const from = path.join(repo, name), to = path.join(root, rel);
    if (!fs.existsSync(to)) { missing.push(rel); continue; }
    if (!fs.statSync(from).isFile()) continue;
    compared++;
    if (!fs.readFileSync(from).equals(fs.readFileSync(to))) different.push(rel);
  }
  repository = { commit, compared, missing, different, note: "New untracked local audit/plan files are not counted as missing from the repository." };
  check(!missing.length && !different.length, "Repository tracked files differ from this workspace; inspect the repository section.");
}
const references = ALL_CONDITIONS.flatMap((p) => p.references);
const summary = {
  inventory: {
    conditionGuides: ALL_CONDITIONS.length,
    publishedConditionGuides: PUBLISHED_CONDITIONS.length,
    draftConditionGuides: drafts.length,
    healthCategories: HEALTH_CATEGORIES.length,
    treatmentsAndServices: TREATMENTS.length,
    articles: ARTICLES.length,
    localLandingPages: LOCAL_PAGES.length,
    canonicalSitemapUrls: sitemap.length,
  },
  translationPresence: coverage,
  backlog: { topicRows: backlog.length, actions, batches, distinctProposedNewUrls: plannedPaths.size },
  releasePrerequisites: {
    publishedConditionGuidesBelowSixFaqs: PUBLISHED_CONDITIONS.filter((p) => p.faqs.length < 6).length,
    conditionReferenceCitations: references.length,
    conditionReferenceLinks: references.filter((r) => r.url || r.href).length,
    draftGuidesWithoutReviewDate: drafts.filter((p) => !p.reviewedOn).length,
    warning: "Presence checks are not a medical or translation quality review. The current client-side language switcher does not provide separately indexable language URLs.",
  },
  repository,
  failures,
};
console.log(JSON.stringify(summary, null, 2));
if (failures.length) process.exitCode = 1;
