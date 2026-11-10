import { useEffect, useMemo, type ReactNode } from "react";
import { RouterProvider, usePathname } from "@/lib/router";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { SkipLink } from "@/components/SkipLink";
import { FloatingActions } from "@/components/FloatingActions";
import {
  HomeContent,
  AboutDoctorView,
  ChildHealthHubView,
  ConditionsIndexView,
  TreatmentsIndexView,
  ArticlesIndexView,
  FaqHubView,
  ContactPageView,
  PrivacyPageView,
  TermsPageView,
  SitemapPageView,
  NotFoundView,
  ConditionTemplateView,
  TreatmentTemplateView,
  ArticleTemplateView,
  LocalTemplateView,
} from "@/components/PageViews";
import { SeoReadinessPanel } from "@/components/SeoReadinessPanel";
import { buildJsonLd, buildHomeFaqJsonLd } from "@/lib/jsonld";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  medicalWebPageJsonLd,
  localBusinessJsonLd,
} from "@/seo/config";
import { SITE, SEO } from "@/content/site";
import { LOCAL_PAGES } from "@/content/local";
import { CONDITIONS_1 } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS } from "@/content/treatments";
import { ARTICLES } from "@/content/articles";
import { PAGES_DICTIONARY } from "@/i18n/pagesDictionary";

const ALL_CONDITIONS = [...CONDITIONS_1, ...CONDITIONS_2];

/* --------------------------------------------------------------------------
 * JSON-LD — same structured data the Next.js pages emit server-side.
 * ----------------------------------------------------------------------- */
function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function NoIndex({ children }: { children: ReactNode }) {
  useEffect(() => {
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previous = robots?.content;
    if (robots) robots.content = "noindex, nofollow";
    return () => { if (robots && previous !== undefined) robots.content = previous; };
  }, []);
  return <>{children}</>;
}

/* --------------------------------------------------------------------------
 * Client version of /seo-readiness (the Next.js page used node:fs; the static
 * build derives the same inventory from the content modules).
 * ----------------------------------------------------------------------- */
function SeoReadinessPage() {
  const corePaths = [
    { path: "/", priority: 1.0 },
    { path: "/about-doctor", priority: 0.9 },
    { path: "/child-health", priority: 0.9 },
    { path: "/conditions", priority: 0.9 },
    { path: "/treatments", priority: 0.9 },
    { path: "/articles", priority: 0.85 },
    { path: "/faq", priority: 0.8 },
    { path: "/contact", priority: 0.9 },
    { path: "/privacy-policy", priority: 0.4 },
    { path: "/terms", priority: 0.4 },
    { path: "/sitemap", priority: 0.5 },
  ];
  const dynamicPaths = [
    ...ALL_CONDITIONS.map((c) => ({ path: `/conditions/${c.slug}`, priority: 0.85 })),
    ...TREATMENTS.map((t) => ({ path: `/${t.base}/${t.slug}`, priority: 0.85 })),
    ...ARTICLES.map((a) => ({ path: `/articles/${a.slug}`, priority: 0.8 })),
    ...LOCAL_PAGES.map((l) => ({ path: `/${l.slug}`, priority: 0.85 })),
  ];
  const entries = [...corePaths, ...dynamicPaths].map((item) => ({
    url: item.path === "/" ? SITE.siteUrl : `${SITE.siteUrl}${item.path}`,
    priority: item.priority,
  }));

  // Files present in public/ that match the Google search-console pattern.
  const googleHtmlFiles = ["googlee49bea6a559ecaf4.html"];

  return (
    <main id="main" className="bg-[#fffdf8]">
      <div className="bg-forest-950 text-cream-50 pt-28 sm:pt-32 pb-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-saffron-300">Owner Search Diagnostic • Noindex</p>
          <h1 className="mt-2 font-display font-light text-[clamp(2rem,4.5vw,2.8rem)] leading-tight">
            Google &amp; Bing Search Indexing Readiness
          </h1>
          <p className="mt-2.5 max-w-3xl text-[15px] text-cream-100/80 leading-relaxed">
            Saved public-site audit, XML sitemap inventory, and owner setup steps for{" "}
            <strong className="font-semibold text-white">{SITE.clinicName}</strong> ({SITE.doctorName}, Reg. No. {SITE.registrationNumber}).
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <SeoReadinessPanel
          summary={{
            siteUrl: SITE.siteUrl,
            isCustomDomain: !SITE.siteUrl.includes(".netlify.app"),
            clinicName: SITE.clinicName,
            doctorName: SITE.doctorName,
            registrationNumber: SITE.registrationNumber,
            totalUrls: entries.length,
            breakdown: {
              corePages: 11,
              conditionPages: ALL_CONDITIONS.length,
              treatmentPages: TREATMENTS.length,
              articlePages: ARTICLES.length,
              localIndorePages: LOCAL_PAGES.length,
            },
            urls: entries.map((e) => ({
              url: e.url,
              path: e.url.replace(SITE.siteUrl, "") || "/",
              priority: e.priority,
            })),
            googleHtmlFiles,
            googleMetaConfigured: Boolean(SEO.verification.google),
            bingMetaConfigured: Boolean(SEO.verification.bing),
            indexNowConfigured: false,
          }}
        />
      </div>
    </main>
  );
}

