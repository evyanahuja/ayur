/* Four-language dictionary (EN, HI, MR, GU) for the all-age expansion:
   Hero, Homepage sections, Conversion blocks, Category Hub/View, Nav & Form consent/labels. */
import type { Language } from "./config";

export interface ExpansionDict {
  hero: {
    line1: string;
    line2Pre: string;
    highlight: string;
    line3: string;
    subheadingPre: string;
    subheadingPost: string;
    bookBtn: string;
    methodBtn: string;
    miniStats: { k: string; v: string }[];
    quote: string;
    credApproachTitle: string;
    credApproachSub: string;
    credTherapiesTitle: string;
    credTherapiesSub: string;
  };
  home: {
    concernsEyebrow: string;
    concernsTitle: string;
    concernsDesc: string;
    concernsExplorePrefix: string;
    concernsViewAll: string;
    concernCards: Record<string, { title: string; desc: string }>;
    guidesEyebrow: string;
    guidesTitle: string;
    readGuide: string;
    treatEyebrow: string;
    treatTitle: string;
    treatDesc: string;
    treatExploreAll: string;
    treatmentCards: Record<string, { title: string; desc: string }>;
    stepsEyebrow: string;
    stepsTitle: string;
    steps: { title: string; desc: string }[];
    whyEyebrow: string;
    whyTitle: string;
    whyPoints: { title: string; desc: string }[];
    articlesEyebrow: string;
    articlesTitle: string;
    minRead: string;
    browseArticles: string;
    faqEyebrow: string;
    faqTitle: string;
    faqs: { q: string; a: string }[];
    clinicEyebrow: string;
    clinicTitle: string;
    clinicName: string;
    clinicAddress: string;
    clinicHours: string;
    getDirections: string;
    whatsappEnquiry: string;
    bookAppointment: string;
    mapTitle: string;
    waMsg: string;
  };
  conversion: {
    ctaAria: string;
    ctaTitle: string;
    ctaBody: string;
    ctaBook: string;
    ctaCallPrefix: string;
    ctaWhatsapp: string;
    ctaDirections: string;
    ctaWaMsg: string;
    doctorHelpEyebrow: string;
    doctorHelpTitle: string;
    doctorHelpBody: string;
    doctorHelpCreds: string[];
    doctorHelpNote: string;
    doctorHelpLink: string;
    tocAria: string;
    tocTitle: string;
    tocLabels: {
      whatIs: string;
      signs: string;
      causes: string;
      assess: string;
      ayurveda: string;
      management: string;
      redFlags: string;
      faq: string;
    };
    draftStrong: string;
    draftBody: string;
    pendingReview: string;
    condIntroCtaTitle: string;
    condIntroCtaBody: string;
    condMidCtaTitle: string;
    condMidCtaBody: string;
  };
  categories: {
    homeCrumb: string;
    hubCrumb: string;
    hubEyebrow: string;
    hubH1: string;
    hubIntro: string;
    hubSrHeading: string;
    hubSeoTitle: string;
    readCategoryGuide: string;
    catEyebrow: string;
    catH1Suffix: string;
    catMeta: string;
    understandingTitle: (title: string) => string;
    approachTitle: string;
    concernsTitle: string;
    guidesTitle: string;
    treatmentsTitle: string;
    faqTitle: string;
    otherTitle: string;
    compactCtaTitle: string;
    compactCtaBody: string;
  };
  nav: {
    browseAllConditions: string;
    healthConcernsLink: string;
  };
  form: {
    contactName: string;
    contactNamePh: string;
    patientSection: string;
    patientName: string;
    patientNamePh: string;
    patientAgePh: string;
    genderSelect: string;
    genderFemale: string;
    genderMale: string;
    genderGirl: string;
    genderBoy: string;
    genderPreferNot: string;
    symptomsLabel: string;
    symptomsHint: string;
    symptomsPh: string;
    consentText: string;
    privacyPre: string;
    privacyLink: string;
    privacyPost: string;
    consentError: string;
    contactNameError: string;
    patientNameError: string;
    patientAgeError: string;
    nonConfirmNote: string;
  };
}

const en: ExpansionDict = {
  hero: {
    line1: "Personalised Ayurvedic",
    line2Pre: "healthcare for",
    highlight: "every stage",
    line3: "of life",
    subheadingPre:
      "Individualised Ayurvedic care for children, adults and families. Explore pediatric healthcare, Panchakarma, skin conditions and general health consultations with",
    subheadingPost: ".",
    bookBtn: "Book an Appointment",
    methodBtn: "How a consultation works",
    miniStats: [
      { k: "BAMS · MD", v: "Ayurvedic qualifications" },
      { k: "All ages", v: "Children, adults and seniors" },
      { k: "Online", v: "Video consultations too" },
    ],
    quote: "Individualised Ayurvedic care for every stage of life.",
    credApproachTitle: "Individual assessment",
    credApproachSub: "Prakriti, digestion, sleep and routine",
    credTherapiesTitle: "Panchakarma and therapies",
    credTherapiesSub: "Offered only after assessment",
  },
  home: {
    concernsEyebrow: "Find your care",
    concernsTitle: "What Health Concern Are You Looking For Help With?",
    concernsDesc:
      "Choose an area to read about common conditions, the Ayurvedic approach, and how a consultation with Dr. Priyanka Likhar can help. Individualised care for children, adults and senior citizens.",
    concernsExplorePrefix: "Explore",
    concernsViewAll: "View all health concerns →",
    concernCards: {
      "childrens-health": {
        title: "Children's Health",
        desc: "Growth, appetite, immunity, sleep, skin, speech and attention concerns, with a paediatric focus.",
      },
      "skin-hair-conditions": {
        title: "Skin & Hair",
        desc: "Psoriasis, eczema, rashes, hair fall and dandruff, assessed individually.",
      },
      "digestive-disorders": {
        title: "Digestive Health",
        desc: "Acidity, constipation, bloating, piles and appetite concerns.",
      },
      "womens-health": {
        title: "Women's Health",
        desc: "PCOS, irregular periods, menopause and postpartum wellbeing.",
      },
      "mens-health": {
        title: "Men's Health",
        desc: "Stress, sleep, hair, digestive and urinary concerns, handled confidentially.",
      },
      "joint-bone-disorders": {
        title: "Joint & Senior Health",
        desc: "Knee and back pain, stiffness, bone health and healthy ageing for older adults.",
      },
    },
    guidesEyebrow: "Health guides",
    guidesTitle: "Popular health guides",
    readGuide: "Read guide",
    treatEyebrow: "Therapies",
    treatTitle: "Panchakarma and Ayurvedic Treatments",
    treatDesc:
      "Classical therapies are offered only after individual assessment. Not every therapy suits every person, and some are not suitable in pregnancy, during acute illness or with certain medical conditions.",
    treatExploreAll: "Explore all treatments →",
    treatmentCards: {
      panchakarma: {
        title: "Panchakarma",
        desc: "Classical purification therapies, suitable only after individual assessment.",
      },
      abhyanga: {
        title: "Abhyanga",
        desc: "Medicated oil massage used for relaxation, joint comfort and skin care.",
      },
      shirodhara: {
        title: "Shirodhara",
        desc: "Warm oil poured gently on the forehead, traditionally used for stress and sleep.",
      },
      "basti-therapy": {
        title: "Basti Therapy",
        desc: "A Panchakarma therapy used traditionally for specific Vata-type bowel and joint conditions.",
      },
      nasya: {
        title: "Nasya",
        desc: "Medicated nasal therapy, traditionally used for head, sinus and voice concerns.",
      },
      rasayana: {
        title: "Rasayana",
        desc: "Nourishment and rejuvenation programmes for healthy ageing and recovery.",
      },
      "customized-suvarnaprashan": {
        title: "Customized Suvarnaprashan",
        desc: "A traditional gold-herb Sanskar, individualised by age and health.",
      },
      "ayurvedic-diet-lifestyle": {
        title: "Diet & Lifestyle",
        desc: "Practical, individual Ayurvedic diet and daily routine guidance.",
      },
    },
    stepsEyebrow: "The consultation",
    stepsTitle: "How an Ayurvedic consultation works",
    steps: [
      {
        title: "Share your story",
        desc: "Tell us about your symptoms, history, medicines and any reports. Children, adults and senior citizens are all welcome.",
      },
      {
        title: "Individual assessment",
        desc: "Dr. Priyanka Likhar reviews digestion, sleep, diet, routine and constitution (Prakriti) alongside your medical history.",
      },
      {
        title: "A clear, written plan",
        desc: "You receive diet, lifestyle and any suitable Ayurvedic measures, with an explanation of what each is for and what to watch for.",
      },
      {
        title: "Follow-up and review",
        desc: "Progress is reviewed at follow-up visits. Plans are adjusted, and medical care is coordinated where needed.",
      },
    ],
    whyEyebrow: "Why patients choose us",
    whyTitle: "Why choose AyurvedDoctor in Indore",
    whyPoints: [
      {
        title: "Paediatric specialist training",
        desc: "MD in Kaumarbhritya (Ayurvedic pediatrics) alongside BAMS, so children's care is a core strength of the practice.",
      },
      {
        title: "Care for every age",
        desc: "Support for children, adults, women, men and senior citizens, with a plan built around each person.",
      },
      {
        title: "Honest about limits",
        desc: "Clear advice on what Ayurveda can and cannot offer, and when you need a specialist or emergency care.",
      },
      {
        title: "Unhurried assessment",
        desc: "Time for history, Prakriti, digestion, sleep and routine, rather than a one-size-fits-all prescription.",
      },
      {
        title: "Coordination with your doctors",
        desc: "We do not ask you to stop prescribed medicines. Any change is planned together with your existing doctors.",
      },
      {
        title: "In clinic or online",
        desc: "Consultations at our Indore clinic, and video consultations for families across India and abroad.",
      },
    ],
    articlesEyebrow: "Health education",
    articlesTitle: "Health articles",
    minRead: "min read",
    browseArticles: "Browse all articles →",
    faqEyebrow: "Questions",
    faqTitle: "Frequently asked questions",
    faqs: [
      {
        q: "Do you treat adults and senior citizens as well as children?",
        a: "Yes. Dr. Priyanka Likhar has postgraduate training in Ayurvedic pediatrics (MD Kaumarbhritya) and also consults adults and senior citizens about general health, skin, digestive, women's, men's and joint concerns.",
      },
      {
        q: "Is Ayurveda safe alongside my current medicines?",
        a: "It can be, but only after a full medicine review. Tell the clinic about every medicine, supplement and herbal product you take. Never stop prescribed medicines because of an Ayurvedic plan; any change is coordinated with your own doctor.",
      },
      {
        q: "Can Ayurveda cure my condition permanently?",
        a: "No honest guarantee can be given for any condition. The aim is to understand the problem, support comfort and daily function, and plan treatment with realistic expectations.",
      },
      {
        q: "What should I bring to my first visit?",
        a: "Previous prescriptions and reports, a list of current medicines, and for children a growth record and vaccination card if available.",
      },
      {
        q: "Do you offer online consultations?",
        a: "Yes. Video consultations are available for families within India and abroad. Some conditions need an in-person examination, and the doctor will tell you if that is the case.",
      },
      {
        q: "Is a consultation enough in an emergency?",
        a: "No. For chest pain, breathing difficulty, heavy bleeding, sudden weakness, seizures or any other emergency, go to the nearest emergency service immediately.",
      },
    ],
    clinicEyebrow: "Visit the clinic",
    clinicTitle: "Clinic location and timings in Indore",
    clinicName: "BalChikitsa Ayurved Clinic",
    clinicAddress: "Sanchar Nagar Extension, Kanadia Road, Indore, Madhya Pradesh 452016",
    clinicHours: "Mon–Sat • 10 AM–2 PM & 5 PM–8 PM IST",
    getDirections: "Get Directions",
    whatsappEnquiry: "WhatsApp Enquiry",
    bookAppointment: "Book Appointment",
    mapTitle: "Map showing BalChikitsa Ayurved Clinic, Sanchar Nagar Extension, Kanadia Road, Indore",
    waMsg: "Namaste Dr. Priyanka, I would like to book a consultation.",
  },
  conversion: {
    ctaAria: "Book an Ayurvedic consultation",
    ctaTitle: "Don't Ignore Your Health Concerns. Get an Individualised Assessment.",
    ctaBody:
      "Consult Dr. Priyanka Likhar at BalChikitsa Ayurved Clinic, Indore, to discuss your health concerns and explore suitable treatment options.",
    ctaBook: "Book Appointment",
    ctaCallPrefix: "Call Clinic",
    ctaWhatsapp: "WhatsApp Enquiry",
    ctaDirections: "Get Directions",
    ctaWaMsg: "Namaste Dr. Priyanka, I would like to enquire about an Ayurvedic consultation.",
    doctorHelpEyebrow: "About your consultation",
    doctorHelpTitle: "Looking for an Ayurvedic Consultation?",
    doctorHelpBody:
      "Every individual experiences health problems differently. Dr. Priyanka Likhar assesses the patient's symptoms, health history, lifestyle and individual constitution to understand the condition and discuss appropriate treatment options.",
    doctorHelpCreds: [
      "BAMS — Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur",
      "MD (Kaumarbhritya / Pediatrics) — Institute of Teaching and Research in Ayurveda (ITRA)",
      "Registration No. 63934",
      "Clinical areas: Ayurvedic pediatrics, Panchakarma, skin conditions and general health",
    ],
    doctorHelpNote:
      "A consultation is an assessment and discussion, not an emergency service. If you have any warning sign described on this page, seek urgent medical care first.",
    doctorHelpLink: "Read Dr. Priyanka Likhar's profile",
    tocAria: "On this page",
    tocTitle: "On this page",
    tocLabels: {
      whatIs: "What is it?",
      signs: "Symptoms",
      causes: "Causes and contributing factors",
      assess: "When to get assessed",
      ayurveda: "The Ayurvedic perspective",
      management: "How Ayurveda approaches it",
      redFlags: "Warning signs",
      faq: "Frequently asked questions",
    },
    draftStrong: "Draft for physician review.",
    draftBody:
      "This guide has not yet been approved by Dr. Priyanka Likhar. It is not indexed by search engines and should not be relied on as medical advice until it has been reviewed.",
    pendingReview: "Medical review pending",
    condIntroCtaTitle: "Think this sounds like your concern?",
    condIntroCtaBody:
      "Describe your symptoms and history. Dr. Priyanka Likhar will discuss what may be going on, what should be checked first, and whether an Ayurvedic consultation is suitable.",
    condMidCtaTitle: "Want to talk your concern through with a doctor?",
    condMidCtaBody:
      "Book a consultation to discuss your history, medicines and goals. The clinic will tell you honestly whether Ayurvedic care is suitable for you.",
  },
  categories: {
    homeCrumb: "Home",
    hubCrumb: "Health Concerns",
    hubEyebrow: "Health concerns",
    hubH1: "What health concern are you looking for help with?",
    hubIntro:
      "Read about common conditions in each area, the Ayurvedic approach, and how a consultation with Dr. Priyanka Likhar at our Indore clinic can help. Care is individualised for children, adults and senior citizens.",
    hubSrHeading: "Health concern categories",
    hubSeoTitle: "Health Concerns We Help With | Ayurvedic Care for All Ages in Indore",
    readCategoryGuide: "Read the guide",
    catEyebrow: "Health concern",
    catH1Suffix: ": Individualised Ayurvedic Care",
    catMeta: "Dr. Priyanka Likhar • BAMS, MD (Kaumarbhritya) • Indore clinic and online",
    understandingTitle: (title) => `Understanding ${title.toLowerCase()}`,
    approachTitle: "The Ayurvedic approach",
    concernsTitle: "Common concerns we discuss",
    guidesTitle: "Condition guides",
    treatmentsTitle: "Related treatments",
    faqTitle: "Frequently asked questions",
    otherTitle: "Explore other health concerns",
    compactCtaTitle: "Not sure which concern fits you?",
    compactCtaBody:
      "Describe your symptoms and history. Dr. Priyanka Likhar will tell you honestly whether an Ayurvedic consultation can help and what should be checked first.",
  },
  nav: {
    browseAllConditions: "Browse all conditions (A–Z) →",
    healthConcernsLink: "Health Concerns (All Ages)",
  },
  form: {
    contactName: "Your name / Contact person *",
    contactNamePh: "e.g. Sneha Kulkarni",
    patientSection: "Patient details",
    patientName: "Patient's name *",
    patientNamePh: "e.g. Ramesh or Sunita",
    patientAgePh: "e.g. 4 yrs or 45 yrs",
    genderSelect: "Select",
    genderFemale: "Female",
    genderMale: "Male",
    genderGirl: "Child — Girl",
    genderBoy: "Child — Boy",
    genderPreferNot: "Prefer not to say",
    symptomsLabel: "Brief health concern",
    symptomsHint: "(optional — avoid detailed medical records)",
    symptomsPh: "e.g. Acidity after meals for 2 months, or child's recurrent cold…",
    consentText:
      "I agree that BalChikitsa Ayurved Clinic may contact me about this enquiry. Submitting this form does not by itself confirm an appointment.",
    privacyPre: "Your details are used only to respond to this enquiry. Read our",
    privacyLink: "privacy policy",
    privacyPost: ".",
    consentError: "Please tick the consent box so we can process your enquiry.",
    contactNameError: "Please enter your name.",
    patientNameError: "Please enter the patient's name.",
    patientAgeError: "Please enter the patient's age.",
    nonConfirmNote: "This is an enquiry, not a confirmed appointment. The clinic will contact you to confirm a slot.",
  },
};

