/* Condition guides — batch 2 (adult & general health).
   status "draft": built at the URL with noindex, excluded from navigation and the
   sitemap until Dr. Priyanka Likhar has reviewed and approved the medical content. */
import type { ConditionPage } from "./conditions";

export const CONDITIONS_4: ConditionPage[] = [
  {
    slug: "hair-fall",
    status: "published",
    primaryKeyword: "hair fall Ayurvedic treatment",
    title: "Hair Fall",
    h1: "Hair Fall and Thinning Hair: Causes, When to Worry and Ayurvedic Care",
    seoTitle: "Hair Fall & Thinning Hair: Causes and Ayurvedic Approach",
    seoDescription:
      "Losing more hair than usual or noticing thinning? Learn the common causes of hair fall, tests a doctor may recommend, warning signs, and Ayurvedic scalp and lifestyle support.",
    category: "Skin & Hair",
    intro:
      "Are you finding more hair in the comb, the drain or on your pillow than you used to? Has the parting widened, or are there new patches on your scalp? Losing some hair every day is normal, but a noticeable increase, sudden patches or thinning needs a proper look. Hair fall has many possible causes, including stress, illness, nutritional deficiencies, thyroid disease, hormonal changes and genetic patterns. Dr. Priyanka Likhar looks at your history, scalp, diet, sleep and blood test results, and explains which causes are most likely.",
    whatIs: [
      "Hair grows in cycles of growth, rest and shedding. Most people shed around 50 to 100 hairs a day, which is considered normal. Hair fall becomes a concern when shedding increases, when hair thins over time, or when bald patches appear.",
      "The main patterns are telogen effluvium (widespread shedding after a stressor such as illness, surgery, childbirth or rapid weight loss), androgenetic alopecia (a gradual, genetically influenced thinning), alopecia areata (patchy hair loss from an autoimmune process), and scarring or inflammatory scalp conditions.",
    ],
    signs: [
      "Increased hair in the comb, shower or pillow over several weeks",
      "Widening of the parting, or thinning on the crown or hairline",
      "Round or patchy bald areas, sometimes with no redness or scaling",
      "Itching, scaling, redness or pain on the scalp",
      "Shedding that starts two to three months after a major illness, stress, surgery, fever or childbirth",
    ],
    ageNotes: [
      "Women: hair thinning often follows hormonal changes, including PCOS, thyroid disease, postpartum changes and menopause.",
      "Men: a receding hairline and crown thinning are common and often genetically influenced. Early assessment helps plan treatment.",
      "Children: hair loss in children should be assessed, as it can have medical causes including thyroid and nutritional problems.",
    ],
    causes: [
      "Telogen effluvium after physical or emotional stress, fever, surgery, childbirth or crash dieting",
      "Androgenetic alopecia, which is inherited and linked with hormone sensitivity of the hair follicles",
      "Alopecia areata, an autoimmune condition causing patchy loss",
      "Thyroid disorders (both overactive and underactive), which can cause diffuse thinning",
      "Iron deficiency or anaemia, and deficiencies of protein, zinc, vitamin B12 or vitamin D, which can contribute",
      "Scalp conditions such as dandruff, psoriasis, seborrhoeic dermatitis and fungal infection",
      "Medicines including some antidepressants, blood thinners, anti-thyroid drugs and chemotherapy",
      "Harsh hair treatments, tight hairstyles and heat damage (which causes breakage rather than true loss)",
    ],
    whenToAssess: [
      "Hair fall lasting more than three months, or shedding that is clearly increasing",
      "Bald patches, scalp inflammation, pain or scarring",
      "Hair fall together with other symptoms such as tiredness, weight change, irregular periods, facial hair or cold intolerance",
      "Hair loss in a child, or sudden hair loss at any age",
    ],
    diagnosis: [
      "A careful history of onset, stressors, illnesses, medicines, diet and family history of hair loss",
      "Examination of the scalp and a 'pull test' to estimate active shedding, with magnification or dermoscopy where available",
      "Blood tests as indicated, which may include thyroid function, ferritin or iron studies, vitamin B12, vitamin D, blood sugar and hormone levels",
      "A dermatologist's review or scalp biopsy when the diagnosis is unclear or when patches are present",
    ],
    management: [
      "Conventional treatment depends on the diagnosis. Options can include topical minoxidil, oral finasteride in men (with careful prescribing), treatment of underlying thyroid or iron problems, corticosteroid treatments for alopecia areata, and procedures in selected cases",
      "Ayurvedic care usually starts with understanding the cause, then supports digestion, nutrition, sleep and stress. Scalp massage with suitable oils, scalp care and classical formulations may be used as individually advised",
      "Classical texts link hair with bone and marrow tissues and describe several forms of hair loss (such as Khalitya and Indralupta). These traditional concepts help structure care but are not established biological mechanisms",
      "Ayurveda and conventional care can be combined, but prescribed medicines should not be stopped or started without the prescribing doctor's knowledge",
    ],
    homeCare: [
      "Eat a balanced diet with enough protein, pulses, dairy or alternatives, green vegetables and seasonal fruit",
      "Avoid crash diets and manage stress through regular sleep, movement and breaks",
      "Massage your scalp gently with a suitable oil for a few minutes, two or three times a week, and wash with a mild shampoo",
      "Avoid tight hairstyles, rough towel-drying and frequent heat styling",
      "Keep a record of shedding, and bring photos to your appointment to track changes",
    ],
    redFlags: [
      "Sudden, patchy hair loss with redness, scaling, pain, pus or scarring",
      "Rapid, diffuse shedding that is clearly increasing week by week",
      "Hair loss with signs of illness, such as fever, weight change, palpitations or severe fatigue",
      "Hair loss in a child, or in a person with a known thyroid or autoimmune disease, which needs medical evaluation",
    ],
    ayurvedaRole: [
      "Traditional Ayurvedic texts consider hair (Kesha) closely related to bone (Asthi) and to Pitta and Rakta. Hair fall (Khalitya) is discussed in relation to imbalances of these tissues, as well as stress and lifestyle.",
      "Assessment usually includes digestion, diet, sleep, stress and scalp condition. Diet and routine guidance typically emphasises nourishing foods, timely meals and reducing aggravating habits.",
      "Scalp care with traditional oils and herbs such as Amla, Bhringraj and Brahmi is common in Ayurveda. Their effects on hair are not established by high-quality clinical trials.",
      "These are traditional interpretations, not established mechanisms of hair growth.",
    ],
    ayurvedaLimits: [
      "Ayurveda cannot promise regrowth or a permanent stop to hair fall. Hair fall caused by genetics, autoimmune disease or thyroid disorders needs specific medical management.",
      "Hair dyes, straighteners and 'hair-growth' products may contain ingredients that irritate the scalp. Check labels and patch-test new products.",
      "Do not delay investigation of sudden or patchy hair loss while trying home or herbal remedies.",
    ],
    faqs: [
      {
        q: "How much hair loss is normal?",
        a: "Around 50 to 100 hairs a day is commonly considered normal. A noticeable, sustained increase or visible thinning is worth assessing.",
      },
      {
        q: "Will hair grow back after telogen effluvium?",
        a: "In most cases, yes. Shedding usually settles within three to six months once the trigger has passed, although it can take longer for the hair to look fuller again.",
      },
      {
        q: "Do hair vitamins work?",
        a: "They help only when there is a deficiency, such as iron or vitamin D deficiency. Taking high doses without a reason can be unnecessary and may cause problems. Get your levels checked before supplementing.",
      },
      {
        q: "Can thyroid problems cause hair fall?",
        a: "Yes. Both an underactive and an overactive thyroid can cause hair thinning. A thyroid blood test is a simple and important check.",
      },
      {
        q: "Do Ayurvedic oils stop hair fall?",
        a: "Some people enjoy scalp massage and find that their hair feels healthier. Strong evidence that oils or herbs reverse hair loss is lacking. Oils can also worsen scalp inflammation in some people, so patch-test first.",
      },
      {
        q: "Is hair fall in women different from men?",
        a: "Yes. Women more often have diffuse thinning, while men more often have a receding hairline and crown loss. Both can be linked with hormones and genetics, and treatment options differ, so a proper assessment matters.",
      },
      {
        q: "Should I see a dermatologist for hair loss?",
        a: "Yes, particularly if there are bald patches, scalp symptoms, sudden or heavy shedding, or if hair loss does not improve after a few months of addressing obvious causes.",
      },
    ],
    hinglish: ["baal jhadna ka ilaj", "hair fall ka ayurvedic upay", "ganjapan ayurveda", "baal patle hona"],
    references: [
      { label: "Hair loss — patient information", publisher: "NHS (UK)" },
      {
        label: "Hair loss: overview and types",
        publisher: "American Academy of Dermatology Association (aad.org)",
      },
      {
        label: "Classical references on Khalitya and Kesha (Sushruta Samhita; Ashtanga Hridaya)",
        publisher: "Classical Ayurvedic texts — interpretive reference",
      },
    ],
    relatedConditions: ["psoriasis", "pcos-pcod", "insomnia"],
    relatedTreatments: ["abhyanga", "ayurvedic-diet-lifestyle", "rasayana"],
    relatedArticles: [],
  },
  {
    slug: "pcos-pcod",
    status: "published",
    primaryKeyword: "PCOS Ayurvedic treatment Indore",
    title: "PCOS / PCOD",
    h1: "PCOS and PCOD: Symptoms, Diagnosis and Ayurvedic Care Approach",
    seoTitle: "PCOS & PCOD: Symptoms, Diagnosis and Ayurvedic Approach",
    seoDescription:
      "Irregular periods, acne, excess hair growth or weight gain? Learn what PCOS and PCOD mean, how they are diagnosed, when to see a doctor, and supportive Ayurvedic care for cycles and metabolism.",
    category: "Women's Health",
    intro:
      "Are your periods irregular, sometimes months apart? Have you noticed acne, unwanted facial hair, hair thinning on the scalp or weight gain around the abdomen? Many women are told they have PCOD after an ultrasound and want to understand what this means for their health and fertility. PCOS (polycystic ovary syndrome) is a common hormonal condition, and it is manageable. A proper diagnosis matters, because several other conditions can cause similar symptoms. Dr. Priyanka Likhar assesses your cycle, metabolic health and symptoms, and advises on tests and medical care.",
    whatIs: [
      "Polycystic ovary syndrome (PCOS) is a common hormonal condition in women of reproductive age. Diagnosis uses the Rotterdam criteria: two of three features are needed (irregular or absent ovulation; signs of excess androgen by symptoms or blood tests; and polycystic ovarian morphology on ultrasound), after other causes have been excluded.",
      "PCOD (polycystic ovarian morphology) is a term often used for the ultrasound appearance of the ovaries. Having a 'polycystic' appearance on a scan does not, on its own, confirm PCOS. The 2023 international guideline emphasises that the diagnosis should be made with a full clinical assessment.",
    ],
    signs: [
      "Irregular, infrequent or absent periods",
      "Acne, oily skin, or hair thinning on the scalp",
      "Excess facial or body hair (hirsutism)",
      "Weight gain, especially around the abdomen, and difficulty losing weight",
      "Darkened patches of skin on the neck, armpits or groin, which may indicate insulin resistance",
      "Difficulty becoming pregnant in some women",
    ],
    ageNotes: [
      "Adolescents: irregular cycles are common in the first years after puberty and do not always mean PCOS. Persistent symptoms need review.",
      "Women planning pregnancy: PCOS is one of the more common causes of ovulation problems, and planning should be done with a gynaecologist or fertility specialist.",
      "After 40: symptoms may change, and blood sugar, lipids and blood pressure become more important to monitor.",
    ],
    causes: [
      "Hormonal imbalance involving androgens (male-type hormones) and insulin, which can affect ovulation and follicle development",
      "Insulin resistance, which is common in women with PCOS and is strongly linked with weight, diet and inactivity",
      "A genetic tendency, as PCOS often runs in families",
      "Obesity, which can worsen many features of PCOS",
      "Stress and sleep disturbance, which may influence hormone patterns",
      "Other conditions to exclude, including thyroid disease, raised prolactin, adrenal disorders and medicines that affect cycles",
    ],
    whenToAssess: [
      "Periods that are absent for more than three months, or are very irregular",
      "Symptoms of excess androgen (acne, hair growth) that are troubling or progressing",
      "A wish to conceive, or difficulty conceiving after a year of regular unprotected intercourse (six months if over 35)",
      "Any heavy bleeding, pelvic pain or sudden change in symptoms",
    ],
    diagnosis: [
      "History and examination, including weight, blood pressure, and skin and hair patterns",
      "Blood tests for hormones such as testosterone, LH, FSH, prolactin and thyroid function, and blood sugar tests and a lipid profile for metabolic screening",
      "Pelvic ultrasound, interpreted together with the clinical findings rather than alone",
      "Screening for diabetes, sleep apnoea, mood changes and endometrial health when indicated",
    ],
    management: [
      "Conventional care in the 2023 international guideline focuses first on lifestyle change, including modest weight loss (5 to 10 per cent of body weight can improve cycles and metabolic health), physical activity and diet. Medicines include combined hormonal contraception for cycle regulation and androgen symptoms, metformin for insulin resistance in selected women, anti-androgen treatment in selected cases, and fertility treatment when pregnancy is planned",
      "Ayurvedic care may include diet guidance based on low-glycaemic, fibre-rich home food, daily routine, regular exercise, yoga and stress management, along with classical formulations chosen individually",
      "Ayurvedic care should be coordinated with gynaecological and metabolic monitoring. Do not stop prescribed hormonal or metabolic medicines without advice",
      "Pregnancy planning, fertility treatment and the management of diabetes are handled by the appropriate medical specialists",
    ],
    homeCare: [
      "Aim for regular meals that include protein, fibre and healthy fats, and limit refined sugar and very processed foods",
      "Be active most days, combining brisk walking with strength exercises and gentle yoga",
      "Sleep consistently for seven to eight hours, and manage stress with breathing exercises or a regular hobby",
      "Track your cycles in a calendar or app, and note symptoms to share with your doctor",
      "Get your blood sugar and thyroid checked periodically, as advised",
    ],
    redFlags: [
      "Very heavy bleeding that soaks a pad every hour for several hours, large clots, or dizziness and fainting",
      "No period for more than three months, with a possibility of pregnancy",
      "Severe or sudden pelvic pain",
      "Rapid deepening of the voice, rapid increase in facial hair, or enlargement of the clitoris (possible androgen-secreting tumour; needs urgent review)",
      "Thoughts of self-harm, or severe low mood or anxiety",
    ],
    ayurvedaRole: [
      "Traditional Ayurvedic texts discuss menstrual disorders (Artava Dushti) and conditions linked with Kapha and Medas (fat tissue), along with Agni (digestive and metabolic fire), Ama and Vata. These concepts are often used to describe the metabolic and menstrual features seen in PCOS.",
      "Ayurvedic care usually focuses on digestive strength, a weight-friendly, low-sugar diet, daily activity, sleep and stress reduction, which are also recommended in modern PCOS management.",
      "Classical formulations may be considered individually. Evidence for specific Ayurvedic treatments in PCOS is limited and mostly from small studies.",
      "These are traditional interpretations, not established explanations of PCOS.",
    ],
    ayurvedaLimits: [
      "Ayurveda cannot reverse PCOS or promise regular ovulation. Long-term health risks, including diabetes and heart disease risk, require monitoring.",
      "Do not stop contraceptives, metformin or any other medicine because of an Ayurvedic plan. Discuss changes with your gynaecologist.",
      "Pregnancy needs medical planning. Some herbs and formulations are not suitable in pregnancy or while trying to conceive.",
    ],
    faqs: [
      {
        q: "Is PCOD the same as PCOS?",
        a: "Not exactly. PCOD usually refers to the appearance of the ovaries on ultrasound, while PCOS is a diagnosis made from symptoms, blood tests and ultrasound together, after other causes are excluded. Many women with PCOD on a scan do not have PCOS, so the diagnosis should be confirmed by a clinician.",
      },
      {
        q: "Can PCOS be cured?",
        a: "PCOS is a lifelong tendency, but its symptoms and long-term risks can be well managed. Many women see improvement in cycles, skin and weight with lifestyle changes and suitable medical treatment.",
      },
      {
        q: "Can I get pregnant with PCOS?",
        a: "Yes, many women with PCOS conceive, often with support. If you are trying to conceive, see a gynaecologist early, and do not rely on ovulation prediction alone without advice.",
      },
      {
        q: "What diet is best for PCOS?",
        a: "A balanced, lower-glycaemic diet with fibre, protein and vegetables is a sensible starting point. The most effective diet is one you can follow consistently, ideally planned with a dietitian.",
      },
      {
        q: "Do I need hormone tests?",
        a: "Often, yes. Testing helps confirm the diagnosis and exclude thyroid and other problems. The timing of some tests matters, so your doctor will advise when to test.",
      },
      {
        q: "Are Ayurvedic medicines safe with metformin or contraceptive pills?",
        a: "They may interact or cause side effects. Always tell both your gynaecologist and your practitioner about every medicine and supplement, and do not change prescribed medicines without medical advice.",
      },
      {
        q: "At what age does PCOS usually show up?",
        a: "It often appears during the teenage years or early twenties, but it can be recognised at any age. Persistent irregular periods or acne in adolescence should be discussed with a doctor.",
      },
    ],
    hinglish: ["PCOS ka ilaj", "PCOD mein periods", "PCOD ka ayurvedic ilaj Indore", "anniyamit periods"],
    references: [
      {
        label:
          "Teede HJ, Tay CT, Laven JJE, et al. Recommendations from the 2023 international evidence-based guideline for the assessment and management of polycystic ovary syndrome",
        publisher: "International PCOS Guideline (2023)",
      },
      {
        label:
          "Revised 2003 consensus on diagnostic criteria and long-term health risks related to polycystic ovary syndrome. Hum Reprod. 2004;19(1):41–47",
        publisher: "ESHRE/ASRM-sponsored Rotterdam PCOS Consensus Workshop Group",
      },
      {
        label: "Classical references on Artava Dushti and Medas (Charaka Samhita; Ashtanga Hridaya)",
        publisher: "Classical Ayurvedic texts — interpretive reference",
      },
    ],
    relatedConditions: ["hair-fall", "insomnia", "constipation-adults"],
    relatedTreatments: ["ayurvedic-diet-lifestyle", "abhyanga", "rasayana"],
    relatedArticles: [],
  },
  {
    slug: "knee-pain",
    status: "published",
    primaryKeyword: "knee pain Ayurvedic treatment Indore",
    title: "Knee Pain",
    h1: "Knee Pain: Causes, Red Flags and Ayurvedic Care Approach",
    seoTitle: "Knee Pain: Causes, Red Flags and Ayurvedic Approach",
    seoDescription:
      "Pain, swelling or stiffness in the knee when climbing stairs or sitting? Understand common causes such as osteoarthritis, when to get an X-ray, and how Ayurvedic care supports joint comfort alongside exercise.",
    category: "Joint & Bone",
    intro:
      "Does your knee ache when you climb stairs, stand up from a chair or walk for a long time? Is it stiff in the morning, or swollen after activity? Knee pain is one of the most common joint complaints, especially after 40, and it can limit daily life. The most common cause is osteoarthritis, but others include ligament or meniscal injuries, tendon problems, gout and inflammatory arthritis. Dr. Priyanka Likhar assesses the cause, function and daily activity, and guides you on exercise, medicines and when imaging or orthopaedic review is needed.",
    whatIs: [
      "Knee osteoarthritis is gradual wear and tear of the joint cartilage, with changes to the bone and surrounding tissues. It is more common with age, excess weight, previous injury and certain occupations. Pain is often worse with activity and better with rest, and may cause stiffness in the morning.",
      "Knee pain can also come from the kneecap (patellofemoral pain), tendons, bursae, meniscal or ligament injuries, or referred pain from the hip or back. An accurate assessment is important for choosing the right treatment.",
    ],
    signs: [
      "Pain on stairs, squatting, kneeling, or getting up from a chair",
      "Stiffness after rest or in the morning that eases with movement",
      "Swelling, a feeling of warmth, or a sense of fluid in the knee",
      "Clicking, grinding, or a sense that the knee gives way",
      "Reduced range of movement, or a limp after a long walk",
    ],
    ageNotes: [
      "Older adults: osteoarthritis is common, and knee pain can affect independence, sleep and mood. Balance and falls risk should be assessed.",
      "Adults in their 30s and 40s: knee pain is often linked with sport, work posture, weight gain and previous injury.",
      "Young people and children: knee pain needs careful assessment, as growth-related conditions and injuries can cause it.",
    ],
    causes: [
      "Osteoarthritis, with gradual cartilage wear",
      "Excess body weight, which places extra load on the knee",
      "Weak thigh (quadriceps) and hip muscles, and reduced flexibility",
      "Previous injuries, meniscal tears or ligament damage",
      "Patellofemoral pain syndrome (kneecap pain), often from muscle imbalance or overuse",
      "Gout, pseudogout or rheumatoid arthritis, which are inflammatory conditions needing specific treatment",
      "Bursitis or tendinopathy from repetitive activity or kneeling",
      "Referred pain from the hip, lower back or an irritated nerve",
    ],
    whenToAssess: [
      "Pain lasting more than two to three weeks, or pain that keeps returning",
      "Swelling, locking, giving way, or inability to straighten the knee fully",
      "Pain that wakes you at night or affects walking or sleep",
      "Knee pain with a rash, fever or swollen joints elsewhere",
    ],
    diagnosis: [
      "Clinical examination, including gait, range of movement, swelling, stability and strength",
      "An X-ray of the knee when there is persistent pain, deformity or after injury. MRI is used selectively for injuries or where the diagnosis is uncertain",
      "Blood tests such as uric acid, inflammatory markers, and rheumatoid factor or antibodies where inflammatory arthritis is suspected",
      "Joint fluid sampling if infection or crystal arthritis is suspected",
    ],
    management: [
      "Guidelines for knee osteoarthritis (NICE NG226 and OARSI) recommend exercise (strengthening and aerobic), weight loss where overweight, education and self-management, and physiotherapy as the foundation. Topical NSAIDs, oral painkillers at the lowest effective dose and injections are used as indicated. Surgery is considered when non-surgical measures are not enough",
      "Ayurvedic care may include a joint-friendly diet, weight management, gentle movement, external therapies suited to the joint and person, and classical formulations individually advised. The traditional term Janu Shoola refers to knee pain",
      "Do not stop prescribed painkillers, steroids or other medicines suddenly. Any combined plan should be coordinated with your doctor",
      "Physiotherapy and exercise are essential and should not be replaced by passive treatments alone",
    ],
    homeCare: [
      "Do strengthening exercises for the thigh and hips most days, as taught by a physiotherapist",
      "Walk on flat surfaces, use a handrail on stairs, and pace activity rather than doing too much on bad days",
      "Use supportive footwear, and a brace only if advised",
      "Apply cold or warmth as is comfortable, but avoid heat on a hot, swollen joint",
      "Keep a symptom diary to see which activities help and which worsen pain",
    ],
    redFlags: [
      "A hot, very swollen, red knee with fever or feeling unwell (possible joint infection; urgent)",
      "Sudden severe pain after a fall or twisting injury with swelling, or inability to bear weight",
      "The knee giving way repeatedly, locking, or a visible deformity",
      "Calf pain, swelling or redness, especially after a long journey or surgery (possible blood clot; urgent)",
      "Numbness, weakness, or loss of bladder or bowel control with back-related leg pain (urgent)",
    ],
    ayurvedaRole: [
      "Traditional Ayurvedic texts describe joint pain under Sandhigata Vata, and Janu Shoola is used specifically for knee pain. Vata is linked with dryness, mobility and pain, while Kapha and Ama (toxins) are sometimes described as contributing to stiffness and swelling.",
      "Ayurvedic care often emphasises reducing aggravating factors such as cold, dryness, excessive walking on hard surfaces, weight gain and poor digestion, and supporting strength and mobility through daily routine.",
      "External therapies such as medicated oil massage or warm compresses may be used in suitable cases. Classical formulations and procedures are considered only after assessment, with attention to safety.",
      "These are traditional interpretations. Evidence for many Ayurvedic joint therapies is limited, and studies are often small or of low quality.",
    ],
    ayurvedaLimits: [
      "No honest claim can be made that Ayurveda regenerates cartilage or permanently cures osteoarthritis. The goal is symptom control, function and quality of life.",
      "Avoid heavy oils, hot pastes or aggressive manipulation on swollen or hot joints, which can worsen inflammation or cause burns.",
      "Do not delay assessment of a swollen, hot or unstable knee in favour of home or traditional treatment.",
    ],
    faqs: [
      {
        q: "Is knee pain always arthritis?",
        a: "No. Knee pain can come from injury, tendon or kneecap problems, inflammatory arthritis, gout, or problems in the hip or back. Osteoarthritis is common in older adults, but the cause needs to be confirmed.",
      },
      {
        q: "Do I need an MRI for knee pain?",
        a: "Not usually for simple osteoarthritis, where X-rays are often enough. An MRI is used when a meniscal or ligament injury is suspected, or when the diagnosis is unclear and treatment depends on it.",
      },
      {
        q: "Can exercise make knee arthritis worse?",
        a: "Appropriate strengthening and low-impact exercise generally helps knee osteoarthritis. A mild, short-lived increase in pain during exercise is common. Sharp pain or swelling afterwards means the load should be adjusted with a physiotherapist.",
      },
      {
        q: "Does Ayurveda help knee arthritis?",
        a: "Ayurvedic support may help some people with comfort, mobility and daily function when combined with exercise and medical care. It does not reverse arthritis, and the evidence for specific treatments is limited.",
      },
      {
        q: "Is knee replacement the only option for severe pain?",
        a: "No. Options include exercise, weight management, medicines, injections, physiotherapy and walking aids. Knee replacement is considered when pain and function are severely affected and other measures have not helped.",
      },
      {
        q: "Are painkillers safe for long-term use?",
        a: "Painkillers such as NSAIDs carry risks for the stomach, kidneys, blood pressure and heart. Use them at the lowest effective dose for the shortest time, and discuss long-term use with your doctor.",
      },
      {
        q: "When should I see a doctor urgently for knee pain?",
        a: "Seek urgent care for a hot, swollen knee with fever, a sudden inability to walk after an injury, or calf swelling or breathlessness. These can be serious.",
      },
    ],
    hinglish: ["ghutne ka dard", "ghutno mein dard ka ilaj", "janu shoola ayurveda", "ghutne mein sujan"],
    references: [
      {
        label: "Osteoarthritis in over 16s: diagnosis and management (NG226)",
        publisher: "NICE, UK (2022)",
      },
      {
        label:
          "Bannuru RR, Osani MC, Vaysbrot EE, et al. OARSI guidelines for the non-surgical management of knee, hip, and polyarticular osteoarthritis. Osteoarthritis Cartilage. 2019;27(11):1578–1589",
        publisher: "Osteoarthritis Research Society International",
      },
      {
        label: "Classical references on Sandhigata Vata and Janu Shoola (Charaka Samhita; Ashtanga Hridaya)",
        publisher: "Classical Ayurvedic texts — interpretive reference",
      },
    ],
    relatedConditions: ["insomnia", "constipation-adults"],
    relatedTreatments: ["abhyanga", "basti-therapy", "ayurvedic-diet-lifestyle"],
    relatedArticles: ["joint-pain-osteoarthritis-ayurveda"],
  },
  {
    slug: "migraine",
    status: "published",
    primaryKeyword: "migraine treatment Ayurveda",
    title: "Migraine",
    h1: "Migraine: Symptoms, Triggers and Ayurvedic Care Approach",
    seoTitle: "Migraine: Symptoms, Triggers and Ayurvedic Approach",
    seoDescription:
      "A throbbing one-sided headache with nausea or light sensitivity? Learn migraine symptoms, common triggers, red flags that need urgent care, and how Ayurvedic lifestyle support fits alongside neurology care.",
    category: "Neurological",
    intro:
      "Do you get throbbing headaches on one side of the head that last for hours, with nausea or sensitivity to light and noise? Do they get worse with movement, or leave you exhausted for a day afterwards? Migraine is a common, disabling condition, and it can be treated. It is also important to recognise headaches that need urgent evaluation. Dr. Priyanka Likhar helps you understand your pattern and triggers, explains the warning signs, and works with your neurologist or physician where needed.",
    whatIs: [
      "Migraine is a primary headache disorder with recurring attacks. Attacks commonly last from four to 72 hours and may be preceded by warning symptoms (prodrome) or, in some people, by an aura such as visual changes or tingling.",
      "Migraine is classified in the International Classification of Headache Disorders (ICHD-3). Frequent attacks and overuse of painkillers can lead to chronic migraine and medication-overuse headache, which need specific treatment.",
    ],
    signs: [
      "Throbbing or pulsating pain, often on one side of the head, of moderate to severe intensity",
      "Nausea, sometimes with vomiting",
      "Sensitivity to light, sound or smells",
      "Worsening with routine physical activity such as climbing stairs",
      "Visual disturbance, tingling or difficulty speaking before or during an attack in some people (aura)",
      "Tiredness, difficulty concentrating and low mood after the attack",
    ],
    ageNotes: [
      "Children and teenagers: migraine is common and may be under-recognised. Abdominal pain or motion sickness can be part of the pattern. Treatment should be paediatric-appropriate.",
      "Women: attacks often relate to the menstrual cycle, hormonal contraception and pregnancy. Specialist review is important when planning treatment.",
      "Older adults: a new headache pattern after age 50 needs medical evaluation, because other causes must be excluded.",
    ],
    causes: [
      "A genetic tendency, as migraine often runs in families",
      "Changes in brain chemistry and nerve pathways, which are the focus of current research",
      "Triggers that differ between people, including poor or irregular sleep, skipped meals, dehydration, stress and its release, bright lights, loud noise, strong smells and weather changes",
      "Hormonal changes, particularly around menstruation",
      "Alcohol, caffeine withdrawal, and some foods (such as aged cheese and processed meats) in susceptible people",
      "Frequent use of painkillers, which can cause medication-overuse headache",
    ],
    whenToAssess: [
      "Headaches that happen several times a month, or that interfere with work, study or family life",
      "Headaches that do not respond to usual painkillers, or that need painkillers on more than two to three days a week",
      "A new headache pattern, changing symptoms, or aura that is different from usual",
      "Any headache pattern that worries you",
    ],
    diagnosis: [
      "A careful history of headache characteristics, duration, triggers, medicine use and family history. A headache diary is often very useful",
      "Neurological examination and blood pressure measurement",
      "Imaging (MRI or CT) only when red flags are present or the pattern is atypical",
      "Blood tests in selected cases, such as anaemia or thyroid disease",
    ],
    management: [
      "Migraine treatment guidance recommends acute treatment early in an attack (such as simple analgesics, triptans or newer agents as prescribed) and preventive treatment for frequent or disabling migraine (for example, certain blood pressure, antiepileptic or antidepressant medicines, or CGRP-targeted treatments). Choices are made by your physician or neurologist",
      "Lifestyle measures include regular sleep and meal times, adequate fluids, regular exercise, stress management, limiting painkiller use, and identifying triggers",
      "Ayurvedic care may include diet and routine advice, relaxation practices and, where suitable, external therapies such as Shirodhara for stress-related headache. Classical formulations may be considered individually, with monitoring",
      "Do not stop prescribed migraine preventives suddenly. Discuss any Ayurvedic addition with your doctor",
    ],
    homeCare: [
      "Keep regular sleep and wake times, including weekends if possible",
      "Do not skip meals, and keep water handy through the day",
      "Keep a diary of attacks, sleep, food, stress and menstrual cycle to identify triggers",
      "Rest in a dark, quiet room during an attack, and use a cold compress on the head or neck if comfortable",
      "Limit painkiller use to no more than two to three days a week, and check with your doctor if you need more",
    ],
    redFlags: [
      "A sudden, severe headache that reaches full intensity within about a minute (thunderclap headache). This is an emergency",
      "The first severe headache of your life, or a new and very different headache after age 50",
      "Headache with fever and stiff neck, a rash, confusion or drowsiness",
      "Weakness, numbness, speech difficulty, double vision, loss of vision or seizures (emergency)",
      "Headache after a head injury, a headache that wakes you from sleep and is worsening, or headache in pregnancy with high blood pressure (urgent)",
    ],
    ayurvedaRole: [
      "Traditional texts describe a headache affecting one side of the head as Ardhavabhedaka (hemicrania), often linked with Vata and Pitta. Stress, heat, irregular food and sleep are described as aggravating factors.",
      "Ayurvedic management typically looks at digestion, sleep, stress and the person's constitution. Diet and lifestyle advice emphasises regular meals, adequate hydration, avoidance of personal triggers and calming routines.",
      "Shirodhara and Nasya are traditional therapies sometimes used for stress-related or head-related symptoms. Suitability depends on the individual, and evidence for migraine is limited.",
      "These are traditional interpretations, not established mechanisms of migraine.",
    ],
    ayurvedaLimits: [
      "Ayurveda does not replace migraine diagnosis or prevention. Serious headache patterns must be investigated first.",
      "Do not stop triptans, preventive medicines or other prescribed treatments because of an Ayurvedic plan.",
      "Nasya, Shirodhara and other head therapies are not suitable for everyone, including people with bleeding disorders, pregnancy, sinus infections or recent head injury, and should only be given after assessment.",
    ],
    faqs: [
      {
        q: "How is migraine different from a tension headache?",
        a: "Migraine usually causes throbbing pain, often on one side, with nausea or sensitivity to light and sound, and it is worsened by movement. Tension headaches are usually a band-like pressure, less intense, and without nausea. The two can overlap, and a doctor can help you tell them apart.",
      },
      {
        q: "Can I take painkillers every day?",
        a: "No. Frequent use of painkillers can cause medication-overuse headache, which makes headaches more frequent. Use them sparingly, and seek advice if you need them more than two to three days a week.",
      },
      {
        q: "Are Ayurvedic treatments effective for migraine?",
        a: "Some people find that diet, routine, relaxation and certain therapies help their symptoms. Evidence for specific Ayurvedic treatments in migraine is limited. Ayurveda can be a supportive part of care, but it is not a replacement for proven migraine treatment.",
      },
      {
        q: "Do foods trigger migraine?",
        a: "Some foods trigger attacks in susceptible people, but the list is personal. Keeping a diary for several weeks is more helpful than cutting many foods at once.",
      },
      {
        q: "When should I see a neurologist?",
        a: "Consider a neurology review if attacks are frequent or disabling, do not respond to treatment, or if there are atypical features, new or prolonged aura, or other neurological symptoms.",
      },
      {
        q: "Is migraine common in children?",
        a: "Yes. Children can have migraine, often with abdominal pain or dizziness, and it can be easily missed. Paediatric assessment is recommended, and any medicine should be dosed for the child's age and weight.",
      },
      {
        q: "Can stress cause migraine?",
        a: "Stress can trigger attacks in some people, particularly when it is followed by relaxation (the 'let-down' effect). Stress management is an important part of prevention, but migraine has many causes and is not only due to stress.",
      },
    ],
    hinglish: ["migraine ka ilaj", "aadha sir dard", "sir dard ke saath ulti", "ardhavabhedaka ayurveda"],
    references: [
      {
        label:
          "Headache Classification Committee of the International Headache Society. The International Classification of Headache Disorders, 3rd edition (ICHD-3). Cephalalgia. 2018;38(1):1–211",
        publisher: "International Headache Society",
      },
      { label: "Migraine (Clinical Knowledge Summaries)", publisher: "NICE, UK" },
      {
        label: "Classical references on Ardhavabhedaka and Suryavarta (Charaka Samhita; Madhava Nidana)",
        publisher: "Classical Ayurvedic texts — interpretive reference",
      },
    ],
    relatedConditions: ["insomnia", "pcos-pcod"],
    relatedTreatments: ["shirodhara", "nasya", "ayurvedic-diet-lifestyle"],
    relatedArticles: [],
  },
  {
    slug: "insomnia",
    status: "published",
    primaryKeyword: "insomnia Ayurvedic treatment Indore",
    title: "Insomnia & Disturbed Sleep",
    h1: "Insomnia and Disturbed Sleep: Causes, Warning Signs and Ayurvedic Care Approach",
    seoTitle: "Insomnia & Disturbed Sleep: Causes and Ayurvedic Approach",
    seoDescription:
      "Struggling to fall asleep, waking often or feeling unrefreshed? Understand insomnia's common causes, when to seek help, sleep-friendly habits, and how Ayurvedic routine support fits with medical care.",
    category: "Sleep & Habits",
    intro:
      "Do you lie awake for an hour or more before sleep, wake several times a night, or wake too early and cannot get back to sleep? Do you feel tired and irritable during the day, even after a full night in bed? Poor sleep is common and affects mood, memory, immunity, blood pressure and blood sugar. Occasional bad nights are normal, but persistent insomnia deserves a proper assessment. Dr. Priyanka Likhar looks at your sleep pattern, stress, digestion and medicines, and discusses the approaches that suit you best.",
    whatIs: [
      "Insomnia disorder is difficulty falling asleep, staying asleep or waking too early, occurring at least three nights a week for three months or more and causing daytime impairment. It can occur on its own or alongside stress, pain, low mood, medical conditions or medicines.",
      "Cognitive behavioural therapy for insomnia (CBT-I) is the first-line treatment recommended by clinical guidelines. Medicines are used in selected cases, for short periods.",
    ],
    signs: [
      "Taking a long time to fall asleep, often more than 30 minutes",
      "Waking during the night and finding it hard to return to sleep",
      "Waking early and being unable to sleep again",
      "Daytime tiredness, low energy, irritability, poor concentration or memory",
      "Worry about sleep itself, which can perpetuate the problem",
    ],
    ageNotes: [
      "Adults: stress, shift work, screen use, caffeine and alcohol are common contributors.",
      "Older adults: sleep becomes lighter and more fragmented with age. Pain, frequent urination, reflux and some medicines commonly disturb sleep, and breathing-related sleep problems become more common.",
      "Children and teenagers: sleep problems can affect growth, school performance and behaviour. See the children's sleep guidance and seek paediatric review.",
    ],
    causes: [
      "Stress, worry, anxiety and low mood, which are among the most common causes",
      "Irregular sleep schedules, shift work, jet lag and late-afternoon napping",
      "Caffeine, alcohol, nicotine and large or late meals",
      "Screen use and bright light in the evening, which can delay sleep onset",
      "Pain, reflux, frequent urination, restless legs and menopausal symptoms",
      "Medicines, including some steroids, antidepressants, decongestants and beta-blockers in some people",
      "Sleep-disordered breathing such as obstructive sleep apnoea, which fragments sleep",
    ],
    whenToAssess: [
      "Sleep problems on most nights for more than three months",
      "Daytime sleepiness that affects driving, work or safety",
      "Loud snoring, witnessed pauses in breathing, or waking with a headache or choking",
      "Sleep problems together with low mood, anxiety, or thoughts of self-harm (urgent)",
      "Reliance on sleeping tablets for more than a few weeks, or difficulty stopping them",
    ],
    diagnosis: [
      "A sleep history covering bedtime routine, habits and medicines, with a sleep diary kept for one to two weeks",
      "Questionnaires for insomnia, sleepiness, mood and sleep apnoea risk",
      "Medical examination and blood tests (such as thyroid function) where indicated",
      "A sleep study (polysomnography) when sleep apnoea or another sleep disorder is suspected",
    ],
    management: [
      "Clinical guidelines (American College of Physicians, 2016; American Academy of Sleep Medicine, 2017) recommend CBT-I as first-line treatment, including sleep restriction, stimulus control, relaxation and cognitive techniques. Short-term medicines may be used when appropriate and must be reviewed regularly",
      "Ayurvedic care may include a regular sleep–wake routine (Dinacharya and Ratricharya), an early and light evening meal, a calm wind-down routine, foot massage with suitable oil, and classical formulations individually advised",
      "Shirodhara is sometimes used in traditional practice for sleep and stress, but evidence is limited and suitability must be assessed",
      "Do not stop or change sleep medicines or antidepressants without your doctor's advice",
    ],
    homeCare: [
      "Keep consistent wake times every day, even after a poor night",
      "Limit caffeine after noon and avoid alcohol close to bedtime",
      "Reduce screens and bright light for an hour before bed, and keep the bedroom cool, dark and quiet",
      "Avoid long daytime naps; if you need one, keep it under 20 minutes and before mid-afternoon",
      "If you cannot sleep after about 20 minutes, get up, do something calm in dim light, and return to bed when you feel sleepy",
    ],
    redFlags: [
      "Thoughts of self-harm or suicide, or feeling hopeless (seek urgent help)",
      "Sleep problems with chest pain, breathlessness at night, or severe daytime sleepiness",
      "Confusion, new neurological symptoms, or seizures",
      "Loud snoring with pauses in breathing, or falling asleep while driving",
      "Insomnia with unexplained weight loss, fever or new pain",
    ],
    ayurvedaRole: [
      "Traditional texts describe sleep (Nidra) as one of the three pillars of health, alongside diet and self-discipline. Sleeplessness (Anidra) is linked with Vata and sometimes Pitta, and with mental disturbance (Manas).",
      "Ayurvedic support usually focuses on routine, a light and early dinner, avoiding overstimulation, and calming practices such as breathing exercises, warm foot massage and gentle yoga.",
      "Classical formulations and therapies such as Shirodhara may be considered in some cases. Their effects are not well established by high-quality trials.",
      "These are traditional interpretations, not established explanations of insomnia.",
    ],
    ayurvedaLimits: [
      "Ayurveda should not replace CBT-I or medical assessment for persistent insomnia, especially when it is linked with low mood or sleep apnoea.",
      "Do not combine sedative herbs with sleeping tablets or alcohol without advice, as this can increase drowsiness and risk.",
      "Do not use sleep herbs in pregnancy or breastfeeding, or alongside other medicines, without checking first.",
    ],
    faqs: [
      {
        q: "How many hours of sleep do adults need?",
        a: "Most adults need around seven hours or more of sleep a night. Individual needs vary, and what matters most is whether you feel rested and function well during the day.",
      },
      {
        q: "Are sleeping tablets safe for long-term use?",
        a: "Some are used short-term with careful supervision. Long-term use is generally not recommended for most people because of tolerance and dependence. CBT-I is the preferred long-term approach.",
      },
      {
        q: "Can Ayurveda help me sleep?",
        a: "Routine, diet and relaxation changes can help many people. Some traditional therapies and formulations are used for sleep, but the evidence is limited. Ayurveda can be a supportive part of care when the underlying causes have been assessed.",
      },
      {
        q: "Does mobile phone use affect sleep?",
        a: "Yes. Using screens late at night can delay sleep onset and reduce sleep quality for many people. Try to reduce screen use before bed, and keep the phone out of the bedroom if possible.",
      },
      {
        q: "When is sleep apnoea a concern?",
        a: "Consider it if you snore loudly, have witnessed breathing pauses, wake with a dry mouth or headache, or feel very sleepy during the day. It is treatable and needs medical evaluation.",
      },
      {
        q: "Is insomnia a sign of depression?",
        a: "It can be. Insomnia and low mood often occur together. If you feel persistently low or hopeless, or have lost interest in things, please talk to your doctor promptly.",
      },
      {
        q: "Can children have insomnia?",
        a: "Children can have sleep problems, such as difficulty settling or frequent waking. These should be assessed with the child's doctor, as they can relate to routine, anxiety, breathing problems or medical conditions.",
      },
    ],
    hinglish: ["neend nahi aati", "raat ko baar baar nind khulna", "insomnia ka ilaj", "anidra ayurveda"],
    references: [
      {
        label:
          "Qaseem A, Kansagara D, Forciea MA, Cooke M, Denberg TD. Management of Chronic Insomnia Disorder in Adults: A Clinical Practice Guideline From the American College of Physicians. Ann Intern Med. 2016;165(2):125–133",
        publisher: "American College of Physicians",
      },
      {
        label:
          "Sateia MJ, Buysse DJ, Krystal AD, Neubauer DN, Heald JL. Clinical Practice Guideline for Pharmacologic Treatment of Chronic Insomnia in Adults. J Clin Sleep Med. 2017;13(2):307–349",
        publisher: "American Academy of Sleep Medicine",
      },
      {
        label: "Classical references on Nidra and Anidra (Charaka Samhita; Ashtanga Hridaya)",
        publisher: "Classical Ayurvedic texts — interpretive reference",
      },
    ],
    relatedConditions: ["migraine", "pcos-pcod", "sleep-problems-children"],
    relatedTreatments: ["shirodhara", "abhyanga", "ayurvedic-diet-lifestyle"],
    relatedArticles: [],
  },
];
