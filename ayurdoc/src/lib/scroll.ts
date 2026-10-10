/**
 * NEW FILE — src/lib/scroll.ts
 *
 * Why: the old buttons used a bare `href="#book"`. Two problems:
 *  1. The booking form scrolled *underneath* the fixed header.
 *  2. Nothing happened if the user clicked while already inside #book,
 *     and there was no way for the floating button to close the mobile
 *     menu first.
 *
 * This helper scrolls with an explicit offset (header height) and works
 * from anywhere — navbar CTA, desktop FAB and the mobile sticky bar.
 */

const HEADER_OFFSET = 96; // px — matches the `scroll-margin-top` in globals.css

export function scrollToSection(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

  window.scrollTo({
    top: Math.max(top, 0),
    behavior: "smooth",
  });

  // keep the URL shareable without triggering a native jump
  if (window.history.replaceState) {
    window.history.replaceState(null, "", `#${id}`);
  }

  // move focus for keyboard / screen-reader users
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}

export const BOOK_TARGET = "#book";
