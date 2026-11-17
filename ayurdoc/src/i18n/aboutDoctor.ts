import type { Language } from "./config";

/** Translated default profile copy. Admin overrides edit only introduction and
 * care paragraphs; qualifications/registration remain verified site content. */
export type AboutDoctorCopy = {
  introduction: string;
  careTitle: string;
  careParagraphs: string[];
  qualificationsTitle: string;
  authorityLabel: string;
  portraitAlt: string;
};

export const ABOUT_DOCTOR_COPY: Record<Language, AboutDoctorCopy> = {
  en: {
    introduction: "Namaste, I’m Dr. Priyanka Likhar. I care deeply about helping patients and families feel heard, especially when a child’s health or development is causing concern. My aim is to understand the person behind the symptoms and work together on a practical, individual plan.",
    careTitle: "Thoughtful care for the whole person",
    careParagraphs: [
      "Ayurveda offers a holistic way to explore health. In a consultation, I consider medical history and current treatment alongside diet, digestion, sleep, daily routine and each person’s needs. An individual assessment helps me explain which Ayurvedic measures may be appropriate and where further medical evaluation is needed.",
      "Children’s health and development are a particular focus of my MD training in Kaumarbhritya (Ayurvedic pediatrics). I listen to parents and caregivers, review growth and developmental concerns carefully, and encourage timely paediatric assessment, vaccination and specialist support when appropriate.",
      "Whether we meet at the clinic or online, I want you to understand your options and feel comfortable asking questions. Ayurvedic care is personalised, realistic and coordinated with your existing doctors; no treatment is a guaranteed cure.",
    ],
    qualificationsTitle: "Qualifications, registration & clinical focus",
    authorityLabel: "Registration authority",
    portraitAlt: "Portrait of Dr. Priyanka Likhar",
  },
  hi: {
    introduction: "नमस्ते, मैं डॉ. प्रियंका लिखार हूँ। मरीज़ों और उनके परिवारों की बात ध्यान से सुनना मेरे लिए बहुत महत्त्वपूर्ण है, विशेषकर जब किसी बच्चे के स्वास्थ्य या विकास को लेकर चिंता हो। मेरा उद्देश्य लक्षणों के साथ-साथ व्यक्ति की ज़रूरतों को समझकर मिलकर व्यावहारिक, व्यक्तिगत देखभाल की योजना बनाना है।",
    careTitle: "समग्र स्वास्थ्य के लिए संवेदनशील देखभाल",
    careParagraphs: [
      "आयुर्वेद स्वास्थ्य को समग्र रूप से समझने का एक दृष्टिकोण देता है। परामर्श में मैं चिकित्सा इतिहास और चल रहे उपचार के साथ आहार, पाचन, नींद, दिनचर्या और व्यक्ति की आवश्यकताओं पर ध्यान देती हूँ। व्यक्तिगत मूल्यांकन से यह समझाने में मदद मिलती है कि कौन-से आयुर्वेदिक उपाय उपयुक्त हो सकते हैं और कब अतिरिक्त चिकित्सकीय जाँच आवश्यक है।",
      "कौमारभृत्य (आयुर्वेदिक बाल चिकित्सा) में मेरे MD प्रशिक्षण का विशेष केंद्र बच्चों का स्वास्थ्य और विकास है। मैं अभिभावकों की चिंताएँ सुनती हूँ, वृद्धि और विकास का ध्यानपूर्वक आकलन करती हूँ और ज़रूरत होने पर समय पर बालरोग जाँच, टीकाकरण तथा विशेषज्ञ सहयोग की सलाह देती हूँ।",
      "क्लिनिक में हों या ऑनलाइन, आप अपने विकल्प समझें और खुलकर प्रश्न पूछ सकें—यह मेरे लिए ज़रूरी है। आयुर्वेदिक देखभाल व्यक्तिगत और यथार्थवादी होती है तथा आपके अन्य डॉक्टरों के उपचार के साथ समन्वय में दी जाती है; किसी इलाज की निश्चित सफलता का दावा नहीं किया जाता।",
    ],
    qualificationsTitle: "योग्यता, पंजीकरण और चिकित्सा कार्यक्षेत्र",
    authorityLabel: "पंजीकरण प्राधिकरण",
    portraitAlt: "डॉ. प्रियंका लिखार का चित्र",
  },
  mr: {
    introduction: "नमस्कार, मी डॉ. प्रियांका लिखार. रुग्ण आणि त्यांच्या कुटुंबीयांचे म्हणणे समजून घेणे मला महत्त्वाचे वाटते, विशेषतः मुलाच्या आरोग्याबाबत किंवा विकासाबाबत चिंता असेल तेव्हा. लक्षणांपलीकडे त्या व्यक्तीच्या गरजा जाणून घेऊन एकत्रितपणे व्यवहार्य, वैयक्तिक काळजीची योजना ठरवणे हा माझा प्रयत्न असतो.",
    careTitle: "संपूर्ण आरोग्याचा विचार करणारी काळजी",
    careParagraphs: [
      "आयुर्वेद आरोग्याकडे समग्र दृष्टीने पाहण्याची संधी देतो. सल्लामसलतीत मी वैद्यकीय इतिहास व सध्या सुरू असलेले उपचार यांसह आहार, पचन, झोप, दिनक्रम आणि व्यक्तीच्या गरजा तपासते. वैयक्तिक मूल्यमापनातून कोणते आयुर्वेदिक उपाय योग्य असू शकतात आणि कधी पुढील वैद्यकीय तपासणी गरजेची आहे, हे स्पष्ट करता येते.",
      "कौमारभृत्य (आयुर्वेदिक बालरोगशास्त्र) या विषयातील माझ्या MD प्रशिक्षणात मुलांचे आरोग्य व विकास यांना विशेष स्थान आहे. पालकांचे म्हणणे ऐकून वाढ आणि विकासाशी संबंधित चिंता काळजीपूर्वक तपासते; गरजेनुसार बालरोगतज्ज्ञांची तपासणी, लसीकरण व इतर तज्ज्ञांची मदत वेळेवर घेण्याचा सल्ला देते.",
      "क्लिनिकमध्ये किंवा ऑनलाइन भेटीत आपले पर्याय स्पष्ट व्हावेत आणि प्रश्न विचारायला मोकळेपणा वाटावा, हे मला महत्त्वाचे वाटते. आयुर्वेदिक काळजी वैयक्तिक, वास्तववादी आणि आपल्या इतर डॉक्टरांच्या उपचारांशी समन्वय राखणारी असते; कोणत्याही उपचाराने हमखास बरे होण्याचे आश्वासन नाही.",
    ],
    qualificationsTitle: "शैक्षणिक पात्रता, नोंदणी आणि वैद्यकीय कार्यक्षेत्र",
    authorityLabel: "नोंदणी प्राधिकरण",
    portraitAlt: "डॉ. प्रियांका लिखार यांचे छायाचित्र",
  },
  gu: {
    introduction: "નમસ્તે, હું ડૉ. પ્રિયંકા લિખાર છું. દર્દીઓ અને તેમના પરિવારની વાત ધ્યાનથી સાંભળવી મારા માટે મહત્વની છે, ખાસ કરીને બાળકના સ્વાસ્થ્ય કે વિકાસ અંગે ચિંતા હોય ત્યારે. લક્ષણો ઉપરાંત દરેક વ્યક્તિની જરૂરિયાતો સમજીને સાથે મળી વ્યવહારુ અને વ્યક્તિગત સંભાળની યોજના બનાવવાનો મારો પ્રયત્ન છે.",
    careTitle: "સમગ્ર સ્વાસ્થ્યને સમજતી સંવેદનશીલ સંભાળ",
    careParagraphs: [
      "આયુર્વેદ સ્વાસ્થ્યને સમગ્ર રીતે સમજવાનો અભિગમ આપે છે. પરામર્શમાં હું તબીબી ઇતિહાસ અને હાલની સારવારની સાથે આહાર, પાચન, ઊંઘ, દૈનિક નિયમિતતા અને વ્યક્તિની જરૂરિયાતો ધ્યાનમાં લઉં છું. વ્યક્તિગત મૂલ્યાંકનથી કયા આયુર્વેદિક ઉપાયો યોગ્ય હોઈ શકે અને ક્યારે વધુ તબીબી તપાસ જરૂરી છે તે સમજાવી શકાય છે.",
      "કૌમારભૃત્ય (આયુર્વેદિક બાળચિકિત્સા)માં મારા MD અભ્યાસનું ખાસ કેન્દ્ર બાળકોનું સ્વાસ્થ્ય અને વિકાસ છે. વાલીઓની ચિંતાઓ સાંભળીને વૃદ્ધિ અને વિકાસ સંબંધિત બાબતો ધ્યાનથી તપાસું છું અને જરૂર પડે ત્યારે સમયસર બાળરોગ તપાસ, રસીકરણ તથા નિષ્ણાતની મદદ લેવા સલાહ આપું છું.",
      "ક્લિનિકમાં કે ઓનલાઇન, તમને તમારા વિકલ્પો સમજાય અને નિઃસંકોચ પ્રશ્નો પૂછી શકો એ જરૂરી છે. આયુર્વેદિક સંભાળ વ્યક્તિગત, વાસ્તવિક અને તમારા અન્ય ડૉક્ટરોની સારવાર સાથે સંકલિત હોય છે; કોઈ સારવારથી નિશ્ચિત ઉપચારની ખાતરી આપવામાં આવતી નથી.",
    ],
    qualificationsTitle: "લાયકાત, નોંધણી અને તબીબી કાર્યક્ષેત્ર",
    authorityLabel: "નોંધણી સત્તામંડળ",
    portraitAlt: "ડૉ. પ્રિયંકા લિખારનું ચિત્ર",
  },
};
