/* =============================================================================
 *  ⚙️  SINGLE SOURCE OF TRUTH — EDIT EVERYTHING HERE
 * -----------------------------------------------------------------------------
 *  This is the ONLY file you need to change to update the whole website:
 *  name, phone, email, address, timings, prices, stats, testimonials, FAQs.
 *  Save the file → the site updates everywhere automatically.
 * ========================================================================== */

import {
  Sparkles, Brain, TrendingUp, Wind, ShieldPlus, Apple, Baby, Leaf, Milk,
  ClipboardList, SearchCheck, LineChart, Droplets, HandHeart, MoonStar,
  UtensilsCrossed, HeartHandshake, ShieldCheck, Video, Building2, Crown,
} from "lucide-react";

/* -----------------------------------------------------------------------------
 * 1) BRAND, DOCTOR & CONTACT DETAILS  👈 CHANGE THESE FIRST
 * -------------------------------------------------------------------------- */
export const SITE = {
  doctorName: "Dr. Priyanka Likhar",
  qualification: "BAMS • MD Kaumarbhritya (Balarog)",
  shortCreds: "MD Kaumarbhritya • BAMS",
  clinicName: "BalChikitsa Ayurved Clinic",

  // 📞 Phone — displayed on site
  phoneDisplay: "+91 98607 75010",
  // Used for click-to-call links (no spaces, with country code)
  phoneHref: "+919860775010",
  // WhatsApp number (country code, NO plus sign, NO spaces)
  whatsapp: "919860775010",
  whatsappMessage: "Namaste Doctor Priyanka, I want to consult for my child.",

  // ✉️ Public email shown on the website
  email: "drpriyankalikhar@gmail.com",

  // 📍 Address
  addressShort: "BalChikitsa Ayurved Clinic + Online worldwide",
  addressFull: "Sanchar Nagar Extension, Kanadia Road, Indore M.P. 452016",
  googleMapsUrl: "https://maps.app.goo.gl/vhRYqg63chcGXLrr6", // optional: paste your Google Maps link

  // 🕐 Timings & languages
  hours: "Mon–Sat • 10 AM–2 PM & 5 PM–8 PM IST",
  hoursNote: "Evening + NRI-friendly online slots",
  languages: "Hindi • Marathi • English • Gujarati",

  // 🌐 Your live domain (used for SEO / social sharing)
  siteUrl: "https://ayurveddoctor.netlify.app/",

  // Social links (leave "" to hide)
  instagram: "www.instagram.com/ayurvedoctor",
  facebook: "",
  youtube: "",
};

/* -----------------------------------------------------------------------------
 * 2) HEADLINE NUMBERS / SOCIAL PROOF  👈 update with your real figures
 * -------------------------------------------------------------------------- */
export const STATS = {
  patientsTreated: 1000,       // "1000+ children guided"
  yearsExperience: 5,         // "5+ years"
  improvementPercent: 92,      // "92% parents report improvement"
  citiesServed: 40,            // "40+ cities online"
  rating: 4.9,                 // star rating shown in hero & footer
  reviewCount: 100,            // "100+ parent reviews"
  suvarnaprashanKids: 500,     // used in therapy copy
};

export const HERO_MINI_STATS = [
  { k: `${STATS.yearsExperience}+`, v: "Years in Balarog" },
  { k: `${STATS.improvementPercent}%`, v: "Parents see change*" },
  { k: "Online", v: "Consult worldwide" },
];

export const STAT_BAND = [
  { v: STATS.patientsTreated, suffix: "+", label: "Children guided", sub: "online + in-clinic" },
  { v: STATS.yearsExperience, suffix: "+", label: "Years in Balarog", sub: "MD Kaumarbhritya" },
  { v: STATS.improvementPercent, suffix: "%", label: "Parents report improvement*", sub: "in first 8–12 weeks" },
  { v: STATS.citiesServed, suffix: "+", label: "Cities served online", sub: "India + abroad (NRI)" },
];

