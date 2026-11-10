"use client";

import { useEffect, useState } from "react";
import { Link } from "@/lib/router";
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Send,
  Globe,
  FileCode2,
  ShieldCheck,
} from "lucide-react";

export type SeoAuditSummary = {
  siteUrl: string;
  isCustomDomain: boolean;
  clinicName: string;
  doctorName: string;
  registrationNumber: string;
  totalUrls: number;
  breakdown: {
    corePages: number;
    conditionPages: number;
    treatmentPages: number;
    articlePages: number;
    localIndorePages: number;
  };
  urls: { url: string; path: string; priority?: number }[];
  googleHtmlFiles: string[];
  googleMetaConfigured: boolean;
  bingMetaConfigured: boolean;
  indexNowConfigured: boolean;
};

type LiveAudit = {
  checkedAt: string;
  site: string;
  summary: {
    sitemapUrls: number;
    http200: number;
    redirectingUrls: number;
    issues: Record<string, number>;
    duplicateTitles: string[];
    duplicateDescriptions: string[];
  };
  verification: {
    googleFileStatus: number;
    bingMetaConfigured: boolean;
    bingFileStatus: number;
    indexNowConfigured: boolean;
    indexNowKeyStatus: number;
  };
  limitations: string;
  browserObservations?: { checkedAt: string; findings: string[] };
};

