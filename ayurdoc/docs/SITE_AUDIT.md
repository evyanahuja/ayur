# AyurvedDoctor: Audit, Changes and Physician Review Queue

Scope: the existing Next.js project (GitHub `evyanahuja/ayur`, folder `ayurdoc/`, deployed on Netlify) was adopted as the
base for this work. Existing design, i18n (EN/HI/MR/GU), enquiry API, email delivery and URLs are preserved.

## 1. Inventory before changes

| Area | Existing routes | Notes |
|---|---|---|
| Home | `/` | Hero, counters, avatars, testimonials, specialty cards, FAQ, booking |
| Doctor | `/about-doctor` (`/about`, `/doctor` redirect) | Qualifications and clinic details |
| Conditions | `/conditions` (A–Z), `/conditions/<slug>` (22 guides) | Child-focused categories |
| Treatments | `/treatments`, `/treatments/<slug>` (12 incl. sub-pages), `/services/<slug>` (2) | Suvarnaprashan, Panchakarma, Abhyanga, Shirodhara, Basti, Nasya |
| Articles | `/articles`, `/articles/<slug>` (23) | Child and general health |
| Local | `/ayurvedic-doctor-indore` | Local landing |
| Support | `/child-health`, `/faq`, `/contact`, `/privacy-policy`, `/terms`, `/sitemap` | Contact has enquiry form |
| Tools | `/seo-readiness` (noindex), `/api/seo/*`, `/api/geo`, `/api/health`, `/api/inquiries` | Internal tooling |
| SEO | `/sitemap.xml`, `/robots.txt`, `/indexnow-key.txt`, `BingSiteAuth.xml`, Google verification file | Present |

### Problems found in the existing site

1. Unverifiable figures presented as facts: "1000+ children guided", "92% parents report improvement", "4.9 rating",
   "100+ parent reviews", "40+ cities", "500+ kids enrolled". Also present in structured data descriptions and the
   Open Graph image.
2. Fabricated testimonials and outcomes (named patients, percentages, "resolved in 5 weeks", height percentile changes).
3. Outcome timelines and guarantees ("visible calm in 3–6 weeks", "better appetite in 2–4 weeks").
4. Cure and root-cause language ("heal the root cause", "no steroids-first") and a comparison table that disparaged
   conventional treatment ("suppress symptom fast").
5. Suvarnaprashan described as "immunisation-like" without stating that it is not a vaccine substitute.
6. Enquiry form asked for "Child's name" for every visitor, had no consent checkbox, no rate limiting.
7. Patient avatars were stock photographs placed next to a patient counter.
8. Doctor and clinic images are AI-generated placeholders (per the repository README).
9. Hero and sections were child-only, so adult and senior searches had no landing content.
10. No condition guides for common adult searches (acidity, psoriasis, PCOS, knee pain, migraine, and others).

### Duplicate and overlap review

- "Poor appetite" (`poor-appetite-children`) and "Poor weight gain" (`growth-nutrition-concerns`) overlap. The existing
  pages are kept, and the brief's "poor weight gain" intent is served by `growth-nutrition-concerns`. No new page was added.
- "Constipation" (children) is kept. Adult and older-age constipation is a separate guide (`constipation-adults`) with
  different intent, so the two do not compete.
- Panchakarma and Abhyanga, Shirodhara, Basti and Nasya already exist. Rasayana and Diet & Lifestyle are new.
- Broken links: not exhaustively crawled in this session. Run a link check on the deployed site.

## 2. Changes made

- **Homepage:** all-age headline and subheading, six health-concern cards, Panchakarma and therapy cards, consultation
  steps, "Why choose" points, popular guides, articles, pricing, FAQ, author box, clinic location with embedded map,
  booking form, and closing CTA. Fabricated counters, avatars, ratings and testimonials were removed from the homepage.
- **Navigation:** Conditions dropdown lists the ten health-concern categories and links to the A–Z library. Treatments
  dropdown lists the eight requested treatments.
- **Category landing pages:** `/health-concerns` hub and ten `/health-concerns/<slug>` pages with approach, common
  concerns, linked guides and treatments, FAQs, CTAs and cross-links.
- **Condition template:** draft notice where applicable, author box labelled "Medical review pending" for drafts,
  table of contents, CTA after the introduction, CTA after the Ayurvedic section, "Looking for an Ayurvedic
  consultation?" section, and closing CTA.
- **New condition guides (draft, noindex):** acidity-gerd, piles-hemorrhoids, constipation-adults, psoriasis, eczema,
  hair-fall, pcos-pcod, knee-pain, migraine, insomnia.
- **New treatment pages:** `/treatments/rasayana`, `/treatments/ayurvedic-diet-lifestyle`.
- **Enquiry form and API:** consent checkbox (required, server-validated), privacy policy link, patient (not child)
  labels in English, clear "enquiry, not a confirmed appointment" messaging, honeypot retained, per-client rate limit.
