import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Leaf, Menu, X, Phone, CalendarCheck, ChevronDown, MapPin, Mail, Clock, Heart, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";
import { SITE, STATS, telLink } from "@/content/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CONDITIONS_1 } from "@/content/conditions";
import { CONDITIONS_2 } from "@/content/conditions2";
import { TREATMENTS } from "@/content/treatments";

const ALL_CONDITIONS = [...CONDITIONS_1, ...CONDITIONS_2];

function useScrolled() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const fn = () => setS(window.scrollY > 24);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return s;
}

export function SiteHeader() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);
  const loc = useLocation();
  useEffect(() => { setOpen(false); setDrop(null); }, [loc.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open ]);

  const navLink = ({ isActive }: { isActive: boolean }) =>
    cn("px-3.5 py-2 rounded-full text-[13.5px] font-medium tracking-wide transition-colors whitespace-nowrap",
      isActive ? "text-forest-950 bg-forest-950/5" : "text-forest-800/70 hover:text-forest-950 hover:bg-forest-950/5");

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-500", scrolled ? "py-2" : "py-4")}>
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <nav aria-label="Primary" className={cn("flex items-center justify-between gap-2 rounded-3xl lg:rounded-full px-3 sm:px-4 transition-all duration-500",
          scrolled ? "glass gold-hairline shadow-luxe py-2" : "bg-white/70 backdrop-blur-md border border-white/50 py-2.5 shadow-sm")}>
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label={`${SITE.doctorName} — Home`}>
            <span className="relative grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 text-saffron-300 shadow group-hover:scale-105 transition-transform">
              <Leaf className="w-[17px] h-[17px]" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[15.5px] sm:text-[17px] text-forest-950">{SITE.doctorName}</span>
              <span className="block text-[8.5px] sm:text-[9px] font-semibold tracking-[0.14em] text-saffron-700 uppercase">{SITE.shortCreds} • Indore</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            <NavLink to="/" end className={navLink}>Home</NavLink>
            <NavLink to="/about-doctor/" className={navLink}>Doctor</NavLink>
            <div className="relative" onMouseEnter={() => setDrop("cond")} onMouseLeave={() => setDrop(null)}>
              <Link to="/conditions/" className={cn("px-3.5 py-2 rounded-full text-[13.5px] font-medium tracking-wide flex items-center gap-1", loc.pathname.startsWith("/conditions") ? "text-forest-950 bg-forest-950/5" : "text-forest-800/70 hover:text-forest-950")}>
                Conditions <ChevronDown className="w-3 h-3" />
              </Link>
              {drop === "cond" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[560px]">
                  <div className="rounded-2xl border border-forest-900/10 bg-white shadow-luxe-lg p-4 grid grid-cols-2 gap-1 max-h-[420px] overflow-auto">
                    {ALL_CONDITIONS.map((c) => (
                      <Link key={c.slug} to={`/conditions/${c.slug}/`} className="rounded-xl px-3 py-2 text-[13px] text-forest-900/80 hover:bg-forest-50 hover:text-forest-950">
                        <span className="block font-medium">{c.title}</span>
                        <span className="block text-[11px] text-forest-800/50">{c.category}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative" onMouseEnter={() => setDrop("treat")} onMouseLeave={() => setDrop(null)}>
              <Link to="/treatments/" className={cn("px-3.5 py-2 rounded-full text-[13.5px] font-medium tracking-wide flex items-center gap-1", loc.pathname.startsWith("/treatments") || loc.pathname.startsWith("/services") ? "text-forest-950 bg-forest-950/5" : "text-forest-800/70 hover:text-forest-950")}>
                Treatments <ChevronDown className="w-3 h-3" />
              </Link>
              {drop === "treat" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 w-[480px]">
                  <div className="rounded-2xl border border-forest-900/10 bg-white shadow-luxe-lg p-4 grid grid-cols-2 gap-1 max-h-[420px] overflow-auto">
                    {TREATMENTS.map((t) => (
                      <Link key={t.slug} to={`/${t.base}/${t.slug}/`} className="rounded-xl px-3 py-2 text-[13px] hover:bg-forest-50">
                        <span className="block font-medium text-forest-950">{t.title}</span>
                        <span className="block text-[11px] text-forest-800/50">{t.category}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <NavLink to="/articles/" className={navLink}>Articles</NavLink>
            <NavLink to="/faq/" className={navLink}>FAQ</NavLink>
            <NavLink to="/contact/" className={navLink}>Contact</NavLink>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden xl:block"><LanguageSwitcher compact /></div>
            <a href={telLink} aria-label={`Call ${SITE.phoneDisplay}`} className="hidden md:inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-cream-100/70 px-3 py-2 text-[12.5px] font-medium text-forest-800 hover:bg-saffron-500 hover:text-white hover:border-saffron-500 transition-all">
              <Phone className="w-3.5 h-3.5" /> <span className="hidden 2xl:inline">{SITE.phoneDisplay}</span><span className="2xl:hidden">Call</span>
            </a>
            <Link to="/contact/" className="btn-shine hidden sm:inline-flex items-center gap-2 rounded-full bg-forest-950 text-cream-50 px-4 py-2.5 text-[12.5px] font-medium shadow hover:bg-forest-900 transition-colors whitespace-nowrap">
              <CalendarCheck className="w-4 h-4 text-saffron-400" /> Book Visit
            </Link>
            <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"} className="lg:hidden grid place-items-center w-10 h-10 rounded-full bg-forest-950 text-saffron-300">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 top-[72px] z-40 bg-forest-950/40 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="mx-3 mt-2 rounded-3xl bg-cream-50 border border-saffron-500/25 shadow-luxe-lg p-4 max-h-[78vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="grid gap-1 text-[15px] font-medium text-forest-950">
              {[["/", "Home"], ["/about-doctor/", "About the Doctor"], ["/child-health/", "Child Health"], ["/conditions/", "Conditions Library"], ["/treatments/", "Treatments & Services"], ["/articles/", "Health Articles"], ["/faq/", "FAQ"], ["/contact/", "Contact & Appointments"]].map(([href, label]) => (
                <Link key={href} to={href} className="rounded-2xl px-4 py-3 hover:bg-forest-50 flex items-center justify-between">
                  {label} <span aria-hidden>→</span>
                </Link>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 px-2">
              <LanguageSwitcher compact />
              <a href={telLink} className="flex-1 text-center rounded-full border border-saffron-500/40 px-4 py-3 text-[14px] font-semibold text-forest-900">Call {SITE.phoneDisplay}</a>
            </div>
            <Link to="/contact/" className="btn-shine mt-3 flex items-center justify-center gap-2 rounded-full bg-forest-950 text-cream-50 px-4 py-3.5 font-medium">
              <CalendarCheck className="w-5 h-5 text-saffron-400" /> Book Your Child's Visit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-forest-950 text-cream-100 overflow-hidden" aria-label="Site footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 text-forest-950"><Leaf className="w-5 h-5" /></span>
            <span>
              <span className="block font-display text-[19px] text-white">{SITE.doctorName}</span>
              <span className="block text-[10px] tracking-[0.18em] uppercase text-saffron-300 font-semibold">{SITE.shortCreds}</span>
            </span>
          </Link>
          <p className="mt-3 text-[13.5px] leading-relaxed text-white/60 max-w-sm">
            {SITE.clinicName} — Ayurvedic child healthcare in Indore + online. {STATS.patientsTreated.toLocaleString("en-IN")}+ children guided.
          </p>
          <p className="mt-3 flex items-center gap-2 text-[12px] text-white/50"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Registration details to be verified by owner — see Owner Checklist.</p>
        </div>
        <nav aria-label="Conditions">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-saffron-400">Conditions</p>
          <ul className="mt-3 space-y-2 text-[13.5px]">
            <li><Link to="/conditions/adhd-in-children/" className="text-white/65 hover:text-saffron-300">ADHD in Children</Link></li>
            <li><Link to="/conditions/cerebral-palsy/" className="text-white/65 hover:text-saffron-300">Cerebral Palsy</Link></li>
            <li><Link to="/conditions/speech-delay-in-children/" className="text-white/65 hover:text-saffron-300">Speech Delay</Link></li>
            <li><Link to="/conditions/poor-appetite-children/" className="text-white/65 hover:text-saffron-300">Poor Appetite</Link></li>
            <li><Link to="/conditions/constipation-children/" className="text-white/65 hover:text-saffron-300">Constipation</Link></li>
            <li><Link to="/conditions/" className="text-saffron-300 hover:text-white font-medium">All 22 conditions →</Link></li>
          </ul>
        </nav>
        <nav aria-label="Treatments and resources">
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-saffron-400">Treatments</p>
          <ul className="mt-3 space-y-2 text-[13.5px]">
            <li><Link to="/treatments/customized-suvarnaprashan/" className="text-white/65 hover:text-saffron-300">Customized Suvarnaprashan</Link></li>
            <li><Link to="/treatments/panchakarma/" className="text-white/65 hover:text-saffron-300">Panchakarma</Link></li>
            <li><Link to="/services/ayurvedic-consultation/" className="text-white/65 hover:text-saffron-300">Consultation</Link></li>
            <li><Link to="/articles/" className="text-white/65 hover:text-saffron-300">Health Articles</Link></li>
            <li><Link to="/faq/" className="text-white/65 hover:text-saffron-300">FAQ</Link></li>
            <li><Link to="/sitemap/" className="text-white/65 hover:text-saffron-300">Sitemap</Link></li>
          </ul>
        </nav>
        <div>
          <p className="text-[10px] font-semibold tracking-[0.22em] uppercase text-saffron-400">Reach the clinic</p>
          <ul className="mt-3 space-y-2.5 text-[13.5px] text-white/70">
            <li><a className="hover:text-saffron-300 flex gap-2" href={telLink}><Phone className="w-4 h-4 mt-0.5 text-saffron-300" />{SITE.phoneDisplay}</a></li>
            <li><a className="hover:text-saffron-300 flex gap-2" href={`mailto:${SITE.email}`}><Mail className="w-4 h-4 mt-0.5 text-saffron-300" />{SITE.email}</a></li>
            <li className="flex gap-2"><Clock className="w-4 h-4 mt-0.5 text-saffron-300" />{SITE.hours}</li>
            <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 text-saffron-300" />{SITE.addressFull}</li>
          </ul>
          <Link to="/contact/" className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-300 via-saffron-400 to-saffron-500 text-forest-950 font-semibold px-5 py-2.5 text-[13.5px]">
            <CalendarCheck className="w-4 h-4" /> Book Appointment
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-white/45">
          <p>© {year} {SITE.doctorName} • {SITE.clinicName}. All rights reserved.</p>
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link to="/privacy-policy/" className="hover:text-white/70">Privacy Policy</Link>
            <Link to="/terms/" className="hover:text-white/70">Terms of Use</Link>
            <Link to="/owner-checklist/" className="hover:text-white/70">Owner Checklist</Link>
          </p>
          <p className="flex items-center gap-1.5">Made with <Heart className="w-3.5 h-3.5 text-rose-400" fill="currentColor" /> for thriving kids</p>
        </div>
        <p className="mx-auto max-w-7xl px-4 sm:px-6 pb-6 text-[11px] leading-relaxed text-white/35">
          Educational content only — not medical advice. Ayurvedic care is complementary and coordinated with paediatric care. *Outcomes vary by child; timelines on this site describe typical patterns, not promises.
        </p>
      </div>
    </footer>
  );
}