/* --------------------------------------------------------------------------
 * Route resolution — mirrors the Next.js [section]/[slug] page logic.
 * ----------------------------------------------------------------------- */
const TOP_LEVEL_REDIRECTS: Record<string, string> = {
  about: "/about-doctor",
  doctor: "/about-doctor",
  "contact-us": "/contact",
  privacy: "/privacy-policy",
  "owner-checklist": "/about-doctor",
};

const NESTED_REDIRECTS: Record<string, string> = {
  "conditions/speech-delay": "/conditions/speech-delay-in-children",
  "conditions/adhd": "/conditions/adhd-in-children",
};

function Routes() {
  const path = usePathname();
  const en = PAGES_DICTIONARY.en;

  const parts = path.split("/").filter(Boolean).map((p) => p.toLowerCase());

  // Redirects (same as the Next.js pages' permanentRedirect calls).
  useEffect(() => {
    if (parts.length === 1 && TOP_LEVEL_REDIRECTS[parts[0]]) {
      window.location.hash = TOP_LEVEL_REDIRECTS[parts[0]];
      return;
    }
    if (parts.length === 2 && NESTED_REDIRECTS[`${parts[0]}/${parts[1]}`]) {
      window.location.hash = NESTED_REDIRECTS[`${parts[0]}/${parts[1]}`];
    }
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep <title> in sync with the route's server-side metadata.
  useEffect(() => {
    let title = SEO.title;
    if (parts.length === 0) title = SEO.title;
    else if (parts[0] === "about-doctor") title = en.staticPages.about.seoTitle;
    else if (parts[0] === "child-health")
      title = "Child Health Hub | Growth, Immunity, Behaviour & Nutrition";
    else if (parts[0] === "conditions" && parts.length === 1)
      title = "Child Health Conditions Library (A–Z) | BalChikitsa Indore";
    else if (parts[0] === "treatments" && parts.length === 1)
      title = "Treatments & Services | Suvarnaprashan, Panchakarma, Consultation";
    else if (parts[0] === "articles" && parts.length === 1)
      title = "Health Articles Library | Child & Family Health Guides";
    else if (parts[0] === "faq") title = "Frequently Asked Questions | BalChikitsa Ayurved Clinic";
    else if (parts[0] === "contact") title = en.staticPages.contact.seoTitle;
    else if (parts[0] === "privacy-policy") title = en.staticPages.privacy.seoTitle;
    else if (parts[0] === "terms") title = en.staticPages.terms.seoTitle;
    else if (parts[0] === "sitemap") title = en.staticPages.sitemap.seoTitle;
    else if (parts[0] === "seo-readiness")
      title = "Search Engine Readiness & Indexing Checklist";
    else {
      const loc = LOCAL_PAGES.find((l) => l.slug === parts[0]);
      if (loc) title = loc.seoTitle;
      else if (parts[0] === "conditions" && parts[1]) {
        const cond = ALL_CONDITIONS.find((c) => c.slug === parts[1]);
        if (cond) title = cond.seoTitle;
      } else if ((parts[0] === "treatments" || parts[0] === "services") && parts[1]) {
        const treat = TREATMENTS.find((tr) => tr.base === parts[0] && tr.slug === parts[1]);
        if (treat) title = treat.seoTitle;
      } else if (parts[0] === "articles" && parts[1]) {
        const art = ARTICLES.find((a) => a.slug === parts[1]);
        if (art) title = art.seoTitle;
      } else {
        title = "Page Not Found | BalChikitsa Ayurved Clinic";
      }
    }
    document.title = title;
  }, [path, en]); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirect targets render nothing (the effect navigates away).
  const isRedirect =
    (parts.length === 1 && Boolean(TOP_LEVEL_REDIRECTS[parts[0]])) ||
    (parts.length === 2 && Boolean(NESTED_REDIRECTS[`${parts[0]}/${parts[1]}`]));
  if (isRedirect) return null;

  // ---- Home -------------------------------------------------------------
  if (parts.length === 0) {
    return (
      <>
        <JsonLd data={buildHomeFaqJsonLd()} />
        <HomeContent />
      </>
    );
  }

  const section = parts[0];

  // ---- Top-level section pages -----------------------------------------
  if (section === "about-doctor" && parts.length === 1) {
    return (
      <>
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "About the Doctor", path: "/about-doctor" },
            ]),
            localBusinessJsonLd(),
          ]}
        />
        <AboutDoctorView />
      </>
    );
  }

  if (section === "child-health" && parts.length === 1) {
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Child Health", path: "/child-health" },
          ])}
        />
        <ChildHealthHubView />
      </>
    );
  }

  if (section === "conditions" && parts.length === 1) {
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Conditions", path: "/conditions" },
          ])}
        />
        <ConditionsIndexView />
      </>
    );
  }

  if (section === "treatments" && parts.length === 1) {
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Treatments", path: "/treatments" },
          ])}
        />
        <TreatmentsIndexView />
      </>
    );
  }

  if (section === "articles" && parts.length === 1) {
    return (
      <>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
          ])}
        />
        <ArticlesIndexView />
      </>
    );
  }

  if (section === "faq" && parts.length === 1) {
    const allFaqs = en.hubs.faqGroups.flatMap((g) => g.faqs);
    return (
      <>
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "FAQ", path: "/faq" },
            ]),
            faqJsonLd(allFaqs),
          ]}
        />
        <FaqHubView />
      </>
    );
  }

  if (section === "contact" && parts.length === 1) {
    return (
      <>
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Contact", path: "/contact" },
            ]),
            localBusinessJsonLd(),
          ]}
        />
        <ContactPageView />
      </>
    );
  }

  if (section === "privacy-policy" && parts.length === 1) return <PrivacyPageView />;
  if (section === "terms" && parts.length === 1) return <TermsPageView />;
  if (section === "sitemap" && parts.length === 1) return <SitemapPageView />;
  if (section === "seo-readiness" && parts.length === 1) return <NoIndex><SeoReadinessPage /></NoIndex>;

  // ---- Local Indore landing pages --------------------------------------
  const loc = LOCAL_PAGES.find((l) => l.slug === section && parts.length === 1);
  if (loc) {
    const pathStr = `/${loc.slug}`;
    return (
      <>
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: loc.title, path: pathStr },
            ]),
            medicalWebPageJsonLd({
              path: pathStr,
              name: loc.h1,
              description: loc.seoDescription,
            }),
            faqJsonLd(loc.faqs),
          ]}
        />
        <LocalTemplateView page={loc} />
      </>
    );
  }

  // ---- Nested detail pages ---------------------------------------------
  if (parts.length === 2) {
    const [sec, sl] = parts;

    if (sec === "conditions") {
      const cond = ALL_CONDITIONS.find((c) => c.slug === sl);
      if (cond) {
        const pathStr = `/conditions/${cond.slug}`;
        return (
          <>
            <JsonLd
              data={[
                breadcrumbJsonLd([
                  { name: "Home", path: "/" },
                  { name: "Conditions", path: "/conditions" },
                  { name: cond.title, path: pathStr },
                ]),
                medicalWebPageJsonLd({
                  path: pathStr,
                  name: cond.h1,
                  description: cond.seoDescription,
                  about: cond.title,
                }),
                faqJsonLd(cond.faqs),
              ]}
            />
            <ConditionTemplateView page={cond} />
          </>
        );
      }
    }

    if (sec === "treatments" || sec === "services") {
      const treat = TREATMENTS.find((tr) => tr.base === sec && tr.slug === sl);
      if (treat) {
        const pathStr = `/${treat.base}/${treat.slug}`;
        return (
          <>
            <JsonLd
              data={[
                breadcrumbJsonLd([
                  { name: "Home", path: "/" },
                  { name: "Treatments", path: "/treatments" },
                  { name: treat.title, path: pathStr },
                ]),
                medicalWebPageJsonLd({
                  path: pathStr,
                  name: treat.h1,
                  description: treat.seoDescription,
                }),
                faqJsonLd(treat.faqs),
              ]}
            />
            <TreatmentTemplateView page={treat} />
          </>
        );
      }
    }

    if (sec === "articles") {
      const art = ARTICLES.find((a) => a.slug === sl);
      if (art) {
        const pathStr = `/articles/${art.slug}`;
        return (
          <>
            <JsonLd
              data={[
                breadcrumbJsonLd([
                  { name: "Home", path: "/" },
                  { name: "Articles", path: "/articles" },
                  { name: art.title, path: pathStr },
                ]),
                medicalWebPageJsonLd({
                  path: pathStr,
                  name: art.h1,
                  description: art.seoDescription,
                }),
                faqJsonLd(art.faqs),
              ]}
            />
            <ArticleTemplateView page={art} />
          </>
        );
      }
    }
  }

  return <NoIndex><NotFoundView /></NoIndex>;
}

/* --------------------------------------------------------------------------
 * App shell — mirrors the Next.js root layout.
 * ----------------------------------------------------------------------- */
function Shell() {
  return (
    <LanguageProvider>
      <SkipLink />
      <SiteHeader />
      <Routes />
      <SiteFooter />
      <FloatingActions />
    </LanguageProvider>
  );
}

export default function App() {
  // Global JSON-LD (MedicalClinic / Doctor / Website graph) — same as layout.
  const globalJsonLd = useMemo(() => buildJsonLd(), []);

  return (
    <RouterProvider>
      <Shell />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(globalJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </RouterProvider>
  );
}
