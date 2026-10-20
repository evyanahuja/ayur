/* Condition library — part 1 of 2. Each entry renders at /conditions/<slug>/.
   Content is educational, conservative, and flags referral clearly.
   Hinglish phrases are woven into FAQs/intros for natural search matching. */

export interface ConditionFAQ { q: string; a: string }
export interface ConditionPage {
  slug: string;
  title: string; // short nav label
  h1: string;
  seoTitle: string;
  seoDescription: string;
  category: "Development & Behaviour" | "Neurological" | "Growth & Nutrition" | "Respiratory & Immunity" | "Digestion & Gut" | "Sleep & Habits";
  intro: string;
  whatIs: string[];
  signs: string[];
  ageNotes?: string[];
  causes: string[];
  whenToAssess: string[];
  diagnosis: string[];
  management: string[];
  homeCare: string[];
  redFlags: string[];
  ayurvedaRole: string[];
  ayurvedaLimits: string[];
  faqs: ConditionFAQ[];
  hinglish: string[];
  references: { label: string; publisher: string }[];
  relatedConditions: string[];
  relatedTreatments: string[];
  relatedArticles: string[];
}

export const CONDITIONS_1: ConditionPage[] = [
  {
    slug: "adhd-in-children",
    title: "ADHD in Children",
    h1: "ADHD in Children: Signs, Assessment & Support",
    seoTitle: "ADHD in Children: Symptoms, Diagnosis & Support | Indore",
    seoDescription: "Understand ADHD symptoms by age, how assessment works, treatment options and home support. Ayurvedic co-care in Indore + online. Medically reviewed.",
    category: "Development & Behaviour",
    intro: "Attention-deficit/hyperactivity disorder (ADHD) is one of the most common neurodevelopmental conditions of childhood. Children with ADHD are not naughty or lazy — their brains regulate attention, activity and impulses differently. With the right assessment, school support and home strategies, most children do very well. In Indore, parents often search for Bachchon mein ADHD ke lakshan — this guide covers symptoms by age, when to seek assessment, and what genuinely helps.",
    whatIs: [
      "ADHD is a persistent pattern of inattention, hyperactivity and impulsivity that interferes with daily functioning or development.",
      "Symptoms must be present before age 12, occur in more than one setting (for example home and school), and be clearly beyond what is typical for the child's age.",
      "There are three presentations: predominantly inattentive, predominantly hyperactive-impulsive, and combined. Presentation can change as a child grows.",
    ],
    signs: [
      "Difficulty sustaining attention in tasks or play; easily distracted",
      "Does not seem to listen, loses things, forgets daily routines",
      "Fidgets, leaves seat, runs or climbs excessively for the age",
      "Talks excessively, blurts answers, struggles to wait for a turn",
      "School complaints about incomplete work despite normal intelligence",
    ],
    ageNotes: [
      "Preschool (3–5): high activity is normal at this age; ADHD is considered only when behaviour is extreme, persistent and impairs play or preschool participation.",
      "Primary school (6–11): inattention becomes visible as academic demands rise — careless mistakes, disorganisation, avoiding sustained mental effort.",
      "Adolescents (12+): hyperactivity often becomes inner restlessness; issues shift to time management, emotional outbursts and academic inconsistency.",
    ],
    causes: [
      "Strong genetic influence — ADHD runs in families",
      "Prematurity, low birth weight and prenatal exposures increase likelihood",
      "Differences in brain maturation and dopamine/norepinephrine regulation",
      "Poor sleep, excess screen time and chronic stress worsen symptoms but do not alone cause ADHD",
    ],
    whenToAssess: [
      "Teacher repeatedly reports inattention or disruption over months, not days",
      "Child is falling behind academically despite effort and normal ability",
      "Behaviour strains family life, friendships or self-esteem",
      "You suspect hearing, vision, sleep apnoea, anxiety or learning difficulty may be contributing",
    ],
    diagnosis: [
      "Diagnosis is clinical — detailed history from parents and teachers plus structured rating scales (e.g. Vanderbilt, Conners).",
      "There is no blood test or brain scan that diagnoses ADHD; tests are used to rule out mimics such as thyroid issues, anaemia or sleep disorders.",
      "Assessment should be done by a paediatrician, developmental paediatrician, child psychiatrist or experienced multidisciplinary team.",
    ],
    management: [
      "Parent behaviour training is first-line for young children and the foundation at every age.",
      "School accommodations: seating, chunked instructions, movement breaks, extra time where appropriate.",
      "Medication (stimulant or non-stimulant) is considered when symptoms significantly impair functioning, prescribed and monitored by a qualified doctor.",
      "Sleep hygiene, regular exercise, limited recreational screen time and predictable routines support every other intervention.",
      "Complementary approaches such as yoga, structured outdoor play and mindfulness have modest supportive evidence.",
    ],
    homeCare: [
      "One instruction at a time, with eye contact; use visual checklists and timers",
      "Fixed sleep and wake times — even 30 extra minutes of sleep improves daytime attention",
      "Protein-rich breakfast, regular meals, and iron/vitamin-D checked if diet is poor",
      "Daily vigorous play before homework; homework in short bursts with movement breaks",
      "Praise effort and systems ('you used your checklist') rather than only outcomes",
    ],
    redFlags: [
      "Sudden change in behaviour, new tics, or loss of previously gained skills — seek prompt assessment",
      "Self-harm talk, extreme aggression, or complete school refusal needs urgent professional help",
      "Seizures, severe headaches, or developmental regression are not ADHD — see a paediatrician promptly",
    ],
    ayurvedaRole: [
      "Classical Medhya Rasayana herbs (such as Brahmi, Shankhpushpi, Mandukaparni, Ashwagandha) are traditionally used to support memory, calm and sleep — only after individual assessment of age, digestion and constitution.",
      "Dinacharya (daily routine), Nidra (sleep) correction and Abhyanga (oil massage) help regulate Vata, which maps closely to restlessness and poor sleep.",
      "Diet review focuses on Agni: regular warm meals, reduced junk load, and correction of constipation — common aggravators of irritability.",
    ],
    ayurvedaLimits: [
      "Ayurveda does not cure ADHD and does not replace behavioural therapy, school support, or medication when a qualified doctor has prescribed it.",
      "Never stop prescribed ADHD medication to try herbs; any change must be supervised by the prescribing doctor.",
      "Herbal products must be age-dosed, quality-verified and free of heavy metals — avoid unlabelled powders from unknown sources.",
    ],
    faqs: [
      { q: "Bachchon mein ADHD ke lakshan kya hain?", a: "Lagataar dhyaan na lagna, bahut zyada hilna-dulna, baat kaatna, cheezen bhulna aur school mein kaam adhura chhodna — ye lakshan 6 mahine se zyada, ghar aur school dono jagah dikhen to assessment karana chahiye. Sirf shararat ADHD nahi hoti." },
      { q: "Can diet cure ADHD?", a: "No single diet cures ADHD. Regular meals, adequate sleep, iron sufficiency and reduced ultra-processed food support attention, but they complement — not replace — assessment and behavioural support." },
      { q: "Is ADHD overdiagnosed?", a: "Both over- and under-diagnosis happen. That is why proper assessment uses parent + teacher ratings over time and rules out sleep, vision, hearing, thyroid and learning issues before concluding ADHD." },
      { q: "Do Ayurvedic medicines help with focus?", a: "Medhya herbs are traditionally used to support calm, memory and sleep, and some small studies are encouraging. Evidence is preliminary, so they are best used as supervised co-care alongside established management, not as a standalone cure." },
    ],
    hinglish: ["Bachchon mein ADHD ke lakshan", "Bachcha padhai me dhyan nahi deta", "hyperactivity ka ilaj"],
    references: [
      { label: "ADHD clinical practice guideline", publisher: "American Academy of Pediatrics" },
      { label: "Attention deficit hyperactivity disorder — NICE guideline NG87", publisher: "NICE (UK)" },
      { label: "ADHD information for families", publisher: "CDC — Attention-Deficit / Hyperactivity Disorder" },
    ],
    relatedConditions: ["hyperactivity-attention-difficulties", "learning-difficulties", "speech-delay-in-children", "sleep-problems-children"],
    relatedTreatments: ["ayurvedic-consultation", "abhyanga", "shirodhara"],
    relatedArticles: ["sleep-routine-children", "screen-time-children-ayurveda", "iron-deficiency-children"],
  },
  {
    slug: "adhd-symptoms-by-age",
    title: "ADHD Symptoms by Age",
    h1: "ADHD Symptoms by Age: Toddler to Teen",
    seoTitle: "ADHD Symptoms by Age (3–17): Parent Guide | Indore",
    seoDescription: "How ADHD looks different at 3, 7, 12 and 16. Age-wise symptom guide with examples, plus when assessment is needed. Reviewed by an Ayurvedic doctor.",
    category: "Development & Behaviour",
    intro: "The same condition looks very different at different ages — a hyperactive 4-year-old, a dreamy 8-year-old and a disorganised 15-year-old may all have ADHD. This page maps typical symptoms by age so parents can judge what is developmental and what deserves assessment.",
    whatIs: [
      "ADHD symptoms shift with brain maturation and environmental demands: hyperactivity is most visible in young children, inattention dominates school years, and executive-function struggles dominate adolescence.",
      "This page is a companion to the main ADHD guide — read that first for causes, assessment and treatment.",
    ],
    signs: [
      "Age 3–5: constant motion, dangerous climbing, cannot finish even a short story or puzzle",
      "Age 6–8: careless mistakes, losing belongings, interrupting class",
      "Age 9–12: disorganised bag/desk, last-minute homework, emotional meltdowns over small issues",
      "Age 13–17: procrastination, messy room and schedule, risky impulsivity, inconsistent grades",
    ],
    ageNotes: [
      "Under 4: ADHD is rarely diagnosed; very high activity at this age is usually normal temperament. Assessment focuses on ruling out other causes.",
      "6–12: peak detection years, because school exposes inattention clearly.",
      "Teens: ask about sleep, mood and substance use too — these overlap heavily with attention problems.",
    ],
    causes: ["Same as ADHD overall — see the main ADHD in Children guide for causes and risk factors."],
    whenToAssess: [
      "Symptoms persist 6+ months across home and school",
      "Functioning is clearly affected: grades, friendships, family life or safety",
      "Behaviour is markedly different from same-age peers, not just 'lively'",
    ],
    diagnosis: [
      "Uses the same multi-informant assessment as ADHD: parent + teacher rating scales matched to age norms.",
      "Norms matter: a behaviour normal at 4 (short attention span) is a symptom at 10.",
    ],
    management: [
      "Match the intervention to the age: play-based parent training for preschoolers, organisational coaching for pre-teens, collaborative planning for teens.",
      "Reassess yearly — presentations and needs change as the child matures.",
    ],
    homeCare: [
      "Preschoolers: childproof the environment, keep instructions to 3 words, reward calm play",
      "Primary years: homework station, timers, movement breaks every 20 minutes",
      "Teens: shared calendars, negotiated screen curfews, chunked projects with check-ins",
    ],
    redFlags: [
      "Regression, seizures, severe aggression or self-harm are never 'just ADHD by age' — seek urgent care",
    ],
    ayurvedaRole: [
      "Age-appropriate routine (Dinacharya) and sleep correction are emphasised at every age; oil massage (Abhyanga) suits restless younger children, while teens benefit more from sleep and screen discipline plus supervised Medhya support.",
    ],
    ayurvedaLimits: [
      "Age-wise symptom tracking does not change the core limit: Ayurveda supports but does not replace behavioural and educational management of ADHD.",
    ],
    faqs: [
      { q: "My 4-year-old never sits still. Is it ADHD?", a: "Probably not — most 4-year-olds are highly active. ADHD at this age is considered only when behaviour is extreme, unsafe, and impairs preschool participation over many months." },
      { q: "Can a quiet, dreamy child have ADHD?", a: "Yes. The inattentive presentation is common in girls and often missed — daydreaming, slow work, losing things and seeming 'in another world' are classic signs." },
      { q: "Does ADHD get better with age?", a: "Hyperactivity usually lessens; inattention and disorganisation often persist into adulthood in some form. Early skills and support make the biggest difference to outcomes." },
    ],
    hinglish: ["Bachcha baat nahi sunta", "padhai me man nahi lagta umar ke hisab se"],
    references: [
      { label: "ADHD across the lifespan", publisher: "American Academy of Pediatrics" },
      { label: "ADHD symptoms and diagnosis", publisher: "CDC" },
    ],
    relatedConditions: ["adhd-in-children", "adhd-assessment-diagnosis", "hyperactivity-attention-difficulties"],
    relatedTreatments: ["ayurvedic-consultation", "abhyanga"],
    relatedArticles: ["sleep-routine-children", "screen-time-children-ayurveda"],
  },
  {
    slug: "adhd-assessment-diagnosis",
    title: "ADHD Assessment & Diagnosis",
    h1: "ADHD Assessment & Diagnosis: What Actually Happens",
    seoTitle: "ADHD Assessment & Diagnosis Process in India | Parent Guide",
    seoDescription: "Step-by-step ADHD assessment: history, rating scales, rule-outs, report and next steps. What to carry, costs and timelines in India.",
    category: "Development & Behaviour",
    intro: "Parents often delay assessment because they don't know what it involves. In reality it is a structured conversation plus questionnaires — no painful tests, no machines. This page walks through each step so you arrive prepared.",
    whatIs: [
      "ADHD assessment is a clinical process that collects behaviour information from multiple sources, compares it to age norms, and rules out lookalike conditions.",
      "A good assessment takes 1–3 sessions and always includes teacher/daycare input, not just a 10-minute chat.",
    ],
    signs: ["(See ADHD in Children for symptom checklists — this page covers the process.)"],
    causes: ["Not applicable — this is a process guide, not a causation article."],
    whenToAssess: ["Book when symptoms persist 6+ months in 2+ settings and impair school, home life or safety."],
    diagnosis: [
      "Step 1 — Developmental, medical, sleep, school and family history; vision/hearing/sleep screening.",
      "Step 2 — Standardised rating scales (Vanderbilt / Conners / CBCL) completed by parents AND teachers.",
      "Step 3 — Rule-outs: anaemia, thyroid, sleep apnoea, learning disability, anxiety, trauma, excess screen use.",
      "Step 4 — Feedback session: diagnosis (or not), severity, strengths, written plan for home + school.",
      "Carry: report cards, teacher notes, prior prescriptions, birth and milestone history.",
    ],
    management: ["If diagnosed: parent training + school plan first; medication discussed only if impairment is significant, by a qualified doctor. If not diagnosed: the rule-out findings usually point to the real issue (e.g. sleep, vision, anxiety) and its own plan."],
    homeCare: ["Before the appointment, keep a 2-week diary: sleep times, screen hours, homework battles, teacher remarks. It makes the assessment far more accurate."],
    redFlags: ["Assessment should be expedited if there is self-harm, severe aggression, school refusal, or sudden regression."],
    ayurvedaRole: ["An Ayurvedic consultation can run in parallel to assess sleep, digestion, constitution and routine — useful context whatever the assessment concludes. It does not itself diagnose ADHD."],
    ayurvedaLimits: ["ADHD diagnosis must come from a qualified paediatric/developmental/psychiatric assessment using validated scales — not from pulse diagnosis, Prakriti analysis or any single test."],
    faqs: [
      { q: "How much does ADHD assessment cost in India?", a: "It varies widely — typically a few thousand rupees across 1–3 sessions in private clinics; government medical college OPDs and DMHP services charge far less. Ask upfront what is included (scales, report, school letter)." },
      { q: "Will my child be labelled?", a: "A diagnosis is a private medical record shared only with people you choose. Schools usually need only the accommodation letter, not the full report. The bigger risk is usually missing support, not the label itself." },
      { q: "Can ADHD be diagnosed online?", a: "Screening can start online, but a robust diagnosis needs teacher scales and ideally in-person observation. Be cautious of instant diagnoses from a single short video call." },
    ],
    hinglish: ["ADHD test kaise hota hai", "bachche ka assessment kahan karaye Indore"],
    references: [
      { label: "ADHD diagnosis and treatment", publisher: "American Academy of Pediatrics" },
      { label: "Developmental assessment guidance", publisher: "Indian Academy of Pediatrics (IAP)" },
    ],
    relatedConditions: ["adhd-in-children", "adhd-treatment-parent-support", "learning-difficulties"],
    relatedTreatments: ["ayurvedic-consultation", "online-ayurvedic-consultation"],
    relatedArticles: ["school-readiness-checklist", "sleep-routine-children"],
  },
  {
    slug: "adhd-treatment-parent-support",
    title: "ADHD Treatment & Parent Support",
    h1: "ADHD Treatment Options & Parent Support That Works",
    seoTitle: "ADHD Treatment Options & Parent Support Guide | Indore Doctor",
    seoDescription: "Behaviour therapy, school support, medication facts, daily routines and Ayurvedic co-care for ADHD. Practical, honest parent guide.",
    category: "Development & Behaviour",
    intro: "There is no single cure for ADHD — but there is a well-tested combination that works: skilled parenting strategies, school cooperation, healthy routines, and medication for those who need it. This page puts every option on the table honestly, including what Ayurveda can and cannot add.",
    whatIs: ["ADHD management is multimodal: behaviour + environment + (sometimes) medication + routine support. The mix is personalised to age, severity and family context."],
    signs: ["Revisit the ADHD Symptoms by Age page if you are unsure which behaviours need targeting first."],
    causes: ["Treatment does not depend on finding one cause — it targets the attention/impulse pathways whatever their origin."],
    whenToAssess: ["If you have not had a formal assessment yet, get one before starting any sustained treatment — targeting the wrong condition wastes months."],
    diagnosis: ["Treatment plans should be reviewed every 3–6 months against concrete goals (homework completion, sleep, teacher ratings), not vague impressions."],
    management: [
      "Parent behaviour training (8–12 sessions): commands, rewards, consequences, homework systems — the highest-evidence intervention for young children.",
      "School plan: seating near teacher, chunked work, movement breaks, home-school diary.",
      "Medication: stimulants (methylphenidate) and non-stimulants (atomoxetine etc.) — effective for many, prescribed only by qualified doctors with monitoring for appetite, sleep, growth and mood.",
      "CBT-based skills for older children/teens: organisation, time management, emotional regulation.",
      "Exercise (especially morning/outdoor), consistent sleep, and omega-adequate diet as universal supports.",
    ],
    homeCare: [
      "Pick ONE target behaviour per fortnight; track it on a visible chart",
      "Morning checklist (laminated) beats repeated shouting",
      "Homework: same place, same time, timer-visible, breaks earned",
      "Screens off 60–90 minutes before bed; charge devices outside the bedroom",
      "Parents need support too — consider a parent group; burnout undermines consistency",
    ],
    redFlags: ["Medication side effects (severe appetite loss, tics, mood crash, chest pain) need prompt review by the prescriber — do not stop or adjust doses on your own."],
    ayurvedaRole: [
      "Supervised Medhya Rasayana may support calm, sleep and memory as co-care.",
      "Abhyanga and sleep-routine correction directly target the restlessness–poor-sleep loop many ADHD families report.",
      "Shirodhara is occasionally used for restless adolescents in classical practice — only after individual assessment, and evidence is preliminary.",
    ],
    ayurvedaLimits: [
      "No herb replaces behaviour training or, where prescribed, medication. Claims of 'curing ADHD in X weeks with ayurveda' are misleading.",
      "Check interactions: herbs + stimulants together must be supervised by doctors who know about both.",
    ],
    faqs: [
      { q: "Are ADHD medicines safe long-term?", a: "Stimulants have decades of safety data when prescribed and monitored properly — appetite, sleep, height/weight and mood are tracked. The decision is always benefit-vs-impairment for that child, reviewed regularly." },
      { q: "My child eats a lot of sugar. Is that the cause?", a: "Sugar does not cause ADHD, though heavy sugary/junk intake worsens energy crashes and sleep. Fixing meals helps behaviour, but it is not a standalone treatment." },
      { q: "How long before we see improvement?", a: "Behaviour strategies: 3–6 weeks of consistent use. Medication (if started): often within days, with dose tuning over weeks. Judge by tracked goals, not feelings." },
    ],
    hinglish: ["ADHD ka ilaj kya hai", "bina dawai hyperactivity kam kaise kare"],
    references: [
      { label: "ADHD treatment recommendations", publisher: "American Academy of Pediatrics" },
      { label: "NICE guideline NG87 — management", publisher: "NICE (UK)" },
    ],
    relatedConditions: ["adhd-in-children", "adhd-assessment-diagnosis", "hyperactivity-attention-difficulties", "sleep-problems-children"],
    relatedTreatments: ["ayurvedic-consultation", "shirodhara", "abhyanga"],
    relatedArticles: ["sleep-routine-children", "screen-time-children-ayurveda"],
  },
  {
    slug: "cerebral-palsy",
    title: "Cerebral Palsy",
    h1: "Cerebral Palsy in Children: A Parent's Complete Guide",
    seoTitle: "Cerebral Palsy in Children: Types, Signs & Care | Indore",
    seoDescription: "What cerebral palsy is, early signs, types, diagnosis and rehabilitation. Supportive Ayurvedic co-care explained honestly. Reviewed guide for parents.",
    category: "Neurological",
    intro: "Cerebral palsy (CP) is the most common motor disability of childhood — a group of permanent but non-progressive movement and posture conditions caused by injury to the developing brain. 'Non-progressive' is the hopeful word: the brain injury does not worsen, and with early therapy, supportive care and family training, children's function usually improves substantially. Parents searching cerebral palsy kya hai will find a clear, honest overview here.",
    whatIs: [
      "CP results from injury or abnormal development of the immature brain — before, during, or shortly after birth.",
      "It primarily affects movement, muscle tone and posture; some children also have epilepsy, intellectual, vision, hearing or feeding difficulties.",
      "Severity ranges enormously: from a child who walks with a slight limp to a child who needs full-time support. The GMFCS scale (levels I–V) describes gross motor function.",
    ],
    signs: [
      "Stiff or floppy muscle tone; favouring one side of the body",
      "Delayed milestones: late head control, sitting, crawling or walking",
      "Difficulty with feeding, swallowing or drooling beyond expected ages",
      "Unusual postures, scissoring legs, or persistent primitive reflexes",
      "Seizures or learning difficulties in some children",
    ],
    ageNotes: [
      "Infancy: high-risk babies (premature, low birth weight, birth asphyxia, neonatal seizures) need structured follow-up even before signs appear.",
      "6–18 months: the usual window when delays become clear; this is the highest-value window for starting therapy.",
      "School age: focus shifts to schooling, communication aids, orthopaedic monitoring (hips/spine) and independence skills.",
    ],
    causes: [
      "Prematurity and low birth weight (strongest risk factors)",
      "Birth asphyxia / hypoxic-ischaemic injury",
      "Neonatal infections (meningitis), severe jaundice (kernicterus), intracranial bleeding",
      "Prenatal stroke, brain malformations, maternal infections",
      "In many cases no single cause is ever identified",
    ],
    whenToAssess: [
      "Any missed motor milestone by the expected age, especially with abnormal tone",
      "Strong hand preference before 12 months (suggests one-sided weakness)",
      "Feeding/swallowing difficulty, frequent aspiration or poor weight gain",
      "Any high-risk newborn — do not 'wait and watch' beyond scheduled follow-ups",
    ],
    diagnosis: [
      "Clinical + MRI brain (shows the injury pattern in most cases); GMA (General Movements Assessment) and HINE score enable very early detection in infants.",
      "Additional checks: vision, hearing, epilepsy (EEG if seizures), hip surveillance X-rays, feeding/nutrition review.",
      "Diagnosis is usually confirmed by a paediatric neurologist or developmental paediatrician with a therapy team.",
    ],
    management: [
      "Physiotherapy is the cornerstone — goal-directed, intensive, family-delivered practice matters more than clinic visits alone.",
      "Occupational therapy (daily skills), speech/feeding therapy, orthotics (AFOs), and assistive devices as needed.",
      "Medications for spasticity (baclofen), dystonia, drooling, epilepsy — prescribed by specialists.",
      "Orthopaedic monitoring; selective procedures (botulinum toxin, orthopaedic surgery) for specific indications.",
      "Early intervention + special education support for associated learning needs.",
    ],
    homeCare: [
      "Do the home exercise programme daily — short, frequent practice beats occasional long sessions",
      "Positioning: supported sitting, tummy time (infants), night positioning as advised",
      "Feeding: upright posture, small boluses, thickened feeds if aspiration-prone; track weight monthly",
      "Play that encourages the weaker side; celebrate small gains visibly",
      "Connect with parent groups and government disability benefits (UDID card, schemes)",
    ],
    redFlags: [
      "Loss of previously acquired skills is NOT typical CP — needs urgent re-evaluation",
      "New seizures, breathing difficulty during feeds, or rapid scoliosis progression need prompt care",
      "Signs of hip pain, pressure sores or severe constipation in non-ambulant children need timely review",
    ],
    ayurvedaRole: [
      "Classical Vata-pacifying care — gentle Abhyanga with medicated oils, Shashtika Shali Pinda Sweda in older children, and Rasayana support — is traditionally used alongside physiotherapy to support muscle suppleness, digestion, sleep and general strength.",
      "Some families report better sleep, appetite and therapy tolerance with supervised co-care. This is supportive, and should be coordinated with the neurology/therapy team.",
    ],
    ayurvedaLimits: [
      "Ayurveda does not repair the brain injury of CP and does not replace physiotherapy, orthotics, anti-epileptics or orthopaedic care. Any claim of 'curing CP' is false and dangerous.",
      "Panchakarma procedures in children with CP (especially non-ambulant or epileptic children) need careful individual assessment — not every therapy suits every child.",
      "Never stop anti-seizure medication for herbal alternatives.",
    ],
    faqs: [
      { q: "Cerebral palsy kya hai? Kya ye theek ho sakta hai?", a: "CP dimaag ki shuruati chot se hone wali movement ki sthiti hai. Chot theek nahi hoti, lekin therapy se function me bahut sudhaar hota hai. 'Cure' ka daava karne walon se savdhaan rahen — sahi lakshya hai adhiktam swatantrata." },
      { q: "Will my child walk?", a: "It depends on the type and severity (GMFCS level), age therapy started, and associated issues. Your physiotherapist and neurologist can give a realistic range after assessment — most children improve significantly from their starting point." },
      { q: "Does physiotherapy really help, or should we try alternatives first?", a: "Physiotherapy is the single highest-evidence intervention in CP. Start it immediately and continue it; anything else (including Ayurvedic co-care) is added alongside, never instead." },
    ],
    hinglish: ["Cerebral palsy kya hai", "Bachcha der se baithta hai", "pairon me akdan bachcha"],
    references: [
      { label: "Cerebral palsy — clinical guidance", publisher: "American Academy for Cerebral Palsy and Developmental Medicine" },
      { label: "Early diagnosis and intervention for CP", publisher: "JAMA Pediatrics (Novak et al.)" },
      { label: "Cerebral palsy information", publisher: "CDC" },
    ],
    relatedConditions: ["early-signs-cerebral-palsy", "types-of-cerebral-palsy", "cp-diagnosis-early-intervention", "cp-rehabilitation-supportive-care", "delayed-walking-children"],
    relatedTreatments: ["abhyanga", "ayurvedic-consultation", "panchakarma"],
    relatedArticles: ["physiotherapy-at-home-cp", "feeding-difficulties-children"],
  },
  {
    slug: "speech-delay-in-children",
    title: "Speech Delay",
    h1: "Speech Delay in Children (Bachcha Der Se Bolta Hai)",
    seoTitle: "Speech Delay in Children: Causes & What To Do | Indore Doctor",
    seoDescription: "Late talking? Milestones by age, red flags, hearing checks, therapy and home language tips. Ayurvedic support explained. Parent guide, Indore + online.",
    category: "Development & Behaviour",
    intro: "Bachcha der se bolta hai — it is one of the most common worries parents bring to clinic. Some late talkers catch up on their own; others need structured help, and earlier help works better. This guide gives you milestones, the checks that matter (hearing first, always), and a practical home plan.",
    whatIs: [
      "Speech-language delay means a child's spoken communication is significantly behind age expectations — fewer words, no word combinations, or unclear speech.",
      "It is a symptom with many possible causes, not a single diagnosis: hearing loss, tongue-tie (sometimes), developmental language disorder, autism spectrum, global delay, or simply late blooming.",
      "Understanding (receptive language) matters as much as speaking: a child who understands well but speaks little has a different outlook than one who neither understands nor speaks.",
    ],
    signs: [
      "By 12 months: no babbling with consonants, no pointing or gestures",
      "By 18 months: fewer than ~10 words, no pointing to show interest",
      "By 2 years: no two-word phrases ('mama paani'); vocabulary under ~50 words",
      "By 3 years: strangers understand little; no short sentences or questions",
      "Any age: loss of words previously used (regression)",
    ],
    ageNotes: [
      "12–18 months: focus on hearing + interaction; bilingual homes do NOT cause delay (myth).",
      "2–3 years: the key decision window — assessment now, not 'wait till 4'.",
      "3+: persistent unclarity, stammering beyond 6 months, or social-communication gaps need structured evaluation.",
    ],
    causes: [
      "Hearing loss (even mild/fluctuating, e.g. glue ear) — rule out first, always",
      "Developmental language disorder, autism spectrum features, global developmental delay",
      "Chronic mouth-breathing/adenoid issues and poor sleep affecting learning",
      "Very high screen time replacing interactive talk (association, not sole cause)",
      "Iron deficiency and poor nutrition as aggravating factors",
    ],
    whenToAssess: [
      "Any red-flag milestone miss above, or parental gut feeling that something is off (parents are usually right)",
      "Regression at any age, or no response to name by 12 months",
      "Hearing doubt, frequent ear infections, or constant mouth breathing",
    ],
    diagnosis: [
      "Step 1: hearing test (BERA/OAE + audiometry as age-appropriate) — non-negotiable.",
      "Step 2: speech-language evaluation + developmental screening (social, play, understanding).",
      "Step 3: paediatric review for anaemia, thyroid (selective), oral-motor exam, and referral for autism/global-delay workup if indicated.",
    ],
    management: [
      "Speech therapy: parent-coached, play-based, frequent short practice at home beats weekly clinic-only sessions.",
      "Treat the cause: grommets/hearing aids if hearing loss; ENT care for chronic adenotonsillar disease.",
      "Preschool placement with language-rich interaction; limit passive screen time, co-view when used.",
      "For autism/global delay: multidisciplinary early intervention, not speech therapy alone.",
    ],
    homeCare: [
      "Narrate everything ('mama roti bana rahi hai'), get face-to-face at the child's level",
      "Choices not questions: 'doodh ya paani?' forces a word attempt",
      "Expand: child says 'gaadi' → you say 'haan, laal gaadi chal rahi hai'",
      "15 minutes of floor play daily with zero screens; songs with actions and picture books",
      "Track new words weekly in a notebook — progress motivates consistency",
    ],
    redFlags: [
      "Loss of speech or social skills — urgent evaluation",
      "No babbling by 12 months, no words by 18 months, no phrases by 2 years",
      "No eye contact, no pointing to share interest, or extreme sensory behaviours — assess for autism promptly",
    ],
    ayurvedaRole: [
      "Medhya Rasayana (Brahmi, Shankhpushpi, Vacha — classical, age-dosed, quality-verified) is traditionally used to support speech, memory and learning alongside therapy.",
      "Correction of Agni, sleep and constipation; Nasya is described classically for head/neck channels but only in suitable older children after assessment — never force procedures on toddlers.",
    ],
    ayurvedaLimits: [
      "No oil, herb or procedure 'makes a child speak' on its own. Speech emerges from hearing + interaction + therapy; Ayurveda supports the foundation.",
      "Delaying hearing tests or therapy for months to 'try ayurveda first' harms outcomes — run them together from the start.",
    ],
    faqs: [
      { q: "Bachcha der se bolta hai — kab tak wait karein?", a: "18 mahine tak 10 shabd bhi nahi, ya 2 saal tak 2-shabd ke vakya nahi, to hearing test + speech evaluation kara lein. 'Ladke der se bolte hain' kehkar 3-4 saal wait karna nuksaan karta hai." },
      { q: "Do two languages at home delay speech?", a: "No. Bilingual children may mix languages briefly but reach milestones on time. Speak in whatever language you are fluent and interactive in." },
      { q: "Will tongue-tie surgery fix speech delay?", a: "Only if a significant tie is actually restricting movement — most speech delays are not caused by tongue-tie. Get a proper feeding/speech + ENT assessment before any procedure." },
    ],
    hinglish: ["Bachcha der se bolta hai", "2 saal ka bachcha bolta nahi", "totla bolna bachcha"],
    references: [
      { label: "Speech and language developmental milestones", publisher: "CDC / American Speech-Language-Hearing Association" },
      { label: "Identifying speech and language delay", publisher: "American Academy of Pediatrics" },
    ],
    relatedConditions: ["delayed-milestones", "autism-signs-assessment", "learning-difficulties", "adhd-in-children"],
    relatedTreatments: ["ayurvedic-consultation", "nasya", "abhyanga"],
    relatedArticles: ["screen-time-children-ayurveda", "hearing-screening-children"],
  },
];

export const CONDITION_SLUGS_1 = CONDITIONS_1.map((c) => c.slug);
