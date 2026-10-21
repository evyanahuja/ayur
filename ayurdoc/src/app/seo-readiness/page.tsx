import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import sitemap from "@/app/sitemap";
import { SITE, SEO } from "@/content/site";
import { CONDITIONS_1 } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS } from "@/content/treatments";
import { ARTICLES } from "@/content/articles";
import { LOCAL_PAGES } from "@/content/local";
import { SeoReadinessPanel } from "@/components/SeoReadinessPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Engine Readiness & Indexing Checklist",
  description:
    "Internal owner diagnostic for Google Search Console, Bing Webmaster Tools, Schema.org JSON-LD, and IndexNow URL submission.",
  robots: { index: false, follow: false },
};

export default function SeoReadinessPage() {
  const publicDir = path.join(process.cwd(), "public");
  let googleHtmlFiles: string[] = [];
  try {
    googleHtmlFiles = fs
      .readdirSync(publicDir)
      .filter((f) => /^google[a-z0-9]+\.html$/i.test(f));
  } catch {
    googleHtmlFiles = [];
  }

  const entries = sitemap();

  return (
    <main id="main" className="bg-[#fffdf8]">
      <div className="bg-forest-950 text-cream-50 pt-28 sm:pt-32 pb-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-saffron-300">Owner Search Diagnostic • Noindex</p>
          <h1 className="mt-2 font-display font-light text-[clamp(2rem,4.5vw,2.8rem)] leading-tight">
            Google &amp; Bing Search Indexing Readiness
          </h1>
          <p className="mt-2.5 max-w-3xl text-[15px] text-cream-100/80 leading-relaxed">
            Live verification status, XML sitemap inventory, deduplicated clinical JSON-LD checks, and one-click IndexNow URL submission for{" "}
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
              conditionPages: CONDITIONS_1.length + CONDITIONS_2.length,
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
            indexNowConfigured: Boolean((process.env.INDEXNOW_KEY || "").trim()),
          }}
        />
      </div>
    </main>
  );
}