export function SeoReadinessPanel({ summary }: { summary: SeoAuditSummary }) {
  const [audit, setAudit] = useState<LiveAudit | null>(null);
  const [auditError, setAuditError] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/search-readiness-audit.json", { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Audit unavailable");
        const data = await response.json();
        if (!data.checkedAt || !data.summary || data.site !== summary.siteUrl) throw new Error("Invalid audit snapshot");
        setAudit(data);
      })
      .catch((error) => { if (error.name !== "AbortError") setAuditError(true); });
    return () => controller.abort();
  }, [summary.siteUrl]);

  async function copyValue(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Clipboard unavailable
    }
  }

  async function triggerIndexNow() {
    if (!summary.indexNowConfigured || window.location.origin !== new URL(summary.siteUrl).origin) {
      setSubmitResult({ ok: false, message: "IndexNow must be configured and submitted from the live server. No URLs have been submitted from this preview." });
      return;
    }
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const res = await fetch("/api/seo/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setSubmitResult({
        ok: res.ok && data.ok === true,
        message:
          data.message ||
          data.error ||
          "IndexNow responded. Receipt does not confirm indexing.",
      });
    } catch {
      setSubmitResult({
        ok: false,
        message: "Network error calling /api/seo/indexnow.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const quickEndpoints = [
    {
      key: "sitemap",
      label: "XML Sitemap (Submit to Google & Bing)",
      href: "/sitemap.xml",
      fullUrl: `${summary.siteUrl}/sitemap.xml`,
    },
    {
      key: "robots",
      label: "Robots.txt Directive File",
      href: "/robots.txt",
      fullUrl: `${summary.siteUrl}/robots.txt`,
    },
    ...(summary.googleHtmlFiles[0]
      ? [
          {
            key: "gsc-file",
            label: "Google HTML Ownership Verification File",
            href: `/${summary.googleHtmlFiles[0]}`,
            fullUrl: `${summary.siteUrl}/${summary.googleHtmlFiles[0]}`,
          },
        ]
      : []),
    {
      key: "audit-json",
      label: "Live JSON SEO Diagnostic Feed",
      href: "/api/seo/audit",
      fullUrl: `${summary.siteUrl}/api/seo/audit`,
    },
  ];

  return (
    <div className="space-y-10">
      <section aria-labelledby="live-audit-heading" className="border-y border-forest-900/15 py-6">
        <p className="eyebrow text-saffron-700">Independent public-site checks</p>
        <h2 id="live-audit-heading" className="mt-2 font-display text-[26px] text-forest-950">Live Technical Audit</h2>
        {audit ? (
          <>
            <p className="mt-2 text-sm leading-relaxed text-forest-800/75">
              Snapshot checked <time dateTime={audit.checkedAt}>{new Date(audit.checkedAt).toLocaleString()}</time>. This is a saved audit, not a connection to your search-engine accounts.
            </p>
            <dl className="mt-5 divide-y divide-forest-900/10 text-sm">
              {[
                ["Sitemap URLs reachable", `${audit.summary.http200} of ${audit.summary.sitemapUrls} return HTTP 200`],
                ["Sitemap redirect chains", `${audit.summary.redirectingUrls} detected`],
                ["Titles and descriptions", `${audit.summary.duplicateTitles.length} duplicate titles; ${audit.summary.duplicateDescriptions.length} duplicate descriptions`],
                ["Canonical, heading and JSON-LD syntax checks", Object.keys(audit.summary.issues).length ? "Issues found. See the saved audit report." : "Passed for every sitemap URL"],
                ["Google ownership file", audit.verification.googleFileStatus === 200 ? "File accessible; account verification still requires owner confirmation" : "File not accessible"],
                ["Bing ownership", audit.verification.bingMetaConfigured || audit.verification.bingFileStatus === 200 ? "Public token found; account verification unconfirmed" : "No public token found. Import from Search Console or verify in Bing."],
                ["IndexNow", audit.verification.indexNowConfigured ? "Configured; no submission was made by this audit" : "Not configured. Optional for discovery, not required for indexing."],
                ["Actual search listing", "Not verified. Check Google Search Console and Bing URL Inspection."],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-1 py-3 sm:grid-cols-[minmax(180px,0.8fr)_1.5fr] sm:gap-6">
                  <dt className="font-semibold text-forest-950">{label}</dt>
                  <dd className="text-forest-800/80">{value}</dd>
                </div>
              ))}
            </dl>
            {!!audit.browserObservations?.findings.length && (
              <div className="mt-5 border-l-2 border-amber-500 pl-4 text-sm leading-relaxed text-amber-950">
                <p className="font-semibold">Outstanding Live Browser Findings</p>
                {audit.browserObservations.findings.map((finding) => <p key={finding} className="mt-1">{finding}</p>)}
                <p className="mt-2 text-xs">Browser snapshot: {new Date(audit.browserObservations.checkedAt).toLocaleString()}. Fixes were tested in a local production build, not deployed. Recheck the public site after deployment.</p>
              </div>
            )}
            <p className="mt-4 text-xs leading-relaxed text-forest-800/70">{audit.limitations}</p>
          </>
        ) : <p className="mt-3 text-sm text-forest-800/75" role="status">{auditError ? "No verified audit snapshot is available. Run python3 scripts/audit_live_seo.py to create one." : "Loading saved audit results..."}</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-forest-950 px-4 py-2.5 text-sm font-medium text-cream-50">Open Search Console <ExternalLink className="h-3.5 w-3.5" /></a>
          <a href="https://www.bing.com/webmasters/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-forest-900/20 px-4 py-2.5 text-sm font-medium text-forest-950">Open Bing Webmaster Tools <ExternalLink className="h-3.5 w-3.5" /></a>
        </div>
      </section>
      <p className="text-sm leading-relaxed text-forest-800/80">This Vite preview is separate from the live Next.js deployment. Its hash-based routes and browser-rendered metadata are not a replacement for the production site's server-rendered, indexable URLs.</p>
      {/* Status KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-forest-900/10 bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-800/60">
            Configured URL Inventory
          </p>
          <p className="mt-2 font-display text-3xl text-forest-950">
            {summary.totalUrls}
          </p>
          <p className="mt-1 text-[12.5px] text-forest-800/70">
            {summary.breakdown.conditionPages} conditions •{" "}
            {summary.breakdown.treatmentPages} treatments •{" "}
            {summary.breakdown.localIndorePages} local pages
          </p>
        </div>

        <div className="rounded-2xl border border-forest-900/10 bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-800/60">
            Google Search Console
          </p>
          <div className="mt-2 flex items-center gap-2">
            {summary.googleHtmlFiles.length > 0 || summary.googleMetaConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <span className="font-semibold text-[15px] text-forest-950">
              {summary.googleHtmlFiles.length > 0
                ? "HTML File Ready"
                : summary.googleMetaConfigured
                  ? "Meta Tag Active"
                  : "Set Token"}
            </span>
          </div>
          <p className="mt-1 text-[12.5px] text-forest-800/70">
            {summary.googleHtmlFiles[0] || "Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"}
          </p>
        </div>

        <div className="rounded-2xl border border-forest-900/10 bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-800/60">
            Bing Webmaster Tools
          </p>
          <div className="mt-2 flex items-center gap-2">
            {summary.bingMetaConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            )}
            <span className="font-semibold text-[15px] text-forest-950">
              {summary.bingMetaConfigured
                ? "Public Token Configured"
                : "Import from GSC or Set Token"}
            </span>
          </div>
          <p className="mt-1 text-[12.5px] text-forest-800/70">
            Supports 1-click GSC import, msvalidate.01 &amp; /BingSiteAuth.xml
          </p>
        </div>

        <div className="rounded-2xl border border-forest-900/10 bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-800/60">
            Canonical Base Domain
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-saffron-700 shrink-0" />
            <span className="font-semibold text-[14px] text-forest-950 truncate">
              {summary.siteUrl.replace(/^https?:\/\//, "")}
            </span>
          </div>
          <p className="mt-1 text-[12.5px] text-forest-800/70">
            {summary.isCustomDomain
              ? "Custom domain configured"
              : "Netlify subdomains can be indexed. A custom domain is optional."}
          </p>
        </div>
      </div>

      {/* Live Crawl Endpoints */}
      <section className="rounded-2xl border border-forest-900/10 bg-white p-6">
        <div className="flex items-center gap-2.5">
          <FileCode2 className="w-5 h-5 text-saffron-700" />
          <h2 className="font-display text-[22px] text-forest-950">
            Live Search Crawler Endpoints
          </h2>
        </div>
        <p className="mt-1 text-[14px] text-forest-800/75">
          Paste the Sitemap URL directly into Google Search Console (&ldquo;Sitemaps&rdquo;) and Bing Webmaster Tools (&ldquo;Sitemaps&rdquo;).
        </p>

        <div className="mt-4 divide-y divide-forest-900/10">
          {quickEndpoints.map((ep) => (
            <div
              key={ep.key}
              className="py-3.5 flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <p className="font-medium text-[14.5px] text-forest-950">
                  {ep.label}
                </p>
                <code className="text-[12.5px] text-forest-800/75 break-all">
                  {ep.fullUrl}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyValue(ep.key, ep.fullUrl)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/15 px-3.5 py-1.5 text-[12.5px] font-medium text-forest-900 hover:bg-forest-50 transition-colors"
                >
                  {copiedKey === ep.key ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy URL
                    </>
                  )}
                </button>
                <a
                  href={ep.fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-forest-950 text-cream-50 px-3.5 py-1.5 text-[12.5px] font-medium hover:bg-forest-900 transition-colors"
                >
                  Open
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instant Bing / Copilot IndexNow Push */}
      <section className="rounded-2xl border border-saffron-500/30 bg-cream-100 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-forest-900" />
              <h2 className="font-display text-[22px] text-forest-950">
                Search Discovery With IndexNow
              </h2>
            </div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-forest-900/80">
              Notify participating search engines about changed URLs via{" "}
              <code className="font-mono text-[12.5px] bg-white px-1.5 py-0.5 rounded">
                POST /api/seo/indexnow
              </code>
              . Add an alphanumeric{" "}
              <code className="font-mono text-[12.5px] bg-white px-1.5 py-0.5 rounded">
                INDEXNOW_KEY
              </code>{" "}
              to the production server's environment variables. Google does not use IndexNow. An accepted notification does not guarantee crawling, indexing, rankings, or a Copilot citation.
            </p>
          </div>
          <button
            type="button"
            disabled={submitting || !summary.indexNowConfigured}
            onClick={triggerIndexNow}
            className="inline-flex items-center gap-2 rounded-full bg-forest-950 text-cream-50 px-5 py-2.5 text-[13.5px] font-medium hover:bg-forest-900 disabled:opacity-60 transition-colors"
          >
            <Send className="w-4 h-4 text-saffron-300" />
            {submitting
              ? "Submitting URLs..."
              : summary.indexNowConfigured ? `Notify IndexNow About ${summary.totalUrls} URLs` : "IndexNow Not Configured"}
          </button>
        </div>

        {submitResult && (
          <div
            className={`mt-4 rounded-xl border p-3.5 text-[13.5px] ${
              submitResult.ok
                ? "border-emerald-600/30 bg-emerald-50 text-emerald-950"
                : "border-amber-600/30 bg-amber-50 text-amber-950"
            }`}
          >
            {submitResult.message}
          </div>
        )}
      </section>

      {/* Complete Canonical URL Inventory */}
      <section className="rounded-2xl border border-forest-900/10 bg-white p-6">
        <h2 className="font-display text-[22px] text-forest-950">
          Canonical Route Inventory ({summary.totalUrls} URLs)
        </h2>
        <p className="mt-1 text-[13.5px] text-forest-800/70">
          These routes come from the clinic's content files. The saved live audit above reports the actual HTTP and metadata checks; this inventory alone does not establish indexing or rich-result eligibility.
        </p>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {summary.urls.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="rounded-xl border border-forest-900/10 px-3.5 py-2.5 text-[13px] text-forest-900 hover:border-saffron-500/50 hover:bg-cream-50 flex items-center justify-between gap-2 transition-colors"
            >
              <span className="truncate font-mono text-[12px]">{item.path}</span>
              <span className="text-[11px] text-forest-800/55 shrink-0">
                p={(item.priority ?? 0.8).toFixed(1)}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
