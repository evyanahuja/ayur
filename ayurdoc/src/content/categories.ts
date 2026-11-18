/* Health-concern categories. Each renders a landing page at /health-concerns/<slug>.
   Pure data (no React), so pages, navigation, homepage, and sitemap can all import it.
   Medical content in these pages is general and conservative; it is labelled for
   physician review on each page and must be checked by Dr. Priyanka Likhar. */

export type CategoryIconKey =
  | "baby"
  | "sparkles"
  | "leaf"
  | "wind"
  | "brain"
  | "bone"
  | "flower"
  | "user"
  | "activity"
  | "heart";

export interface CategoryFaq {
  q: string;
  a: string;
}

export interface HealthCategory {
  slug: string;
  title: string;
  navHint: string;
  icon: CategoryIconKey;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  approach: string[];
  concerns: string[];
  conditionSlugs: string[];
  treatmentSlugs: string[];
  faqs: CategoryFaq[];
}

export const HEALTH_CATEGORIES: HealthCategory[] = [
  {
    slug: "childrens-health",
    title: "Children's Health",
    navHint: "Growth, appetite, immunity, development",
    icon: "baby",
    seoTitle: "Children's Ayurvedic Health Care in Indore | Dr. Priyanka Likhar",
    seoDescription:
      "Ayurvedic pediatric consultations in Indore for growth, appetite, digestion, immunity, sleep, skin and developmental concerns. Dr. Priyanka Likhar, MD (Kaumarbhritya).",
    intro:
      "Children's health needs a different kind of attention. Growth, appetite, sleep, digestion, immunity and development change quickly, and a child's concerns are best understood in the context of feeding, routine, school and family history. Dr. Priyanka Likhar holds an MD in Kaumarbhritya (Ayurvedic pediatrics) and assesses each child individually. Common reasons parents visit include poor appetite, slow weight gain, recurrent colds, constipation, eczema, sleep problems and developmental concerns such as speech delay or attention difficulties. Some of these need investigations or referral to other specialists, and the clinic will say so.",
    approach: [
      "A detailed history of birth, feeding, sleep, bowel habits, immunity, school and family health before any plan is discussed.",
      "Growth and development are reviewed against age-appropriate charts. Parents are asked to bring vaccination records and previous reports.",
      "Ayurvedic principles such as Agni (digestive capacity), Prakriti (constitution), Ahara (diet) and Dinacharya (daily routine) guide diet and lifestyle advice.",
      "Any classical formulation is chosen and dosed for the child's age and weight. Children are never given adult doses, and modern medical care continues where needed.",
    ],
    concerns: [
      "Poor appetite and fussy eating",
      "Slow weight or height gain",
      "Recurrent cold, cough and fever",
      "Constipation and tummy pain",
      "Eczema and childhood skin problems",
      "Sleep problems and bedwetting",
      "Speech delay and attention difficulties",
      "Learning difficulties and developmental delay",
    ],
    conditionSlugs: [
      "poor-appetite-children",
      "growth-nutrition-concerns",
      "constipation-children",
      "frequent-colds-cough-children",
      "sleep-problems-children",
      "bedwetting-children",
      "speech-delay-in-children",
      "adhd-in-children",
      "delayed-milestones",
      "learning-difficulties",
      "fever-children",
    ],
    treatmentSlugs: ["customized-suvarnaprashan", "abhyanga", "ayurvedic-diet-lifestyle"],
    faqs: [
      {
        q: "At what age should I bring my child for an Ayurvedic consultation?",
        a: "Children of any age can be assessed, from infancy through the teenage years. For an infant with feeding difficulty, breathing problems, jaundice, poor weight gain or fever, see a paediatrician first and seek urgent care if the child is unwell.",
      },
      {
        q: "Is Ayurvedic treatment safe for children?",
        a: "It can be, when prescribed by a qualified practitioner who uses child-appropriate formulations, age-based dosing and food-based measures first. Always tell the clinic about every medicine your child takes, including vaccines, antibiotics and steroids.",
      },
      {
        q: "Can Ayurveda replace vaccines?",
        a: "No. Ayurvedic practices, including Suvarnaprashan, are not a substitute for the recommended vaccination schedule. Please keep vaccinations up to date as advised by your child's doctor.",
      },
    ],
  },
  {
    slug: "skin-hair-conditions",
    title: "Skin & Hair Conditions",
    navHint: "Psoriasis, eczema, hair fall, rashes",
    icon: "sparkles",
    seoTitle: "Ayurvedic Skin & Hair Care in Indore | Psoriasis, Eczema, Hair Fall",
    seoDescription:
      "Individualised Ayurvedic consultation in Indore for psoriasis, eczema, hair fall, dandruff and recurrent skin rashes, alongside dermatology care where needed.",
    intro:
      "Skin and hair reflect what is happening inside the body as well as on its surface. Chronic rashes, itching, scaling, patchy shedding and recurring skin infections are among the most common reasons people seek Ayurvedic care. Many of these conditions are long-term and need a clear diagnosis first. Some, such as fungal infections, sudden hair loss or spreading patches, need a dermatologist's examination. Dr. Priyanka Likhar assesses skin and scalp concerns in the context of diet, digestion, sleep, stress and family history, and explains honestly what Ayurveda can and cannot offer.",
    approach: [
      "Clinical history: onset, triggers (food, weather, soaps, stress, medicines), previous treatments and how they worked, and family history of skin conditions.",
      "Review of digestion (Agni), diet, sleep and stress, which traditional Ayurvedic texts consider important for skin health.",
      "Supportive measures may include diet and routine changes, external care suited to the skin type, and classical formulations chosen for the individual.",
      "Ayurveda is used alongside prescribed dermatology treatment, not instead of it. Topical steroids and other prescribed medicines are not stopped without medical advice.",
    ],
    concerns: [
      "Psoriasis and scaling plaques",
      "Eczema and itchy, dry skin",
      "Recurrent rashes and hives",
      "Acne and pimples",
      "Vitiligo (white patches)",
      "Fungal skin infections",
      "Hair fall and thinning",
      "Dandruff and scalp itching",
      "Premature greying",
    ],
    conditionSlugs: ["psoriasis", "eczema", "hair-fall"],
    treatmentSlugs: ["abhyanga", "ayurvedic-diet-lifestyle", "panchakarma"],
    faqs: [
      {
        q: "Can Ayurveda cure psoriasis or eczema permanently?",
        a: "No system of medicine can honestly promise a permanent cure for these long-term conditions. Ayurvedic care aims to reduce flares, improve comfort and support the skin, with a plan made individually and realistic expectations.",
      },
      {
        q: "Is it safe to use Ayurvedic creams alongside my dermatologist's treatment?",
        a: "Tell both your dermatologist and the Ayurvedic practitioner about every product you use. Some herbal or oil-based products can irritate the skin or interact with prescribed treatment, so check before use.",
      },
      {
        q: "Why do my skin problems keep coming back?",
        a: "Chronic skin conditions often recur because triggers, the skin barrier, stress, sleep and diet all influence flares. A plan that addresses triggers and daily habits, along with prescribed care, usually helps more than treating each flare alone.",
      },
    ],
  },
  {
    slug: "digestive-disorders",
    title: "Digestive Disorders",
    navHint: "Acidity, constipation, piles, bloating",
    icon: "leaf",
    seoTitle: "Ayurvedic Digestive Health Care in Indore | Acidity, Constipation, Piles",
    seoDescription:
      "Ayurvedic consultation in Indore for acidity, GERD, constipation, bloating, piles and digestive weakness, with diet and routine guidance alongside medical care.",
    intro:
      "Digestive symptoms are among the most common reasons people visit a doctor, and they have many possible causes. Acidity and reflux, constipation, bloating, poor appetite, piles and abdominal discomfort can be related to diet, meal timing, medicines, infections, thyroid problems or bowel conditions. Some need investigations such as endoscopy, colonoscopy or blood tests. Ayurveda describes digestive strength (Agni) and the downward-moving energy that governs elimination (Apana Vata) as central to these problems. A consultation with Dr. Priyanka Likhar looks at digestion, diet, routine and stress, and advises when a medical investigation is needed first.",
    approach: [
      "Assessment of appetite, bowel pattern, meal timings, food habits, fluid intake and medicines, along with any previous investigations.",
      "Traditional evaluation of Agni (digestive strength) and Ama (undigested residue) to guide diet and routine recommendations.",
      "Diet guidance built on Indian home food: warm, freshly cooked meals, appropriate fibre and fluids, and meal timings that suit the individual.",
      "Classical formulations and supportive therapies are considered only after assessment, with clear explanation and follow-up.",
    ],
    concerns: [
      "Acidity, heartburn and reflux",
      "Constipation in children and adults",
      "Gas, bloating and indigestion",
      "Piles and anal fissure",
      "Loss of appetite and digestive weakness",
      "Irritable bowel symptoms",
      "Recurrent abdominal pain",
    ],
    conditionSlugs: [
      "acidity-gerd",
      "constipation-adults",
      "piles-hemorrhoids",
      "constipation-children",
      "poor-appetite-children",
    ],
    treatmentSlugs: ["ayurvedic-diet-lifestyle", "panchakarma", "basti-therapy"],
    faqs: [
      {
        q: "When should digestive symptoms be checked by a doctor first?",
        a: "Seek medical review for rectal bleeding, black stools, unexplained weight loss, persistent vomiting, severe or worsening abdominal pain, difficulty swallowing, fever with abdominal pain, or symptoms that persist beyond a few weeks.",
      },
      {
        q: "Is Panchakarma useful for constipation?",
        a: "In traditional practice, some Panchakarma procedures are considered for chronic constipation. Suitability depends on strength, age, pregnancy status and medical conditions. It is not suitable for everyone and is decided only after assessment.",
      },
      {
        q: "Can diet changes alone fix digestive problems?",
        a: "For some people, changes to meals, fibre, fluids and routine make a meaningful difference. For others, medical treatment is also needed. A short diary of symptoms and meals helps identify what is working.",
      },
    ],
  },
  {
    slug: "respiratory-conditions",
    title: "Respiratory Conditions",
    navHint: "Cough, cold, allergy, asthma",
    icon: "wind",
    seoTitle: "Ayurvedic Care for Cough, Cold, Asthma & Allergy in Indore",
    seoDescription:
      "Ayurvedic consultation in Indore for recurrent cough, cold, allergic rhinitis and asthma-related concerns. Works alongside inhaler and medical treatment.",
    intro:
      "Recurrent coughs, colds, a blocked nose, sneezing and wheezing affect children and adults alike, and they can disrupt school, work and sleep. Some are simple viral infections, while others are allergic rhinitis, sinusitis or asthma, each needing a different plan. Asthma in particular needs regular medical review and an inhaler plan that must never be stopped on your own. Ayurvedic care at Prakriti Ayurveda Clinic focuses on understanding triggers, immunity, digestion and environment, and supports the person alongside appropriate medical care.",
    approach: [
      "Detailed history of cough and cold patterns: frequency, season, triggers, night symptoms, and previous medicines and tests.",
      "Assessment of allergy triggers, environment (dust, smoke, pollution), sleep and diet, which are relevant in traditional respiratory care.",
      "Supportive Ayurvedic measures may include nasal care as advised, diet and routine changes, and classical formulations individually chosen.",
      "Asthma, breathing difficulty and infections needing antibiotics or inhalers stay under medical care. Ayurveda is never used to delay them.",
    ],
    concerns: [
      "Recurrent colds and coughs",
      "Allergic rhinitis and sneezing",
      "Sinusitis and blocked nose",
      "Asthma and wheezing",
      "Chronic or night-time cough",
      "Tonsillitis in children",
    ],
    conditionSlugs: ["frequent-colds-cough-children", "fever-children"],
    treatmentSlugs: ["nasya", "ayurvedic-diet-lifestyle", "customized-suvarnaprashan"],
    faqs: [
      {
        q: "When is a cough a reason to see a doctor urgently?",
        a: "Seek urgent care for breathing difficulty, blue or grey lips, chest pain, coughing up blood, high fever, a child who is drowsy or not drinking, or a cough that is getting worse or has lasted more than three weeks.",
      },
      {
        q: "Can Ayurveda replace an asthma inhaler?",
        a: "No. Asthma medicines must not be stopped or reduced without medical advice. Ayurvedic support can be discussed alongside the existing treatment plan, with regular monitoring.",
      },
      {
        q: "Why does my child get colds every month?",
        a: "Frequent colds are common in children, especially in school and day-care settings. Causes can include allergy, poor sleep, low appetite, smoke exposure and recurrent infections. The pattern is assessed before a plan is made.",
      },
    ],
  },
  {
    slug: "neurological-conditions",
    title: "Neurological Conditions",
    navHint: "Migraine, headache, nerve health",
    icon: "brain",
    seoTitle: "Ayurvedic Approach to Migraine, Headache & Nerve Health in Indore",
    seoDescription:
      "Ayurvedic consultation in Indore for migraine, recurrent headaches and neurological concerns, with red flags, medical referral and individual supportive care explained.",
    intro:
      "Headaches, migraine, numbness, tremors, memory concerns and developmental neurological conditions all need careful assessment, because some symptoms are harmless and others need urgent investigation. Many neurological disorders are chronic and are managed over time by neurologists and other specialists. Ayurveda offers a traditional framework for the nervous system (Vata, Majja dhatu and Manas) and supportive lifestyle care. Dr. Priyanka Likhar explains where Ayurveda may support comfort and daily life, and where specialist neurological care is essential.",
    approach: [
      "A careful history, including the pattern of headaches or symptoms, triggers, sleep, stress and medicine use.",
      "Assessment of routine, digestion, sleep and stress, which traditional texts link with nervous system balance.",
      "Dietary and lifestyle advice, relaxation practices and, where suitable, external therapies such as Shirodhara for stress-related symptoms.",
      "The clinic reviews the need for neurological tests or referral, and never recommends stopping prescribed anti-seizure, migraine or other neurological medicines.",
    ],
    concerns: [
      "Migraine and frequent headaches",
      "Sleep disturbance linked with stress",
      "Cerebral palsy and developmental neurological conditions",
      "Learning difficulties and attention concerns",
      "Memory concerns in older adults",
    ],
    conditionSlugs: [
      "migraine",
      "cerebral-palsy",
      "hyperactivity-attention-difficulties",
      "learning-difficulties",
      "insomnia",
    ],
    treatmentSlugs: ["shirodhara", "abhyanga", "rasayana"],
    faqs: [
      {
        q: "Is a sudden severe headache always migraine?",
        a: "No. A sudden, very severe headache that peaks within a minute, a first-ever severe headache, or a headache with weakness, confusion, speech or vision changes, fever with a stiff neck, or after a head injury needs emergency medical assessment.",
      },
      {
        q: "Can Shirodhara treat migraine?",
        a: "Shirodhara is used in traditional Ayurveda for stress, sleep and some headache patterns. Evidence for migraine specifically is limited. Its suitability must be assessed in person, and it does not replace migraine medicines.",
      },
      {
        q: "Do children need a neurological assessment?",
        a: "Yes, when there are concerns about development, movement, speech, seizures, persistent headache or regression. Ayurvedic support is designed to work alongside paediatric neurology and developmental therapies.",
      },
    ],
  },
  {
    slug: "joint-bone-disorders",
    title: "Joint & Bone Disorders",
    navHint: "Knee & back pain, stiffness, bones",
    icon: "bone",
    seoTitle: "Ayurvedic Care for Knee Pain, Back Pain & Joint Stiffness in Indore",
    seoDescription:
      "Ayurvedic consultation in Indore for knee pain, osteoarthritis, back and neck pain, sciatica and joint stiffness. Exercise, physiotherapy and medical care stay central.",
    intro:
      "Joint pain, stiffness and bone health concerns are common in adults and older people, and they can limit walking, work and sleep. Causes range from age-related osteoarthritis and inflammatory arthritis to spinal problems, injuries, gout and low bone density. Ayurveda describes joint pain and stiffness through the concepts of Sandhi (joints) and Vata dosha. Good management usually combines movement, weight and strength work, appropriate medicines and, where helpful, supportive Ayurvedic care. Dr. Priyanka Likhar assesses each person's joints and daily function individually.",
    approach: [
      "Assessment of pain pattern, morning stiffness, swelling, functional limits, previous X-rays and blood tests, and medicines in use.",
      "Review of body weight, activity, sleep and diet, which are central to joint health in both conventional and Ayurvedic thinking.",
      "Supportive plans can include diet, movement routines, external care suited to the joint, and classical formulations chosen for the person.",
      "Strengthening exercise and physiotherapy are recommended where appropriate, and surgical opinions are obtained when structural damage is severe.",
    ],
    concerns: [
      "Knee pain and osteoarthritis",
      "Back pain and neck pain",
      "Sciatica and cervical or lumbar spondylosis",
      "Frozen shoulder and joint stiffness",
      "Osteoporosis and bone density concerns",
      "Rheumatoid arthritis (needs specialist care)",
    ],
    conditionSlugs: ["knee-pain"],
    treatmentSlugs: ["abhyanga", "basti-therapy", "ayurvedic-diet-lifestyle"],
    faqs: [
      {
        q: "Can Ayurveda cure arthritis or regenerate cartilage?",
        a: "No honest claim of cartilage regeneration or a permanent cure can be made. Osteoarthritis and inflammatory arthritis are managed over time. Ayurvedic support aims to ease symptoms and improve function alongside exercise and medical care.",
      },
      {
        q: "Should I continue painkillers if I start Ayurvedic treatment?",
        a: "Do not stop prescribed painkillers or steroids suddenly. Discuss any combined plan with your doctor, who can taper medicines safely if appropriate.",
      },
      {
        q: "When do joint symptoms need urgent attention?",
        a: "A hot, very swollen joint with fever, sudden inability to bear weight after a fall, deformity, a joint that locks, or pain with leg numbness or weakness should be assessed promptly.",
      },
    ],
  },
  {
    slug: "womens-health",
    title: "Women's Health",
    navHint: "PCOS, periods, menopause, postpartum",
    icon: "flower",
    seoTitle: "Ayurvedic Women's Health Care in Indore | PCOS, Periods & Menopause",
    seoDescription:
      "Ayurvedic consultation in Indore for PCOS/PCOD, irregular or painful periods, menopause symptoms, recurrent urinary infections and postpartum recovery.",
    intro:
      "Hormonal changes across life, from puberty and menstrual cycles to pregnancy, postpartum recovery and menopause, shape a woman's health in many ways. Irregular periods, painful menstruation, PCOS, thyroid problems, anaemia and urinary infections are common, and they often need gynaecological or medical evaluation as well as lifestyle support. Ayurveda describes women's health through concepts such as Artava (menstrual tissue), Agni and the balance of Vata, Pitta and Kapha. Dr. Priyanka Likhar assesses cycle history, diet, sleep, stress and medicines, and advises when tests or specialist referral are needed.",
    approach: [
      "Detailed menstrual, pregnancy and medical history, including cycle length, flow, pain pattern and previous investigations.",
      "Review of diet, activity, sleep and stress, which affect hormonal balance in both modern and Ayurvedic perspectives.",
      "Individualised diet, routine and supportive classical formulations, with monitoring. Pregnancy and breastfeeding are always taken into account.",
      "Hormonal medicines, contraception and fertility treatment are never changed without the prescribing doctor's advice.",
    ],
    concerns: [
      "PCOS and PCOD",
      "Irregular or absent periods",
      "Painful menstruation",
      "Heavy menstrual bleeding (needs evaluation)",
      "Premenstrual symptoms",
      "Menopause symptoms",
      "Recurrent urinary tract infections",
      "Postpartum recovery",
    ],
    conditionSlugs: ["pcos-pcod"],
    treatmentSlugs: ["ayurvedic-diet-lifestyle", "abhyanga", "rasayana"],
    faqs: [
      {
        q: "Can Ayurveda regularise periods?",
        a: "Some women find that diet, routine, sleep and stress changes help their cycles. Irregular periods can have many causes, including thyroid disease, PCOS and pregnancy, so a medical check is important. Ayurveda can be a supportive part of the plan.",
      },
      {
        q: "When should heavy periods be checked?",
        a: "Seek medical advice for bleeding that soaks a pad every hour for several hours, large clots, dizziness or fainting, periods lasting more than seven days, or bleeding between periods or after menopause.",
      },
      {
        q: "Is Ayurvedic medicine safe in pregnancy?",
        a: "Not all formulations are suitable in pregnancy. Tell your obstetrician and the Ayurvedic practitioner about any medicines before starting, and do not take herbal products without advice.",
      },
    ],
  },
  {
    slug: "mens-health",
    title: "Men's Health",
    navHint: "Stress, sleep, hair, urinary health",
    icon: "user",
    seoTitle: "Men's Health Ayurvedic Consultation in Indore | Stress, Sleep & Hair",
    seoDescription:
      "Confidential Ayurvedic consultation in Indore for men's concerns including stress, sleep, hair fall, digestion, urinary symptoms and general wellness, with medical referral when needed.",
    intro:
      "Men often delay seeking help for health concerns, including stress, sleep problems, hair loss, digestive symptoms, urinary changes and sexual health. Many of these have treatable medical causes, such as thyroid disease, diabetes, prostate enlargement or low testosterone, and deserve proper evaluation. An Ayurvedic consultation at Prakriti Ayurveda Clinic offers a private, unhurried conversation about lifestyle, diet, work stress, sleep and physical health, along with individualised supportive care. Where a urologist, andrologist or other specialist is needed, Dr. Priyanka Likhar will say so.",
    approach: [
      "A confidential history covering stress, work pattern, sleep, diet, activity, substance use and the specific concern.",
      "Assessment of digestion, energy and stress levels using traditional concepts such as Agni, Vata and Ojas, alongside medical history.",
      "Diet and routine guidance, exercise suggestions and classical formulations chosen individually where appropriate.",
      "Referral to a urologist, andrologist, endocrinologist or other specialist when investigation or treatment is needed.",
    ],
    concerns: [
      "Stress, fatigue and low energy",
      "Sleep problems",
      "Hair fall and early balding",
      "Digestive symptoms and acidity",
      "Prostate enlargement and urinary symptoms",
      "Sexual health concerns (discussed confidentially)",
      "Diabetes and blood pressure risk",
    ],
    conditionSlugs: ["hair-fall", "insomnia", "acidity-gerd"],
    treatmentSlugs: ["ayurvedic-diet-lifestyle", "rasayana", "shirodhara"],
    faqs: [
      {
        q: "Are sexual health concerns discussed confidentially?",
        a: "Yes. Consultations are private and respectful. Share what you are comfortable with. The clinic will explain what history and examination are needed.",
      },
      {
        q: "Can Ayurveda improve male fertility or sexual performance?",
        a: "Traditional texts describe many formulations for these concerns, but robust clinical evidence is limited. Fertility, hormonal or sexual problems need proper medical evaluation. Any plan will be honest about what is known and what is not.",
      },
      {
        q: "Do I need blood tests before consulting?",
        a: "Not always, but bring any recent reports, especially blood sugar, thyroid, lipid, kidney and hormone tests if you have them.",
      },
    ],
  },
  {
    slug: "metabolic-lifestyle-disorders",
    title: "Metabolic & Lifestyle Disorders",
    navHint: "Diabetes, thyroid, weight, blood pressure",
    icon: "activity",
    seoTitle: "Lifestyle & Metabolic Health Support in Indore | Diabetes, Thyroid, Weight",
    seoDescription:
      "Ayurvedic lifestyle and diet support in Indore for prediabetes, type 2 diabetes, thyroid disorders, weight management and fatty liver, alongside medical monitoring.",
    intro:
      "Diabetes, prediabetes, thyroid disorders, high blood pressure, high cholesterol, fatty liver and obesity are long-term conditions. They are best managed through regular medical monitoring, medicines where prescribed, and sustained lifestyle change. Ayurveda describes many of these through metabolic concepts such as Medas (fat tissue), Agni and Kapha. A consultation at Prakriti Ayurveda Clinic focuses on diet, activity, sleep and stress, and on helping people stay on their prescribed treatment. Medicines for diabetes, thyroid or blood pressure must not be changed or stopped without a doctor.",
    approach: [
      "Review of weight history, blood test reports, medicines, diet pattern, activity and sleep.",
      "Practical Indian meal planning focusing on portions, fibre, timing and home-cooked food, with gradual changes.",
      "Supportive Ayurvedic measures, which may include routine and activity advice and classical formulations, chosen individually and monitored.",
      "Regular re-testing with the treating doctor is encouraged, and coordination with existing medical care is standard.",
    ],
    concerns: [
      "Prediabetes and type 2 diabetes",
      "Thyroid disorders (hypothyroidism)",
      "Obesity and weight management",
      "High blood pressure",
      "High cholesterol",
      "Fatty liver",
      "Chronic fatigue",
    ],
    conditionSlugs: [],
    treatmentSlugs: ["ayurvedic-diet-lifestyle", "rasayana", "panchakarma"],
    faqs: [
      {
        q: "Can Ayurveda cure diabetes?",
        a: "No honest claim of a cure can be made for type 2 diabetes. Lifestyle change, prescribed medicines and monitoring are the foundations. Ayurvedic support may be considered as an add-on, and any change to diabetes medicines must be made by the prescribing doctor.",
      },
      {
        q: "Should I stop thyroid tablets when starting Ayurveda?",
        a: "No. Never stop thyroid medicine without your doctor's advice. Thyroid levels need regular monitoring, especially if diet, weight or other medicines change.",
      },
      {
        q: "What is a realistic approach to weight loss?",
        a: "Gradual changes to diet, daily activity and sleep are more sustainable than rapid restriction. Your plan should be individual, safe and reviewed regularly.",
      },
    ],
  },
  {
    slug: "senior-citizen-health",
    title: "Senior Citizen Health",
    navHint: "Joints, sleep, memory, healthy ageing",
    icon: "heart",
    seoTitle: "Ayurvedic Care for Senior Citizens in Indore | Joints, Sleep & Memory",
    seoDescription:
      "Gentle, individualised Ayurvedic care in Indore for older adults: joint pain, sleep, constipation, memory concerns, balance and healthy ageing, with medical coordination.",
    intro:
      "Healthy ageing involves more than managing one condition at a time. Older adults may live with joint pain, high blood pressure, diabetes, sleep changes, constipation, reduced appetite, memory concerns and a higher risk of falls, often while taking several medicines. Ayurveda emphasises daily routine (Dinacharya), seasonal living (Ritucharya), appropriate diet and gentle movement, adjusted to strength and age. Dr. Priyanka Likhar assesses older adults with particular attention to medicines, balance, nutrition and safety, and coordinates with their family doctor or specialists.",
    approach: [
      "A comprehensive review of medicines (including supplements and herbal products), chronic conditions, falls, appetite, bowel habits and sleep.",
      "A gentle daily routine, meal timing and hydration plan that suits existing heart, kidney or diabetes conditions.",
      "Supportive external care and classical formulations where suitable, with attention to safety and interactions with existing medicines.",
      "Referral for dementia, falls, bone density or memory assessment when indicated.",
    ],
    concerns: [
      "Joint pain and knee pain",
      "Osteoporosis and bone density",
      "Constipation",
      "Sleep disturbance",
      "Memory concerns",
      "Balance problems and falls",
      "Age-related muscle weakness",
      "Loss of appetite",
    ],
    conditionSlugs: ["knee-pain", "constipation-adults", "insomnia"],
    treatmentSlugs: ["ayurvedic-diet-lifestyle", "rasayana", "abhyanga"],
    faqs: [
      {
        q: "Are Ayurvedic medicines safe alongside blood pressure or diabetes tablets?",
        a: "They may interact with some medicines or affect blood sugar and blood pressure. Always tell the clinic about all current medicines, and do not stop or adjust prescribed medicines without medical advice.",
      },
      {
        q: "What helps older people sleep better?",
        a: "Regular sleep and wake times, daytime activity, limiting caffeine and long afternoon naps, a calm evening routine, and treating conditions such as pain or breathing problems can all help. Persistent insomnia should be assessed.",
      },
      {
        q: "Is memory loss normal with age?",
        a: "Some changes in memory are common with ageing, but significant or progressive memory loss, confusion or personality change needs medical assessment, as some causes are treatable.",
      },
    ],
  },
];