/* =============================================================================
 * 🖼️  ALL IMAGES — swap every photo on the site from here
 * -----------------------------------------------------------------------------
 * HOW TO USE YOUR OWN PHOTO:
 *   1. Put your file in the  public/images/  folder
 *      e.g.  public/images/my-photo.jpg
 *   2. Reference it here starting with a slash:  "/images/my-photo.jpg"
 *      (do NOT write "public" in the path)
 *
 * Recommended sizes:
 *   doctorPortrait → portrait, approx 1000 x 1300px  (face in top half)
 *   clinicCare     → landscape/portrait, approx 1200 x 1400px
 *   therapy*       → landscape, approx 1200 x 800px
 *   parent avatars → square, approx 400 x 400px
 *
 * Keep files under ~400KB each for fast loading (use squoosh.app to compress).
 * ========================================================================== */
export const IMAGES = {
  // — Your photos (already in public/images/) ——————————————————————
  doctorPortrait: "/images/doctor.png", // big hero photo of the doctor
  clinicCare: "/images/clinic-care.png",         // consultation photo in "Meet the Doctor"

  // — Therapy showcase photos ————————————————————————————————
  therapySuvarnaprashan: "https://images.pexels.com/photos/7526061/pexels-photo-7526061.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  therapyAbhyanga: "https://images.pexels.com/photos/5889961/pexels-photo-5889961.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  therapyAhara: "https://images.pexels.com/photos/26774282/pexels-photo-26774282.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  therapyNidra: "https://images.pexels.com/photos/4457938/pexels-photo-4457938.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",

  // — Parent / testimonial avatars ————————————————————————————
  parent1: "https://images.pexels.com/photos/38624440/pexels-photo-38624440.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  parent2: "https://images.pexels.com/photos/38624436/pexels-photo-38624436.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  parent3: "https://images.pexels.com/photos/18689091/pexels-photo-18689091.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  parent4: "https://images.pexels.com/photos/7275701/pexels-photo-7275701.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  parent5: "https://images.pexels.com/photos/5528969/pexels-photo-5528969.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
  parent6: "https://images.pexels.com/photos/7515079/pexels-photo-7515079.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=400",
};

/* Small avatar row shown in the hero ("5k+ happy parents") */
export const AVATARS = [IMAGES.parent1, IMAGES.parent2, IMAGES.parent3, IMAGES.parent4];

/* -----------------------------------------------------------------------------
 * 3) NAVIGATION
 * -------------------------------------------------------------------------- */
export const NAV_LINKS = [
  { label: "Doctor", href: "#doctor" },
  { label: "Specialties", href: "#specialties" },
  { label: "Method", href: "#method" },
  { label: "Stories", href: "#stories" },
  { label: "Plans", href: "#plans" },
  { label: "FAQ", href: "#faq" },
];

/* -----------------------------------------------------------------------------
 * 4) CONDITIONS TICKER (scrolling pills under hero)
 * -------------------------------------------------------------------------- */
export const CONDITIONS = [
  { icon: Sparkles, label: "Eczema & Psoriasis" },
  { icon: Brain, label: "Speech Delay & ADHD" },
  { icon: TrendingUp, label: "Height & Weight Gain" },
  { icon: Wind, label: "Asthma & Recurrent Cold" },
  { icon: ShieldPlus, label: "Allergies & Immunity" },
  { icon: Milk, label: "Appetite & Digestion" },
  { icon: Baby, label: "Bedwetting & Constipation" },
  { icon: Leaf, label: "Suvarnaprashan Sanskar" },
];

/* -----------------------------------------------------------------------------
 * 5) SPECIALTIES (the 6 main cards)
 * -------------------------------------------------------------------------- */
