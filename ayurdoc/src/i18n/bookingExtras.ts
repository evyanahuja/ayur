import type { Language } from "./config";

export const BOOKING_EXTRA: Record<Language, {
  general: string; other: string; panchakarma: string; currencyMissing: string; genderRequired: string;
  internationalTitle: string; internationalHelp: string; transactionReference: string; referenceError: string;
}> = {
  en: {
    general: "General Consultation", other: "Other", panchakarma: "Panchakarma",
    currencyMissing: "International fee confirmed by clinic — please contact us to book.",
    genderRequired: "Select Male or Female for an adult consultation.",
    internationalTitle: "International payment · USD",
    internationalHelp: "Contact the clinic for verified USD transfer instructions before paying. Do not use the INR UPI QR for a USD booking. Your appointment is not confirmed until the clinic verifies receipt.",
    transactionReference: "Transfer reference", referenceError: "Enter the transaction reference from your transfer receipt.",
  },
  hi: {
    general: "सामान्य परामर्श", other: "अन्य", panchakarma: "पंचकर्म",
    currencyMissing: "अंतरराष्ट्रीय शुल्क क्लिनिक द्वारा बताया जाएगा — बुकिंग हेतु संपर्क करें।",
    genderRequired: "वयस्क परामर्श के लिए पुरुष या महिला चुनें।",
    internationalTitle: "अंतरराष्ट्रीय भुगतान · USD",
    internationalHelp: "भुगतान से पहले क्लिनिक से USD ट्रांसफ़र का विवरण प्राप्त करें। USD बुकिंग के लिए INR UPI QR का उपयोग न करें। प्राप्ति की पुष्टि के बाद ही अपॉइंटमेंट निश्चित होगा।",
    transactionReference: "ट्रांसफ़र संदर्भ संख्या", referenceError: "ट्रांसफ़र रसीद से लेन-देन संदर्भ दर्ज करें।",
  },
  mr: {
    general: "सर्वसाधारण सल्ला", other: "इतर", panchakarma: "पंचकर्म",
    currencyMissing: "आंतरराष्ट्रीय शुल्क क्लिनिककडून कळवले जाईल — बुकिंगसाठी संपर्क साधा.",
    genderRequired: "प्रौढ सल्ल्यासाठी पुरुष किंवा स्त्री निवडा.",
    internationalTitle: "आंतरराष्ट्रीय पेमेंट · USD",
    internationalHelp: "पैसे पाठवण्यापूर्वी क्लिनिककडून USD ट्रान्सफरची खात्रीशीर माहिती घ्या. USD बुकिंगसाठी INR UPI QR वापरू नका. रक्कम मिळाल्याची पडताळणी झाल्यावरच भेट निश्चित होईल.",
    transactionReference: "ट्रान्सफर संदर्भ क्रमांक", referenceError: "ट्रान्सफर पावतीवरील व्यवहार संदर्भ क्रमांक भरा.",
  },
  gu: {
    general: "સામાન્ય પરામર્શ", other: "અન્ય", panchakarma: "પંચકર્મ",
    currencyMissing: "આંતરરાષ્ટ્રીય દર ક્લિનિક દ્વારા જણાવવામાં આવશે — બુકિંગ માટે સંપર્ક કરો.",
    genderRequired: "પુખ્ત વયના પરામર્શ માટે પુરુષ અથવા સ્ત્રી પસંદ કરો.",
    internationalTitle: "આંતરરાષ્ટ્રીય ચુકવણી · USD",
    internationalHelp: "ચુકવણી પહેલાં ક્લિનિક પાસેથી USD ટ્રાન્સફરની ખાતરીપૂર્વકની માહિતી મેળવો. USD બુકિંગ માટે INR UPI QR વાપરશો નહીં. રકમ મળ્યાની ચકાસણી બાદ જ મુલાકાત નક્કી થશે.",
    transactionReference: "ટ્રાન્સફર સંદર્ભ નંબર", referenceError: "ટ્રાન્સફરની રસીદ પરથી વ્યવહાર સંદર્ભ નંબર દાખલ કરો.",
  },
};
