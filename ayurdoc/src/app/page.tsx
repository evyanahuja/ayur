import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { DoctorIntro } from "@/components/DoctorIntro";
import { Specialties } from "@/components/Specialties";
import { MethodShowcase } from "@/components/MethodShowcase";
import { Benefits } from "@/components/Benefits";
import { Testimonials } from "@/components/Testimonials";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { BookingSection } from "@/components/BookingSection";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { LanguageProvider } from "@/i18n/LanguageContext";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <LanguageProvider>
      <Navbar />
      <main id="main" className="relative bg-white">
        <Hero />
        <SocialProof />
        <DoctorIntro />
        <Specialties />
        <MethodShowcase />
        <Benefits />
        <Testimonials />
        <Pricing />
        <FAQ />
        <BookingSection />
      </main>
      <Footer />
      <FloatingActions />
    </LanguageProvider>
  );
}
