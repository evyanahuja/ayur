import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SITE, SEO } from "@/content/site";
import { buildJsonLd } from "@/lib/jsonld";
import { SkipLink } from "@/components/SkipLink";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { FloatingActions } from "@/components/FloatingActions";
import { ManualSyncPill } from "@/components/ManualSyncPill";

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
  authors: [{ name: SITE.doctorName, url: `${SITE.siteUrl}/about-doctor/` }],
  creator: SITE.doctorName,
  category: "health",
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, email: true, address: true },
  verification: {
    ...(SEO.verification.google ? { google: SEO.verification.google } : {}),
    ...(SEO.verification.bing ? { other: { "msvalidate.01": SEO.verification.bing } } : {}),
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE.clinicName,
    locale: SEO.locale,
    title: SEO.title,
    description: SEO.description,
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
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Gujarati:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#fffdf8] text-slate-900 antialiased min-h-screen">
        <LanguageProvider>
          <SkipLink />
          <SiteHeader />
          {children}
          <SiteFooter />
          <FloatingActions />
          <ManualSyncPill />
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
