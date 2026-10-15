import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Inter, Noto_Sans_Devanagari, Noto_Sans_Gujarati } from "next/font/google";
import "./globals.css";
import { SITE, STATS, IMAGES } from "@/content/site";
import { SkipLink } from "@/components/SkipLink";
import { SITE, SEO } from "@/content/site";
import { buildJsonLd } from "@/lib/jsonld";

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
  title: { default: SEO.title, template: SEO.titleTemplate },
  description: SEO.description,
  applicationName: SITE.clinicName,
  authors: [{ name: SITE.doctorName, url: SITE.siteUrl }],
  creator: SITE.doctorName,
  category: "health",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, email: true, address: true },
  verification: {
    google: SEO.verification.google || undefined,
    other: SEO.verification.bing ? { "msvalidate.01": SEO.verification.bing } : undefined,
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.clinicName,
    locale: SEO.locale,
    title: SEO.title,
    description: SEO.description,
    // no images here → Next uses app/opengraph-image.tsx automatically
  },
  twitter: {
    card: "summary_large_image",
    title: SEO.title,
    description: SEO.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icon", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const jsonLd = buildJsonLd();
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="bg-[#fffdf8] text-slate-900 antialiased min-h-screen">
        <SkipLink />
        {children}
        <script
          type="application/ld+json"
          // JSON.stringify output is safe; escape "<" to prevent script break-out
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}

/* Fonts: keep Fraunces + Inter global. Load Noto Devanagari / Gujarati only in the
   /hi and /gu locale layouts (phase 2) — saves ~180 KB on first paint. */
