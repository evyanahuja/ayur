/* =============================================================================
 * SITE.TS ALWAYS WINS
 * -----------------------------------------------------------------------------
 * The doctor edits content in src/content/site.ts — that file is promised to be
 * the single source of truth. The four language dictionaries were seeded from
 * the same dummy copy, so components that read the dictionary silently ignored
 * site.ts edits (the "my testimonial change isn't showing" bug).
 *
 * This module merges the two: for every translatable string we compare the
 * CURRENT site.ts value against the shipped English default (en dictionary).
 *   - unchanged  → keep the translation (Hindi/Marathi/Gujarati still work)
 *   - customised → the site.ts text is used in ALL languages
 * So real patient stories, edited FAQs, new timings etc. always appear, and
 * translations can be added later in the dictionaries when desired.
 * ========================================================================== */

import { en, type Dictionary } from "./dictionaries/en";
import {
  SITE,
  STATS,
  NAV_LINKS,
  CONDITIONS,
  SPECIALTIES,
  METHOD_STEPS,
  THERAPIES,
  BENEFITS,
  COMPARE,
  TESTIMONIALS,
  MINI_WINS,
  FEATURED_QUOTE,
  PLANS,
  FAQS,
  CONCERNS,
} from "@/content/site";

/** site value wins the moment it differs from the shipped default. */
function s(siteValue: string, defaultValue: string | undefined, translated: string | undefined): string {
  if (translated === undefined) return siteValue;
  return siteValue === defaultValue ? translated : siteValue;
}

/** Element-wise merge for string arrays; length follows site.ts. */
function sArr(siteArr: string[], defArr: string[] | undefined, trArr: string[] | undefined): string[] {
  return siteArr.map((v, i) => s(v, defArr?.[i], trArr?.[i]));
}

/** FAQ answers / therapy blurbs in site.ts were written as template literals,
 * so their placeholders are already resolved. Resolve the dictionary default
 * the same way (with CURRENT site/stats values) so "unchanged" compares true. */
const resolveFaq = (a: string) =>
  a
    .replace("{cities}", String(STATS.citiesServed))
    .replace("{hours}", SITE.hours)
    .replace("{languages}", SITE.languages);
const resolveTherapy = (d: string) => d.replace("{count}", String(STATS.suvarnaprashanKids));

