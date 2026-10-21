import { HomeContent } from "@/components/PageViews";
import { buildHomeFaqJsonLd } from "@/lib/jsonld";

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildHomeFaqJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <HomeContent />
    </>
  );
}
