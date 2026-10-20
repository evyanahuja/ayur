import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { SiteHeader, SiteFooter } from "@/components/chrome";
import { FloatingActions } from "@/components/FloatingActions";
import { SkipLink } from "@/components/SkipLink";
import { AppRoutes } from "@/router";

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <SkipLink />
        <SiteHeader />
        <AppRoutes />
        <SiteFooter />
        <FloatingActions />
      </LanguageProvider>
    </BrowserRouter>
  );
}