const hi: ExpansionDict = {
  hero: {
    line1: "जीवन के हर पड़ाव के लिए",
    line2Pre: "व्यक्तिगत आयुर्वेदिक",
    highlight: "स्वास्थ्य देखभाल",
    line3: "सभी उम्र के लिए",
    subheadingPre:
      "बच्चों, वयस्कों और परिवारों के लिए व्यक्तिगत आयुर्वेदिक देखभाल। बाल स्वास्थ्य, पंचकर्म, त्वचा रोग और सामान्य स्वास्थ्य परामर्श के लिए मिलें",
    subheadingPost: " से।",
    bookBtn: "अपॉइंटमेंट बुक करें",
    methodBtn: "परामर्श कैसे होता है",
    miniStats: [
      { k: "BAMS · MD", v: "आयुर्वेदिक योग्यता" },
      { k: "सभी उम्र", v: "बच्चे, वयस्क व वरिष्ठ" },
      { k: "ऑनलाइन", v: "वीडियो परामर्श उपलब्ध" },
    ],
    quote: "जीवन के हर पड़ाव के लिए व्यक्तिगत आयुर्वेदिक स्वास्थ्य देखभाल।",
    credApproachTitle: "व्यक्तिगत मूल्यांकन",
    credApproachSub: "प्रकृति, पाचन, नींद और दिनचर्या",
    credTherapiesTitle: "पंचकर्म व चिकित्साएँ",
    credTherapiesSub: "केवल मूल्यांकन के बाद उपयुक्त होने पर",
  },
  home: {
    concernsEyebrow: "सही देखभाल चुनें",
    concernsTitle: "आप किस स्वास्थ्य समस्या के लिए मदद ढूँढ रहे हैं?",
    concernsDesc:
      "आम समस्याओं, आयुर्वेदिक दृष्टिकोण और डॉ. प्रियंका लिखार के साथ परामर्श की प्रक्रिया जानने के लिए कोई श्रेणी चुनें। बच्चों, वयस्कों और वरिष्ठ नागरिकों के लिए व्यक्तिगत देखभाल।",
    concernsExplorePrefix: "देखें:",
    concernsViewAll: "सभी स्वास्थ्य श्रेणियाँ देखें →",
    concernCards: {
      "childrens-health": {
        title: "बच्चों का स्वास्थ्य",
        desc: "विकास, भूख, रोग प्रतिरोधक क्षमता, नींद, त्वचा, वाणी और ध्यान संबंधी समस्याएँ — बालरोग विशेषज्ञता के साथ।",
      },
      "skin-hair-conditions": {
        title: "त्वचा और बाल",
        desc: "सोरायसिस, एक्जिमा, चकत्ते, बाल झड़ना और डैंड्रफ का व्यक्तिगत मूल्यांकन।",
      },
      "digestive-disorders": {
        title: "पाचन स्वास्थ्य",
        desc: "एसिडिटी, कब्ज, गैस-पेट फूलना, बवासीर और भूख की समस्याएँ।",
      },
      "womens-health": {
        title: "महिला स्वास्थ्य",
        desc: "PCOS, अनियमित मासिक धर्म, रजोनिवृत्ति और प्रसवोत्तर देखभाल।",
      },
      "mens-health": {
        title: "पुरुष स्वास्थ्य",
        desc: "तनाव, नींद, बाल झड़ना, पाचन और मूत्र संबंधी समस्याएँ — गोपनीय परामर्श।",
      },
      "joint-bone-disorders": {
        title: "जोड़ों व वरिष्ठ स्वास्थ्य",
        desc: "घुटने व पीठ दर्द, अकड़न, हड्डियों का स्वास्थ्य और स्वस्थ वृद्धावस्था।",
      },
    },
    guidesEyebrow: "स्वास्थ्य मार्गदर्शिकाएँ",
    guidesTitle: "लोकप्रिय स्वास्थ्य मार्गदर्शिकाएँ",
    readGuide: "मार्गदर्शिका पढ़ें",
    treatEyebrow: "चिकित्साएँ",
    treatTitle: "पंचकर्म और आयुर्वेदिक उपचार",
    treatDesc:
      "शास्त्रीय चिकित्साएँ केवल व्यक्तिगत मूल्यांकन के बाद ही सुझाई जाती हैं। हर चिकित्सा हर व्यक्ति के लिए उपयुक्त नहीं होती — गर्भावस्था, तीव्र बीमारी या कुछ चिकित्सीय स्थितियों में सावधानी आवश्यक है।",
    treatExploreAll: "सभी उपचार देखें →",
    treatmentCards: {
      panchakarma: {
        title: "पंचकर्म",
        desc: "शास्त्रीय शोधन चिकित्साएँ — केवल व्यक्तिगत मूल्यांकन के बाद उपयुक्त होने पर।",
      },
      abhyanga: {
        title: "अभ्यंग",
        desc: "आराम, जोड़ों की सहजता और त्वचा देखभाल के लिए औषधीय तेल मालिश।",
      },
      shirodhara: {
        title: "शिरोधारा",
        desc: "तनाव और नींद के लिए पारंपरिक रूप से माथे पर गुनगुने तेल की सौम्य धारा।",
      },
      "basti-therapy": {
        title: "बस्ति चिकित्सा",
        desc: "विशेष वात-संबंधी आंत्र व जोड़ों की स्थितियों में पारंपरिक पंचकर्म चिकित्सा।",
      },
      nasya: {
        title: "नस्य",
        desc: "सिर, साइनस और आवाज़ से जुड़ी समस्याओं के लिए औषधीय नासिका चिकित्सा।",
      },
      rasayana: {
        title: "रसायन",
        desc: "स्वस्थ वृद्धावस्था और स्वास्थ्य लाभ के लिए पोषण व कायाकल्प योजनाएँ।",
      },
      "customized-suvarnaprashan": {
        title: "कस्टमाइज़्ड सुवर्णप्राशन",
        desc: "उम्र और स्वास्थ्य के अनुसार व्यक्तिगत पारंपरिक स्वर्ण-औषधि संस्कार।",
      },
      "ayurvedic-diet-lifestyle": {
        title: "आहार और जीवनशैली",
        desc: "व्यावहारिक, व्यक्तिगत आयुर्वेदिक आहार और दैनिक दिनचर्या मार्गदर्शन।",
      },
    },
    stepsEyebrow: "परामर्श प्रक्रिया",
    stepsTitle: "आयुर्वेदिक परामर्श कैसे काम करता है",
    steps: [
      {
        title: "अपनी समस्या साझा करें",
        desc: "अपने लक्षण, चिकित्सा इतिहास, दवाओं और रिपोर्ट के बारे में बताएँ। बच्चे, वयस्क और वरिष्ठ नागरिक सभी का स्वागत है।",
      },
      {
        title: "व्यक्तिगत मूल्यांकन",
        desc: "डॉ. प्रियंका लिखार आपके चिकित्सा इतिहास के साथ पाचन, नींद, आहार, दिनचर्या और प्रकृति की समीक्षा करती हैं।",
      },
      {
        title: "स्पष्ट लिखित योजना",
        desc: "आपको आहार, जीवनशैली और उपयुक्त आयुर्वेदिक उपायों की योजना मिलती है, साथ ही क्या ध्यान रखें इसकी स्पष्ट जानकारी।",
      },
      {
        title: "फॉलो-अप और समीक्षा",
        desc: "फॉलो-अप विज़िट में प्रगति की समीक्षा होती है, योजना समायोजित की जाती है और आवश्यकतानुसार आधुनिक चिकित्सा से समन्वय रखा जाता है।",
      },
    ],
    whyEyebrow: "मरीज़ हमें क्यों चुनते हैं",
    whyTitle: "इंदौर में AyurvedDoctor क्यों चुनें",
    whyPoints: [
      {
        title: "बालरोग विशेषज्ञ प्रशिक्षण",
        desc: "BAMS के साथ कौमारभृत्य (आयुर्वेदिक बाल चिकित्सा) में MD — बच्चों की देखभाल क्लिनिक की प्रमुख विशेषता है।",
      },
      {
        title: "हर उम्र की देखभाल",
        desc: "बच्चों, वयस्कों, महिलाओं, पुरुषों और वरिष्ठ नागरिकों के लिए हर व्यक्ति के अनुसार योजना।",
      },
      {
        title: "सीमाओं पर ईमानदारी",
        desc: "आयुर्वेद क्या कर सकता है और क्या नहीं, तथा कब विशेषज्ञ या आपातकालीन सेवा चाहिए — इसकी स्पष्ट सलाह।",
      },
      {
        title: "बिना जल्दबाज़ी का मूल्यांकन",
        desc: "एक जैसी पर्ची देने के बजाय इतिहास, प्रकृति, पाचन, नींद और दिनचर्या समझने का पूरा समय।",
      },
      {
        title: "आपके डॉक्टरों के साथ समन्वय",
        desc: "हम आपकी चल रही दवाएँ बंद करने को नहीं कहते। कोई भी बदलाव आपके डॉक्टर के साथ मिलकर किया जाता है।",
      },
      {
        title: "क्लिनिक या ऑनलाइन",
        desc: "इंदौर क्लिनिक में प्रत्यक्ष भेंट और भारत व विदेश के परिवारों के लिए वीडियो परामर्श।",
      },
    ],
    articlesEyebrow: "स्वास्थ्य शिक्षा",
    articlesTitle: "स्वास्थ्य लेख",
    minRead: "मिनट पठन",
    browseArticles: "सभी लेख पढ़ें →",
    faqEyebrow: "सामान्य प्रश्न",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqs: [
      {
        q: "क्या आप बच्चों के साथ वयस्कों और वरिष्ठ नागरिकों का भी परामर्श करती हैं?",
        a: "हाँ। डॉ. प्रियंका लिखार ने आयुर्वेदिक बाल चिकित्सा (MD कौमारभृत्य) में स्नातकोत्तर प्रशिक्षण लिया है और वे वयस्कों व वरिष्ठ नागरिकों को सामान्य स्वास्थ्य, त्वचा, पाचन, महिला, पुरुष और जोड़ों की समस्याओं के लिए भी परामर्श देती हैं।",
      },
      {
        q: "क्या मेरी मौजूदा दवाओं के साथ आयुर्वेद सुरक्षित है?",
        a: "यह पूरी दवा समीक्षा के बाद ही तय किया जा सकता है। क्लिनिक को अपनी हर दवा, सप्लीमेंट और हर्बल उत्पाद की जानकारी दें। किसी भी आयुर्वेदिक योजना के कारण डॉक्टर द्वारा दी गई दवाएँ कभी बंद न करें; कोई भी बदलाव अपने डॉक्टर से समन्वय करके करें।",
      },
      {
        q: "क्या आयुर्वेद मेरी बीमारी को स्थायी रूप से ठीक कर सकता है?",
        a: "किसी भी बीमारी के लिए स्थायी इलाज की ईमानदार गारंटी नहीं दी जा सकती। उद्देश्य समस्या को समझना, आराम और दैनिक जीवन की गुणवत्ता को सहारा देना और यथार्थवादी अपेक्षाओं के साथ योजना बनाना है।",
      },
      {
        q: "पहली विज़िट में मुझे क्या लाना चाहिए?",
        a: "पुरानी पर्चियाँ और रिपोर्ट, वर्तमान दवाओं की सूची, और बच्चों के लिए उपलब्ध होने पर ग्रोथ रिकॉर्ड व टीकाकरण कार्ड।",
      },
      {
        q: "क्या ऑनलाइन परामर्श उपलब्ध है?",
        a: "हाँ। भारत और विदेश के परिवारों के लिए वीडियो परामर्श उपलब्ध है। कुछ स्थितियों में प्रत्यक्ष जांच ज़रूरी होती है — ऐसा होने पर डॉक्टर स्पष्ट बताती हैं।",
      },
      {
        q: "क्या आपात स्थिति में परामर्श पर्याप्त है?",
        a: "नहीं। सीने में दर्द, सांस लेने में कठिनाई, भारी रक्तस्राव, अचानक कमज़ोरी, दौरे या किसी भी आपात स्थिति में तुरंत नज़दीकी आपातकालीन अस्पताल जाएँ।",
      },
    ],
    clinicEyebrow: "क्लिनिक पधारें",
    clinicTitle: "इंदौर में क्लिनिक का पता और समय",
    clinicName: "बालचिकित्सा आयुर्वेद क्लिनिक",
    clinicAddress: "संचार नगर एक्सटेंशन, कनाडिया रोड, इंदौर, मध्य प्रदेश 452016",
    clinicHours: "सोम–शनि • सुबह 10–दोपहर 2 एवं शाम 5–रात 8 IST",
    getDirections: "दिशा-निर्देश देखें",
    whatsappEnquiry: "WhatsApp पूछताछ",
    bookAppointment: "अपॉइंटमेंट बुक करें",
    mapTitle: "बालचिकित्सा आयुर्वेद क्लिनिक, संचार नगर एक्सटेंशन, कनाडिया रोड, इंदौर का मानचित्र",
    waMsg: "नमस्ते डॉ. प्रियंका, मैं आयुर्वेदिक परामर्श बुक करना चाहता/चाहती हूँ।",
  },
  conversion: {
    ctaAria: "आयुर्वेदिक परामर्श बुक करें",
    ctaTitle: "अपनी स्वास्थ्य समस्याओं को अनदेखा न करें। व्यक्तिगत मूल्यांकन करवाएँ।",
    ctaBody:
      "अपनी स्वास्थ्य समस्याओं पर चर्चा करने और उपयुक्त उपचार विकल्प जानने के लिए इंदौर के बालचिकित्सा आयुर्वेद क्लिनिक में डॉ. प्रियंका लिखार से परामर्श करें।",
    ctaBook: "अपॉइंटमेंट बुक करें",
    ctaCallPrefix: "क्लिनिक कॉल करें",
    ctaWhatsapp: "WhatsApp पूछताछ",
    ctaDirections: "दिशा-निर्देश देखें",
    ctaWaMsg: "नमस्ते डॉ. प्रियंका, मैं आयुर्वेदिक परामर्श के बारे में जानकारी चाहता/चाहती हूँ।",
    doctorHelpEyebrow: "आपके परामर्श के बारे में",
    doctorHelpTitle: "क्या आप आयुर्वेदिक परामर्श चाहते हैं?",
    doctorHelpBody:
      "हर व्यक्ति में स्वास्थ्य समस्याएँ अलग तरह से सामने आती हैं। डॉ. प्रियंका लिखार स्थिति को समझने और उपयुक्त उपचार विकल्पों पर चर्चा करने के लिए मरीज़ के लक्षण, स्वास्थ्य इतिहास, जीवनशैली और व्यक्तिगत प्रकृति का मूल्यांकन करती हैं।",
    doctorHelpCreds: [
      "BAMS — डॉ. वंदनाताई जे. ढोणे ग्रामीण आयुर्वेद कॉलेज, पातूर",
      "MD (कौमारभृत्य / बाल चिकित्सा) — इंस्टीट्यूट ऑफ टीचिंग एंड रिसर्च इन आयुर्वेद (ITRA)",
      "पंजीकरण संख्या: 63934",
      "चिकित्सा क्षेत्र: आयुर्वेदिक बाल चिकित्सा, पंचकर्म, त्वचा रोग और सामान्य स्वास्थ्य",
    ],
    doctorHelpNote:
      "परामर्श मूल्यांकन और मार्गदर्शन के लिए है, आपातकालीन सेवा नहीं। यदि इस पृष्ठ पर बताया गया कोई भी चेतावनी संकेत हो, तो पहले तुरंत चिकित्सा सहायता लें।",
    doctorHelpLink: "डॉ. प्रियंका लिखार की प्रोफ़ाइल पढ़ें",
    tocAria: "इस पृष्ठ पर",
    tocTitle: "इस पृष्ठ पर",
    tocLabels: {
      whatIs: "यह क्या है?",
      signs: "लक्षण",
      causes: "कारण और योगदान देने वाले कारक",
      assess: "कब जांच करवानी चाहिए",
      ayurveda: "आयुर्वेदिक दृष्टिकोण",
      management: "आयुर्वेद इसे कैसे देखता है",
      redFlags: "चेतावनी संकेत",
      faq: "अक्सर पूछे जाने वाले प्रश्न",
    },
    draftStrong: "चिकित्सकीय समीक्षा हेतु प्रारूप (ड्राफ्ट)।",
    draftBody:
      "यह मार्गदर्शिका अभी डॉ. प्रियंका लिखार द्वारा स्वीकृत नहीं हुई है। यह सर्च इंजन में इंडेक्स नहीं है और समीक्षा पूरी होने तक इसे चिकित्सीय सलाह के रूप में न मानें।",
    pendingReview: "चिकित्सकीय समीक्षा लंबित",
    condIntroCtaTitle: "क्या यह आपकी समस्या जैसा लगता है?",
    condIntroCtaBody:
      "अपने लक्षण और इतिहास साझा करें। डॉ. प्रियंका लिखार बताएँगी कि क्या कारण हो सकते हैं, पहले क्या जाँचना ज़रूरी है, और क्या आयुर्वेदिक परामर्श उपयुक्त होगा।",
    condMidCtaTitle: "क्या आप डॉक्टर से अपनी समस्या पर बात करना चाहते हैं?",
    condMidCtaBody:
      "अपने इतिहास, दवाओं और लक्ष्यों पर चर्चा करने के लिए परामर्श बुक करें। क्लिनिक आपको ईमानदारी से बताएगा कि आयुर्वेदिक देखभाल आपके लिए उपयुक्त है या नहीं।",
  },
  categories: {
    homeCrumb: "मुखपृष्ठ",
    hubCrumb: "स्वास्थ्य समस्याएँ",
    hubEyebrow: "स्वास्थ्य समस्याएँ",
    hubH1: "आप किस स्वास्थ्य समस्या के लिए मदद ढूँढ रहे हैं?",
    hubIntro:
      "प्रत्येक क्षेत्र की सामान्य स्थितियों, आयुर्वेदिक दृष्टिकोण और इंदौर क्लिनिक में डॉ. प्रियंका लिखार के साथ परामर्श की प्रक्रिया जानें। बच्चों, वयस्कों और वरिष्ठ नागरिकों के लिए व्यक्तिगत देखभाल।",
    hubSrHeading: "स्वास्थ्य समस्याओं की श्रेणियाँ",
    hubSeoTitle: "स्वास्थ्य समस्याएँ | इंदौर में सभी उम्र के लिए आयुर्वेदिक देखभाल",
    readCategoryGuide: "मार्गदर्शिका पढ़ें",
    catEyebrow: "स्वास्थ्य श्रेणी",
    catH1Suffix: ": व्यक्तिगत आयुर्वेदिक देखभाल",
    catMeta: "डॉ. प्रियंका लिखार • BAMS, MD (कौमारभृत्य) • इंदौर क्लिनिक और ऑनलाइन",
    understandingTitle: (title) => `${title} को समझें`,
    approachTitle: "आयुर्वेदिक दृष्टिकोण",
    concernsTitle: "जिन समस्याओं पर हम चर्चा करते हैं",
    guidesTitle: "रोग मार्गदर्शिकाएँ",
    treatmentsTitle: "संबंधित उपचार",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    otherTitle: "अन्य स्वास्थ्य श्रेणियाँ देखें",
    compactCtaTitle: "सुनिश्चित नहीं हैं कि कौन सी श्रेणी आपके लिए सही है?",
    compactCtaBody:
      "अपने लक्षण और इतिहास बताएँ। डॉ. प्रियंका लिखार ईमानदारी से बताएँगी कि क्या आयुर्वेदिक परामर्श मदद कर सकता है और पहले क्या जाँचना चाहिए।",
  },
  nav: {
    browseAllConditions: "सभी स्थितियाँ देखें (A–Z) →",
    healthConcernsLink: "स्वास्थ्य समस्याएँ (सभी उम्र)",
  },
  form: {
    contactName: "आपका नाम / संपर्क व्यक्ति *",
    contactNamePh: "उदा. स्नेहा कुलकर्णी",
    patientSection: "मरीज़ का विवरण",
    patientName: "मरीज़ का नाम *",
    patientNamePh: "उदा. रमेश या सुनीता",
    patientAgePh: "उदा. 4 वर्ष या 45 वर्ष",
    genderSelect: "चुनें",
    genderFemale: "महिला",
    genderMale: "पुरुष",
    genderGirl: "बच्ची (लड़की)",
    genderBoy: "बच्चा (लड़का)",
    genderPreferNot: "बताना नहीं चाहते",
    symptomsLabel: "संक्षिप्त स्वास्थ्य समस्या",
    symptomsHint: "(वैकल्पिक — विस्तृत चिकित्सा रिपोर्ट यहाँ न लिखें)",
    symptomsPh: "उदा. 2 महीने से भोजन के बाद एसिडिटी, या बच्चे को बार-बार सर्दी…",
    consentText:
      "मैं सहमत हूँ कि बालचिकित्सा आयुर्वेद क्लिनिक इस पूछताछ के संबंध में मुझसे संपर्क कर सकता है। यह फॉर्म जमा करने मात्र से अपॉइंटमेंट कन्फर्म नहीं होता।",
    privacyPre: "आपके विवरण का उपयोग केवल इस पूछताछ का उत्तर देने के लिए किया जाता है। हमारी",
    privacyLink: "गोपनीयता नीति",
    privacyPost: " पढ़ें।",
    consentError: "कृपया अपनी पूछताछ आगे बढ़ाने के लिए सहमति बॉक्स पर टिक करें।",
    contactNameError: "कृपया अपना नाम लिखें।",
    patientNameError: "कृपया मरीज़ का नाम लिखें।",
    patientAgeError: "कृपया मरीज़ की आयु लिखें।",
    nonConfirmNote: "यह केवल एक पूछताछ है, कन्फर्म अपॉइंटमेंट नहीं। स्लॉट पक्का करने के लिए क्लिनिक आपसे संपर्क करेगा।",
  },
};

