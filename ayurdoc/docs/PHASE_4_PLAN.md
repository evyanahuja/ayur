# Phase 4 — Reviewed Content Expansion and Qualified Clinic Enquiries

## Decision and scope

**Recommendation:** do not generate another large batch of disease pages yet. First review the ten existing drafts,
close the publication-safety gaps, and verify the live enquiry flow. Then add focused, multilingual batches, starting
with children's health, skin/hair and digestive concerns. Keep existing URLs and the present design.

This plan is based on GitHub `evyanahuja/ayur`, `ayurdoc/`, commit
`0a51febeab547afd80ccdcd03761b4746837e094` (`Add files via upload`). Repository file presence is verified separately
from Netlify deployment, medical approval and linguistic accuracy. No new medical pages are published by this plan.

**Source of truth for individual work items:** [`phase4-backlog.csv`](phase4-backlog.csv). It maps **all 142 original
requested topics**, including existing pages and duplicate intents. The IDs match the numbered master prompt.

## 1. Verified baseline

| Current content | Count | Important distinction |
|---|---:|---|
| Condition guides | 32 | 22 legacy-published; 10 explicit drafts |
| Health-concern category landing pages | 10 | Plus `/health-concerns` hub |
| Treatments and consultation services | 14 | Includes Rasayana and Ayurvedic Diet & Lifestyle |
| Health articles | 23 | Existing content needs a line-by-line safety audit |
| Existing local/service landing pages | 7 | Do not add duplicate city doorway pages |
| Canonical sitemap URLs | 88 | Excludes all ten draft condition guides |
| New condition translations | 10 in each of HI/MR/GU | Presence confirmed; clinical and language approval not demonstrated |
| New category translations | 10 in each of HI/MR/GU | Same qualification |
| New treatment translations | 2 in each of HI/MR/GU | Same qualification |

The original request contains **142 topic entries**, not 142 necessarily distinct pages. Parkinson's disease and
Suvarnaprashan are explicitly repeated; many symptoms and age variants are best handled as sections of one page.
Existing ADHD and cerebral palsy sub-pages also require an intent review before more sub-pages are created.

### Topic disposition (not page-count targets)

| Action in CSV | Topic entries | Meaning |
|---|---:|---|
| `refresh` | 22 | Improve an existing published guide, article or treatment at its current URL |
| `review-draft` | 10 | Review and, only if approved, publish an existing draft |
| `merge-existing` | 21 | Cover the intent within a current page or category; do not create another URL |
| `create-draft` | 57 | Proposed standard new pages, subject to scope and intent review |
| `merge-planned` | 14 | Cover the intent within one of the proposed pages rather than add another |
| `specialist-gate` | 18 | Conditional educational/co-care candidates; not approved treatment services |
| **Total** | **142** | 75 proposed new URLs at most; only 57 are in the standard expansion queue |

These figures replace earlier rough statements that another 130–140 pages were needed. There is no obligation to
publish all candidates or to reach 150–170 pages. Publish only when the page helps an actual patient decision.

## 2. Gate 0 — Prerequisites before further medical publication

| Priority | Work | Owner | Acceptance evidence |
|---|---|---|---|
| P0 | Review the ten existing draft guides, homepage medical copy, ten categories and two new treatments in all four languages | Dr. Priyanka Likhar; fluent language reviewer | Real approval record per version; no invented reviewer or review date |
| P0 | Confirm qualifications, registration, clinic NAP, hours, service availability and supported age groups | Clinic owner/doctor | Registration checked with the appropriate register; clinic confirms the details already shown |
| P0 | Replace any AI placeholder doctor/clinic pictures after checking provenance | Clinic owner | Real authorised photographs or a neutral non-person illustration; no false doctor or facilities imagery |
| P0 | Make the publication gate explicit across conditions, treatments, articles and categories | Developer + doctor | New pages default to draft; positive approval required before indexable publication; no automatic approval by omitting `status` |
| P0 | Separate reviewer attribution from clinic profile | Developer + doctor | No `Author & Medical Reviewer`, `reviewedBy`, `lastReviewed` or review date unless the named person actually approved that version |
| P0 | Check every citation; store actual source URLs, update dates and evidence limitations | Medical editor + doctor | Linked primary guidance; no citation accepted on title alone |
| P0 | Check live enquiry delivery, storage, notification, failure messaging and privacy practices | Developer + clinic | Approved synthetic enquiry test in production; record DB receipt and email receipt separately; no appointment-confirmed claim |
| P1 | Improve old guides to the standard template's content depth | Medical editor + doctor | All 22 existing condition guides currently have only 2–4 FAQs; aim for 6–10 useful questions where justified, not filler |
| P1 | Review HTML rendering, accessibility, links and mobile text expansion in all languages | Developer/QA | Targeted browser checks plus live link crawl and accessibility/performance report |

