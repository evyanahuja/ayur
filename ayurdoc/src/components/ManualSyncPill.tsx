"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileCode2 } from "lucide-react";

function subscribeToHostChanges() {
  // The hostname cannot change during a page session.
  return () => {};
}

function shouldShowManualSyncPill() {
  return typeof window !== "undefined" && window.location.hostname !== "ayurveddoctor.netlify.app";
}

function hideManualSyncPillOnServer() {
  return false;
}

export function ManualSyncPill() {
  const show = useSyncExternalStore(
    subscribeToHostChanges,
    shouldShowManualSyncPill,
    hideManualSyncPillOnServer
  );
  const pathname = usePathname() || "/";

  if (!show || pathname.startsWith("/manual-file-sync")) return null;

  return (
    <Link
      href="/manual-file-sync"
      className="fixed bottom-24 sm:bottom-6 left-4 sm:left-6 z-40 inline-flex items-center gap-2 rounded-full bg-forest-950/95 text-cream-50 border border-saffron-400/40 px-4 py-2.5 text-[12px] font-medium shadow-luxe hover:bg-forest-900 transition-colors"
    >
      <FileCode2 className="w-4 h-4 text-saffron-300 shrink-0" />
      <span>Manual GitHub File List & Copy</span>
    </Link>
  );
}
