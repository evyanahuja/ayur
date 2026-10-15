import { SITE, SEO, STATS, FAQS, SPECIALTIES, IMAGES } from "@/content/site";

const abs = (p: string) => (p.startsWith("http") ? p : `${SITE.siteUrl}${p}`);

export function buildJsonLd() {
  const clinicId = `${SITE.siteUrl}/#clinic`;
  const doctorId = `${SITE.siteUrl}/#doctor`;
  const siteId = `${SITE.siteUrl}/#website`;

  const address = {
    "@type": "PostalAddress",
    streetAddress: SEO.street,
    addressLocality: SEO.city,
    addressRegion: SEO.region,
    postalCode: SEO.postalCode,
    addressCountry: SEO.country,
  };

  const openingHoursSpecification = SEO.openingHours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["MedicalClinic", "LocalBusiness"],
        "@id": clinicId,
        name: SITE.clinicName,
        url: SITE.siteUrl,
        image: abs(IMAGES.clinicCare),
        logo: abs("/icon-512.png"),
        telephone: SITE.phoneHref,
        email: SITE.email,
        priceRange: SEO.priceRange,
        address,
        geo: { "@type": "GeoCoordinates", latitude: SEO.geo.lat, longitude: SEO.geo.lng },
        hasMap: SITE.googleMapsUrl,
        openingHoursSpecification,
        areaServed: [{ "@type": "City", name: "Indore" }, { "@type": "Country", name: "India" }],
        medicalSpecialty: "Ayurvedic Pediatrics (Kaumarbhritya)",
        availableService: SPECIALTIES.map((s) => ({
          "@type": "MedicalTherapy",
          name: `Ayurvedic treatment for ${s.title} in children`,
          description: s.desc,
        })),
        sameAs: SEO.sameAs,
        employee: { "@id": doctorId },
      },
      {
        "@type": "Physician",
        "@id": doctorId,
        name: SITE.doctorName,
        image: abs(IMAGES.doctorPortrait),
        url: SITE.siteUrl,
        telephone: SITE.phoneHref,
        email: SITE.email,
        jobTitle: "Ayurvedic Pediatrician (MD Kaumarbhritya)",
        medicalSpecialty: "Pediatric",
        hasCredential: [
          { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "BAMS" },
          { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "MD Kaumarbhritya (Balarog)" },
        ],
        knowsLanguage: ["hi", "mr", "en", "gu"],
        worksFor: { "@id": clinicId },
        address,
        sameAs: SEO.sameAs,
        description: `Ayurvedic child specialist with ${STATS.yearsExperience}+ years in Balarog, treating skin, growth, respiratory, allergy and neurodevelopmental concerns in children.`,
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: SITE.siteUrl,
        name: SITE.doctorName,
        inLanguage: "en-IN",
        publisher: { "@id": clinicId },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
}