export function findCategory(slug: string): HealthCategory | undefined {
  return HEALTH_CATEGORIES.find((c) => c.slug === slug);
}

/* Six cards for the homepage question "What Health Concern Are You Looking For Help With?" */
export const HOME_CONCERN_CARDS: { slug: string; title: string; desc: string; icon: CategoryIconKey }[] = [
  {
    slug: "childrens-health",
    title: "Children's Health",
    desc: "Growth, appetite, immunity, sleep, skin, speech and attention concerns, with a paediatric focus.",
    icon: "baby",
  },
  {
    slug: "skin-hair-conditions",
    title: "Skin & Hair",
    desc: "Psoriasis, eczema, rashes, hair fall and dandruff, assessed individually.",
    icon: "sparkles",
  },
  {
    slug: "digestive-disorders",
    title: "Digestive Health",
    desc: "Acidity, constipation, bloating, piles and appetite concerns.",
    icon: "leaf",
  },
  {
    slug: "womens-health",
    title: "Women's Health",
    desc: "PCOS, irregular periods, menopause and postpartum wellbeing.",
    icon: "flower",
  },
  {
    slug: "mens-health",
    title: "Men's Health",
    desc: "Stress, sleep, hair, digestive and urinary concerns, handled confidentially.",
    icon: "user",
  },
  {
    slug: "joint-bone-disorders",
    title: "Joint & Senior Health",
    desc: "Knee and back pain, stiffness, bone health and healthy ageing for older adults.",
    icon: "bone",
  },
];