const mr: ExpansionDict = {
  hero: {
    line1: "आयुष्याच्या प्रत्येक टप्प्यासाठी",
    line2Pre: "वैयक्तिक आयुर्वेदिक",
    highlight: "आरोग्य सेवा",
    line3: "सर्व वयोगटांसाठी",
    subheadingPre:
      "मुलं, प्रौढ आणि कुटुंबांसाठी वैयक्तिक आयुर्वेदिक काळजी. बालरोग आरोग्य, पंचकर्म, त्वचाविकार आणि सामान्य आरोग्य सल्ल्यासाठी भेटा",
    subheadingPost: " यांना.",
    bookBtn: "अपॉइंटमेंट बुक करा",
    methodBtn: "सल्ला प्रक्रिया कशी असते",
    miniStats: [
      { k: "BAMS · MD", v: "आयुर्वेदिक पात्रता" },
      { k: "सर्व वयोगट", v: "मुलं, प्रौढ व ज्येष्ठ" },
      { k: "ऑनलाइन", v: "व्हिडिओ सल्ला उपलब्ध" },
    ],
    quote: "आयुष्याच्या प्रत्येक टप्प्यासाठी वैयक्तिक आयुर्वेदिक आरोग्य सेवा.",
    credApproachTitle: "वैयक्तिक तपासणी",
    credApproachSub: "प्रकृती, पचन, झोप आणि दिनचर्या",
    credTherapiesTitle: "पंचकर्म व चिकित्सा",
    credTherapiesSub: "तपासणीनंतर योग्य असल्यासच",
  },
  home: {
    concernsEyebrow: "योग्य काळजी निवडा",
    concernsTitle: "तुम्हाला कोणत्या आरोग्य समस्येसाठी मदत हवी आहे?",
    concernsDesc:
      "सामान्य विकार, आयुर्वेदिक दृष्टिकोन आणि डॉ. प्रियंका लिखार यांच्या सल्ल्याबद्दल जाणून घेण्यासाठी श्रेणी निवडा. मुलं, प्रौढ आणि ज्येष्ठ नागरिकांसाठी वैयक्तिक काळजी.",
    concernsExplorePrefix: "पहा:",
    concernsViewAll: "सर्व आरोग्य श्रेणी पहा →",
    concernCards: {
      "childrens-health": {
        title: "मुलांचे आरोग्य",
        desc: "वाढ, भूक, रोगप्रतिकारक शक्ती, झोप, त्वचा, वाणी व लक्ष संबंधी समस्या — बालरोग तज्ञतेसह.",
      },
      "skin-hair-conditions": {
        title: "त्वचा आणि केस",
        desc: "सोरायसिस, एक्झिमा, पुरळ, केस गळणे व कोंडा यांची वैयक्तिक तपासणी.",
      },
      "digestive-disorders": {
        title: "पचन आरोग्य",
        desc: "आम्लपित्त, बद्धकोष्ठता, गॅस-पोट फुगणे, मूळव्याध व भूक न लागणे.",
      },
      "womens-health": {
        title: "महिला आरोग्य",
        desc: "PCOS, अनियमित पाळी, रजोनिवृत्ती आणि प्रसूतीनंतरची काळजी.",
      },
      "mens-health": {
        title: "पुरुष आरोग्य",
        desc: "ताण, झोप, केस गळणे, पचन व लघवीच्या तक्रारी — गोपनीय सल्ला.",
      },
      "joint-bone-disorders": {
        title: "सांधे व ज्येष्ठ आरोग्य",
        desc: "गुडघे व कंबरदुखी, सांधे जखडणे, हाडांचे आरोग्य व निरोगी वार्धक्य.",
      },
    },
    guidesEyebrow: "आरोग्य मार्गदर्शिका",
    guidesTitle: "लोकप्रिय आरोग्य मार्गदर्शिका",
    readGuide: "मार्गदर्शिका वाचा",
    treatEyebrow: "उपचार पद्धती",
    treatTitle: "पंचकर्म आणि आयुर्वेदिक उपचार",
    treatDesc:
      "शास्त्रीय चिकित्सा केवळ वैयक्तिक तपासणीनंतरच सुचवली जाते. प्रत्येक उपचार प्रत्येक व्यक्तीसाठी योग्य नसतो — गर्भधारणा, तीव्र आजार किंवा काही वैद्यकीय स्थितींत काळजी आवश्यक असते.",
    treatExploreAll: "सर्व उपचार पहा →",
    treatmentCards: {
      panchakarma: {
        title: "पंचकर्म",
        desc: "शास्त्रीय शोधन चिकित्सा — वैयक्तिक तपासणीनंतर योग्य असल्यासच.",
      },
      abhyanga: {
        title: "अभ्यंग",
        desc: "विश्रांती, सांध्यांची सहजता व त्वचा काळजीसाठी औषधी तेल मालीश.",
      },
      shirodhara: {
        title: "शिरोधारा",
        desc: "ताण व झोपेसाठी पारंपरिकरीत्या कपाळावर कोमट तेलाची संथ धार.",
      },
      "basti-therapy": {
        title: "बस्ती चिकित्सा",
        desc: "विशिष्ट वात-संबंधित आतडे व सांध्यांच्या तक्रारींसाठी पारंपरिक पंचकर्म उपचार.",
      },
      nasya: {
        title: "नस्य",
        desc: "डोके, सायनस व आवाजाच्या समस्यांसाठी औषधी नासिका चिकित्सा.",
      },
      rasayana: {
        title: "रसायन",
        desc: "निरोगी वार्धक्य व पुनर्प्राप्तीसाठी पोषण आणि पुनरुज्जीवन योजना.",
      },
      "customized-suvarnaprashan": {
        title: "कस्टमाइझ्ड सुवर्णप्राशन",
        desc: "वय व आरोग्यानुसार वैयक्तिक पारंपरिक सुवर्ण-औषधी संस्कार.",
      },
      "ayurvedic-diet-lifestyle": {
        title: "आहार आणि जीवनशैली",
        desc: "व्यावहारिक, वैयक्तिक आयुर्वेदिक आहार व दैनंदिन दिनचर्या मार्गदर्शन.",
      },
    },
    stepsEyebrow: "सल्ला प्रक्रिया",
    stepsTitle: "आयुर्वेदिक सल्ला कसा चालतो",
    steps: [
      {
        title: "तुमची समस्या सांगा",
        desc: "तुमची लक्षणं, इतिहास, औषधं आणि रिपोर्ट्स सांगा. मुलं, प्रौढ आणि ज्येष्ठ नागरिक सर्वांचे स्वागत आहे.",
      },
      {
        title: "वैयक्तिक तपासणी",
        desc: "डॉ. प्रियंका लिखार वैद्यकीय इतिहासासह पचन, झोप, आहार, दिनचर्या आणि प्रकृतीचे मूल्यांकन करतात.",
      },
      {
        title: "स्पष्ट लेखी योजना",
        desc: "तुम्हाला आहार, जीवनशैली व योग्य आयुर्वेदिक उपायांची लेखी योजना मिळते, तसेच कोणत्या लक्षणांकडे लक्ष द्यावे हे सांगितले जाते.",
      },
      {
        title: "फॉलो-अप आणि आढावा",
        desc: "पुढील भेटीत प्रगतीचा आढावा घेतला जातो, योजना सुधारली जाते व आवश्यक तिथे आधुनिक उपचारांशी समन्वय ठेवला जातो.",
      },
    ],
    whyEyebrow: "रुग्ण आम्हाला का निवडतात",
    whyTitle: "इंदूरमध्ये AyurvedDoctor का निवडावे",
    whyPoints: [
      {
        title: "बालरोग तज्ञ प्रशिक्षण",
        desc: "BAMS सह कौमारभृत्य (आयुर्वेदिक बालरोग) मध्ये MD — मुलांची काळजी ही क्लिनिकची प्रमुख ताकद आहे.",
      },
      {
        title: "प्रत्येक वयोगटासाठी काळजी",
        desc: "मुलं, प्रौढ, महिला, पुरुष व ज्येष्ठ नागरिकांसाठी व्यक्तीनुसार स्वतंत्र योजना.",
      },
      {
        title: "मर्यादांबाबत प्रामाणिकपणा",
        desc: "आयुर्वेद काय करू शकतो आणि काय नाही, तसेच तज्ञ किंवा आपत्कालीन सेवा कधी आवश्यक आहे याचा स्पष्ट सल्ला.",
      },
      {
        title: "निवांत व सखोल तपासणी",
        desc: "सर्वांना एकच औषध देण्याऐवजी इतिहास, प्रकृती, पचन, झोप व दिनचर्या समजून घेण्यास पुरेसा वेळ.",
      },
      {
        title: "तुमच्या डॉक्टरांशी समन्वय",
        desc: "आम्ही चालू औषधं बंद करण्यास सांगत नाही. कोणताही बदल तुमच्या डॉक्टरांच्या सल्ल्यानेच केला जातो.",
      },
      {
        title: "क्लिनिकमध्ये किंवा ऑनलाइन",
        desc: "इंदूर क्लिनिकमध्ये प्रत्यक्ष भेट आणि भारत व परदेशातील कुटुंबांसाठी व्हिडिओ सल्ला.",
      },
    ],
    articlesEyebrow: "आरोग्य शिक्षण",
    articlesTitle: "आरोग्य लेख",
    minRead: "मिनिटे वाचन",
    browseArticles: "सर्व लेख वाचा →",
    faqEyebrow: "प्रश्नोत्तरे",
    faqTitle: "नेहमी विचारले जाणारे प्रश्न",
    faqs: [
      {
        q: "तुम्ही मुलांप्रमाणेच प्रौढ आणि ज्येष्ठ नागरिकांनाही सल्ला देता का?",
        a: "होय. डॉ. प्रियंका लिखार यांनी आयुर्वेदिक बालरोगशास्त्रात (MD कौमारभृत्य) पदव्युत्तर शिक्षण घेतले असून त्या प्रौढ आणि ज्येष्ठ नागरिकांनाही सामान्य आरोग्य, त्वचा, पचन, महिला, पुरुष व सांध्यांच्या तक्रारींसाठी सल्ला देतात.",
      },
      {
        q: "माझ्या सध्याच्या औषधांसोबत आयुर्वेद सुरक्षित आहे का?",
        a: "हे सर्व औषधांची तपासणी केल्यानंतरच ठरवता येते. तुम्ही घेत असलेली प्रत्येक औषधं, सप्लिमेंट्स व वनौषधी क्लिनिकला सांगा. आयुर्वेदिक योजनेमुळे डॉक्टरांनी दिलेली औषधं स्वतःहून कधीच बंद करू नका.",
      },
      {
        q: "आयुर्वेद माझा आजार कायमचा बरा करू शकतो का?",
        a: "कोणत्याही आजारासाठी कायमस्वरूपी बरे होण्याची प्रामाणिक हमी देता येत नाही. उद्देश समस्या समजून घेणे, आराम व दैनंदिन कार्यक्षमतेला साथ देणे आणि वास्तववादी अपेक्षांसह उपचार योजना आखणे हा आहे.",
      },
      {
        q: "पहिल्या भेटीत काय आणायचे?",
        a: "जुनी प्रिस्क्रिप्शन्स व रिपोर्ट्स, चालू औषधांची यादी, आणि मुलांसाठी उपलब्ध असल्यास वाढीचा तक्ता व लसीकरण कार्ड.",
      },
      {
        q: "ऑनलाइन सल्ला उपलब्ध आहे का?",
        a: "होय. भारत व परदेशातील कुटुंबांसाठी व्हिडिओ सल्ला उपलब्ध आहे. काही स्थितींत प्रत्यक्ष तपासणी आवश्यक असते, आणि तसे असल्यास डॉक्टर स्पष्ट सांगतात.",
      },
      {
        q: "आपत्कालीन स्थितीत सल्ला पुरेसा आहे का?",
        a: "नाही. छातीत दुखणे, श्वास घेण्यास त्रास, जास्त रक्तस्राव, अचानक अशक्तपणा, झटके किंवा कोणत्याही आपत्कालीन स्थितीत त्वरित जवळच्या आपत्कालीन रुग्णालयात जा.",
      },
    ],
    clinicEyebrow: "क्लिनिकला भेट द्या",
    clinicTitle: "इंदूरमधील क्लिनिकचा पत्ता आणि वेळा",
    clinicName: "बालचिकित्सा आयुर्वेद क्लिनिक",
    clinicAddress: "संचार नगर एक्सटेंशन, कनाडिया रोड, इंदूर, मध्य प्रदेश 452016",
    clinicHours: "सोम–शनि • सकाळी 10–दुपारी 2 व संध्या. 5–रात्री 8 IST",
    getDirections: "दिशा-निर्देश पहा",
    whatsappEnquiry: "WhatsApp चौकशी",
    bookAppointment: "अपॉइंटमेंट बुक करा",
    mapTitle: "बालचिकित्सा आयुर्वेद क्लिनिक, संचार नगर एक्सटेंशन, कनाडिया रोड, इंदूर यांचा नकाशा",
    waMsg: "नमस्ते डॉ. प्रियंका, मला आयुर्वेदिक सल्ला बुक करायचा आहे.",
  },
  conversion: {
    ctaAria: "आयुर्वेदिक सल्ला बुक करा",
    ctaTitle: "तुमच्या आरोग्य समस्यांकडे दुर्लक्ष करू नका. वैयक्तिक तपासणी करून घ्या.",
    ctaBody:
      "तुमच्या आरोग्य तक्रारींवर चर्चा करण्यासाठी आणि योग्य उपचार पर्याय जाणून घेण्यासाठी इंदूरच्या बालचिकित्सा आयुर्वेद क्लिनिकमध्ये डॉ. प्रियंका लिखार यांचा सल्ला घ्या.",
    ctaBook: "अपॉइंटमेंट बुक करा",
    ctaCallPrefix: "क्लिनिकला कॉल करा",
    ctaWhatsapp: "WhatsApp चौकशी",
    ctaDirections: "दिशा-निर्देश पहा",
    ctaWaMsg: "नमस्ते डॉ. प्रियंका, मला आयुर्वेदिक सल्ल्याबद्दल माहिती हवी आहे.",
    doctorHelpEyebrow: "तुमच्या सल्ल्याबद्दल",
    doctorHelpTitle: "आयुर्वेदिक सल्ला शोधत आहात का?",
    doctorHelpBody:
      "प्रत्येक व्यक्तीमध्ये आरोग्य समस्या वेगळ्या प्रकारे जाणवतात. डॉ. प्रियंका लिखार स्थिती समजून घेण्यासाठी व योग्य उपचार पर्यायांवर चर्चा करण्यासाठी रुग्णाची लक्षणं, इतिहास, जीवनशैली आणि प्रकृती यांचे मूल्यांकन करतात.",
    doctorHelpCreds: [
      "BAMS — डॉ. वंदनाताई जे. ढोणे ग्रामीण आयुर्वेद कॉलेज, पातूर",
      "MD (कौमारभृत्य / बालरोगशास्त्र) — इन्स्टिट्यूट ऑफ टीचिंग अँड रिसर्च इन आयुर्वेद (ITRA)",
      "नोंदणी क्रमांक: 63934",
      "वैद्यकीय क्षेत्रे: आयुर्वेदिक बालरोग, पंचकर्म, त्वचाविकार आणि सामान्य आरोग्य",
    ],
    doctorHelpNote:
      "सल्ला हा तपासणी व मार्गदर्शनासाठी आहे, आपत्कालीन सेवा नाही. या पानावर दिलेले कोणतेही धोक्याचे लक्षण आढळल्यास आधी तातडीची वैद्यकीय मदत घ्या.",
    doctorHelpLink: "डॉ. प्रियंका लिखार यांची माहिती वाचा",
    tocAria: "या पानावर",
    tocTitle: "या पानावर",
    tocLabels: {
      whatIs: "हे काय आहे?",
      signs: "लक्षणं",
      causes: "कारणे आणि सहाय्यक घटक",
      assess: "तपासणी कधी करावी",
      ayurveda: "आयुर्वेदिक दृष्टिकोन",
      management: "आयुर्वेदाचा उपचार दृष्टिकोन",
      redFlags: "धोक्याची लक्षणं",
      faq: "नेहमी विचारले जाणारे प्रश्न",
    },
    draftStrong: "डॉक्टरांच्या तपासणीसाठी मसुदा (ड्राफ्ट).",
    draftBody:
      "ही मार्गदर्शिका अद्याप डॉ. प्रियंका लिखार यांनी मंजूर केलेली नाही. ती सर्च इंजिनमध्ये इंडेक्स केलेली नाही आणि पुनरावलोकन पूर्ण होईपर्यंत तिचा वैद्यकीय सल्ला म्हणून वापर करू नका.",
    pendingReview: "वैद्यकीय पुनरावलोकन प्रलंबित",
    condIntroCtaTitle: "ही तुमच्या तक्रारीसारखीच समस्या वाटते का?",
    condIntroCtaBody:
      "तुमची लक्षणं आणि इतिहास सांगा. डॉ. प्रियंका लिखार काय कारण असू शकते, आधी काय तपासावे आणि आयुर्वेदिक सल्ला योग्य ठरेल का यावर चर्चा करतील.",
    condMidCtaTitle: "तुमच्या समस्येबद्दल डॉक्टरांशी बोलायचे आहे का?",
    condMidCtaBody:
      "तुमचा इतिहास, औषधं आणि उद्दिष्टांवर चर्चा करण्यासाठी सल्ला बुक करा. आयुर्वेदिक काळजी तुमच्यासाठी योग्य आहे की नाही हे क्लिनिक प्रामाणिकपणे सांगेल.",
  },
  categories: {
    homeCrumb: "मुखपृष्ठ",
    hubCrumb: "आरोग्य समस्या",
    hubEyebrow: "आरोग्य समस्या",
    hubH1: "तुम्हाला कोणत्या आरोग्य समस्येसाठी मदत हवी आहे?",
    hubIntro:
      "प्रत्येक क्षेत्रातील सामान्य विकार, आयुर्वेदिक दृष्टिकोन आणि इंदूर क्लिनिकमध्ये डॉ. प्रियंका लिखार यांच्या सल्ल्याबद्दल वाचा. मुलं, प्रौढ आणि ज्येष्ठ नागरिकांसाठी वैयक्तिक काळजी.",
    hubSrHeading: "आरोग्य समस्यांच्या श्रेणी",
    hubSeoTitle: "आरोग्य समस्या | इंदूरमध्ये सर्व वयोगटांसाठी आयुर्वेदिक काळजी",
    readCategoryGuide: "मार्गदर्शिका वाचा",
    catEyebrow: "आरोग्य श्रेणी",
    catH1Suffix: ": वैयक्तिक आयुर्वेदिक काळजी",
    catMeta: "डॉ. प्रियंका लिखार • BAMS, MD (कौमारभृत्य) • इंदूर क्लिनिक व ऑनलाइन",
    understandingTitle: (title) => `${title} समजून घ्या`,
    approachTitle: "आयुर्वेदिक दृष्टिकोन",
    concernsTitle: "आम्ही चर्चा करत असलेल्या सामान्य समस्या",
    guidesTitle: "विकार मार्गदर्शिका",
    treatmentsTitle: "संबंधित उपचार",
    faqTitle: "नेहमी विचारले जाणारे प्रश्न",
    otherTitle: "इतर आरोग्य समस्या पहा",
    compactCtaTitle: "कोणती श्रेणी तुमच्यासाठी योग्य आहे ते समजत नाही का?",
    compactCtaBody:
      "तुमची लक्षणं आणि इतिहास सांगा. आयुर्वेदिक सल्ला मदत करू शकतो का आणि आधी काय तपासले पाहिजे हे डॉ. प्रियंका लिखार प्रामाणिकपणे सांगतील.",
  },
  nav: {
    browseAllConditions: "सर्व विकार पहा (A–Z) →",
    healthConcernsLink: "आरोग्य समस्या (सर्व वयोगट)",
  },
  form: {
    contactName: "तुमचे नाव / संपर्क व्यक्ती *",
    contactNamePh: "उदा. स्नेहा कुलकर्णी",
    patientSection: "रुग्णाचा तपशील",
    patientName: "रुग्णाचे नाव *",
    patientNamePh: "उदा. रमेश किंवा सुनीता",
    patientAgePh: "उदा. 4 वर्षे किंवा 45 वर्षे",
    genderSelect: "निवडा",
    genderFemale: "स्त्री",
    genderMale: "पुरुष",
    genderGirl: "मुलगी (लहान)",
    genderBoy: "मुलगा (लहान)",
    genderPreferNot: "सांगायचे नाही",
    symptomsLabel: "थोडक्यात आरोग्य समस्या",
    symptomsHint: "(ऐच्छिक — सविस्तर वैद्यकीय नोंदी येथे लिहू नका)",
    symptomsPh: "उदा. 2 महिन्यांपासून जेवणानंतर आम्लपित्त, किंवा मुलाला वारंवार सर्दी…",
    consentText:
      "मी सहमत आहे की बालचिकित्सा आयुर्वेद क्लिनिक या चौकशीबाबत माझ्याशी संपर्क साधू शकते. हा फॉर्म भरल्याने अपॉइंटमेंट आपोआप निश्चित होत नाही.",
    privacyPre: "तुमची माहिती फक्त या चौकशीला उत्तर देण्यासाठी वापरली जाते. आमचे",
    privacyLink: "गोपनीयता धोरण",
    privacyPost: " वाचा.",
    consentError: "तुमची चौकशी पुढे पाठवण्यासाठी कृपया संमती बॉक्सवर टिक करा.",
    contactNameError: "कृपया तुमचे नाव लिहा.",
    patientNameError: "कृपया रुग्णाचे नाव लिहा.",
    patientAgeError: "कृपया रुग्णाचे वय लिहा.",
    nonConfirmNote: "ही केवळ चौकशी आहे, निश्चित झालेली अपॉइंटमेंट नाही. वेळ निश्चित करण्यासाठी क्लिनिक तुमच्याशी संपर्क साधेल.",
  },
};