export const SPECIALTIES = [
  {
    icon: Sparkles,
    tag: "Most loved",
    title: "Skin Diseases",
    subtitle: "Eczema • Psoriasis • Rashes • Fungal",
    desc: "Steroid-conscious Ayurvedic protocols that calm itching, heal the gut-skin axis and prevent the flare–suppress–flare cycle.",
    points: ["Atopic dermatitis & eczema", "Psoriasis & dry scaling", "Recurrent boils / fungal"],
    result: "Visible calm in 3–6 weeks*",
    gradient: "from-rose-500 to-orange-400",
    bg: "bg-rose-50",
  },
  {
    icon: Brain,
    tag: "Signature care",
    title: "Neurodevelopmental",
    subtitle: "Speech • Focus • Behaviour",
    desc: "Medhya Rasayana, diet, sleep & routine therapy supporting speech delay, ADHD traits, autism co-care & learning.",
    points: ["Speech & language delay", "Attention, hyperactivity", "Developmental support"],
    result: "Steady milestones, calmer days",
    gradient: "from-violet-600 to-indigo-400",
    bg: "bg-violet-50",
  },
  {
    icon: TrendingUp,
    tag: "High success",
    title: "Growth & Nutrition",
    subtitle: "Height • Weight • Appetite",
    desc: "Deepana–Pachana + Rasayana plans that kindle appetite, improve absorption and support healthy height-weight curves.",
    points: ["Poor appetite / picky eating", "Underweight / slow height", "Anemia & weakness"],
    result: "Better appetite in 2–4 weeks*",
    gradient: "from-emerald-600 to-teal-400",
    bg: "bg-emerald-50",
  },
  {
    icon: Wind,
    tag: "Recurrence control",
    title: "Respiratory Health",
    subtitle: "Asthma • Cold • Cough • Tonsils",
    desc: "Strengthen Pranavaha srotas & immunity so monthly colds, wheezing and tonsillitis visits finally reduce.",
    points: ["Recurrent cold-cough", "Allergic rhinitis, wheeze", "Tonsillitis & adenoids"],
    result: "Fewer sick days per month",
    gradient: "from-sky-600 to-cyan-400",
    bg: "bg-sky-50",
  },
  {
    icon: ShieldPlus,
    tag: "Immunity core",
    title: "Allergies & Immunity",
    subtitle: "Dust • Food • Frequent fevers",
    desc: "Ojas-building Suvarnaprashan + gut repair that lowers allergic tendency and builds resilient, year-round immunity.",
    points: ["Dust / food allergies", "Frequent fever, low Hb", "Post-antibiotic recovery"],
    result: "Stronger seasons, less medicine",
    gradient: "from-amber-500 to-yellow-400",
    bg: "bg-amber-50",
  },
  {
    icon: Apple,
    tag: "Modern kids",
    title: "Lifestyle Disorders",
    subtitle: "Obesity • Gut • Sleep • Screen",
    desc: "Practical, non-restrictive routines for childhood obesity, constipation, acidity, bedwetting & disturbed sleep.",
    points: ["Overweight / junk cravings", "Constipation, bedwetting", "Sleep & screen habits"],
    result: "Habits kids actually keep",
    gradient: "from-forest-700 to-emerald-400",
    bg: "bg-forest-50",
  },
];

/* -----------------------------------------------------------------------------
 * 6) TREATMENT METHOD (4 steps) & SIGNATURE THERAPIES
 * -------------------------------------------------------------------------- */
export const METHOD_STEPS = [
  {
    icon: ClipboardList, n: "01", title: "Deep Prakruti Assessment", time: "Day 1 • 45 min",
    desc: "45-min first visit: birth history, feeding, sleep, digestion, immunity timeline, growth charts & prior reports — nothing rushed.",
  },
  {
    icon: SearchCheck, n: "02", title: "Root-Cause Mapping", time: "Day 1–2",
    desc: "We identify the real driver — weak Agni, Ama (toxins), low Ojas, Vata aggravation or faulty routine — with clear explanation to parents.",
  },
  {
    icon: Leaf, n: "03", title: "Personalised BalChikitsa Plan", time: "Week 1 onwards",
    desc: "Child-safe herbs, tasty formulations, food chart, dinacharya, plus therapies like Abhyanga or Suvarnaprashan where needed.",
  },
  {
    icon: LineChart, n: "04", title: "Track, Tweak & Strengthen", time: "Every 2–4 weeks",
    desc: "Growth, sleep, stool, skin & school performance tracked. Doses tapered as your child strengthens — goal is independence, not lifelong medicine.",
  },
];

