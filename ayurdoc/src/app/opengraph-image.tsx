import { ImageResponse } from "next/og";
import { SITE, SEO, STATS } from "@/content/site";

// Served at /opengraph-image — 1200x630 preview card for WhatsApp, Facebook, X, LinkedIn
export const alt = `${SITE.doctorName} — Ayurvedic Child Specialist in ${SEO.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0b241a 0%, #163828 60%, #26583e 100%)",
          color: "#fefdfb",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#f3c869" }}>
          {SITE.shortCreds.replace("•", "·").toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 80, lineHeight: 1.05 }}>{SITE.doctorName}</div>
          <div style={{ marginTop: 20, fontSize: 42, color: "#fbe190" }}>
            {`Ayurvedic Child Specialist · ${SEO.city} & Online`}
          </div>
          <div style={{ marginTop: 16, fontSize: 28, color: "rgba(254,253,251,0.75)" }}>
            Eczema · Speech delay · Immunity · Growth · Suvarnaprashan
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "rgba(254,253,251,0.7)" }}>
          <span>{`${STATS.patientsTreated.toLocaleString("en-IN")}+ children guided`}</span>
          <span>{SITE.siteUrl.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    size,
  );
}