### Publication limitations in the current code

- `src/content/registry.ts` treats a missing `status` as published. This preserves legacy routes, but is not an
  approval workflow. Do not assume that a published page has been medically approved.
- `reviewedOn` exists for conditions, but there is no per-language approval record. A date alone does not prove review.
- Categories and the two new treatment pages are currently indexable even while review is pending. Their approval and
  visibility must be resolved before more medical pages follow that pattern.
- A global `REVIEW_DATE` is still the fallback for old content and the sitemap. Use real publication/modification dates;
  a sitemap update date is not the same as medical review.
- All 76 condition references are currently plain-text citations. None has a stored clickable source URL.
- Related links must be filtered by approved publication status. Updating category mappings is still a manual step.
- Condition category types/listing groups do not yet cover every future metabolic, men's-health and senior topic.
  Add stable category IDs/shared category resolution before expanding those groups.
- Four-language display is implemented with client-side language preference on the same URL. It is not four-language
  search indexing. New pages still deliver English metadata and English initial HTML.

Do not abruptly delete or noindex legacy pages merely to introduce a new workflow. Audit them, preserve established
URLs, and make an explicit review/migration decision. New drafts should remain noindex and absent from the sitemap.

## 3. Editorial batches

A batch below is a content cluster, not a single release. Release **3–5 approved pages at a time**; split larger clusters.
Each page is one English canonical draft plus Hindi, Gujarati and Marathi versions, with equivalent safety coverage.
The proposed URLs are planning entries only and must not be linked as live pages yet.

| Order | Cluster | New candidate pages | Main targets | Internal-link destinations |
|---|---|---:|---|---|
| 0 | Review and strengthen what exists | 0 | Ten drafts; pediatric cornerstone guides; Panchakarma and therapy review | Existing category hubs and `/contact` |
| 1 | Children's health | 5 | Recurrent stomach pain; childhood allergies; childhood asthma; nutritional deficiencies; recurrent infections | Children's hub; existing appetite, growth, constipation and cold/cough guides; iron/vitamin D articles |
| 2 | Skin and hair | 8 | Acne; dandruff; fungal infections; hives; persistent itching; vitiligo; dry skin; premature greying | Skin/hair hub; reviewed psoriasis, eczema and hair-fall guides |
| 3 | Digestive health | 7 | Gas/bloating; indigestion; gastritis; IBS; anal fissure; adult loss of appetite; recurrent abdominal pain | Digestive hub; reviewed acidity, adult constipation and piles guides |
| 4 | General joints and common menstrual symptoms | 5 | Back pain; neck pain; sciatica; irregular periods; painful menstruation | Joint/bone and women's hubs; reviewed knee pain and PCOS guides |
| 5 | Respiratory and stress/headache | 6 | Allergic rhinitis; chronic cough; adult asthma; sinusitis; frequent headaches; stress-related concerns | Respiratory and neurological hubs; migraine and insomnia guides |
| 6 | Related joint, menopause and falls support | 8 | Cervical and lumbar spondylosis; frozen shoulder; osteoporosis; heavy bleeding; PMS; menopause; falls/balance article | Reviewed symptom guides; senior and women's hubs |
| 7 | Nutrition, metabolic and recovery support | 11 | Muscle weakness; recurrent UTI; postpartum recovery; women's nutrition; prediabetes; weight management; hypothyroidism; cholesterol; fatty liver; anaemia; fatigue | Metabolic, senior, men's and women's hubs; appropriate specialist referrals |
| F | Ayurveda foundations, in parallel after Gate 0 | 7 | What is Ayurveda; Vata/Pitta/Kapha; Prakriti/Vikriti; Agni/Ama; Dinacharya; Ritucharya; healthy ageing | Relevant condition sections and treatment guides, not generic links everywhere |
| 8 | Specialist-gated candidates, no automatic release | 18 | Listed below | Clinician-approved educational/co-care links only |

