import type { ReactNode } from "react";
import { SITE } from "@/content/site";
import { cn } from "@/lib/cn";

function normalizeUrl(value: string, network: "instagram" | "facebook" | "youtube") {
  let url = value.trim();
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  // "www.instagram.com/handle" or "instagram.com/handle" → prepend protocol
  if (/^(www\.)?(instagram|facebook|youtube)\.com\//i.test(url)) return "https://" + url.replace(/^www\./i, "www.");
  if (url.startsWith("@")) url = url.slice(1);
  const paths: Record<typeof network, string> = {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/@",
  };
  return paths[network] + url.replace(/^\/+/, "");
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="w-[18px] h-[18px]" fill="currentColor">
      <path d="M13.6 21v-7.2h2.4l.4-2.9h-2.8V9c0-.83.24-1.4 1.43-1.4h1.53V5.05c-.27-.04-1.18-.11-2.24-.11-2.22 0-3.74 1.36-3.74 3.85v2.11H8.2v2.9h2.38V21h3.02Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="w-[19px] h-[19px]" fill="currentColor">
      <path d="M21.58 7.2a2.58 2.58 0 0 0-1.82-1.82C18.16 4.95 12 4.95 12 4.95s-6.16 0-7.76.43A2.58 2.58 0 0 0 2.42 7.2 27 27 0 0 0 2 12a27 27 0 0 0 .42 4.8 2.58 2.58 0 0 0 1.82 1.82c1.6.43 7.76.43 7.76.43s6.16 0 7.76-.43a2.58 2.58 0 0 0 1.82-1.82A27 27 0 0 0 22 12a27 27 0 0 0-.42-4.8ZM9.95 15.1V8.9l5.2 3.1-5.2 3.1Z" />
    </svg>
  );
}

const SOCIALS = [
  { key: "instagram", href: SITE.instagram, label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", href: SITE.facebook, label: "Facebook", Icon: FacebookIcon },
  { key: "youtube", href: SITE.youtube, label: "YouTube", Icon: YoutubeIcon },
].filter((s) => s.href) as {
  key: "instagram" | "facebook" | "youtube";
  href: string;
  label: string;
  Icon: () => ReactNode;
}[];

export function SocialLinks({ className, label }: { className?: string; label?: string }) {
  if (!SOCIALS.length) return null;
  return (
    <div className={className}>
      {label ? <p className="text-[10px] font-semibold tracking-[0.26em] uppercase text-saffron-400 mb-3">{label}</p> : null}
      <div className="flex items-center gap-2.5" aria-label={label ?? "Social media"}>
        {SOCIALS.map(({ key, href, label: network, Icon }) => (
          <a
            key={key}
            href={normalizeUrl(href, key)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={network}
            title={network}
            className={cn(
              "grid place-items-center w-10 h-10 rounded-full border border-white/15 bg-white/[0.07] text-saffron-300",
              "transition-all duration-300 hover:-translate-y-0.5 hover:bg-saffron-400 hover:text-forest-950 hover:border-saffron-400"
            )}
          >
            <Icon />
          </a>
        ))}
      </div>
    </div>
  );
}