const gu: ExpansionDict = {
  hero: {
    line1: "જીવનના દરેક તબક્કા માટે",
    line2Pre: "વ્યક્તિગત આયુર્વેદિક",
    highlight: "આરોગ્ય સંભાળ",
    line3: "દરેક ઉંમર માટે",
    subheadingPre:
      "બાળકો, પુખ્ત વયના લોકો અને પરિવારો માટે વ્યક્તિગત આયુર્વેદિક સંભાળ. બાળ આરોગ્ય, પંચકર્મ, ત્વચા રોગો અને સામાન્ય આરોગ્ય પરામર્શ માટે મળો",
    subheadingPost: " ને.",
    bookBtn: "એપોઇન્ટમેન્ટ બુક કરો",
    methodBtn: "પરામર્શ કેવી રીતે થાય છે",
    miniStats: [
      { k: "BAMS · MD", v: "આયુર્વેદિક લાયકાત" },
      { k: "દરેક ઉંમર", v: "બાળકો, પુખ્ત અને વડીલો" },
      { k: "ઓનલાઇન", v: "વીડિયો પરામર્શ ઉપલબ્ધ" },
    ],
    quote: "જીવનના દરેક તબક્કા માટે વ્યક્તિગત આયુર્વેદિક આરોગ્ય સંભાળ.",
    credApproachTitle: "વ્યક્તિગત મૂલ્યાંકન",
    credApproachSub: "પ્રકૃતિ, પાચન, ઊંઘ અને દિનચર્યા",
    credTherapiesTitle: "પંચકર્મ અને ચિકિત્સા",
    credTherapiesSub: "મૂલ્યાંકન પછી યોગ્ય હોય તો જ",
  },
  home: {
    concernsEyebrow: "યોગ્ય સંભાળ પસંદ કરો",
    concernsTitle: "તમે કઈ આરોગ્ય સમસ્યા માટે મદદ શોધી રહ્યા છો?",
    concernsDesc:
      "સામાન્ય સ્થિતિઓ, આયુર્વેદિક અભિગમ અને ડૉ. પ્રિયંકા લિખાર સાથે પરામર્શ વિશે જાણવા કોઈ શ્રેણી પસંદ કરો. બાળકો, પુખ્ત અને વરિષ્ઠ નાગરિકો માટે વ્યક્તિગત સંભાળ.",
    concernsExplorePrefix: "જુઓ:",
    concernsViewAll: "તમામ આરોગ્ય શ્રેણીઓ જુઓ →",
    concernCards: {
      "childrens-health": {
        title: "બાળકોનું આરોગ્ય",
        desc: "વૃદ્ધિ, ભૂખ, રોગપ્રતિકારક શક્તિ, ઊંઘ, ત્વચા, વાણી અને ધ્યાન સંબંધિત સમસ્યાઓ — બાળરોગ નિષ્ણાતતા સાથે.",
      },
      "skin-hair-conditions": {
        title: "ત્વચા અને વાળ",
        desc: "સોરાયસિસ, એક્ઝિમા, ફોલ્લીઓ, વાળ ખરવા અને ખોડોનું વ્યક્તિગત મૂલ્યાંકન.",
      },
      "digestive-disorders": {
        title: "પાચન આરોગ્ય",
        desc: "એસિડિટી, કબજિયાત, ગેસ-પેટ ફૂલવું, હરસ અને ભૂખની સમસ્યાઓ.",
      },
      "womens-health": {
        title: "મહિલા આરોગ્ય",
        desc: "PCOS, અનિયમિત માસિક, મેનોપોઝ અને પ્રસૂતિ પછીની સંભાળ.",
      },
      "mens-health": {
        title: "પુરુષ આરોગ્ય",
        desc: "તણાવ, ઊંઘ, વાળ ખરવા, પાચન અને પેશાબની તકલીફો — ગોપનીય પરામર્શ.",
      },
      "joint-bone-disorders": {
        title: "સાંધા અને વડીલ આરોગ્ય",
        desc: "ઘૂંટણ અને કમરનો દુખાવો, જકડાઈ જવું, હાડકાંનું આરોગ્ય અને સ્વસ્થ વૃદ્ધાવસ્થા.",
      },
    },
    guidesEyebrow: "આરોગ્ય માર્ગદર્શિકાઓ",
    guidesTitle: "લોકપ્રિય આરોગ્ય માર્ગદર્શિકાઓ",
    readGuide: "માર્ગદર્શિકા વાંચો",
    treatEyebrow: "ચિકિત્સાઓ",
    treatTitle: "પંચકર્મ અને આયુર્વેદિક ઉપચાર",
    treatDesc:
      "શાસ્ત્રીય ચિકિત્સાઓ માત્ર વ્યક્તિગત મૂલ્યાંકન પછી જ સૂચવવામાં આવે છે. દરેક ચિકિત્સા દરેક વ્યક્તિ માટે યોગ્ય નથી — ગર્ભાવસ્થા, તીવ્ર બીમારી અથવા અમુક તબીબી સ્થિતિઓમાં સાવધાની જરૂરી છે.",
    treatExploreAll: "તમામ ઉપચાર જુઓ →",
    treatmentCards: {
      panchakarma: {
        title: "પંચકર્મ",
        desc: "શાસ્ત્રીય શુદ્ધિકરણ ચિકિત્સાઓ — વ્યક્તિગત મૂલ્યાંકન પછી યોગ્ય હોય તો જ.",
      },
      abhyanga: {
        title: "અભ્યંગ",
        desc: "આરામ, સાંધાની સરળતા અને ત્વચાની સંભાળ માટે ઔષધીય તેલ માલિશ.",
      },
      shirodhara: {
        title: "શિરોધારા",
        desc: "તણાવ અને ઊંઘ માટે પરંપરાગત રીતે કપાળ પર હૂંફાળા તેલની સૌમ્ય ધારા.",
      },
      "basti-therapy": {
        title: "બસ્તિ ચિકિત્સા",
        desc: "ખાસ વાત-સંબંધિત આંતરડા અને સાંધાની સ્થિતિઓ માટે પરંપરાગત પંચકર્મ ચિકિત્સા.",
      },
      nasya: {
        title: "નસ્ય",
        desc: "માથું, સાઇનસ અને અવાજની સમસ્યાઓ માટે ઔષધીય નાસિકા ચિકિત્સા.",
      },
      rasayana: {
        title: "રસાયણ",
        desc: "સ્વસ્થ વૃદ્ધાવસ્થા અને પુનઃપ્રાપ્તિ માટે પોષણ અને કાયાકલ્પ યોજનાઓ.",
      },
      "customized-suvarnaprashan": {
        title: "કસ્ટમાઇઝ્ડ સુવર્ણપ્રાશન",
        desc: "ઉંમર અને આરોગ્ય મુજબ વ્યક્તિગત પરંપરાગત સુવર્ણ-ઔષધિ સંસ્કાર.",
      },
      "ayurvedic-diet-lifestyle": {
        title: "આહાર અને જીવનશૈલી",
        desc: "વ્યાવહારિક, વ્યક્તિગત આયુર્વેદિક આહાર અને દૈનિક દિનચર્યા માર્ગદર્શન.",
      },
    },
    stepsEyebrow: "પરામર્શ પ્રક્રિયા",
    stepsTitle: "આયુર્વેદિક પરામર્શ કેવી રીતે કાર્ય કરે છે",
    steps: [
      {
        title: "તમારી સમસ્યા જણાવો",
        desc: "તમારાં લક્ષણો, ઇતિહાસ, દવાઓ અને રિપોર્ટ્સ જણાવો. બાળકો, પુખ્ત અને વરિષ્ઠ નાગરિકો સૌનું સ્વાગત છે.",
      },
      {
        title: "વ્યક્તિગત મૂલ્યાંકન",
        desc: "ડૉ. પ્રિયંકા લિખાર તમારા તબીબી ઇતિહાસ સાથે પાચન, ઊંઘ, આહાર, દિનચર્યા અને પ્રકૃતિની સમીક્ષા કરે છે.",
      },
      {
        title: "સ્પષ્ટ લેખિત યોજના",
        desc: "તમને આહાર, જીવનશૈલી અને યોગ્ય આયુર્વેદિક ઉપાયોની લેખિત યોજના મળે છે, તેમજ શેનું ધ્યાન રાખવું તેની સ્પષ્ટ સમજણ.",
      },
      {
        title: "ફોલો-અપ અને સમીક્ષા",
        desc: "ફોલો-અપ મુલાકાતોમાં પ્રગતિની સમીક્ષા થાય છે, યોજનામાં જરૂરી ફેરફાર થાય છે અને જરૂર મુજબ તબીબી સંકલન જાળવવામાં આવે છે.",
      },
    ],
    whyEyebrow: "દર્દીઓ અમને શા માટે પસંદ કરે છે",
    whyTitle: "ઇન્દોરમાં AyurvedDoctor શા માટે પસંદ કરવું",
    whyPoints: [
      {
        title: "બાળરોગ નિષ્ણાત તાલીમ",
        desc: "BAMS સાથે કૌમારભૃત્ય (આયુર્વેદિક બાળ ચિકિત્સા)માં MD — બાળકોની સંભાળ ક્લિનિકની મુખ્ય વિશેષતા છે.",
      },
      {
        title: "દરેક ઉંમર માટે સંભાળ",
        desc: "બાળકો, પુખ્ત, મહિલાઓ, પુરુષો અને વરિષ્ઠ નાગરિકો માટે દરેક વ્યક્તિ મુજબ યોજના.",
      },
      {
        title: "મર્યાદાઓ અંગે પ્રામાણિકતા",
        desc: "આયુર્વેદ શું આપી શકે અને શું નહીં, તથા ક્યારે નિષ્ણાત કે કટોકટી સારવાર જરૂરી છે તેની સ્પષ્ટ સલાહ.",
      },
      {
        title: "ઉતાવળ વિનાનું મૂલ્યાંકન",
        desc: "બધાને એકસરખી દવા આપવાને બદલે ઇતિહાસ, પ્રકૃતિ, પાચન, ઊંઘ અને દિનચર્યા સમજવા પૂરતો સમય.",
      },
      {
        title: "તમારા ડૉક્ટરો સાથે સંકલન",
        desc: "અમે તમારી ચાલુ દવાઓ બંધ કરવા કહેતા નથી. કોઈપણ ફેરફાર તમારા ડૉક્ટરના સંકલનમાં જ કરવામાં આવે છે.",
      },
      {
        title: "ક્લિનિકમાં અથવા ઓનલાઇન",
        desc: "ઇન્દોર ક્લિનિકમાં પ્રત્યક્ષ મુલાકાત અને ભારત તથા વિદેશના પરિવારો માટે વીડિયો પરામર્શ.",
      },
    ],
    articlesEyebrow: "આરોગ્ય શિક્ષણ",
    articlesTitle: "આરોગ્ય લેખો",
    minRead: "મિનિટ વાંચન",
    browseArticles: "તમામ લેખો વાંચો →",
    faqEyebrow: "પ્રશ્નો",
    faqTitle: "વારંવાર પૂછાતા પ્રશ્નો",
    faqs: [
      {
        q: "શું તમે બાળકો ઉપરાંત પુખ્ત અને વરિષ્ઠ નાગરિકોનું પણ પરામર્શ કરો છો?",
        a: "હા. ડૉ. પ્રિયંકા લિખારે આયુર્વેદિક બાળ ચિકિત્સા (MD કૌમારભૃત્ય)માં અનુસ્નાતક તાલીમ લીધી છે અને તેઓ પુખ્ત તથા વરિષ્ઠ નાગરિકોને સામાન્ય આરોગ્ય, ત્વચા, પાચન, મહિલા, પુરુષ અને સાંધાની સમસ્યાઓ માટે પણ પરામર્શ આપે છે.",
      },
      {
        q: "શું મારી ચાલુ દવાઓ સાથે આયુર્વેદ સુરક્ષિત છે?",
        a: "તે સંપૂર્ણ દવા સમીક્ષા પછી જ નક્કી કરી શકાય છે. ક્લિનિકને તમારી દરેક દવા, સપ્લિમેન્ટ અને હર્બલ ઉત્પાદન વિશે જણાવો. આયુર્વેદિક યોજનાને કારણે ડૉક્ટર દ્વારા લખેલી દવાઓ ક્યારેય જાતે બંધ ન કરો.",
      },
      {
        q: "શું આયુર્વેદ મારો રોગ કાયમી મટાડી શકે છે?",
        a: "કોઈપણ રોગ માટે કાયમી ઉપચારની પ્રામાણિક ખાતરી આપી શકાતી નથી. હેતુ સમસ્યા સમજવાનો, આરામ અને દૈનિક કાર્યક્ષમતાને સહાય કરવાનો અને વાસ્તવિક અપેક્ષાઓ સાથે સારવાર યોજના બનાવવાનો છે.",
      },
      {
        q: "પહેલી મુલાકાતમાં મારે શું લાવવું જોઈએ?",
        a: "જૂનાં પ્રિસ્ક્રિપ્શન અને રિપોર્ટ્સ, ચાલુ દવાઓની યાદી, અને બાળકો માટે ઉપલબ્ધ હોય તો ગ્રોથ રેકોર્ડ અને રસીકરણ કાર્ડ.",
      },
      {
        q: "શું ઓનલાઇન પરામર્શ ઉપલબ્ધ છે?",
        a: "હા. ભારત અને વિદેશના પરિવારો માટે વીડિયો પરામર્શ ઉપલબ્ધ છે. કેટલીક સ્થિતિઓમાં પ્રત્યક્ષ તપાસ જરૂરી હોય છે, અને તેવું હોય તો ડૉક્ટર સ્પષ્ટ જણાવે છે.",
      },
      {
        q: "શું કટોકટીમાં પરામર્શ પૂરતું છે?",
        a: "ના. છાતીમાં દુખાવો, શ્વાસ લેવામાં તકલીફ, ભારે રક્તસ્રાવ, અચાનક નબળાઈ, ખેંચ અથવા કોઈપણ કટોકટીમાં તરત જ નજીકની ઇમરજન્સી હોસ્પિટલમાં જાઓ.",
      },
    ],
    clinicEyebrow: "ક્લિનિકની મુલાકાત લો",
    clinicTitle: "ઇન્દોરમાં ક્લિનિકનું સરનામું અને સમય",
    clinicName: "બાળચિકિત્સા આયુર્વેદ ક્લિનિક",
    clinicAddress: "સંચાર નગર એક્સ્ટેન્શન, કનાડિયા રોડ, ઇન્દોર, મધ્ય પ્રદેશ 452016",
    clinicHours: "સોમ–શનિ • સવારે 10–બપોરે 2 અને સાંજે 5–રાત્રે 8 IST",
    getDirections: "દિશા-નિર્દેશ જુઓ",
    whatsappEnquiry: "WhatsApp પૂછપરછ",
    bookAppointment: "એપોઇન્ટમેન્ટ બુક કરો",
    mapTitle: "બાળચિકિત્સા આયુર્વેદ ક્લિનિક, સંચાર નગર એક્સ્ટેન્શન, કનાડિયા રોડ, ઇન્દોરનો નકશો",
    waMsg: "નમસ્તે ડૉ. પ્રિયંકા, હું આયુર્વેદિક પરામર્શ બુક કરવા માંગું છું.",
  },
  conversion: {
    ctaAria: "આયુર્વેદિક પરામર્શ બુક કરો",
    ctaTitle: "તમારી આરોગ્ય સમસ્યાઓને અવગણશો નહીં. વ્યક્તિગત મૂલ્યાંકન કરાવો.",
    ctaBody:
      "તમારી આરોગ્ય સમસ્યાઓની ચર્ચા કરવા અને યોગ્ય ઉપચાર વિકલ્પો જાણવા માટે ઇન્દોરના બાળચિકિત્સા આયુર્વેદ ક્લિનિકમાં ડૉ. પ્રિયંકા લિખાર સાથે પરામર્શ કરો.",
    ctaBook: "એપોઇન્ટમેન્ટ બુક કરો",
    ctaCallPrefix: "ક્લિનિક કૉલ કરો",
    ctaWhatsapp: "WhatsApp પૂછપરછ",
    ctaDirections: "દિશા-નિર્દેશ જુઓ",
    ctaWaMsg: "નમસ્તે ડૉ. પ્રિયંકા, હું આયુર્વેદિક પરામર્શ વિશે માહિતી મેળવવા માંગું છું.",
    doctorHelpEyebrow: "તમારા પરામર્શ વિશે",
    doctorHelpTitle: "શું તમે આયુર્વેદિક પરામર્શ શોધી રહ્યા છો?",
    doctorHelpBody:
      "દરેક વ્યક્તિમાં આરોગ્ય સમસ્યાઓ અલગ રીતે દેખાય છે. ડૉ. પ્રિયંકા લિખાર સ્થિતિ સમજવા અને યોગ્ય સારવાર વિકલ્પોની ચર્ચા કરવા માટે દર્દીનાં લક્ષણો, આરોગ્ય ઇતિહાસ, જીવનશૈલી અને વ્યક્તિગત પ્રકૃતિનું મૂલ્યાંકન કરે છે.",
    doctorHelpCreds: [
      "BAMS — ડૉ. વંદનાતાઈ જે. ઢોણે ગ્રામીણ આયુર્વેદ કૉલેજ, પાતૂર",
      "MD (કૌમારભૃત્ય / બાળ ચિકિત્સા) — ઇન્સ્ટિટ્યૂટ ઑફ ટીચિંગ એન્ડ રિસર્ચ ઇન આયુર્વેદ (ITRA)",
      "નોંધણી નંબર: 63934",
      "તબીબી ક્ષેત્રો: આયુર્વેદિક બાળ ચિકિત્સા, પંચકર્મ, ત્વચા રોગો અને સામાન્ય આરોગ્ય",
    ],
    doctorHelpNote:
      "પરામર્શ એ મૂલ્યાંકન અને ચર્ચા માટે છે, કટોકટી સેવા નથી. જો આ પૃષ્ઠ પર જણાવેલ કોઈપણ ચેતવણીનું લક્ષણ હોય, તો પહેલાં તાત્કાલિક તબીબી મદદ લો.",
    doctorHelpLink: "ડૉ. પ્રિયંકા લિખારની પ્રોફાઇલ વાંચો",
    tocAria: "આ પૃષ્ઠ પર",
    tocTitle: "આ પૃષ્ઠ પર",
    tocLabels: {
      whatIs: "આ શું છે?",
      signs: "લક્ષણો",
      causes: "કારણો અને સહાયક પરિબળો",
      assess: "તપાસ ક્યારે કરાવવી",
      ayurveda: "આયુર્વેદિક દ્રષ્ટિકોણ",
      management: "આયુર્વેદનો ઉપચાર અભિગમ",
      redFlags: "ચેતવણીનાં લક્ષણો",
      faq: "વારંવાર પૂછાતા પ્રશ્નો",
    },
    draftStrong: "તબીબી સમીક્ષા માટેનો મુસદ્દો (ડ્રાફ્ટ).",
    draftBody:
      "આ માર્ગદર્શિકાને હજુ ડૉ. પ્રિયંકા લિખાર દ્વારા મંજૂરી મળી નથી. તે સર્ચ એન્જિનમાં ઇન્ડેક્સ નથી અને સમીક્ષા પૂર્ણ ન થાય ત્યાં સુધી તેને તબીબી સલાહ તરીકે ન ગણવી.",
    pendingReview: "તબીબી સમીક્ષા બાકી",
    condIntroCtaTitle: "શું આ તમારી સમસ્યા જેવું લાગે છે?",
    condIntroCtaBody:
      "તમારાં લક્ષણો અને ઇતિહાસ જણાવો. ડૉ. પ્રિયંકા લિખાર ચર્ચા કરશે કે શું કારણ હોઈ શકે, પહેલાં શું તપાસવું જરૂરી છે અને શું આયુર્વેદિક પરામર્શ યોગ્ય રહેશે.",
    condMidCtaTitle: "શું તમે ડૉક્ટર સાથે તમારી સમસ્યા વિશે વાત કરવા માંગો છો?",
    condMidCtaBody:
      "તમારા ઇતિહાસ, દવાઓ અને લક્ષ્યોની ચર્ચા કરવા માટે પરામર્શ બુક કરો. ક્લિનિક તમને પ્રામાણિકપણે જણાવશે કે આયુર્વેદિક સંભાળ તમારા માટે યોગ્ય છે કે નહીં.",
  },
  categories: {
    homeCrumb: "મુખ્ય પૃષ્ઠ",
    hubCrumb: "આરોગ્ય સમસ્યાઓ",
    hubEyebrow: "આરોગ્ય સમસ્યાઓ",
    hubH1: "તમે કઈ આરોગ્ય સમસ્યા માટે મદદ શોધી રહ્યા છો?",
    hubIntro:
      "દરેક ક્ષેત્રની સામાન્ય સ્થિતિઓ, આયુર્વેદિક અભિગમ અને ઇન્દોર ક્લિનિકમાં ડૉ. પ્રિયંકા લિખાર સાથે પરામર્શ કેવી રીતે મદદ કરી શકે તે વાંચો. બાળકો, પુખ્ત અને વરિષ્ઠ નાગરિકો માટે વ્યક્તિગત સંભાળ.",
    hubSrHeading: "આરોગ્ય સમસ્યાઓની શ્રેણીઓ",
    hubSeoTitle: "આરોગ્ય સમસ્યાઓ | ઇન્દોરમાં દરેક ઉંમર માટે આયુર્વેદિક સંભાળ",
    readCategoryGuide: "માર્ગદર્શિકા વાંચો",
    catEyebrow: "આરોગ્ય શ્રેણી",
    catH1Suffix: ": વ્યક્તિગત આયુર્વેદિક સંભાળ",
    catMeta: "ડૉ. પ્રિયંકા લિખાર • BAMS, MD (કૌમારભૃત્ય) • ઇન્દોર ક્લિનિક અને ઓનલાઇન",
    understandingTitle: (title) => `${title} વિશે સમજો`,
    approachTitle: "આયુર્વેદિક અભિગમ",
    concernsTitle: "અમે જે સામાન્ય સમસ્યાઓની ચર્ચા કરીએ છીએ",
    guidesTitle: "સ્થિતિ માર્ગદર્શિકાઓ",
    treatmentsTitle: "સંબંધિત ઉપચાર",
    faqTitle: "વારંવાર પૂછાતા પ્રશ્નો",
    otherTitle: "અન્ય આરોગ્ય સમસ્યાઓ જુઓ",
    compactCtaTitle: "ખાતરી નથી કે કઈ શ્રેણી તમારા માટે યોગ્ય છે?",
    compactCtaBody:
      "તમારાં લક્ષણો અને ઇતિહાસ જણાવો. ડૉ. પ્રિયંકા લિખાર પ્રામાણિકપણે જણાવશે કે શું આયુર્વેદિક પરામર્શ મદદ કરી શકે છે અને પહેલાં શું તપાસવું જોઈએ.",
  },
  nav: {
    browseAllConditions: "તમામ સ્થિતિઓ જુઓ (A–Z) →",
    healthConcernsLink: "આરોગ્ય સમસ્યાઓ (દરેક ઉંમર)",
  },
  form: {
    contactName: "તમારું નામ / સંપર્ક વ્યક્તિ *",
    contactNamePh: "દા.ત. સ્નેહા કુલકર્ણી",
    patientSection: "દર્દીની વિગતો",
    patientName: "દર્દીનું નામ *",
    patientNamePh: "દા.ત. રમેશ અથવા સુનીતા",
    patientAgePh: "દા.ત. 4 વર્ષ અથવા 45 વર્ષ",
    genderSelect: "પસંદ કરો",
    genderFemale: "સ્ત્રી",
    genderMale: "પુરુષ",
    genderGirl: "બાળકી (છોકરી)",
    genderBoy: "બાળક (છોકરો)",
    genderPreferNot: "જણાવવા માંગતા નથી",
    symptomsLabel: "ટૂંકમાં આરોગ્ય સમસ્યા",
    symptomsHint: "(વૈકલ્પિક — વિગતવાર તબીબી રેકોર્ડ અહીં ન લખો)",
    symptomsPh: "દા.ત. 2 મહિનાથી જમ્યા પછી એસિડિટી, અથવા બાળકને વારંવાર શરદી…",
    consentText:
      "હું સંમત છું કે બાળચિકિત્સા આયુર્વેદ ક્લિનિક આ પૂછપરછ અંગે મારો સંપર્ક કરી શકે છે. આ ફોર્મ ભરવાથી એપોઇન્ટમેન્ટ આપમેળે કન્ફર્મ થતી નથી.",
    privacyPre: "તમારી વિગતોનો ઉપયોગ માત્ર આ પૂછપરછનો જવાબ આપવા માટે થાય છે. અમારી",
    privacyLink: "ગોપનીયતા નીતિ",
    privacyPost: " વાંચો.",
    consentError: "કૃપા કરીને તમારી પૂછપરછ આગળ વધારવા માટે સંમતિ બોક્સ પર ટિક કરો.",
    contactNameError: "કૃપા કરીને તમારું નામ લખો.",
    patientNameError: "કૃપા કરીને દર્દીનું નામ લખો.",
    patientAgeError: "કૃપા કરીને દર્દીની ઉંમર લખો.",
    nonConfirmNote: "આ માત્ર પૂછપરછ છે, કન્ફર્મ એપોઇન્ટમેન્ટ નથી. સ્લોટ નક્કી કરવા ક્લિનિક તમારો સંપર્ક કરશે.",
  },
};

export const EXPANSION: Record<Language, ExpansionDict> = { en, hi, mr, gu };

export function useExpansion(lang: Language): ExpansionDict {
  return EXPANSION[lang] ?? EXPANSION.en;
}
