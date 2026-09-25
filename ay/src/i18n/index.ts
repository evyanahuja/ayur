import type { Language } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { hi } from "./dictionaries/hi";
import { mr } from "./dictionaries/mr";
import { gu } from "./dictionaries/gu";
import { withSiteContent } from "./siteOverrides";

export type { Dictionary };
export * from "./config";

const dictionaries: Record<Language, Dictionary> = { en, hi, mr, gu };

// Every dictionary is merged with site.ts once and cached: content the doctor
// customises in site.ts overrides all languages; untouched text stays translated.
const merged = new Map<Language, Dictionary>();

export function getDictionary(lang: Language): Dictionary {
  let dict = merged.get(lang);
  if (!dict) {
    dict = withSiteContent(dictionaries[lang] ?? en);
    merged.set(lang, dict);
  }
  return dict;
}

export function formatCount(template: string, count: number): string {
  return template.replace("{count}", count.toLocaleString("en-IN"));
}
