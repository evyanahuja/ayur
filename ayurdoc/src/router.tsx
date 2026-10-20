import { useEffect } from "react";
import { Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { ConditionsIndex, TreatmentsIndex, ArticlesIndex, ChildHealthHub, FaqHub } from "@/pages/hubs";
import { ConditionTemplate, TreatmentTemplate, ArticleTemplate, LocalTemplate } from "@/pages/templates";
import { AboutDoctor, ContactPage, PrivacyPage, TermsPage, SitemapPage, OwnerChecklist, NotFoundPage } from "@/pages/static";
import { CONDITIONS_1 } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS } from "@/content/treatments";
import { ARTICLES } from "@/content/articles";
import { LOCAL_PAGES } from "@/content/local";

const ALL_CONDITIONS = [...CONDITIONS_1, ...CONDITIONS_2];

function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function ConditionRoute() {
  const { slug = "" } = useParams();
  const page = ALL_CONDITIONS.find((c) => c.slug === slug);
  if (!page) return <NotFoundPage />;
  return <ConditionTemplate page={page} />;
}

function TreatmentRoute() {
  const { slug = "" } = useParams();
  const page = TREATMENTS.find((t) => t.slug === slug);
  if (!page) return <NotFoundPage />;
  return <TreatmentTemplate page={page} />;
}

function ArticleRoute() {
  const { slug = "" } = useParams();
  const page = ARTICLES.find((a) => a.slug === slug);
  if (!page) return <NotFoundPage />;
  return <ArticleTemplate page={page} />;
}

function LocalRoute() {
  const { slug = "" } = useParams();
  const page = LOCAL_PAGES.find((l) => l.slug === slug);
  if (!page) return <NotFoundPage />;
  return <LocalTemplate page={page} />;
}

/* Normalize: lowercase, trailing slash, strip tracking params */
export function normalizePath(raw: string): string {
  let p = raw.split("?")[0].split("#")[0] || "/";
  try { p = decodeURI(p); } catch { /* keep */ }
  p = p.toLowerCase();
  p = p.replace(/\/{2,}/g, "/");
  if (p !== "/" && !p.endsWith("/")) p += "/";
  // legacy aliases → canonical
  const aliases: Record<string, string> = {
    "/about/": "/about-doctor/",
    "/doctor/": "/about-doctor/",
    "/conditions/speech-delay/": "/conditions/speech-delay-in-children/",
    "/conditions/adhd/": "/conditions/adhd-in-children/",
    "/contact-us/": "/contact/",
    "/privacy/": "/privacy-policy/",
  };
  return aliases[p] ?? p;
}

function NormalizeGate({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const norm = normalizePath(loc.pathname);
  if (norm !== loc.pathname) return <Navigate to={norm + loc.search + loc.hash} replace />;
  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <>
      <ScrollManager />
      <NormalizeGate>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about-doctor/" element={<AboutDoctor />} />
          <Route path="/child-health/" element={<ChildHealthHub />} />
          <Route path="/conditions/" element={<ConditionsIndex />} />
          <Route path="/conditions/:slug/" element={<ConditionRoute />} />
          <Route path="/treatments/" element={<TreatmentsIndex />} />
          <Route path="/treatments/:slug/" element={<TreatmentRoute />} />
          <Route path="/services/:slug/" element={<TreatmentRoute />} />
          <Route path="/articles/" element={<ArticlesIndex />} />
          <Route path="/articles/:slug/" element={<ArticleRoute />} />
          <Route path="/faq/" element={<FaqHub />} />
          <Route path="/contact/" element={<ContactPage />} />
          <Route path="/privacy-policy/" element={<PrivacyPage />} />
          <Route path="/terms/" element={<TermsPage />} />
          <Route path="/sitemap/" element={<SitemapPage />} />
          <Route path="/owner-checklist/" element={<OwnerChecklist />} />
          {/* Local landing pages (top-level slugs) */}
          {LOCAL_PAGES.map((l) => (
            <Route key={l.slug} path={`/${l.slug}/`} element={<LocalTemplate page={l} />} />
          ))}
          {/* Back-compat: old explicit route still works via generic matcher */}
          <Route path="/:slug/" element={<LocalRoute />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </NormalizeGate>
    </>
  );
}

/* Single source for sitemap.xml generation + tests */
export function allCanonicalPaths(): string[] {
  const paths = [
    "/", "/about-doctor/", "/child-health/", "/conditions/", "/treatments/",
    "/articles/", "/faq/", "/contact/", "/privacy-policy/", "/terms/", "/sitemap/",
    ...ALL_CONDITIONS.map((c) => `/conditions/${c.slug}/`),
    ...TREATMENTS.map((t) => `/${t.base}/${t.slug}/`),
    ...ARTICLES.map((a) => `/articles/${a.slug}/`),
    ...LOCAL_PAGES.map((l) => `/${l.slug}/`),
  ];
  return [...new Set(paths)];
}
