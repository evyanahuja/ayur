import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { CONDITIONS_1 } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS } from "@/content/treatments";
import { ARTICLES } from "@/content/articles";
import { LOCAL_PAGES } from "@/content/local";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const corePaths = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/about-doctor", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/child-health", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/conditions", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/treatments", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/articles", priority: 0.85, changeFrequency: "weekly" as const },
    { path: "/faq", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/privacy-policy", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/sitemap", priority: 0.5, changeFrequency: "weekly" as const },
  ];

  const dynamicPaths = [
    ...[...CONDITIONS_1, ...CONDITIONS_2].map((c) => ({
      path: `/conditions/${c.slug}`,
      priority: 0.85,
      changeFrequency: "monthly" as const,
    })),
    ...TREATMENTS.map((t) => ({
      path: `/${t.base}/${t.slug}`,
      priority: 0.85,
      changeFrequency: "monthly" as const,
    })),
    ...ARTICLES.map((a) => ({
      path: `/articles/${a.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    ...LOCAL_PAGES.map((l) => ({
      path: `/${l.slug}`,
      priority: 0.85,
      changeFrequency: "monthly" as const,
    })),
  ];

  return [...corePaths, ...dynamicPaths].map((item) => ({
    url: item.path === "/" ? SITE.siteUrl : `${SITE.siteUrl}${item.path}`,
    lastModified: now,
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
}
