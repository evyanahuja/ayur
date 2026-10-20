/**
 * Structured data (schema.org JSON-LD) for Google / Bing.
 * Includes verified medical registration (Reg. No. 63934) and alumniOf credentials.
 */
import { SITE, SEO, STATS, FAQS, SPECIALTIES, IMAGES } from "@/content/site";

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE.siteUrl}${path}`);

export function buildJsonLd() {
  const clinicId = `${SITE.siteUrl}/#clinic`;
  const doctorId = `${SITE.siteUrl}/#doctor`;
  const websiteId = `${SITE.siteUrl}/#website`;

  const address = {
    "@type": "PostalAddress",
    streetAddress: SEO.street,
    addressLocality: SEO.city,
    addressRegion: SEO.region,
    postalCode: SEO.postalCode,
    addressCountry: SEO.country,
  };

  const sameAs = SEO.sameAs.filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalClinic",
        "@id": clinicId,
        name: SITE.clinicName,
        url: SITE.siteUrl,
        image: abs(IMAGES.clinicCare),
        logo: abs("/icon"),
        telephone: SITE.phoneHref,
        email: SITE.email,
        priceRange: SEO.priceRange,
        address,
        geo: { "@type": "GeoCoordinates", latitude: SEO.geo.lat, longitude: SEO.geo.lng },
        ...(SITE.googleMapsUrl ? { hasMap: SITE.googleMapsUrl } : {}),
        openingHoursSpecification: SEO.openingHours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        })),
        areaServed: [
          { "@type": "City", name: SEO.city },
          { "@type": "Country", name: "India" },
        ],
        medicalSpecialty: "Pediatric",
        availableService: SPECIALTIES.map((s) => ({
          "@type": "MedicalTherapy",
          name: `Ayurvedic care for ${s.title} in children`,
          description: s.desc,
        })),
        ...(sameAs.length ? { sameAs } : {}),
        employee: { "@id": doctorId },
      },
      {
        "@type": "Physician",
        "@id": doctorId,
        name: SITE.doctorName,
        image: abs(IMAGES.doctorPortrait),
        url: `${SITE.siteUrl}/about-doctor/`,
        telephone: SITE.phoneHref,
        email: SITE.email,
        identifier: {
          "@type": "PropertyValue",
          name: "Medical Registration Number",
          value: SITE.registrationNumber,
        },
        medicalSpecialty: "Pediatric",
        description: `${SITE.qualification} (Reg. No. ${SITE.registrationNumber}). Post-graduation (MD — Pediatrician / Kaumarbhritya) from ${SITE.pgCollege} and BAMS from ${SITE.ugCollege}. Ayurvedic child specialist with ${STATS.yearsExperience}+ years in Balarog.`,
        alumniOf: [
          {
            "@type": "CollegeOrUniversity",
            name: SITE.pgCollege,
          },
          {
            "@type": "CollegeOrUniversity",
            name: SITE.ugCollege,
          },
        ],
        hasCredential: [
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "degree",
            name: `MD — Pediatrician (Kaumarbhritya / Balarog), ${SITE.pgCollege}`,
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "degree",
            name: `BAMS, ${SITE.ugCollege}`,
          },
          {
            "@type": "EducationalOccupationalCredential",
            credentialCategory: "license",
            name: `Medical Registration No. ${SITE.registrationNumber}`,
          },
        ],
        knowsLanguage: ["hi", "mr", "en", "gu"],
        address,
        worksFor: { "@id": clinicId },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE.siteUrl,
        name: SITE.clinicName,
        inLanguage: ["en-IN", "hi-IN", "mr-IN", "gu-IN"],
        publisher: { "@id": clinicId },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE.siteUrl}/#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
