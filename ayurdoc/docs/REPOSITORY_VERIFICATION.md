# Latest Repository Verification and Phase 4 Handover

## Verdict

**All previously delivered application changes are in the latest GitHub `main`.** The four-language expansion and the
three earlier review-date/schema corrections are present. This is a repository and local-production verification,
not proof of Netlify deployment, medical approval or real clinic email delivery.

| Item | Result |
|---|---|
| Repository | `https://github.com/evyanahuja/ayur` |
| Application directory | `ayurdoc/` |
| Checked branch | `main` |
| Checked HEAD | `0a51febeab547afd80ccdcd03761b4746837e094` |
| Commit subject | `Add files via upload` |
| Commit author timestamp | `2026-11-15T21:27:58+05:30` (not a deployment timestamp) |
| Tracked repository files compared byte-for-byte | 108 |
| Missing tracked files in the workspace | 0 |
| Different tracked files | 0 |
| Upstream HEAD rechecked after the local crawl | Same commit |

The comparison used a fresh shallow clone and the Git tracked-file list, including source, assets, manifests, database
schema, configuration and existing tests. Sandbox-only `.env`, installed dependencies, build outputs, generated type
files, old patch exports and the new handover files listed below are not evidence of missing upstream changes.
No tracked `.env`, `node_modules/`, `.next/` or TypeScript build-cache file was found in the checked commit.

## Verified feature delivery

- Four-language UI dictionary (`expansion.ts`) and the new health-concerns hub view.
- Hindi, Gujarati and Marathi translation records for all ten new condition drafts, ten category pages and two new
  treatment pages; English remains the base content.
- Updated Hero, homepage sections, category views, conversion blocks, navigation, enquiry form and shared copy.
- Per-guide `reviewedOn` display and optional per-guide JSON-LD date.
- Draft conditions request `noindex`, are excluded from the sitemap and do not emit reviewer-bearing MedicalWebPage
  schema. No claim is made that a noindex instruction is an access-control mechanism or an indexing guarantee.
- Existing routes and the enquiry API remain in place.

## Content inventory

| Type | Count |
|---|---:|
| Condition guides | 32 |
| Legacy-published condition guides | 22 |
| Explicit draft condition guides | 10 |
| Health-concern category pages | 10, plus hub |
| Treatment/service pages | 14 |
| Health articles | 23 |
| Existing local/service landing pages | 7 |
| Canonical URLs in sitemap | 88 |

A translation being present is **not** evidence of clinical or linguistic approval. Some translated text is condensed
rather than a line-by-line equivalent. Each language's safety coverage still needs a qualified review.

## Local-production test evidence

### Build validation

The following commands passed after adding the audit and test files:

- `npx next typegen`
- `npm exec tsc -- --noEmit --pretty false`
- `npm run build` — 106 generated static pages/resources reported by Next.js; this is not the number of indexable guides.
- Platform `build_and_start` — production build, server start and `/api/health` passed.

### Targeted Playwright release suite

`npx playwright test tests/expansion-release.spec.ts`: **7 passed**.

1. English desktop language selection, homepage/category/treatment/draft rendering, consent error and success messaging.
2. Hindi equivalent journey.
3. Gujarati equivalent journey.
4. Marathi equivalent journey.
5. Gujarati mobile language switch and navigation to the all-age hub at 390px viewport width.
6. Sitemap excludes all ten drafts; representative draft requests noindex and omits reviewer-bearing MedicalWebPage schema.
7. Actual enquiry endpoint rejects a payload without consent before database/email delivery.

The four form-success flows were intercepted and supplied synthetic responses. No patient record or clinic email was
created by those tests. They do not prove production email configuration. No uncaught JavaScript page errors were
observed in the four tested desktop journeys. This is a targeted release suite, not a claim that the older full test
suite, every device/browser, every translated sentence or every visual layout was audited.

Chromium and its Linux runtime libraries were installed in the sandbox to run the suite. No npm dependencies were
added or changed. Initial browser launch lacked system libraries; installing them resolved that tooling issue.

### Local canonical crawl

A separate HTTP/HTML crawl of the production preview found:

- 88/88 sitemap URLs returned HTTP 200.
- All 88 pages had one H1, a title, meta description and matching canonical.
- No duplicate title or meta-description strings among those pages.
- All 88 distinct internal page paths discovered in anchor links resolved.
- 173 JSON-LD script blocks parsed as JSON without syntax errors.

The crawl checks rendered HTML and page links, not external references, image availability, fragment targets, Google
indexing or schema-property eligibility. Valid JSON syntax does not establish medical accuracy or rich-result eligibility.

## Outstanding work — not all original requirements are complete

