/* Patient-facing VOPD copy in English, Hindi, Marathi and Gujarati.
   Pure data module: safe to import from client components and server routes.
   Admin console copy is intentionally English (single internal operator tool). */

export type VopdLocale = "en" | "hi" | "mr" | "gu";
export const VOPD_LOCALES: readonly VopdLocale[] = ["en", "hi", "mr", "gu"];

export function isVopdLocale(value: unknown): value is VopdLocale {
  return typeof value === "string" && (VOPD_LOCALES as readonly string[]).includes(value);
}

/** Numeric DD-MM-YYYY from parts (locale-independent digits, site-wide standard). */
function toDDMMYYYY(day: string, month: string, year: string): string {
  return `${day.padStart(2, "0")}-${month.padStart(2, "0")}-${year}`;
}

/** Clinic-date formatting in the visitor's language (still Asia/Kolkata time).
 *  Date part is always DD-MM-YYYY (e.g. "Fri, 20-11-2026, 10:30 AM"); only the
 *  weekday name is localized. */
export function formatVopdDateTime(iso: string, locale: VopdLocale = "en"): string {
  const tag = locale === "en" ? "en-IN" : `${locale}-IN`;
  const dt = new Date(iso);
  try {
    // Weekday in the visitor's language; date/time digits always Latin so the
    // DD-MM-YYYY standard looks identical across en/hi/mr/gu.
    const weekday = new Intl.DateTimeFormat(tag, { timeZone: "Asia/Kolkata", weekday: "short" }).format(dt);
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).formatToParts(dt);
    const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
    return `${weekday}, ${toDDMMYYYY(get("day"), get("month"), get("year"))}, ${get("hour")}:${get("minute")} ${get("dayPeriod").toUpperCase()}`;
  } catch {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(dt);
  }
}

/** Short date pill label (DD-MM-YYYY, e.g. "18-11-2026") in Asia/Kolkata calendar. */
export function formatShortClinicDate(dateString: string, locale: VopdLocale = "en"): { weekday: string; dayMonth: string } {
  const [y, m, d] = dateString.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const fallback = { weekday: "", dayMonth: `${String(d).padStart(2, "0")}-${String(m).padStart(2, "0")}-${y}` };
  if (!y || !m || !d || Number.isNaN(dt.getTime())) return fallback;
  const tag = locale === "en" ? "en-IN" : `${locale}-IN`;
  try {
    return {
      weekday: new Intl.DateTimeFormat(tag, { timeZone: "UTC", weekday: "short" }).format(dt),
      dayMonth: toDDMMYYYY(String(d), String(m), String(y)),
    };
  } catch {
    return fallback;
  }
}

export type VopdDict = {
  selector: { question: string; opdTitle: string; opdSub: string; vopdTitle: string; vopdSub: string };
  steps: string[];
  stepHeadings: string[];
  stepCounter: string;
  paymentHeading: string;
  unavailable: string;
  patient: {
    who: string; child: string; adult: string;
    guardian: string; childName: string; adultName: string; dob: string; agePrefix: string;
    phoneChild: string; phoneAdult: string; email: string; gender: string; city: string; state: string;
    select: string; girl: string; boy: string; female: string; male: string; other: string;
    eGuardian: string; eChildName: string; eAdultName: string; eDob: string; ePhone: string; eEmail: string;
  };
  concern: {
    category: string; choose: string; symptoms: string; symptomsPh: string; eSymptoms: string; eCategory: string;
    duration: string; durationPh: string; previous: string; treatment: string; treatmentPh: string; message: string;
  };
  plan: {
    loading: string; feeOnConfirm: string; usdNote: string; minutes: string;
    followUps: string; enquiryOnly: string;
  };
  slot: {
    quickPick: string; date: string; hours: string; hoursValue: string; sessionNote: string;
    morning: string; evening: string; checking: string; available: string; eSlot: string;
    sundayClosed: string; todayEnded: string; dayBlocked: string; noSlots: string; jumpNext: string;
  };
  review: {
    patient: string; dob: string; guardian: string; category: string; plan: string; fee: string; when: string; duration: string; mins: string;
    consent: string; eConsent: string; privacyPre: string; privacyLink: string; privacyPost: string;
  };
  pay: {
    reference: string; plan: string; when: string; fee: string; status: string;
    noPayTitle: string; noPayBody: string; whatsapp: string;
    upiTitle: string; beneficiary: string; upiId: string; amount: string; mention: string; notConfigured: string; hold: string;
    scanHint: string; demoNote: string;
    payer: string; utr: string; utrPh: string; screenshot: string; chooseFile: string; eScreenshot: string; ePayer: string; eUtr: string;
    submit: string; disclaimer: string; receivedTitle: string; receivedBody: string; meeting: string; join: string;
    copy: string; copied: string; statusLabel: string;
  };
  nav: { back: string; continue: string; reserve: string; startAnother: string };
  genericError: string;
  status: Record<string, string>;
  codes: Record<string, string>;
  emails: {
    greeting: string; ackTitle: string; ackBadge: string; ackNote: string; adminSubject: string; adminTitle: string;
    paymentTitle: string; paymentNote: string; confirmTitle: string; confirmBadge: string; confirmNote: string;
    confirmNoMeet: string; meetCta: string; meetNote: string; meetSubject: string;
    calendarInviteNote: string;
  };
};