- **SEO:** unique titles and descriptions for new pages, canonical URLs, Open Graph and Twitter metadata, sitemap built
  from the content registries (drafts excluded), robots.txt with API routes disallowed, JSON-LD for WebSite, Physician,
  MedicalClinic, BreadcrumbList and FAQPage. No aggregate ratings or review markup.
- **Security:** CSP and proxy headers allow only the Google Maps embed as an additional frame source.

## 3. Content requiring physician review

Every item below must be checked by Dr. Priyanka Likhar before publication. Draft items must be approved, then changed
to `status: "published"` in their content file and given a `reviewedOn` date.

| Item | Location | Status |
|---|---|---|
| Acidity & GERD | `src/content/conditions3.ts` | Draft (noindex) |
| Piles (Haemorrhoids) | `src/content/conditions3.ts` | Draft (noindex) |
| Constipation in Adults | `src/content/conditions3.ts` | Draft (noindex) |
| Psoriasis | `src/content/conditions3.ts` | Draft (noindex) |
| Eczema (Atopic Dermatitis) | `src/content/conditions3.ts` | Draft (noindex) |
| Hair Fall | `src/content/conditions4.ts` | Draft (noindex) |
| PCOS / PCOD | `src/content/conditions4.ts` | Draft (noindex) |
| Knee Pain | `src/content/conditions4.ts` | Draft (noindex) |
| Migraine | `src/content/conditions4.ts` | Draft (noindex) |
| Insomnia & Disturbed Sleep | `src/content/conditions4.ts` | Draft (noindex) |
| Ten health-concern category pages | `src/content/categories.ts` | Published, labelled "Medical review pending" |
| Rasayana, Ayurvedic Diet & Lifestyle | `src/content/treatments-extra.ts` | Published, needs review |
| Homepage hero, consultation steps, why-choose, homepage FAQ | `src/app/page.tsx`, `src/components/HomeSections.tsx`, `src/components/Hero.tsx` | Published, labelled "Medical review pending" |
| Reference citations (all new guides) | `references` arrays | Verify each citation against the original source |
| Existing 22 condition guides and 12 treatments | `src/content/conditions*.ts`, `src/content/treatments.ts` | Not re-audited line by line; review for safety wording |
| Existing articles (23) | `src/content/articles.ts` | Not re-audited; review for cure-style claims |
| Registration No. 63934 and degrees | Site-wide | Verify against the official register before publication |
| Dosage and procedure references | Treatment and condition pages | Confirm no dosing guidance is implied |

Key safety statements to confirm: Ayurveda is supportive and not a replacement for prescribed treatment; medicines are
never stopped on the basis of an Ayurvedic plan; Suvarnaprashan is not a vaccine substitute; red-flag and emergency
advice is accurate for each condition; pregnancy and paediatric precautions are correct.

## 4. Remaining issues and next steps

1. **Deployment:** these changes exist in this project. They must be pushed to `evyanahuja/ayur` (`ayurdoc/`) for Netlify to
   build and deploy them. Netlify deployment was not verified from this environment.
2. **Translations:** new and revised text is English-only. Hindi, Marathi and Gujarati dictionaries still contain older
   pediatric-only copy (including some claims that were removed in English). Translate after physician review.
3. **Images:** `doctor.webp` and `clinic-care.webp` / `cliniccare.webp` are AI-generated placeholders. Replace them with
   real photographs of Dr. Priyanka Likhar and the clinic. Do not use generated images of the doctor or the facility.
4. **Brand naming:** the site uses "BalChikitsa Ayurved Clinic" for the clinic and "AyurvedDoctor" for the domain.
   Choose one name for the header, footer, structured data and Google Business Profile.
5. **Google Business Profile and directories:** confirm name, address, phone, hours and category match the website
   exactly. The website uses the clinic address and hours already published on the existing site.
6. **Search Console:** verify the property, submit `sitemap.xml` once, and monitor indexing, queries and page performance.
   Do not resubmit the sitemap repeatedly.
7. **Legacy code:** `HomeContent` in `PageViews.tsx`, the Specialties, Benefits, Testimonials and SocialProof components,
   and the `FAQS`, `SPECIALTIES`, `TESTIMONIALS`, `MINI_WINS`, `FEATURED_QUOTE` and `STATS` exports in `site.ts` are no longer
   rendered on the homepage. Remove them in cleanup after review.
8. **Rate limiting:** the enquiry limiter is in-memory per server instance. Use a shared store if traffic grows.
9. **Enquiry flow:** the clinic must answer enquiries within the stated 24 hours. Form submission never confirms an
   appointment, and copy says so.
10. **Performance and accessibility:** run Lighthouse and an accessibility audit on the deployed pages, especially the
    homepage hero and the map embed on mobile.
