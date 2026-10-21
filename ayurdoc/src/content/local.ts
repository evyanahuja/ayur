/* Local landing pages — one per genuine service+place combination.
   No doorway spam: each page has unique, useful local information.
   "Best doctor" page is framed as "how to choose" — never a self-claim. */

export interface LocalPage {
  slug: string; // full path WITHOUT leading slash, e.g. "ayurvedic-doctor-indore"
  title: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  bullets: string[];
  areasServed: string[];
  consultInfo: string[];
  faqs: { q: string; a: string }[];
  hinglish: string[];
  relatedLinks: { label: string; href: string }[];
}

export const LOCAL_PAGES: LocalPage[] = [
  {
    slug: "ayurvedic-doctor-indore",
    title: "Ayurvedic Doctor in Indore",
    h1: "Ayurvedic Doctor in Indore — BalChikitsa Ayurved Clinic",
    seoTitle: "Ayurvedic Doctor in Indore | Dr. Priyanka Likhar, BAMS MD",
    seoDescription: "Consult Dr. Priyanka Likhar (BAMS, MD Kaumarbhritya) in Indore — child health, skin, digestion, immunity. Address, timings, fees & online consult.",
    intro: "Looking for an Ayurvedic doctor in Indore who takes children seriously? Dr. Priyanka Likhar (Reg. No. 63934 • MD — Pediatrician / Kaumarbhritya from Institute of Teaching and Research in Ayurveda; BAMS from Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur) consults at BalChikitsa Ayurved Clinic, Sanchar Nagar Extension, Kanadia Road — with structured 45-minute assessments, written plans, and follow-ups in Hindi, Marathi, English and Gujarati.",
    bullets: [
      "Verified credentials: Reg. No. 63934 • MD (Pediatrician — Kaumarbhritya, ITRA) • BAMS (Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur)",
      "45-minute first consultation: Prakriti, Agni, growth, diet, sleep and routine mapped",
      "Conditions most consulted for: eczema/skin, speech & attention support, appetite/growth, recurrent cold-cough, constipation, sleep and Suvarnaprashan",
      "Steroid-conscious, antibiotic-aware approach coordinated with paediatric care where needed",
    ],
    areasServed: ["Vijay Nagar", "Sapphire Heights / AB Road", "Palasia", "Vishnupuri", "Bengali Square", "Kanadia", "Rajendra Nagar", "Sudama Nagar", "Annapurna", "Online across MP & India"],
    consultInfo: [
      "Address: Sanchar Nagar Extension, Kanadia Road, Indore, MP 452016",
      "Timings: Mon–Sat, 10 AM–2 PM & 5–8 PM IST (evening + NRI-friendly online slots)",
      "Phone/WhatsApp: +91 98607 75010 • Email: drpriyankalikhar@gmail.com",
      "What to carry: prior reports, medicine list, growth record, 3-day diet note",
    ],
    faqs: [
      { q: "Indore mein Ayurvedic doctor kaise chunein?", a: "Degree (BAMS + specialization), bachchon ka focused anubhav, pehli visit ka samay (jaldi wali 5-min OPD se bachein), likhit prescription/diet chart, aur red-flag honesty — ye paanch cheezen dekhein." },
      { q: "Kya bachchon ke liye Ayurvedic dawai safe hai?", a: "Qualified doctor se age-dosed, quality-verified dawai aam taur par safe hoti hai. Label/batch dekhein, bina diagnosis ke powder na lein, aur emergency me turant modern care lein." },
      { q: "Online consultation available hai?", a: "Haan — video par detailed assessment, e-prescription aur diet chart; dawai courier/local pharmacy se. Booking par current slots confirm karein." },
    ],
    hinglish: ["Indore mein Ayurvedic doctor", "Kanadia road ayurvedic clinic", "bachchon ke doctor Indore"],
    relatedLinks: [
      { label: "About Dr. Priyanka Likhar", href: "/about-doctor" },
      { label: "Child Healthcare in Indore", href: "/child-healthcare-indore" },
      { label: "Ayurvedic Consultation — process & fees", href: "/services/ayurvedic-consultation" },
      { label: "Contact & appointments", href: "/contact" },
    ],
  },
  {
    slug: "best-ayurvedic-doctor-indore",
    title: "How to Choose (Best Doctor Guide)",
    h1: "Finding the Best Ayurvedic Doctor in Indore: An Honest Checklist",
    seoTitle: "Best Ayurvedic Doctor in Indore? How to Choose Right",
    seoDescription: "No clinic can crown itself 'best'. Use this 7-point checklist — credentials, child focus, time, transparency — then decide. Includes Indore consult info.",
    intro: "Every clinic page claims to be the 'best' — which makes the word meaningless. We will not claim it about ourselves. Instead, here is the checklist we wish every parent used, and how our clinic answers each point so you can judge for yourself.",
    bullets: [
      "1. Verified qualification: BAMS is mandatory; MD specialization should match your need (ours: Reg. No. 63934, MD — Pediatrician / Kaumarbhritya from ITRA, BAMS from Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur)",
      "2. Child focus: children are not small adults — ask what share of practice is paediatric",
      "3. Time: a real first assessment takes 30–45 minutes, not 5",
      "4. Written plan: prescription + diet + review date, in language you understand",
      "5. Red-flag honesty: a good doctor says when Ayurveda is NOT the answer and refers onward",
      "6. No fear-selling: no forced packages, no 'cure in X days' promises, no secret formulas",
      "7. Follow-up access: a defined doubt-window and scheduled reviews, not disappear-after-payment",
    ],
    areasServed: ["Indore (all zones)", "Dewas", "Ujjain", "Dhar", "Online across MP"],
    consultInfo: ["Compare 2–3 clinics on the checklist above before deciding.", "Our answers: MD Kaumarbhritya, child-focused, 45-min first visit, written plans, Hindi/Marathi/English/Gujarati, WhatsApp follow-up window."],
    faqs: [
      { q: "Kya aap 'best' hone ka daava karte hain?", a: "Nahi. 'Best' naapa nahi ja sakta. Hum apni degree, process aur transparency saaf batate hain — faisla checklist se aap karein." },
      { q: "Fees compare kaise karein?", a: "Sirf first-visit fee nahi — review frequency, dawai cost transparency aur package pressure bhi dekhein. Sabse sasti OPD aksar sabse mehengi padti hai (repeat visits)." },
    ],
    hinglish: ["Indore me best ayurvedic doctor kaise chune", "achche vaidya ki pehchan"],
    relatedLinks: [
      { label: "Ayurvedic Doctor in Indore", href: "/ayurvedic-doctor-indore" },
      { label: "Doctor profile & qualifications", href: "/about-doctor" },
      { label: "Consultation process", href: "/services/ayurvedic-consultation" },
    ],
  },
  {
    slug: "child-healthcare-indore",
    title: "Child Healthcare in Indore",
    h1: "Child Healthcare in Indore: Ayurvedic Paediatric Consultation",
    seoTitle: "Child Healthcare in Indore | Ayurvedic Child Consultation",
    seoDescription: "Bachchon ke doctor in Indore — growth, appetite, skin, cold-cough, sleep & development support. Clinic + online. Book a consultation.",
    intro: "Bachchon ke doctor in Indore dhoondh rahe hain? BalChikitsa Ayurved Clinic focuses on children's health through Ayurveda's child specialty (Kaumarbhritya/Balarog): growth and appetite, skin, recurrent infections, digestion, sleep and developmental support — coordinated with your paediatrician, never competing with them.",
    bullets: [
      "Growth & appetite: weight, height curves, anaemia, picky eating",
      "Skin: eczema, rashes, fungal patterns — steroid-conscious protocols",
      "Respiratory & immunity: recurrent cold-cough, Suvarnaprashan guidance",
      "Gut & sleep: constipation, bedwetting support, sleep routines",
      "Development: speech, attention and milestone support alongside therapy",
    ],
    areasServed: ["Kanadia", "Vijay Nagar", "Palasia", "Rajendra Nagar", "Bengali Square", "Online across MP & India"],
    consultInfo: ["First visit 45 min • Mon–Sat 10–2 & 5–8 IST", "Carry: growth record, reports, medicine list, diet note", "Phone/WhatsApp: +91 98607 75010"],
    faqs: [
      { q: "Bachchon ke doctor in Indore — Ayurvedic ya paediatrician?", a: "Dono ki bhoomika alag hai: paediatrician (MBBS/MD Paeds) acute/immunization/growth monitoring ke liye; Ayurvedic child consultant recurrent/chronic patterns, immunity, pachan-neend-routine ke liye. Hum milkar kaam karte hain, ek-dusre ki jagah nahi." },
      { q: "Kya aap vaccination karte hain?", a: "Nahi — vaccination apne paediatrician ke schedule par hi karwayein. Hum uska samarthan karte hain, vikalp nahi dete." },
    ],
    hinglish: ["Bachchon ke doctor in Indore", "bachchon ka clinic Kanadia", "child specialist ayurvedic Indore"],
    relatedLinks: [
      { label: "Conditions library", href: "/conditions" },
      { label: "Suvarnaprashan in Indore", href: "/treatments/customized-suvarnaprashan" },
      { label: "Book a visit", href: "/contact" },
    ],
  },
  {
    slug: "ayurvedic-doctor-madhya-pradesh",
    title: "Ayurvedic Doctor in MP",
    h1: "Ayurvedic Doctor in Madhya Pradesh (In-Clinic + Online)",
    seoTitle: "Ayurvedic Doctor in Madhya Pradesh | Indore Clinic + Online",
    seoDescription: "Serving Indore, Dewas, Ujjain, Bhopal & online across MP. Child-focused Ayurvedic consultation with written plans and follow-ups.",
    intro: "Based in Indore with online consultation across Madhya Pradesh — Dewas, Ujjain, Dhar, Ratlam, Bhopal and beyond. Families outside Indore get the same structured assessment by video, with prescriptions, diet charts and scheduled follow-ups.",
    bullets: ["In-clinic: Indore (Kanadia Road) • Online: all MP districts + NRI families", "Same 45-min structure on video: history, reports, growth review, written plan", "Medicines via courier or verified local pharmacy — exact formulations on prescription"],
    areasServed: ["Indore", "Dewas", "Ujjain", "Dhar", "Ratlam", "Bhopal", "Online: all MP"],
    consultInfo: ["Video slots include evening + NRI-friendly times on request", "Hindi, Marathi, English, Gujarati supported"],
    faqs: [{ q: "MP me bahar se online consult kaise hoga?", a: "Slot book karein → reports/weight/vaccine details bhejein → video visit → likhit prescription + diet chart → dawai courier/local se → scheduled follow-up." }],
    hinglish: ["MP me ayurvedic doctor online", "Ujjain Dewas se consult"],
    relatedLinks: [
      { label: "Online consultation — how it works", href: "/services/online-ayurvedic-consultation" },
      { label: "Ayurvedic doctor in Indore", href: "/ayurvedic-doctor-indore" },
    ],
  },
  {
    slug: "suvarnaprashan-indore",
    title: "Suvarnaprashan in Indore",
    h1: "Suvarnaprashan in Indore: Monthly Drops & Consultation",
    seoTitle: "Suvarnaprashan in Indore | Customized Drops & Consultation",
    seoDescription: "Customized Suvarnaprashan in Indore — Pushya schedule, age suitability, safety and cost. Book assessment at BalChikitsa Clinic, Kanadia Road.",
    intro: "Bachchon ke liye Suvarnaprashan in Indore — monthly Pushya Nakshatra administration with proper assessment, labelled quality-verified drops, and tracked reviews. Start with a consultation to confirm suitability, dose and schedule for your child.",
    bullets: ["Customized dose by age/weight/pattern — not one-drop-fits-all", "Pushya-day camps + daily-course options as assessed", "Labelled, batch-tracked preparation — see the label at your visit", "Illness/growth/digestion diary reviews every 4–8 weeks"],
    areasServed: ["Kanadia", "Vijay Nagar", "Palasia", "Rajendra Nagar", "All Indore + online guidance (drops administered per advice)"],
    consultInfo: ["Clinic: Kanadia Road, Indore • Mon–Sat", "Phone/WhatsApp: +91 98607 75010", "Cost confirmed transparently at consultation"],
    faqs: [
      { q: "Indore me Suvarnaprashan kab aur kahan milta hai?", a: "Hamare clinic par Pushya Nakshatra ke din camps + assessed daily courses. Pehle suitability consultation hoti hai — bina assessment ke drops nahi." },
      { q: "Kya ye vaccine ki jagah hai?", a: "Bilkul nahi. Routine vaccination schedule par hi hoga — Suvarnaprashan sahayak parampara hai, vikalp nahi." },
    ],
    hinglish: ["Indore me Suvarnaprashan", "Pushya Nakshatra drops Indore", "suvarnaprashan price Indore"],
    relatedLinks: [
      { label: "Customized Suvarnaprashan — full guide", href: "/treatments/customized-suvarnaprashan" },
      { label: "Safety & quality checks", href: "/treatments/suvarnaprashan-safety-quality" },
      { label: "Book assessment", href: "/contact" },
    ],
  },
  {
    slug: "panchakarma-indore",
    title: "Panchakarma in Indore",
    h1: "Panchakarma Treatment in Indore: Assessment-First Approach",
    seoTitle: "Panchakarma Treatment in Indore | Assessment & Honest Guidance",
    seoDescription: "Considering Panchakarma in Indore? Learn what suits whom, safety, duration and process — with verified in-clinic offerings only.",
    intro: "Panchakarma in Indore is widely advertised — and widely misunderstood. This page explains what is genuinely offered here (assessment-first, with verified in-clinic therapies), who it suits, and when we will advise you against it. Please read the verification note: only confirmed in-clinic procedures are listed.",
    bullets: ["Assessment-first: no procedure without diagnosis, suitability and written plan", "In-clinic offerings confirmed at consultation (see verification note)", "Full protocol: preparation + procedure + recovery diet — never single-day 'detox' theatre", "Coordinated with your existing doctors; medicines never stopped abruptly"],
    areasServed: ["Indore (all zones)", "Nearby: Dewas, Ujjain (assessment + referral as needed)"],
    consultInfo: ["Start with an Ayurvedic consultation to determine suitability", "Duration typically 7–21 days; estimate given in writing"],
    faqs: [
      { q: "Kya bachchon ko Panchakarma hota hai?", a: "Bachchon me keval saumya Bahya upchar (jaise Abhyanga) assessed cases me; Shodhana procedures bachchon ke liye routine nahi hain." },
      { q: "Kaunsi therapies aapke clinic me hoti hain?", a: "Wahi jo verify hain — consultation me likhit roop me bataya jata hai. Jo suvidha hamare yahan nahi hai, uske liye sahi referral diya jata hai." },
    ],
    hinglish: ["Indore me panchakarma", "panchakarma kharcha kitna"],
    relatedLinks: [
      { label: "Panchakarma — full explainer", href: "/treatments/panchakarma" },
      { label: "Abhyanga", href: "/treatments/abhyanga" },
      { label: "Book assessment", href: "/contact" },
    ],
  },
  {
    slug: "ayurvedic-pediatrician-indore",
    title: "Ayurvedic Child Care (Kaumarbhritya)",
    h1: "Ayurvedic Paediatric Care in Indore (Kaumarbhritya / Balarog)",
    seoTitle: "Ayurvedic Paediatric Care in Indore (Kaumarbhritya) | BAMS MD",
    seoDescription: "MD Kaumarbhritya child-focused Ayurvedic care in Indore — scope, limits, and coordination with paediatricians. Accurate, honest terminology.",
    intro: "Terminology matters in healthcare. Dr. Priyanka Likhar (Reg. No. 63934) holds MD — Pediatrician (Kaumarbhritya / Balarog) from Institute of Teaching and Research in Ayurveda and BAMS from Dr. Vandanatai J. Dhone Gramin Ayurved College, Patur — the Ayurvedic specialty dedicated to children's health. This page states scope precisely: what Ayurvedic paediatric care covers, where an allopathic paediatrician (MBBS/MD Paediatrics) leads instead, and how the two coordinate.",
    bullets: ["Scope: growth/appetite, digestion, skin, recurrent infections/immunity, sleep/routine, developmental support alongside therapy", "Not scope: emergency care, vaccination delivery, NICU/surgical/ICU care — always paediatrician-led", "Coordination: reports shared, medicines never stopped abruptly, red flags referred promptly"],
    areasServed: ["Indore + online across MP/India"],
    consultInfo: ["If unsure who to see first, message the clinic with the concern — you will be told honestly."],
    faqs: [{ q: "'Child specialist' aur 'Kaumarbhritya' me antar?", a: "'Child specialist/paediatrician' aam taur par MBBS+MD Paediatrics ke liye prayog hota hai. 'Kaumarbhritya/Balarog' Ayurveda ki baal-chikitsa specialty hai. Dono alag prashikshan, alag bhoomika — hum apni seema saaf batate hain aur zaroorat par refer karte hain." }],
    hinglish: ["Balarog doctor Indore", "kaumarbhritya kya hai"],
    relatedLinks: [
      { label: "About the doctor", href: "/about-doctor" },
      { label: "Conditions library", href: "/conditions" },
    ],
  },
];
