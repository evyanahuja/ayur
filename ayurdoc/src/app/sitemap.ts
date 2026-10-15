import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

// Served at /sitemap.xml — add new pages here when you create them
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
