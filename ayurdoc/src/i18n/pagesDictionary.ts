import type { Language } from "./config";

export interface PagesI18n {
  header: {
    homeAria: string;
    indoreTag: string;
    home: string;
    doctor: string;
    conditions: string;
    treatments: string;
    articles: string;
    faq: string;
    contact: string;
    callShort: string;
    callPrefix: string;
    bookVisit: string;
    bookChildVisit: string;
    openMenu: string;
    closeMenu: string;
    mobileLinks: { href: string; label: string }[];
  };
  footer: {
    bio: string;
    regBadge: string;
    conditionsTitle: string;
    allConditions: string;
    treatmentsTitle: string;
    consultationLink: string;
    articlesLink: string;
    faqLink: string;
    sitemapLink: string;
    reachTitle: string;
    bookBtn: string;
    rights: string;
    privacy: string;
    terms: string;
    aboutDoctor: string;
    madeWith: string;
    forKids: string;
    disclaimer: string;
  };
  seoBlocks: {
    reviewerRole: string;
    regLabel: string;
    pgLine: string;
    ugLine: string;
    reviewedOn: string;
    authorNote: string;
    disclaimerStrong: string;
    disclaimerBody: string;
    ctaTitle: string;
    ctaBody: string;
    ctaBook: string;
    ctaWhatsapp: string;
    ctaWhatsappMsg: string;
    ctaLocationLine: string;
  };
  homeHubs: {
    exploreEyebrow: string;
    exploreTitle: string;
    exploreDesc: string;
    readGuide: string;
    cards: { to: string; t: string; d: string }[];
    treatEyebrow: string;
    treatTitle: string;
    learnMore: string;
    allTreatments: string;
    artEyebrow: string;
    artTitle: string;
    minRead: string;
    browseArticles: string;
  };
  categories: Record<string, string>;
  hubs: {
    homeCrumb: string;
    conditionsEyebrow: string;
    conditionsH1: string;
    conditionsIntro: string;
    conditionsCrumb: string;
    treatmentsEyebrow: string;
    treatmentsH1: string;
    treatmentsIntro: string;
    treatmentsCrumb: string;
    treatGroups: { title: string; desc: string }[];
    articlesEyebrow: string;
    articlesH1: string;
    articlesIntro: string;
    articlesCrumb: string;
    articlesCtaTitle: string;
    articlesCtaBody: string;
    childHealthEyebrow: string;
    childHealthH1: string;
    childHealthIntro: string;
    childHealthCrumb: string;
    childHealthPaths: { title: string; desc: string; links: [string, string][] }[];
    faqEyebrow: string;
    faqH1: string;
    faqIntro: string;
    faqCrumb: string;
    faqGroups: { h: string; faqs: { q: string; a: string }[] }[];
  };
  templates: {
    medicallyReviewed: string;
    alsoSearched: string;
    overviewEyebrow: string;
    whatIsTitle: string;
    symptomsEyebrow: string;
    signsTitle: string;
    byAgeEyebrow: string;
    ageTitle: string;
    causesEyebrow: string;
    causesTitle: string;
    assessEyebrow: string;
    assessTitle: string;
    diagnosisEyebrow: string;
    diagnosisTitle: string;
    treatmentEyebrow: string;
    managementTitle: string;
    homeEyebrow: string;
    homeTitle: string;
    warningTitle: string;
    ayurvedaEyebrow: string;
    ayurvedaTitle: string;
    canSupport: string;
    honestLimits: string;
    faqEyebrow: string;
    faqTitle: string;
    referencesTitle: string;
    relatedTitle: string;
    relatedKindCondition: string;
    relatedKindTreatment: string;
    relatedKindArticle: string;
    condWhatsappPrefix: string;
    serviceLabel: string;
    treatmentLabel: string;
    partLabel: string;
    suitsTitle: string;
    avoidTitle: string;
    askAtConsult: string;
    safetyEyebrow: string;
    risksTitle: string;
    processEyebrow: string;
    processTitle: string;
    consideringPrefix: string;
    consideringBody: string;
    treatWhatsappPrefix: string;
    takeawaysTitle: string;
    artCtaTitle: string;
    artWhatsappPrefix: string;
    indoreEyebrow: string;
    whyChooseTitle: string;
    areasServedTitle: string;
    visitInfoTitle: string;
    localFaqTitle: string;
    continueExploring: string;
  };
  staticPages: {
    about: {
      seoTitle: string;
      seoDesc: string;
      eyebrow: string;
      h1: string;
      intro: string;
      crumb: string;
      regBadgeLabel: string;
      qualsList: string[];
      scopeHeading: string;
      scopeItems: string[];
    };
    contact: {
      seoTitle: string;
      seoDesc: string;
      eyebrow: string;
      h1: string;
      intro: string;
      crumb: string;
      callTitle: string;
      waTitle: string;
      waSub: string;
      dirTitle: string;
      emailTitle: string;
      formHeading: string;
      formSub: string;
      thankYou: string;
      nameLabel: string;
      namePh: string;
      nameErr: string;
      phoneLabel: string;
      phonePh: string;
      phoneErr: string;
      childNameLabel: string;
      childNamePh: string;
      childAgeLabel: string;
      childAgePh: string;
      modeLabel: string;
      modes: [string, string, string];
      concernLabel: string;
      concernPh: string;
      concernErr: string;
      submitBtn: string;
      submittingBtn: string;
      openWaBtn: string;
    };
    privacy: {
      seoTitle: string;
      seoDesc: string;
      eyebrow: string;
      h1: string;
      intro: string;
      crumb: string;
      items: { strong: string; body: string }[];
    };
    terms: {
      seoTitle: string;
      seoDesc: string;
      eyebrow: string;
      h1: string;
      intro: string;
      crumb: string;
      items: { strong: string; body: string }[];
    };
    sitemap: {
      seoTitle: string;
      seoDesc: string;
      pagesCountSuffix: string;
      h1: string;
      intro: string;
      crumb: string;
      mainHeading: string;
      mainLinks: { label: string; href: string }[];
      condHeading: string;
      treatHeading: string;
      artHeading: string;
      localHeading: string;
      legalHeading: string;
    };
    notFound: {
      seoTitle: string;
      h1: string;
      desc: string;
      homeBtn: string;
      condBtn: string;
      contactBtn: string;
    };
  };
}