The previous blanket "met" assessment was too broad. The following remain release/expansion prerequisites:

1. **Medical review:** ten drafts have no individual physician review date. New categories and the two new treatments
   are indexable while review is pending. Legacy pages use implicit publication and a global review-date fallback.
   Reviewer attribution must reflect actual approval, not the clinic's presence on the website.
2. **Content depth:** every one of the 22 legacy-published condition guides has only 2–4 FAQs, below the requested 6–10.
   Improve usefulness and condition-specific safety, not just the count.
3. **References:** 76 condition citations are plain text; none has a stored clickable source URL. Verify the original
   documents, currency and accuracy before representing any source as checked clinical evidence.
4. **Multilingual SEO:** the same URL serves English initial HTML with client-side language switching. Separate
   server-rendered `/hi/`, `/gu/` and `/mr/` URLs, translated metadata and reciprocal hreflang are not implemented.
5. **Language quality:** get fluent language and physician review for complete symptom, caution and emergency meaning.
6. **Clinical scope:** confirm competence, referral pathways and clinic equipment before adding higher-risk conditions
   or advertising additional treatments/services. Do not invent specialisations.
7. **Real photographs and identity:** verify image provenance, replace any AI placeholders, and confirm registration,
   credentials, clinic name/address/phone/hours and fees against real records.
8. **Live acquisition flow:** Netlify deployment, actual PostgreSQL enquiry storage, email receipt, coordinator follow-up,
   appointment acceptance and attendance were not verified here. Mocked browser tests are not a substitute.
9. **Privacy and analytics:** verify retention, consent evidence, data access, server validation and abuse controls before
   scaling. Use stable concern-category codes; avoid repurposing older codes for different labels without migration.
   Configure non-sensitive enquiry events and private clinic qualification/attendance tracking.
10. **Live technical SEO:** Search Console/Business Profile configuration, full deployed-site link crawl, accessibility,
    Lighthouse and Core Web Vitals remain to be checked on the real deployment.

The prioritised remediation and content schedule are in [`PHASE_4_PLAN.md`](PHASE_4_PLAN.md).

## Phase 4 backlog outcome

Every original target (IDs 1–142) is mapped in [`phase4-backlog.csv`](phase4-backlog.csv):

| Disposition | Topic entries |
|---|---:|
| Refresh existing published content | 22 |
| Review existing drafts | 10 |
| Merge into existing content | 21 |
| Standard new-draft candidates | 57 |
| Merge into proposed content | 14 |
| Specialist-gated candidates | 18 |
| **Total** | **142** |

This means **57 standard new-page candidates**, not another 130–140 pages. The 18 higher-risk candidates are conditional
and may remain deferred. Merges cover 35 requested topic variants without creating duplicate pages. The first priority
is review and improvement of existing content; then release 3–5 approved four-language pages at a time, starting with
children's health, skin/hair and digestion. No new medical pages were generated or published in this planning turn.

## Files added by this verification/planning work

These five new files are in the workspace, **not in the checked GitHub commit**:

1. `docs/REPOSITORY_VERIFICATION.md` — this evidence report.
2. `docs/PHASE_4_PLAN.md` — gates, batches, owners, multilingual SEO and enquiry measurement plan.
3. `docs/phase4-backlog.csv` — all 142 target topics, dispositions, existing/proposed URLs and safety notes.
4. `scripts/audit-expansion.cjs` — repeatable read-only inventory/backlog/translation checks; optional tracked-file comparison.
5. `tests/expansion-release.spec.ts` — seven targeted multilingual and consent/SEO release checks.

No existing application source, route, database schema, deployment configuration or package manifest was changed during
this verification/planning work. Upload/commit the five new files if you want this roadmap and the checks in GitHub.
Do not upload `test-results/`, `.next/`, `node_modules/`, `.env`, generated type/cache files or browser downloads.

## Repeat the checks

From the application folder (the local equivalent of `ayurdoc/`):

- `node scripts/audit-expansion.cjs`
- To compare a fresh clone as well: `node scripts/audit-expansion.cjs --repo /path/to/ayur` (Git root containing `ayurdoc/`).
- With a production preview running: `npx playwright test tests/expansion-release.spec.ts`.
- For a different preview host: set `PLAYWRIGHT_BASE_URL` to that host before running Playwright.
- Browser prerequisites on a new machine: `npx playwright install chromium`; Linux may also need
  `npx playwright install-deps chromium` with suitable system permissions.

If later edits deliberately change the application, a repository comparison should report those differences. It is a
file-presence check, not a deployment check, and it cannot certify review/approval, indexing, clinical claims or rankings.
