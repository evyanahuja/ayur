import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";
import { SITE, SEO } from "@/content/site";
import { CONDITIONS_1 } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS } from "@/content/treatments";
import { ARTICLES } from "@/content/articles";
import { LOCAL_PAGES } from "@/content/local";

export const dynamic = "force-dynamic";

export async function GET() {
  const publicDir = path.join(process.cwd(), "public");
  let googleHtmlFiles: string[] = [];
  try {
    googleHtmlFiles = fs
      .readdirSync(publicDir)
      .filter((f) => /^google[a-z0-9]+\.html$/i.test(f));
  } catch {
    googleHtmlFiles = [];
  }

  const googleMetaConfigured = Boolean(SEO.verification.google);
  const bingMetaConfigured = Boolean(SEO.verification.bing);
  const indexNowConfigured = Boolean((process.env.INDEXNOW_KEY || "").trim());
  const entries = sitemap();
  const isDefaultSubdomain = SITE.siteUrl.includes(".netlify.app");

  return NextResponse.json({
    ok: true,
    siteUrl: SITE.siteUrl,
    isCustomDomain: !isDefaultSubdomain,
    clinicName: SITE.clinicName,
    doctorName: SITE.doctorName,
    registrationNumber: SITE.registrationNumber,
    sitemap: {
      url: `${SITE.siteUrl}/sitemap.xml`,
      robotsUrl: `${SITE.siteUrl}/robots.txt`,
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
        priority: e.priority,
        changeFrequency: e.changeFrequency,
      })),
    },
    verification: {
      googleHtmlFiles,
      googleMetaConfigured,
      bingMetaConfigured,
      bingXmlEndpoint: `${SITE.siteUrl}/BingSiteAuth.xml`,
      indexNowConfigured,
      indexNowKeyEndpoint: `${SITE.siteUrl}/indexnow-key.txt`,
      indexNowSubmitEndpoint: "/api/seo/indexnow",
    },
    structuredData: [
      "MedicalClinic (NAP + GeoCoordinates + OpeningHours + Specialty)",
      "Physician (Reg. No. 63934 + ITRA MD Kaumarbhritya + BAMS credentials)",
      "WebSite (en-IN, hi-IN, mr-IN, gu-IN)",
      "MedicalWebPage + Article (medical reviewer + dateModified on clinical pages)",
      "BreadcrumbList (all hub, condition, treatment, article & local pages)",
      "FAQPage (deduplicated per page to satisfy Google Rich Results guidelines)",
    ],
  });
}
