export type Language = "en" | "hi" | "mr" | "gu";

export const LANGUAGES: { code: Language; label: string; native: string; short: string }[] = [
  { code: "en", label: "English", native: "English", short: "EN" },
  { code: "hi", label: "Hindi", native: "हिन्दी", short: "हि" },
  { code: "mr", label: "Marathi", native: "मराठी", short: "म" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", short: "ગુ" },
];

export const DEFAULT_LANGUAGE: Language = "en";
export const STORAGE_KEY = "ayur-lang";
/** The key used before the clinic was renamed. It is read once so returning visitors
 *  keep the language they chose, then removed. Safe to delete after a few months. */
export const LEGACY_STORAGE_KEY = "balchikitsa-lang";

export const languageNames: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  mr: "मराठी",
  gu: "ગુજરાતી",
};
