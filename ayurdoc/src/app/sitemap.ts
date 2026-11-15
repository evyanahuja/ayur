import type { MetadataRoute } from "next";
import { REVIEW_DATE, SITE_URL } from "@/seo/config";
import { PUBLISHED_CONDITIONS } from "@/content/registry";
import { TREATMENTS } from "@/content/treatments";
import { ARTICLES } from "@/content/articles";
import { LOCAL_PAGES } from "@/content/local";
import { HEALTH_CATEGORIES } from "@/content/categories";

/* Only canonical, published, indexable URLs are listed. Draft condition pages (status "draft"),
   admin/tool pages, API routes and search-result URLs are intentionally excluded. The sitemap is
   generated from the content registries, so new published pages are included automatically. */

type Entry = { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" };

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(REVIEW_DATE);

  const core: Entry[] = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/about-doctor", priority: 0.9, changeFrequency: "monthly" },
    { path: "/child-health", priority: 0.8, changeFrequency: "weekly" },
    { path: "/health-concerns", priority: 0.9, changeFrequency: "weekly" },
    { path: "/conditions", priority: 0.9, changeFrequency: "weekly" },
    { path: "/treatments", priority: 0.9, changeFrequency: "weekly" },
    { path: "/articles", priority: 0.85, changeFrequency: "weekly" },
    { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
    { path: "/sitemap", priority: 0.5, changeFrequency: "monthly" },
  ];

  const categories: Entry[] = HEALTH_CATEGORIES.map((c) => ({
    path: `/health-concerns/${c.slug}`,
    priority: 0.85,
    changeFrequency: "monthly",
  }));
  const conditions: Entry[] = PUBLISHED_CONDITIONS.map((c) => ({
    path: `/conditions/${c.slug}`,
    priority: 0.85,
    changeFrequency: "monthly",
  }));
  const treatments: Entry[] = TREATMENTS.map((t) => ({
    path: `/${t.base}/${t.slug}`,
    priority: 0.85,
    changeFrequency: "monthly",
  }));
  const articles: Entry[] = ARTICLES.map((a) => ({
    path: `/articles/${a.slug}`,
    priority: 0.8,
    changeFrequency: "monthly",
  }));
  const local: Entry[] = LOCAL_PAGES.map((l) => ({
    path: `/${l.slug}`,
    priority: 0.85,
    changeFrequency: "monthly",
  }));

  const seen = new Set<string>();
  return [...core, ...categories, ...conditions, ...treatments, ...articles, ...local]
    .filter((entry) => {
      if (seen.has(entry.path)) return false;
      seen.add(entry.path);
      return true;
    })
    .map((entry) => ({
      url: entry.path === "/" ? `${SITE_URL}/` : `${SITE_URL}${entry.path}`,
      lastModified,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }));
}