**Standard new-page queue:** 57 pages (orders 1–7 and F). Existing refreshes and merges are additional editorial tasks,
not new pages. Avoid overloading the physician: begin with order 0, then one 3–5-page micro-batch from order 1.

### First delivery recommendation

1. Review and improve childhood constipation, growth/poor weight gain, poor appetite, recurrent cold/cough and the
   Panchakarma cornerstone. These already have URLs and can create value without more pages.
2. Seek approval for the existing acidity, psoriasis, hair-fall, PCOS and knee-pain drafts, then the remaining five drafts.
3. Draft the five order-1 children's guides. Prioritise safety and actual clinic competence over query breadth.
4. While those are reviewed, prepare acne, dandruff and fungal-infection briefs; do not publish them automatically.
5. Reorder later batches using actual Search Console queries and qualified clinic enquiries once there is enough data.

### Specialist-gated topics (18)

Childhood malnutrition; peripheral neuropathy; facial palsy; Parkinson's disease; memory/cognitive concerns;
rheumatoid arthritis; female infertility; endometriosis; vaginal health concerns; male infertility; erectile dysfunction;
premature ejaculation; prostate enlargement; urinary problems in men; male hormonal health; type 2 diabetes;
hypertension; dementia.

These are not claims that the clinic has specialist qualifications or offers definitive treatment for these conditions.
Dr. Priyanka must confirm her scope, facilities, referral relationships and whether an educational page is appropriate.
Some may remain deferred or become referral-oriented guidance instead of patient-acquisition pages. Acute facial
weakness, severe malnutrition, new neurological deficits and other emergencies must point to urgent medical care.

## 4. Cannibalisation rules and specific merges

- Preserve `/conditions/growth-nutrition-concerns` for poor weight gain/growth intent. Audit its depth before deciding
  whether a truly distinct nutritional deficiency page is justified.
- Keep child and adult constipation separate. Put chronic and older-age adult constipation in the adult guide.
- Keep hair-fall and male-pattern hair-loss intent on one guide initially.
- Put scalp psoriasis in the psoriasis guide and pediatric eczema in the eczema guide initially.
- Keep one menopause page for menopause and menopausal symptoms.
- Keep one Parkinson's page if approved; targets 65 and 116 are the same condition.
- Keep Suvarnaprashan at its existing URL; targets 24 and 137 do not justify two pages.
- Use one Prakriti/Vikriti guide and one Agni/Ama guide initially.
- Cover sneezing and nasal congestion within the rhinitis guide while clearly explaining alternative causes.
- Distinguish dyspepsia (symptoms), gastritis (a diagnosis), GERD (reflux) and IBS (a specific disorder); briefs must define
  their unique intent before creating all four.
- Use the existing osteoarthritis article; do not create another page with the same primary search intent merely to
  place it under `/conditions`.
- Generic childhood skin, chronic skin, recurrent respiratory and digestive-overview phrases belong on the existing
  category hubs unless data later show a separate useful intent.
- Existing URLs must not be removed as a side effect of a merge. If a later approved consolidation moves an indexed
  page, use a permanent redirect and update canonicals, links and sitemap together.

## 5. Search-intent work before each micro-batch

The sequence above reflects relevance, the doctor's stated focus and reasonable symptom intent. It is **not** a search
volume or ranking forecast. No private Search Console or Keyword Planner data were available for this audit.

For every proposed page, record:

1. Existing pages and the nearest competing URL on this site.
2. The user's actual question, intended reader/age and what action the page should help them take.
3. One primary query plus a small set of natural related symptom/questions, including Hindi/Gujarati/Marathi wording.
4. Whether the query is emergency, diagnostic, self-care, treatment-information or consultation intent.
5. An outline, evidence sources and explicit exclusions; avoid copying other sites or generating spun variants.
6. Local intent only when useful. Do not add Indore to every heading or create city variants without a real clinic.

Illustrative research seeds: "why does my child keep getting stomach pain", "child allergy or repeated cold",
"dandruff or scalp psoriasis", "gas and bloating after meals", "painful periods when to see a doctor", and
"knee pain when climbing stairs". Validate the phrasing and competitor overlap for each language before writing.

## 6. Required content brief and definition of done

Every disease draft must include:

