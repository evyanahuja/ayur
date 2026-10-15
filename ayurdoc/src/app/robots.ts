import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/image?*"] },
    ],
    sitemap: `${SITE.siteUrl}/sitemap.xml`,
    host: SITE.siteUrl,
  };
}