const en: VopdDict = {
  selector: {
    question: "Choose consultation mode",
    opdTitle: "OPD — In-Clinic Visit",
    opdSub: "Indore clinic appointment enquiry",
    vopdTitle: "VOPD — Video Consultation",
    vopdSub: "Book a 30 mins slot online · UPI",
  },
  steps: ["Patient", "Concern", "Plan", "Slot", "Review", "Pay"],
  stepHeadings: [
    "Patient Details",
    "Health Concern",
    "Consultation Plan",
    "Select Date & Time",
    "Review Booking",
    "Complete UPI Payment",
  ],
  stepCounter: "Step {current} of {total}",
  paymentHeading: "Complete UPI Payment",
  unavailable: "Online slot reservation is temporarily unavailable. Please call {phone} or message on WhatsApp.",
  patient: {
    who: "Consultation is for", child: "Child", adult: "Adult",
    guardian: "Parent / Guardian full name *", childName: "Child's full name *", adultName: "Patient's full name *",
    dob: "Date of birth *", agePrefix: "Age",
    phoneChild: "Parent's mobile number *", phoneAdult: "Mobile number *", email: "Email address (optional)",
    gender: "Gender", city: "City", state: "State", select: "Select",
    girl: "Girl", boy: "Boy", female: "Female", male: "Male", other: "Other",
    eGuardian: "Enter the parent or guardian's full name.", eChildName: "Enter the child's full name.",
    eAdultName: "Enter the patient's full name.", eDob: "Please select a valid date of birth.",
    ePhone: "Enter a valid mobile number.", eEmail: "Enter a valid email address.",
  },
  concern: {
    category: "Consultation category *", choose: "Choose a category", symptoms: "Main symptoms *",
    symptomsPh: "Briefly describe the main symptoms and concerns",
    eSymptoms: "Please describe the main symptoms.", eCategory: "Choose a consultation category.",
    duration: "Since how long?", durationPh: "e.g. 3 weeks, 6 months", previous: "Previous diagnosis (optional)",
    treatment: "Current medicines (optional)", treatmentPh: "List ongoing medicines, if any",
    message: "Additional note (optional)",
  },
  plan: {
    loading: "Loading consultation plans…", feeOnConfirm: "Confirmed by clinic", usdNote: "≈ {usd} · Paid in INR",
    minutes: "{n} mins",
    followUps: "Includes {first} mins first session + {follows} follow-ups ({followMin} mins each).",
    enquiryOnly: "No online payment · Fee & timing confirmed by clinic.",
  },
  slot: {
    quickPick: "Available days (Mon–Sat)",
    date: "Or choose another date",
    hours: "Clinic timings (IST)",
    hoursValue: "10:00 AM – 2:00 PM & 5:00 PM – 8:00 PM",
    sessionNote: "{n} mins consultation slot",
    morning: "Morning · 10:00 AM – 2:00 PM",
    evening: "Evening · 5:00 PM – 8:00 PM",
    checking: "Loading available slots…",
    available: "{n} slots available",
    eSlot: "Please select a time slot to continue.",
    sundayClosed: "The clinic is closed on Sundays (open Monday–Saturday).",
    todayEnded: "Today's consultation hours have ended.",
    dayBlocked: "The clinic is unavailable on this date.",
    noSlots: "All slots are booked on this date.",
    jumpNext: "View slots for {date}",
  },
  review: {
    patient: "Patient", dob: "Date of birth", guardian: "Parent / Guardian", category: "Category",
    plan: "Plan", fee: "Fee", when: "Date & time", duration: "Duration", mins: "mins",
    consent: "I understand this is a non-emergency video consultation and will be confirmed once payment is verified.",
    eConsent: "Please accept the consent box to proceed.",
    privacyPre: "Protected under our", privacyLink: "Privacy Policy", privacyPost: ".",
  },
  pay: {
    reference: "Booking reference", plan: "Plan", when: "Date & time", fee: "Fee", status: "Status",
    noPayTitle: "Enquiry received — no online payment needed.",
    noPayBody: "Our clinic will reach out to confirm your slot and details.",
    whatsapp: "Share on WhatsApp",
    upiTitle: "Pay via UPI & enter transaction UTR",
    beneficiary: "Beneficiary", upiId: "UPI ID", amount: "Amount", mention: "Note / Reference",
    notConfigured: "Share booking reference {ref} on WhatsApp or call the clinic to receive the verified UPI QR and confirm your slot.",
    hold: "Slot held until {time} IST.",
    scanHint: "Scan with Google Pay, PhonePe, Paytm or any UPI app. The amount and booking reference are pre-filled.",
    demoNote: "Test configuration — this QR uses a placeholder UPI ID. Do not send real money.",
    payer: "Payer name *", utr: "UPI Reference / UTR *", utrPh: "12-digit UTR number",
    screenshot: "Payment screenshot (optional, max 2 MB)", chooseFile: "Upload PNG, JPG or WebP",
    eScreenshot: "Screenshot must be under 2 MB.", ePayer: "Enter the payer name.",
    eUtr: "Enter a valid UTR (6–40 letters or numbers).",
    submit: "Submit Payment Details",
    disclaimer: "Your appointment is confirmed once the clinic verifies payment.",
    receivedTitle: "Consultation request received",
    receivedBody: "Your slot is held while our team verifies payment. Reference: {ref}.",
    meeting: "Video link", join: "Join Google Meet", copy: "Copy reference", copied: "Copied", statusLabel: "Status",
  },
  nav: { back: "Back", continue: "Continue", reserve: "Reserve Slot", startAnother: "New booking" },
  genericError: "Could not complete that step. Please check your details and try again.",
  status: {
    SLOT_RESERVED: "Slot reserved",
    PAYMENT_PENDING: "Awaiting payment",
    PAYMENT_VERIFICATION_PENDING: "Awaiting clinic verification",
    PAYMENT_VERIFIED: "Payment verified",
    CONFIRMED: "Confirmed",
    REJECTED: "Verification issue — contact clinic",
    CANCELLED: "Cancelled",
    EXPIRED: "Slot hold expired",
    COMPLETED: "Completed",
  },
  codes: {
    SLOT_TAKEN: "That slot was just booked. Please pick another time.",
    SLOT_BLOCKED: "The clinic is unavailable at that time.",
    PAST_SLOT: "That time has passed. Please pick a later slot.",
    INVALID_SLOT: "Please choose one of the available slots.",
    HOLD_EXPIRED: "Your slot hold expired. Please call +91 98607 75010 with your reference if you already paid.",
    PAYMENT_ALREADY_SUBMITTED: "Payment details have already been submitted for this booking.",
    RESERVATION_CLOSED: "This reservation has closed. Please start a new booking.",
    NOT_FOUND: "Booking not found.",
  },
  emails: {
    greeting: "Namaste",
    ackTitle: "Your online consultation request has been received",
    ackBadge: "Video OPD · Awaiting payment verification",
    ackNote: "Your appointment will be confirmed after payment verification.",
    adminSubject: "New VOPD booking",
    adminTitle: "New VOPD booking received",
    paymentTitle: "Payment reference submitted",
    paymentNote: "Check the clinic bank/UPI account, then verify in the admin console.",
    confirmTitle: "Your VOPD appointment is confirmed",
    confirmBadge: "Video OPD · Payment verified",
    confirmNote: "Join a few minutes early using the secure Google Meet link below. Please keep reports and a medicine list ready.",
    confirmNoMeet: "The clinic will share your Google Meet link before the appointment. Please keep reports and a medicine list ready.",
    meetCta: "Join Google Meet",
    meetNote: "Join a few minutes before your appointment time.",
    calendarInviteNote: "You will also receive a Google Calendar invitation from {sender}. If Gmail or Google Calendar says “unknown sender”, this is genuinely from our clinic — click “Yes” on the invitation, or add {sender} to your contacts.",
    meetSubject: "Your Google Meet link",
  },
};