- Page type, proposed canonical slug, shared category ID, primary/secondary intent and duplication check.
- Unique metadata, one H1, relatable non-diagnostic introduction and logical headings.
- Symptoms and daily-life impact; recognised causes; age, pregnancy and medicine considerations as relevant.
- A separate traditional Ayurvedic perspective with plain explanations and clear evidence limitations.
- Individual assessment process and suitable care categories; **no medicines, doses or procedures prescribed online**.
- Condition-specific warning signs and unambiguous advice not to delay investigations or emergency care.
- A truthful doctor-help section and working Book/Call/WhatsApp/Directions CTAs using existing clinic details.
- Six to ten useful, original FAQs where the intent supports them; no filler to meet a count.
- Four to six genuinely relevant, published internal links where available; include a category/treatment/article only
  when helpful, and never link to a non-existent proposed URL or an unapproved medical guide as a live resource.
- Verified, clickable references, author attribution, actual publication/modification date and a real approval record.
- English, Hindi, Gujarati and Marathi versions with equivalent clinical meaning and emergency guidance. Do not treat
  a translation-entry presence check as proof of linguistic or medical accuracy.
- A review state of draft until the appropriate approvals and technical checks pass.

Track condition/treatment wording against a safety checklist: no guaranteed or permanent cures; no automatic dosha
assignment; no implication that conventional medicines are unnecessary; no unsupported detox, immunity, fertility,
cartilage-regeneration, developmental-reversal or metabolic-remission promise.

## 7. Multilingual review and SEO follow-up

### Display coverage versus reviewed translation

Four-language display exists in the latest repository. Several translations are condensed adaptations rather than
line-by-line equivalents, so reviewers must compare every clinical point, precaution, FAQ and red flag with English.
Keep medical study titles in their original language where necessary; localise surrounding explanations. Retain stable
URLs, numbers, qualifications and medicine names rather than translating them ambiguously.

### Separately crawlable language pages (a separate engineering release)

For multilingual patient acquisition, plan `/hi/...`, `/gu/...` and `/mr/...` while preserving unprefixed English URLs.
Each supported version should have:

- Actual server-rendered content in its language, not only localStorage-driven replacement after hydration.
- Its own self-canonical URL and language-specific metadata/Open Graph text.
- Reciprocal `hreflang` entries for the translations that are actually available and approved, plus `x-default` where
  appropriate. Never point language alternates to identical English output.
- Correct HTML `lang`, accessible language links and navigation that stays in the chosen locale.
- Sitemap language alternates only for published translations. Draft/noindex applies to all unapproved versions.
- No forced IP/geolocation redirect. Let patients choose and link between equivalent pages.

Do not change all routes in the same release as a medical content batch. Test routing and canonicals separately first.
The current language switcher provides visitor convenience but is not evidence of Hindi/Gujarati/Marathi indexing.

## 8. Physician-review-first workflow

Suggested file-based workflow (no new CMS dependency required):

1. `planned` — intent brief, source links, canonical target and scope confirmed.
2. `draft` — English draft exists; public preview is noindex and outside published listings.
3. `clinical_review` — doctor checks claims, scope, referrals, evidence and red flags.
4. `translation_review` — HI/GU/MR written and reviewed by fluent reviewers; doctor checks clinical meaning per locale.
5. `ready_for_qa` — authorised images, citations, metadata, links and consent/conversion wording checked.
6. `approved` — named reviewer and true date recorded for the exact version/locale.
7. `published` — explicit release decision; add approved links, sitemap entries and analytics events together.
8. `review_due` — schedule based on clinical risk and guideline changes; urgent safety changes bypass the normal queue.

A future content record should support publication status, category ID, keywords, references with URLs, featured-image
provenance (optional), publication/modification timestamps and locale-specific review records. Do not publish a
condition just because its status was omitted or because its English version was approved.

## 9. Conversion measurement and privacy

The KPI is **qualified enquiries and appointments**, not page count or raw traffic.

Before measuring, confirm which analytics and consent tools are actually configured; do not assume the presence of a
Search Console verification file means the property or an analytics account is configured.

Use non-sensitive events only, for example CTA type, page path/category, language and a success/error flag. Never send
names, phone numbers, free-text symptoms, form payloads or reports to analytics, advertising systems, URLs or logs.
A WhatsApp or telephone click is an enquiry action, **not** a confirmed booking. Avoid including identifiable health
information in prefilled URLs or conversion labels.