export function withSiteContent(tr: Dictionary): Dictionary {
  const d = en;
  return {
    ...tr,
    nav: {
      ...tr.nav,
      links: NAV_LINKS.map((l, i) => s(l.label, d.nav.links[i], tr.nav.links[i])),
    },
    site: {
      ...tr.site,
      hours: s(SITE.hours, d.site.hours, tr.site.hours),
      hoursNote: s(SITE.hoursNote, d.site.hoursNote, tr.site.hoursNote),
      languages: s(SITE.languages, d.site.languages, tr.site.languages),
      whatsappMessage: s(SITE.whatsappMessage, d.site.whatsappMessage, tr.site.whatsappMessage),
      addressShort: s(SITE.addressShort, d.site.addressShort, tr.site.addressShort),
      addressFull: s(SITE.addressFull, d.site.addressFull, tr.site.addressFull),
    },
    socialProof: {
      ...tr.socialProof,
      conditions: CONDITIONS.map((c, i) => s(c.label, d.socialProof.conditions[i], tr.socialProof.conditions[i])),
    },
    specialties: {
      ...tr.specialties,
      items: SPECIALTIES.map((sp, i) => ({
        tag: s(sp.tag, d.specialties.items[i]?.tag, tr.specialties.items[i]?.tag),
        title: s(sp.title, d.specialties.items[i]?.title, tr.specialties.items[i]?.title),
        subtitle: s(sp.subtitle, d.specialties.items[i]?.subtitle, tr.specialties.items[i]?.subtitle),
        desc: s(sp.desc, d.specialties.items[i]?.desc, tr.specialties.items[i]?.desc),
        points: sArr(sp.points, d.specialties.items[i]?.points, tr.specialties.items[i]?.points),
        result: s(sp.result, d.specialties.items[i]?.result, tr.specialties.items[i]?.result),
      })),
    },
    method: {
      ...tr.method,
      steps: METHOD_STEPS.map((st, i) => ({
        title: s(st.title, d.method.steps[i]?.title, tr.method.steps[i]?.title),
        time: s(st.time, d.method.steps[i]?.time, tr.method.steps[i]?.time),
        desc: s(st.desc, d.method.steps[i]?.desc, tr.method.steps[i]?.desc),
      })),
      therapies: THERAPIES.map((th, i) => ({
        name: s(th.name, d.method.therapies[i]?.name, tr.method.therapies[i]?.name),
        tag: s(th.tag, d.method.therapies[i]?.tag, tr.method.therapies[i]?.tag),
        desc: s(
          th.desc,
          d.method.therapies[i] ? resolveTherapy(d.method.therapies[i].desc) : undefined,
          tr.method.therapies[i]?.desc
        ),
      })),
    },
    benefits: {
      ...tr.benefits,
      items: BENEFITS.map((b, i) => ({
        title: s(b.title, d.benefits.items[i]?.title, tr.benefits.items[i]?.title),
        desc: s(b.desc, d.benefits.items[i]?.desc, tr.benefits.items[i]?.desc),
      })),
      compare: COMPARE.map((c, i) => ({
        label: s(c.label, d.benefits.compare[i]?.label, tr.benefits.compare[i]?.label),
        quick: s(c.quick, d.benefits.compare[i]?.quick, tr.benefits.compare[i]?.quick),
        ayur: s(c.ayur, d.benefits.compare[i]?.ayur, tr.benefits.compare[i]?.ayur),
      })),
    },
    testimonials: {
      ...tr.testimonials,
      items: TESTIMONIALS.map((tm, i) => ({
        name: s(tm.name, d.testimonials.items[i]?.name, tr.testimonials.items[i]?.name),
        role: s(tm.role, d.testimonials.items[i]?.role, tr.testimonials.items[i]?.role),
        text: s(tm.text, d.testimonials.items[i]?.text, tr.testimonials.items[i]?.text),
        tag: s(tm.tag, d.testimonials.items[i]?.tag, tr.testimonials.items[i]?.tag),
      })),
      miniWins: MINI_WINS.map((w, i) => ({
        q: s(w.q, d.testimonials.miniWins[i]?.q, tr.testimonials.miniWins[i]?.q),
        n: s(w.n, d.testimonials.miniWins[i]?.n, tr.testimonials.miniWins[i]?.n),
      })),
      featured: {
        text: s(FEATURED_QUOTE.text, d.testimonials.featured.text, tr.testimonials.featured.text),
        name: s(FEATURED_QUOTE.name, d.testimonials.featured.name, tr.testimonials.featured.name),
        detail: s(FEATURED_QUOTE.detail, d.testimonials.featured.detail, tr.testimonials.featured.detail),
      },
    },
    pricing: {
      ...tr.pricing,
      plans: PLANS.map((p, i) => ({
        name: s(p.name, d.pricing.plans[i]?.name, tr.pricing.plans[i]?.name),
        sub: s(p.hindi, d.pricing.plans[i]?.sub, tr.pricing.plans[i]?.sub),
        period: s(p.period, d.pricing.plans[i]?.period, tr.pricing.plans[i]?.period),
        desc: s(p.desc, d.pricing.plans[i]?.desc, tr.pricing.plans[i]?.desc),
        features: sArr(p.features, d.pricing.plans[i]?.features, tr.pricing.plans[i]?.features),
        cta: s(p.cta, d.pricing.plans[i]?.cta, tr.pricing.plans[i]?.cta),
      })),
    },
    faq: {
      ...tr.faq,
      items: FAQS.map((f, i) => ({
        q: s(f.q, d.faq.items[i]?.q, tr.faq.items[i]?.q),
        a: s(f.a, d.faq.items[i] ? resolveFaq(d.faq.items[i].a) : undefined, tr.faq.items[i]?.a),
      })),
    },
    booking: {
      ...tr.booking,
      concerns: CONCERNS.map((c, i) => s(c.label, d.booking.concerns[i], tr.booking.concerns[i])),
    },
  };
}
