// ── src/app/manifest.ts ───────────────────────────────────────────────
import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE.doctorName} — Ayurvedic Child Specialist, Indore`,
    short_name: "Dr. Likhar",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf8",
    theme_color: "#0e2b21",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
