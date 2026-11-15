/* Condition guides — batch 1 (adult & general health).
   status "draft": built at the URL with noindex, excluded from navigation and the
   sitemap until Dr. Priyanka Likhar has reviewed and approved the medical content.
   All references are cited for verification by the physician before publication. */
import type { ConditionPage } from "./conditions";

export const CONDITIONS_3: ConditionPage[] = [
  {
    slug: "acidity-gerd",
    status: "draft",
    primaryKeyword: "acidity treatment Ayurveda",
    title: "Acidity & GERD",
    h1: "Acidity and GERD: Causes, Symptoms and Ayurvedic Treatment Approach",
    seoTitle: "Acidity & GERD: Causes, Symptoms and Ayurvedic Approach",
    seoDescription:
      "Burning chest, sour burps or bloating after meals? Learn the common causes of acidity and GERD, warning signs that need a doctor, and how an Ayurvedic assessment helps.",
    category: "Digestion & Gut",
    intro:
      "Do you often feel burning behind the breastbone, a sour taste in the mouth or bloating after meals? Do these problems return even after you have tried changing your diet? Many people call this 'acidity'. In medical terms it is most often gastro-oesophageal reflux disease (GERD), where stomach contents move back up into the food pipe. Symptoms like these can have several causes, so it is worth understanding your pattern and, when needed, getting a proper check-up.",
    whatIs: [
      "Gastro-oesophageal reflux disease (GERD) happens when stomach acid and digestive juices flow back into the oesophagus (the food pipe). A ring of muscle at the lower end of the food pipe normally keeps the contents in place. When it relaxes at the wrong time or works weakly, reflux occurs.",
      "'Acidity' is an everyday word that can describe heartburn, sour regurgitation, upper abdominal burning and indigestion. Not all acidity is GERD, and not all chest burning is acid. Some heart-related chest pain can feel similar, which is why new or severe chest symptoms need prompt evaluation.",
    ],
    signs: [
      "Burning pain or heat behind the breastbone, often after meals or when lying down",
      "Sour or bitter taste, and regurgitation of food or fluid into the mouth",
      "Bloating, belching, fullness or nausea after eating",
      "Dry cough, hoarseness or throat clearing, particularly in the morning",
      "Symptoms that worsen after spicy, oily or heavy meals, or late-night eating",
      "Night-time symptoms that disturb sleep",
    ],
    ageNotes: [
      "Adults: commonly linked with large or late meals, tea, coffee, smoking, alcohol and weight gain around the abdomen. Reflux also often occurs in pregnancy.",
      "Children: reflux can cause vomiting, feeding difficulty, poor weight gain or a recurrent cough. These need paediatric assessment rather than home remedies alone.",
      "Older adults: long-term use of some medicines, such as certain painkillers, may irritate the stomach. New symptoms after the age of 50 deserve a medical review.",
    ],
    causes: [
      "A weak or frequently relaxing lower oesophageal sphincter, which can be influenced by diet, medicines, pregnancy and smoking",
      "A hiatus hernia, where part of the stomach pushes up through the diaphragm",
      "Large meals, eating close to bedtime, and lying down soon after food",
      "Food and drink triggers that vary from person to person, such as very spicy or fatty food, chocolate, caffeine, alcohol and fizzy drinks",
      "Excess body weight, particularly around the abdomen, which increases pressure on the stomach",
      "Medicines such as some painkillers (NSAIDs) and steroids, which can irritate the stomach lining. Never stop a prescribed medicine on your own; ask your doctor about alternatives",
      "Helicobacter pylori infection or peptic ulcer disease, which can cause similar upper abdominal pain and needs testing",
    ],
    whenToAssess: [
      "Symptoms on most days for more than two to three weeks, or symptoms that keep coming back",
      "A need for antacids on a regular basis to get relief",
      "Symptoms that wake you at night or affect your sleep or work",
      "A chronic cough, hoarseness or sore throat with no other explanation",
    ],
    diagnosis: [
      "A detailed history of symptom timing, meals, sleeping position, medicines (including painkillers and steroids) and family history of stomach or oesophageal problems",
      "Clinical examination and blood tests as indicated, which may include a complete blood count and H. pylori testing",
      "Upper gastrointestinal endoscopy when red-flag features are present, when symptoms persist despite treatment, or in people over 50 with new symptoms, to look for oesophagitis, ulcers or other causes",
      "Cardiac evaluation (such as an ECG) when chest pain is pressure-like, comes on with exertion, spreads to the arm, jaw or back, or occurs with breathlessness, sweating or fainting. This is urgent",
    ],
    management: [
      "Conventional GERD care is evidence-based. It can include acid-suppressing medicines (such as proton pump inhibitors or H2 receptor blockers) prescribed for an appropriate duration. Medicines should only be changed or stopped on medical advice",
      "Lifestyle measures recommended in clinical guidelines include smaller meals, avoiding food for two to three hours before lying down, raising the head of the bed for people with night-time symptoms, reducing excess weight, stopping smoking and limiting alcohol",
      "An Ayurvedic consultation can look at digestive strength (Agni), meal timing, diet and daily routine. Individual classical formulations may be considered, chosen and monitored by the practitioner",
      "Referral for endoscopy, a surgical opinion (for example, for a significant hiatus hernia) or further tests is made when needed",
    ],
    homeCare: [
      "Eat at regular times, avoid skipping meals and avoid very large dinners",
      "Leave two to three hours between dinner and bedtime",
      "Sip warm water through the day rather than gulping cold drinks with meals",
      "Keep a simple food and symptom diary for two weeks to notice your personal triggers",
      "Aim for a healthy weight, take a 10 to 15 minute walk after meals when possible, and keep to regular sleep",
    ],
    redFlags: [
      "Chest pain or pressure, especially with breathlessness, sweating, nausea or pain spreading to the arm, jaw or back. This may be a heart emergency: call emergency services immediately",
      "Difficulty or pain when swallowing, or food that feels stuck",
      "Vomiting blood, black or tarry stools, or signs of anaemia such as marked weakness or breathlessness",
      "Unintended weight loss, persistent vomiting, or a lump in the neck or upper abdomen",
      "Symptoms that persist or worsen despite treatment, or any new symptoms after the age of 50",
    ],
    ayurvedaRole: [
      "Traditional texts describe burning, sour and sharp upper-abdominal symptoms (Amlapitta) in relation to Pitta dosha, which in Ayurveda governs heat and digestive transformation. Upward-moving Pitta (Urdhvaga Pitta) is described for sour regurgitation and nausea.",
      "An Ayurvedic assessment typically reviews Agni (digestive strength), Ama (incompletely digested residue), Prakriti (constitution), sleep, stress and daily routine. Dietary advice focuses on meal timing, lighter and cooling food for those with a Pitta pattern, and avoiding personal triggers.",
      "Lifestyle and dietary changes are often the most practical part of the plan. Herbal and classical formulations may be considered individually, with monitoring.",
      "These are traditional interpretations, not scientifically established explanations of GERD. Clinical studies of Ayurvedic treatments for GERD are limited in number and quality.",
    ],
    ayurvedaLimits: [
      "Ayurveda does not replace diagnosis of hiatus hernia, ulcers, H. pylori infection or heart disease. Do not delay medical care to try a home remedy.",
      "Do not stop prescribed acid-suppressing medicines because an herbal or Ayurvedic remedy has been started. Any combined plan is supervised, and medicines are tapered only by the treating doctor.",
      "Strong spices, lemon-and-honey 'detox' routines and unsupervised herbal mixtures can aggravate burning in some people.",
    ],
    faqs: [
      {
        q: "What is the difference between acidity and GERD?",
        a: "'Acidity' is the everyday word for burning, sourness and indigestion. GERD is the medical term for reflux of stomach contents into the food pipe that occurs repeatedly or causes symptoms or damage. Many people with acidity do not have GERD, but persistent symptoms should still be evaluated.",
      },
      {
        q: "Can acidity be a sign of a heart problem?",
        a: "It can be, because chest discomfort can come from the heart as well as the stomach. Pain that is pressure-like, comes on with exertion, spreads to the arm, jaw or back, or occurs with breathlessness, sweating or fainting needs emergency evaluation. Do not assume it is acidity.",
      },
      {
        q: "Which foods should I avoid for acidity?",
        a: "Triggers differ between people. Common triggers include very spicy, fried or fatty food, citrus, tomato-based foods, chocolate, caffeine, alcohol and fizzy drinks. Keep a short diary for two weeks rather than cutting many foods at once.",
      },
      {
        q: "Can Ayurveda help with acidity?",
        a: "An Ayurvedic consultation can address meal patterns, digestion (Agni), diet, routine and stress, and may include individualised classical formulations. Evidence for specific herbs in GERD is limited. Ayurveda is a supportive approach that works alongside, not in place of, medical evaluation and prescribed treatment.",
      },
      {
        q: "How long should acidity last before I see a doctor?",
        a: "See a doctor if symptoms occur most days for more than two to three weeks, if you need antacids regularly, if they disturb your sleep, or if you have any red-flag symptom listed above.",
      },
      {
        q: "Are medicines for acidity safe for long-term use?",
        a: "Acid-suppressing medicines are safe when used as prescribed, but long-term use should be reviewed by your doctor from time to time. Never stop or change medicines on your own; your doctor will decide if and how to reduce them.",
      },
      {
        q: "Is acidity different in children?",
        a: "Yes. Reflux in infants and children may present as feeding difficulty, vomiting, poor weight gain or a cough. These need paediatric assessment rather than home remedies alone.",
      },
    ],
    hinglish: ["seene mein jalan", "khatti dakar", "acidity ka ilaj Indore", "pet mein gas aur jalan"],
    references: [
      {
        label:
          "Katz PO, Dunbar KB, Schnoll-Sussman FH, et al. ACG Clinical Guideline for the Diagnosis and Management of Gastroesophageal Reflux Disease. Am J Gastroenterol. 2022;117(1):27–56",
        publisher: "American College of Gastroenterology",
      },
      { label: "Heartburn and acid reflux", publisher: "NHS (UK) patient information" },
      {
        label: "Classical references on Amlapitta and Urdhvaga Pitta (Charaka Samhita; Madhava Nidana)",
        publisher: "Classical Ayurvedic texts — interpretive reference, not clinical evidence",
      },
    ],
    relatedConditions: ["constipation-adults", "piles-hemorrhoids", "insomnia"],
    relatedTreatments: ["ayurvedic-diet-lifestyle", "panchakarma"],
    relatedArticles: [],
  },
  {
    slug: "piles-hemorrhoids",
    status: "draft",
    primaryKeyword: "piles treatment Ayurveda",
    title: "Piles (Haemorrhoids)",
    h1: "Piles (Haemorrhoids): Symptoms, Causes and Ayurvedic Treatment Approach",
    seoTitle: "Piles (Haemorrhoids): Symptoms, Causes and Ayurvedic Approach",
    seoDescription:
      "Bleeding while passing stool, a lump near the anus or itching? Understand the symptoms and causes of piles, when to see a doctor, and how Ayurvedic care supports bowel health.",
    category: "Digestion & Gut",
    intro:
      "Bleeding after passing stool, a lump near the anus, itching or discomfort while sitting: these are common complaints that many people feel embarrassed to mention. Piles (haemorrhoids) are swollen blood vessels in the lower rectum and anal canal, and they are very common. Because rectal bleeding can also come from other conditions, including bowel disease and cancer, any new bleeding should be checked by a doctor. Ayurvedic care can support bowel regularity and comfort, alongside appropriate medical or surgical treatment when needed.",
    whatIs: [
      "Haemorrhoids are cushions of blood vessels and supporting tissue in the lower rectum and anus that help with continence. They become a problem when they swell, prolapse or bleed. Internal piles lie inside the anal canal, and external piles lie under the skin around the anus.",
      "Symptoms often come and go. Many people improve with diet, fluids and bowel habit changes, while larger or persistent piles may need procedures performed by a specialist.",
    ],
    signs: [
      "Bright red blood on toilet paper or in the toilet bowl, often after straining",
      "A soft lump at the anus, which may push out during bowel movements and then go back in",
      "Itching, soreness or a feeling of fullness around the anus",
      "Pain, particularly if a clot forms in an external pile",
      "Mucus discharge, and a feeling that the bowel is not fully empty",
    ],
    ageNotes: [
      "Pregnancy and the weeks after childbirth are common times for piles, because of pelvic pressure and constipation.",
      "Piles are uncommon in children, so bleeding in a child should always be assessed by a paediatrician.",
      "Older adults are more likely to have blood in the stool, which must be investigated rather than assumed to be piles.",
    ],
    causes: [
      "Constipation and straining during bowel movements",
      "Long periods of sitting or spending extended time on the toilet",
      "Pregnancy, childbirth and increased pelvic pressure",
      "Chronic diarrhoea, which can irritate the anal area",
      "Low fibre and low fluid intake",
      "Excess body weight and physical inactivity",
      "Ageing, which weakens the tissues supporting the blood vessels",
      "A family history of piles or varicose veins",
    ],
    whenToAssess: [
      "Any rectal bleeding, even if you believe it is piles, so that other causes can be excluded",
      "Piles that do not settle after a few weeks of diet and bowel changes",
      "Pain, swelling or a hard lump that does not go back in",
      "Symptoms that disturb your daily life or sleep",
    ],
    diagnosis: [
      "Clinical history and examination, which may include a digital rectal examination and anoscopy",
      "Colonoscopy or sigmoidoscopy when there is bleeding at age 40 or above, a change in bowel habit, a family history of bowel cancer, anaemia or weight loss, as recommended by the treating doctor",
      "Blood tests where anaemia or ongoing bleeding is suspected",
    ],
    management: [
      "Conventional care in specialist guidance (such as the American Society of Colon and Rectal Surgeons) includes fibre and fluid advice, bowel habit correction, topical treatments for symptoms and, for persistent or prolapsing piles, office-based procedures or surgery performed by specialists",
      "Dietary fibre and adequate fluids are central to both conventional and Ayurvedic management, because they soften stools and reduce straining",
      "Ayurvedic management of Arsha (piles) focuses on regulating Apana Vata (the downward-moving energy that governs elimination), improving digestion and avoiding aggravating foods. Classical formulations may be used as advised by the practitioner",
      "Classical texts describe several procedures for Arsha. Their suitability depends on the grade of piles, the person's strength and other health conditions, and they are assessed in person by qualified practitioners only",
    ],
    homeCare: [
      "Include fibre-rich foods such as vegetables, whole grains, dal, fruit and seeds, increasing slowly",
      "Drink enough water through the day, and do not hold in the urge to pass stool",
      "Avoid long periods on the toilet and avoid straining",
      "Use warm sitz baths or gentle cleansing as advised, and keep the area clean and dry",
      "Limit very spicy, fried and alcohol-heavy foods if they seem to aggravate symptoms",
    ],
    redFlags: [
      "Heavy bleeding, bleeding that continues or repeats, or dizziness and fainting",
      "Black, tarry or maroon stools, or blood mixed through the stool",
      "Unexplained weight loss, a change in bowel habit lasting more than three weeks, or persistent abdominal pain",
      "Severe, sudden pain with a hard, purple swelling, or fever (this may need urgent treatment for a clotted or infected pile)",
      "Inability to pass urine or to pass stool or wind",
    ],
    ayurvedaRole: [
      "In Ayurveda, piles are described as Arsha, with Apana Vata, Pitta and Kapha involved in different patterns. Traditional texts also describe blood-related forms (Raktaja Arsha) in which bleeding is prominent.",
      "Ayurvedic support usually focuses on bowel regularity (Anulomana), digestive strength, diet, routine and avoidance of straining, since these are the most practical targets in daily life.",
      "Gentle, individualised external care and classical formulations may be considered, depending on the grade of piles, age and health.",
      "These are traditional interpretations. Evidence for many Ayurvedic approaches to piles is limited, and well-designed trials are few.",
    ],
    ayurvedaLimits: [
      "Rectal bleeding must be investigated medically. Ayurveda does not replace this, and it should never delay investigation of bleeding or possible cancer.",
      "Many classical procedures are not suitable in pregnancy, bleeding disorders or severe anaemia, and they must be chosen by qualified specialists after examination.",
      "Do not use irritant ointments or unknown herbal products on the anal area without advice, as they can cause burning or infection.",
    ],
    faqs: [
      {
        q: "Is bleeding from piles dangerous?",
        a: "Piles are usually not dangerous, but rectal bleeding must always be checked. It can be caused by piles, fissures, infection, polyps, inflammatory bowel disease or cancer. A doctor can examine you and decide which tests are needed.",
      },
      {
        q: "Do piles go away on their own?",
        a: "Some mild piles settle with diet, fluids and better bowel habits. Persistent or large piles often need medical or specialist treatment. Ignoring bleeding or repeated prolapse is not advisable.",
      },
      {
        q: "What food helps piles?",
        a: "A diet with enough fibre from vegetables, whole grains, pulses, fruit and seeds, plus adequate water, usually helps. Increase fibre gradually to avoid bloating, and review your intake with your doctor if you have kidney disease or other conditions.",
      },
      {
        q: "Should I see a surgeon or an Ayurvedic doctor?",
        a: "Both can have a role. Surgeons and proctologists assess the grade of piles and treat structural problems. An Ayurvedic consultation can support bowel health and comfort, and can discuss suitable classical procedures in person. Coordinate between them so that you receive safe care.",
      },
      {
        q: "Can Ayurveda cure piles permanently?",
        a: "No honest guarantee of a permanent cure can be given. Piles can recur, especially if constipation or straining continues. Lifestyle and bowel habits strongly influence whether piles return.",
      },
      {
        q: "Is treatment safe during pregnancy?",
        a: "Diet, fluids and gentle bowel care are generally safe to discuss in pregnancy. Some medicines and procedures are not. Tell your obstetrician and the practitioner about your pregnancy before starting any treatment.",
      },
      {
        q: "How can I avoid straining?",
        a: "Keep stools soft with fibre and water, go to the toilet when you feel the urge rather than delaying, avoid reading or using a phone on the toilet, and try a small footstool to support a squatting posture if it helps.",
      },
    ],
    hinglish: ["bawaseer ka ilaj", "khoon aana gudda", "piles mein kya khayein", "arsha ayurveda"],
    references: [
      {
        label:
          "Davis BR, Lee-Kong SA, Migaly J, Feingold DL, Steele SR. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Hemorrhoids. Dis Colon Rectum. 2018;61(3):284–292",
        publisher: "American Society of Colon and Rectal Surgeons",
      },
      { label: "Haemorrhoids (piles) — patient information", publisher: "NHS (UK)" },
      {
        label: "Classical references on Arsha (Sushruta Samhita; Charaka Samhita; Madhava Nidana)",
        publisher: "Classical Ayurvedic texts — interpretive reference",
      },
    ],
    relatedConditions: ["constipation-adults", "acidity-gerd", "constipation-children"],
    relatedTreatments: ["basti-therapy", "ayurvedic-diet-lifestyle"],
    relatedArticles: [],
  },
  {
    slug: "constipation-adults",
    status: "draft",
    primaryKeyword: "constipation treatment Ayurveda adults",
    title: "Constipation in Adults",
    h1: "Constipation in Adults and Older People: Causes, Warning Signs and Ayurvedic Approach",
    seoTitle: "Constipation in Adults: Causes, Symptoms & Ayurvedic Approach",
    seoDescription:
      "Hard stools, straining or infrequent bowel movements? Learn the causes of adult and older-age constipation, medicines to review, red flags, and gentle Ayurvedic bowel-care options.",
    category: "Digestion & Gut",
    intro:
      "Do you pass stools fewer than three times a week, strain, or feel that your bowel never quite empties? Has this gone on for months, and do you find yourself reaching for laxatives? Constipation is very common in adults, and it becomes more frequent with age, reduced movement, certain medicines and some medical conditions. A persistent change in bowel habit also needs a medical check, because some serious causes must be excluded first.",
    whatIs: [
      "Constipation means difficult or infrequent bowel movements. Doctors often use the Rome IV criteria, which describe straining, hard or lumpy stools, a sense of incomplete emptying, and fewer than three spontaneous bowel movements a week, present for at least three months.",
      "Most adult constipation is functional, meaning there is no structural disease, and it often improves with fibre, fluids, movement and a regular toilet routine. However, a change in bowel habit in someone over 50 is a reason for medical evaluation.",
    ],
    signs: [
      "Fewer than three bowel movements a week",
      "Hard, lumpy or dry stools",
      "Straining, or needing to press on the abdomen to pass stool",
      "A feeling of incomplete emptying or of blockage at the anus",
      "Bloating, abdominal discomfort or reduced appetite",
      "Headaches or low mood in some people when bowel habits are persistently irregular",
    ],
    ageNotes: [
      "Adults under 50: often linked with low fibre, low water intake, inactivity, irregular meals and ignoring the urge to go.",
      "Pregnancy: iron supplements, reduced movement and hormonal changes can all slow the bowel. Discuss gentle options with your obstetrician.",
      "Older adults (over 65): constipation is often linked with reduced mobility, low fluid intake, multiple medicines, and conditions such as diabetes or Parkinson's disease. Avoid strong laxatives without advice, as dehydration and electrolyte problems can occur.",
    ],
    causes: [
      "Low intake of fibre and fluid, and irregular meals",
      "Physical inactivity, long hours of sitting and reduced daily movement",
      "Ignoring the urge to pass stool, or a rushed or uncomfortable toilet routine",
      "Medicines such as opioids, iron and calcium supplements, some antidepressants, some blood pressure medicines and anticholinergic drugs",
      "Medical conditions including an underactive thyroid, diabetes, pelvic floor dysfunction, irritable bowel syndrome with constipation, and neurological conditions",
      "Low mood, stress and anxiety, which can affect bowel function",
      "Pregnancy and the period after childbirth",
    ],
    whenToAssess: [
      "Constipation lasting more than three weeks, or any new change in bowel habit",
      "A need for laxatives on most days to pass stool",
      "Persistent pain, bloating or vomiting along with constipation",
      "Constipation together with weight loss, tiredness or anaemia",
    ],
    diagnosis: [
      "History, including medicines, diet, fluid intake, a bowel diary, and any change in habit",
      "Physical examination, which may include abdominal and rectal examination",
      "Blood tests such as a complete blood count, thyroid function, blood sugar and calcium where indicated",
      "Colonoscopy or other investigations in people over 50 with new symptoms, rectal bleeding, weight loss, anaemia, or a family history of bowel cancer",
    ],
    management: [
      "Conventional guidance (including NICE Clinical Knowledge Summaries) recommends increasing fibre and fluid gradually, regular physical activity, a regular toilet routine, and reviewing medicines that may cause constipation. Osmotic or stimulant laxatives can be used as prescribed and should be reviewed regularly",
      "Ayurvedic management focuses on Apana Vata (the downward-moving energy linked with elimination), digestive strength, regular meals, warm fluids, and a daily routine that includes gentle movement",
      "Classical bowel-regulating formulations such as Triphala are widely used traditionally. Evidence is limited, and interactions with other medicines should be checked",
      "Panchakarma procedures, including some forms of Basti (medicated enema), are sometimes considered for chronic constipation in traditional practice. Suitability depends on age, strength, pregnancy and other health conditions, and is decided only after assessment",
    ],
    homeCare: [
      "Build up to about 25 to 30 grams of fibre a day from vegetables, fruit, whole grains, dal and seeds, adding it gradually",
      "Drink water regularly through the day, adjusting if you have kidney or heart conditions that require fluid restriction",
      "Walk for 20 to 30 minutes most days, or as much as your health allows",
      "Respond to the urge to pass stool, and allow yourself a relaxed, unhurried routine",
      "Discuss any laxative use with your doctor rather than taking them daily without advice",
    ],
    redFlags: [
      "Blood in the stool, or black, tarry stools",
      "Unexplained weight loss, persistent abdominal pain or a lump you can feel",
      "Vomiting with abdominal swelling, or inability to pass wind or stool (possible obstruction; urgent)",
      "New constipation after age 50 with no clear cause, or a family history of bowel cancer",
      "Fever with abdominal pain, confusion or fainting",
    ],
    ayurvedaRole: [
      "Traditional texts describe constipation (Vibandha) mainly as a disturbance of Vata dosha, particularly Apana Vata, which governs elimination. Dryness, irregularity and a weak digestive fire are commonly considered contributing factors.",
      "The approach emphasises warm, well-cooked food, oil and ghee in moderation, regular meal times, fluids, a calm toilet routine and gentle movement, adjusted to the person's constitution (Prakriti).",
      "Classical bowel-regulating formulations and procedures may be considered in consultation, with monitoring.",
      "These are traditional interpretations. Modern evidence for many Ayurvedic bowel approaches is limited, although diet and fluid changes have stronger evidence behind them.",
    ],
    ayurvedaLimits: [
      "Persistent constipation needs medical evaluation to exclude serious causes. Ayurveda should not delay a bowel investigation.",
      "Strong purgatives used without supervision can cause dehydration, electrolyte imbalance and dependence, particularly in older adults.",
      "Do not stop or change prescribed medicines for constipation, thyroid or other conditions because an Ayurvedic plan has been started.",
    ],
    faqs: [
      {
        q: "How many bowel movements a week is normal?",
        a: "Bowel habits vary a lot between people. Many people pass stool once or twice a day, but some normally pass it about three times a week. Constipation is more about difficulty, straining, hard stools or a change from your usual pattern.",
      },
      {
        q: "How much fibre do adults need?",
        a: "Health guidance commonly suggests around 30 grams of fibre a day from food for adults, increased gradually and with enough fluid. Fibre supplements can help some people but are not a substitute for a varied diet.",
      },
      {
        q: "Is Triphala safe for daily use?",
        a: "Triphala is a traditional Ayurvedic formulation widely used for bowel regularity. Evidence is limited, and it may interact with some medicines or affect people with certain conditions. Ask your doctor or practitioner before daily use.",
      },
      {
        q: "Why does constipation get worse with age?",
        a: "Reduced movement, lower fluid intake, slower bowel transit, changes in the pelvic floor muscles and the effects of multiple medicines all contribute. Conditions that become more common with age, such as diabetes, Parkinson's disease and thyroid problems, can also cause constipation.",
      },
      {
        q: "Can I use laxatives every day?",
        a: "Not without medical advice. Some laxatives are safe for longer-term use when prescribed and reviewed, but others can cause dependence, dehydration or electrolyte problems. Discuss the type and duration with your doctor.",
      },
      {
        q: "Does Ayurveda offer Panchakarma for constipation?",
        a: "Some traditional Panchakarma procedures, including Basti, are considered for chronic constipation. They are not suitable for everyone and are only decided after individual assessment. Pregnancy, certain heart or kidney conditions and recent surgery are among the factors that need review.",
      },
      {
        q: "What should I do if constipation is causing pain or bleeding?",
        a: "Seek medical advice promptly. Pain with straining or bleeding can be caused by a fissure or piles, but any bleeding must be assessed, and severe pain, fever or inability to pass stool or wind needs urgent care.",
      },
    ],
    hinglish: ["kabz ka ilaj", "pet saaf nahi hota", "kabz mein kya khayein", "vibandha ayurveda"],
    references: [
      {
        label:
          "Drossman DA. Functional Gastrointestinal Disorders: History, Pathophysiology, Clinical Features and Rome IV. Gastroenterology. 2016;150(6):1262–1279",
        publisher: "Gastroenterology (Rome IV)",
      },
      { label: "Constipation — adults (Clinical Knowledge Summaries)", publisher: "NICE, UK" },
      {
        label: "Classical references on Vibandha and Apana Vata (Charaka Samhita; Ashtanga Hridaya)",
        publisher: "Classical Ayurvedic texts — interpretive reference",
      },
    ],
    relatedConditions: ["piles-hemorrhoids", "acidity-gerd", "constipation-children"],
    relatedTreatments: ["basti-therapy", "ayurvedic-diet-lifestyle", "panchakarma"],
    relatedArticles: [],
  },
  {
    slug: "psoriasis",
    status: "draft",
    primaryKeyword: "psoriasis Ayurvedic treatment",
    title: "Psoriasis",
    h1: "Psoriasis: Symptoms, Causes and Ayurvedic Care Approach",
    seoTitle: "Psoriasis: Symptoms, Causes and Ayurvedic Approach",
    seoDescription:
      "Red, scaly patches on the elbows, knees or scalp? Learn what psoriasis is, common triggers, when to see a dermatologist, and how Ayurvedic care can support skin comfort.",
    category: "Skin & Hair",
    intro:
      "Do you have thick, red patches with silvery-white scales on the elbows, knees, scalp or lower back? Do they itch or crack, and do they return even after creams or other treatments? Psoriasis is a long-term immune-mediated skin condition, and it can be managed well with the right plan. It is not contagious. Dr. Priyanka Likhar assesses psoriasis in the context of your skin, digestion, sleep, stress and triggers, and works with your dermatologist where needed.",
    whatIs: [
      "Psoriasis is a chronic inflammatory skin condition in which skin cells renew too quickly, forming raised, well-defined plaques covered with scales. It can also affect the nails and, in some people, the joints (psoriatic arthritis).",
      "The course is usually relapsing and remitting. Severity varies from a few small patches to widespread involvement, and treatment is chosen according to severity, the body areas involved and the person's general health.",
    ],
    signs: [
      "Well-defined red plaques with silvery-white scales, commonly on the elbows, knees, scalp, lower back and buttocks",
      "Itching, burning or soreness, and cracking that may bleed",
      "Small pits, discolouration or lifting of the nails from the nail bed",
      "Joint pain or swelling, particularly in the fingers, toes or lower back, which may indicate psoriatic arthritis",
      "Scalp involvement, with flakes that look like dandruff but are thicker and patchier",
    ],
    ageNotes: [
      "Psoriasis can start at any age, including childhood. Children with psoriasis should be seen by a dermatologist or paediatrician for a plan that suits them.",
      "Older adults may have longer-standing disease and may take several medicines, so any combined plan needs careful checking.",
      "Pregnancy and breastfeeding need specialist planning, because many treatments are restricted in these periods.",
    ],
    causes: [
      "A genetic tendency combined with an overactive immune response that drives skin inflammation",
      "Triggers that can cause flares in susceptible people: skin injury (such as cuts or scratches), throat infections (especially streptococcal infections in some children), stress, dry or cold weather, and certain medicines",
      "Smoking, heavy alcohol use and excess body weight, which are linked with more severe disease",
      "Associated conditions, including metabolic syndrome and cardiovascular risk factors, which are more common in people with psoriasis",
    ],
    whenToAssess: [
      "Patches that are spreading, painful or cracked, or that are not improving after several weeks of basic care",
      "Scalp, nail or joint involvement",
      "Psoriasis affecting sleep, mood or daily activities",
      "Any new medicine that might trigger or worsen psoriasis",
    ],
    diagnosis: [
      "Clinical diagnosis by a dermatologist based on the appearance and distribution of plaques, with a skin biopsy if the diagnosis is uncertain",
      "Assessment of the body surface area involved and the impact on quality of life",
      "Screening for psoriatic arthritis, blood pressure, lipids and blood sugar as part of overall health checks",
      "Tests for infection or other conditions where indicated",
    ],
    management: [
      "Conventional care follows dermatology guidance (AAD and National Psoriasis Foundation). It includes topical treatments such as corticosteroids, vitamin D analogues and topical retinoids; phototherapy; and systemic or biologic treatments for moderate to severe disease. These are chosen by a dermatologist",
      "Ayurvedic care may involve assessment of digestion, diet, sleep and stress, advice to avoid personal triggers, external care that suits the skin, and classical formulations as individually advised",
      "Ayurveda should be planned alongside prescribed treatment. Do not stop topical steroids, biologics or other medicines suddenly",
      "Lifestyle measures such as weight management, smoking cessation, moderate alcohol use and regular exercise are supported by clinical guidance and are also useful",
    ],
    homeCare: [
      "Moisturise daily with a fragrance-free emollient, especially after bathing",
      "Use lukewarm water and mild cleansers, and avoid harsh scrubbing or very hot baths",
      "Avoid known triggers such as skin injuries, and wear loose cotton clothing",
      "Keep a diary of flares to notice triggers such as stress, infections and diet changes",
      "Use sunlight only as advised, as sun exposure can help some people and worsen others",
    ],
    redFlags: [
      "Sudden spread of pus-filled bumps (pustules) with fever or feeling very unwell",
      "Redness over most of the body with peeling skin (possible erythrodermic psoriasis; urgent)",
      "Eye pain, redness or any change in vision",
      "A swollen, painful joint that is hot or cannot move",
      "Signs of skin infection, such as spreading redness, warmth, pus or fever",
    ],
    ayurvedaRole: [
      "Classical Ayurvedic texts discuss skin disorders under the broad term Kushta. Psoriasis-like patterns are often described in relation to Kapha and Pitta dosha, and to Rakta (blood) and skin tissue (Twak).",
      "A traditional assessment considers digestion (Agni), diet, sleep, emotional stress and the person's constitution. Diet advice typically favours fresh, lightly spiced and easily digestible food, with reduction of foods the person finds aggravating.",
      "External care suited to the person's skin and stage of disease may be considered, and classical formulations may be used with monitoring.",
      "These are traditional interpretations. Ayurvedic treatments for psoriasis have limited high-quality evidence, and no Ayurvedic medicine has been shown to cure psoriasis.",
    ],
    ayurvedaLimits: [
      "Ayurveda cannot promise a permanent cure for psoriasis, and it should not replace prescribed treatment for moderate or severe disease.",
      "Some herbal and 'skin-purifying' products have been found to contain undeclared steroids or heavy metals. Buy products only from reputable sources, and tell your doctor what you use.",
      "Do not apply oils, herbal pastes or irritant preparations to inflamed or broken skin without advice, as they can worsen the condition or cause infection.",
    ],
    faqs: [
      {
        q: "Is psoriasis contagious?",
        a: "No. Psoriasis is not spread by touch, by sharing towels or through sexual contact.",
      },
      {
        q: "Can psoriasis be cured?",
        a: "At present there is no cure, but many people achieve good control of their skin with suitable treatment. The aims are to clear or reduce plaques, prevent flares and maintain quality of life. Expectations should be discussed openly with your doctors.",
      },
      {
        q: "Does diet help psoriasis?",
        a: "Some people find that certain foods or alcohol trigger flares, and weight loss can improve psoriasis in people who are overweight. Diet changes are most useful when they are tailored and monitored, and they do not replace prescribed treatment.",
      },
      {
        q: "Are steroid creams safe for psoriasis?",
        a: "Topical corticosteroids are effective and widely used when prescribed and monitored. Misuse, such as stopping suddenly or using strong steroids on the face or skin folds for long periods, can cause side effects. Follow your dermatologist's instructions.",
      },
      {
        q: "Can children get psoriasis?",
        a: "Yes. Psoriasis can start in childhood. Children need a plan that suits their age and skin, usually led by a dermatologist or paediatrician. Any Ayurvedic support must be age-appropriate and coordinated with that care.",
      },
      {
        q: "Is Ayurveda safe alongside biologic medicines?",
        a: "Supportive measures may be discussed, but biologics and other systemic treatments are monitored closely. Tell your dermatologist about any Ayurvedic medicine or product before starting, as some can affect the liver or interact with medicines.",
      },
      {
        q: "Does psoriasis affect the joints?",
        a: "It can. Psoriatic arthritis may cause joint pain, swelling and stiffness, particularly in the fingers, toes or lower back. Early assessment by a rheumatologist or dermatologist is important, because joint damage can occur if it is untreated.",
      },
    ],
    hinglish: ["psoriasis ka ilaj", "skin par sookhi laal patches", "chakte hue daag skin", "psoriasis Indore"],
    references: [
      {
        label:
          "Menter A, Strober BE, Kaplan DH, et al. Joint AAD–NPF guidelines of care for the management and treatment of psoriasis with biologics. J Am Acad Dermatol. 2019;80(4):1029–1072",
        publisher: "American Academy of Dermatology and National Psoriasis Foundation",
      },
      { label: "Psoriasis — patient information", publisher: "NHS (UK)" },
      {
        label: "Classical references on Kushta (Charaka Samhita; Ashtanga Hridaya)",
        publisher: "Classical Ayurvedic texts — interpretive reference",
      },
    ],
    relatedConditions: ["eczema", "hair-fall", "knee-pain"],
    relatedTreatments: ["abhyanga", "ayurvedic-diet-lifestyle", "panchakarma"],
    relatedArticles: [],
  },
  {
    slug: "eczema",
    status: "draft",
    primaryKeyword: "eczema treatment Ayurveda",
    title: "Eczema (Atopic Dermatitis)",
    h1: "Eczema (Atopic Dermatitis): Symptoms, Triggers and Ayurvedic Care Approach",
    seoTitle: "Eczema: Symptoms, Triggers and Ayurvedic Care Approach",
    seoDescription:
      "Itchy, dry, red skin that keeps flaring? Understand eczema in children and adults, common triggers, when to see a doctor, and how Ayurvedic care supports skin comfort alongside treatment.",
    category: "Skin & Hair",
    intro:
      "Is your skin constantly dry, itchy and inflamed, with red patches that flare in winter, after sweating or when you use certain soaps? Does the itch disturb sleep, especially in a child? Eczema (atopic dermatitis) is a common, long-term skin condition with a tendency to flare and settle. Good daily skin care and avoiding triggers make a real difference, and prescribed treatments for flares are safe and effective when used as advised. Dr. Priyanka Likhar assesses eczema alongside skin care, allergy history, sleep and digestion.",
    whatIs: [
      "Eczema is an inflammatory skin condition closely linked with a weakened skin barrier, which lets moisture escape and irritants enter. It often begins in infancy or childhood and is commonly associated with asthma and allergic rhinitis in the same person or family.",
      "Typical features include dry skin, intense itching, and red, scaly or thickened patches. Patterns vary with age: in babies it often affects the face and scalp, in children the skin folds of the elbows and knees, and in adults the hands, neck and eyelids.",
    ],
    signs: [
      "Dry, rough, flaky skin that may be present even between flares",
      "Intense itching, which may be worse at night and can disturb sleep",
      "Red, inflamed patches that may weep, crust or thicken with scratching",
      "Common sites include the skin folds of the elbows and knees, face, neck and hands",
      "Cracks or fissures on the hands and fingers in people who do frequent wet work",
    ],
    ageNotes: [
      "Babies and infants: often present on the cheeks, scalp and body, sometimes with weeping or crusting. Check any crusting, fever or spreading red spots promptly, as infection can occur.",
      "Children: skin folds are commonly affected. Sleep and school concentration are often disturbed by itching. Children should be assessed by a paediatrician or dermatologist.",
      "Adults: may have chronic hand eczema or long-standing patches. Work and sleep impact is common.",
    ],
    causes: [
      "A genetic tendency towards a weaker skin barrier and an overactive immune response",
      "Triggers that cause flares: dry weather, heat and sweating, wool or rough fabrics, harsh soaps and detergents, dust mites, pollen and stress",
      "Infections with bacteria or viruses, which can worsen eczema",
      "Food allergy is less common than often assumed. Broad elimination diets are not recommended without medical testing, especially in young children, because they can cause nutritional problems",
      "Scratching, which perpetuates the itch-scratch cycle",
    ],
    whenToAssess: [
      "Eczema that disturbs sleep or daily activities, or does not respond to basic moisturising",
      "Repeated infection (crusting, pus, spreading redness)",
      "Eczema in an infant, or eczema that is widespread",
      "Eczema affecting the face, eyes or genital area, which needs careful treatment",
    ],
    diagnosis: [
      "Clinical diagnosis based on the pattern, age of onset and family history of atopic conditions",
      "Assessment of triggers and of the impact on sleep and quality of life, with a review of skin care habits",
      "Allergy or infection tests only when they are useful for the individual case, as recommended by the clinician",
      "A dermatologist's review for severe, unusual or resistant disease",
    ],
    management: [
      "Guidelines for atopic dermatitis (AAD, 2014, and NICE) emphasise daily emollients as the foundation of care, avoidance of triggers, short courses of topical corticosteroids for flares as prescribed, and topical calcineurin inhibitors in suitable cases. Systemic treatments are used for severe disease",
      "Ayurvedic care may include assessment of diet, digestion, sleep, stress and triggers, gentle skin-friendly routines, and classical formulations chosen individually and monitored",
      "Prescribed topical steroids should not be stopped abruptly. Taper them only as your doctor advises, and tell the clinic before starting any oil or herbal paste",
      "Education on bathing, moisturising, clothing and the sleep environment is central to long-term control",
    ],
    homeCare: [
      "Moisturise the whole body at least twice daily, and immediately after bathing",
      "Use lukewarm water for short baths or showers, and a gentle, fragrance-free cleanser",
      "Wear soft cotton clothing and keep nails short to reduce damage from scratching",
      "Keep the bedroom cool, and take dust-mite precautions if dust triggers your symptoms",
      "Patch-test any new oil, cream or herbal product on a small area for several days before wider use",
    ],
    redFlags: [
      "Signs of infection: honey-coloured crusts, pus, spreading redness or warmth, fever or feeling unwell",
      "Large areas of blistering or painful red skin, or a sudden flare that does not respond to usual care",
      "A rapidly spreading, painful, punched-out or herpes-like rash, especially in people with eczema (urgent)",
      "Eczema with poor growth, persistent sleeplessness, or a child who seems very unwell",
      "Eczema affecting the eyes with pain, redness or change in vision",
    ],
    ayurvedaRole: [
      "Classical texts describe eczema-like conditions under the term Vicharchika, associated with Kapha and Pitta, and with Rakta (blood) and skin involvement. Dryness and itching are often linked with Vata.",
      "Traditional assessment looks at digestion, diet, sleep, stress and the person's constitution. Diet advice usually favours light, freshly cooked food, avoidance of personal triggers and regular meal times.",
      "Gentle external care with suitable oils (after patch testing) and classical formulations may be considered as part of an individual plan.",
      "These are traditional interpretations. Evidence for Ayurvedic treatment of eczema is limited. Some trials of herbal preparations have been reported, but their quality and consistency vary.",
    ],
    ayurvedaLimits: [
      "Ayurveda should not replace prescribed moisturisers, topical steroids or other treatments, especially in babies and children.",
      "Some Ayurvedic products contain metals or undeclared steroids. Check the source of every product and tell your doctor what you use.",
      "Oils, pastes and 'detox' routines may worsen eczema or cause infection in some people. Avoid using them on broken skin.",
    ],
    faqs: [
      {
        q: "Is eczema contagious?",
        a: "No. Eczema cannot be passed from person to person.",
      },
      {
        q: "Do I need steroid creams for eczema?",
        a: "Not always, but they are the most effective treatment for flares in many people. Your doctor will advise on the strength, area and duration. Using them as prescribed is safe. Misuse, including stopping suddenly, can cause problems.",
      },
      {
        q: "Will my child outgrow eczema?",
        a: "Many children improve as they grow older, but some continue to have eczema into adulthood. Good skin care and trigger control help reduce flares in both cases.",
      },
      {
        q: "Should we avoid all foods for eczema?",
        a: "No. Unnecessary food restriction can cause nutritional problems, particularly in children. If food allergy is suspected, testing and dietary changes should be guided by a doctor or dietitian.",
      },
      {
        q: "Is coconut oil good for eczema?",
        a: "Some people find oils soothing, but others react to them, and oils can be a problem on broken skin. Patch-test any oil, and use a fragrance-free emollient as the main moisturiser unless your doctor advises otherwise.",
      },
      {
        q: "Can Ayurveda help eczema in children?",
        a: "Ayurvedic support for children must be gentle, age-appropriate and coordinated with the paediatrician or dermatologist. Diet, sleep, bathing and trigger control are the most practical starting points.",
      },
      {
        q: "What if my child's eczema is disturbing sleep?",
        a: "Sleep disturbance is a common reason for a visit. Talk to your doctor about treating flares, keeping nails short, using cotton bedding, and whether any short-term antihistamine is suitable. Do not give any medicine that has not been prescribed for your child.",
      },
    ],
    hinglish: ["eczema ka ilaj", "bachche ko khujli aur laal daane", "skin dry aur khujli", "vicharchika ayurveda"],
    references: [
      {
        label:
          "Sidbury R, Davis DM, Cohen DE, et al. Guidelines of care for the management of atopic dermatitis. J Am Acad Dermatol. 2014;71(2):327–349",
        publisher: "American Academy of Dermatology",
      },
      { label: "Atopic eczema (Clinical Knowledge Summaries)", publisher: "NICE, UK" },
      {
        label: "Classical references on Vicharchika and Kitibha (Charaka Samhita; Madhava Nidana)",
        publisher: "Classical Ayurvedic texts — interpretive reference",
      },
    ],
    relatedConditions: ["psoriasis", "frequent-colds-cough-children", "sleep-problems-children"],
    relatedTreatments: ["abhyanga", "ayurvedic-diet-lifestyle"],
    relatedArticles: [],
  },
];
