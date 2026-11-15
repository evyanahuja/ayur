import type { MetadataRoute } from "next";
import { SITE_URL } from "@/seo/config";

/* Public content and assets stay crawlable. Only internal tooling, API routes and the
   enquiry endpoint are disallowed. Draft condition pages are kept out of the index via
   robots meta (noindex) and the sitemap rather than robots.txt, so Google can read the
   noindex directive. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/seo-readiness", "/manual-file-sync/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