export const PAGES_DICTIONARY: Record<Language, PagesI18n> = {
  en: {
    header: {
      homeAria: "Home",
      indoreTag: "Indore",
      home: "Home",
      doctor: "Doctor",
      conditions: "Conditions",
      treatments: "Treatments",
      articles: "Articles",
      faq: "FAQ",
      contact: "Contact",
      callShort: "Call",
      callPrefix: "Call",
      bookVisit: "Book Visit",
      bookChildVisit: "Book Your Child's Visit",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      mobileLinks: [
        { href: "/", label: "Home" },
        { href: "/about-doctor/", label: "About the Doctor" },
        { href: "/child-health/", label: "Child Health Hub" },
        { href: "/conditions/", label: "Conditions Library (22)" },
        { href: "/treatments/", label: "Treatments & Services" },
        { href: "/articles/", label: "Health Articles" },
        { href: "/faq/", label: "FAQ" },
        { href: "/contact/", label: "Contact & Appointments" },
      ],
    },
    footer: {
      bio: "BalChikitsa Ayurved Clinic — specialized Ayurvedic child healthcare in Indore & online worldwide.",
      regBadge: "Reg. No. 63934 • MD Pediatrician (ITRA) • BAMS (Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur)",
      conditionsTitle: "Conditions",
      allConditions: "All 22 conditions →",
      treatmentsTitle: "Treatments",
      consultationLink: "Consultation",
      articlesLink: "Health Articles",
      faqLink: "FAQ",
      sitemapLink: "Sitemap",
      reachTitle: "Reach the clinic",
      bookBtn: "Book Appointment",
      rights: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
      aboutDoctor: "Doctor Credentials",
      madeWith: "Made with",
      forKids: "for thriving kids",
      disclaimer: "Educational content only — not emergency medical advice. Ayurvedic care is complementary and coordinated with your paediatrician. Outcomes vary by child; timelines describe typical patterns, not guarantees.",
    },
    seoBlocks: {
      reviewerRole: "Author & Medical Reviewer",
      regLabel: "Registration No. 63934",
      pgLine: "MD — Pediatrician (Kaumarbhritya), Institute of Teaching and Research in Ayurveda",
      ugLine: "BAMS — Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur",
      reviewedOn: "Medically reviewed",
      authorNote: "Educational information only — not a substitute for an individual consultation, diagnosis or emergency care.",
      disclaimerStrong: "Medical disclaimer:",
      disclaimerBody: "This page provides general health education and does not replace professional medical advice, diagnosis or treatment. Ayurvedic care here is complementary and coordinated with paediatric care — never stop prescribed medicines, therapy or rehabilitation without your treating doctor's guidance. In emergencies (breathing difficulty, seizures, dehydration, injury), seek immediate medical care.",
      ctaTitle: "Not sure what your child needs?",
      ctaBody: "Describe the concern once — get an honest opinion from Dr. Priyanka Likhar on whether Ayurvedic consultation can help, and what to do first.",
      ctaBook: "Book Appointment",
      ctaWhatsapp: "WhatsApp Enquiry",
      ctaWhatsappMsg: "Namaste Doctor Priyanka, I want guidance for my child's concern.",
      ctaLocationLine: "Sanchar Nagar Extension, Kanadia Road, Indore • Mon–Sat 10 AM–2 PM & 5 PM–8 PM IST • Online across India & abroad",
    },
    homeHubs: {
      exploreEyebrow: "Explore by need",
      exploreTitle: "Start from your child's concern",
      exploreDesc: "Every topic below is a full parent guide — symptoms, assessment, home care, red flags and honest Ayurvedic co-care.",
      readGuide: "Read guide",
      cards: [
        { to: "/conditions/", t: "All 22 conditions", d: "A–Z library with red flags" },
        { to: "/treatments/customized-suvarnaprashan/", t: "Suvarnaprashan", d: "Customized drops, honestly explained" },
        { to: "/articles/", t: "Parent articles", d: "Sleep, screens, iron & more" },
        { to: "/ayurvedic-doctor-indore/", t: "Visit in Indore", d: "Address, timings, booking" },
      ],
      treatEyebrow: "Treatments & services",
      treatTitle: "What the clinic offers",
      learnMore: "Learn more",
      allTreatments: "All {count} treatments & services →",
      artEyebrow: "Parent education",
      artTitle: "Latest health articles",
      minRead: "min",
      browseArticles: "Browse all {count} articles →",
    },
    categories: {
      "Development & Behaviour": "Development & Behaviour",
      Neurological: "Neurological",
      "Growth & Nutrition": "Growth & Nutrition",
      "Respiratory & Immunity": "Respiratory & Immunity",
      "Digestion & Gut": "Digestion & Gut",
      "Sleep & Habits": "Sleep & Habits",
      Suvarnaprashan: "Suvarnaprashan",
      Panchakarma: "Panchakarma",
      Consultation: "Consultation",
      Therapies: "Therapies",
      "Child Health": "Child Health",
      Immunity: "Immunity",
      Digestion: "Digestion",
      "Sleep & Routine": "Sleep & Routine",
      Nutrition: "Nutrition",
      "General Ayurveda": "General Ayurveda",
    },
    hubs: {
      homeCrumb: "Home",
      conditionsEyebrow: "22 parent guides",
      conditionsH1: "Child Health Conditions Library",
      conditionsIntro: "Every important childhood concern gets its own complete guide: what it is, signs by age, when to assess, how diagnosis works, home care, red flags, and the honest role of Ayurvedic co-care.",
      conditionsCrumb: "Conditions",
      treatmentsEyebrow: "Services & therapies",
      treatmentsH1: "Treatments & Services",
      treatmentsIntro: "Each therapy page clearly states what it is, who it suits, who should avoid it, precautions, and the consultation process — so you arrive informed.",
      treatmentsCrumb: "Treatments",
      treatGroups: [
        { title: "Customized Suvarnaprashan cluster", desc: "Main guide plus safety, age suitability, ingredients and classical background." },
        { title: "Panchakarma & classical therapies", desc: "Assessment-first gentle Ayurvedic therapies tailored individually." },
        { title: "Consultations", desc: "Structured 45-minute in-clinic (Indore) and worldwide online consultations." },
      ],
      articlesEyebrow: "Health education library",
      articlesH1: "Health Articles for Parents & Families",
      articlesIntro: "Practical, evidence-aware parent guides written and reviewed by Dr. Priyanka Likhar. Each article connects directly to related conditions and care options.",
      articlesCrumb: "Articles",
      articlesCtaTitle: "Have a question about your child's health?",
      articlesCtaBody: "Send an enquiry or message the clinic — get clear, personalized guidance for your child.",
      childHealthEyebrow: "Start here",
      childHealthH1: "Child Health Hub",
      childHealthIntro: "Choose the pattern closest to your concern — every pathway leads to detailed parent guides in English, Hindi, Marathi & Gujarati.",
      childHealthCrumb: "Child Health",
      childHealthPaths: [
        { title: "Growth & appetite not on track?", desc: "Weight, height, anaemia and picky eating.", links: [["Poor Appetite", "/conditions/poor-appetite-children/"], ["Growth & Nutrition", "/conditions/growth-nutrition-concerns/"], ["Constipation", "/conditions/constipation-children/"]] },
        { title: "Speech, attention or milestones?", desc: "Developmental concerns guided calmly.", links: [["Speech Delay", "/conditions/speech-delay-in-children/"], ["ADHD in Children", "/conditions/adhd-in-children/"], ["Delayed Milestones", "/conditions/delayed-milestones/"], ["Autism Signs & Assessment", "/conditions/autism-signs-assessment/"]] },
        { title: "Frequently falling sick?", desc: "Recurrent colds, fever and immunity patterns.", links: [["Frequent Colds & Cough", "/conditions/frequent-colds-cough-children/"], ["Fever in Children", "/conditions/fever-children/"], ["Customized Suvarnaprashan", "/treatments/customized-suvarnaprashan/"]] },
        { title: "Sleep, food & daily routine foundations", desc: "Daily habits that transform child health.", links: [["Sleep Problems", "/conditions/sleep-problems-children/"], ["Bedwetting", "/conditions/bedwetting-children/"], ["Sleep Routine Guide", "/articles/sleep-routine-children/"]] },
      ],
      faqEyebrow: "Help centre",
      faqH1: "Frequently Asked Questions",
      faqIntro: "Clear, honest answers on appointments, online consultations, Suvarnaprashan, child safety, timings and languages.",
      faqCrumb: "FAQ",
      faqGroups: [
        {
          h: "Visits & booking",
          faqs: [
            { q: "How do I book an appointment?", a: "Submit the appointment form on the Contact page, call or WhatsApp +91 98607 75010, or request an online video slot. You receive a confirmed time along with a simple preparation checklist." },
            { q: "What should we carry for the first visit?", a: "Carry previous medical reports, current medicine list, vaccination card (for young children), weight/height history, and a 3-day note of meals, digestion and sleep. Clear daylight photos help for skin concerns." },
            { q: "Which languages does Dr. Priyanka consult in?", a: "Dr. Priyanka Likhar consults comfortably in Hindi, Marathi, English and Gujarati — you can share your child's full history in whichever language feels most natural." },
          ],
        },
        {
          h: "Online consultation",
          faqs: [
            { q: "How does an online consultation work?", a: "During a 45-minute video consultation, Dr. Priyanka reviews your child's history, reports, photos and growth chart, then shares a written prescription and home-food diet plan via WhatsApp/email. Medicines can be couriered or sourced locally." },
            { q: "When is an in-person examination required instead of online?", a: "Physical therapies (such as Abhyanga or Panchakarma sessions), newborn acute evaluations, and any medical emergencies require in-person clinical or paediatric hospital care." },
          ],
        },
        {
          h: "Qualifications, safety & scope",
          faqs: [
            { q: "What are Dr. Priyanka Likhar's qualifications and registration details?", a: "Dr. Priyanka Likhar holds Registration Number 63934, completed her Post-Graduation MD in Pediatrics (Kaumarbhritya / Balarog) from the Institute of Teaching and Research in Ayurveda (ITRA), and completed her BAMS from Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur." },
            { q: "Is Ayurvedic medicine safe for children?", a: "When prescribed by a qualified MD Kaumarbhritya specialist in age- and weight-appropriate doses using quality-verified classical preparations, Ayurvedic care is gentle and child-friendly. Never stop prescribed allopathic medicines abruptly." },
            { q: "Do you handle acute medical emergencies?", a: "No — breathing difficulty, seizures, severe dehydration, injury, or high fever in infants require immediate emergency paediatric hospital care." },
          ],
        },
      ],
    },
    templates: {
      medicallyReviewed: "Medically reviewed",
      alsoSearched: "Related topics",
      overviewEyebrow: "Overview",
      whatIsTitle: "What it is",
      symptomsEyebrow: "Symptoms",
      signsTitle: "Common signs & symptoms",
      byAgeEyebrow: "By age",
      ageTitle: "Age-specific considerations",
      causesEyebrow: "Causes",
      causesTitle: "Causes & risk factors",
      assessEyebrow: "Assessment",
      assessTitle: "When assessment is needed",
      diagnosisEyebrow: "Diagnosis",
      diagnosisTitle: "How diagnosis is established",
      treatmentEyebrow: "Management",
      managementTitle: "Evidence-based management",
      homeEyebrow: "Home care",
      homeTitle: "Home care & supportive measures",
      warningTitle: "Warning signs — seek prompt medical care",
      ayurvedaEyebrow: "Ayurvedic co-care",
      ayurvedaTitle: "Role of Ayurveda (and its honest limits)",
      canSupport: "What Ayurveda can support",
      honestLimits: "Honest limits",
      faqEyebrow: "FAQ",
      faqTitle: "Frequently asked questions",
      referencesTitle: "Clinical references",
      relatedTitle: "Related reading",
      relatedKindCondition: "Condition",
      relatedKindTreatment: "Treatment",
      relatedKindArticle: "Article",
      condWhatsappPrefix: "Namaste Doctor Priyanka, I read your guide and would like consultation guidance for my child regarding",
      serviceLabel: "Service",
      treatmentLabel: "Treatment",
      partLabel: "Part",
      suitsTitle: "Who it suits",
      avoidTitle: "When to pause or consult first",
      askAtConsult: "Ask during consultation — suitability is assessed individually for every child.",
      safetyEyebrow: "Safety",
      risksTitle: "Precautions, safety & contraindications",
      processEyebrow: "Process",
      processTitle: "Consultation & course process",
      consideringPrefix: "Considering",
      consideringBody: "Start with a structured assessment — get clear, honest guidance on suitability, schedule, duration and expected milestones before starting.",
      treatWhatsappPrefix: "Namaste Doctor Priyanka, I would like to enquire about",
      takeawaysTitle: "Key takeaways",
      artCtaTitle: "Concerned about this in your child?",
      artWhatsappPrefix: "Namaste Doctor Priyanka, I read your article and would like guidance on",
      indoreEyebrow: "Indore • Madhya Pradesh",
      whyChooseTitle: "Why families choose this clinic",
      areasServedTitle: "Areas served",
      visitInfoTitle: "Visit & consultation information",
      localFaqTitle: "Local questions, answered",
      continueExploring: "Continue exploring",
    },
    staticPages: {
      about: {
        seoTitle: "About Dr. Priyanka Likhar (MD Pediatrics ITRA, BAMS, Reg. No. 63934) | Indore",
        seoDesc: "Profile & verified qualifications of Dr. Priyanka Likhar (Reg. No. 63934): MD Pediatrician (Kaumarbhritya) from Institute of Teaching and Research in Ayurveda & BAMS from Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur.",
        eyebrow: "Verified Practitioner Profile",
        h1: "About Dr. Priyanka Likhar",
        intro: "Dr. Priyanka Likhar (Registration No. 63934) is an Ayurvedic Pediatrician (MD — Kaumarbhritya / Balarog) practising at BalChikitsa Ayurved Clinic, Indore and consulting families online across India and abroad.",
        crumb: "About the Doctor",
        regBadgeLabel: "Medical Registration No. 63934",
        qualsList: [
          "Post-Graduation (MD — Pediatrician / Kaumarbhritya): Institute of Teaching and Research in Ayurveda (ITRA)",
          "Graduation (BAMS): Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur",
          "Medical Registration Number: 63934",
          "Clinical focus: Children's skin health, speech & neurodevelopmental co-care, growth, appetite, digestion, respiratory immunity, sleep & Suvarnaprashan",
          "Consultation languages: Hindi • Marathi • English • Gujarati",
        ],
        scopeHeading: "Clinical Scope & Ethical Approach",
        scopeItems: [
          "• 45-minute structured first consultation: detailed birth and developmental history, Prakriti–Agni–Ojas assessment, growth records, diet, sleep and daily routine — with a clear written plan.",
          "• Steroid-conscious, antibiotic-aware care that coordinates respectfully alongside your child's paediatrician and therapists.",
          "• Strict referral safety: acute emergencies, surgical conditions, immunizations and hospital care remain under modern paediatric care.",
          "• Transparent communication: age- and weight-specific dosing, home-kitchen nutrition charts, and realistic timelines without exaggerated promises.",
        ],
      },
      contact: {
        seoTitle: "Contact & Book Appointment | BalChikitsa Ayurved Clinic Indore",
        seoDesc: "Book an in-clinic or online appointment with Dr. Priyanka Likhar (Reg. No. 63934): +91 98607 75010, Kanadia Road Indore timings & patient enquiry form.",
        eyebrow: "Appointments",
        h1: "Contact & Book an Appointment",
        intro: "Call, WhatsApp, or submit the patient enquiry form below — our clinic confirms your slot promptly and shares a simple visit checklist.",
        crumb: "Contact",
        callTitle: "Call the clinic",
        waTitle: "WhatsApp enquiry",
        waSub: "Fastest for appointment slots",
        dirTitle: "Get clinic directions",
        emailTitle: "Email",
        formHeading: "Book Consultation / Send Enquiry",
        formSub: "Saved securely to clinic records — share brief details only; bring full reports during your consultation.",
        thankYou: "Thank you! Your enquiry has been recorded",
        nameLabel: "Parent's name *",
        namePh: "e.g. Priya Sharma",
        nameErr: "Please enter parent's name.",
        phoneLabel: "Mobile (Call / WhatsApp) *",
        phonePh: "+91 98765 43210",
        phoneErr: "Please enter a valid 10-digit mobile number.",
        childNameLabel: "Child's name *",
        childNamePh: "e.g. Aarav",
        childAgeLabel: "Child's age *",
        childAgePh: "e.g. 4 yrs",
        modeLabel: "Preferred consultation mode",
        modes: ["In-clinic (Indore)", "Online video consultation", "Need guidance on best option"],
        concernLabel: "Child's main concern *",
        concernPh: "e.g. Frequent colds & cough for 6 months, low appetite, poor weight gain…",
        concernErr: "Please describe your child's concern briefly (at least 5 characters).",
        submitBtn: "Submit Appointment Request",
        submittingBtn: "Submitting enquiry…",
        openWaBtn: "Also message on WhatsApp",
      },
      privacy: {
        seoTitle: "Privacy Policy | BalChikitsa Ayurved Clinic",
        seoDesc: "Privacy policy of BalChikitsa Ayurved Clinic: how parent and child consultation enquiries are protected.",
        eyebrow: "Legal",
        h1: "Privacy Policy",
        intro: "How BalChikitsa Ayurved Clinic collects, uses and safeguards parent and child enquiry details.",
        crumb: "Privacy Policy",
        items: [
          { strong: "What information we collect:", body: "Only the basic contact and consultation details you voluntarily submit (parent name, phone/WhatsApp, optional email, child's name, age, preferred consultation mode, and brief concern note)." },
          { strong: "How your information is used:", body: "Exclusively to respond to your enquiry, schedule your consultation, and prepare for your child's clinical care. We never sell, rent, or use patient data for advertising." },
          { strong: "Storage & confidentiality:", body: "Enquiries are stored confidentially for the clinic team and follow standard medical privacy practices. Avoid uploading sensitive government IDs in general enquiry boxes." },
          { strong: "Children's privacy:", body: "All information relating to a minor must be submitted solely by a parent or legal guardian for clinical care purposes." },
          { strong: "Your rights & contact:", body: "You may request review, correction, or deletion of enquiry records (subject to statutory medical-record retention rules) by contacting us directly:" },
          { strong: "Cookies & trackers:", body: "This website stores only essential preferences such as your chosen reading language and regional currency preference — zero third-party ad trackers are installed." },
        ],
      },
      terms: {
        seoTitle: "Terms of Use | BalChikitsa Ayurved Clinic",
        seoDesc: "Terms of use for BalChikitsa Ayurved Clinic website: educational guidance scope, emergency notice, and consultation policies.",
        eyebrow: "Legal",
        h1: "Terms of Use",
        intro: "Please read carefully what this website provides (health education & appointment booking) and its clinical boundaries.",
        crumb: "Terms of Use",
        items: [
          { strong: "Educational purpose only:", body: "Articles, condition guides, and therapy pages provide general health awareness and do not constitute individual medical diagnosis or prescription." },
          { strong: "Not an emergency service:", body: "Web forms, emails, and WhatsApp messages are not monitored for acute medical emergencies. In any emergency, visit your nearest hospital or paediatric emergency department immediately." },
          { strong: "Appointments & consultations:", body: "Appointment slots, modes (in-clinic or online), and plans are confirmed directly by BalChikitsa Ayurved Clinic." },
          { strong: "Individual outcomes:", body: "Healing timelines vary depending on a child's constitution, chronicity, diet adherence, and co-existing conditions. No guaranteed cures are promised." },
          { strong: "Intellectual property:", body: "Parents and educators are welcome to share page links freely; wholesale reproduction of clinical content without permission is prohibited." },
        ],
      },
      sitemap: {
        seoTitle: "Sitemap — All Pages | BalChikitsa Ayurved Clinic",
        seoDesc: "Complete directory of all child health condition guides, Ayurvedic treatments, parent articles, local Indore pages and clinic pages.",
        pagesCountSuffix: "public pages",
        h1: "Complete Site Directory (Sitemap)",
        intro: "Browse every page available on BalChikitsa Ayurved Clinic — supported in English, Hindi, Marathi and Gujarati.",
        crumb: "Sitemap",
        mainHeading: "Main Clinic Pages",
        mainLinks: [
          { label: "Home", href: "/" },
          { label: "About Dr. Priyanka Likhar", href: "/about-doctor/" },
          { label: "Child Health Hub", href: "/child-health/" },
          { label: "Frequently Asked Questions", href: "/faq/" },
          { label: "Contact & Book Appointment", href: "/contact/" },
        ],
        condHeading: "Child Health Conditions Library (22)",
        treatHeading: "Treatments & Consultation Services (12)",
        artHeading: "Parent Health Articles (23)",
        localHeading: "Indore & Madhya Pradesh Clinic Guides (7)",
        legalHeading: "Legal Policies",
      },
      notFound: {
        seoTitle: "Page Not Found | BalChikitsa Ayurved Clinic",
        h1: "That page could not be found",
        desc: "The link may have changed. Explore our child health library or book a consultation directly below.",
        homeBtn: "Go to Home",
        condBtn: "Browse 22 Conditions",
        contactBtn: "Contact Clinic",
      },
    },
  },

  hi: {
    header: {
      homeAria: "मुखपृष्ठ",
      indoreTag: "इंदौर",
      home: "मुखपृष्ठ",
      doctor: "डॉक्टर परिचय",
      conditions: "रोग मार्गदर्शिका",
      treatments: "उपचार व सेवाएँ",
      articles: "स्वास्थ्य लेख",
      faq: "सामान्य प्रश्न",
      contact: "संपर्क",
      callShort: "कॉल",
      callPrefix: "कॉल करें",
      bookVisit: "परामर्श बुक करें",
      bookChildVisit: "अपने बच्चे की विज़िट बुक करें",
      openMenu: "मेनू खोलें",
      closeMenu: "मेनू बंद करें",
      mobileLinks: [
        { href: "/", label: "मुखपृष्ठ" },
        { href: "/about-doctor/", label: "डॉ. प्रियंका लिखार के बारे में" },
        { href: "/child-health/", label: "बाल स्वास्थ्य केंद्र" },
        { href: "/conditions/", label: "बाल रोग मार्गदर्शिका (22)" },
        { href: "/treatments/", label: "आयुर्वेदिक उपचार व सेवाएँ" },
        { href: "/articles/", label: "माता-पिता हेतु स्वास्थ्य लेख" },
        { href: "/faq/", label: "अक्सर पूछे जाने वाले प्रश्न" },
        { href: "/contact/", label: "संपर्क व अपॉइंटमेंट" },
      ],
    },
    footer: {
      bio: "बालचिकित्सा आयुर्वेद क्लिनिक — इंदौर एवं ऑनलाइन विश्वभर में समर्पित आयुर्वेदिक बाल स्वास्थ्य देखभाल।",
      regBadge: "पंजीकरण क्र. 63934 • MD बालरोग विशेषज्ञ (ITRA) • BAMS (डॉ. वंदनाताई जे. ढोणे ग्रामीण आयुर्वेद कॉलेज, पातूर)",
      conditionsTitle: "प्रमुख समस्याएँ",
      allConditions: "सभी 22 समस्याएँ देखें →",
      treatmentsTitle: "उपचार व सेवाएँ",
      consultationLink: "आयुर्वेदिक परामर्श",
      articlesLink: "स्वास्थ्य लेख",
      faqLink: "सामान्य प्रश्न",
      sitemapLink: "साइटमैप",
      reachTitle: "क्लिनिक से संपर्क",
      bookBtn: "अपॉइंटमेंट बुक करें",
      rights: "सर्वाधिकार सुरक्षित।",
      privacy: "गोपनीयता नीति",
      terms: "उपयोग की शर्तें",
      aboutDoctor: "डॉक्टर की योग्यता",
      madeWith: "स्नेह से निर्मित",
      forKids: "स्वस्थ और खुशहाल बचपन के लिए",
      disclaimer: "केवल शैक्षिक जानकारी — आपातकालीन चिकित्सा सलाह का विकल्प नहीं। आयुर्वेदिक देखभाल बालरोग विशेषज्ञ के साथ समन्वय में दी जाती है। परिणाम प्रत्येक बच्चे की प्रकृति व निरंतरता पर निर्भर करते हैं।",
    },
    seoBlocks: {
      reviewerRole: "लेखिका एवं चिकित्सा समीक्षक",
      regLabel: "पंजीकरण क्र. 63934",
      pgLine: "MD — बालरोग विशेषज्ञ (कौमारभृत्य), इंस्टीट्यूट ऑफ टीचिंग एंड रिसर्च इन आयुर्वेद (ITRA)",
      ugLine: "BAMS — डॉ. वंदनाताई जे. ढोणे ग्रामीण आयुर्वेद कॉलेज, पातूर",
      reviewedOn: "चिकित्सकीय रूप से समीक्षित",
      authorNote: "यह जानकारी केवल स्वास्थ्य जागरूकता हेतु है — व्यक्तिगत परामर्श, निदान या आपातकालीन उपचार का विकल्प नहीं।",
      disclaimerStrong: "चिकित्सा अस्वीकरण:",
      disclaimerBody: "यह पृष्ठ सामान्य स्वास्थ्य शिक्षा प्रदान करता है और पेशेवर चिकित्सा सलाह, निदान या उपचार का स्थान नहीं लेता। यहाँ आयुर्वेदिक देखभाल बाल चिकित्सा के पूरक व समन्वय में होती है — अपने डॉक्टर की सलाह के बिना कोई भी चल रही दवा या थेरेपी बंद न करें। सांस लेने में कठिनाई, दौरे, निर्जलीकरण या चोट जैसी आपात स्थिति में तुरंत अस्पताल जाएँ।",
      ctaTitle: "समझ नहीं आ रहा कि बच्चे के लिए कहाँ से शुरू करें?",
      ctaBody: "एक बार अपनी चिंता साझा करें — डॉ. प्रियंका लिखार से स्पष्ट व ईमानदार मार्गदर्शन पाएँ कि आयुर्वेद कैसे मदद कर सकता है।",
      ctaBook: "अपॉइंटमेंट बुक करें",
      ctaWhatsapp: "WhatsApp पूछताछ",
      ctaWhatsappMsg: "नमस्ते डॉक्टर प्रियंका, मुझे अपने बच्चे के स्वास्थ्य के लिए मार्गदर्शन चाहिए।",
      ctaLocationLine: "संचार नगर एक्सटेंशन, कनाडिया रोड, इंदौर • सोम–शनि 10–2 व 5–8 IST • भारत व विदेश में ऑनलाइन परामर्श",
    },
    homeHubs: {
      exploreEyebrow: "आवश्यकता अनुसार खोजें",
      exploreTitle: "अपने बच्चे की समस्या से शुरुआत करें",
      exploreDesc: "नीचे दिया गया प्रत्येक विषय एक संपूर्ण मार्गदर्शिका है — लक्षण, जांच, घरेलू देखभाल, खतरे के संकेत और आयुर्वेदिक सह-देखभाल।",
      readGuide: "पूरी गाइड पढ़ें",
      cards: [
        { to: "/conditions/", t: "सभी 22 बाल समस्याएँ", d: "लक्षण व सावधानियों सहित A–Z लाइब्रेरी" },
        { to: "/treatments/customized-suvarnaprashan/", t: "सुवर्णप्राशन", d: "व्यक्तिगत ड्रॉप्स की पूरी जानकारी" },
        { to: "/articles/", t: "माता-पिता हेतु लेख", d: "नींद, स्क्रीन, आयरन व पोषण" },
        { to: "/ayurvedic-doctor-indore/", t: "इंदौर क्लिनिक विज़िट", d: "पता, समय व बुकिंग" },
      ],
      treatEyebrow: "उपचार व सेवाएँ",
      treatTitle: "क्लिनिक में उपलब्ध प्रमुख सेवाएँ",
      learnMore: "विस्तार से जानें",
      allTreatments: "सभी {count} उपचार व सेवाएँ देखें →",
      artEyebrow: "अभिभावक स्वास्थ्य शिक्षा",
      artTitle: "नवीनतम स्वास्थ्य लेख",
      minRead: "मिनट",
      browseArticles: "सभी {count} स्वास्थ्य लेख पढ़ें →",
    },
    categories: {
      "Development & Behaviour": "विकास एवं व्यवहार",
      Neurological: "तंत्रिका संबंधी (न्यूरोलॉजिकल)",
      "Growth & Nutrition": "शारीरिक विकास व पोषण",
      "Respiratory & Immunity": "श्वसन एवं रोग प्रतिरोधक क्षमता",
      "Digestion & Gut": "पाचन एवं आंत स्वास्थ्य",
      "Sleep & Habits": "नींद एवं दैनिक आदतें",
      Suvarnaprashan: "सुवर्णप्राशन",
      Panchakarma: "पंचकर्म",
      Consultation: "परामर्श",
      Therapies: "आयुर्वेदिक उपचार",
      "Child Health": "बाल स्वास्थ्य",
      Immunity: "रोग प्रतिरोधक क्षमता",
      Digestion: "पाचन",
      "Sleep & Routine": "नींद व दिनचर्या",
      Nutrition: "पोषण",
      "General Ayurveda": "सामान्य आयुर्वेद",
    },
    hubs: {
      homeCrumb: "मुखपृष्ठ",
      conditionsEyebrow: "22 अभिभावक मार्गदर्शिकाएँ",
      conditionsH1: "बाल स्वास्थ्य समस्या लाइब्रेरी",
      conditionsIntro: "बचपन की हर महत्वपूर्ण समस्या पर विस्तृत गाइड: यह क्या है, उम्र के अनुसार लक्षण, कब जांच कराएँ, निदान, घरेलू देखभाल, खतरे के संकेत और आयुर्वेद की भूमिका।",
      conditionsCrumb: "रोग मार्गदर्शिका",
      treatmentsEyebrow: "सेवाएँ एवं चिकित्सा",
      treatmentsH1: "आयुर्वेदिक उपचार व सेवाएँ",
      treatmentsIntro: "प्रत्येक उपचार पृष्ठ स्पष्ट रूप से बताता है कि यह क्या है, किसके लिए उपयुक्त है, सावधानियाँ और परामर्श की पूरी प्रक्रिया।",
      treatmentsCrumb: "उपचार व सेवाएँ",
      treatGroups: [
        { title: "व्यक्तिगत सुवर्णप्राशन श्रृंखला", desc: "मुख्य गाइड के साथ सुरक्षा, उपयुक्त आयु, घटक और शास्त्रीय आधार।" },
        { title: "पंचकर्म व शास्त्रीय आयुर्वेदिक उपचार", desc: "बच्चे की प्रकृति के अनुसार सौम्य, मूल्यांकन-आधारित उपचार।" },
        { title: "परामर्श सेवाएँ", desc: "इंदौर क्लिनिक एवं विश्वभर में 45-मिनट का गहन ऑनलाइन वीडियो परामर्श।" },
      ],
      articlesEyebrow: "स्वास्थ्य शिक्षा लाइब्रेरी",
      articlesH1: "माता-पिता व परिवार के लिए स्वास्थ्य लेख",
      articlesIntro: "डॉ. प्रियंका लिखार द्वारा लिखित व समीक्षित व्यावहारिक, प्रमाण-सचेत लेख — ताकि आप सही जानकारी के साथ निर्णय ले सकें।",
      articlesCrumb: "स्वास्थ्य लेख",
      articlesCtaTitle: "अपने बच्चे के बारे में कोई विशेष प्रश्न है?",
      articlesCtaBody: "क्लिनिक को पूछताछ भेजें — हम व्यक्तिगत रूप से समीक्षा कर सही मार्गदर्शन देते हैं।",
      childHealthEyebrow: "यहाँ से शुरू करें",
      childHealthH1: "बाल स्वास्थ्य केंद्र (Child Health Hub)",
      childHealthIntro: "अपने बच्चे की स्थिति चुनें — हर श्रेणी आपको हिंदी, मराठी, गुजराती और अंग्रेज़ी में विस्तृत गाइड तक ले जाती है।",
      childHealthCrumb: "बाल स्वास्थ्य",
      childHealthPaths: [
        { title: "वज़न, लंबाई या भूख कम है?", desc: "विकास, एनीमिया और खाने में नखरे।", links: [["भूख की कमी", "/conditions/poor-appetite-children/"], ["विकास व पोषण", "/conditions/growth-nutrition-concerns/"], ["बच्चों में कब्ज", "/conditions/constipation-children/"]] },
        { title: "बोलने में देरी, ध्यान या विकास की चिंता?", desc: "शांत और चरणबद्ध विकासात्मक मार्गदर्शन।", links: [["वाणी विलंब (Speech Delay)", "/conditions/speech-delay-in-children/"], ["बच्चों में ADHD", "/conditions/adhd-in-children/"], ["विकास के मील के पत्थर में देरी", "/conditions/delayed-milestones/"], ["ऑटिज़्म लक्षण व मूल्यांकन", "/conditions/autism-signs-assessment/"]] },
        { title: "बच्चा बार-बार बीमार पड़ता है?", desc: "सर्दी-खांसी, बुखार और रोग प्रतिरोधक क्षमता।", links: [["बार-बार सर्दी और खांसी", "/conditions/frequent-colds-cough-children/"], ["बच्चों में बुखार", "/conditions/fever-children/"], ["व्यक्तिगत सुवर्णप्राशन", "/treatments/customized-suvarnaprashan/"]] },
        { title: "नींद, भोजन और दिनचर्या की नींव", desc: "रोज़मर्रा की आदतें जो स्वास्थ्य बदल देती हैं।", links: [["नींद की समस्याएँ", "/conditions/sleep-problems-children/"], ["बिस्तर गीला करना", "/conditions/bedwetting-children/"], ["बच्चों की नींद दिनचर्या", "/articles/sleep-routine-children/"]] },
      ],
      faqEyebrow: "सहायता केंद्र",
      faqH1: "अक्सर पूछे जाने वाले प्रश्न (FAQ)",
      faqIntro: "अपॉइंटमेंट, ऑनलाइन परामर्श, सुवर्णप्राशन, बच्चों की सुरक्षा, समय और भाषाओं से जुड़े सभी प्रश्नों के स्पष्ट उत्तर।",
      faqCrumb: "सामान्य प्रश्न",
      faqGroups: [
        {
          h: "विज़िट एवं बुकिंग",
          faqs: [
            { q: "अपॉइंटमेंट कैसे बुक करें?", a: "संपर्क पृष्ठ का फॉर्म भरें, +91 98607 75010 पर कॉल/WhatsApp करें, या ऑनलाइन स्लॉट चुनें। आपको कन्फर्म समय और तैयारी की संक्षिप्त सूची मिल जाएगी।" },
            { q: "पहली विज़िट में क्या साथ लाएँ?", a: "पुरानी रिपोर्ट्स, चल रही दवाओं की सूची, टीकाकरण कार्ड, वज़न/लंबाई का रिकॉर्ड, और 3 दिन के भोजन-नींद का संक्षिप्त विवरण साथ रखें।" },
            { q: "आप किन भाषाओं में परामर्श देती हैं?", a: "डॉ. प्रियंका लिखार हिंदी, मराठी, अंग्रेज़ी और गुजराती — चारों भाषाओं में सहज परामर्श देती हैं।" },
          ],
        },
        {
          h: "ऑनलाइन परामर्श",
          faqs: [
            { q: "ऑनलाइन परामर्श कैसे होता है?", a: "45-मिनट के वीडियो परामर्श में बच्चे का पूरा इतिहास, रिपोर्ट्स, फोटो और ग्रोथ चार्ट देखा जाता है, फिर लिखित पर्चा व घरेलू आहार चार्ट WhatsApp/ईमेल पर भेजा जाता है।" },
            { q: "कब प्रत्यक्ष क्लिनिक दिखाना ज़रूरी होता है?", a: "पंचकर्म/अभ्यंग जैसी प्रक्रियाएँ, नवजात शिशु की गहन शारीरिक जांच और किसी भी आपातकालीन स्थिति में प्रत्यक्ष चिकित्सा आवश्यक है।" },
          ],
        },
        {
          h: "योग्यता, सुरक्षा एवं दायरा",
          faqs: [
            { q: "डॉ. प्रियंका लिखार की शैक्षणिक योग्यता और पंजीकरण संख्या क्या है?", a: "डॉ. प्रियंका लिखार की पंजीकरण संख्या 63934 है। उन्होंने इंस्टीट्यूट ऑफ टीचिंग एंड रिसर्च इन आयुर्वेद (ITRA) से बालरोग विशेषज्ञता (MD — कौमारभृत्य) में स्नातकोत्तर तथा डॉ. वंदनाताई जे. ढोणे ग्रामीण आयुर्वेद कॉलेज, पातूर से BAMS पूर्ण किया है।" },
            { q: "क्या बच्चों के लिए आयुर्वेदिक दवा सुरक्षित है?", a: "योग्य MD कौमारभृत्य विशेषज्ञ द्वारा बच्चे की उम्र व वज़न के अनुसार प्रमाणित औषधियाँ देना सुरक्षित व सौम्य होता है। चल रही एलोपैथिक दवा कभी अचानक खुद से बंद न करें।" },
            { q: "क्या आप आपातकालीन (Emergency) इलाज करती हैं?", a: "नहीं — सांस फूलना, दौरे, गंभीर निर्जलीकरण, चोट या नवजात में तेज़ बुखार होने पर तुरंत नजदीकी आपातकालीन अस्पताल जाएँ।" },
          ],
        },
      ],
    },
    templates: {
      medicallyReviewed: "चिकित्सकीय समीक्षित",
      alsoSearched: "संबंधित खोज विषय",
      overviewEyebrow: "परिचय",
      whatIsTitle: "यह क्या है",
      symptomsEyebrow: "लक्षण",
      signsTitle: "सामान्य संकेत एवं लक्षण",
      byAgeEyebrow: "आयु अनुसार",
      ageTitle: "उम्र के अनुसार विशेष बातें",
      causesEyebrow: "कारण",
      causesTitle: "प्रमुख कारण एवं जोखिम कारक",
      assessEyebrow: "मूल्यांकन",
      assessTitle: "जांच व परामर्श कब आवश्यक है",
      diagnosisEyebrow: "निदान",
      diagnosisTitle: "निदान कैसे किया जाता है",
      treatmentEyebrow: "प्रबंधन",
      managementTitle: "प्रमाण-आधारित देखभाल व प्रबंधन",
      homeEyebrow: "घरेलू देखभाल",
      homeTitle: "घरेलू उपाय एवं सहायक दिनचर्या",
      warningTitle: "खतरे के संकेत — तुरंत डॉक्टर को दिखाएँ",
      ayurvedaEyebrow: "आयुर्वेदिक सह-देखभाल",
      ayurvedaTitle: "आयुर्वेद की भूमिका (और ईमानदार सीमाएँ)",
      canSupport: "आयुर्वेद किसमें सहायता कर सकता है",
      honestLimits: "ईमानदार सीमाएँ",
      faqEyebrow: "सामान्य प्रश्न",
      faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
      referencesTitle: "चिकित्सा संदर्भ",
      relatedTitle: "संबंधित पठन सामग्री",
      relatedKindCondition: "समस्या गाइड",
      relatedKindTreatment: "उपचार गाइड",
      relatedKindArticle: "स्वास्थ्य लेख",
      condWhatsappPrefix: "नमस्ते डॉक्टर प्रियंका, मैंने आपकी गाइड पढ़ी और अपने बच्चे के लिए परामर्श चाहती/चाहता हूँ — विषय:",
      serviceLabel: "सेवा",
      treatmentLabel: "उपचार",
      partLabel: "भाग",
      suitsTitle: "किसके लिए उपयुक्त है",
      avoidTitle: "कब रुकें / पहले डॉक्टर से पूछें",
      askAtConsult: "परामर्श के दौरान पूछें — उपयुक्तता प्रत्येक बच्चे की प्रकृति के अनुसार तय होती है।",
      safetyEyebrow: "सुरक्षा",
      risksTitle: "सावधानियाँ, सुरक्षा व निषेध",
      processEyebrow: "प्रक्रिया",
      processTitle: "परामर्श एवं उपचार प्रक्रिया",
      consideringPrefix: "क्या आप इसके बारे में सोच रहे हैं:",
      consideringBody: "पहले विस्तृत मूल्यांकन से शुरुआत करें — उपयुक्तता, अवधि, प्रक्रिया और अपेक्षित लाभ की स्पष्ट जानकारी पाएँ।",
      treatWhatsappPrefix: "नमस्ते डॉक्टर प्रियंका, मुझे इस उपचार/सेवा के बारे में जानकारी चाहिए:",
      takeawaysTitle: "मुख्य बिंदु",
      artCtaTitle: "क्या आपके बच्चे में भी यह समस्या दिख रही है?",
      artWhatsappPrefix: "नमस्ते डॉक्टर प्रियंका, मैंने आपका लेख पढ़ा और मार्गदर्शन चाहती/चाहता हूँ:",
      indoreEyebrow: "इंदौर • मध्य प्रदेश",
      whyChooseTitle: "परिवार इस क्लिनिक को क्यों चुनते हैं",
      areasServedTitle: "सेवा क्षेत्र",
      visitInfoTitle: "क्लिनिक विज़िट एवं परामर्श जानकारी",
      localFaqTitle: "स्थानीय अभिभावकों के सामान्य प्रश्न",
      continueExploring: "आगे और जानें",
    },
    staticPages: {
      about: {
        seoTitle: "डॉ. प्रियंका लिखार का परिचय (MD बालरोग ITRA, BAMS, पंजी. 63934) | इंदौर",
        seoDesc: "डॉ. प्रियंका लिखार (पंजीकरण संख्या 63934) की प्रमाणित योग्यता: इंस्टीट्यूट ऑफ टीचिंग एंड रिसर्च इन आयुर्वेद (ITRA) से MD बालरोग एवं डॉ. वंदनाताई जे. ढोणे ग्रामीण आयुर्वेद कॉलेज, पातूर से BAMS।",
        eyebrow: "प्रमाणित चिकित्सक परिचय",
        h1: "डॉ. प्रियंका लिखार के बारे में",
        intro: "डॉ. प्रियंका लिखार (पंजीकरण संख्या: 63934) एक अनुभवी आयुर्वेदिक बालरोग विशेषज्ञ (MD — कौमारभृत्य / बालरोग) हैं, जो बालचिकित्सा आयुर्वेद क्लिनिक, इंदौर में तथा ऑनलाइन माध्यम से देश-विदेश के परिवारों को परामर्श देती हैं।",
        crumb: "डॉक्टर परिचय",
        regBadgeLabel: "चिकित्सा पंजीकरण संख्या: 63934",
        qualsList: [
          "स्नातकोत्तर (MD — बालरोग विशेषज्ञ / कौमारभृत्य): इंस्टीट्यूट ऑफ टीचिंग एंड रिसर्च इन आयुर्वेद (ITRA)",
          "स्नातक (BAMS): डॉ. वंदनाताई जे. ढोणे ग्रामीण आयुर्वेद कॉलेज, पातूर",
          "चिकित्सा पंजीकरण संख्या (Registration No.): 63934",
          "विशेष कार्यक्षेत्र: बच्चों के त्वचा रोग, वाणी व ध्यान विकास, भूख व शारीरिक वृद्धि, पाचन, बार-बार सर्दी-खांसी, नींद एवं सुवर्णप्राशन",
          "परामर्श भाषाएँ: हिंदी • मराठी • अंग्रेज़ी • गुजराती",
        ],
        scopeHeading: "चिकित्सा दृष्टिकोण एवं नैतिक कार्यक्षेत्र",
        scopeItems: [
          "• 45-मिनट का विस्तृत प्रथम परामर्श: जन्म व विकास इतिहास, प्रकृति–अग्नि–ओजस मूल्यांकन, ग्रोथ चार्ट, आहार, नींद और दिनचर्या के आधार पर लिखित योजना।",
          "• स्टेरॉयड-सचेत एवं एंटीबायोटिक-सजग दृष्टिकोण, आपके बालरोग विशेषज्ञ और थेरेपिस्ट के साथ सम्मानजनक समन्वय।",
          "• स्पष्ट सुरक्षा सीमाएँ: आपातकालीन स्थितियाँ, टीकाकरण और अस्पताल देखभाल आधुनिक बाल चिकित्सा के अंतर्गत ही रहती हैं।",
          "• पूर्ण पारदर्शिता: बच्चे की उम्र व वज़न के अनुसार सुरक्षित मात्रा, घर के भोजन आधारित आहार चार्ट और ईमानदार समय-सीमा।",
        ],
      },
      contact: {
        seoTitle: "संपर्क एवं अपॉइंटमेंट बुक करें | बालचिकित्सा आयुर्वेद क्लिनिक इंदौर",
        seoDesc: "डॉ. प्रियंका लिखार (पंजीकरण क्र. 63934) के साथ क्लिनिक या ऑनलाइन अपॉइंटमेंट बुक करें: +91 98607 75010, कनाडिया रोड इंदौर।",
        eyebrow: "अपॉइंटमेंट",
        h1: "संपर्क करें एवं अपॉइंटमेंट बुक करें",
        intro: "कॉल करें, WhatsApp करें या नीचे दिया गया पूछताछ फॉर्म भरें — क्लिनिक टीम जल्द ही आपका स्लॉट कन्फर्म करेगी।",
        crumb: "संपर्क",
        callTitle: "क्लिनिक में कॉल करें",
        waTitle: "WhatsApp पूछताछ",
        waSub: "स्लॉट बुकिंग का सबसे तेज़ माध्यम",
        dirTitle: "क्लिनिक का रास्ता देखें",
        emailTitle: "ईमेल",
        formHeading: "परामर्श बुकिंग / पूछताछ फॉर्म",
        formSub: "क्लिनिक रिकॉर्ड में सुरक्षित रूप से सहेजा जाता है — केवल संक्षिप्त जानकारी लिखें; विस्तृत रिपोर्ट विज़िट के समय दिखाएँ।",
        thankYou: "धन्यवाद! आपकी पूछताछ दर्ज कर ली गई है",
        nameLabel: "माता/पिता का नाम *",
        namePh: "उदा. प्रिया शर्मा",
        nameErr: "कृपया माता/पिता का नाम लिखें।",
        phoneLabel: "मोबाइल नंबर (कॉल / WhatsApp) *",
        phonePh: "+91 98765 43210",
        phoneErr: "कृपया वैध 10-अंकीय मोबाइल नंबर दर्ज करें।",
        childNameLabel: "बच्चे का नाम *",
        childNamePh: "उदा. आरव",
        childAgeLabel: "बच्चे की उम्र *",
        childAgePh: "उदा. 4 वर्ष",
        modeLabel: "परामर्श का माध्यम",
        modes: ["क्लिनिक विज़िट (इंदौर)", "ऑनलाइन वीडियो परामर्श", "मार्गदर्शन चाहिए"],
        concernLabel: "मुख्य समस्या का संक्षिप्त विवरण *",
        concernPh: "उदा. पिछले 6 महीनों से बार-बार सर्दी-खांसी, कम भूख, वज़न न बढ़ना…",
        concernErr: "कृपया समस्या का संक्षिप्त विवरण लिखें।",
        submitBtn: "अपॉइंटमेंट अनुरोध भेजें",
        submittingBtn: "भेजा जा रहा है…",
        openWaBtn: "WhatsApp पर भी संदेश भेजें",
      },
      privacy: {
        seoTitle: "गोपनीयता नीति | बालचिकित्सा आयुर्वेद क्लिनिक",
        seoDesc: "बालचिकित्सा आयुर्वेद क्लिनिक की गोपनीयता नीति: माता-पिता व बच्चों की जानकारी की सुरक्षा।",
        eyebrow: "कानूनी जानकारी",
        h1: "गोपनीयता नीति (Privacy Policy)",
        intro: "बालचिकित्सा आयुर्वेद क्लिनिक आपके और आपके बच्चे के परामर्श विवरणों की सुरक्षा कैसे करता है।",
        crumb: "गोपनीयता नीति",
        items: [
          { strong: "हम कौन-सी जानकारी एकत्र करते हैं:", body: "केवल वे आवश्यक संपर्क और परामर्श विवरण जो आप स्वयं फॉर्म या संदेश द्वारा साझा करते हैं (माता-पिता का नाम, फ़ोन/WhatsApp, वैकल्पिक ईमेल, बच्चे का नाम, उम्र, परामर्श माध्यम और संक्षिप्त समस्या)।" },
          { strong: "जानकारी का उपयोग कैसे होता है:", body: "केवल आपकी पूछताछ का उत्तर देने, अपॉइंटमेंट तय करने और बच्चे की देखभाल की तैयारी हेतु। हम किसी को डेटा बेचते नहीं हैं और न ही विज्ञापन प्रोफाइलिंग करते हैं।" },
          { strong: "भंडारण व गोपनीयता:", body: "सभी विवरण चिकित्सा गोपनीयता के मानकों के अंतर्गत सुरक्षित रखे जाते हैं। वेब फॉर्म में सरकारी पहचान-पत्र अपलोड न करें।" },
          { strong: "बच्चों के डेटा की सुरक्षा:", body: "नाबालिग बच्चों से संबंधित जानकारी केवल माता-पिता या वैध अभिभावक द्वारा उपचार हेतु ही दी जानी चाहिए।" },
          { strong: "आपके अधिकार व संपर्क:", body: "आप अपने विवरण देखने, सुधारने या हटाने का अनुरोध (चिकित्सा रिकॉर्ड नियमों के अधीन) सीधे क्लिनिक से कर सकते हैं:" },
          { strong: "कुकीज़ व ट्रैकिंग:", body: "यह वेबसाइट केवल आपकी चुनी हुई भाषा और मुद्रा प्राथमिकता सहेजती है — इसमें कोई भी विज्ञापन ट्रैकर नहीं है।" },
        ],
      },
      terms: {
        seoTitle: "उपयोग की शर्तें | बालचिकित्सा आयुर्वेद क्लिनिक",
        seoDesc: "बालचिकित्सा आयुर्वेद क्लिनिक वेबसाइट के उपयोग की शर्तें एवं चिकित्सा सीमाएँ।",
        eyebrow: "कानूनी जानकारी",
        h1: "उपयोग की शर्तें (Terms of Use)",
        intro: "कृपया पढ़ें कि यह वेबसाइट क्या सेवा देती है (स्वास्थ्य शिक्षा व अपॉइंटमेंट अनुरोध) और इसकी सीमाएँ क्या हैं।",
        crumb: "उपयोग की शर्तें",
        items: [
          { strong: "केवल स्वास्थ्य शिक्षा हेतु:", body: "वेबसाइट के लेख व गाइड सामान्य जागरूकता के लिए हैं; ये व्यक्तिगत चिकित्सा निदान या पर्चे का स्थान नहीं लेते।" },
          { strong: "आपातकालीन सेवा नहीं:", body: "वेबसाइट फॉर्म या संदेश आपातकालीन स्थिति के लिए नहीं हैं। किसी भी गंभीर लक्षण में तुरंत नजदीकी अस्पताल ले जाएँ।" },
          { strong: "अपॉइंटमेंट पुष्टि:", body: "परामर्श समय, माध्यम और शुल्क क्लिनिक द्वारा बुकिंग के समय कन्फर्म किए जाते हैं।" },
          { strong: "परिणामों की पारदर्शिता:", body: "प्रत्येक बच्चे में सुधार की गति उसकी प्रकृति, समस्या की अवधि और आहार पालन पर निर्भर करती है; किसी चमत्कारिक गारंटी का दावा नहीं किया जाता।" },
          { strong: "सामग्री उपयोग:", body: "आप किसी भी पेज का लिंक साझा कर सकते हैं, परंतु अनुमति के बिना चिकित्सा लेखों की पूरी नकल वर्जित है।" },
        ],
      },
      sitemap: {
        seoTitle: "साइटमैप — सभी पृष्ठ | बालचिकित्सा आयुर्वेद क्लिनिक",
        seoDesc: "सभी 22 बाल रोग गाइड, उपचार, स्वास्थ्य लेख और क्लिनिक पृष्ठों की पूरी सूची।",
        pagesCountSuffix: "सार्वजनिक पृष्ठ",
        h1: "संपूर्ण वेबसाइट सूची (साइटमैप)",
        intro: "बालचिकित्सा आयुर्वेद क्लिनिक के सभी पृष्ठ — हिंदी, मराठी, गुजराती और अंग्रेज़ी में उपलब्ध।",
        crumb: "साइटमैप",
        mainHeading: "मुख्य पृष्ठ",
        mainLinks: [
          { label: "मुखपृष्ठ", href: "/" },
          { label: "डॉ. प्रियंका लिखार के बारे में", href: "/about-doctor/" },
          { label: "बाल स्वास्थ्य केंद्र", href: "/child-health/" },
          { label: "अक्सर पूछे जाने वाले प्रश्न", href: "/faq/" },
          { label: "संपर्क व अपॉइंटमेंट", href: "/contact/" },
        ],
        condHeading: "बाल स्वास्थ्य समस्या लाइब्रेरी (22)",
        treatHeading: "उपचार एवं परामर्श सेवाएँ (12)",
        artHeading: "अभिभावक स्वास्थ्य लेख (23)",
        localHeading: "इंदौर एवं मध्य प्रदेश परामर्श पृष्ठ (7)",
        legalHeading: "कानूनी नीतियाँ",
      },
      notFound: {
        seoTitle: "पृष्ठ नहीं मिला | बालचिकित्सा आयुर्वेद क्लिनिक",
        h1: "यह पृष्ठ उपलब्ध नहीं है",
        desc: "संभवतः लिंक बदल गया हो। नीचे दिए गए विकल्पों से मुख्य पृष्ठ या बाल स्वास्थ्य गाइड देखें।",
        homeBtn: "मुखपृष्ठ पर जाएँ",
        condBtn: "22 समस्याएँ देखें",
        contactBtn: "क्लिनिक संपर्क",
      },
    },
  },

  mr: {
    header: {
      homeAria: "मुख्यपृष्ठ",
      indoreTag: "इंदूर",
      home: "मुख्यपृष्ठ",
      doctor: "डॉक्टर परिचय",
      conditions: "आजार मार्गदर्शिका",
      treatments: "उपचार व सेवा",
      articles: "आरोग्य लेख",
      faq: "नेहमीचे प्रश्न",
      contact: "संपर्क",
      callShort: "कॉल",
      callPrefix: "कॉल करा",
      bookVisit: "भेट बुक करा",
      bookChildVisit: "तुमच्या बाळाची भेट बुक करा",
      openMenu: "मेनू उघडा",
      closeMenu: "मेनू बंद करा",
      mobileLinks: [
        { href: "/", label: "मुख्यपृष्ठ" },
        { href: "/about-doctor/", label: "डॉ. प्रियांका लिखार यांच्याबद्दल" },
        { href: "/child-health/", label: "बाल आरोग्य केंद्र" },
        { href: "/conditions/", label: "बाल आजार लायब्ररी (22)" },
        { href: "/treatments/", label: "उपचार व सेवा" },
        { href: "/articles/", label: "पालकांसाठी आरोग्य लेख" },
        { href: "/faq/", label: "नेहमी विचारले जाणारे प्रश्न" },
        { href: "/contact/", label: "संपर्क व अपॉइंटमेंट" },
      ],
    },
    footer: {
      bio: "बालचिकित्सा आयुर्वेद क्लिनिक — इंदूर आणि जगभरात ऑनलाइन समर्पित आयुर्वेदिक बाल आरोग्य सेवा.",
      regBadge: "नोंदणी क्र. 63934 • MD बालरोगतज्ज्ञ (ITRA) • BAMS (डॉ. वंदनाताई जे. ढोणे ग्रामीण आयुर्वेद कॉलेज, पातूर)",
      conditionsTitle: "प्रमुख समस्या",
      allConditions: "सर्व 22 समस्या पहा →",
      treatmentsTitle: "उपचार व सेवा",
      consultationLink: "आयुर्वेदिक सल्ला",
      articlesLink: "आरोग्य लेख",
      faqLink: "नेहमीचे प्रश्न",
      sitemapLink: "साइटमॅप",
      reachTitle: "क्लिनिकशी संपर्क",
      bookBtn: "अपॉइंटमेंट बुक करा",
      rights: "सर्व हक्क राखीव.",
      privacy: "गोपनीयता धोरण",
      terms: "वापराच्या अटी",
      aboutDoctor: "डॉक्टरांची पात्रता",
      madeWith: "प्रेमाने निर्मिले",
      forKids: "सुदृढ व आनंदी बालपणासाठी",
      disclaimer: "फक्त शैक्षणिक माहिती — आपत्कालीन वैद्यकीय सल्ल्याचा पर्याय नाही. आयुर्वेदिक काळजी बालरोगतज्ज्ञांच्या समन्वयाने दिली जाते. परिणाम प्रत्येक मुलाच्या प्रकृतीवर व सातत्यावर अवलंबून असतात.",
    },
    seoBlocks: {
      reviewerRole: "लेखिका व वैद्यकीय समीक्षक",
      regLabel: "नोंदणी क्र. 63934",
      pgLine: "MD — बालरोगतज्ज्ञ (कौमारभृत्य), इन्स्टिट्यूट ऑफ टीचिंग अँड रिसर्च इन आयुर्वेद (ITRA)",
      ugLine: "BAMS — डॉ. वंदनाताई जे. ढोणे ग्रामीण आयुर्वेद कॉलेज, पातूर",
      reviewedOn: "वैद्यकीयदृष्ट्या समीक्षित",
      authorNote: "ही माहिती केवळ आरोग्य जनजागृतीसाठी आहे — वैयक्तिक तपासणी, निदान किंवा आपत्कालीन उपचारांचा पर्याय नाही.",
      disclaimerStrong: "वैद्यकीय अस्वीकरण:",
      disclaimerBody: "हे पान सामान्य आरोग्य शिक्षण देते आणि वैद्यकीय सल्ला, निदान किंवा उपचारांची जागा घेत नाही. येथील आयुर्वेदिक काळजी बालरोग उपचारांना पूरक व समन्वयाने दिली जाते — डॉक्टरांच्या सल्ल्याशिवाय सुरू असलेली कोणतीही औषधे किंवा थेरपी थांबवू नका. श्वासोच्छवासास त्रास, फिट्स, निर्जलीकरण किंवा दुखापत झाल्यास त्वरित रुग्णालयात जा.",
      ctaTitle: "मुलासाठी नेमके कुठून सुरू करावे समजत नाहीये?",
      ctaBody: "एकदाच तक्रार कळवा — डॉ. प्रियांका लिखार यांच्याकडून प्रामाणिक मार्गदर्शन मिळवा की आयुर्वेद कशी मदत करू शकतो.",
      ctaBook: "अपॉइंटमेंट बुक करा",
      ctaWhatsapp: "WhatsApp चौकशी",
      ctaWhatsappMsg: "नमस्ते डॉक्टर प्रियांका, मला माझ्या मुलाच्या आरोग्यासाठी मार्गदर्शन हवे आहे.",
      ctaLocationLine: "संचार नगर एक्स्टेंशन, कनाडिया रोड, इंदूर • सोम–शनि 10–2 व 5–8 IST • भारत व परदेशात ऑनलाइन सल्ला",
    },
    homeHubs: {
      exploreEyebrow: "गरजेनुसार शोधा",
      exploreTitle: "तुमच्या मुलाच्या समस्येपासून सुरुवात करा",
      exploreDesc: "खालील प्रत्येक विषयावर संपूर्ण मार्गदर्शक आहे — लक्षणे, तपासणी, घरगुती काळजी, धोक्याची चिन्हे आणि आयुर्वेदिक सह-उपचार.",
      readGuide: "संपूर्ण मार्गदर्शक वाचा",
      cards: [
        { to: "/conditions/", t: "सर्व 22 आजार मार्गदर्शक", d: "लक्षणे व धोक्याच्या चिन्हांसह लायब्ररी" },
        { to: "/treatments/customized-suvarnaprashan/", t: "सुवर्णप्राशन", d: "वैयक्तिक थेंबांची प्रामाणिक माहिती" },
        { to: "/articles/", t: "पालकांसाठी लेख", d: "झोप, स्क्रीन, लोह व पोषण" },
        { to: "/ayurvedic-doctor-indore/", t: "इंदूर क्लिनिक भेट", d: "पत्ता, वेळ व बुकिंग" },
      ],
      treatEyebrow: "उपचार व सेवा",
      treatTitle: "क्लिनिकमध्ये उपलब्ध सेवा",
      learnMore: "अधिक जाणून घ्या",
      allTreatments: "सर्व {count} उपचार व सेवा पहा →",
      artEyebrow: "पालक आरोग्य शिक्षण",
      artTitle: "नवीनतम आरोग्य लेख",
      minRead: "मिनिटे",
      browseArticles: "सर्व {count} आरोग्य लेख वाचा →",
    },
    categories: {
      "Development & Behaviour": "विकास आणि वर्तन",
      Neurological: "मज्जासंस्थेशी संबंधित (न्यूरोलॉजिकल)",
      "Growth & Nutrition": "शारीरिक वाढ व पोषण",
      "Respiratory & Immunity": "श्वसन व रोगप्रतिकारक शक्ती",
      "Digestion & Gut": "पचन व आतड्यांचे आरोग्य",
      "Sleep & Habits": "झोप व दैनंदिन सवयी",
      Suvarnaprashan: "सुवर्णप्राशन",
      Panchakarma: "पंचकर्म",
      Consultation: "सल्लामसलत",
      Therapies: "आयुर्वेदिक उपचार",
      "Child Health": "बाल आरोग्य",
      Immunity: "रोगप्रतिकारक शक्ती",
      Digestion: "पचन",
      "Sleep & Routine": "झोप व दिनचर्या",
      Nutrition: "पोषण",
      "General Ayurveda": "सामान्य आयुर्वेद",
    },
    hubs: {
      homeCrumb: "मुख्यपृष्ठ",
      conditionsEyebrow: "22 पालक मार्गदर्शक",
      conditionsH1: "बाल आरोग्य समस्या लायब्ररी",
      conditionsIntro: "बालपणातील प्रत्येक महत्त्वाच्या समस्येवर स्वतंत्र सविस्तर पान: आजार काय आहे, वयानुसार लक्षणे, कधी तपासणी करावी, घरगुती काळजी, धोक्याची चिन्हे आणि आयुर्वेदाची भूमिका.",
      conditionsCrumb: "आजार मार्गदर्शिका",
      treatmentsEyebrow: "सेवा आणि उपचार",
      treatmentsH1: "उपचार व सल्ला सेवा",
      treatmentsIntro: "प्रत्येक उपचार पानावर ते कोणासाठी योग्य आहे, काय काळजी घ्यावी आणि संपूर्ण प्रक्रिया स्पष्टपणे दिली आहे.",
      treatmentsCrumb: "उपचार व सेवा",
      treatGroups: [
        { title: "वैयक्तिक सुवर्णप्राशन विभाग", desc: "मुख्य मार्गदर्शकासह सुरक्षितता, योग्य वय, घटक आणि शास्त्रीय माहिती." },
        { title: "पंचकर्म व शास्त्रीय उपचार", desc: "मुलाच्या प्रकृतीनुसार सौम्य व तपासणी-आधारित आयुर्वेदिक उपचार." },
        { title: "सल्लामसलत (Consultations)", desc: "इंदूर क्लिनिक आणि जगभरात 45-मिनिटांचा सखोल ऑनलाइन व्हिडिओ सल्ला." },
      ],
      articlesEyebrow: "आरोग्य शिक्षण लायब्ररी",
      articlesH1: "पालक व कुटुंबासाठी आरोग्य लेख",
      articlesIntro: "डॉ. प्रियांका लिखार यांनी लिहिलेले व तपासलेले उपयुक्त, पुराव्याधिष्ठित लेख.",
      articlesCrumb: "आरोग्य लेख",
      articlesCtaTitle: "तुमच्या मुलाच्या आरोग्याविषयी प्रश्न आहे?",
      articlesCtaBody: "क्लिनिकला संदेश पाठवा — आम्ही वैयक्तिकरीत्या तपासून योग्य मार्गदर्शन करतो.",
      childHealthEyebrow: "येथून सुरुवात करा",
      childHealthH1: "बाल आरोग्य केंद्र (Child Health Hub)",
      childHealthIntro: "तुमच्या काळजीशी संबंधित विभाग निवडा — प्रत्येक दुवा मराठी, हिंदी, गुजराती व इंग्रजीतील सविस्तर मार्गदर्शकाकडे नेतो.",
      childHealthCrumb: "बाल आरोग्य",
      childHealthPaths: [
        { title: "वजन, उंची किंवा भूक कमी आहे?", desc: "वाढ, रक्तक्षय (ॲनिमिया) आणि खाण्याच्या तक्रारी.", links: [["भूक मंदावणे", "/conditions/poor-appetite-children/"], ["वाढ आणि पोषण", "/conditions/growth-nutrition-concerns/"], ["मुलांतील बद्धकोष्ठता", "/conditions/constipation-children/"]] },
        { title: "बोलण्यास उशीर, लक्ष किंवा विकासाची काळजी?", desc: "शांत आणि टप्प्याटप्प्याने विकासात्मक मार्गदर्शन.", links: [["बोलण्यास उशीर (Speech Delay)", "/conditions/speech-delay-in-children/"], ["मुलांमधील ADHD", "/conditions/adhd-in-children/"], ["विकासाचे टप्पे उशिरा गाठणे", "/conditions/delayed-milestones/"], ["ऑटिझम लक्षणे व तपासणी", "/conditions/autism-signs-assessment/"]] },
        { title: "मूल वारंवार आजारी पडते का?", desc: "वारंवार सर्दी-खोकला, ताप आणि रोगप्रतिकारक शक्ती.", links: [["वारंवार सर्दी व खोकला", "/conditions/frequent-colds-cough-children/"], ["मुलांमधील ताप", "/conditions/fever-children/"], ["वैयक्तिक सुवर्णप्राशन", "/treatments/customized-suvarnaprashan/"]] },
        { title: "झोप, आहार आणि दिनचर्येचा पाया", desc: "आरोग्य सुधारणाऱ्या दैनंदिन सवयी.", links: [["झोपेच्या तक्रारी", "/conditions/sleep-problems-children/"], ["अंथरूण ओले करणे", "/conditions/bedwetting-children/"], ["झोपेची योग्य दिनचर्या", "/articles/sleep-routine-children/"]] },
      ],
      faqEyebrow: "मदत केंद्र",
      faqH1: "नेहमी विचारले जाणारे प्रश्न (FAQ)",
      faqIntro: "अपॉइंटमेंट, ऑनलाइन सल्ला, सुवर्णप्राशन, सुरक्षितता, वेळ आणि भाषांविषयी प्रामाणिक उत्तरे.",
      faqCrumb: "नेहमीचे प्रश्न",
      faqGroups: [
        {
          h: "भेट आणि बुकिंग",
          faqs: [
            { q: "अपॉइंटमेंट कशी बुक करावी?", a: "संपर्क पानावरील फॉर्म भरा, +91 98607 75010 वर कॉल/WhatsApp करा किंवा ऑनलाइन स्लॉट निवडा. तुम्हाला निश्चित वेळ आणि तयारीची यादी दिली जाईल." },
            { q: "पहिल्या भेटीसाठी काय सोबत आणावे?", a: "पूर्वीचे रिपोर्ट्स, सुरू असलेल्या औषधांची यादी, लसीकरण कार्ड, वजन-उंचीची नोंद आणि 3 दिवसांच्या जेवण-झोपेची टिपण्णी सोबत ठेवा." },
            { q: "कोणत्या भाषांमध्ये सल्ला दिला जातो?", a: "डॉ. प्रियांका लिखार मराठी, हिंदी, इंग्रजी आणि गुजराती — या चारही भाषांमध्ये सहज संवाद साधून सल्ला देतात." },
          ],
        },
        {
          h: "ऑनलाइन सल्लामसलत",
          faqs: [
            { q: "ऑनलाइन सल्ला कसा घेतला जातो?", a: "45-मिनिटांच्या व्हिडिओ कॉलमध्ये मुलाचा संपूर्ण इतिहास, रिपोर्ट्स, फोटो आणि वाढीचा आलेख पाहून लेखी औषधोपचार व घरगुती आहार तक्ता WhatsApp/ईमेलवर दिला जातो." },
            { q: "प्रत्यक्ष भेट केव्हा आवश्यक असते?", a: "अभ्यंग/पंचकर्म उपचार, लहान बाळाची प्रत्यक्ष तपासणी आणि कोणत्याही आपत्कालीन परिस्थितीत प्रत्यक्ष डॉक्टरांकडे नेणे आवश्यक असते." },
          ],
        },
        {
          h: "पात्रता, सुरक्षितता व मर्यादा",
          faqs: [
            { q: "डॉ. प्रियांका लिखार यांची शैक्षणिक पात्रता आणि नोंदणी क्रमांक काय आहे?", a: "डॉ. प्रियांका लिखार यांचा वैद्यकीय नोंदणी क्रमांक 63934 आहे. त्यांनी इन्स्टिट्यूट ऑफ टीचिंग अँड रिसर्च इन आयुर्वेद (ITRA) मधून बालरोग विषयात MD (कौमारभृत्य) पदव्युत्तर शिक्षण आणि डॉ. वंदनाताई जे. ढोणे ग्रामीण आयुर्वेद कॉलेज, पातूर येथून BAMS पूर्ण केले आहे." },
            { q: "मुलांसाठी आयुर्वेदिक औषधे सुरक्षित असतात का?", a: "तज्ज्ञ MD कौमारभृत्य डॉक्टरांनी वय व वजनानुसार दिलेल्या प्रमाणित औषधांचा वापर सुरक्षित व सौम्य असतो. सुरू असलेली अ‍ॅलोपॅथिक औषधे अचानक स्वतःहून बंद करू नका." },
            { q: "तुम्ही आपत्कालीन (Emergency) उपचार करता का?", a: "नाही — श्वास घेण्यास त्रास, फिट्स, तीव्र निर्जलीकरण, दुखापत किंवा लहान बाळाला तीव्र ताप आल्यास त्वरित जवळच्या रुग्णालयात जा." },
          ],
        },
      ],
    },
    templates: {
      medicallyReviewed: "वैद्यकीय समीक्षित",
      alsoSearched: "संबंधित विषय",
      overviewEyebrow: "थोडक्यात ओळख",
      whatIsTitle: "हा आजार / समस्या नेमकी काय आहे",
      symptomsEyebrow: "लक्षणे",
      signsTitle: "सामान्य चिन्हे आणि लक्षणे",
      byAgeEyebrow: "वयानुसार",
      ageTitle: "वयोगटानुसार महत्त्वाच्या बाबी",
      causesEyebrow: "कारणे",
      causesTitle: "कारणे आणि जोखमीचे घटक",
      assessEyebrow: "तपासणी",
      assessTitle: "तज्ज्ञांचा सल्ला केव्हा घ्यावा",
      diagnosisEyebrow: "निदान",
      diagnosisTitle: "निदान कसे केले जाते",
      treatmentEyebrow: "व्यवस्थापन",
      managementTitle: "पुराव्याधिष्ठित उपचार व व्यवस्थापन",
      homeEyebrow: "घरगुती काळजी",
      homeTitle: "घरगुती उपाय आणि पूरक काळजी",
      warningTitle: "धोक्याची चिन्हे — त्वरित वैद्यकीय मदत घ्या",
      ayurvedaEyebrow: "आयुर्वेदिक सह-उपचार",
      ayurvedaTitle: "आयुर्वेदाची भूमिका (आणि प्रामाणिक मर्यादा)",
      canSupport: "आयुर्वेद कशात मदत करू शकतो",
      honestLimits: "प्रामाणिक मर्यादा",
      faqEyebrow: "नेहमीचे प्रश्न",
      faqTitle: "वारंवार विचारले जाणारे प्रश्न",
      referencesTitle: "वैद्यकीय संदर्भ",
      relatedTitle: "संबंधित वाचन",
      relatedKindCondition: "आजार मार्गदर्शक",
      relatedKindTreatment: "उपचार मार्गदर्शक",
      relatedKindArticle: "आरोग्य लेख",
      condWhatsappPrefix: "नमस्ते डॉक्टर प्रियांका, मी आपला मार्गदर्शक वाचला आणि माझ्या मुलासाठी मार्गदर्शन हवे आहे — विषय:",
      serviceLabel: "सेवा",
      treatmentLabel: "उपचार",
      partLabel: "भाग",
      suitsTitle: "कोणासाठी उपयुक्त",
      avoidTitle: "केव्हा टाळावे / आधी डॉक्टरांना विचारावे",
      askAtConsult: "सल्ल्यादरम्यान विचारा — प्रत्येक मुलाच्या प्रकृतीनुसार योग्यता ठरवली जाते.",
      safetyEyebrow: "सुरक्षितता",
      risksTitle: "काळजी, सुरक्षितता व दक्षता",
      processEyebrow: "प्रक्रिया",
      processTitle: "सल्ला व उपचार पद्धती",
      consideringPrefix: "याचा विचार करत आहात का:",
      consideringBody: "प्रथम सखोल तपासणीने सुरुवात करा — योग्यता, कालावधी आणि प्रक्रियेची स्पष्ट माहिती घ्या.",
      treatWhatsappPrefix: "नमस्ते डॉक्टर प्रियांका, मला या उपचाराबद्दल माहिती हवी आहे:",
      takeawaysTitle: "महत्त्वाचे मुद्दे",
      artCtaTitle: "तुमच्या मुलामध्येही हीच तक्रार जाणवते का?",
      artWhatsappPrefix: "नमस्ते डॉक्टर प्रियांका, मी आपला लेख वाचला आणि सल्ला हवा आहे:",
      indoreEyebrow: "इंदूर • मध्य प्रदेश",
      whyChooseTitle: "पालक या क्लिनिकची निवड का करतात",
      areasServedTitle: "सेवा क्षेत्रे",
      visitInfoTitle: "क्लिनिक भेट व सल्ला माहिती",
      localFaqTitle: "स्थानिक पालकांचे प्रश्न",
      continueExploring: "पुढे वाचा",
    },
    staticPages: {
      about: {
        seoTitle: "डॉ. प्रियांका लिखार यांचा परिचय (MD बालरोग ITRA, BAMS, नोंदणी 63934) | इंदूर",
        seoDesc: "डॉ. प्रियांका लिखार (नोंदणी क्र. 63934) यांची शैक्षणिक पात्रता: इन्स्टिट्यूट ऑफ टीचिंग अँड रिसर्च इन आयुर्वेद (ITRA) मधून MD बालरोग व डॉ. वंदनाताई जे. ढोणे ग्रामीण आयुर्वेद कॉलेज, पातूर येथून BAMS.",
        eyebrow: "प्रमाणित वैद्यकीय परिचय",
        h1: "डॉ. प्रियांका लिखार यांच्याबद्दल",
        intro: "डॉ. प्रियांका लिखार (नोंदणी क्रमांक: 63934) या आयुर्वेदिक बालरोगतज्ज्ञ (MD — कौमारभृत्य / बालरोग) असून बालचिकित्सा आयुर्वेद क्लिनिक, इंदूर येथे प्रत्यक्ष आणि देश-विदेशातील पालकांना ऑनलाइन सल्ला देतात.",
        crumb: "डॉक्टर परिचय",
        regBadgeLabel: "वैद्यकीय नोंदणी क्रमांक: 63934",
        qualsList: [
          "पदव्युत्तर शिक्षण (MD — बालरोगतज्ज्ञ / कौमारभृत्य): इन्स्टिट्यूट ऑफ टीचिंग अँड रिसर्च इन आयुर्वेद (ITRA)",
          "पदवी शिक्षण (BAMS): डॉ. वंदनाताई जे. ढोणे ग्रामीण आयुर्वेद कॉलेज, पातूर",
          "वैद्यकीय नोंदणी क्रमांक (Registration No.): 63934",
          "विशेष कार्यक्षेत्र: मुलांचे त्वचाविकार, वाणी व लक्ष विकास, भूक व वाढ, पचन, वारंवार सर्दी-खोकला, झोप आणि सुवर्णप्राशन",
          "सल्ला भाषा: मराठी • हिंदी • इंग्रजी • गुजराती",
        ],
        scopeHeading: "वैद्यकीय कार्यपद्धती आणि नैतिक दृष्टिकोन",
        scopeItems: [
          "• 45-मिनिटांची सखोल पहिली तपासणी: जन्म व वाढीचा इतिहास, प्रकृती–अग्नी–ओजस परीक्षण, आहार, झोप आणि दिनचर्येनुसार लेखी उपचार योजना.",
          "• स्टिरॉइड-सजग व प्रतिजैविक-जागरूक उपचार पद्धती; तुमच्या बालरोगतज्ज्ञांशी समन्वय ठेवून पूरक काळजी.",
          "• सुरक्षिततेची स्पष्ट चौकट: आपत्कालीन स्थिती, लसीकरण आणि रुग्णालयीन उपचार बालरोगतज्ज्ञांच्या देखरेखीखालीच राहतात.",
          "• पूर्ण पारदर्शकता: मुलाच्या वय व वजनानुसार सुरक्षित मात्रा, घरच्या जेवणावर आधारित आहार तक्ता आणि वास्तववादी कालावधी.",
        ],
      },
      contact: {
        seoTitle: "संपर्क आणि अपॉइंटमेंट बुक करा | बालचिकित्सा आयुर्वेद क्लिनिक इंदूर",
        seoDesc: "डॉ. प्रियांका लिखार (नोंदणी क्र. 63934) यांच्याशी क्लिनिक किंवा ऑनलाइन अपॉइंटमेंट बुक करा: +91 98607 75010.",
        eyebrow: "अपॉइंटमेंट",
        h1: "संपर्क साधा व अपॉइंटमेंट बुक करा",
        intro: "कॉल करा, WhatsApp करा किंवा खालील चौकशी फॉर्म भरा — आमची क्लिनिक टीम लवकरच तुमची वेळ निश्चित करेल.",
        crumb: "संपर्क",
        callTitle: "क्लिनिकला कॉल करा",
        waTitle: "WhatsApp चौकशी",
        waSub: "वेळ निश्चित करण्याचा सर्वात जलद मार्ग",
        dirTitle: "क्लिनिकचा नकाशा पहा",
        emailTitle: "ईमेल",
        formHeading: "सल्ला बुकिंग / चौकशी फॉर्म",
        formSub: "क्लिनिक नोंदीत सुरक्षितपणे जतन केले जाते — फक्त थोडक्यात माहिती लिहा; संपूर्ण रिपोर्ट्स भेटीवेळी दाखवा.",
        thankYou: "धन्यवाद! तुमची चौकशी जतन झाली आहे",
        nameLabel: "पालकांचे नाव *",
        namePh: "उदा. प्रिया शर्मा",
        nameErr: "कृपया पालकांचे नाव लिहा.",
        phoneLabel: "मोबाइल क्रमांक (कॉल / WhatsApp) *",
        phonePh: "+91 98765 43210",
        phoneErr: "कृपया वैध 10-अंकी मोबाइल क्रमांक टाका.",
        childNameLabel: "मुलाचे नाव *",
        childNamePh: "उदा. आरव",
        childAgeLabel: "मुलाचे वय *",
        childAgePh: "उदा. 4 वर्षे",
        modeLabel: "सल्ल्याचा पसंतीचा प्रकार",
        modes: ["प्रत्यक्ष क्लिनिक भेट (इंदूर)", "ऑनलाइन व्हिडिओ सल्ला", "योग्य पर्यायासाठी मार्गदर्शन हवे"],
        concernLabel: "मुख्य तक्रार थोडक्यात *",
        concernPh: "उदा. गेली 6 महिने वारंवार सर्दी-खोकला, कमी भूक, वजन न वाढणे…",
        concernErr: "कृपया मुलाची तक्रार थोडक्यात लिहा.",
        submitBtn: "अपॉइंटमेंट विनंती पाठवा",
        submittingBtn: "पाठवत आहे…",
        openWaBtn: "WhatsApp वरही संदेश पाठवा",
      },
      privacy: {
        seoTitle: "गोपनीयता धोरण | बालचिकित्सा आयुर्वेद क्लिनिक",
        seoDesc: "बालचिकित्सा आयुर्वेद क्लिनिकचे गोपनीयता धोरण: पालक व मुलांच्या माहितीची सुरक्षितता.",
        eyebrow: "कायदेशीर माहिती",
        h1: "गोपनीयता धोरण (Privacy Policy)",
        intro: "बालचिकित्सा आयुर्वेद क्लिनिक पालक आणि मुलांच्या चौकशी माहितीची सुरक्षितता कशी राखते.",
        crumb: "गोपनीयता धोरण",
        items: [
          { strong: "आम्ही कोणती माहिती घेतो:", body: "तुम्ही स्वतःहून दिलेली मूलभूत संपर्क व सल्ला माहिती (पालकांचे नाव, फोन/WhatsApp, ऐच्छिक ईमेल, मुलाचे नाव, वय, सल्ल्याचा प्रकार आणि संक्षिप्त तक्रार)." },
          { strong: "माहितीचा वापर:", body: "फक्त तुमच्या चौकशीला उत्तर देण्यासाठी, अपॉइंटमेंट ठरवण्यासाठी आणि मुलाच्या उपचारांच्या तयारीसाठी. माहितीची विक्री किंवा जाहिरात वापर कधीही केला जात नाही." },
          { strong: "साठवणूक व गोपनीयता:", body: "सर्व माहिती वैद्यकीय गोपनीयतेच्या नियमांनुसार सुरक्षित ठेवली जाते. फॉर्ममध्ये सरकारी ओळखपत्रे पाठवू नका." },
          { strong: "मुलांची गोपनीयता:", body: "लहान मुलांविषयीची माहिती फक्त पालकांनी किंवा कायदेशीर पालकांनीच उपचारासाठी भरावी." },
          { strong: "तुमचे हक्क व संपर्क:", body: "तुमच्या माहितीची पाहणी, दुरुस्ती किंवा हटवण्याची विनंती करण्यासाठी थेट क्लिनिकशी संपर्क साधा:" },
          { strong: "कुकीज व ट्रॅकर्स:", body: "ही वेबसाइट केवळ तुमची निवडलेली भाषा आणि चलन पसंती लक्षात ठेवते — कोणतेही जाहिरात ट्रॅकर्स वापरले जात नाहीत." },
        ],
      },
      terms: {
        seoTitle: "वापराच्या अटी | बालचिकित्सा आयुर्वेद क्लिनिक",
        seoDesc: "बालचिकित्सा आयुर्वेद क्लिनिक वेबसाइट वापरण्याच्या अटी व वैद्यकीय मर्यादा.",
        eyebrow: "कायदेशीर माहिती",
        h1: "वापराच्या अटी (Terms of Use)",
        intro: "ही वेबसाइट नेमकी कोणती सेवा देते (आरोग्य प्रबोधन व अपॉइंटमेंट विनंती) आणि तिच्या मर्यादा काय आहेत ते कृपया वाचा.",
        crumb: "वापराच्या अटी",
        items: [
          { strong: "केवळ शैक्षणिक उद्देश:", body: "वेबसाइटवरील लेख व मार्गदर्शक माहितीसाठी आहेत; ते प्रत्यक्ष तपासणी किंवा वैद्यकीय निदानाची जागा घेत नाहीत." },
          { strong: "आपत्कालीन सेवा नाही:", body: "ही वेबसाइट आपत्कालीन वैद्यकीय सेवेसाठी नाही. कोणतीही गंभीर लक्षणे दिसल्यास त्वरित जवळच्या रुग्णालयात संपर्क साधा." },
          { strong: "अपॉइंटमेंट निश्चिती:", body: "सल्ल्याची वेळ, प्रकार आणि शुल्क क्लिनिककडून बुकिंगच्या वेळी निश्चित केले जाते." },
          { strong: "परिणामांची पारदर्शकता:", body: "प्रत्येक मुलामध्ये सुधारणा होण्याचा कालावधी वेगळा असू शकतो; कोणतीही अवास्तव हमी दिली जात नाही." },
          { strong: "मजकुराचा वापर:", body: "तुम्ही पानांच्या लिंक्स शेअर करू शकता; परवानगीशिवाय वैद्यकीय लेख कॉपी करू नयेत." },
        ],
      },
      sitemap: {
        seoTitle: "साइटमॅप — सर्व पाने | बालचिकित्सा आयुर्वेद क्लिनिक",
        seoDesc: "सर्व 22 बाल आजार मार्गदर्शक, उपचार, आरोग्य लेख आणि क्लिनिक पानांची संपूर्ण यादी.",
        pagesCountSuffix: "सार्वजनिक पाने",
        h1: "संपूर्ण वेबसाइट सूची (साइटमॅप)",
        intro: "बालचिकित्सा आयुर्वेद क्लिनिकवरील सर्व पाने — मराठी, हिंदी, गुजराती आणि इंग्रजीमध्ये उपलब्ध.",
        crumb: "साइटमॅप",
        mainHeading: "मुख्य पाने",
        mainLinks: [
          { label: "मुख्यपृष्ठ", href: "/" },
          { label: "डॉ. प्रियांका लिखार यांच्याबद्दल", href: "/about-doctor/" },
          { label: "बाल आरोग्य केंद्र", href: "/child-health/" },
          { label: "नेहमी विचारले जाणारे प्रश्न", href: "/faq/" },
          { label: "संपर्क व अपॉइंटमेंट", href: "/contact/" },
        ],
        condHeading: "बाल आरोग्य समस्या लायब्ररी (22)",
        treatHeading: "उपचार व सल्ला सेवा (12)",
        artHeading: "पालकांसाठी आरोग्य लेख (23)",
        localHeading: "इंदूर व मध्य प्रदेश स्थानिक पाने (7)",
        legalHeading: "कायदेशीर धोरणे",
      },
      notFound: {
        seoTitle: "पान सापडले नाही | बालचिकित्सा आयुर्वेद क्लिनिक",
        h1: "तुम्ही शोधत असलेले पान सापडले नाही",
        desc: " कदाचित लिंक बदलली असावी. खालील पर्यायांतून मुख्यपृष्ठ किंवा आजार मार्गदर्शिका पहा.",
        homeBtn: "मुख्यपृष्ठावर जा",
        condBtn: "22 समस्या पहा",
        contactBtn: "क्लिनिक संपर्क",
      },
    },
  },

  gu: {
    header: {
      homeAria: "મુખ્ય પૃષ્ઠ",
      indoreTag: "ઇન્દોર",
      home: "મુખ્ય પૃષ્ઠ",
      doctor: "ડૉક્ટર પરિચય",
      conditions: "રોગ માર્ગદર્શિકા",
      treatments: "સારવાર અને સેવાઓ",
      articles: "આરોગ્ય લેખો",
      faq: "સામાન્ય પ્રશ્નો",
      contact: "સંપર્ક",
      callShort: "કૉલ",
      callPrefix: "કૉલ કરો",
      bookVisit: "મુલાકાત બુક કરો",
      bookChildVisit: "તમારા બાળકની મુલાકાત બુક કરો",
      openMenu: "મેનુ ખોલો",
      closeMenu: "મેનુ બંધ કરો",
      mobileLinks: [
        { href: "/", label: "મુખ્ય પૃષ્ઠ" },
        { href: "/about-doctor/", label: "ડૉ. પ્રિયંકા લિખાર વિશે" },
        { href: "/child-health/", label: "બાળ આરોગ્ય કેન્દ્ર" },
        { href: "/conditions/", label: "બાળ રોગ લાઇબ્રેરી (22)" },
        { href: "/treatments/", label: "આયુર્વેદિક સારવાર અને સેવાઓ" },
        { href: "/articles/", label: "માતા-પિતા માટે આરોગ્ય લેખો" },
        { href: "/faq/", label: "વારંવાર પૂછાતા પ્રશ્નો" },
        { href: "/contact/", label: "સંપર્ક અને એપોઇન્ટમેન્ટ" },
      ],
    },
    footer: {
      bio: "બાળચિકિત્સા આયુર્વેદ ક્લિનિક — ઇન્દોર અને વિશ્વભરમાં ઓનલાઇન સમર્પિત આયુર્વેદિક બાળ આરોગ્ય સંભાળ.",
      regBadge: "નોંધણી નં. 63934 • MD બાળરોગ નિષ્ણાત (ITRA) • BAMS (ડૉ. વંદનાતાઈ જે. ઢોણે ગ્રામીણ આયુર્વેદ કૉલેજ, પાતૂર)",
      conditionsTitle: "મુખ્ય સમસ્યાઓ",
      allConditions: "તમામ 22 સમસ્યાઓ જુઓ →",
      treatmentsTitle: "સારવાર અને સેવાઓ",
      consultationLink: "આયુર્વેદિક પરામર્શ",
      articlesLink: "આરોગ્ય લેખો",
      faqLink: "સામાન્ય પ્રશ્નો",
      sitemapLink: "સાઇટમેપ",
      reachTitle: "ક્લિનિક સંપર્ક",
      bookBtn: "એપોઇન્ટમેન્ટ બુક કરો",
      rights: "સર્વ હક્કો સુરક્ષિત.",
      privacy: "ગોપનીયતા નીતિ",
      terms: "ઉપયોગની શરતો",
      aboutDoctor: "ડૉક્ટરની લાયકાત",
      madeWith: "પ્રેમથી નિર્મિત",
      forKids: "સ્વસ્થ અને ખીલતા બાળપણ માટે",
      disclaimer: "ફક્ત શૈક્ષણિક માહિતી — કટોકટીની તબીબી સલાહનો વિકલ્પ નથી. આયુર્વેદિક સંભાળ બાળરોગ નિષ્ણાત સાથે સંકલનમાં આપવામાં આવે છે. પરિણામો દરેક બાળકની પ્રકૃતિ અને નિયમિતતા પર આધાર રાખે છે.",
    },
    seoBlocks: {
      reviewerRole: "લેખિકા અને તબીબી સમીક્ષક",
      regLabel: "નોંધણી નં. 63934",
      pgLine: "MD — બાળરોગ નિષ્ણાત (કૌમારભૃત્ય), ઇન્સ્ટિટ્યૂટ ઑફ ટીચિંગ એન્ડ રિસર્ચ ઇન આયુર્વેદ (ITRA)",
      ugLine: "BAMS — ડૉ. વંદનાતાઈ જે. ઢોણે ગ્રામીણ આયુર્વેદ કૉલેજ, પાતૂર",
      reviewedOn: "તબીબી રીતે સમીક્ષિત",
      authorNote: "આ માહિતી માત્ર આરોગ્ય જાગૃતિ માટે છે — વ્યક્તિગત પરામર્શ, નિદાન કે કટોકટી સારવારનો વિકલ્પ નથી.",
      disclaimerStrong: "તબીબી અસ્વીકરણ:",
      disclaimerBody: "આ પૃષ્ઠ સામાન્ય આરોગ્ય શિક્ષણ પૂરું પાડે છે અને વ્યાવસાયિક તબીબી સલાહ, નિદાન અથવા સારવારનું સ્થાન લેતું નથી. અહીં આયુર્વેદિક સંભાળ બાળ ચિકિત્સાના પૂરક અને સંકલનમાં હોય છે — તમારા ડૉક્ટરની સલાહ વિના ચાલુ દવાઓ કે થેરાપી ક્યારેય બંધ કરશો નહીં. શ્વાસની તકલીફ, ખેંચ, નિર્જલીકરણ કે ઈજા જેવી કટોકટીમાં તરત હોસ્પિટલ જાઓ.",
      ctaTitle: "તમારા બાળક માટે ક્યાંથી શરૂ કરવું તે મૂંઝવણ છે?",
      ctaBody: "એકવાર ચિંતા જણાવો — ડૉ. પ્રિયંકા લિખાર પાસેથી સ્પષ્ટ અને પ્રામાણિક માર્ગદર્શન મેળવો કે આયુર્વેદ કેવી રીતે મદદ કરી શકે.",
      ctaBook: "એપોઇન્ટમેન્ટ બુક કરો",
      ctaWhatsapp: "WhatsApp પૂછપરછ",
      ctaWhatsappMsg: "નમસ્તે ડૉક્ટર પ્રિયંકા, મારે મારા બાળકના આરોગ્ય અંગે માર્ગદર્શન જોઈએ છે.",
      ctaLocationLine: "સંચાર નગર એક્સટેન્શન, કનાડિયા રોડ, ઇન્દોર • સોમ–શનિ 10–2 અને 5–8 IST • ભારત અને વિદેશમાં ઓનલાઇન પરામર્શ",
    },
    homeHubs: {
      exploreEyebrow: "જરૂરિયાત મુજબ શોધો",
      exploreTitle: "તમારા બાળકની સમસ્યાથી શરૂઆત કરો",
      exploreDesc: "નીચેનો દરેક વિષય સંપૂર્ણ માર્ગદર્શિકા છે — લક્ષણો, તપાસ, ઘરગથ્થુ સંભાળ, ચેતવણી ચિહ્નો અને આયુર્વેદિક સહ-સંભાળ.",
      readGuide: "સંપૂર્ણ ગાઇડ વાંચો",
      cards: [
        { to: "/conditions/", t: "તમામ 22 બાળ સમસ્યાઓ", d: "ચેતવણી ચિહ્નો સાથે A–Z લાઇબ્રેરી" },
        { to: "/treatments/customized-suvarnaprashan/", t: "સુવર્ણપ્રાશન", d: "વ્યક્તિગત ડ્રોપ્સની સાચી સમજ" },
        { to: "/articles/", t: "માતા-પિતા માટે લેખો", d: "ઊંઘ, સ્ક્રીન, આયર્ન અને પોષણ" },
        { to: "/ayurvedic-doctor-indore/", t: "ઇન્દોર ક્લિનિક મુલાકાત", d: "સરનામું, સમય અને બુકિંગ" },
      ],
      treatEyebrow: "સારવાર અને સેવાઓ",
      treatTitle: "ક્લિનિકમાં ઉપલબ્ધ સેવાઓ",
      learnMore: "વધુ જાણો",
      allTreatments: "તમામ {count} સારવાર અને સેવાઓ જુઓ →",
      artEyebrow: "વાલી આરોગ્ય શિક્ષણ",
      artTitle: "નવીનતમ આરોગ્ય લેખો",
      minRead: "મિનિટ",
      browseArticles: "તમામ {count} આરોગ્ય લેખો વાંચો →",
    },
    categories: {
      "Development & Behaviour": "વિકાસ અને વર્તન",
      Neurological: "ચેતાતંત્ર સંબંધિત (ન્યુરોલોજીકલ)",
      "Growth & Nutrition": "શારીરિક વૃદ્ધિ અને પોષણ",
      "Respiratory & Immunity": "શ્વસન અને રોગપ્રતિકારક શક્તિ",
      "Digestion & Gut": "પાચન અને આંતરડાનું આરોગ્ય",
      "Sleep & Habits": "ઊંઘ અને દૈનિક આદતો",
      Suvarnaprashan: "સુવર્ણપ્રાશન",
      Panchakarma: "પંચકર્મ",
      Consultation: "પરામર્શ",
      Therapies: "આયુર્વેદિક ઉપચાર",
      "Child Health": "બાળ આરોગ્ય",
      Immunity: "રોગપ્રતિકારક શક્તિ",
      Digestion: "પાચન",
      "Sleep & Routine": "ઊંઘ અને દિનચર્યા",
      Nutrition: "પોષણ",
      "General Ayurveda": "સામાન્ય આયુર્વેદ",
    },
    hubs: {
      homeCrumb: "મુખ્ય પૃષ્ઠ",
      conditionsEyebrow: "22 વાલી માર્ગદર્શિકાઓ",
      conditionsH1: "બાળ આરોગ્ય સમસ્યા લાઇબ્રેરી",
      conditionsIntro: "બાળપણની દરેક મહત્વપૂર્ણ સમસ્યા માટે સંપૂર્ણ માર્ગદર્શિકા: તે શું છે, ઉંમર પ્રમાણે લક્ષણો, ક્યારે તપાસ કરાવવી, ઘરગથ્થુ સંભાળ, ચેતવણી ચિહ્નો અને આયુર્વેદની ભૂમિકા.",
      conditionsCrumb: "રોગ માર્ગદર્શિકા",
      treatmentsEyebrow: "સેવાઓ અને ઉપચાર",
      treatmentsH1: "આયુર્વેદિક સારવાર અને સેવાઓ",
      treatmentsIntro: "દરેક સારવાર પૃષ્ઠ સ્પષ્ટપણે જણાવે છે કે તે શું છે, કોના માટે યોગ્ય છે, સાવચેતીઓ અને પરામર્શની પ્રક્રિયા.",
      treatmentsCrumb: "સારવાર અને સેવાઓ",
      treatGroups: [
        { title: "વ્યક્તિગત સુવર્ણપ્રાશન વિભાગ", desc: "મુખ્ય માર્ગદર્શિકા સાથે સુરક્ષા, યોગ્ય ઉંમર, ઘટકો અને શાસ્ત્રીય માહિતી." },
        { title: "પંચકર્મ અને શાસ્ત્રીય ઉપચાર", desc: "બાળકની પ્રકૃતિ મુજબ સૌમ્ય અને મૂલ્યાંકન-આધારિત ઉપચાર." },
        { title: "પરામર્શ સેવાઓ", desc: "ઇન્દોર ક્લિનિક અને વિશ્વભરમાં 45-મિનિટનો ઊંડો ઓનલાઇન વિડિયો પરામર્શ." },
      ],
      articlesEyebrow: "આરોગ્ય શિક્ષણ લાઇબ્રેરી",
      articlesH1: "માતા-પિતા અને પરિવાર માટે આરોગ્ય લેખો",
      articlesIntro: "ડૉ. પ્રિયંકા લિખાર દ્વારા લખાયેલા અને સમીક્ષિત વ્યવહારુ, પુરાવા-સભાન આરોગ્ય લેખો.",
      articlesCrumb: "આરોગ્ય લેખો",
      articlesCtaTitle: "તમારા બાળકના આરોગ્ય વિશે કોઈ પ્રશ્ન છે?",
      articlesCtaBody: "ક્લિનિકને પૂછપરછ મોકલો — અમે વ્યક્તિગત રીતે સમીક્ષા કરીને સાચું માર્ગદર્શન આપીએ છીએ.",
      childHealthEyebrow: "અહીંથી શરૂ કરો",
      childHealthH1: "બાળ આરોગ્ય કેન્દ્ર (Child Health Hub)",
      childHealthIntro: "તમારી ચિંતાને અનુરૂપ વિભાગ પસંદ કરો — દરેક માર્ગ ગુજરાતી, હિન્દી, મરાઠી અને અંગ્રેજીમાં વિગતવાર ગાઇડ તરફ લઈ જાય છે.",
      childHealthCrumb: "બાળ આરોગ્ય",
      childHealthPaths: [
        { title: "વજન, ઊંચાઈ કે ભૂખ ઓછી છે?", desc: "વૃદ્ધિ, એનિમિયા અને ખોરાકમાં નખરાં.", links: [["ઓછી ભૂખ", "/conditions/poor-appetite-children/"], ["વૃદ્ધિ અને પોષણ", "/conditions/growth-nutrition-concerns/"], ["બાળકોમાં કબજિયાત", "/conditions/constipation-children/"]] },
        { title: "બોલવામાં વિલંબ, ધ્યાન કે વિકાસની ચિંતા?", desc: "શાંત અને તબક્કાવાર વિકાસાત્મક માર્ગદર્શન.", links: [["વાણી વિલંબ (Speech Delay)", "/conditions/speech-delay-in-children/"], ["બાળકોમાં ADHD", "/conditions/adhd-in-children/"], ["વિકાસના તબક્કામાં વિલંબ", "/conditions/delayed-milestones/"], ["ઓટિઝમ લક્ષણો અને મૂલ્યાંકન", "/conditions/autism-signs-assessment/"]] },
        { title: "બાળક વારંવાર બીમાર પડે છે?", desc: "વારંવાર શરદી-ઉધરસ, તાવ અને રોગપ્રતિકારક શક્તિ.", links: [["વારંવાર શરદી અને ઉધરસ", "/conditions/frequent-colds-cough-children/"], ["બાળકોમાં તાવ", "/conditions/fever-children/"], ["વ્યક્તિગત સુવર્ણપ્રાશન", "/treatments/customized-suvarnaprashan/"]] },
        { title: "ઊંઘ, ખોરાક અને દિનચર્યાનો પાયો", desc: "આરોગ્ય બદલી નાખતી રોજિંદી આદતો.", links: [["ઊંઘની સમસ્યાઓ", "/conditions/sleep-problems-children/"], ["પથારી ભીની કરવી", "/conditions/bedwetting-children/"], ["બાળકોની ઊંઘ દિનચર્યા", "/articles/sleep-routine-children/"]] },
      ],
      faqEyebrow: "સહાય કેન્દ્ર",
      faqH1: "વારંવાર પૂછાતા પ્રશ્નો (FAQ)",
      faqIntro: "એપોઇન્ટમેન્ટ, ઓનલાઇન પરામર્શ, સુવર્ણપ્રાશન, બાળકોની સુરક્ષા, સમય અને ભાષાઓ અંગે સ્પષ્ટ જવાબો.",
      faqCrumb: "સામાન્ય પ્રશ્નો",
      faqGroups: [
        {
          h: "મુલાકાત અને બુકિંગ",
          faqs: [
            { q: "એપોઇન્ટમેન્ટ કેવી રીતે બુક કરવી?", a: "સંપર્ક પૃષ્ઠ પરનું ફોર્મ ભરો, +91 98607 75010 પર કૉલ/WhatsApp કરો અથવા ઓનલાઇન સ્લોટ પસંદ કરો. તમને નિશ્ચિત સમય અને તૈયારીની યાદી મળશે." },
            { q: "પ્રથમ મુલાકાત વખતે શું સાથે રાખવું?", a: "અગાઉના રિપોર્ટ્સ, ચાલુ દવાઓની યાદી, રસીકરણ કાર્ડ, વજન/ઊંચાઈનો રેકોર્ડ અને 3 દિવસના ભોજન-ઊંઘની નોંધ સાથે રાખો." },
            { q: "કઈ ભાષાઓમાં પરામર્શ આપવામાં આવે છે?", a: "ડૉ. પ્રિયંકા લિખાર ગુજરાતી, હિન્દી, મરાઠી અને અંગ્રેજી — ચારેય ભાષાઓમાં સરળતાથી પરામર્શ આપે છે." },
          ],
        },
        {
          h: "ઓનલાઇન પરામર્શ",
          faqs: [
            { q: "ઓનલાઇન પરામર્શ કેવી રીતે થાય છે?", a: "45-મિનિટના વિડિયો કૉલમાં બાળકનો સંપૂર્ણ ઇતિહાસ, રિપોર્ટ્સ, ફોટા અને ગ્રોથ ચાર્ટ જોઈને લેખિત પ્રિસ્ક્રિપ્શન અને ઘરગથ્થુ આહાર ચાર્ટ WhatsApp/ઈમેલ પર મોકલવામાં આવે છે." },
            { q: "રૂબરૂ તપાસ ક્યારે જરૂરી બને છે?", a: "અભ્યંગ/પંચકર્મ જેવી પ્રક્રિયાઓ, નવજાત શિશુની શારીરિક તપાસ અને કોઈપણ કટોકટીમાં રૂબરૂ તબીબી સંભાળ જરૂરી છે." },
          ],
        },
        {
          h: "લાયકાત, સુરક્ષા અને મર્યાદા",
          faqs: [
            { q: "ડૉ. પ્રિયંકા લિખારની શૈક્ષણિક લાયકાત અને નોંધણી નંબર શું છે?", a: "ડૉ. પ્રિયંકા લિખારનો તબીબી નોંધણી નંબર (Registration No.) 63934 છે. તેમણે ઇન્સ્ટિટ્યૂટ ઑફ ટીચિંગ એન્ડ રિસર્ચ ઇન આયુર્વેદ (ITRA) માંથી બાળરોગ નિષ્ણાત MD (કૌમારભૃત્ય) અનુસ્નાતક અભ્યાસ અને ડૉ. વંદનાતાઈ જે. ઢોણે ગ્રામીણ આયુર્વેદ કૉલેજ, પાતૂરમાંથી BAMS પૂર્ણ કર્યું છે." },
            { q: "શું બાળકો માટે આયુર્વેદિક દવાઓ સુરક્ષિત છે?", a: "નિષ્ણાત MD કૌમારભૃત્ય ડૉક્ટર દ્વારા બાળકની ઉંમર અને વજન મુજબ આપવામાં આવતી પ્રમાણિત ઔષધિઓ સુરક્ષિત અને સૌમ્ય હોય છે. ચાલુ એલોપેથિક દવા ક્યારેય અચાનક જાતે બંધ કરશો નહીં." },
            { q: "શું તમે કટોકટી (Emergency) સારવાર કરો છો?", a: "ના — શ્વાસની તકલીફ, ખેંચ, ગંભીર નિર્જલીકરણ, ઈજા કે નાના બાળકમાં તેજ તાવ હોય ત્યારે તરત નજીકની હોસ્પિટલમાં જાઓ." },
          ],
        },
      ],
    },
    templates: {
      medicallyReviewed: "તબીબી સમીક્ષિત",
      alsoSearched: "સંબંધિત વિષયો",
      overviewEyebrow: "પરિચય",
      whatIsTitle: "આ સમસ્યા શું છે",
      symptomsEyebrow: "લક્ષણો",
      signsTitle: "સામાન્ય ચિહ્નો અને લક્ષણો",
      byAgeEyebrow: "ઉંમર મુજબ",
      ageTitle: "ઉંમર પ્રમાણે ખાસ બાબતો",
      causesEyebrow: "કારણો",
      causesTitle: "કારણો અને જોખમી પરિબળો",
      assessEyebrow: "મૂલ્યાંકન",
      assessTitle: "તપાસ અને પરામર્શ ક્યારે જરૂરી છે",
      diagnosisEyebrow: "નિદાન",
      diagnosisTitle: "નિદાન કેવી રીતે થાય છે",
      treatmentEyebrow: "સંભાળ",
      managementTitle: "પુરાવા-આધારિત સંભાળ અને વ્યવસ્થાપન",
      homeEyebrow: "ઘરગથ્થુ સંભાળ",
      homeTitle: "ઘરગથ્થુ ઉપાયો અને સહાયક દિનચર્યા",
      warningTitle: "ચેતવણી ચિહ્નો — તરત તબીબી સંભાળ લો",
      ayurvedaEyebrow: "આયુર્વેદિક સહ-સંભાળ",
      ayurvedaTitle: "આયુર્વેદની ભૂમિકા (અને પ્રામાણિક મર્યાદાઓ)",
      canSupport: "આયુર્વેદ શેમાં મદદ કરી શકે",
      honestLimits: "પ્રામાણિક મર્યાદાઓ",
      faqEyebrow: "સામાન્ય પ્રશ્નો",
      faqTitle: "વારંવાર પૂછાતા પ્રશ્નો",
      referencesTitle: "તબીબી સંદર્ભો",
      relatedTitle: "સંબંધિત વાંચન",
      relatedKindCondition: "સમસ્યા ગાઇડ",
      relatedKindTreatment: "સારવાર ગાઇડ",
      relatedKindArticle: "આરોગ્ય લેખ",
      condWhatsappPrefix: "નમસ્તે ડૉક્ટર પ્રિયંકા, મેં આપની ગાઇડ વાંચી અને મારા બાળક માટે માર્ગદર્શન જોઈએ છે — વિષય:",
      serviceLabel: "સેવા",
      treatmentLabel: "સારવાર",
      partLabel: "ભાગ",
      suitsTitle: "કોના માટે યોગ્ય છે",
      avoidTitle: "ક્યારે ટાળવું / પહેલાં ડૉક્ટરને પૂછવું",
      askAtConsult: "પરામર્શ દરમિયાન પૂછો — યોગ્યતા દરેક બાળકની પ્રકૃતિ મુજબ નક્કી થાય છે.",
      safetyEyebrow: "સુરક્ષા",
      risksTitle: "સાવચેતીઓ, સુરક્ષા અને નિષેધ",
      processEyebrow: "પ્રક્રિયા",
      processTitle: "પરામર્શ અને સારવાર પ્રક્રિયા",
      consideringPrefix: "આ અંગે વિચારી રહ્યા છો:",
      consideringBody: "પ્રથમ યોગ્ય મૂલ્યાંકનથી શરૂઆત કરો — યોગ્યતા, સમયગાળો અને પ્રક્રિયાની સ્પષ્ટ સમજ મેળવો.",
      treatWhatsappPrefix: "નમસ્તે ડૉક્ટર પ્રિયંકા, મારે આ સારવાર/સેવા વિશે જાણવું છે:",
      takeawaysTitle: "મુખ્ય મુદ્દાઓ",
      artCtaTitle: "શું તમારા બાળકમાં પણ આ સમસ્યા જણાય છે?",
      artWhatsappPrefix: "નમસ્તે ડૉક્ટર પ્રિયંકા, મેં આપનો લેખ વાંચ્યો અને માર્ગદર્શન જોઈએ છે:",
      indoreEyebrow: "ઇન્દોર • મધ્ય પ્રદેશ",
      whyChooseTitle: "પરિવારો આ ક્લિનિક કેમ પસંદ કરે છે",
      areasServedTitle: "સેવા વિસ્તારો",
      visitInfoTitle: "ક્લિનિક મુલાકાત અને પરામર્શ માહિતી",
      localFaqTitle: "સ્થાનિક વાલીઓના પ્રશ્નો",
      continueExploring: "વધુ જાણો",
    },
    staticPages: {
      about: {
        seoTitle: "ડૉ. પ્રિયંકા લિખાર વિશે (MD બાળરોગ ITRA, BAMS, નોંધણી 63934) | ઇન્દોર",
        seoDesc: "ડૉ. પ્રિયંકા લિખાર (નોંધણી નં. 63934) ની પ્રમાણિત લાયકાત: ઇન્સ્ટિટ્યૂટ ઑફ ટીચિંગ એન્ડ રિસર્ચ ઇન આયુર્વેદ (ITRA) માંથી MD બાળરોગ અને ડૉ. વંદનાતાઈ જે. ઢોણે ગ્રામીણ આયુર્વેદ કૉલેજ, પાતૂરમાંથી BAMS.",
        eyebrow: "પ્રમાણિત તબીબી પરિચય",
        h1: "ડૉ. પ્રિયંકા લિખાર વિશે",
        intro: "ડૉ. પ્રિયંકા લિખાર (નોંધણી નંબર: 63934) એક નિષ્ણાત આયુર્વેદિક બાળરોગ ચિકિત્સક (MD — કૌમારભૃત્ય / બાળરોગ) છે, જેઓ બાળચિકિત્સા આયુર્વેદ ક્લિનિક, ઇન્દોર ખાતે તેમજ દેશ-વિદેશના પરિવારોને ઓનલાઇન પરામર્શ આપે છે.",
        crumb: "ડૉક્ટર પરિચય",
        regBadgeLabel: "તબીબી નોંધણી નંબર: 63934",
        qualsList: [
          "અનુસ્નાતક (MD — બાળરોગ નિષ્ણાત / કૌમારભૃત્ય): ઇન્સ્ટિટ્યૂટ ઑફ ટીચિંગ એન્ડ રિસર્ચ ઇન આયુર્વેદ (ITRA)",
          "સ્નાતક (BAMS): ડૉ. વંદનાતાઈ જે. ઢોણે ગ્રામીણ આયુર્વેદ કૉલેજ, પાતૂર",
          "તબીબી નોંધણી નંબર (Registration No.): 63934",
          "મુખ્ય કાર્યક્ષેત્ર: બાળકોના ત્વચા રોગો, વાણી અને ધ્યાન વિકાસ, ભૂખ અને શારીરિક વૃદ્ધિ, પાચન, વારંવાર શરદી-ઉધરસ, ઊંઘ અને સુવર્ણપ્રાશન",
          "પરામર્શ ભાષાઓ: ગુજરાતી • હિન્દી • મરાઠી • અંગ્રેજી",
        ],
        scopeHeading: "તબીબી અભિગમ અને નૈતિક કાર્યક્ષેત્ર",
        scopeItems: [
          "• 45-મિનિટનો ઊંડો પ્રથમ પરામર્શ: જન્મ અને વિકાસ ઇતિહાસ, પ્રકૃતિ–અગ્નિ–ઓજસ મૂલ્યાંકન, આહાર, ઊંઘ અને દિનચર્યા આધારિત લેખિત યોજના.",
          "• સ્ટેરોઇડ-સભાન અને એન્ટિબાયોટિક-જાગૃત અભિગમ; તમારા બાળરોગ નિષ્ણાત સાથે સંકલનમાં પૂરક સંભાળ.",
          "• સુરક્ષાની સ્પષ્ટ મર્યાદા: કટોકટી, રસીકરણ અને હોસ્પિટલ સંભાળ આધુનિક બાળ ચિકિત્સા હેઠળ જ રહે છે.",
          "• સંપૂર્ણ પારદર્શિતા: બાળકની ઉંમર અને વજન મુજબ સુરક્ષિત માત્રા, ઘરના ખોરાક આધારિત ચાર્ટ અને પ્રામાણિક સમયરેખા.",
        ],
      },
      contact: {
        seoTitle: "સંપર્ક અને એપોઇન્ટમેન્ટ બુક કરો | બાળચિકિત્સા આયુર્વેદ ક્લિનિક ઇન્દોર",
        seoDesc: "ડૉ. પ્રિયંકા લિખાર (નોંધણી નં. 63934) સાથે ક્લિનિક કે ઓનલાઇન એપોઇન્ટમેન્ટ બુક કરો: +91 98607 75010.",
        eyebrow: "એપોઇન્ટમેન્ટ",
        h1: "સંપર્ક કરો અને એપોઇન્ટમેન્ટ બુક કરો",
        intro: "કૉલ કરો, WhatsApp કરો અથવા નીચેનું પૂછપરછ ફોર્મ ભરો — અમારી ક્લિનિક ટીમ ઝડપથી તમારો સ્લોટ કન્ફર્મ કરશે.",
        crumb: "સંપર્ક",
        callTitle: "ક્લિનિકમાં કૉલ કરો",
        waTitle: "WhatsApp પૂછપરછ",
        waSub: "સ્લોટ બુકિંગ માટે સૌથી ઝડપી",
        dirTitle: "ક્લિનિકનો નકશો જુઓ",
        emailTitle: "ઈમેલ",
        formHeading: "પરામર્શ બુકિંગ / પૂછપરછ ફોર્મ",
        formSub: "ક્લિનિક રેકોર્ડમાં સુરક્ષિત રીતે સાચવવામાં આવે છે — માત્ર સંક્ષિપ્ત વિગતો લખો; સંપૂર્ણ રિપોર્ટ્સ મુલાકાત સમયે બતાવો.",
        thankYou: "આભાર! તમારી પૂછપરછ નોંધાઈ ગઈ છે",
        nameLabel: "માતા/પિતાનું નામ *",
        namePh: "દા.ત. પ્રિયા શર્મા",
        nameErr: "કૃપા કરીને માતા/પિતાનું નામ લખો.",
        phoneLabel: "મોબાઇલ નંબર (કૉલ / WhatsApp) *",
        phonePh: "+91 98765 43210",
        phoneErr: "કૃપા કરીને માન્ય 10-અંકનો મોબાઇલ નંબર લખો.",
        childNameLabel: "બાળકનું નામ *",
        childNamePh: "દા.ત. આરવ",
        childAgeLabel: "બાળકની ઉંમર *",
        childAgePh: "દા.ત. 4 વર્ષ",
        modeLabel: "પસંદગીનો પરામર્શ પ્રકાર",
        modes: ["ક્લિનિક મુલાકાત (ઇન્દોર)", "ઓનલાઇન વિડિયો પરામર્શ", "માર્ગદર્શન જોઈએ છે"],
        concernLabel: "મુખ્ય સમસ્યા સંક્ષિપ્તમાં *",
        concernPh: "દા.ત. છેલ્લા 6 મહિનાથી વારંવાર શરદી-ઉધરસ, ઓછી ભૂખ, વજન ન વધવું…",
        concernErr: "કૃપા કરીને બાળકની સમસ્યા ટૂંકમાં લખો.",
        submitBtn: "એપોઇન્ટમેન્ટ વિનંતી મોકલો",
        submittingBtn: "મોકલાઈ રહ્યું છે…",
        openWaBtn: "WhatsApp પર પણ સંદેશ મોકલો",
      },
      privacy: {
        seoTitle: "ગોપનીયતા નીતિ | બાળચિકિત્સા આયુર્વેદ ક્લિનિક",
        seoDesc: "બાળચિકિત્સા આયુર્વેદ ક્લિનિકની ગોપનીયતા નીતિ: વાલી અને બાળકોની વિગતોની સુરક્ષા.",
        eyebrow: "કાનૂની માહિતી",
        h1: "ગોપનીયતા નીતિ (Privacy Policy)",
        intro: "બાળચિકિત્સા આયુર્વેદ ક્લિનિક વાલી અને બાળકોની પરામર્શ માહિતીનું રક્ષણ કેવી રીતે કરે છે.",
        crumb: "ગોપનીયતા નીતિ",
        items: [
          { strong: "અમે કઈ માહિતી એકત્ર કરીએ છીએ:", body: "માત્ર તમે સ્વૈચ્છિક રીતે આપેલી મૂળભૂત સંપર્ક અને પરામર્શ વિગતો (વાલીનું નામ, ફોન/WhatsApp, વૈકલ્પિક ઈમેલ, બાળકનું નામ, ઉંમર, પરામર્શ પ્રકાર અને સંક્ષિપ્ત સમસ્યા)." },
          { strong: "માહિતીનો ઉપયોગ:", body: "ફક્ત તમારી પૂછપરછનો જવાબ આપવા, એપોઇન્ટમેન્ટ નક્કી કરવા અને બાળકની સારવારની તૈયારી માટે. માહિતીનું વેચાણ કે જાહેરાત પ્રોફાઇલિંગ ક્યારેય થતું નથી." },
          { strong: "સંગ્રહ અને ગોપનીયતા:", body: "તમામ વિગતો તબીબી ગોપનીયતાના ધોરણો હેઠળ સુરક્ષિત રાખવામાં આવે છે. ફોર્મમાં સરકારી ઓળખપત્રો મોકલશો નહીં." },
          { strong: "બાળકોની ગોપનીયતા:", body: "સગીર બાળકો અંગેની વિગતો માત્ર માતા-પિતા અથવા કાયદેસર વાલી દ્વારા જ આપવી જોઈએ." },
          { strong: "તમારા અધિકારો અને સંપર્ક:", body: "તમારી માહિતી જોવા, સુધારવા કે દૂર કરવા માટે સીધો ક્લિનિકનો સંપર્ક કરો:" },
          { strong: "કૂકીઝ અને ટ્રેકર્સ:", body: "આ વેબસાઇટ માત્ર તમારી પસંદ કરેલી ભાષા અને ચલણ પસંદગી સાચવે છે — કોઈપણ જાહેરાત ટ્રેકર્સ નથી." },
        ],
      },
      terms: {
        seoTitle: "ઉપયોગની શરતો | બાળચિકિત્સા આયુર્વેદ ક્લિનિક",
        seoDesc: "બાળચિકિત્સા આયુર્વેદ ક્લિનિક વેબસાઇટના ઉપયોગની શરતો અને તબીબી મર્યાદાઓ.",
        eyebrow: "કાનૂની માહિતી",
        h1: "ઉપયોગની શરતો (Terms of Use)",
        intro: "આ વેબસાઇટ શું સેવા આપે છે (આરોગ્ય શિક્ષણ અને એપોઇન્ટમેન્ટ વિનંતી) અને તેની મર્યાદાઓ શું છે તે કૃપા કરીને વાંચો.",
        crumb: "ઉપયોગની શરતો",
        items: [
          { strong: "માત્ર શૈક્ષણિક હેતુ:", body: "વેબસાઇટ પરના લેખો અને ગાઇડ સામાન્ય જાગૃતિ માટે છે; તે વ્યક્તિગત તબીબી નિદાન કે પ્રિસ્ક્રિપ્શનનું સ્થાન લેતા નથી." },
          { strong: "કટોકટી સેવા નથી:", body: "આ વેબસાઇટ કટોકટીની તબીબી સેવા માટે નથી. કોઈપણ ગંભીર લક્ષણો જણાય તો તરત નજીકની હોસ્પિટલનો સંપર્ક કરો." },
          { strong: "એપોઇન્ટમેન્ટ પુષ્ટિ:", body: "પરામર્શ સમય, પ્રકાર અને ફી ક્લિનિક દ્વારા બુકિંગ સમયે કન્ફર્મ કરવામાં આવે છે." },
          { strong: "પરિણામોની પારદર્શિતા:", body: "દરેક બાળકમાં સુધારાનો સમયગાળો અલગ હોઈ શકે છે; કોઈ ખોટા વચનો કે ગેરંટી આપવામાં આવતી નથી." },
          { strong: "સામગ્રીનો ઉપયોગ:", body: "તમે પેજની લિંક્સ શેર કરી શકો છો; પરવાનગી વિના તબીબી લેખોની સંપૂર્ણ નકલ પ્રતિબંધિત છે." },
        ],
      },
      sitemap: {
        seoTitle: "સાઇટમેપ — તમામ પૃષ્ઠો | બાળચિકિત્સા આયુર્વેદ ક્લિનિક",
        seoDesc: "તમામ 22 બાળ રોગ ગાઇડ, સારવાર, આરોગ્ય લેખો અને ક્લિનિક પૃષ્ઠોની યાદી.",
        pagesCountSuffix: "જાહેર પૃષ્ઠો",
        h1: "સંપૂર્ણ વેબસાઇટ યાદી (સાઇટમેપ)",
        intro: "બાળચિકિત્સા આયુર્વેદ ક્લિનિકના તમામ પૃષ્ઠો — ગુજરાતી, હિન્દી, મરાઠી અને અંગ્રેજીમાં ઉપલબ્ધ.",
        crumb: "સાઇટમેપ",
        mainHeading: "મુખ્ય પૃષ્ઠો",
        mainLinks: [
          { label: "મુખ્ય પૃષ્ઠ", href: "/" },
          { label: "ડૉ. પ્રિયંકા લિખાર વિશે", href: "/about-doctor/" },
          { label: "બાળ આરોગ્ય કેન્દ્ર", href: "/child-health/" },
          { label: "વારંવાર પૂછાતા પ્રશ્નો", href: "/faq/" },
          { label: "સંપર્ક અને એપોઇન્ટમેન્ટ", href: "/contact/" },
        ],
        condHeading: "બાળ આરોગ્ય સમસ્યા લાઇબ્રેરી (22)",
        treatHeading: "સારવાર અને પરામર્શ સેવાઓ (12)",
        artHeading: "વાલી આરોગ્ય લેખો (23)",
        localHeading: "ઇન્દોર અને મધ્ય પ્રદેશ સ્થાનિક પૃષ્ઠો (7)",
        legalHeading: "કાનૂની નીતિઓ",
      },
      notFound: {
        seoTitle: "પૃષ્ઠ મળ્યું નથી | બાળચિકિત્સા આયુર્વેદ ક્લિનિક",
        h1: "આ પૃષ્ઠ ઉપલબ્ધ નથી",
        desc: "કદાચ લિંક બદલાઈ હોઈ શકે. નીચેના વિકલ્પોમાંથી મુખ્ય પૃષ્ઠ અથવા બાળ આરોગ્ય ગાઇડ જુઓ.",
        homeBtn: "મુખ્ય પૃષ્ઠ પર જાઓ",
        condBtn: "22 સમસ્યાઓ જુઓ",
        contactBtn: "ક્લિનિક સંપર્ક",
      },
    },
  },
};

export function usePagesDict(lang: Language): PagesI18n {
  return PAGES_DICTIONARY[lang] ?? PAGES_DICTIONARY.en;
}