The clinic should record the follow-up stages privately: enquiry received, clinically relevant, contacted, appointment
agreed, attended. Report conversion rates only with a clear denominator and enough data. Use the first month after
release to establish a baseline; choose improvement targets after real observations, not arbitrary percentages.

Review Search Console impressions/clicks/query intent by page cluster approximately monthly. Submit the sitemap once
when the property is set up; ordinary content changes should flow through the generated sitemap without repeated
manual submissions. Rankings and indexing are not guaranteed.

## 10. Batch-level technical validation

Before each release:

1. Run `node scripts/audit-expansion.cjs` (backlog integrity, duplicate slugs, translations present, related targets exist,
   and drafts excluded from the sitemap).
2. Run `npx next typegen`, `npm exec tsc -- --noEmit --pretty false`, and `npm run build`.
3. Run the production preview and verify `/api/health`.
4. Run `npx playwright test tests/expansion-release.spec.ts` against the preview. It checks representative EN/HI/GU/MR
   journeys, the mobile Gujarati switcher, draft SEO and consent. Form submissions in these tests are mocked.
5. Crawl all published canonical URLs and internal links; check status, one H1, metadata, canonical, rendering and mobile
   layout. Proposed URLs in the CSV are not yet routes and must not be included in a live crawl.
6. Inspect schema syntax and medical attribution; rich-result eligibility is not guaranteed by schema presence.
7. Validate images, accessibility, mobile performance and Core Web Vitals on the actual Netlify deployment.
8. With clinic approval, send one synthetic enquiry through live production, confirm receipt in storage and email, then
   remove test records according to the retention policy. Local mocked tests do not prove live email delivery.
9. Preserve existing important URLs; document any intentional permanent redirects.

The current rate limiter is per instance and the current enquiry schema reuses legacy child-oriented field names.
Before scaling, confirm abuse controls, retention/access policy, consent evidence, server validation, and stable
health-category codes. Do not silently repurpose old category codes while claiming reliable conversion reporting.

## 11. Owners and scheduling

| Role | Responsibility |
|---|---|
| Clinic/Dr. Priyanka | Scope confirmation, medical approval, credentials and clinic details, real images, referral and treatment availability |
| Medical editor | Search intent brief, trustworthy source verification, original content and evidence boundaries |
| HI/GU/MR reviewers | Natural language and complete safety meaning; document approvals |
| Developer | Publication gate, content model, links, rendering, metadata, sitemap, routing, form privacy and automated checks |
| Clinic coordinator | Timely follow-up, qualified enquiry classification and appointment/attendance tracking |

Do not attach a guaranteed completion date without reviewer availability. A sensible first cycle is Gate 0 plus one
3–5-page children's micro-batch; assess review capacity and clinic feedback before scheduling the rest. Split the
8-page clusters into 4+4 and the 11-page cluster into 4+4+3. Foundations can be researched in parallel but use the same
review gates. Specialist-gated candidates have no publication deadline and may never be appropriate for this clinic.

## 12. Research references for planning

These links were checked for planning context, not as proof of efficacy for any Ayurvedic treatment. Each future page
still needs its own current clinical sources and physician review:

- Google Search Central: [Tell Google about localised versions](https://developers.google.com/search/docs/specialty/international/localized-versions).
- Google Search Central: [Developer search guide](https://developers.google.com/search/docs/fundamentals/get-started-developers).
- NCCIH: [Ayurvedic Medicine: In Depth](https://www.nccih.nih.gov/health/ayurvedic-medicine-in-depth), including evidence and product safety limitations.
- NIDDK: [Constipation in children](https://www.niddk.nih.gov/health-information/digestive-diseases/constipation-children).
- NHS: [Acne](https://www.nhs.uk/conditions/acne/) and [allergic rhinitis](https://www.nhs.uk/conditions/allergic-rhinitis/).

## 13. What this work does and does not deliver

**Delivered now:** latest-repository file verification, an exact content inventory, all-142-topic disposition CSV, this
prioritised Phase 4 plan, and repeatable read-only/data/browser release checks.

**Not delivered by planning:** new medical pages, physician approvals, official-register verification, new translated
SEO URLs, clinical validation of existing claims, real clinic images, access to Netlify or Search Console, or a verified
live appointment/email flow. The previous blanket statement that all original requirements were met was too broad;
this plan records the outstanding work explicitly.
