/* Homepage sections (server-rendered). Copy is written for all age groups and avoids
   unverified statistics, testimonials, cure claims and comparisons with other medicine. */
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  Clock,
  HeartHandshake,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Stethoscope,
  Users,
  Video,
} from "lucide-react";
import { ARTICLES } from "@/content/articles";
import { PUBLISHED_CONDITIONS } from "@/content/registry";
import { HOME_CONCERN_CARDS, HOME_TREATMENT_CARDS } from "@/content/categories";
import {
  CLINIC_ADDRESS_FULL,
  CLINIC_EMAIL,
  CLINIC_HOURS,
  CLINIC_MAPS_URL,
  CLINIC_PHONE_DISPLAY,
  CLINIC_PHONE_HREF,
  waLink,
} from "@/seo/config";
import { CATEGORY_ICONS } from "@/components/Conversion";

const POPULAR_GUIDE_SLUGS = [
  "constipation-children",
  "poor-appetite-children",
  "speech-delay-in-children",
  "adhd-in-children",
  "frequent-colds-cough-children",
  "sleep-problems-children",
];

const HOME_STEPS = [
  {
    title: "Share your story",
    desc: "Tell us about your symptoms, history, medicines and any reports. Children, adults and senior citizens are all welcome.",
  },
  {
    title: "Individual assessment",
    desc: "Dr. Priyanka Likhar reviews digestion, sleep, diet, routine and constitution (Prakriti) alongside your medical history.",
  },
  {
    title: "A clear, written plan",
    desc: "You receive diet, lifestyle and any suitable Ayurvedic measures, with an explanation of what each is for and what to watch for.",
  },
  {
    title: "Follow-up and review",
    desc: "Progress is reviewed at follow-up visits. Plans are adjusted, and medical care is coordinated where needed.",
  },
];

const WHY_POINTS = [
  {
    icon: Stethoscope,
    title: "Paediatric specialist training",
    desc: "MD in Kaumarbhritya (Ayurvedic pediatrics) alongside BAMS, so children's care is a core strength of the practice.",
  },
  {
    icon: Users,
    title: "Care for every age",
    desc: "Support for children, adults, women, men and senior citizens, with a plan built around each person.",
  },
  {
    icon: ShieldCheck,
    title: "Honest about limits",
    desc: "Clear advice on what Ayurveda can and cannot offer, and when you need a specialist or emergency care.",
  },
  {
    icon: ClipboardList,
    title: "Unhurried assessment",
    desc: "Time for history, Prakriti, digestion, sleep and routine, rather than a one-size-fits-all prescription.",
  },
  {
    icon: HeartHandshake,
    title: "Coordination with your doctors",
    desc: "We do not ask you to stop prescribed medicines. Any change is planned together with your existing doctors.",
  },
  {
    icon: Video,
    title: "In clinic or online",
    desc: "Consultations at our Indore clinic, and video consultations for families across India and abroad.",
  },
];

export const HOME_FAQS = [
  {
    q: "Do you treat adults and senior citizens as well as children?",
    a: "Yes. Dr. Priyanka Likhar has postgraduate training in Ayurvedic pediatrics (MD Kaumarbhritya) and also consults adults and senior citizens about general health, skin, digestive, women's, men's and joint concerns.",
  },
  {
    q: "Is Ayurveda safe alongside my current medicines?",
    a: "It can be, but only after a full medicine review. Tell the clinic about every medicine, supplement and herbal product you take. Never stop prescribed medicines because of an Ayurvedic plan; any change is coordinated with your own doctor.",
  },
  {
    q: "Can Ayurveda cure my condition permanently?",
    a: "No honest guarantee can be given for any condition. The aim is to understand the problem, support comfort and daily function, and plan treatment with realistic expectations.",
  },
  {
    q: "What should I bring to my first visit?",
    a: "Previous prescriptions and reports, a list of current medicines, and for children a growth record and vaccination card if available.",
  },
  {
    q: "Do you offer online consultations?",
    a: "Yes. Video consultations are available for families within India and abroad. Some conditions need an in-person examination, and the doctor will tell you if that is the case.",
  },
  {
    q: "Is a consultation enough in an emergency?",
    a: "No. For chest pain, breathing difficulty, heavy bleeding, sudden weakness, seizures or any other emergency, go to the nearest emergency service immediately.",
  },
];

