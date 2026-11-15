import type { Metadata } from "next";
import { HealthConcernsHubView } from "@/components/HealthConcernsHubView";
import { breadcrumbJsonLd, canonical } from "@/seo/config";

const TITLE = "Health Concerns We Help With | Ayurvedic Care for All Ages in Indore";
const DESCRIPTION =
  "Explore Ayurvedic care in Indore for children, skin and hair, digestion, respiratory, neurological, joint, women's, men's, metabolic and senior health. Dr. Priyanka Likhar, BAMS, MD.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: canonical("/health-concerns") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonical("/health-concerns"),
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/opengraph-image"] },
};

export default function HealthConcernsHub() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Health Concerns", path: "/health-concerns" },
            ])
          ).replace(/</g, "\\u003c"),
        }}
      />
      <HealthConcernsHubView />
    </>
  );
}