const hi: VopdDict = {
  selector: {
    question: "परामर्श का माध्यम चुनें",
    opdTitle: "OPD — क्लिनिक परामर्श",
    opdSub: "इंदौर क्लिनिक अपॉइंटमेंट पूछताछ",
    vopdTitle: "VOPD — वीडियो परामर्श",
    vopdSub: "30 मिनट ऑनलाइन स्लॉट · UPI",
  },
  steps: ["मरीज़", "समस्या", "योजना", "समय", "समीक्षा", "भुगतान"],
  stepHeadings: [
    "मरीज़ का विवरण",
    "स्वास्थ्य समस्या",
    "परामर्श योजना",
    "तारीख और समय चुनें",
    "बुकिंग समीक्षा",
    "UPI भुगतान पूरा करें",
  ],
  stepCounter: "चरण {current} / {total}",
  paymentHeading: "UPI भुगतान पूरा करें",
  unavailable: "ऑनलाइन स्लॉट बुकिंग अभी उपलब्ध नहीं है। कृपया {phone} पर कॉल करें या WhatsApp करें।",
  patient: {
    who: "परामर्श किसके लिए है", child: "बच्चा", adult: "वयस्क",
    guardian: "माता-पिता / अभिभावक का नाम *", childName: "बच्चे का पूरा नाम *", adultName: "मरीज़ का पूरा नाम *",
    dob: "जन्म तिथि *", agePrefix: "आयु",
    phoneChild: "माता-पिता का मोबाइल नंबर *", phoneAdult: "मोबाइल नंबर *", email: "ईमेल पता (वैकल्पिक)",
    gender: "लिंग", city: "शहर", state: "राज्य", select: "चुनें",
    girl: "लड़की", boy: "लड़का", female: "महिला", male: "पुरुष", other: "अन्य",
    eGuardian: "कृपया अभिभावक का नाम लिखें।", eChildName: "कृपया बच्चे का नाम लिखें।",
    eAdultName: "कृपया मरीज़ का नाम लिखें।", eDob: "कृपया मान्य जन्म तिथि चुनें।",
    ePhone: "कृपया सही मोबाइल नंबर लिखें।", eEmail: "कृपया सही ईमेल पता लिखें।",
  },
  concern: {
    category: "परामर्श श्रेणी *", choose: "श्रेणी चुनें", symptoms: "मुख्य लक्षण *",
    symptomsPh: "मुख्य लक्षण व समस्या संक्षेप में लिखें",
    eSymptoms: "कृपया मुख्य लक्षण लिखें।", eCategory: "कृपया परामर्श श्रेणी चुनें।",
    duration: "कब से है?", durationPh: "जैसे 3 सप्ताह, 6 महीने", previous: "पिछला निदान (वैकल्पिक)",
    treatment: "चालू दवाएँ (वैकल्पिक)", treatmentPh: "यदि कोई दवा चल रही हो तो लिखें",
    message: "अतिरिक्त संदेश (वैकल्पिक)",
  },
  plan: {
    loading: "परामर्श योजनाएँ लोड हो रही हैं…", feeOnConfirm: "क्लिनिक द्वारा पुष्टि", usdNote: "≈ {usd} · भुगतान INR में",
    minutes: "{n} मिनट",
    followUps: "{first} मिनट प्रथम परामर्श + {follows} फॉलो-अप ({followMin} मिनट प्रत्येक) शामिल।",
    enquiryOnly: "ऑनलाइन भुगतान नहीं · शुल्क व समय क्लिनिक बताएगा।",
  },
  slot: {
    quickPick: "उपलब्ध दिन (सोम–शनि)",
    date: "या अन्य तारीख चुनें",
    hours: "क्लिनिक समय (IST)",
    hoursValue: "सुबह 10:00 – दोपहर 2:00 व शाम 5:00 – रात 8:00",
    sessionNote: "{n} मिनट परामर्श स्लॉट",
    morning: "सुबह · 10:00 AM – 2:00 PM",
    evening: "शाम · 5:00 PM – 8:00 PM",
    checking: "उपलब्ध स्लॉट लोड हो रहे हैं…",
    available: "{n} स्लॉट उपलब्ध",
    eSlot: "आगे बढ़ने के लिए समय स्लॉट चुनें।",
    sundayClosed: "रविवार को क्लिनिक बंद रहता है (सोमवार–शनिवार खुला)।",
    todayEnded: "आज का परामर्श समय समाप्त हो गया है।",
    dayBlocked: "इस तारीख को क्लिनिक उपलब्ध नहीं है।",
    noSlots: "इस तारीख के सभी स्लॉट बुक हो चुके हैं।",
    jumpNext: "{date} के स्लॉट देखें",
  },
  review: {
    patient: "मरीज़", dob: "जन्म तिथि", guardian: "अभिभावक", category: "श्रेणी",
    plan: "योजना", fee: "शुल्क", when: "तारीख और समय", duration: "अवधि", mins: "मिनट",
    consent: "मैं समझता/समझती हूँ कि यह गैर-आपातकालीन वीडियो परामर्श है और भुगतान सत्यापन के बाद पक्का होगा।",
    eConsent: "कृपया सहमति स्वीकार करें।",
    privacyPre: "हमारी", privacyLink: "गोपनीयता नीति", privacyPost: " के अंतर्गत सुरक्षित।",
  },
  pay: {
    reference: "बुकिंग संदर्भ", plan: "योजना", when: "तारीख और समय", fee: "शुल्क", status: "स्थिति",
    noPayTitle: "अनुरोध प्राप्त — ऑनलाइन भुगतान आवश्यक नहीं।",
    noPayBody: "क्लिनिक आपसे संपर्क कर अपॉइंटमेंट की पुष्टि करेगा।",
    whatsapp: "WhatsApp पर भेजें",
    upiTitle: "UPI से भुगतान करें और UTR दर्ज करें",
    beneficiary: "लाभार्थी", upiId: "UPI आईडी", amount: "राशि", mention: "संदर्भ",
    notConfigured: "सत्यापित UPI QR प्राप्त करने के लिए संदर्भ {ref} के साथ क्लिनिक को WhatsApp या कॉल करें।",
    hold: "स्लॉट {time} IST तक आरक्षित है।",
    scanHint: "Google Pay, PhonePe, Paytm या किसी भी UPI ऐप से स्कैन करें। राशि और बुकिंग संदर्भ पहले से भरे होते हैं।",
    demoNote: "परीक्षण कॉन्फ़िगरेशन — यह QR एक placeholder UPI आईडी उपयोग करता है। वास्तविक पैसा न भेजें।",
    payer: "भुगतानकर्ता का नाम *", utr: "UPI संदर्भ / UTR *", utrPh: "12-अंकीय UTR नंबर",
    screenshot: "भुगतान स्क्रीनशॉट (वैकल्पिक, अधिकतम 2 MB)", chooseFile: "PNG, JPG या WebP चुनें",
    eScreenshot: "स्क्रीनशॉट 2 MB से छोटा होना चाहिए।", ePayer: "कृपया भुगतानकर्ता का नाम लिखें।",
    eUtr: "सही UTR नंबर लिखें (6–40 अक्षर/अंक)।",
    submit: "भुगतान विवरण जमा करें",
    disclaimer: "क्लिनिक द्वारा भुगतान सत्यापन के बाद अपॉइंटमेंट पक्की होगी।",
    receivedTitle: "परामर्श अनुरोध प्राप्त हो गया है",
    receivedBody: "भुगतान सत्यापन तक आपका स्लॉट आरक्षित है। संदर्भ: {ref}।",
    meeting: "वीडियो लिंक", join: "Google Meet से जुड़ें", copy: "संदर्भ कॉपी करें", copied: "कॉपी हो गया", statusLabel: "स्थिति",
  },
  nav: { back: "पीछे", continue: "आगे बढ़ें", reserve: "स्लॉट बुक करें", startAnother: "नई बुकिंग" },
  genericError: "अनुरोध पूरा नहीं हो सका। कृपया विवरण जाँचकर पुनः प्रयास करें।",
  status: {
    SLOT_RESERVED: "स्लॉट आरक्षित",
    PAYMENT_PENDING: "भुगतान शेष",
    PAYMENT_VERIFICATION_PENDING: "सत्यापन प्रतीक्षित",
    PAYMENT_VERIFIED: "भुगतान सत्यापित",
    CONFIRMED: "पुष्ट",
    REJECTED: "सत्यापन समस्या — क्लिनिक से संपर्क करें",
    CANCELLED: "रद्द",
    EXPIRED: "स्लॉट समय समाप्त",
    COMPLETED: "पूर्ण",
  },
  codes: {
    SLOT_TAKEN: "यह स्लॉट अभी बुक हो गया। कृपया दूसरा समय चुनें।",
    SLOT_BLOCKED: "उस समय क्लिनिक उपलब्ध नहीं है।",
    PAST_SLOT: "यह समय बीत चुका है। कृपया बाद का स्लॉट चुनें।",
    INVALID_SLOT: "कृपया उपलब्ध स्लॉट चुनें।",
    HOLD_EXPIRED: "स्लॉट होल्ड समाप्त हो गया। भुगतान हो चुका हो तो संदर्भ सहित +91 98607 75010 पर कॉल करें।",
    PAYMENT_ALREADY_SUBMITTED: "इस बुकिंग का भुगतान विवरण पहले ही जमा हो चुका है।",
    RESERVATION_CLOSED: "यह आरक्षण बंद हो चुका है। कृपया नई बुकिंग करें।",
    NOT_FOUND: "बुकिंग नहीं मिली।",
  },
  emails: {
    greeting: "नमस्ते",
    ackTitle: "आपका ऑनलाइन परामर्श अनुरोध प्राप्त हो गया है",
    ackBadge: "वीडियो OPD · भुगतान सत्यापन प्रतीक्षित",
    ackNote: "भुगतान सत्यापन के बाद आपकी अपॉइंटमेंट की पुष्टि की जाएगी।",
    adminSubject: "नई VOPD बुकिंग",
    adminTitle: "नई VOPD बुकिंग प्राप्त हुई",
    paymentTitle: "भुगतान संदर्भ जमा किया गया",
    paymentNote: "क्लिनिक के बैंक/UPI खाते में जाँच कर एडमिन कंसोल में सत्यापित करें।",
    confirmTitle: "आपकी VOPD अपॉइंटमेंट पक्की हो गई है",
    confirmBadge: "वीडियो OPD · भुगतान सत्यापित",
    confirmNote: "कृपया कुछ मिनट पहले नीचे दिए गए Google Meet लिंक से जुड़ें। रिपोर्ट और दवाओं की सूची तैयार रखें।",
    confirmNoMeet: "अपॉइंटमेंट से पहले क्लिनिक Google Meet लिंक साझा करेगा। रिपोर्ट और दवाओं की सूची तैयार रखें।",
    meetCta: "Google Meet से जुड़ें",
    meetNote: "अपॉइंटमेंट समय से कुछ मिनट पहले जुड़ें।",
    calendarInviteNote: "आपको {sender} की ओर से Google Calendar का निमंत्रण भी मिलेगा। यदि Gmail या Google Calendar “अज्ञात प्रेषक” दिखाए, तो यह वास्तव में हमारे क्लिनिक की ओर से है — निमंत्रण पर “हाँ” दबाएँ या {sender} को अपने संपर्कों में जोड़ लें।",
    meetSubject: "आपका Google Meet लिंक",
  },
};