export const THERAPIES = [
  {
    icon: Droplets, name: "Suvarnaprashan Sanskar", tag: "Immunity + intellect",
    desc: `Classical gold-herb drops given on Pushya Nakshatra & monthly — for memory, immunity & graceful growth. ${STATS.suvarnaprashanKids}+ kids enrolled.`,
    img: IMAGES.therapySuvarnaprashan,
  },
  {
    icon: HandHeart, name: "Bal Abhyanga & Therapies", tag: "Growth + calm nerves",
    desc: "Gentle medicated oil massage, Shirodhara for teens, Nasya for sinus & Matra Basti guidance for chronic constipation.",
    img: IMAGES.therapyAbhyanga,
  },
  {
    icon: UtensilsCrossed, name: "Ahara (Food-as-Medicine)", tag: "Agni + appetite",
    desc: "Practical Indian kitchen charts — no exotic diets. Fixes picky eating, boosts weight & ends mealtime battles lovingly.",
    img: IMAGES.therapyAhara,
  },
  {
    icon: MoonStar, name: "Nidra & Dinacharya Reset", tag: "Sleep + behaviour",
    desc: "Screen, sleep & routine correction for hyperactivity, bedwetting, late sleep & morning crankiness — with parent coaching.",
    img: IMAGES.therapyNidra,
  },
];

/* -----------------------------------------------------------------------------
 * 7) BENEFITS & COMPARISON TABLE
 * -------------------------------------------------------------------------- */
export const BENEFITS = [
  { icon: ShieldCheck, title: "Fewer antibiotics & steroids", desc: "By fixing digestion & immunity, kids need rescue medicines far less often — winters become peaceful." },
  { icon: UtensilsCrossed, title: "Mealtimes without battles", desc: "Appetite kindles naturally. Parents get simple kitchen-based charts — no imported powders or force-feeding." },
  { icon: MoonStar, title: "Deeper sleep, calmer behaviour", desc: "Balanced Vata means easier bedtimes, less night waking, better focus at school and happier mornings." },
  { icon: TrendingUp, title: "Visible growth tracking", desc: "Height, weight, skin, stool & energy tracked every visit — you see progress in numbers, not just hope." },
  { icon: Baby, title: "Gentle, tasty & safe", desc: "Child-friendly doses, sweetened herbal syrups & oils. Everything explained — what, why & for how long." },
  { icon: HeartHandshake, title: "You get a parenting partner", desc: "WhatsApp support, diet doubts, school-tiffin ideas & seasonal care — I walk with you, not just prescribe." },
];

export const COMPARE = [
  { label: "Approach", quick: "Suppress symptom fast", ayur: "Heal root cause + strengthen" },
  { label: "Skin / allergy", quick: "Steroid cream every flare", ayur: "Gut-skin repair, fewer flares" },
  { label: "Cold / cough", quick: "Antibiotic each month", ayur: "Immunity so colds reduce" },
  { label: "Appetite", quick: "Force / supplements", ayur: "Kindle Agni, natural hunger" },
  { label: "Follow-up", quick: "5-min refill", ayur: "45-min deep review + coaching" },
];

/* -----------------------------------------------------------------------------
 * 8) TESTIMONIALS  👈 replace with your real patient stories (take consent!)
 * -------------------------------------------------------------------------- */
export const TESTIMONIALS = [
  {
    name: "Sneha Kulkarni",
    role: "Mother of Vihaan, 4 • Speech Delay",
    img: IMAGES.parent1,
    text: "Vihaan spoke only 10 words at 3.5 years. Dr. Priyanka's Medhya plan + diet + routine changed everything — in 4 months he speaks in small sentences and his eye contact is beautiful. She never rushed us, never scared us.",
    stars: 5,
    tag: "Speech & Development",
  },
  {
    name: "Rahul & Pooja Deshmukh",
    role: "Parents of Myra, 7 • Eczema",
    img: IMAGES.parent2,
    text: "Three dermatologists, countless steroid creams — rashes always returned. With Dr. Priyanka's gut-skin protocol, itching stopped in 3 weeks. Six months later, skin is clear and Myra sleeps through the night.",
    stars: 5,
    tag: "Skin Diseases",
  },
  {
    name: "Fatima Sheikh",
    role: "Mother of Mahira, 5 • Asthma-type Wheeze",
    img: IMAGES.parent3,
    text: "Every month meant nebulizer and sleepless nights. After Suvarnaprashan + immunity plan, this entire winter passed with just one mild cold. I cried with relief. Worth every rupee.",
    stars: 5,
    tag: "Respiratory",
  },
  {
    name: "Amit Patel",
    role: "Father of Diya, 9 • Poor Growth & Appetite",
    img: IMAGES.parent5,
    text: "Diya was underweight and lived on biscuits. Ma'am's food chart felt like home food, not a diet. In 3 months: +2.1 kg, asks for second roti herself, and her teacher noticed better concentration.",
    stars: 5,
    tag: "Growth & Nutrition",
  },
  {
    name: "Kavya Reddy",
    role: "Mother of Aditya, 6 • ADHD Traits",
    img: IMAGES.parent4,
    text: "Sitting tolerance was 2 minutes. Now he completes homework, sleeps by 9:30, and meltdowns reduced drastically. The dinacharya + Abhyanga routine was a game changer for our whole family.",
    stars: 5,
    tag: "Behaviour & Focus",
  },
  {
    name: "NRI Parent • Sri Lanka",
    role: "Mother of Kiaan, 3 • Recurrent Cold & Allergy",
    img: IMAGES.parent6,
    text: "Online consults felt as warm as in-person. Medicines couriered easily, WhatsApp follow-ups in our timezone. Kiaan's dust allergy and monthly fevers are finally under control after 1 year of struggle.",
    stars: 5,
    tag: "Allergy & Immunity (Online)",
  },
];

