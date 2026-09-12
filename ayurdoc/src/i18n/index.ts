import type { Language } from "./config";
import { en, type Dictionary } from "./dictionaries/en";
import { hi } from "./dictionaries/hi";
import { mr } from "./dictionaries/mr";
import { gu } from "./dictionaries/gu";

export type { Dictionary };
export * from "./config";

const dictionaries: Record<Language, Dictionary> = { en, hi, mr, gu };

export function getDictionary(lang: Language): Dictionary {
  return dictionaries[lang] ?? en;
}

export function formatCount(template: string, count: number): string {
  return template.replace("{count}", count.toLocaleString("en-IN"));
}
