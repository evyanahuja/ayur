/* Patient-facing VOPD copy in English, Hindi, Marathi and Gujarati.
   Pure data module: safe to import from client components and server routes.
   Admin console copy is intentionally English (single internal operator tool). */

export type VopdLocale = "en" | "hi" | "mr" | "gu";
export const VOPD_LOCALES: readonly VopdLocale[] = ["en", "hi", "mr", "gu"];

export function isVopdLocale(value: unknown): value is VopdLocale {
  return typeof value === "string" && (VOPD_LOCALES as readonly string[]).includes(value);
}

/** Clinic-date formatting in the visitor's language (still Asia/Kolkata time). */
export function formatVopdDateTime(iso: string, locale: VopdLocale = "en"): string {
  const tag = locale === "en" ? "en-IN" : `${locale}-IN`;
  try {
    return new Intl.DateTimeFormat(tag, {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  }
}

export type VopdDict = {
  selector: { question: string; opdTitle: string; opdSub: string; vopdTitle: string; vopdSub: string; hintOpd: string; hintVopd: string };
  steps: string[];
  paymentHeading: string;
  unavailable: string;
  patient: {
    who: string; child: string; adult: string; childHint: string; adultHint: string;
    guardian: string; childName: string; adultName: string; age: string; agePh: string;
    phoneChild: string; phoneAdult: string; email: string; gender: string; city: string; state: string;
    select: string; girl: string; boy: string; female: string; male: string; other: string;
    eGuardian: string; eChildName: string; eAdultName: string; eAge: string; ePhone: string; eEmail: string; requiredNote: string;
  };
  concern: {
    category: string; choose: string; symptoms: string; symptomsPh: string; eSymptoms: string; eCategory: string;
    duration: string; durationPh: string; previous: string; treatment: string; treatmentPh: string; advice: string; message: string;
  };
  plan: { loading: string; feeOnConfirm: string; usdNote: string; minutes: string; wellness: string; reserves: string; enquiryOnly: string; feeNote: string };
  slot: { date: string; note: string; hours: string; hoursValue: string; timingRule: string; checking: string; available: string; eSlot: string };
  review: {
    patient: string; guardian: string; category: string; plan: string; fee: string; when: string; reserved: string; minutes: string;
    consent: string; eConsent: string; privacyPre: string; privacyLink: string; privacyPost: string; emergency: string;
  };
  pay: {
    reference: string; plan: string; when: string; fee: string; status: string;
    noPayTitle: string; noPayBody: string; whatsapp: string;
    upiTitle: string; beneficiary: string; upiId: string; amount: string; mention: string; notConfigured: string; hold: string;
    payer: string; utr: string; utrPh: string; screenshot: string; chooseFile: string; eScreenshot: string; ePayer: string; eUtr: string;
    submit: string; disclaimer: string; receivedTitle: string; receivedBody: string; meeting: string; join: string;
    copy: string; copied: string; statusLabel: string;
  };
  nav: { back: string; continue: string; reserve: string; startAnother: string };
  footer: string;
  genericError: string;
  status: Record<string, string>;
  codes: Record<string, string>;
  emails: {
    greeting: string; ackTitle: string; ackBadge: string; ackNote: string; adminSubject: string; adminTitle: string;
    paymentTitle: string; paymentNote: string; confirmTitle: string; confirmBadge: string; confirmNote: string;
    confirmNoMeet: string; meetCta: string; meetNote: string; meetSubject: string;
  };
};

const en: VopdDict = {
  selector: {
    question: "How would you like to consult Dr. Priyanka?",
    opdTitle: "OPD — In-clinic consultation",
    opdSub: "Clinic visit enquiry. No online payment.",
    vopdTitle: "VOPD — Online video consultation",
    vopdSub: "30-minute slots, UPI payment, confirmed after verification.",
    hintOpd: "Your existing clinic appointment enquiry is unchanged — choose a preferred date and time and the clinic will call you.",
    hintVopd: "Reserve an available video slot, pay by UPI, and the clinic confirms after verifying the payment manually.",
  },
  steps: ["Patient details", "Health concern", "Consultation plan", "Date & time", "Review", "Payment"],
  paymentHeading: "Complete your UPI payment",
  unavailable: "Online video consultation booking is temporarily unavailable. Please call {phone} or WhatsApp the clinic.",
  patient: {
    who: "Who is the consultation for?", child: "Child", adult: "Adult",
    childHint: "Parent or guardian details are required for a child consultation.",
    adultHint: "Adult patients do not need to provide guardian details.",
    guardian: "Parent / Guardian full name *", childName: "Child's full name *", adultName: "Patient's full name *",
    age: "Date of birth or age *", agePh: "e.g. 12 May 2018 or 6 years",
    phoneChild: "Parent's mobile number *", phoneAdult: "Mobile number *", email: "Email address",
    gender: "Gender (optional)", city: "City", state: "State", select: "Select",
    girl: "Girl", boy: "Boy", female: "Female", male: "Male", other: "Other",
    eGuardian: "Enter the parent or guardian's full name.", eChildName: "Enter the child's full name.",
    eAdultName: "Enter the patient's full name.", eAge: "Enter the date of birth or age.",
    ePhone: "Enter a valid mobile number.", eEmail: "Enter a valid email address.",
    requiredNote: "Fields marked * are required. We collect only what is needed to arrange and deliver your consultation.",
  },
  concern: {
    category: "Select consultation category *", choose: "Choose a category", symptoms: "Main symptoms *",
    symptomsPh: "Describe what the patient is experiencing. Do not share full identity documents.",
    eSymptoms: "Please describe the main symptoms (at least 10 characters).", eCategory: "Choose a consultation category.",
    duration: "Duration of symptoms", durationPh: "e.g. 3 weeks, 6 months", previous: "Previous diagnosis (optional)",
    treatment: "Existing treatment or medicines (optional)", treatmentPh: "List current medicines and doses, or write 'none'.",
    advice: "Do not stop any prescribed medicine. This form is for appointment booking, not diagnosis.",
    message: "Additional message (optional)",
  },
  plan: {
    loading: "Loading consultation plans…", feeOnConfirm: "Fee on confirmation", usdNote: "≈ {usd} · UPI charged in INR",
    minutes: "{n} min session",
    wellness: "Includes the first {first}-minute consultation plus {follows} follow-ups of {followMin} minutes each, scheduled separately over 3 months. Not a single {followMin}-minute session.",
    reserves: "Reserves {n} minutes of the doctor's calendar.",
    enquiryOnly: "No online payment. The clinic will confirm scope, fee and timing.",
    feeNote: "Fees come from the clinic's existing pricing configuration. The payable amount is recalculated on the server when you reserve a slot.",
  },
  slot: {
    date: "Select consultation date", note: "Monday–Saturday, Asia/Kolkata time. Bookings open for the next 30 days.",
    hours: "Clinic hours", hoursValue: "10:00 AM–2:00 PM & 5:00 PM–8:00 PM IST",
    timingRule: "Start times every 30 minutes; {n}-minute reservation plus a scheduling buffer.",
    checking: "Checking live availability…", available: "Available start times ({n})", eSlot: "Choose an available time slot.",
  },
  review: {
    patient: "Patient", guardian: "Parent / Guardian", category: "Category", plan: "Plan", fee: "Fee", when: "Date & time",
    reserved: "Reserved time", minutes: "minutes",
    consent: "I understand this is a video consultation request, not an emergency service, and that it is confirmed only after the clinic verifies payment.",
    eConsent: "Please accept the consent statement.",
    privacyPre: "Read our", privacyLink: "privacy policy", privacyPost: ".",
    emergency: "If this is an emergency, call local emergency services instead of booking online.",
  },
  pay: {
    reference: "Booking reference", plan: "Plan", when: "Date & time", fee: "Consultation fee", status: "Status",
    noPayTitle: "Your request is saved. No UPI payment is collected for this option.",
    noPayBody: "The clinic will confirm scope, fee if any, and your appointment. This is not yet a confirmed appointment.",
    whatsapp: "Message the clinic on WhatsApp",
    upiTitle: "Pay by UPI, then submit the transaction reference",
    beneficiary: "Beneficiary", upiId: "UPI ID", amount: "Amount", mention: "Reference to mention",
    notConfigured: "Online UPI details are not configured yet. Please call the clinic or WhatsApp with reference {ref} to complete payment. Do not send money to an unverified account.",
    hold: "Slot held until {time} IST. Submit payment details before then.",
    payer: "Name used to pay *", utr: "UPI transaction reference / UTR *", utrPh: "e.g. 123456789012",
    screenshot: "Payment screenshot (optional, max 2 MB)", chooseFile: "Choose PNG, JPG or WebP",
    eScreenshot: "Screenshot must be under 2 MB.", ePayer: "Enter the payer name.",
    eUtr: "Enter the UTR from your UPI app (6–40 letters/numbers).",
    submit: "I Have Completed Payment",
    disclaimer: "Submitting a UTR or screenshot does not confirm your appointment. The clinic verifies the payment in its bank/UPI account.",
    receivedTitle: "Your online consultation request has been received.",
    receivedBody: "Your appointment will be confirmed after payment verification. Your slot is held while the clinic checks its account. Reference: {ref}.",
    meeting: "Meeting link", join: "Join Google Meet", copy: "Copy reference", copied: "Copied", statusLabel: "Status",
  },
  nav: { back: "Back", continue: "Continue", reserve: "Reserve slot & continue to payment", startAnother: "Start another booking" },
  footer: "Video consultation is for assessment and advice. It does not replace emergency care or in-person examination when needed.",
  genericError: "Could not reserve this slot. Please review your details and try again.",
  status: {
    SLOT_RESERVED: "Slot reserved",
    PAYMENT_PENDING: "Payment pending",
    PAYMENT_VERIFICATION_PENDING: "Awaiting manual payment verification",
    PAYMENT_VERIFIED: "Payment verified · confirming appointment",
    CONFIRMED: "Appointment confirmed",
    REJECTED: "Payment could not be verified — contact the clinic",
    CANCELLED: "Booking cancelled",
    EXPIRED: "Reservation expired",
    COMPLETED: "Consultation completed",
  },
  codes: {
    SLOT_TAKEN: "That slot was just taken. Please choose another time.",
    SLOT_BLOCKED: "The clinic is unavailable at that time.",
    PAST_SLOT: "That time has passed. Please choose a later slot.",
    INVALID_SLOT: "That time is not a valid consultation slot.",
    HOLD_EXPIRED: "Your slot hold expired before payment was submitted. The clinic will help resolve a payment made after expiry — call +91 98607 75010 with your reference.",
    PAYMENT_ALREADY_SUBMITTED: "Payment details have already been submitted for this booking.",
    RESERVATION_CLOSED: "This reservation has expired or been cancelled. Please start a new booking.",
    NOT_FOUND: "Booking not found.",
  },
  emails: {
    greeting: "Namaste",
    ackTitle: "Your online consultation request has been received",
    ackBadge: "Video OPD · Awaiting payment verification",
    ackNote: "Your appointment will be confirmed after payment verification. This email is not a confirmation of the appointment.",
    adminSubject: "New VOPD booking",
    adminTitle: "New VOPD booking received",
    paymentTitle: "Payment reference submitted",
    paymentNote: "This is NOT a verification. Check the clinic bank/UPI account, then verify in the admin console.",
    confirmTitle: "Your VOPD appointment is confirmed",
    confirmBadge: "Video OPD · Payment verified",
    confirmNote: "Join a few minutes early using the secure Google Meet link below. Please keep reports and a medicine list ready.",
    confirmNoMeet: "The clinic will share your secure Google Meet link before the appointment. Please keep reports and a medicine list ready.",
    meetCta: "Join Google Meet",
    meetNote: "Join a few minutes before your appointment time. Do not share this private link.",
    meetSubject: "Your Google Meet link",
  },
};

const hi: VopdDict = {
  selector: {
    question: "आप डॉ. प्रियंका से किस प्रकार परामर्श लेना चाहेंगे?",
    opdTitle: "OPD — क्लिनिक में परामर्श",
    opdSub: "क्लिनिक विज़िट पूछताछ। कोई ऑनलाइन भुगतान नहीं।",
    vopdTitle: "VOPD — ऑनलाइन वीडियो परामर्श",
    vopdSub: "30 मिनट के स्लॉट, UPI भुगतान, सत्यापन के बाद पुष्टि।",
    hintOpd: "आपकी मौजूदा क्लिनिक अपॉइंटमेंट पूछताछ अपरिवर्तित है — पसंदीदा तारीख और समय चुनें, क्लिनिक आपको कॉल करेगा।",
    hintVopd: "उपलब्ध वीडियो स्लॉट आरक्षित करें, UPI से भुगतान करें, क्लिनिक मैन्युअल सत्यापन के बाद पुष्टि करेगा।",
  },
  steps: ["मरीज़ का विवरण", "स्वास्थ्य समस्या", "परामर्श योजना", "तारीख और समय", "समीक्षा", "भुगतान"],
  paymentHeading: "अपना UPI भुगतान पूरा करें",
  unavailable: "ऑनलाइन वीडियो परामर्श बुकिंग अभी उपलब्ध नहीं है। कृपया {phone} पर कॉल करें या क्लिनिक को WhatsApp करें।",
  patient: {
    who: "परामर्श किसके लिए है?", child: "बच्चा", adult: "वयस्क",
    childHint: "बच्चे के परामर्श के लिए माता-पिता या अभिभावक का विवरण आवश्यक है।",
    adultHint: "वयस्क मरीज़ों को अभिभावक विवरण देने की आवश्यकता नहीं है।",
    guardian: "माता-पिता / अभिभावक का पूरा नाम *", childName: "बच्चे का पूरा नाम *", adultName: "मरीज़ का पूरा नाम *",
    age: "जन्म तिथि या आयु *", agePh: "जैसे 12 मई 2018 या 6 वर्ष",
    phoneChild: "माता-पिता का मोबाइल नंबर *", phoneAdult: "मोबाइल नंबर *", email: "ईमेल पता",
    gender: "लिंग (वैकल्पिक)", city: "शहर", state: "राज्य", select: "चुनें",
    girl: "लड़की", boy: "लड़का", female: "महिला", male: "पुरुष", other: "अन्य",
    eGuardian: "कृपया अभिभावक का पूरा नाम लिखें।", eChildName: "कृपया बच्चे का पूरा नाम लिखें।",
    eAdultName: "कृपया मरीज़ का पूरा नाम लिखें।", eAge: "कृपया जन्म तिथि या आयु लिखें।",
    ePhone: "कृपया सही मोबाइल नंबर लिखें।", eEmail: "कृपया सही ईमेल पता लिखें।",
    requiredNote: "* वाले क्षेत्र आवश्यक हैं। हम केवल परामर्श व्यवस्थित करने के लिए आवश्यक जानकारी लेते हैं।",
  },
  concern: {
    category: "परामर्श श्रेणी चुनें *", choose: "श्रेणी चुनें", symptoms: "मुख्य लक्षण *",
    symptomsPh: "मरीज़ को क्या हो रहा है बताएँ। पहचान दस्तावेज़ साझा न करें।",
    eSymptoms: "कृपया मुख्य लक्षण लिखें (कम से कम 10 अक्षर)।", eCategory: "कृपया परामर्श श्रेणी चुनें।",
    duration: "लक्षणों की अवधि", durationPh: "जैसे 3 सप्ताह, 6 महीने", previous: "पिछला निदान (वैकल्पिक)",
    treatment: "चालू उपचार या दवाएँ (वैकल्पिक)", treatmentPh: "चालू दवाएँ व मात्रा लिखें, या 'कोई नहीं' लिखें।",
    advice: "डॉक्टर की लिखी कोई दवा बंद न करें। यह फॉर्म अपॉइंटमेंट बुकिंग के लिए है, निदान के लिए नहीं।",
    message: "अतिरिक्त संदेश (वैकल्पिक)",
  },
  plan: {
    loading: "परामर्श योजनाएँ लोड हो रही हैं…", feeOnConfirm: "शुल्क पुष्टि पर", usdNote: "≈ {usd} · UPI INR में लिया जाएगा",
    minutes: "{n} मिनट सत्र",
    wellness: "इसमें पहला {first}-मिनट परामर्श और {follows} फॉलो-अप शामिल हैं, प्रत्येक {followMin} मिनट, जो 3 महीनों में अलग से तय होंगे। यह एक {followMin}-मिनट सत्र नहीं है।",
    reserves: "डॉक्टर के कैलेंडर में {n} मिनट आरक्षित करता है।",
    enquiryOnly: "ऑनलाइन भुगतान नहीं। क्लिनिक दायरा, शुल्क और समय की पुष्टि करेगा।",
    feeNote: "शुल्क क्लिनिक की मौजूदा मूल्य सेटिंग से आते हैं। स्लॉट आरक्षित करते समय सर्वर देय राशि की पुनर्गणना करता है।",
  },
  slot: {
    date: "परामर्श तिथि चुनें", note: "सोम–शनि, भारतीय समय (IST)। बुकिंग अगले 30 दिनों के लिए खुली है।",
    hours: "क्लिनिक समय", hoursValue: "सुबह 10:00–दोपहर 2:00 और शाम 5:00–रात 8:00 IST",
    timingRule: "हर 30 मिनट पर शुरुआती समय; {n}-मिनट आरक्षण और शेड्यूलिंग बफर।",
    checking: "उपलब्धता जाँची जा रही है…", available: "उपलब्ध शुरुआती समय ({n})", eSlot: "कृपया उपलब्ध समय चुनें।",
  },
  review: {
    patient: "मरीज़", guardian: "माता-पिता / अभिभावक", category: "श्रेणी", plan: "योजना", fee: "शुल्क", when: "तारीख और समय",
    reserved: "आरक्षित समय", minutes: "मिनट",
    consent: "मैं समझता/समझती हूँ कि यह वीडियो परामर्श अनुरोध है, आपातकालीन सेवा नहीं, और क्लिनिक भुगतान सत्यापित करने के बाद ही पुष्टि होगी।",
    eConsent: "कृपया सहमति कथन स्वीकार करें।",
    privacyPre: "हमारी", privacyLink: "गोपनीयता नीति", privacyPost: " पढ़ें।",
    emergency: "यदि यह आपात स्थिति है, तो ऑनलाइन बुकिंग के बजाय स्थानीय आपातकालीन सेवा को कॉल करें।",
  },
  pay: {
    reference: "बुकिंग संदर्भ", plan: "योजना", when: "तारीख और समय", fee: "परामर्श शुल्क", status: "स्थिति",
    noPayTitle: "आपका अनुरोध सुरक्षित है। इस विकल्प के लिए कोई UPI भुगतान नहीं लिया जाता।",
    noPayBody: "क्लिनिक दायरा, शुल्क (यदि हो) और अपॉइंटमेंट की पुष्टि करेगा। यह अभी पुष्ट अपॉइंटमेंट नहीं है।",
    whatsapp: "WhatsApp पर क्लिनिक को संदेश भेजें",
    upiTitle: "UPI से भुगतान करें, फिर ट्रांजैक्शन संदर्भ दर्ज करें",
    beneficiary: "लाभार्थी", upiId: "UPI आईडी", amount: "राशि", mention: "उल्लेख करने योग्य संदर्भ",
    notConfigured: "ऑनलाइन UPI विवरण अभी सेट नहीं हैं। भुगतान पूरा करने के लिए संदर्भ {ref} के साथ क्लिनिक को कॉल करें या WhatsApp करें। असत्यापित खाते में पैसा न भेजें।",
    hold: "स्लॉट {time} IST तक आरक्षित है। उससे पहले भुगतान विवरण दर्ज करें।",
    payer: "भुगतान करने वाले का नाम *", utr: "UPI ट्रांजैक्शन संदर्भ / UTR *", utrPh: "जैसे 123456789012",
    screenshot: "भुगतान स्क्रीनशॉट (वैकल्पिक, अधिकतम 2 MB)", chooseFile: "PNG, JPG या WebP चुनें",
    eScreenshot: "स्क्रीनशॉट 2 MB से छोटा होना चाहिए।", ePayer: "कृपया भुगतान करने वाले का नाम लिखें।",
    eUtr: "कृपया अपने UPI ऐप का UTR लिखें (6–40 अक्षर/अंक)।",
    submit: "मैंने भुगतान पूरा कर दिया है",
    disclaimer: "UTR या स्क्रीनशॉट जमा करने से अपॉइंटमेंट पुष्ट नहीं होता। क्लिनिक अपने बैंक/UPI खाते में भुगतान सत्यापित करता है।",
    receivedTitle: "आपका ऑनलाइन परामर्श अनुरोध प्राप्त हुआ है।",
    receivedBody: "भुगतान सत्यापन के बाद आपकी अपॉइंटमेंट पुष्ट होगी। जब तक क्लिनिक अपना खाता जाँचता है, आपका स्लॉट आरक्षित है। संदर्भ: {ref}।",
    meeting: "मीटिंग लिंक", join: "Google Meet में शामिल हों", copy: "संदर्भ कॉपी करें", copied: "कॉपी हो गया", statusLabel: "स्थिति",
  },
  nav: { back: "पीछे", continue: "आगे बढ़ें", reserve: "स्लॉट आरक्षित करें और भुगतान पर जाएँ", startAnother: "नई बुकिंग शुरू करें" },
  footer: "वीडियो परामर्श मूल्यांकन और सलाह के लिए है। यह आवश्यक होने पर आपातकालीन देखभाल या प्रत्यक्ष जाँच का विकल्प नहीं है।",
  genericError: "यह स्लॉट आरक्षित नहीं हो सका। कृपया अपना विवरण जाँचें और पुनः प्रयास करें।",
  status: {
    SLOT_RESERVED: "स्लॉट आरक्षित",
    PAYMENT_PENDING: "भुगतान लंबित",
    PAYMENT_VERIFICATION_PENDING: "मैन्युअल भुगतान सत्यापन की प्रतीक्षा",
    PAYMENT_VERIFIED: "भुगतान सत्यापित · अपॉइंटमेंट की पुष्टि हो रही है",
    CONFIRMED: "अपॉइंटमेंट पुष्ट",
    REJECTED: "भुगतान सत्यापित नहीं हो सका — क्लिनिक से संपर्क करें",
    CANCELLED: "बुकिंग रद्द",
    EXPIRED: "आरक्षण समाप्त",
    COMPLETED: "परामर्श पूर्ण",
  },
  codes: {
    SLOT_TAKEN: "यह स्लॉट अभी बुक हो गया। कृपया दूसरा समय चुनें।",
    SLOT_BLOCKED: "उस समय क्लिनिक उपलब्ध नहीं है।",
    PAST_SLOT: "यह समय बीत चुका है। कृपया बाद का स्लॉट चुनें।",
    INVALID_SLOT: "यह समय मान्य परामर्श स्लॉट नहीं है।",
    HOLD_EXPIRED: "भुगतान जमा करने से पहले आपका स्लॉट होल्ड समाप्त हो गया। समाप्ति के बाद किए गए भुगतान के समाधान के लिए संदर्भ के साथ +91 98607 75010 पर कॉल करें।",
    PAYMENT_ALREADY_SUBMITTED: "इस बुकिंग के लिए भुगतान विवरण पहले ही जमा हो चुके हैं।",
    RESERVATION_CLOSED: "यह आरक्षण समाप्त या रद्द हो चुका है। कृपया नई बुकिंग शुरू करें।",
    NOT_FOUND: "बुकिंग नहीं मिली।",
  },
  emails: {
    greeting: "नमस्ते",
    ackTitle: "आपका ऑनलाइन परामर्श अनुरोध प्राप्त हुआ है",
    ackBadge: "वीडियो OPD · भुगतान सत्यापन की प्रतीक्षा",
    ackNote: "भुगतान सत्यापन के बाद आपकी अपॉइंटमेंट पुष्ट होगी। यह ईमेल अपॉइंटमेंट की पुष्टि नहीं है।",
    adminSubject: "नई VOPD बुकिंग",
    adminTitle: "नई VOPD बुकिंग प्राप्त हुई",
    paymentTitle: "भुगतान संदर्भ जमा हुआ",
    paymentNote: "यह सत्यापन नहीं है। क्लिनिक के बैंक/UPI खाते की जाँच करें, फिर एडमिन कंसोल में सत्यापित करें।",
    confirmTitle: "आपकी VOPD अपॉइंटमेंट पुष्ट हो गई है",
    confirmBadge: "वीडियो OPD · भुगतान सत्यापित",
    confirmNote: "कृपया कुछ मिनट पहले नीचे दिए सुरक्षित Google Meet लिंक से जुड़ें। रिपोर्ट और दवाओं की सूची तैयार रखें।",
    confirmNoMeet: "क्लिनिक अपॉइंटमेंट से पहले आपका सुरक्षित Google Meet लिंक साझा करेगा। रिपोर्ट और दवाओं की सूची तैयार रखें।",
    meetCta: "Google Meet में शामिल हों",
    meetNote: "अपॉइंटमेंट समय से कुछ मिनट पहले जुड़ें। यह निजी लिंक साझा न करें।",
    meetSubject: "आपका Google Meet लिंक",
  },
};

const mr: VopdDict = {
  selector: {
    question: "तुम्हाला डॉ. प्रियंका यांच्याकडून कोणत्या पद्धतीने सल्ला हवा आहे?",
    opdTitle: "OPD — क्लिनिकमध्ये सल्ला",
    opdSub: "क्लिनिक भेटीची चौकशी. ऑनलाइन पेमेंट नाही.",
    vopdTitle: "VOPD — ऑनलाइन व्हिडिओ सल्ला",
    vopdSub: "30 मिनिटांचे स्लॉट, UPI पेमेंट, पडताळणीनंतर पुष्टी.",
    hintOpd: "तुमची सध्याची क्लिनिक अपॉइंटमेंट चौकशी बदललेली नाही — पसंतीची तारीख व वेळ निवडा, क्लिनिक तुम्हाला कॉल करेल.",
    hintVopd: "उपलब्ध व्हिडिओ स्लॉट आरक्षित करा, UPI ने पैसे भरा, क्लिनिक मॅन्युअल पडताळणीनंतर पुष्टी करेल.",
  },
  steps: ["रुग्णाचा तपशील", "आरोग्य समस्या", "सल्ला योजना", "तारीख व वेळ", "आढावा", "पेमेंट"],
  paymentHeading: "तुमचे UPI पेमेंट पूर्ण करा",
  unavailable: "ऑनलाइन व्हिडिओ सल्ला बुकिंग सध्या उपलब्ध नाही. कृपया {phone} वर कॉल करा किंवा क्लिनिकला WhatsApp करा.",
  patient: {
    who: "सल्ला कोणासाठी आहे?", child: "मूल", adult: "प्रौढ",
    childHint: "मुलाच्या सल्ल्यासाठी पालकाचा तपशील आवश्यक आहे.",
    adultHint: "प्रौढ रुग्णांना पालकाचा तपशील देण्याची गरज नाही.",
    guardian: "पालक / संरक्षकाचे पूर्ण नाव *", childName: "मुलाचे पूर्ण नाव *", adultName: "रुग्णाचे पूर्ण नाव *",
    age: "जन्मतारीख किंवा वय *", agePh: "उदा. 12 मे 2018 किंवा 6 वर्षे",
    phoneChild: "पालकाचा मोबाइल क्रमांक *", phoneAdult: "मोबाइल क्रमांक *", email: "ईमेल पत्ता",
    gender: "लिंग (ऐच्छिक)", city: "शहर", state: "राज्य", select: "निवडा",
    girl: "मुलगी", boy: "मुलगा", female: "स्त्री", male: "पुरुष", other: "इतर",
    eGuardian: "कृपया पालकाचे पूर्ण नाव लिहा.", eChildName: "कृपया मुलाचे पूर्ण नाव लिहा.",
    eAdultName: "कृपया रुग्णाचे पूर्ण नाव लिहा.", eAge: "कृपया जन्मतारीख किंवा वय लिहा.",
    ePhone: "कृपया योग्य मोबाइल क्रमांक लिहा.", eEmail: "कृपया योग्य ईमेल पत्ता लिहा.",
    requiredNote: "* असलेली क्षेत्रे आवश्यक आहेत. सल्ला आयोजित करण्यासाठी आवश्यक माहितीच आम्ही घेतो.",
  },
  concern: {
    category: "सल्ला श्रेणी निवडा *", choose: "श्रेणी निवडा", symptoms: "मुख्य लक्षणे *",
    symptomsPh: "रुग्णाला काय होत आहे ते सांगा. ओळखपत्रे सामायिक करू नका.",
    eSymptoms: "कृपया मुख्य लक्षणे लिहा (किमान 10 अक्षरे).", eCategory: "कृपया सल्ला श्रेणी निवडा.",
    duration: "लक्षणांचा कालावधी", durationPh: "उदा. 3 आठवडे, 6 महिने", previous: "पूर्वीचे निदान (ऐच्छिक)",
    treatment: "चालू उपचार किंवा औषधे (ऐच्छिक)", treatmentPh: "चालू औषधे व मात्रा लिहा, किंवा 'काही नाही'.",
    advice: "डॉक्टरांनी दिलेले औषध बंद करू नका. हा फॉर्म अपॉइंटमेंट बुकिंगसाठी आहे, निदानासाठी नाही.",
    message: "अतिरिक्त संदेश (ऐच्छिक)",
  },
  plan: {
    loading: "सल्ला योजना लोड होत आहेत…", feeOnConfirm: "शुल्क पुष्टीनंतर", usdNote: "≈ {usd} · UPI INR मध्ये घेतले जाईल",
    minutes: "{n} मिनिटे सत्र",
    wellness: "यात पहिले {first}-मिनिटांचे सल्ला सत्र आणि प्रत्येकी {followMin} मिनिटांचे {follows} फॉलो-अप समाविष्ट आहेत, जे 3 महिन्यांत स्वतंत्रपणे ठरवले जातील. हे एकच {followMin}-मिनिटांचे सत्र नाही.",
    reserves: "डॉक्टरांच्या कॅलेंडरमध्ये {n} मिनिटे आरक्षित करते.",
    enquiryOnly: "ऑनलाइन पेमेंट नाही. क्लिनिक कार्यक्षेत्र, शुल्क व वेळेची पुष्टी करेल.",
    feeNote: "शुल्क क्लिनिकच्या सध्याच्या किंमत सेटिंगमधून येतात. स्लॉट आरक्षित करताना सर्व्हर देय रक्कम पुन्हा मोजतो.",
  },
  slot: {
    date: "सल्ला तारीख निवडा", note: "सोम–शनि, भारतीय वेळ (IST). बुकिंग पुढील 30 दिवसांसाठी खुली आहे.",
    hours: "क्लिनिक वेळा", hoursValue: "सकाळी 10:00–दुपारी 2:00 आणि संध्याकाळी 5:00–रात्री 8:00 IST",
    timingRule: "दर 30 मिनिटांनी सुरुवातीची वेळ; {n}-मिनिटे आरक्षण आणि बफर.",
    checking: "उपलब्धता तपासत आहे…", available: "उपलब्ध सुरुवातीच्या वेळा ({n})", eSlot: "कृपया उपलब्ध वेळ निवडा.",
  },
  review: {
    patient: "रुग्ण", guardian: "पालक / संरक्षक", category: "श्रेणी", plan: "योजना", fee: "शुल्क", when: "तारीख व वेळ",
    reserved: "आरक्षित वेळ", minutes: "मिनिटे",
    consent: "ही व्हिडिओ सल्ला विनंती आहे, आपत्कालीन सेवा नाही आणि क्लिनिक पेमेंट पडताळल्यानंतरच पुष्टी होईल, हे मला समजते.",
    eConsent: "कृपया संमती विधान स्वीकारा.",
    privacyPre: "आमचे", privacyLink: "गोपनीयता धोरण", privacyPost: " वाचा.",
    emergency: "ही आपत्कालीन स्थिती असल्यास ऑनलाइन बुकिंगऐवजी स्थानिक आपत्कालीन सेवेला कॉल करा.",
  },
  pay: {
    reference: "बुकिंग संदर्भ", plan: "योजना", when: "तारीख व वेळ", fee: "सल्ला शुल्क", status: "स्थिती",
    noPayTitle: "तुमची विनंती जतन झाली आहे. या पर्यायासाठी UPI पेमेंट घेतले जात नाही.",
    noPayBody: "क्लिनिक कार्यक्षेत्र, शुल्क (असल्यास) आणि अपॉइंटमेंटची पुष्टी करेल. ही अद्याप पक्की अपॉइंटमेंट नाही.",
    whatsapp: "WhatsApp वर क्लिनिकला संदेश पाठवा",
    upiTitle: "UPI ने पैसे भरा, नंतर व्यवहार संदर्भ नोंदवा",
    beneficiary: "लाभार्थी", upiId: "UPI आयडी", amount: "रक्कम", mention: "नमूद करायचा संदर्भ",
    notConfigured: "ऑनलाइन UPI तपशील सेट केलेले नाहीत. पेमेंट पूर्ण करण्यासाठी संदर्भ {ref} सह क्लिनिकला कॉल करा किंवा WhatsApp करा. असत्यापित खात्यात पैसे पाठवू नका.",
    hold: "स्लॉट {time} IST पर्यंत आरक्षित आहे. त्यापूर्वी पेमेंट तपशील नोंदवा.",
    payer: "पैसे भरलेल्याचे नाव *", utr: "UPI व्यवहार संदर्भ / UTR *", utrPh: "उदा. 123456789012",
    screenshot: "पेमेंट स्क्रीनशॉट (ऐच्छिक, कमाल 2 MB)", chooseFile: "PNG, JPG किंवा WebP निवडा",
    eScreenshot: "स्क्रीनशॉट 2 MB पेक्षा कमी असावा.", ePayer: "कृपया पैसे भरलेल्याचे नाव लिहा.",
    eUtr: "कृपया तुमच्या UPI ॲपमधील UTR लिहा (6–40 अक्षरे/अंक).",
    submit: "मी पेमेंट पूर्ण केले आहे",
    disclaimer: "UTR किंवा स्क्रीनशॉट सबमिट केल्याने अपॉइंटमेंट पक्की होत नाही. क्लिनिक आपल्या बँक/UPI खात्यात पेमेंट पडताळते.",
    receivedTitle: "तुमची ऑनलाइन सल्ला विनंती मिळाली आहे.",
    receivedBody: "पेमेंट पडताळणीनंतर तुमची अपॉइंटमेंट पक्की होईल. क्लिनिक खाते तपासत असताना तुमचा स्लॉट आरक्षित आहे. संदर्भ: {ref}.",
    meeting: "मीटिंग लिंक", join: "Google Meet मध्ये सामील व्हा", copy: "संदर्भ कॉपी करा", copied: "कॉपी झाले", statusLabel: "स्थिती",
  },
  nav: { back: "मागे", continue: "पुढे", reserve: "स्लॉट आरक्षित करा आणि पेमेंटकडे जा", startAnother: "नवीन बुकिंग सुरू करा" },
  footer: "व्हिडिओ सल्ला हा मूल्यांकन व मार्गदर्शनासाठी आहे. गरज असल्यास आपत्कालीन काळजी किंवा प्रत्यक्ष तपासणीचा पर्याय नाही.",
  genericError: "हा स्लॉट आरक्षित करता आला नाही. कृपया तपशील तपासून पुन्हा प्रयत्न करा.",
  status: {
    SLOT_RESERVED: "स्लॉट आरक्षित",
    PAYMENT_PENDING: "पेमेंट प्रलंबित",
    PAYMENT_VERIFICATION_PENDING: "मॅन्युअल पेमेंट पडताळणीची प्रतीक्षा",
    PAYMENT_VERIFIED: "पेमेंट पडताळले · अपॉइंटमेंट पुष्टी होत आहे",
    CONFIRMED: "अपॉइंटमेंट पक्की",
    REJECTED: "पेमेंट पडताळता आले नाही — क्लिनिकशी संपर्क करा",
    CANCELLED: "बुकिंग रद्द",
    EXPIRED: "आरक्षण संपले",
    COMPLETED: "सल्ला पूर्ण",
  },
  codes: {
    SLOT_TAKEN: "हा स्लॉट नुकताच बुक झाला. कृपया दुसरी वेळ निवडा.",
    SLOT_BLOCKED: "त्या वेळी क्लिनिक उपलब्ध नाही.",
    PAST_SLOT: "ही वेळ संपली आहे. कृपया नंतरचा स्लॉट निवडा.",
    INVALID_SLOT: "ही वेळ वैध सल्ला स्लॉट नाही.",
    HOLD_EXPIRED: "पेमेंट सबमिट करण्यापूर्वी तुमचा स्लॉट होल्ड संपला. संपल्यानंतर केलेल्या पेमेंटसाठी संदर्भासह +91 98607 75010 वर कॉल करा.",
    PAYMENT_ALREADY_SUBMITTED: "या बुकिंगसाठी पेमेंट तपशील आधीच सबमिट केले आहेत.",
    RESERVATION_CLOSED: "हे आरक्षण संपले किंवा रद्द झाले आहे. कृपया नवीन बुकिंग सुरू करा.",
    NOT_FOUND: "बुकिंग सापडली नाही.",
  },
  emails: {
    greeting: "नमस्ते",
    ackTitle: "तुमची ऑनलाइन सल्ला विनंती मिळाली आहे",
    ackBadge: "व्हिडिओ OPD · पेमेंट पडताळणीची प्रतीक्षा",
    ackNote: "पेमेंट पडताळणीनंतर तुमची अपॉइंटमेंट पक्की होईल. हा ईमेल अपॉइंटमेंटची पुष्टी नाही.",
    adminSubject: "नवीन VOPD बुकिंग",
    adminTitle: "नवीन VOPD बुकिंग मिळाली",
    paymentTitle: "पेमेंट संदर्भ सबमिट झाला",
    paymentNote: "हे पडताळणी नाही. क्लिनिकच्या बँक/UPI खात्यात तपासा, नंतर अ‍ॅडमिन कन्सोलमध्ये पडताळा.",
    confirmTitle: "तुमची VOPD अपॉइंटमेंट पक्की झाली आहे",
    confirmBadge: "व्हिडिओ OPD · पेमेंट पडताळले",
    confirmNote: "कृपया काही मिनिटे आधी खालील सुरक्षित Google Meet लिंकने सामील व्हा. अहवाल व औषधांची यादी तयार ठेवा.",
    confirmNoMeet: "क्लिनिक अपॉइंटमेंटपूर्वी तुमची सुरक्षित Google Meet लिंक सामायिक करेल. अहवाल व औषधांची यादी तयार ठेवा.",
    meetCta: "Google Meet मध्ये सामील व्हा",
    meetNote: "अपॉइंटमेंटच्या काही मिनिटे आधी सामील व्हा. ही खाजगी लिंक सामायिक करू नका.",
    meetSubject: "तुमची Google Meet लिंक",
  },
};

const gu: VopdDict = {
  selector: {
    question: "તમે ડૉ. પ્રિયંકા સાથે કેવી રીતે પરામર્શ કરવા માંગો છો?",
    opdTitle: "OPD — ક્લિનિકમાં પરામર્શ",
    opdSub: "ક્લિનિક મુલાકાત પૂછપરછ. ઓનલાઇન પેમેન્ટ નહીં.",
    vopdTitle: "VOPD — ઓનલાઇન વિડિઓ પરામર્શ",
    vopdSub: "30 મિનિટ સ્લોટ, UPI પેમેન્ટ, ચકાસણી પછી પુષ્ટિ.",
    hintOpd: "તમારી હાલની ક્લિનિક એપોઇન્ટમેન્ટ પૂછપરછ બદલાયેલી નથી — પસંદગીની તારીખ અને સમય પસંદ કરો, ક્લિનિક તમને કૉલ કરશે.",
    hintVopd: "ઉપલબ્ધ વિડિઓ સ્લોટ આરક્ષિત કરો, UPI થી ચૂકવો, ક્લિનિક મેન્યુઅલ ચકાસણી પછી પુષ્ટિ કરશે.",
  },
  steps: ["દર્દીની વિગતો", "આરોગ્ય સમસ્યા", "પરામર્શ યોજના", "તારીખ અને સમય", "સમીક્ષા", "પેમેન્ટ"],
  paymentHeading: "તમારું UPI પેમેન્ટ પૂર્ણ કરો",
  unavailable: "ઓનલાઇન વિડિઓ પરામર્શ બુકિંગ હાલ ઉપલબ્ધ નથી. કૃપા કરીને {phone} પર કૉલ કરો અથવા ક્લિનિકને WhatsApp કરો.",
  patient: {
    who: "પરામર્શ કોના માટે છે?", child: "બાળક", adult: "પુખ્ત",
    childHint: "બાળકના પરામર્શ માટે વાલીની વિગતો જરૂરી છે.",
    adultHint: "પુખ્ત દર્દીઓએ વાલીની વિગતો આપવાની જરૂર નથી.",
    guardian: "વાલી / સંભાળનારનું પૂરું નામ *", childName: "બાળકનું પૂરું નામ *", adultName: "દર્દીનું પૂરું નામ *",
    age: "જન્મ તારીખ અથવા ઉંમર *", agePh: "દા.ત. 12 મે 2018 અથવા 6 વર્ષ",
    phoneChild: "વાલીનો મોબાઇલ નંબર *", phoneAdult: "મોબાઇલ નંબર *", email: "ઇમેઇલ સરનામું",
    gender: "લિંગ (વૈકલ્પિક)", city: "શહેર", state: "રાજ્ય", select: "પસંદ કરો",
    girl: "બાળકી", boy: "બાળક", female: "સ્ત્રી", male: "પુરુષ", other: "અન્ય",
    eGuardian: "કૃપા કરીને વાલીનું પૂરું નામ લખો.", eChildName: "કૃપા કરીને બાળકનું પૂરું નામ લખો.",
    eAdultName: "કૃપા કરીને દર્દીનું પૂરું નામ લખો.", eAge: "કૃપા કરીને જન્મ તારીખ અથવા ઉંમર લખો.",
    ePhone: "કૃપા કરીને માન્ય મોબાઇલ નંબર લખો.", eEmail: "કૃપા કરીને માન્ય ઇમેઇલ લખો.",
    requiredNote: "* વાળી વિગતો જરૂરી છે. પરામર્શ ગોઠવવા માટે જરૂરી માહિતી જ અમે લઈએ છીએ.",
  },
  concern: {
    category: "પરામર્શ શ્રેણી પસંદ કરો *", choose: "શ્રેણી પસંદ કરો", symptoms: "મુખ્ય લક્ષણો *",
    symptomsPh: "દર્દીને શું થઈ રહ્યું છે તે જણાવો. ઓળખપત્રો શેર ન કરો.",
    eSymptoms: "કૃપા કરીને મુખ્ય લક્ષણો લખો (ઓછામાં ઓછા 10 અક્ષર).", eCategory: "કૃપા કરીને પરામર્શ શ્રેણી પસંદ કરો.",
    duration: "લક્ષણોનો સમયગાળો", durationPh: "દા.ત. 3 અઠવાડિયાં, 6 મહિના", previous: "અગાઉનું નિદાન (વૈકલ્પિક)",
    treatment: "ચાલુ સારવાર અથવા દવાઓ (વૈકલ્પિક)", treatmentPh: "ચાલુ દવાઓ અને માત્રા લખો, અથવા 'કંઈ નહીં'.",
    advice: "ડૉક્ટરે લખેલી દવા બંધ ન કરો. આ ફોર્મ એપોઇન્ટમેન્ટ બુકિંગ માટે છે, નિદાન માટે નહીં.",
    message: "વધારાનો સંદેશ (વૈકલ્પિક)",
  },
  plan: {
    loading: "પરામર્શ યોજનાઓ લોડ થઈ રહી છે…", feeOnConfirm: "ફી પુષ્ટિ પર", usdNote: "≈ {usd} · UPI INR માં લેવાશે",
    minutes: "{n} મિનિટ સત્ર",
    wellness: "આમાં પ્રથમ {first}-મિનિટ પરામર્શ અને દરેક {followMin} મિનિટના {follows} ફોલો-અપ સામેલ છે, જે 3 મહિનામાં અલગથી ગોઠવાશે. આ એક {followMin}-મિનિટ સત્ર નથી.",
    reserves: "ડૉક્ટરના કેલેન્ડરમાં {n} મિનિટ આરક્ષિત કરે છે.",
    enquiryOnly: "ઓનલાઇન પેમેન્ટ નહીં. ક્લિનિક કાર્યક્ષેત્ર, ફી અને સમયની પુષ્ટિ કરશે.",
    feeNote: "ફી ક્લિનિકની હાલની કિંમત સેટિંગમાંથી આવે છે. સ્લોટ આરક્ષિત કરતી વખતે સર્વર ચૂકવવાની રકમ ફરી ગણે છે.",
  },
  slot: {
    date: "પરામર્શ તારીખ પસંદ કરો", note: "સોમ–શનિ, ભારતીય સમય (IST). બુકિંગ આગામી 30 દિવસ માટે ખુલ્લી છે.",
    hours: "ક્લિનિક સમય", hoursValue: "સવારે 10:00–બપોરે 2:00 અને સાંજે 5:00–રાત્રે 8:00 IST",
    timingRule: "દર 30 મિનિટે શરૂઆતનો સમય; {n}-મિનિટ આરક્ષણ અને બફર.",
    checking: "ઉપલબ્ધતા તપાસાઈ રહી છે…", available: "ઉપલબ્ધ શરૂઆતના સમય ({n})", eSlot: "કૃપા કરીને ઉપલબ્ધ સમય પસંદ કરો.",
  },
  review: {
    patient: "દર્દી", guardian: "વાલી / સંભાળનાર", category: "શ્રેણી", plan: "યોજના", fee: "ફી", when: "તારીખ અને સમય",
    reserved: "આરક્ષિત સમય", minutes: "મિનિટ",
    consent: "હું સમજું છું કે આ વિડિઓ પરામર્શ વિનંતી છે, કટોકટી સેવા નથી, અને ક્લિનિક પેમેન્ટ ચકાસ્યા પછી જ પુષ્ટિ થશે.",
    eConsent: "કૃપા કરીને સંમતિ વિધાન સ્વીકારો.",
    privacyPre: "અમારી", privacyLink: "ગોપનીયતા નીતિ", privacyPost: " વાંચો.",
    emergency: "જો આ કટોકટી હોય, તો ઓનલાઇન બુકિંગને બદલે સ્થાનિક ઇમરજન્સી સેવાને કૉલ કરો.",
  },
  pay: {
    reference: "બુકિંગ સંદર્ભ", plan: "યોજના", when: "તારીખ અને સમય", fee: "પરામર્શ ફી", status: "સ્થિતિ",
    noPayTitle: "તમારી વિનંતી સાચવેલી છે. આ વિકલ્પ માટે UPI પેમેન્ટ લેવાતું નથી.",
    noPayBody: "ક્લિનિક કાર્યક્ષેત્ર, ફી (હોય તો) અને એપોઇન્ટમેન્ટની પુષ્ટિ કરશે. આ હજી પુષ્ટ થયેલી એપોઇન્ટમેન્ટ નથી.",
    whatsapp: "WhatsApp પર ક્લિનિકને સંદેશ મોકલો",
    upiTitle: "UPI થી ચૂકવો, પછી ટ્રાન્ઝેક્શન સંદર્ભ નોંધો",
    beneficiary: "લાભાર્થી", upiId: "UPI આઈડી", amount: "રકમ", mention: "ઉલ્લેખ કરવાનો સંદર્ભ",
    notConfigured: "ઓનલાઇન UPI વિગતો સેટ નથી. પેમેન્ટ પૂર્ણ કરવા સંદર્ભ {ref} સાથે ક્લિનિકને કૉલ કરો અથવા WhatsApp કરો. ચકાસ્યા વિનાના ખાતામાં પૈસા ન મોકલો.",
    hold: "સ્લોટ {time} IST સુધી આરક્ષિત છે. તે પહેલાં પેમેન્ટ વિગતો નોંધો.",
    payer: "ચૂકવનારનું નામ *", utr: "UPI ટ્રાન્ઝેક્શન સંદર્ભ / UTR *", utrPh: "દા.ત. 123456789012",
    screenshot: "પેમેન્ટ સ્ક્રીનશોટ (વૈકલ્પિક, વધુમાં વધુ 2 MB)", chooseFile: "PNG, JPG અથવા WebP પસંદ કરો",
    eScreenshot: "સ્ક્રીનશોટ 2 MB થી નાનો હોવો જોઈએ.", ePayer: "કૃપા કરીને ચૂકવનારનું નામ લખો.",
    eUtr: "કૃપા કરીને તમારી UPI એપનો UTR લખો (6–40 અક્ષર/અંક).",
    submit: "મેં પેમેન્ટ પૂર્ણ કર્યું છે",
    disclaimer: "UTR અથવા સ્ક્રીનશોટ સબમિટ કરવાથી એપોઇન્ટમેન્ટ પુષ્ટ થતી નથી. ક્લિનિક પોતાના બેંક/UPI ખાતામાં પેમેન્ટ ચકાસે છે.",
    receivedTitle: "તમારી ઓનલાઇન પરામર્શ વિનંતી મળી છે.",
    receivedBody: "પેમેન્ટ ચકાસણી પછી તમારી એપોઇન્ટમેન્ટ પુષ્ટ થશે. ક્લિનિક ખાતું તપાસે ત્યાં સુધી તમારો સ્લોટ આરક્ષિત છે. સંદર્ભ: {ref}.",
    meeting: "મીટિંગ લિંક", join: "Google Meet માં જોડાઓ", copy: "સંદર્ભ કૉપી કરો", copied: "કૉપી થયું", statusLabel: "સ્થિતિ",
  },
  nav: { back: "પાછળ", continue: "આગળ વધો", reserve: "સ્લોટ આરક્ષિત કરો અને પેમેન્ટ પર જાઓ", startAnother: "નવી બુકિંગ શરૂ કરો" },
  footer: "વિડિઓ પરામર્શ મૂલ્યાંકન અને સલાહ માટે છે. જરૂર પડે ત્યારે કટોકટી સંભાળ કે પ્રત્યક્ષ તપાસનો વિકલ્પ નથી.",
  genericError: "આ સ્લોટ આરક્ષિત કરી શકાયો નહીં. કૃપા કરીને વિગતો તપાસી ફરી પ્રયાસ કરો.",
  status: {
    SLOT_RESERVED: "સ્લોટ આરક્ષિત",
    PAYMENT_PENDING: "પેમેન્ટ બાકી",
    PAYMENT_VERIFICATION_PENDING: "મેન્યુઅલ પેમેન્ટ ચકાસણીની રાહ",
    PAYMENT_VERIFIED: "પેમેન્ટ ચકાસાયું · એપોઇન્ટમેન્ટ પુષ્ટિ થઈ રહી છે",
    CONFIRMED: "એપોઇન્ટમેન્ટ પુષ્ટ",
    REJECTED: "પેમેન્ટ ચકાસી શકાયું નહીં — ક્લિનિકનો સંપર્ક કરો",
    CANCELLED: "બુકિંગ રદ",
    EXPIRED: "આરક્ષણ સમાપ્ત",
    COMPLETED: "પરામર્શ પૂર્ણ",
  },
  codes: {
    SLOT_TAKEN: "આ સ્લોટ હમણાં જ બુક થઈ ગયો. કૃપા કરીને બીજો સમય પસંદ કરો.",
    SLOT_BLOCKED: "તે સમયે ક્લિનિક ઉપલબ્ધ નથી.",
    PAST_SLOT: "આ સમય વીતી ગયો છે. કૃપા કરીને પછીનો સ્લોટ પસંદ કરો.",
    INVALID_SLOT: "આ સમય માન્ય પરામર્શ સ્લોટ નથી.",
    HOLD_EXPIRED: "પેમેન્ટ સબમિટ કરતાં પહેલાં તમારો સ્લોટ હોલ્ડ સમાપ્ત થયો. સમાપ્તિ પછીના પેમેન્ટ માટે સંદર્ભ સાથે +91 98607 75010 પર કૉલ કરો.",
    PAYMENT_ALREADY_SUBMITTED: "આ બુકિંગ માટે પેમેન્ટ વિગતો પહેલેથી સબમિટ થઈ છે.",
    RESERVATION_CLOSED: "આ આરક્ષણ સમાપ્ત થયું છે અથવા રદ થયું છે. કૃપા કરીને નવી બુકિંગ શરૂ કરો.",
    NOT_FOUND: "બુકિંગ મળી નથી.",
  },
  emails: {
    greeting: "નમસ્તે",
    ackTitle: "તમારી ઓનલાઇન પરામર્શ વિનંતી મળી છે",
    ackBadge: "વિડિઓ OPD · પેમેન્ટ ચકાસણીની રાહ",
    ackNote: "પેમેન્ટ ચકાસણી પછી તમારી એપોઇન્ટમેન્ટ પુષ્ટ થશે. આ ઇમેઇલ એપોઇન્ટમેન્ટની પુષ્ટિ નથી.",
    adminSubject: "નવી VOPD બુકિંગ",
    adminTitle: "નવી VOPD બુકિંગ મળી",
    paymentTitle: "પેમેન્ટ સંદર્ભ સબમિટ થયો",
    paymentNote: "આ ચકાસણી નથી. ક્લિનિકના બેંક/UPI ખાતામાં તપાસો, પછી એડમિન કન્સોલમાં ચકાસો.",
    confirmTitle: "તમારી VOPD એપોઇન્ટમેન્ટ પુષ્ટ થઈ છે",
    confirmBadge: "વિડિઓ OPD · પેમેન્ટ ચકાસાયું",
    confirmNote: "કૃપા કરીને થોડી મિનિટ પહેલાં નીચેની સુરક્ષિત Google Meet લિંકથી જોડાઓ. રિપોર્ટ અને દવાઓની યાદી તૈયાર રાખો.",
    confirmNoMeet: "ક્લિનિક એપોઇન્ટમેન્ટ પહેલાં તમારી સુરક્ષિત Google Meet લિંક શેર કરશે. રિપોર્ટ અને દવાઓની યાદી તૈયાર રાખો.",
    meetCta: "Google Meet માં જોડાઓ",
    meetNote: "એપોઇન્ટમેન્ટના સમયથી થોડી મિનિટ પહેલાં જોડાઓ. આ ખાનગી લિંક શેર ન કરો.",
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