export const MINI_WINS = [
  { q: "Cold frequency: monthly → once in 4 months", n: "Aarav's mom • 5 yrs, immunity" },
  { q: "Height jumped from 10th → 35th percentile", n: "Ishaan's dad • 8 yrs, growth" },
  { q: "Constipation of 2 years resolved in 5 weeks", n: "Sara's mom • 6 yrs, gut health" },
];

export const FEATURED_QUOTE = {
  text: "My daughter's eczema patches reduced 80% in 2 months — without a single steroid course. But what I value more: she now eats, sleeps and plays like a different child.",
  name: "Mother of Aadhya, 6",
  detail: "Eczema + low appetite • Pune (Online)",
  img: IMAGES.parent1,
};

/* -----------------------------------------------------------------------------
 * 9) PRICING  👈 change prices / inclusions here
 * -------------------------------------------------------------------------- */
export const PLANS = [
  {
    id: "first",
    name: "First Consultation",
    hindi: "Pehli Mulakat",
    price: "₹400",
    strike: "₹500",
    usdPrice: "$75",
    usdStrike: "$100",
    period: "45-minute deep dive",
    desc: "Complete Prakruti & root-cause assessment + starter plan for one child.",
    features: [
      "45-min video / in-clinic session",
      "Prakruti, Agni & growth analysis",
      "Personalised herb + diet chart",
      "7-day WhatsApp doubt support",
      "Report & prescription summary",
    ],
    cta: "Book first visit",
    icon: Video,
    featured: false,
  },
  {
    id: "wellness",
    name: "Bal Wellness Program",
    hindi: "3-Month Transformation",
    price: "₹4,999",
    strike: "₹8,500",
    usdPrice: "$300",
    usdStrike: "$500",
    period: "Most chosen • 3 months",
    desc: "For skin, growth, immunity & developmental concerns needing steady hand-holding.",
    features: [
      "Everything in First Consultation",
      "6 follow-ups (every 2 weeks)",
      "Suvarnaprashan guidance included",
      "Monthly growth & symptom tracking",
      "Priority WhatsApp support",
      "Parent coaching: diet, sleep, routine",
    ],
    cta: "Start transformation",
    icon: Crown,
    featured: true,
  },
  {
    id: "followup",
    name: "Follow-up Care",
    hindi: "Review & Refine",
    price: "₹300",
    strike: "₹400",
    usdPrice: "$50",
    usdStrike: "$75",
    period: "20-minute review",
    desc: "For existing patients: dose tuning, progress review & next-phase planning.",
    features: [
      "20-min video / in-clinic review",
      "Progress & growth check",
      "Dose & diet adjustments",
      "Next milestone roadmap",
      "3-day WhatsApp support",
    ],
    cta: "Book follow-up",
    icon: Building2,
    featured: false,
  },
];

/* -----------------------------------------------------------------------------
 * 10) FAQs
 * -------------------------------------------------------------------------- */
