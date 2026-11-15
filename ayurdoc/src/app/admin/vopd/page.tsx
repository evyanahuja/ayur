import type { Metadata } from "next";
import { VopdAdminConsole } from "@/components/VopdAdminConsole";

export const metadata: Metadata = {
  title: { absolute: "VOPD admin | BalChikitsa" },
  robots: { index: false, follow: false, nocache: true },
};

export default function VopdAdminPage() {
  return <VopdAdminConsole />;
}
