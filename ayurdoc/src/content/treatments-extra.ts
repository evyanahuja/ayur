/* Additional treatment pages, merged into TREATMENTS in treatments.ts.
   Both pages describe individualised care: suitability, risks and precautions
   are explained, and no dosing or procedure is prescribed through web content. */
import type { TreatmentPage } from "./treatments";

export const TREATMENTS_EXTRA: TreatmentPage[] = [
  {
    slug: "rasayana",
    base: "treatments",
    title: "Rasayana",
    h1: "Rasayana Therapy: Nourishment, Rejuvenation and Healthy Ageing",
    seoTitle: "Rasayana Therapy in Ayurveda | Healthy Ageing & Nourishment",
    seoDescription:
      "What Rasayana means in Ayurveda, who it may suit, precautions, and what an individual assessment involves. Consult Dr. Priyanka Likhar in Indore.",
    category: "Therapies",
    intro:
      "Rasayana is one of the eight branches of Ayurveda. Traditionally it is concerned with nourishment, rejuvenation, healthy ageing and the support of vitality and resilience. In practice, Rasayana can mean a suitable diet, a daily routine, seasonal living and, where appropriate, classical herbal or mineral-based preparations chosen for the individual. It is not a single product, and it is not a cure for any disease. Dr. Priyanka Likhar decides whether a Rasayana plan suits you after reviewing your health, medicines and goals.",
    sections: [
      {
        h: "What Rasayana means in Ayurveda",
        p: [
          "Classical texts describe Rasayana as the branch of treatment that nourishes the body tissues (dhatus), supports quality of life and helps maintain health over time. The Charaka Samhita discusses it at length.",
          "Rasayana is generally discussed in two broad forms: general rejuvenation for everyday health, and specific supportive preparations, such as those traditionally used for memory and intellect (Medhya Rasayana).",
        ],
      },
      {
        h: "What an individual Rasayana plan may include",
        p: [
          "A plan is individual. It may include dietary guidance, daily and seasonal routines, sleep and stress advice, gentle physical activity, and classical formulations chosen for your age, constitution (Prakriti), digestion (Agni) and current health.",
        ],
        list: [
          "Review of digestion and food habits, with advice suited to the season",
          "Daily routine (Dinacharya) and sleep timing",
          "Classical formulations, dosed and monitored by the practitioner",
          "Follow-up to check tolerance, benefit and any need for change",
        ],
      },
      {
        h: "Evidence and honest limits",
        p: [
          "Some herbs used in Rasayana have been studied in small clinical trials for fatigue, stress or general wellbeing. These studies are often short and of varying quality, so they should be read as preliminary, not as proof of benefit. Rasayana is best understood as a supportive, long-term approach to healthy living.",
          "Products sold as 'rasayana' or 'tonics' vary widely in quality, purity and labelling. Some have been found to contain undeclared substances or heavy metals, so the source of every product matters.",
        ],
      },
      {
        h: "Safety and precautions",
        p: [
          "Formulations must be chosen carefully in pregnancy, breastfeeding, childhood, older age, and in people with liver, kidney, heart, thyroid, blood sugar or autoimmune conditions. Herbs can interact with prescribed medicines, including blood thinners and diabetes or blood pressure medicines.",
        ],
      },
    ],
    suitability: [
      "Adults seeking general support for stamina and recovery after illness, after assessment",
      "Older adults who want a structured plan for nourishment and healthy ageing, with a full medicine review",
      "Children, only with age-appropriate formulations and paediatric-minded assessment",
    ],
    notSuitable: [
      "Acute infections, high fever or any acute illness that needs medical care",
      "Pregnancy or breastfeeding without advice from a qualified doctor",
      "Anyone hoping Rasayana will replace prescribed treatment for a disease",
    ],
    risks: [
      "Unregulated or unknown-source products may contain contaminants or unlisted medicines",
      "Interactions with prescribed medicines, and effects on blood sugar, blood pressure or thyroid function",
      "Overuse of stimulating herbs can cause restlessness, digestive upset or sleep problems",
    ],
    process: [
      "Consultation to review health, medicines and goals",
      "Assessment of Prakriti, Agni, sleep and daily routine",
      "An individual plan covering diet, routine and any formulations, with clear duration and review dates",
      "Follow-up to review tolerance, progress and any need to change",
    ],
    faqs: [
      {
        q: "Is Rasayana the same as a tonic?",
        a: "Loosely, yes. Many tonics are inspired by Rasayana ideas. A professional Rasayana plan is individualised and considers your health, medicines and needs, rather than offering one general product for everyone.",
      },
      {
        q: "Can Rasayana boost immunity?",
        a: "Traditional texts link Rasayana with strength and resilience, and some supportive measures may be part of a plan. There is no reliable evidence that any Rasayana product prevents infection. Vaccination and other prevention measures remain essential.",
      },
      {
        q: "Can I take Rasayana together with my medicines?",
        a: "Only after your medicines have been reviewed, because some herbs interact with common medicines. Always tell the practitioner about all prescribed drugs, supplements and products.",
      },
      {
        q: "Is Rasayana suitable for children?",
        a: "Some gentle, child-appropriate formulations and dietary approaches are used in paediatric Ayurveda. They must be dosed by age and weight and chosen after assessment. Adult tonics should not be given to children.",
      },
    ],
    hinglish: ["rasayana chikitsa", "shakti aur taqat ki dawa", "ayurvedic tonic Indore"],
    relatedTreatments: ["ayurvedic-diet-lifestyle", "customized-suvarnaprashan", "panchakarma"],
    relatedConditions: ["insomnia", "pcos-pcod"],
    relatedArticles: [],
  },
  {
    slug: "ayurvedic-diet-lifestyle",
    base: "treatments",
    title: "Ayurvedic Diet & Lifestyle",
    h1: "Ayurvedic Diet and Lifestyle Guidance: Practical, Individual and Evidence-Aware",
    seoTitle: "Ayurvedic Diet & Lifestyle Guidance in Indore | Individual Plans",
    seoDescription:
      "Practical Ayurvedic diet, daily routine and seasonal living advice, adapted to your constitution and health conditions. Consult Dr. Priyanka Likhar in Indore or online.",
    category: "Consultation",
    intro:
      "Ayurveda places diet (Ahara) and daily living (Vihara) at the centre of health. The most useful Ayurvedic advice is practical: meals timed to your digestion, home-cooked food suited to the season, a routine that supports sleep and energy, and habits that fit your work and family life. At BalChikitsa Ayurved Clinic, diet and lifestyle plans are built around Indian home cooking and tailored to age, Prakriti, digestion, medical conditions and medicines. Plans are reviewed over time and coordinated with any special diet your doctor has advised.",
    sections: [
      {
        h: "Core principles, explained simply",
        p: [
          "Agni (digestive capacity) is central in classical Ayurveda. Food is considered most helpful when it matches digestion: warm, freshly cooked, not too heavy or too cold, eaten at regular times and in a calm setting.",
          "Prakriti (constitution) and Vikriti (current state) guide individual choices, so two people with the same concern may need different food and routine advice.",
          "Ritucharya (seasonal living) and Dinacharya (daily routine) adjust food, activity and sleep to the season and time of day.",
        ],
      },
      {
        h: "What a practical plan may include",
        p: ["A simple, personalised plan is more useful than a long list of banned foods."],
        list: [
          "Regular meal times and a lighter, earlier dinner",
          "Fibre from vegetables, pulses, whole grains and seasonal fruit",
          "Measured use of ghee and oils, and warm drinks through the day",
          "Limiting very spicy, fried, very sugary or heavily processed foods",
          "Water intake suited to climate, activity and any kidney or heart advice",
          "A wind-down routine, regular sleep, and gentle daily movement such as walking or yoga",
        ],
      },
      {
        h: "Diet in medical conditions",
        p: [
          "Diets for diabetes, kidney disease, thyroid conditions, heart disease, pregnancy, or children with growth concerns must be coordinated with your doctor or a registered dietitian. Ayurvedic advice does not override medical dietary restrictions, and it should never lead to unsafe fasting, very low calorie intake or the exclusion of essential nutrients.",
        ],
      },
      {
        h: "What the evidence says",
        p: [
          "Many principles in Ayurvedic diet, such as regular meals, adequate fibre, less processed food, regular activity and good sleep, are consistent with modern nutrition and public health guidance. Other traditional ideas, such as detailed food-combining rules, have less direct evidence and are discussed individually rather than applied rigidly.",
        ],
      },
    ],
    suitability: [
      "Anyone wanting practical guidance on digestion, energy, weight, sleep or general wellbeing",
      "People managing long-term conditions who want diet and routine advice that works alongside medical care",
      "Families wanting home-friendly plans for children, adults and older people",
    ],
    notSuitable: [
      "Restrictive or fasting regimes that risk nutritional deficiency, especially in children, pregnancy and older adults",
      "Plans that replace a prescribed diet for kidney, liver, diabetes or other medical conditions without medical coordination",
    ],
    risks: [
      "Very restrictive diets can cause deficiencies, weakness, low blood sugar, and hair or bone problems over time",
      "Blood sugar and blood pressure medicines may need review if weight or diet changes significantly",
    ],
    process: [
      "Consultation to review health, digestion, sleep, activity and food habits",
      "A simple written plan with a sample day of meals and routine",
      "Follow-up to adjust the plan based on what is realistic and what is working",
    ],
    faqs: [
      {
        q: "Is an Ayurvedic diet the same as a weight-loss diet?",
        a: "Not necessarily. Ayurvedic diet advice focuses on digestion, regular meals and balance. Weight may change gradually as meals, portions and activity change, but rapid or extreme weight loss is not the goal.",
      },
      {
        q: "Which foods are best according to Ayurveda?",
        a: "There is no single best food. In general, freshly cooked, warm, easily digestible meals with pulses, vegetables, whole grains and seasonal produce are favoured. The right mix depends on your constitution, digestion and health.",
      },
      {
        q: "Can diet help my digestion and sleep?",
        a: "Often, yes. Regular meal times, lighter dinners and less caffeine or late-night eating can help digestion and sleep for many people. Persistent problems should still be checked medically.",
      },
      {
        q: "Should I follow the same diet as my family?",
        a: "Usually a family can eat similar food with small individual adjustments. Children, pregnant women, older adults and people with medical conditions often need specific advice.",
      },
    ],
    hinglish: ["ayurvedic diet plan Indore", "kya khayein kya na khayein", "dinacharya ritucharya"],
    relatedTreatments: ["panchakarma", "rasayana", "customized-suvarnaprashan"],
    relatedConditions: ["acidity-gerd", "constipation-adults", "pcos-pcod"],
    relatedArticles: [],
  },
];
