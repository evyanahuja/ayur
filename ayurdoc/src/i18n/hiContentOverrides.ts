/**
 * Hindi corrections for source strings that previously fell back to English
 * or were only partially translated. Keys must exactly match the English /
 * Hinglish content in src/content/*. The lookup is applied by trText().
 */
export const HI_CONTENT_OVERRIDES: Record<string, string> = {
  /* ADHD */
  "Herbal products must be age-dosed, quality-verified and free of heavy metals — avoid unlabelled powders from unknown sources.":
    "हर्बल उत्पाद उम्र के अनुसार खुराक वाले, गुणवत्ता-प्रमाणित और भारी धातुओं से मुक्त होने चाहिए — अनजान स्रोतों की बिना लेबल वाली पाउडर से बचें।",
  "Bachchon mein ADHD ke lakshan kya hain?":
    "बच्चों में ADHD के लक्षण क्या हैं?",
  "Lagataar dhyaan na lagna, bahut zyada hilna-dulna, baat kaatna, cheezen bhulna aur school mein kaam adhura chhodna — ye lakshan 6 mahine se zyada, ghar aur school dono jagah dikhen to assessment karana chahiye. Sirf shararat ADHD nahi hoti.":
    "लगातार ध्यान न लगना, बहुत ज़्यादा हिलना-डुलना, बात काटना, चीज़ें भूलना और स्कूल में काम अधूरा छोड़ना — ये लक्षण 6 महीने से ज़्यादा समय तक घर और स्कूल दोनों जगह दिखें तो मूल्यांकन कराना चाहिए। सिर्फ़ शरारत ADHD नहीं होती।",
  "Can diet cure ADHD?":
    "क्या आहार से ADHD ठीक हो सकता है?",
  "No single diet cures ADHD. Regular meals, adequate sleep, iron sufficiency and reduced ultra-processed food support attention, but they complement — not replace — assessment and behavioural support.":
    "कोई एक आहार ADHD को ठीक नहीं करता। नियमित भोजन, पर्याप्त नींद, आयरन की पर्याप्तता और अल्ट्रा-प्रोसेस्ड खाद्य पदार्थों में कमी ध्यान में मदद करती है, लेकिन ये मूल्यांकन और व्यवहार-संबंधी सहायता के पूरक हैं — उनका विकल्प नहीं।",
  "Is ADHD overdiagnosed?":
    "क्या ADHD का अधिक निदान हो रहा है?",
  "Both over- and under-diagnosis happen. That is why proper assessment uses parent + teacher ratings over time and rules out sleep, vision, hearing, thyroid and learning issues before concluding ADHD.":
    "अधिक और कम — दोनों तरह का निदान होता है। इसीलिए सही मूल्यांकन में माता-पिता और शिक्षक की समय-समय पर दी गई रेटिंग शामिल होती है तथा ADHD मानने से पहले नींद, दृष्टि, श्रवण, थायरॉइड और सीखने की कठिनाइयों को बाहर रखा जाता है।",
  "Do Ayurvedic medicines help with focus?":
    "क्या आयुर्वेदिक दवाएँ ध्यान केंद्रित करने में मदद करती हैं?",
  "Medhya herbs are traditionally used to support calm, memory and sleep, and some small studies are encouraging. Evidence is preliminary, so they are best used as supervised co-care alongside established management, not as a standalone cure.":
    "मेध्य औषधियाँ पारंपरिक रूप से शांति, स्मृति और नींद में सहायता के लिए उपयोग होती हैं, और कुछ छोटे अध्ययन उत्साहजनक हैं। साक्ष्य अभी प्रारंभिक हैं, इसलिए इन्हें सिद्ध प्रबंधन के साथ निगरानी में सह-देखभाल के रूप में लेना बेहतर है — अकेले इलाज के रूप में नहीं।",
  "Bachchon mein ADHD ke lakshan": "बच्चों में ADHD के लक्षण",
  "Bachcha padhai me dhyan nahi deta": "बच्चा पढ़ाई में ध्यान नहीं देता",
  "hyperactivity ka ilaj": "हाइपरएक्टिविटी का इलाज",
  "ADHD Symptoms by Age": "उम्र के अनुसार ADHD लक्षण",
  "ADHD Symptoms by Age: Toddler to Teen": "उम्र के अनुसार ADHD लक्षण: छोटे बच्चे से किशोर तक",
  "ADHD Symptoms by Age (3–17): Parent Guide | Indore":
    "उम्र के अनुसार ADHD लक्षण (3–17): माता-पिता के लिए मार्गदर्शिका | इंदौर",
  "How ADHD looks different at 3, 7, 12 and 16. Age-wise symptom guide with examples, plus when assessment is needed. Reviewed by an Ayurvedic doctor.":
    "3, 7, 12 और 16 वर्ष की उम्र में ADHD कैसे अलग दिखता है। उदाहरणों के साथ उम्र-वार लक्षण मार्गदर्शिका और यह भी कि मूल्यांकन कब ज़रूरी है। आयुर्वेदिक चिकित्सक द्वारा समीक्षित।",
  "The same condition looks very different at different ages — a hyperactive 4-year-old, a dreamy 8-year-old and a disorganised 15-year-old may all have ADHD. This page maps typical symptoms by age so parents can judge what is developmental and what deserves assessment.":
    "एक ही स्थिति अलग-अलग उम्र में बहुत अलग दिखती है — अत्यधिक चंचल 4 वर्षीय बच्चा, ख़यालों में खोया 8 वर्षीय बच्चा और अव्यवस्थित 15 वर्षीय किशोर — सभी में ADHD हो सकता है। यह पृष्ठ उम्र के अनुसार सामान्य लक्षण बताता है ताकि माता-पिता तय कर सकें कि क्या विकास का हिस्सा है और किसका मूल्यांकन ज़रूरी है।",
  "ADHD symptoms shift with brain maturation and environmental demands: hyperactivity is most visible in young children, inattention dominates school years, and executive-function struggles dominate adolescence.":
    "मस्तिष्क की परिपक्वता और परिवेश की माँगों के साथ ADHD के लक्षण बदलते हैं: छोटे बच्चों में अत्यधिक चंचलता सबसे स्पष्ट दिखती है, स्कूल के वर्षों में असावधानी प्रमुख होती है और किशोरावस्था में निर्णय, योजना और नियंत्रण जैसी कार्यकारी क्षमताओं की चुनौतियाँ प्रमुख होती हैं।",
  "This page is a companion to the main ADHD guide — read that first for causes, assessment and treatment.":
    "यह पृष्ठ ADHD की मुख्य मार्गदर्शिका का सहयोगी है — कारण, मूल्यांकन और उपचार के लिए पहले उसे पढ़ें।",
  "Age 3–5: constant motion, dangerous climbing, cannot finish even a short story or puzzle":
    "उम्र 3–5: लगातार हिलना-डुलना, खतरनाक चढ़ाई, छोटी कहानी या पहेली भी पूरी न कर पाना",
  "Age 6–8: careless mistakes, losing belongings, interrupting class":
    "उम्र 6–8: लापरवाही की गलतियाँ, सामान खोना, क्लास में टोकना",

  /* Sleep */
  "Suspected sleep apnoea needs ENT/sleep workup — oils and herbs do not open an obstructed airway. Persistent insomnia despite routine needs medical review, not stronger sedation.":
    "स्लीप एपनिया का संदेह होने पर कान-नाक-गला या नींद विशेषज्ञ का परीक्षण ज़रूरी है — तेल और औषधियाँ बंद श्वास मार्ग को नहीं खोलतीं। दिनचर्या सुधारने के बाद भी लगातार अनिद्रा रहे तो चिकित्सकीय समीक्षा कराएँ; अधिक नींद की दवा नहीं लें।",
  "Bachcha raat me baar baar uthta hai — kya karein?":
    "बच्चा रात में बार-बार उठता है — क्या करें?",
  "Subah ka fixed time, din me dhoop + khel, shaam ko screen band, aur roz ek jaisa 20–30 min bedtime ritual rakhein. 2–3 hafte lagataar karne par aksar farak dikhta hai.":
    "सुबह उठने का निश्चित समय, दिन में धूप और खेल, शाम को स्क्रीन बंद, और रोज़ एक जैसी 20–30 मिनट की सोने से पहले की दिनचर्या रखें। 2–3 हफ़्ते लगातार अपनाने पर अक्सर फ़र्क दिखता है।",
  "Co-sleeping — safe or not?": "साथ में सोना — सुरक्षित है या नहीं?",
  "Room-sharing (separate surface) is recommended for infants; bed-sharing raises SIDS/suffocation risk, especially with smoking, alcohol, soft bedding or prematurity. Follow safe-sleep guidance for under-ones.":
    "शिशुओं के लिए उसी कमरे में अलग समतल स्थान पर सुलाना अनुशंसित है; एक ही बिस्तर पर सोने से अचानक शिशु मृत्यु और दम घुटने का जोखिम बढ़ता है, विशेषकर धूम्रपान, शराब, मुलायम बिस्तर या समय से पहले जन्म की स्थिति में। एक वर्ष से छोटे बच्चों के लिए सुरक्षित नींद के दिशानिर्देश अपनाएँ।",
  "Snoring — kab doctor ko dikhayein?":
    "खर्राटे — डॉक्टर को कब दिखाएँ?",
  "Roz zor se kharrate + muh kholkar sona + bechain neend + din me susti ho to ENT/sleep evaluation karayein — adenoid ya apnoea ho sakta hai.":
    "रोज़ ज़ोर से खर्राटे, मुँह खोलकर सोना, बेचैन नींद और दिन में सुस्ती हो तो कान-नाक-गला या नींद का मूल्यांकन कराएँ — एडिनॉइड या स्लीप एपनिया हो सकता है।",
  "Bachcha raat me sota nahi": "बच्चा रात में सोता नहीं",
  "kharrate bachche me upay": "बच्चों में खर्राटों का उपाय",

  /* Bedwetting */
  "Bedwetting": "बिस्तर गीला करना",
  "Bedwetting in Children (Nocturnal Enuresis): Causes & Dry Nights":
    "बच्चों में बिस्तर गीला करना (रात्रिक मूत्रत्याग): कारण और सूखी रातें",
  "Bedwetting After Age 5: Causes, Treatment & Parent Tips":
    "5 वर्ष के बाद बिस्तर गीला करना: कारण, उपचार और माता-पिता के लिए सुझाव",
  "Why bedwetting happens, when it needs evaluation, bedwetting alarms, medicines and supportive care. Kind, practical guide.":
    "बिस्तर गीला क्यों होता है, मूल्यांकन कब ज़रूरी है, बेडवेटिंग अलार्म, दवाएँ और सहायक देखभाल। सहानुभूतिपूर्ण और व्यावहारिक मार्गदर्शिका।",
  "Bedwetting (nocturnal enuresis) affects about 15% of 5-year-olds and runs strongly in families. It is almost never the child's fault — deep sleep arousal thresholds, night-time urine production and bladder capacity mature at different rates. Most children outgrow it; for those who don't, structured help works well.":
    "बिस्तर गीला करना (नोक्टर्नल एन्यूरेसिस) लगभग 15% पाँच वर्षीय बच्चों में होता है और परिवारों में अधिक दिखता है। यह लगभग कभी बच्चे की गलती नहीं होती — गहरी नींद से जागने की सीमा, रात में मूत्र उत्पादन और मूत्राशय की क्षमता अलग-अलग गति से परिपक्व होती हैं। अधिकांश बच्चे इसे पार कर जाते हैं; जिन्हें कठिनाई रहती है, उनके लिए संरचित सहायता प्रभावी होती है।",
  "Primary enuresis = never dry for 6+ months (most common); secondary = dry then wet again — look for trigger (stress, UTI, constipation, sleep apnoea, rarely diabetes).":
    "प्राइमरी एन्यूरेसिस = 6 महीने से अधिक कभी सूखा न रहना (सबसे आम); सेकंडरी = पहले सूखा रहना, फिर दोबारा गीला होना — किसी कारण की जाँच करें (तनाव, मूत्र संक्रमण, कब्ज़, स्लीप एपनिया, कभी-कभी मधुमेह)।",
  "Monosymptomatic = nights only, normal daytime bladder; non-monosymptomatic = plus daytime urgency/frequency/leaks — needs earlier evaluation.":
    "मोनोसिम्प्टोमैटिक = केवल रात में समस्या, दिन में मूत्राशय सामान्य; नॉन-मोनोसिम्प्टोमैटिक = दिन में भी तेज़ ज़रूरत, बार-बार पेशाब या रिसाव — इसमें जल्दी मूल्यांकन ज़रूरी है।",
  "Wet nights 2+ times/week after age 5; deep sleep with difficult waking; large morning wet patches vs small frequent leaks (pattern guides cause).":
    "5 वर्ष के बाद हफ़्ते में 2 या अधिक बार रात गीली; गहरी नींद और जगाने में कठिनाई; सुबह बड़ा गीला धब्बा बनाम बार-बार थोड़ा रिसाव (पैटर्न से कारण का संकेत मिलता है)।",
  "Daytime urgency, holding postures, damp underwear, recurrent UTIs suggest bladder-bowel dysfunction.":
    "दिन में पेशाब की तेज़ ज़रूरत, पेशाब रोकने के लिए शरीर को मोड़ना, अंडरवियर गीला रहना और बार-बार मूत्र संक्रमण मूत्राशय-आँत की गड़बड़ी का संकेत हो सकते हैं।",
  "Under 5: usually normal — focus on daytime toilet habits and constipation, not night dryness.":
    "5 वर्ष से कम: सामान्यतः सामान्य — रात की सूखी नींद के बजाय दिन की टॉइलेट आदतों और कब्ज़ पर ध्यान दें।",
  "5–7: evaluate if frequent/distressing; start behavioural measures.":
    "5–7 वर्ष: बार-बार या परेशान करने वाली समस्या हो तो मूल्यांकन कराएँ; व्यवहार-संबंधी उपाय शुरू करें।",
  "7+: add alarm therapy promptly; consider desmopressin for specific needs (camps/sleepovers) under guidance.":
    "7 वर्ष से अधिक: अलार्म थेरेपी जल्दी शुरू करें; विशेष आवश्यकताओं (कैंप/रात्रि-ठहराव) के लिए चिकित्सकीय सलाह से डेस्मोप्रेसिन पर विचार करें।",
  "Family history; deep sleep arousal pattern; night-time ADH/urine-volume mismatch; small functional bladder capacity; constipation pressing on bladder; UTI; sleep apnoea; rarely diabetes insipidus/mellitus.":
    "पारिवारिक इतिहास; गहरी नींद से जागने का पैटर्न; रात में ADH और मूत्र की मात्रा में असंतुलन; मूत्राशय की छोटी कार्यात्मक क्षमता; मूत्राशय पर दबाव डालने वाली कब्ज़; मूत्र संक्रमण; स्लीप एपनिया; कभी-कभी डायबिटीज़ इन्सिपिडस या मेलिटस।",
  "raat me peshab upay": "रात में पेशाब का उपाय",

  /* Suvarnaprashan */
  "Mild digestive upset if dosed wrongly or given during acute illness":
    "गलत खुराक या तेज़ बीमारी के दौरान देने पर हल्की पाचन गड़बड़ी",
  "Opportunity cost if it delays needed medical care — the schedule must never postpone assessment of red-flag symptoms":
    "आवश्यक चिकित्सा में होने वाली देरी की कीमत — कार्यक्रम कभी भी खतरे के संकेतों के मूल्यांकन को नहीं टालना चाहिए",
  "Quality risk from unverified sources (the main real-world risk)":
    "अप्रमाणित स्रोतों से गुणवत्ता का जोखिम (वास्तविक जीवन में सबसे बड़ा जोखिम)",
  "Consultation (Prakriti/Agni/Bala assessment + history) → suitability decision":
    "परामर्श (प्रकृति, अग्नि, बल का मूल्यांकन और इतिहास) → उपयुक्तता का निर्णय",
  "First administration demonstrated in clinic; schedule card given (Pushya dates or daily course)":
    "पहली खुराक क्लिनिक में दिखाई जाती है; कार्यक्रम कार्ड दिया जाता है (पुष्य की तिथियाँ या दैनिक कोर्स)",
  "Reviews every 4–8 weeks: illness diary, growth, digestion, sleep":
    "हर 4–8 हफ़्ते में समीक्षा: बीमारी की डायरी, विकास, पाचन और नींद",
  "Course length decided by response — typically seasonal or 6–12 months, not lifelong":
    "कोर्स की अवधि परिणाम से तय होती है — सामान्यतः मौसमी या 6–12 महीने, जीवन भर नहीं",
  "Ye swarna-herb ki classical Ayurvedic drops hain, immunity/digestion/development ke support ke liye. Ye vaccine NAHI hai aur vaccine ka vikalp bilkul nahi — saare routine teeke schedule par lagwayein.":
    "ये स्वर्ण-औषधि की शास्त्रीय आयुर्वेदिक बूँदें हैं, जो प्रतिरक्षा, पाचन और विकास में सहायता के लिए दी जाती हैं। यह टीका नहीं है और टीके का विकल्प बिल्कुल नहीं है — सभी नियमित टीके तय समय पर लगवाएँ।",
  "Kya isse bachcha intelligent ho jayega?":
    "क्या इससे बच्चा बुद्धिमान हो जाएगा?",
  "Nahi — aisa koi pramaan nahi hai. Jo mayne rakhta hai: behtar neend, pachan, bimari ki frequency aur overall routine. 'IQ badhane' ke daave avaigyanik hain.":
    "नहीं — ऐसा कोई प्रमाण नहीं है। जो मायने रखता है वह है बेहतर नींद, पाचन, बीमारी की कम आवृत्ति और समग्र दिनचर्या। 'IQ बढ़ाने' के दावे अवैज्ञानिक हैं।",
  "Kitne ki padti hai? Cost kya hai?":
    "इसका ख़र्च कितना है? कीमत क्या है?",
  "Cost formulation aur course par nirbhar karti hai. Sahi rakam consultation me transparent batayi jaati hai — koi hidden charge nahi. Exact pricing ke liye clinic par sampark karein.":
    "कीमत औषधि-निर्माण और कोर्स की अवधि पर निर्भर करती है। सही राशि परामर्श में स्पष्ट रूप से बताई जाती है — कोई छिपा शुल्क नहीं। सटीक कीमत के लिए क्लिनिक से संपर्क करें।",
  "Kya roz dena hai ya mahine me ek baar?":
    "क्या रोज़ देना है या महीने में एक बार?",
  "Dono paddhatiyan classical hain: Pushya Nakshatra (lagbhag maasik) ya doctor dwara tay daily course. Aapke bachche ke liye kaunsi, ye assessment me tay hota hai.":
    "दोनों विधियाँ शास्त्रीय हैं: पुष्य नक्षत्र (लगभग मासिक) या डॉक्टर द्वारा तय दैनिक कोर्स। आपके बच्चे के लिए कौन-सी विधि उपयुक्त है, यह मूल्यांकन में तय होता है।",
  "Pushya Nakshatra drops Indore": "पुष्य नक्षत्र बूँदें इंदौर",
  "The classical reference": "शास्त्रीय संदर्भ",
  "The defining verse (Kashyapa Samhita, Sutrasthana, Leha Adhyaya) describes Swarna with honey and ghee given to the newborn and child for the benefits above, with duration-based gradation (one month, six months).":
    "मुख्य श्लोक (काश्यप संहिता, सूत्रस्थान, लेह अध्याय) में ऊपर बताए लाभों के लिए नवजात और बच्चे को शहद व घी के साथ स्वर्ण देने का वर्णन है, साथ ही अवधि के अनुसार क्रम (एक माह, छह माह) बताया गया है।",
  "Giving during acute illness can worsen digestive upset; wrong dosing from unverified sources.":
    "तेज़ बीमारी के दौरान देने से पाचन गड़बड़ी बढ़ सकती है; अप्रमाणित स्रोतों से गलत खुराक का जोखिम रहता है।",
  "Assessment → dose card → pause-rules briefing → reviews":
    "मूल्यांकन → खुराक कार्ड → रोकने के नियमों की जानकारी → समीक्षा",
  "6 mahine ke baby ko de sakte hain?":
    "6 महीने के बच्चे को दे सकते हैं?",
  "Kai clinics me haan, doctor ki dose par. Pehle consultation me suitability confirm hoti hai — umar, vajan, pachan aur health history dekhkar.":
    "कई क्लिनिकों में हाँ, डॉक्टर की तय खुराक पर। पहले परामर्श में उम्र, वज़न, पाचन और स्वास्थ्य इतिहास देखकर उपयुक्तता की पुष्टि की जाती है।",
  "Bukhar me dose dein ya chhodein?":
    "बुखार में खुराक दें या छोड़ें?",
  "Chhodein — theek hone ke baad resume karein. Yehi classical aur safe niyam hai.":
    "छोड़ें — ठीक होने के बाद फिर शुरू करें। यही शास्त्रीय और सुरक्षित नियम है।",
  "bukhar me suvarnaprashan": "बुखार में सुवर्णप्राशन",
  "Bhasma quality, heavy-metal testing, GMP labels, red flags and safe dosing. The safety guide to read before you buy any drops.":
    "भस्म की गुणवत्ता, भारी धातुओं की जाँच, GMP लेबल, चेतावनी संकेत और सुरक्षित खुराक। कोई भी बूँदें खरीदने से पहले पढ़ने योग्य सुरक्षा मार्गदर्शिका।",
  "The 6-point quality checklist": "गुणवत्ता की 6-सूत्री जाँच सूची",
  "Ask to see: (1) labelled pack with batch + expiry, (2) GMP/manufacturer details, (3) Swarna Bhasma source and testing, (4) written dose by age, (5) pause-rules guidance, (6) a qualified doctor prescribing — not a salesperson.":
    "देखने के लिए कहें: (1) बैच और एक्सपायरी वाला लेबल पैक, (2) GMP/निर्माता का विवरण, (3) स्वर्ण भस्म का स्रोत और जाँच, (4) उम्र के अनुसार लिखित खुराक, (5) रोकने के नियमों की जानकारी, (6) योग्य डॉक्टर का पर्चा — सेल्सपर्सन का नहीं।",
  "Red flags": "चेतावनी संकेत",
  "Secret formulas, 'imported gold' theatrics, adult doses for toddlers, yearly packs sold before assessment, guaranteed IQ/immunity claims, and pressure tactics — walk away from all of these.":
    "गुप्त फ़ॉर्मूले, 'इम्पोर्टेड गोल्ड' का दिखावा, छोटे बच्चों को वयस्कों की खुराक, मूल्यांकन से पहले वार्षिक पैक बेचना, IQ/प्रतिरक्षा की गारंटी और दबाव डालने की तरकीबें — इन सबसे दूर रहें।",
  "Unverified bhasma quality (heavy metals), wrong dosing, delayed real care.":
    "अप्रमाणित भस्म गुणवत्ता (भारी धातुएँ), गलत खुराक और ज़रूरी इलाज में देरी।",
  "Checklist → consultation → labelled course → reviews":
    "जाँच सूची → परामर्श → लेबल वाला कोर्स → समीक्षा",
  "Kya Swarna Bhasma me heavy metal ka khatra hai?":
    "क्या स्वर्ण भस्म में भारी धातु का खतरा है?",
  "Sahi tareeke se bani, tested Bhasma me ye jokhim niyantrit hota hai — isiliye label, batch, GMP aur doctor ki prescription zaroori hai. Bina label ka powder kabhi na lein.":
    "सही तरीके से बनी और जाँची गई भस्म में यह जोखिम नियंत्रित होता है — इसीलिए लेबल, बैच, GMP और डॉक्टर का पर्चा ज़रूरी है। बिना लेबल वाली पाउडर कभी न लें।",
  "Bina assessment ke nahi. Formulation, dose aur suitability doctor tay karta hai; online kharid me ye suraksha parat gayab ho jaati hai.":
    "बिना मूल्यांकन के नहीं। औषधि-निर्माण, खुराक और उपयुक्तता डॉक्टर तय करते हैं; ऑनलाइन खरीद में सुरक्षा की यह परत खो जाती है।",
  "original suvarnaprashan pehchan": "असली सुवर्णप्राशन की पहचान",
  "Swarna Bhasma, Medhya herbs, honey and ghee — what each component does, how quality preparation works, and what to verify.":
    "स्वर्ण भस्म, मेध्य औषधियाँ, शहद और घी — हर घटक क्या करता है, गुणवत्तापूर्ण तैयारी कैसे होती है और क्या जाँचना चाहिए।",

  /* Screen time and iron */
  "Under 18 months: avoid except video-calls. 18–24 months: high-quality co-viewed only. 2–5 years: ≤1 hour quality content with parents. 6+: consistent limits protecting sleep, play, homework and family time.":
    "18 माह से कम: वीडियो कॉल के अलावा बच्चों को स्क्रीन न दें। 18–24 माह: केवल माता-पिता के साथ उच्च-गुणवत्ता वाली सामग्री। 2–5 वर्ष: माता-पिता के साथ प्रतिदिन 1 घंटे तक गुणवत्तापूर्ण सामग्री। 6 वर्ष से अधिक: नींद, खेल, गृहकार्य और पारिवारिक समय की रक्षा करने वाली स्पष्ट सीमाएँ।",
  "No screens during meals or the hour before bed (any age)":
    "खाने के समय और सोने से पहले एक घंटे तक कोई स्क्रीन नहीं (हर उम्र के लिए)",
  "Bedrooms stay screen-free; parents model the same rule":
    "सोने के कमरे में स्क्रीन न ले जाएँ; माता-पिता भी यही नियम अपनाएँ",
  "Co-view + discuss beats solo scrolling at every age":
    "हर उम्र में साथ देखना और चर्चा करना अकेले स्क्रॉल करने से बेहतर है",
  "Ayurvedic lens: Prana, Nidra, attention":
    "आयुर्वेदिक दृष्टि: प्राण, निद्रा और ध्यान",
  "Ayurveda reads excess evening stimulation as Vata–Pitta aggravation: restless mind, delayed sleep, irritable mornings. The prescription matches evidence — morning sunlight, daytime exertion, calm sensory evenings.":
    "आयुर्वेद शाम को अत्यधिक उत्तेजना को वात-पित्त के बढ़ने के रूप में देखता है: बेचैन मन, देर से नींद और चिड़चिड़ी सुबह। इसका उपाय साक्ष्य से मेल खाता है — सुबह की धूप, दिन में शारीरिक गतिविधि और शाम को शांत इंद्रिय अनुभव।",
  "Khana khilane ke liye mobile dikhana padta hai — kya karein?":
    "खाना खिलाने के लिए मोबाइल दिखाना पड़ता है — क्या करें?",
  "Ye aadat bhookh ke sanket bigadti hai. 2 hafte ka plan: fixed meal time, khud khane do (gandagi chalegi), 25-min me meal khatm — shuru me khana kam khayega, phir bhookh laut-ti hai.":
    "यह आदत भूख के संकेत बिगाड़ती है। 2 हफ़्ते की योजना: भोजन का निश्चित समय, बच्चे को खुद खाने दें (कुछ गंदगी होने दें), भोजन 25 मिनट में समाप्त करें — शुरू में कम खाएगा, फिर भूख लौट आएगी।",
  "Bachcha mobile bahut dekhta hai": "बच्चा मोबाइल बहुत देखता है",
  "screen time kaise kam kare": "स्क्रीन टाइम कैसे कम करें",
  "Iron Deficiency in Children": "बच्चों में आयरन की कमी",
  "Iron Deficiency in Children: Appetite, Attention & Growth":
    "बच्चों में आयरन की कमी: भूख, ध्यान और विकास",
  "Iron Deficiency in Kids: Signs, Tests & Food Fixes":
    "बच्चों में आयरन की कमी: संकेत, जाँच और आहार से सुधार",
  "Pallor, poor appetite, pica, restless sleep — how iron deficiency shows up, which tests matter, and food-first correction with medical guidance.":
    "पीलापन, कम भूख, मिट्टी/बर्फ़ खाने की आदत, बेचैन नींद — आयरन की कमी कैसे दिखती है, कौन-सी जाँचें महत्वपूर्ण हैं, और चिकित्सकीय सलाह से पहले आहार में सुधार कैसे करें।",
  "Iron deficiency is among India's commonest paediatric issues — and one of the most fixable causes of poor appetite, restless sleep and inattention. This guide covers signs, sensible testing, and food-first correction.":
    "आयरन की कमी भारत की सबसे आम बाल-स्वास्थ्य समस्याओं में है — और भूख, बेचैन नींद तथा ध्यान की कमी के सबसे सुधारने योग्य कारणों में से एक है। यह मार्गदर्शिका संकेत, उचित जाँच और पहले आहार से सुधार पर केंद्रित है।",
  "Signs parents notice": "माता-पिता को दिखने वाले संकेत",
  "Pale inner eyelids/lips/nails, chewing ice/clay (pica), restless legs at night, breathless on play, poor appetite and flagging attention.":
    "आँखों की भीतरी पलकें, होंठ या नाखून पीले; बर्फ़/मिट्टी चबाना (पिका); रात में पैर बेचैन; खेलते समय जल्दी साँस फूलना; कम भूख और ध्यान कम लगना।",
  "Testing & treatment logic": "जाँच और उपचार का तर्क",
  "Haemoglobin + ferritin/iron studies confirm; dose and duration follow paediatric protocol (typically months, not weeks) with recheck. Vitamin C with iron-rich meals aids absorption; tea with meals blocks it.":
    "हीमोग्लोबिन और फेरिटिन/आयरन जाँच से पुष्टि होती है; खुराक और अवधि बाल-चिकित्सा प्रोटोकॉल के अनुसार होती है (सामान्यतः महीनों, हफ़्तों में नहीं) और दोबारा जाँच ज़रूरी है। आयरन-युक्त भोजन के साथ विटामिन C अवशोषण में मदद करता है; भोजन के साथ चाय अवशोषण रोकती है।",
  "Food anchors: ragi, bajra, groundnuts, til, jaggery ( modest ), green leafies with lemon, eggs/meat where eaten, sprouted grains.":
    "आहार के मुख्य स्रोत: रागी, बाजरा, मूँगफली, तिल, गुड़ (सीमित मात्रा में), नींबू के साथ हरी सब्ज़ियाँ, अंडे/मांस (यदि खाते हों) और अंकुरित अनाज।",
  "Iron syrup se kabz hota hai — kya karein?":
    "आयरन सिरप से कब्ज़ होती है — क्या करें?",
  "Dose timing, paani-fibre badhayein aur doctor se formulation badalne par baat karein — band na karein. Kabz ka ilaj saath chalta hai.":
    "खुराक का समय बदलें, पानी और रेशा बढ़ाएँ तथा डॉक्टर से औषधि बदलने पर बात करें — खुद बंद न करें। कब्ज़ का इलाज साथ-साथ चलता है।",
  "Bachche me khoon ki kami": "बच्चे में खून की कमी",
  "iron ki kami ke lakshan": "आयरन की कमी के लक्षण",
  "Immunity Myths vs Facts": "प्रतिरक्षा: मिथक और तथ्य",
  "Child Immunity: 7 Myths vs What Actually Works":
    "बच्चों की प्रतिरक्षा: 7 मिथक और वह जो वास्तव में काम करता है",
  "Child Immunity Myths vs Facts | What Really Prevents Illness":
    "बच्चों की प्रतिरक्षा: मिथक बनाम तथ्य | बीमारी से वास्तव में क्या बचाता है",
  "No product 'boosts' immunity on demand. Vaccines, sleep, nutrition, hand hygiene and smoke-free air — ranked by evidence. Plus Ayurvedic view.":
    "कोई उत्पाद माँगे जाने पर प्रतिरक्षा को 'बढ़ाता' नहीं है। टीके, नींद, पोषण, हाथ की स्वच्छता और धुएँ से मुक्त हवा — साक्ष्य के आधार पर प्राथमिकता। साथ में आयुर्वेदिक दृष्टि।",
  "KMC kaise kare": "कंगारू मदर केयर कैसे करें",

  /* Indore landing pages */
  "Palasia": "पालासिया",
  "Vishnupuri": "विष्णुपुरी",
  "Bengali Square": "बंगाली स्क्वायर",
  "Kanadia": "कनाडिया",
  "Rajendra Nagar": "राजेंद्र नगर",
  "Sudama Nagar": "सुदामा नगर",
  "Annapurna": "अन्नपूर्णा",
  "Online across MP & India": "मध्य प्रदेश और पूरे भारत में ऑनलाइन",
  "Address: Sanchar Nagar Extension, Kanadia Road, Indore, MP 452016":
    "पता: संचार नगर एक्सटेंशन, कनाडिया रोड, इंदौर, मध्य प्रदेश 452016",
  "Timings: Mon–Sat, 10 AM–2 PM & 5–8 PM IST (evening + NRI-friendly online slots)":
    "समय: सोम–शनि, सुबह 10–दोपहर 2 और शाम 5–8 बजे IST (शाम और विदेश में रहने वाले परिवारों के लिए ऑनलाइन स्लॉट)",
  "Phone/WhatsApp: +91 98607 75010 • Email: drpriyankalikhar@gmail.com":
    "फ़ोन/व्हाट्सऐप: +91 98607 75010 • ईमेल: drpriyankalikhar@gmail.com",
  "What to carry: prior reports, medicine list, growth record, 3-day diet note":
    "साथ लाएँ: पुरानी रिपोर्ट, दवाओं की सूची, विकास रिकॉर्ड और 3 दिन के आहार का विवरण",
  "Indore mein Ayurvedic doctor kaise chunein?":
    "इंदौर में आयुर्वेदिक डॉक्टर कैसे चुनें?",
  "Degree (BAMS + specialization), bachchon ka focused anubhav, pehli visit ka samay (jaldi wali 5-min OPD se bachein), likhit prescription/diet chart, aur red-flag honesty — ye paanch cheezen dekhein.":
    "डिग्री (BAMS और विशेषज्ञता), बच्चों में केंद्रित अनुभव, पहली विज़िट का समय (5 मिनट वाली जल्दबाज़ी की ओपीडी से बचें), लिखित पर्चा/आहार चार्ट और खतरे के संकेतों के बारे में ईमानदारी — ये पाँच चीज़ें देखें।",
  "Kya bachchon ke liye Ayurvedic dawai safe hai?":
    "क्या बच्चों के लिए आयुर्वेदिक दवा सुरक्षित है?",
  "Qualified doctor se age-dosed, quality-verified dawai aam taur par safe hoti hai. Label/batch dekhein, bina diagnosis ke powder na lein, aur emergency me turant modern care lein.":
    "योग्य डॉक्टर से उम्र के अनुसार दी गई, गुणवत्ता-प्रमाणित दवा सामान्यतः सुरक्षित होती है। लेबल और बैच देखें, बिना निदान के पाउडर न लें और आपात स्थिति में तुरंत आधुनिक चिकित्सा लें।",
  "Online consultation available hai?":
    "क्या ऑनलाइन परामर्श उपलब्ध है?",
  "Haan — video par detailed assessment, e-prescription aur diet chart; dawai courier/local pharmacy se. Booking par current slots confirm karein.":
    "हाँ — वीडियो पर विस्तृत मूल्यांकन, ई-पर्चा और आहार चार्ट; दवा कूरियर या स्थानीय फ़ार्मेसी से। बुकिंग पर वर्तमान स्लॉट की पुष्टि करें।",
  "Indore mein Ayurvedic doctor": "इंदौर में आयुर्वेदिक डॉक्टर",
  "Kanadia road ayurvedic clinic": "कनाडिया रोड आयुर्वेदिक क्लिनिक",
  "bachchon ke doctor Indore": "बच्चों के डॉक्टर इंदौर",
  "Child Healthcare in Indore": "इंदौर में बाल स्वास्थ्य सेवा",
  "Ayurvedic Consultation — process & fees": "आयुर्वेदिक परामर्श — प्रक्रिया और शुल्क",
  "Contact & appointments": "संपर्क और अपॉइंटमेंट",
  "How to Choose (Best Doctor Guide)": "कैसे चुनें (सर्वश्रेष्ठ डॉक्टर मार्गदर्शिका)",
  "Finding the Best Ayurvedic Doctor in Indore: An Honest Checklist":
    "इंदौर में सर्वश्रेष्ठ आयुर्वेदिक डॉक्टर कैसे खोजें: ईमानदार जाँच सूची",
  "Best Ayurvedic Doctor in Indore? How to Choose Right":
    "इंदौर में सर्वश्रेष्ठ आयुर्वेदिक डॉक्टर? सही कैसे चुनें",
  "No clinic can crown itself 'best'. Use this 7-point checklist — credentials, child focus, time, transparency — then decide. Includes Indore consult info.":
    "कोई क्लिनिक स्वयं को 'सर्वश्रेष्ठ' नहीं कह सकता। इस 7-सूत्री जाँच सूची का उपयोग करें — योग्यता, बच्चों पर केंद्रित अनुभव, समय और पारदर्शिता — फिर तय करें। इंदौर में परामर्श की जानकारी भी शामिल है।",
  "Every clinic page claims to be the 'best' — which makes the word meaningless. We will not claim it about ourselves. Instead, here is the checklist we wish every parent used, and how our clinic answers each point so you can judge for yourself.":
    "हर क्लिनिक का पृष्ठ स्वयं को 'सर्वश्रेष्ठ' बताता है — जिससे यह शब्द अर्थहीन हो जाता है। हम अपने बारे में ऐसा दावा नहीं करेंगे। इसके बजाय यह वह जाँच सूची है जो हर माता-पिता को उपयोग करनी चाहिए, और हमारा क्लिनिक हर बिंदु पर क्या उत्तर देता है ताकि आप स्वयं निर्णय ले सकें।",
  "2. Child focus: children are not small adults — ask what share of practice is paediatric":
    "2. बच्चों पर केंद्रित: बच्चे छोटे वयस्क नहीं होते — पूछें कि अभ्यास का कितना हिस्सा बाल-चिकित्सा का है",
  "3. Time: a real first assessment takes 30–45 minutes, not 5":
    "3. समय: पहला वास्तविक मूल्यांकन 30–45 मिनट लेता है, 5 मिनट नहीं",
  "4. Written plan: prescription + diet + review date, in language you understand":
    "4. लिखित योजना: पर्चा, आहार और समीक्षा की तारीख — आपकी समझ में आने वाली भाषा में",
  "5. Red-flag honesty: a good doctor says when Ayurveda is NOT the answer and refers onward":
    "5. खतरे के संकेतों पर ईमानदारी: अच्छा डॉक्टर बताता है कि आयुर्वेद कब उत्तर नहीं है और आगे किस विशेषज्ञ के पास भेजना है",
  "6. No fear-selling: no forced packages, no 'cure in X days' promises, no secret formulas":
    "6. डर बेचकर बिक्री नहीं: ज़बरदस्ती पैकेज नहीं, 'गिने दिनों में इलाज' का वादा नहीं, गुप्त फ़ॉर्मूले नहीं",
  "7. Follow-up access: a defined doubt-window and scheduled reviews, not disappear-after-payment":
    "7. फ़ॉलो-अप उपलब्धता: सवाल पूछने का निश्चित समय और तय समीक्षाएँ — भुगतान के बाद गायब नहीं",
  "Indore (all zones)": "इंदौर (सभी क्षेत्र)",
  "Dewas": "देवास",
  "Ujjain": "उज्जैन",
  "Dhar": "धार",
  "Online across MP": "पूरे मध्य प्रदेश में ऑनलाइन",
  "Compare 2–3 clinics on the checklist above before deciding.":
    "निर्णय लेने से पहले ऊपर दी गई जाँच सूची पर 2–3 क्लिनिकों की तुलना करें।",
  "Kya aap 'best' hone ka daava karte hain?":
    "क्या आप 'सर्वश्रेष्ठ' होने का दावा करते हैं?",
  "Nahi. 'Best' naapa nahi ja sakta. Hum apni degree, process aur transparency saaf batate hain — faisla checklist se aap karein.":
    "नहीं। 'सर्वश्रेष्ठ' मापा नहीं जा सकता। हम अपनी डिग्री, प्रक्रिया और पारदर्शिता स्पष्ट बताते हैं — निर्णय जाँच सूची से आप करें।",
  "Fees compare kaise karein?":
    "शुल्क की तुलना कैसे करें?",
  "Sirf first-visit fee nahi — review frequency, dawai cost transparency aur package pressure bhi dekhein. Sabse sasti OPD aksar sabse mehengi padti hai (repeat visits).":
    "केवल पहली विज़िट का शुल्क नहीं — समीक्षा की आवृत्ति, दवाओं की कीमत में पारदर्शिता और पैकेज का दबाव भी देखें। सबसे सस्ती ओपीडी अक्सर सबसे महँगी पड़ती है (बार-बार विज़िट के कारण)।",
  "Indore me best ayurvedic doctor kaise chune":
    "इंदौर में सर्वश्रेष्ठ आयुर्वेदिक डॉक्टर कैसे चुनें",
  "achche vaidya ki pehchan": "अच्छे वैद्य की पहचान",
  "Doctor profile & qualifications": "डॉक्टर प्रोफ़ाइल और योग्यता",
  "Consultation process": "परामर्श प्रक्रिया",
  "Child Healthcare in Indore: Ayurvedic Paediatric Consultation":
    "इंदौर में बाल स्वास्थ्य सेवा: आयुर्वेदिक बाल-चिकित्सा परामर्श",
  "Child Healthcare in Indore | Ayurvedic Child Consultation":
    "इंदौर में बाल स्वास्थ्य सेवा | आयुर्वेदिक बाल परामर्श",
  "Bachchon ke doctor in Indore — growth, appetite, skin, cold-cough, sleep & development support. Clinic + online. Book a consultation.":
    "इंदौर में बच्चों के डॉक्टर — विकास, भूख, त्वचा, सर्दी-खाँसी, नींद और विकासात्मक सहायता। क्लिनिक और ऑनलाइन। परामर्श बुक करें।",
  "Growth & appetite: weight, height curves, anaemia, picky eating":
    "विकास और भूख: वज़न, लंबाई वक्र, एनीमिया और चुनिंदा खाना",
  "Skin: eczema, rashes, fungal patterns — steroid-conscious protocols":
    "त्वचा: एक्ज़िमा, दाने, फंगल समस्याएँ — स्टेरॉयड-सतर्क प्रोटोकॉल",
  "Gut & sleep: constipation, bedwetting support, sleep routines":
    "पाचन और नींद: कब्ज़, बिस्तर गीला करने में सहायता, नींद की दिनचर्या",
  "Development: speech, attention and milestone support alongside therapy":
    "विकास: भाषण, ध्यान और विकास-पड़ाव में सहायता, साथ में आवश्यक थेरेपी",
  "First visit 45 min • Mon–Sat 10–2 & 5–8 IST":
    "पहली विज़िट 45 मिनट • सोम–शनि 10–2 और 5–8 बजे IST",
  "Carry: growth record, reports, medicine list, diet note":
    "साथ लाएँ: विकास रिकॉर्ड, रिपोर्ट, दवाओं की सूची और आहार का विवरण",
  "Phone/WhatsApp: +91 98607 75010":
    "फ़ोन/व्हाट्सऐप: +91 98607 75010",
  "Bachchon ke doctor in Indore — Ayurvedic ya paediatrician?":
    "इंदौर में बच्चों के डॉक्टर — आयुर्वेदिक या बाल-चिकित्सक?",
  "Dono ki bhoomika alag hai: paediatrician (MBBS/MD Paeds) acute/immunization/growth monitoring ke liye; Ayurvedic child consultant recurrent/chronic patterns, immunity, pachan-neend-routine ke liye. Hum milkar kaam karte hain, ek-dusre ki jagah nahi.":
    "दोनों की भूमिका अलग है: बाल-चिकित्सक (MBBS/MD Paeds) तीव्र बीमारी, टीकाकरण और विकास की निगरानी के लिए; आयुर्वेदिक बाल परामर्शदाता बार-बार होने वाली या दीर्घकालिक समस्याओं, प्रतिरक्षा और पाचन-नींद-दिनचर्या के लिए। हम साथ मिलकर काम करते हैं, एक-दूसरे के विकल्प नहीं।",
  "Kya aap vaccination karte hain?":
    "क्या आप टीकाकरण करते हैं?",
  "Nahi — vaccination apne paediatrician ke schedule par hi karwayein. Hum uska samarthan karte hain, vikalp nahi dete.":
    "नहीं — टीकाकरण अपने बाल-चिकित्सक के कार्यक्रम के अनुसार ही कराएँ। हम उसका सहयोग करते हैं, उसका विकल्प नहीं देते।",
  "Hamare clinic par Pushya Nakshatra ke din camps + assessed daily courses. Pehle suitability consultation hoti hai — bina assessment ke drops nahi.":
    "हमारे क्लिनिक में पुष्य नक्षत्र के दिन शिविर और मूल्यांकन के बाद दैनिक कोर्स होते हैं। पहले उपयुक्तता परामर्श होता है — बिना मूल्यांकन के बूँदें नहीं दी जातीं।",
  "Kya ye vaccine ki jagah hai?":
    "क्या यह टीके का विकल्प है?",
  "suvarnaprashan price Indore": "सुवर्णप्राशन की कीमत इंदौर",
  "Safety & quality checks": "सुरक्षा और गुणवत्ता की जाँच",
  "Book assessment": "मूल्यांकन बुक करें",
  "Assessment-first: no procedure without diagnosis, suitability and written plan":
    "पहले मूल्यांकन: निदान, उपयुक्तता और लिखित योजना के बिना कोई प्रक्रिया नहीं",
  "In-clinic offerings confirmed at consultation (see verification note)":
    "क्लिनिक में उपलब्ध सेवाओं की पुष्टि परामर्श में होती है (सत्यापन टिप्पणी देखें)",
  "Full protocol: preparation + procedure + recovery diet — never single-day 'detox' theatre":
    "पूरा प्रोटोकॉल: तैयारी + प्रक्रिया + सुधार-आहार — कभी एक दिन का 'डिटॉक्स' दिखावा नहीं",
  "Coordinated with your existing doctors; medicines never stopped abruptly":
    "आपके वर्तमान डॉक्टरों के साथ समन्वय; दवाएँ कभी अचानक बंद नहीं की जातीं",
  "Nearby: Dewas, Ujjain (assessment + referral as needed)":
    "आसपास: देवास, उज्जैन (आवश्यकतानुसार मूल्यांकन और रेफ़रल)",
  "Start with an Ayurvedic consultation to determine suitability":
    "उपयुक्तता तय करने के लिए आयुर्वेदिक परामर्श से शुरुआत करें",
  "Duration typically 7–21 days; estimate given in writing":
    "अवधि सामान्यतः 7–21 दिन; अनुमान लिखित रूप में दिया जाता है",
  "Kaunsi therapies aapke clinic me hoti hain?":
    "आपके क्लिनिक में कौन-सी थेरेपी उपलब्ध हैं?",
  "Wahi jo verify hain — consultation me likhit roop me bataya jata hai. Jo suvidha hamare yahan nahi hai, uske liye sahi referral diya jata hai.":
    "केवल वे जो सत्यापित हैं — परामर्श में लिखित रूप में बताई जाती हैं। जो सेवा हमारे यहाँ उपलब्ध नहीं है, उसके लिए सही रेफ़रल दिया जाता है।",
  "panchakarma kharcha kitna": "पंचकर्म का खर्च कितना",

  /* Previously partial translations that mixed English and Hindi */
  "Suvarnaprashan kya hai? Kya ye vaccine jaisa hai?":
    "सुवर्णप्राशन क्या है? क्या यह टीके जैसा है?",
  "What Is Suvarnaprashan? Classical Meaning, Shloka & Modern Use":
    "सुवर्णप्राशन क्या है? शास्त्रीय अर्थ, श्लोक और आधुनिक उपयोग",
  "Suvarnaprashan explained: classical shloka, ingredients, traditional claims vs evidence, and how modern clinics use it responsibly.":
    "सुवर्णप्राशन को समझें: शास्त्रीय श्लोक, सामग्री, पारंपरिक दावे बनाम साक्ष्य, और आधुनिक क्लिनिक इसे ज़िम्मेदारी से कैसे उपयोग करते हैं।",
  "Suvarnaprashan (Swarna-Prashana) literally means 'licking of gold' — a classical Ayurvedic Sanskar in which processed gold with Medhya herbs, honey and ghee is given to children. Kashyapa Samhita describes it as promoting Medha, Agni, Bala, Ayush, Mangalam, Punyam and Varnyam — classically rendered as intellect, digestion, strength, longevity, auspiciousness, virtue and complexion.":
    "सुवर्णप्राशन (स्वर्ण-प्राशन) का शाब्दिक अर्थ है 'स्वर्ण चटाना' — एक शास्त्रीय आयुर्वेदिक संस्कार, जिसमें संस्कृत स्वर्ण को मेध्य औषधियों, शहद और घी के साथ बच्चों को दिया जाता है। काश्यप संहिता में इसे मेधा, अग्नि, बल, आयु, मंगल, पुण्य और वर्ण की वृद्धि बताया गया है — अर्थात बुद्धि, पाचन, शक्ति, दीर्घायु, शुभता, सद्गुण और त्वचा-वर्ण।",
  "Suvarnaprashan Safety & Quality: How to Choose a Safe Provider":
    "सुवर्णप्राशन की सुरक्षा और गुणवत्ता: सुरक्षित प्रदाता कैसे चुनें",
  "Is Suvarnaprashan Safe? Quality Checks Every Parent Must Know":
    "क्या सुवर्णप्राशन सुरक्षित है? हर माता-पिता को गुणवत्ता की जाँच कैसे करनी चाहिए",
  "Suvarnaprashan's safety story is really a quality story: properly prepared, labelled, age-dosed drops from a qualified clinic have a strong traditional safety record — while unlabelled powders from unknown sellers are the genuine risk. This page teaches you to tell the difference in 5 minutes.":
    "सुवर्णप्राशन की सुरक्षा का असली आधार गुणवत्ता है: योग्य क्लिनिक से सही तरीके से तैयार, लेबल वाली और उम्र के अनुसार दी गई बूँदों का पारंपरिक सुरक्षा रिकॉर्ड मज़बूत है — जबकि अनजान विक्रेताओं की बिना लेबल वाली पाउडर असली जोखिम है। यह पृष्ठ 5 मिनट में अंतर पहचानना सिखाता है।",
  "Every parent considering Suvarnaprashan anywhere — use this as your filter":
    "हर माता-पिता जो कहीं भी सुवर्णप्राशन पर विचार कर रहे हैं — इसे अपनी जाँच का आधार बनाएँ",
  "1. Verified qualification: BAMS is mandatory; MD specialization should match your need (ours: Reg. No. 63934, MD — Pediatrician / Kaumarbhritya from ITRA, BAMS from Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur)":
    "1. सत्यापित योग्यता: BAMS अनिवार्य है; MD विशेषज्ञता आपकी आवश्यकता से मेल खानी चाहिए (हमारी: पंजीकरण संख्या 63934, MD — बाल-चिकित्सक / कौमारभृत्य, ITRA से; BAMS, डॉ. वंदनाताई जे. ढोने ग्रामीण आयुर्वेद कॉलेज, पातुर से)",
  "Our answers: MD Kaumarbhritya, child-focused, 45-min first visit, written plans, Hindi/Marathi/English/Gujarati, WhatsApp follow-up window.":
    "हमारे उत्तर: MD कौमारभृत्य, बच्चों पर केंद्रित, पहली विज़िट 45 मिनट, लिखित योजना, हिंदी/मराठी/अंग्रेज़ी/गुजराती, व्हाट्सऐप पर फ़ॉलो-अप का निश्चित समय।",
  "Bachchon ke doctor in Indore dhoondh rahe hain? BalChikitsa Ayurved Clinic focuses on children's health through Ayurveda's child specialty (Kaumarbhritya/Balarog): growth and appetite, skin, recurrent infections, digestion, sleep and developmental support — coordinated with your paediatrician, never competing with them.":
    "इंदौर में बच्चों के डॉक्टर खोज रहे हैं? बालचिकित्सा आयुर्वेद क्लिनिक आयुर्वेद की बाल-चिकित्सा विशेषज्ञता (कौमारभृत्य/बालरोग) के माध्यम से बच्चों के स्वास्थ्य पर केंद्रित है: विकास और भूख, त्वचा, बार-बार संक्रमण, पाचन, नींद और विकासात्मक सहायता — आपके बाल-चिकित्सक के साथ समन्वय में, उनसे प्रतिस्पर्धा नहीं।",
  "Bilkul nahi. Routine vaccination schedule par hi hoga — Suvarnaprashan sahayak parampara hai, vikalp nahi.":
    "बिल्कुल नहीं। नियमित टीकाकरण कार्यक्रम के अनुसार ही होगा — सुवर्णप्राशन सहायक परंपरा है, टीके का विकल्प नहीं।",
  "Panchakarma Treatment in Indore: Assessment-First Approach":
    "इंदौर में पंचकर्म उपचार: पहले मूल्यांकन का दृष्टिकोण",
  "Panchakarma Treatment in Indore | Assessment & Honest Guidance":
    "इंदौर में पंचकर्म उपचार | मूल्यांकन और ईमानदार मार्गदर्शन",
  "Considering Panchakarma in Indore? Learn what suits whom, safety, duration and process — with verified in-clinic offerings only.":
    "इंदौर में पंचकर्म पर विचार कर रहे हैं? जानें कि किसके लिए क्या उपयुक्त है, सुरक्षा, अवधि और प्रक्रिया — केवल सत्यापित क्लिनिक सेवाओं के साथ।",
  "Panchakarma in Indore is widely advertised — and widely misunderstood. This page explains what is genuinely offered here (assessment-first, with verified in-clinic therapies), who it suits, and when we will advise you against it. Please read the verification note: only confirmed in-clinic procedures are listed.":
    "इंदौर में पंचकर्म का व्यापक विज्ञापन होता है — और उसे व्यापक रूप से गलत समझा भी जाता है। यह पृष्ठ बताता है कि यहाँ वास्तव में क्या उपलब्ध है (पहले मूल्यांकन, सत्यापित क्लिनिक थेरेपी के साथ), किसे उपयुक्त है और हम कब इसके विरुद्ध सलाह देंगे। कृपया सत्यापन टिप्पणी पढ़ें: केवल पुष्ट क्लिनिक प्रक्रियाएँ ही सूचीबद्ध हैं।",
  "Kya bachchon ko Panchakarma hota hai?":
    "क्या बच्चों को पंचकर्म किया जाता है?",
  "Bachchon me keval saumya Bahya upchar (jaise Abhyanga) assessed cases me; Shodhana procedures bachchon ke liye routine nahi hain.":
    "बच्चों में केवल सौम्य बाह्य उपचार (जैसे अभ्यंग) मूल्यांकित मामलों में; शोधन प्रक्रियाएँ बच्चों के लिए नियमित उपचार नहीं हैं।",
  "Ayurvedic Paediatric Care in Indore (Kaumarbhritya) | BAMS MD":
    "इंदौर में आयुर्वेदिक बाल-चिकित्सा (कौमारभृत्य) | BAMS MD",
  "MD Kaumarbhritya child-focused Ayurvedic care in Indore — scope, limits, and coordination with paediatricians. Accurate, honest terminology.":
    "इंदौर में MD कौमारभृत्य द्वारा बच्चों पर केंद्रित आयुर्वेदिक देखभाल — दायरा, सीमाएँ और बाल-चिकित्सकों के साथ समन्वय। सटीक और ईमानदार शब्दावली।",
  "What Is Suvarnaprashan? Meaning, Benefits & Facts":
    "सुवर्णप्राशन क्या है? अर्थ, लाभ और तथ्य",
  "Online Suvarnaprashan kharid sakte hain?":
    "क्या सुवर्णप्राशन ऑनलाइन खरीद सकते हैं?",
  "Suvarnaprashan safe hai ya nahi":
    "सुवर्णप्राशन सुरक्षित है या नहीं",
  "Suvarnaprashan Ingredients & Preparation: What's Inside":
    "सुवर्णप्राशन की सामग्री और तैयारी: अंदर क्या है",
  "Respiratory & immunity: recurrent cold-cough, Suvarnaprashan guidance":
    "श्वसन और प्रतिरक्षा: बार-बार सर्दी-खाँसी, सुवर्णप्राशन मार्गदर्शन",
  "Ayurvedic Paediatric Care in Indore (Kaumarbhritya / Balarog)":
    "इंदौर में आयुर्वेदिक बाल-चिकित्सा (कौमारभृत्य / बालरोग)",
  "What Is Suvarnaprashan?": "सुवर्णप्राशन क्या है?",
  "Suvarnaprashan Safety & Quality": "सुवर्णप्राशन की सुरक्षा और गुणवत्ता",
  "Suvarnaprashan Ingredients": "सुवर्णप्राशन की सामग्री",
  "Suvarnaprashan Ingredients & Preparation Explained":
    "सुवर्णप्राशन की सामग्री और तैयारी समझी गई",
  "Panchakarma in Indore": "इंदौर में पंचकर्म",
  "Ayurvedic Child Care (Kaumarbhritya)": "आयुर्वेदिक बाल देखभाल (कौमारभृत्य)",
  "How CP is diagnosed (HINE, GMA, MRI), what early intervention includes, timelines and costs in India. Clear parent roadmap.":
    "सीपी का निदान कैसे किया जाता है (HINE, GMA, MRI), भारत में शुरुआती हस्तक्षेप में क्या शामिल है, समयसीमा और लागत — माता-पिता के लिए स्पष्ट मूल-कारण मार्ग।",
  "About Dr. Priyanka Likhar": "डॉ. प्रियंका लिखार के बारे में",
};