export function ConcernCards() {
  return (
    <section aria-labelledby="concerns-h" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
      <p className="eyebrow text-center text-saffron-700">Find your care</p>
      <h2 id="concerns-h" className="mt-2 text-center font-display text-[30px] leading-tight text-forest-950 sm:text-[36px]">
        What Health Concern Are You Looking For Help With?
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-[14.5px] leading-relaxed text-forest-800/70">
        Choose an area to read about common conditions, the Ayurvedic approach, and how a consultation with Dr. Priyanka
        Likhar can help. Individualised care for children, adults and senior citizens.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HOME_CONCERN_CARDS.map((card) => {
          const Icon = CATEGORY_ICONS[card.icon];
          return (
            <Link
              key={card.slug}
              href={`/health-concerns/${card.slug}`}
              className="group flex h-full flex-col rounded-3xl border border-forest-900/10 bg-white p-6 transition-all hover:border-saffron-500/50 hover:shadow-luxe"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-950 text-saffron-300">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="mt-4 font-display text-[21px] text-forest-950">{card.title}</span>
              <span className="mt-2 text-[14px] leading-relaxed text-forest-800/70">{card.desc}</span>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[13.5px] font-semibold text-forest-800">
                Explore {card.title} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          );
        })}
      </div>
      <p className="mt-6 text-center text-[14px]">
        <Link href="/health-concerns" className="font-semibold text-saffron-700 hover:text-forest-950">
          View all health concerns →
        </Link>
      </p>
    </section>
  );
}

export function PopularGuides() {
  const guides = POPULAR_GUIDE_SLUGS.flatMap((slug) => PUBLISHED_CONDITIONS.filter((c) => c.slug === slug));
  if (!guides.length) return null;
  return (
    <section aria-labelledby="guides-h" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-center text-saffron-700">Health guides</p>
      <h2 id="guides-h" className="mt-2 text-center font-display text-[30px] text-forest-950 sm:text-[36px]">
        Popular health guides
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/conditions/${guide.slug}`}
            className="group rounded-2xl border border-forest-900/10 bg-white p-5 transition-all hover:border-saffron-500/50 hover:shadow-luxe"
          >
            <span className="block font-display text-[19px] text-forest-950 group-hover:text-saffron-700">{guide.title}</span>
            <span className="mt-1 line-clamp-2 block text-[13px] text-forest-800/65">{guide.seoDescription}</span>
            <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-forest-800">
              Read guide <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function TreatmentCards() {
  return (
    <section aria-labelledby="treat-h" className="bg-cream-100/60 py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="eyebrow text-center text-saffron-700">Therapies</p>
        <h2 id="treat-h" className="mt-2 text-center font-display text-[30px] leading-tight text-forest-950 sm:text-[36px]">
          Panchakarma and Ayurvedic Treatments
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[14.5px] leading-relaxed text-forest-800/70">
          Classical therapies are offered only after individual assessment. Not every therapy suits every person, and some
          are not suitable in pregnancy, during acute illness or with certain medical conditions.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_TREATMENT_CARDS.map((item) => (
            <Link
              key={item.slug}
              href={`/treatments/${item.slug}`}
              className="group rounded-2xl border border-forest-900/10 bg-white p-5 transition-all hover:border-saffron-500/50 hover:shadow-luxe"
            >
              <span className="block font-display text-[18px] text-forest-950 group-hover:text-saffron-700">{item.title}</span>
              <span className="mt-1.5 block text-[13.5px] leading-relaxed text-forest-800/70">{item.desc}</span>
            </Link>
          ))}
        </div>
        <p className="mt-6 text-center text-[14px]">
          <Link href="/treatments" className="font-semibold text-saffron-700 hover:text-forest-950">
            Explore all treatments →
          </Link>
        </p>
      </div>
    </section>
  );
}

export function ConsultationSteps() {
  return (
    <section id="method" aria-labelledby="steps-h" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-12 sm:px-6 sm:py-14">
      <p className="eyebrow text-center text-saffron-700">The consultation</p>
      <h2 id="steps-h" className="mt-2 text-center font-display text-[30px] leading-tight text-forest-950 sm:text-[36px]">
        How an Ayurvedic consultation works
      </h2>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HOME_STEPS.map((step, index) => (
          <li key={step.title} className="rounded-3xl border border-forest-900/10 bg-white p-6">
            <span className="font-display text-[28px] text-saffron-600">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 font-display text-[19px] text-forest-950">{step.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-forest-800/75">{step.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function WhyChoose() {
  return (
    <section aria-labelledby="why-h" className="bg-forest-950 py-12 text-cream-50 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="eyebrow text-center text-saffron-300">Why patients choose us</p>
        <h2 id="why-h" className="mt-2 text-center font-display text-[30px] leading-tight sm:text-[36px]">
          Why choose AyurvedDoctor in Indore
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.title} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
                <Icon className="h-6 w-6 text-saffron-300" aria-hidden />
                <h3 className="mt-4 font-display text-[19px]">{point.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-cream-100/75">{point.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ArticlePreview() {
  const articles = ["joint-pain-osteoarthritis-ayurveda", "detox-myths-ayurveda", "growth-chart-reading-guide"]
    .flatMap((slug) => ARTICLES.filter((a) => a.slug === slug));
  if (!articles.length) return null;
  return (
    <section aria-labelledby="art-h" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-center text-saffron-700">Health education</p>
      <h2 id="art-h" className="mt-2 text-center font-display text-[30px] text-forest-950 sm:text-[36px]">
        Health articles
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/articles/${article.slug}`}
            className="rounded-2xl border border-forest-900/10 bg-white p-5 transition-all hover:border-saffron-500/50 hover:shadow-luxe"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-saffron-700">
              {article.readMins} min read
            </span>
            <span className="mt-1 block font-display text-[18px] text-forest-950">{article.title}</span>
          </Link>
        ))}
      </div>
      <p className="mt-5 text-center text-[14px]">
        <Link href="/articles" className="font-semibold text-saffron-700 hover:text-forest-950">
          Browse all articles →
        </Link>
      </p>
    </section>
  );
}

