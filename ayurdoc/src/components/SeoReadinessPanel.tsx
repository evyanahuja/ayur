"use client";

import { useState } from "react";
import Link from "next/link";
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

export function SeoReadinessPanel({ summary }: { summary: SeoAuditSummary }) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);

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
        ok: Boolean(data.ok),
        message:
          data.message ||
          data.error ||
          "Completed IndexNow request.",
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
      {/* Status KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-forest-900/10 bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-forest-800/60">
            Indexable Canonical URLs
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
                ? "Meta + XML Active"
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
              ? "Custom domain active"
              : "Recommended: set custom .in / .com domain via NEXT_PUBLIC_SITE_URL"}
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
                  href={ep.href}
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
                Bing &amp; Microsoft Copilot Instant Indexing (IndexNow)
              </h2>
            </div>
            <p className="mt-1.5 text-[14px] leading-relaxed text-forest-900/80">
              Bing supports pushing all {summary.totalUrls} canonical URLs at once via{" "}
              <code className="font-mono text-[12.5px] bg-white px-1.5 py-0.5 rounded">
                POST /api/seo/indexnow
              </code>
              . Add an alphanumeric{" "}
              <code className="font-mono text-[12.5px] bg-white px-1.5 py-0.5 rounded">
                INDEXNOW_KEY
              </code>{" "}
              to your environment variables and click below after each deploy.
            </p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={triggerIndexNow}
            className="inline-flex items-center gap-2 rounded-full bg-forest-950 text-cream-50 px-5 py-2.5 text-[13.5px] font-medium hover:bg-forest-900 disabled:opacity-60 transition-colors"
          >
            <Send className="w-4 h-4 text-saffron-300" />
            {submitting
              ? "Submitting URLs..."
              : `Push All ${summary.totalUrls} URLs via IndexNow`}
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
          All {summary.totalUrls} Canonical Routes Ready for Indexing
        </h2>
        <p className="mt-1 text-[13.5px] text-forest-800/70">
          Every route below serves static/SSR HTML with self-referencing canonical tags, OpenGraph 1200×630 cards, and validated Schema.org JSON-LD (zero 308 redirect chains).
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