/* Treatment slugs shown in navigation and on the homepage (all exist in treatments.ts) */
export const NAV_TREATMENT_SLUGS = [
  "panchakarma",
  "abhyanga",
  "shirodhara",
  "basti-therapy",
  "nasya",
  "rasayana",
  "customized-suvarnaprashan",
  "ayurvedic-diet-lifestyle",
];

export const HOME_TREATMENT_CARDS: { slug: string; title: string; desc: string }[] = [
  { slug: "panchakarma", title: "Panchakarma", desc: "Classical purification therapies, suitable only after individual assessment." },
  { slug: "abhyanga", title: "Abhyanga", desc: "Medicated oil massage used for relaxation, joint comfort and skin care." },
  { slug: "shirodhara", title: "Shirodhara", desc: "Warm oil poured gently on the forehead, traditionally used for stress and sleep." },
  { slug: "basti-therapy", title: "Basti Therapy", desc: "A Panchakarma therapy used traditionally for specific Vata-type bowel and joint conditions." },
  { slug: "nasya", title: "Nasya", desc: "Medicated nasal therapy, traditionally used for head, sinus and voice concerns." },
  { slug: "rasayana", title: "Rasayana", desc: "Nourishment and rejuvenation programmes for healthy ageing and recovery." },
  { slug: "customized-suvarnaprashan", title: "Customized Suvarnaprashan", desc: "A traditional gold-herb Sanskar, individualised by age and health." },
  { slug: "ayurvedic-diet-lifestyle", title: "Diet & Lifestyle", desc: "Practical, individual Ayurvedic diet and daily routine guidance." },
];