export function HomeFaq() {
  return (
    <section aria-labelledby="faq-home-h" className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="eyebrow text-center text-saffron-700">Questions</p>
      <h2 id="faq-home-h" className="mt-2 text-center font-display text-[30px] text-forest-950 sm:text-[36px]">
        Frequently asked questions
      </h2>
      <div className="mt-8 space-y-3">
        {HOME_FAQS.map((item) => (
          <details key={item.q} className="group rounded-2xl border border-forest-900/10 bg-white p-5">
            <summary className="cursor-pointer list-none pr-6 font-medium text-[15.5px] text-forest-950">{item.q}</summary>
            <p className="mt-3 text-[14.5px] leading-relaxed text-forest-800/80">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function ClinicLocation() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(CLINIC_ADDRESS_FULL)}&output=embed`;
  return (
    <section id="clinic" aria-labelledby="clinic-h" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-12 sm:px-6 sm:py-14">
      <p className="eyebrow text-center text-saffron-700">Visit the clinic</p>
      <h2 id="clinic-h" className="mt-2 text-center font-display text-[30px] leading-tight text-forest-950 sm:text-[36px]">
        Clinic location and timings in Indore
      </h2>
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="space-y-4 rounded-3xl border border-forest-900/10 bg-white p-6">
          <p className="font-display text-[22px] text-forest-950">BalChikitsa Ayurved Clinic</p>
          <p className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-forest-800/80">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron-700" aria-hidden />
            <span>{CLINIC_ADDRESS_FULL}</span>
          </p>
          <p className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-forest-800/80">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-saffron-700" aria-hidden />
            <span>{CLINIC_HOURS}</span>
          </p>
          <p className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-forest-800/80">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-saffron-700" aria-hidden />
            <a href={`tel:${CLINIC_PHONE_HREF}`} className="hover:text-forest-950 hover:underline">
              {CLINIC_PHONE_DISPLAY}
            </a>
          </p>
          <p className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-forest-800/80">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-saffron-700" aria-hidden />
            <a href={`mailto:${CLINIC_EMAIL}`} className="break-all hover:text-forest-950 hover:underline">
              {CLINIC_EMAIL}
            </a>
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={CLINIC_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-forest-950 px-5 py-2.5 text-[13.5px] font-medium text-cream-50 hover:bg-forest-900"
            >
              <MapPin className="h-4 w-4 text-saffron-400" aria-hidden /> Get Directions
            </a>
            <a
              href={waLink("Namaste Dr. Priyanka, I would like to book a consultation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-forest-900/15 px-5 py-2.5 text-[13.5px] font-medium text-forest-900 hover:bg-forest-50"
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp Enquiry
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-forest-900/15 px-5 py-2.5 text-[13.5px] font-medium text-forest-900 hover:bg-forest-50"
            >
              <CalendarCheck className="h-4 w-4" aria-hidden /> Book Appointment
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border border-forest-900/10 bg-white shadow-luxe">
          <iframe
            title="Map showing BalChikitsa Ayurved Clinic, Sanchar Nagar Extension, Kanadia Road, Indore"
            src={mapSrc}
            width="100%"
            height="380"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ border: 0 }}
          />
        </div>
      </div>
    </section>
  );
}