export const FAQS = [
  {
    q: "Is Ayurveda safe for small children and babies?",
    a: "Yes — when prescribed by a qualified MD Kaumarbhritya specialist with correct pediatric dosing. I use only classical, child-safe formulations, gentle doses by age and weight, and food-based healing first. Anything unsuitable for children is strictly avoided, and I always tell you what each medicine is and why it's needed.",
  },
  {
    q: "My child already takes allopathic medicines. Can we combine?",
    a: "In most chronic cases, yes. Ayurveda works alongside ongoing treatment initially, and as your child stabilises, we coordinate tapering with your pediatrician — never abrupt stopping. For asthma, epilepsy or any critical illness, modern monitoring continues. Safety-first integration is my standard practice.",
  },
  {
    q: "How soon will we see results?",
    a: "Appetite, sleep and digestion often improve in 2–4 weeks. Skin, respiratory frequency, and growth curves typically show visible change in 6–12 weeks of consistent treatment. Neurodevelopmental support is a 3–6 month journey with milestone tracking. I'll give you an honest timeline in your first visit — no false promises.",
  },
  {
    q: "Do online consultations really work for kids?",
    a: `Absolutely — a majority of my patients consult online across ${STATS.citiesServed}+ cities and abroad. Video assessment, photos, growth charts, and detailed history give me everything needed. Medicines are couriered or sourced near you, and WhatsApp follow-ups keep us closely connected between visits.`,
  },
  {
    q: "What is Suvarnaprashan and should my child take it?",
    a: "Suvarnaprashan is a classical Ayurvedic immunisation-like Sanskar — gold-herb drops that support immunity, memory, digestion and graceful growth. It's given monthly (ideally on Pushya Nakshatra) to children from 6 months to 16 years. In your consultation I'll assess if and how it suits your child, or you can join our monthly Suvarnaprashan clinic directly.",
  },
  {
    q: "Will my picky eater follow the diet plan?",
    a: "That's exactly what I specialise in! Plans use your regular home kitchen — dal, rice, ghee, seasonal veggies — with tasty preparations kids accept. No exotic superfoods, no starvation, no force-feeding. Most parents report mealtime battles reducing within 2–3 weeks.",
  },
  {
    q: "What happens after I fill the enquiry form?",
    a: "You get an instant confirmation, and my clinic personally calls/WhatsApps you within 24 hours (usually same day) to understand urgency, share available slots and guide reports if needed. Your details go directly to my email and secure clinic records — never shared or spammed.",
  },
  {
    q: "What are clinic timings and languages?",
    a: `${SITE.hours}. Online slots include evening options for working parents and NRI-friendly times on request. I consult in ${SITE.languages} — explain everything in the language you're most comfortable with.`,
  },
];

/* -----------------------------------------------------------------------------
 * 11) ENQUIRY FORM OPTIONS
 * -------------------------------------------------------------------------- */
export const CONCERNS = [
  { v: "skin", label: "Skin — eczema, psoriasis, rashes" },
  { v: "neurodevelopmental", label: "Development — speech, focus, behaviour" },
  { v: "growth", label: "Growth — height, weight, appetite" },
  { v: "respiratory", label: "Respiratory — asthma, cold, cough" },
  { v: "allergy_immunity", label: "Allergy & low immunity" },
  { v: "lifestyle", label: "Lifestyle — obesity, gut, sleep" },
  { v: "general", label: "General wellness / Suvarnaprashan" },
  { v: "other", label: "Other concern" },
];

// NOTE: Booking dropdown labels are built automatically from PLANS prices above
// (plus the visitor's language + INR/USD region). To change a price, edit ONLY
// `price` / `usdPrice` in PLANS — no need to touch anything below.
export const PLAN_OPTIONS: Record<string, string> = {
  first: "First Consultation — ₹400",
  wellness: "Bal Wellness Program (3 months) — ₹4,999",
  followup: "Follow-up Care — ₹300",
  suvarna: "Suvarnaprashan Only",
  unsure: "Not sure — need guidance",
};

export const PLAN_OPTIONS_USD: Record<string, string> = {
  first: "First Consultation — $75",
  wellness: "Bal Wellness Program (3 months) — $300",
  followup: "Follow-up Care — $50",
  suvarna: "Suvarnaprashan Only",
  unsure: "Not sure — need guidance",
};

/* Helper links */
export const waLink = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`;
export const telLink = `tel:${SITE.phoneHref}`;
export const mailLink = `mailto:${SITE.email}`;
