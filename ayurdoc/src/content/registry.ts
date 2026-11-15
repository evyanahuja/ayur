/* Single registry of every condition guide.

   status: "draft"  -> built at its URL with noindex, hidden from navigation,
                       related links and the sitemap until a physician approves it.
   status: "published" (or unset) -> fully indexable.

   To publish a reviewed page, change its status to "published" in its content file
   and add reviewedOn (YYYY-MM-DD) once Dr. Priyanka Likhar has signed off. */
import { CONDITIONS_1, type ConditionPage } from "./conditions";
import { CONDITIONS_2 } from "./conditions2";
import { CONDITIONS_3 } from "./conditions3";
import { CONDITIONS_4 } from "./conditions4";

export const ALL_CONDITIONS: ConditionPage[] = [
  ...CONDITIONS_1,
  ...CONDITIONS_2,
  ...CONDITIONS_3,
  ...CONDITIONS_4,
];

export const PUBLISHED_CONDITIONS: ConditionPage[] = ALL_CONDITIONS.filter(
  (c) => c.status !== "draft"
);

export function findCondition(slug: string): ConditionPage | undefined {
  return ALL_CONDITIONS.find((c) => c.slug === slug);
}