const mr: VopdDict = {
  selector: {
    question: "सल्ल्याचा प्रकार निवडा",
    opdTitle: "OPD — क्लिनिक भेट",
    opdSub: "इंदूर क्लिनिक अपॉइंटमेंट चौकशी",
    vopdTitle: "VOPD — व्हिडिओ सल्ला",
    vopdSub: "30 मिनिटे ऑनलाइन स्लॉट · UPI",
  },
  steps: ["रुग्ण", "तक्रार", "योजना", "वेळ", "आढावा", "पेमेंट"],
  stepHeadings: [
    "रुग्णाचा तपशील",
    "आरोग्य तक्रार",
    "सल्ला योजना",
    "तारीख आणि वेळ निवडा",
    "बुकिंग आढावा",
    "UPI पेमेंट पूर्ण करा",
  ],
  stepCounter: "टप्पा {current} / {total}",
  paymentHeading: "UPI पेमेंट पूर्ण करा",
  unavailable: "ऑनलाइन स्लॉट बुकिंग तात्पुरती अनुपलब्ध आहे. कृपया {phone} वर कॉल करा किंवा WhatsApp करा.",
  patient: {
    who: "सल्ला कोणासाठी आहे", child: "मूल", adult: "प्रौढ",
    guardian: "पालकाचे पूर्ण नाव *", childName: "मुलाचे पूर्ण नाव *", adultName: "रुग्णाचे पूर्ण नाव *",
    dob: "जन्मतारीख *", agePrefix: "वय",
    phoneChild: "पालकाचा मोबाईल क्रमांक *", phoneAdult: "मोबाईल क्रमांक *", email: "ईमेल पत्ता (ऐच्छिक)",
    gender: "लिंग", city: "शहर", state: "राज्य", select: "निवडा",
    girl: "मुलगी", boy: "मुलगा", female: "स्त्री", male: "पुरुष", other: "इतर",
    eGuardian: "कृपया पालकाचे नाव लिहा.", eChildName: "कृपया मुलाचे नाव लिहा.",
    eAdultName: "कृपया रुग्णाचे नाव लिहा.", eDob: "कृपया वैध जन्मतारीख निवडा.",
    ePhone: "कृपया वैध मोबाईल क्रमांक लिहा.", eEmail: "कृपया वैध ईमेल पत्ता लिहा.",
  },
  concern: {
    category: "सल्ला श्रेणी *", choose: "श्रेणी निवडा", symptoms: "मुख्य लक्षणे *",
    symptomsPh: "मुख्य लक्षणे थोडक्यात लिहा",
    eSymptoms: "कृपया मुख्य लक्षणे लिहा.", eCategory: "कृपया श्रेणी निवडा.",
    duration: "किती काळापासून?", durationPh: "उदा. 3 आठवडे, 6 महिने", previous: "मागील निदान (ऐच्छिक)",
    treatment: "सुरू असलेली औषधे (ऐच्छिक)", treatmentPh: "सध्याची औषधे असल्यास लिहा",
    message: "अतिरिक्त संदेश (ऐच्छिक)",
  },
  plan: {
    loading: "सल्ला योजना लोड होत आहेत…", feeOnConfirm: "क्लिनिक कळवेल", usdNote: "≈ {usd} · पेमेंट INR मध्ये",
    minutes: "{n} मिनिटे",
    followUps: "{first} मिनिटे पहिले सत्र + {follows} फॉलो-अप (प्रत्येकी {followMin} मिनिटे) समाविष्ट.",
    enquiryOnly: "ऑनलाइन पेमेंट नाही · शुल्क व वेळ क्लिनिक कळवेल.",
  },
  slot: {
    quickPick: "उपलब्ध दिवस (सोम–शनि)",
    date: "किंवा दुसरी तारीख निवडा",
    hours: "क्लिनिक वेळ (IST)",
    hoursValue: "सकाळी 10:00 – दुपारी 2:00 व संध्या. 5:00 – रात्री 8:00",
    sessionNote: "{n} मिनिटे सल्ला स्लॉट",
    morning: "सकाळ · 10:00 AM – 2:00 PM",
    evening: "संध्याकाळ · 5:00 PM – 8:00 PM",
    checking: "उपलब्ध वेळ तपासत आहे…",
    available: "{n} स्लॉट उपलब्ध",
    eSlot: "पुढे जाण्यासाठी वेळ निवडा.",
    sundayClosed: "रविवारी क्लिनिक बंद असते (सोमवार–शनिवार सुरू).",
    todayEnded: "आजची सल्ला वेळ संपली आहे.",
    dayBlocked: "या तारखेला क्लिनिक उपलब्ध नाही.",
    noSlots: "या तारखेचे सर्व स्लॉट बुक झाले आहेत.",
    jumpNext: "{date} चे स्लॉट पहा",
  },
  review: {
    patient: "रुग्ण", dob: "जन्मतारीख", guardian: "पालक", category: "श्रेणी",
    plan: "योजना", fee: "शुल्क", when: "तारीख आणि वेळ", duration: "कालावधी", mins: "मिनिटे",
    consent: "ही आपत्कालीन सेवा नसून व्हिडिओ सल्ला विनंती आहे व पेमेंट पडताळणीनंतर पक्की होईल हे मला मान्य आहे.",
    eConsent: "कृपया संमती स्वीकारा.",
    privacyPre: "आमच्या", privacyLink: "गोपनीयता धोरणानुसार", privacyPost: " सुरक्षित.",
  },
  pay: {
    reference: "बुकिंग संदर्भ", plan: "योजना", when: "तारीख आणि वेळ", fee: "शुल्क", status: "स्थिती",
    noPayTitle: "विनंती जतन झाली — ऑनलाइन पेमेंट आवश्यक नाही.",
    noPayBody: "क्लिनिक आपल्याशी संपर्क करून वेळेची पुष्टी करेल.",
    whatsapp: "WhatsApp वर पाठवा",
    upiTitle: "UPI ने पेमेंट करा व UTR नोंदवा",
    beneficiary: "लाभार्थी", upiId: "UPI आयडी", amount: "रक्कम", mention: "संदर्भ",
    notConfigured: "अधिकृत UPI QR मिळवण्यासाठी संदर्भ {ref} सह क्लिनिकला WhatsApp किंवा कॉल करा.",
    hold: "स्लॉट {time} IST पर्यंत राखीव आहे.",
    scanHint: "Google Pay, PhonePe, Paytm किंवा कोणत्याही UPI अ‍ॅपने स्कॅन करा. रक्कम व बुकिंग संदर्भ आधीच भरलेले आहेत.",
    demoNote: "चाचणी कॉन्फिगरेशन — हा QR placeholder UPI आयडी वापरतो. खरे पैसे पाठवू नका.",
    payer: "पैसे भरणाऱ्याचे नाव *", utr: "UPI संदर्भ / UTR *", utrPh: "12-अंकी UTR क्रमांक",
    screenshot: "पेमेंट स्क्रीनशॉट (ऐच्छिक, कमाल 2 MB)", chooseFile: "PNG, JPG किंवा WebP निवडा",
    eScreenshot: "स्क्रीनशॉट 2 MB पेक्षा लहान असावा.", ePayer: "कृपया नाव लिहा.",
    eUtr: "वैध UTR क्रमांक लिहा (6–40 अक्षरे/अंक).",
    submit: "पेमेंट तपशील सबमिट करा",
    disclaimer: "क्लिनिकने पेमेंट पडताळल्यानंतर अपॉइंटमेंट पक्की होईल.",
    receivedTitle: "सल्ला विनंती मिळाली आहे",
    receivedBody: "पेमेंट पडताळणी होईपर्यंत तुमचा स्लॉट राखीव आहे. संदर्भ: {ref}.",
    meeting: "व्हिडिओ लिंक", join: "Google Meet मध्ये सामील व्हा", copy: "संदर्भ कॉपी करा", copied: "कॉपी झाले", statusLabel: "स्थिती",
  },
  nav: { back: "मागे", continue: "पुढे", reserve: "स्लॉट राखीव करा", startAnother: "नवीन बुकिंग" },
  genericError: "कृती पूर्ण होऊ शकली नाही. कृपया तपशील तपासून पुन्हा प्रयत्न करा.",
  status: {
    SLOT_RESERVED: "स्लॉट राखीव",
    PAYMENT_PENDING: "पेमेंट बाकी",
    PAYMENT_VERIFICATION_PENDING: "पडताळणी प्रतीक्षेत",
    PAYMENT_VERIFIED: "पेमेंट पडताळले",
    CONFIRMED: "पक्की",
    REJECTED: "पडताळणी अडचण — क्लिनिकशी संपर्क साधा",
    CANCELLED: "रद्द",
    EXPIRED: "आरक्षण संपले",
    COMPLETED: "पूर्ण",
  },
  codes: {
    SLOT_TAKEN: "हा स्लॉट नुकताच बुक झाला. कृपया दुसरी वेळ निवडा.",
    SLOT_BLOCKED: "त्या वेळी क्लिनिक उपलब्ध नाही.",
    PAST_SLOT: "ही वेळ निघून गेली आहे. कृपया पुढील स्लॉट निवडा.",
    INVALID_SLOT: "कृपया उपलब्ध स्लॉट निवडा.",
    HOLD_EXPIRED: "स्लॉट होल्ड संपला. पेमेंट झाले असल्यास संदर्भासह +91 98607 75010 वर कॉल करा.",
    PAYMENT_ALREADY_SUBMITTED: "या बुकिंगचे पेमेंट तपशील आधीच सबमिट झाले आहेत.",
    RESERVATION_CLOSED: "हे आरक्षण बंद झाले आहे. कृपया नवीन बुकिंग करा.",
    NOT_FOUND: "बुकिंग सापडली नाही.",
  },
  emails: {
    greeting: "नमस्ते",
    ackTitle: "तुमची ऑनलाइन सल्ला विनंती मिळाली आहे",
    ackBadge: "व्हिडिओ OPD · पेमेंट पडताळणीची प्रतीक्षा",
    ackNote: "पेमेंट पडताळणीनंतर तुमची अपॉइंटमेंट पक्की होईल.",
    adminSubject: "नवीन VOPD बुकिंग",
    adminTitle: "नवीन VOPD बुकिंग मिळाली",
    paymentTitle: "पेमेंट संदर्भ सबमिट झाला",
    paymentNote: "क्लिनिकच्या बँक/UPI खात्यात तपासा, नंतर अ‍ॅडमिन कन्सोलमध्ये पडताळा.",
    confirmTitle: "तुमची VOPD अपॉइंटमेंट पक्की झाली आहे",
    confirmBadge: "व्हिडिओ OPD · पेमेंट पडताळले",
    confirmNote: "कृपया काही मिनिटे आधी खालील Google Meet लिंकने सामील व्हा. अहवाल व औषधांची यादी तयार ठेवा.",
    confirmNoMeet: "क्लिनिक अपॉइंटमेंटपूर्वी Google Meet लिंक पाठवेल. अहवाल व औषधांची यादी तयार ठेवा.",
    meetCta: "Google Meet मध्ये सामील व्हा",
    meetNote: "अपॉइंटमेंटच्या काही मिनिटे आधी सामील व्हा.",
    calendarInviteNote: "तुम्हाला {sender} कडून Google Calendar चे आमंत्रणही मिळेल. Gmail किंवा Google Calendar “अज्ञात प्रेषक” दाखवत असल्यास, ते खरोखर आमच्या क्लिनिककडून आहे — आमंत्रणावर “होय” निवडा किंवा {sender} तुमच्या संपर्कांमध्ये जोडा.",
    meetSubject: "तुमची Google Meet लिंक",
  },
};

