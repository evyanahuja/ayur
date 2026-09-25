import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter, Noto_Sans_Devanagari, Noto_Sans_Gujarati } from "next/font/google";
import "./globals.css";
import { SITE, STATS, IMAGES } from "@/content/site";
import { SkipLink } from "@/components/SkipLink";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-devanagari",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoGujarati = Noto_Sans_Gujarati({
  subsets: ["gujarati", "latin"],
  variable: "--font-gujarati",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e2b21",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: `${SITE.doctorName} | MD Kaumarbhritya — Ayurvedic Child Health Specialist`,
  description: `Gentle, root-cause Ayurvedic care for children by ${SITE.doctorName} (MD Kaumarbhritya – Balarog). Exceptional results in skin diseases, neurodevelopmental concerns, growth, respiratory issues, allergies & lifestyle disorders. Book online or in-clinic. Available in English, Hindi, Marathi & Gujarati.`,
  keywords: [
    "ayurvedic doctor for kids",
    "child health specialist ayurveda",
    "Kaumarbhritya",
    "Balarog",
    SITE.doctorName,
    "Suvarnaprashan",
    "child skin ayurveda",
    "ADHD ayurveda",
    "child growth ayurveda",
    "बाल आयुर्वेद",
    "बालरोग आयुर्वेद",
    "બાળ આયુર્વેદ",
  ],
  authors: [{ name: SITE.doctorName }],
  openGraph: {
    title: `${SITE.doctorName} — Gentle Ayurvedic Care for Thriving Kids`,
    description: `MD Kaumarbhritya (Balarog) specialist helping ${STATS.patientsTreated.toLocaleString("en-IN")}+ children heal from skin, growth, respiratory, allergy & neurodevelopmental concerns — naturally.`,
    type: "website",
    locale: "en_IN",
    alternateLocale: ["hi_IN", "mr_IN", "gu_IN"],
    images: [{ url: IMAGES.doctorPortrait, width: 1200, height: 1200, alt: SITE.doctorName }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.doctorName} | Ayurvedic Child Specialist`,
    description: "Root-cause Ayurvedic healing for kids — skin, growth, immunity, development & more.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${notoDevanagari.variable} ${notoGujarati.variable}`}>
      <body className="bg-[#fffdf8] text-slate-900 antialiased min-h-screen">
        <SkipLink />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Physician",
              name: SITE.doctorName,
              medicalSpecialty: "Ayurvedic Pediatrics (Kaumarbhritya - Balarog)",
              description:
                "MD Kaumarbhritya Ayurvedic doctor specializing in child skin diseases, neurodevelopmental, growth, respiratory, allergies and lifestyle disorders.",
              areaServed: "IN",
              telephone: SITE.phoneHref,
              email: SITE.email,
              url: SITE.siteUrl,
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: STATS.rating,
                reviewCount: STATS.reviewCount,
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
