import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

// Served at /manifest.webmanifest (replaces public/site.webmanifest)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.doctorName} — Ayurvedic Child Specialist`,
    short_name: "Dr. Likhar",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf8",
    theme_color: "#0e2b21",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