const gu: VopdDict = {
  selector: {
    question: "પરામર્શનો પ્રકાર પસંદ કરો",
    opdTitle: "OPD — ક્લિનિક મુલાકાત",
    opdSub: "ઇન્દોર ક્લિનિક એપોઇન્ટમેન્ટ પૂછપરછ",
    vopdTitle: "VOPD — વિડિઓ પરામર્શ",
    vopdSub: "30 મિનિટ ઓનલાઇન સ્લોટ · UPI",
  },
  steps: ["દર્દી", "તકલીફ", "યોજના", "સમય", "સમીક્ષા", "પેમેન્ટ"],
  stepHeadings: [
    "દર્દીની વિગતો",
    "આરોગ્ય સમસ્યા",
    "પરામર્શ યોજના",
    "તારીખ અને સમય પસંદ કરો",
    "બુકિંગ સમીક્ષા",
    "UPI પેમેન્ટ પૂર્ણ કરો",
  ],
  stepCounter: "પગલું {current} / {total}",
  paymentHeading: "UPI પેમેન્ટ પૂર્ણ કરો",
  unavailable: "ઓનલાઇન સ્લોટ બુકિંગ હાલ ઉપલબ્ધ નથી. કૃપા કરીને {phone} પર કૉલ કરો અથવા WhatsApp કરો.",
  patient: {
    who: "પરામર્શ કોના માટે છે", child: "બાળક", adult: "પુખ્ત",
    guardian: "વાલીનું પૂરું નામ *", childName: "બાળકનું પૂરું નામ *", adultName: "દર્દીનું પૂરું નામ *",
    dob: "જન્મ તારીખ *", agePrefix: "ઉંમર",
    phoneChild: "વાલીનો મોબાઇલ નંબર *", phoneAdult: "મોબાઇલ નંબર *", email: "ઇમેઇલ સરનામું (વૈકલ્પિક)",
    gender: "લિંગ", city: "શહેર", state: "રાજ્ય", select: "પસંદ કરો",
    girl: "બાળકી", boy: "બાળક", female: "સ્ત્રી", male: "પુરુષ", other: "અન્ય",
    eGuardian: "કૃપા કરીને વાલીનું નામ લખો.", eChildName: "કૃપા કરીને બાળકનું નામ લખો.",
    eAdultName: "કૃપા કરીને દર્દીનું નામ લખો.", eDob: "કૃપા કરીને માન્ય જન્મ તારીખ પસંદ કરો.",
    ePhone: "કૃપા કરીને માન્ય મોબાઇલ નંબર લખો.", eEmail: "કૃપા કરીને માન્ય ઇમેઇલ લખો.",
  },
  concern: {
    category: "પરામર્શ શ્રેણી *", choose: "શ્રેણી પસંદ કરો", symptoms: "મુખ્ય લક્ષણો *",
    symptomsPh: "મુખ્ય લક્ષણો ટૂંકમાં જણાવો",
    eSymptoms: "કૃપા કરીને મુખ્ય લક્ષણો લખો.", eCategory: "કૃપા કરીને શ્રેણી પસંદ કરો.",
    duration: "કેટલા સમયથી?", durationPh: "દા.ત. 3 અઠવાડિયાં, 6 મહિના", previous: "અગાઉનું નિદાન (વૈકલ્પિક)",
    treatment: "ચાલુ દવાઓ (વૈકલ્પિક)", treatmentPh: "ચાલુ દવાઓ હોય તો લખો",
    message: "વધારાનો સંદેશ (વૈકલ્પિક)",
  },
  plan: {
    loading: "પરામર્શ યોજનાઓ લોડ થઈ રહી છે…", feeOnConfirm: "ક્લિનિક જણાવશે", usdNote: "≈ {usd} · પેમેન્ટ INR માં",
    minutes: "{n} મિનિટ",
    followUps: "{first} મિનિટ પ્રથમ સત્ર + {follows} ફોલો-અપ (દરેક {followMin} મિનિટ) સામેલ.",
    enquiryOnly: "ઓનલાઇન પેમેન્ટ નહીં · ફી અને સમય ક્લિનિક જણાવશે.",
  },
  slot: {
    quickPick: "ઉપલબ્ધ દિવસો (સોમ–શનિ)",
    date: "અથવા બીજી તારીખ પસંદ કરો",
    hours: "ક્લિનિક સમય (IST)",
    hoursValue: "સવારે 10:00 – બપોરે 2:00 અને સાંજે 5:00 – રાત્રે 8:00",
    sessionNote: "{n} મિનિટ પરામર્શ સ્લોટ",
    morning: "સવાર · 10:00 AM – 2:00 PM",
    evening: "સાંજ · 5:00 PM – 8:00 PM",
    checking: "ઉપલબ્ધ સ્લોટ લોડ થઈ રહ્યા છે…",
    available: "{n} સ્લોટ ઉપલબ્ધ",
    eSlot: "આગળ વધવા સમય સ્લોટ પસંદ કરો.",
    sundayClosed: "રવિવારે ક્લિનિક બંધ રહે છે (સોમવાર–શનિવાર ખુલ્લું).",
    todayEnded: "આજનો પરામર્શ સમય પૂર્ણ થયો છે.",
    dayBlocked: "આ તારીખે ક્લિનિક ઉપલબ્ધ નથી.",
    noSlots: "આ તારીખના બધા સ્લોટ બુક થઈ ગયા છે.",
    jumpNext: "{date} ના સ્લોટ જુઓ",
  },
  review: {
    patient: "દર્દી", dob: "જન્મ તારીખ", guardian: "વાલી", category: "શ્રેણી",
    plan: "યોજના", fee: "ફી", when: "તારીખ અને સમય", duration: "સમયગાળો", mins: "મિનિટ",
    consent: "હું સમજું છું કે આ બિન-કટોકટી વિડિઓ પરામર્શ છે અને પેમેન્ટ ચકાસણી પછી પુષ્ટ થશે.",
    eConsent: "કૃપા કરીને સંમતિ સ્વીકારો.",
    privacyPre: "અમારી", privacyLink: "ગોપનીયતા નીતિ", privacyPost: " હેઠળ સુરક્ષિત.",
  },
  pay: {
    reference: "બુકિંગ સંદર્ભ", plan: "યોજના", when: "તારીખ અને સમય", fee: "ફી", status: "સ્થિતિ",
    noPayTitle: "વિનંતી મળી — ઓનલાઇન પેમેન્ટ જરૂરી નથી.",
    noPayBody: "ક્લિનિક તમારો સંપર્ક કરી એપોઇન્ટમેન્ટની પુષ્ટિ કરશે.",
    whatsapp: "WhatsApp પર મોકલો",
    upiTitle: "UPI થી ચૂકવો અને UTR નોંધો",
    beneficiary: "લાભાર્થી", upiId: "UPI આઈડી", amount: "રકમ", mention: "સંદર્ભ",
    notConfigured: "ચકાસાયેલ UPI QR મેળવવા સંદર્ભ {ref} સાથે ક્લિનિકને WhatsApp અથવા કૉલ કરો.",
    hold: "સ્લોટ {time} IST સુધી આરક્ષિત છે.",
    scanHint: "Google Pay, PhonePe, Paytm અથવા કોઈપણ UPI એપથી સ્કેન કરો. રકમ અને બુકિંગ સંદર્ભ પહેલેથી ભરેલા છે.",
    demoNote: "પરીક્ષણ રૂપરેખાંકન — આ QR placeholder UPI આઈડી વાપરે છે. સાચા પૈસા મોકલશો નહીં.",
    payer: "ચૂકવનારનું નામ *", utr: "UPI સંદર્ભ / UTR *", utrPh: "12-અંકનો UTR નંબર",
    screenshot: "પેમેન્ટ સ્ક્રીનશોટ (વૈકલ્પિક, વધુમાં વધુ 2 MB)", chooseFile: "PNG, JPG અથવા WebP પસંદ કરો",
    eScreenshot: "સ્ક્રીનશોટ 2 MB થી નાનો હોવો જોઈએ.", ePayer: "કૃપા કરીને નામ લખો.",
    eUtr: "માન્ય UTR લખો (6–40 અક્ષર/અંક).",
    submit: "પેમેન્ટ વિગતો સબમિટ કરો",
    disclaimer: "ક્લિનિક પેમેન્ટ ચકાસે પછી એપોઇન્ટમેન્ટ પુષ્ટ થશે.",
    receivedTitle: "પરામર્શ વિનંતી મળી ગઈ છે",
    receivedBody: "પેમેન્ટ ચકાસણી સુધી તમારો સ્લોટ આરક્ષિત છે. સંદર્ભ: {ref}.",
    meeting: "વિડિઓ લિંક", join: "Google Meet માં જોડાઓ", copy: "સંદર્ભ કૉપી કરો", copied: "કૉપી થયું", statusLabel: "સ્થિતિ",
  },
  nav: { back: "પાછળ", continue: "આગળ", reserve: "સ્લોટ બુક કરો", startAnother: "નવી બુકિંગ" },
  genericError: "વિનંતી પૂર્ણ થઈ શકી નહીં. કૃપા કરીને વિગતો તપાસી ફરી પ્રયાસ કરો.",
  status: {
    SLOT_RESERVED: "સ્લોટ આરક્ષિત",
    PAYMENT_PENDING: "પેમેન્ટ બાકી",
    PAYMENT_VERIFICATION_PENDING: "ચકાસણીની રાહ",
    PAYMENT_VERIFIED: "પેમેન્ટ ચકાસાયું",
    CONFIRMED: "પુષ્ટ",
    REJECTED: "ચકાસણી સમસ્યા — ક્લિનિકનો સંપર્ક કરો",
    CANCELLED: "રદ",
    EXPIRED: "સ્લોટ સમય સમાપ્ત",
    COMPLETED: "પૂર્ણ",
  },
  codes: {
    SLOT_TAKEN: "આ સ્લોટ હમણાં જ બુક થયો. કૃપા કરીને બીજો સમય પસંદ કરો.",
    SLOT_BLOCKED: "તે સમયે ક્લિનિક ઉપલબ્ધ નથી.",
    PAST_SLOT: "આ સમય વીતી ગયો છે. કૃપા કરીને પછીનો સ્લોટ પસંદ કરો.",
    INVALID_SLOT: "કૃપા કરીને ઉપલબ્ધ સ્લોટ પસંદ કરો.",
    HOLD_EXPIRED: "સ્લોટ હોલ્ડ સમાપ્ત થયો. પેમેન્ટ કર્યું હોય તો સંદર્ભ સાથે +91 98607 75010 પર કૉલ કરો.",
    PAYMENT_ALREADY_SUBMITTED: "આ બુકિંગ માટે પેમેન્ટ વિગતો પહેલેથી સબમિટ થઈ છે.",
    RESERVATION_CLOSED: "આ આરક્ષણ બંધ થયું છે. કૃપા કરીને નવી બુકિંગ કરો.",
    NOT_FOUND: "બુકિંગ મળી નથી.",
  },
  emails: {
    greeting: "નમસ્તે",
    ackTitle: "તમારી ઓનલાઇન પરામર્શ વિનંતી મળી છે",
    ackBadge: "વિડિઓ OPD · પેમેન્ટ ચકાસણીની રાહ",
    ackNote: "પેમેન્ટ ચકાસણી પછી તમારી એપોઇન્ટમેન્ટ પુષ્ટ થશે.",
    adminSubject: "નવી VOPD બુકિંગ",
    adminTitle: "નવી VOPD બુકિંગ મળી",
    paymentTitle: "પેમેન્ટ સંદર્ભ સબમિટ થયો",
    paymentNote: "ક્લિનિકના બેંક/UPI ખાતામાં તપાસો, પછી એડમિન કન્સોલમાં ચકાસો.",
    confirmTitle: "તમારી VOPD એપોઇન્ટમેન્ટ પુષ્ટ થઈ છે",
    confirmBadge: "વિડિઓ OPD · પેમેન્ટ ચકાસાયું",
    confirmNote: "કૃપા કરીને થોડી મિનિટ પહેલાં નીચેની Google Meet લિંકથી જોડાઓ. રિપોર્ટ અને દવાઓની યાદી તૈયાર રાખો.",
    confirmNoMeet: "ક્લિનિક એપોઇન્ટમેન્ટ પહેલાં Google Meet લિંક શેર કરશે. રિપોર્ટ અને દવાઓની યાદી તૈયાર રાખો.",
    meetCta: "Google Meet માં જોડાઓ",
    meetNote: "એપોઇન્ટમેન્ટના સમયથી થોડી મિનિટ પહેલાં જોડાઓ.",
    calendarInviteNote: "તમને {sender} તરફથી Google Calendar નું આમંત્રણ પણ મળશે. જો Gmail કે Google Calendar “અજાણ્યો મોકલનાર” બતાવે, તો તે ખરેખર અમારા ક્લિનિક તરફથી છે — આમંત્રણ પર “હા” પસંદ કરો અથવા {sender} ને તમારા સંપર્કોમાં ઉમેરો.",
    meetSubject: "તમારી Google Meet લિંક",
  },
};

export const VOPD_I18N: Record<VopdLocale, VopdDict> = { en, hi, mr, gu };

export function vopdDict(locale: string | undefined | null): VopdDict {
  return VOPD_I18N[isVopdLocale(locale) ? locale : "en"];
}

/** Small helper for "{n}"-style templates. */
export function vopdFill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : match
  );
}
