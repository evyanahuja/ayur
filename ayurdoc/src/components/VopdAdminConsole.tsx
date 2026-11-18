"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, CalendarClock, CheckCircle2, Eye, EyeOff, Loader2, LogOut,
  Plus, RefreshCw, ShieldCheck, Sparkles, Trash2, Video, XCircle,
} from "lucide-react";
import { formatClinicDateTime, formatMinor, type VopdPlan } from "@/content/vopd";
import { SectionMandalas } from "./ScrollMandala";
import { cn } from "@/lib/cn";
import { AdminAvailabilityEditor } from "./AdminAvailabilityEditor";
import { AdminDoctorProfileEditor } from "./AdminDoctorProfileEditor";

type BookingRow = {
  reference: string;
  patientKind: string;
  patientName: string;
  guardianName: string | null;
  gender: string | null;
  paymentMethod: string;
  ageOrDob?: string;
  phone: string;
  email: string | null;
  concernCategory: string;
  planId: string;
  planName: string;
  amountMinor: number | null;
  currency: string;
  durationMinutes: number;
  followUpCount: number;
  slotStart: string;
  status: string;
  paymentStatus: string;
  upiReference: string | null;
  payerName: string | null;
  holdExpiresAt: string | null;
  meetUrl: string | null;
  calendarStatus: string;
  calendarError: string | null;
  createdAt: string;
  verifiedAt: string | null;
  verifiedBy: string | null;
  hasScreenshot: boolean;
  confirmationEmailSentAt: string | null;
};

type AuditRow = { id: number; action: string; fromStatus: string | null; toStatus: string | null; actor: string; note: string | null; createdAt: string };
type BlockedRow = { id: number; blockedDate: string; reason: string | null; createdBy: string };

const STATUS_STYLES: Record<string, string> = {
  PAYMENT_PENDING: "bg-amber-100 text-amber-900",
  PAYMENT_VERIFICATION_PENDING: "bg-orange-100 text-orange-900",
  PAYMENT_VERIFIED: "bg-sky-100 text-sky-900",
  CONFIRMED: "bg-emerald-100 text-emerald-900",
  REJECTED: "bg-red-100 text-red-900",
  CANCELLED: "bg-slate-200 text-slate-800",
  EXPIRED: "bg-slate-200 text-slate-700",
  COMPLETED: "bg-teal-100 text-teal-900",
  SLOT_RESERVED: "bg-amber-100 text-amber-900",
};

const emptyPlanDraft = {
  name: "",
  subtitle: "",
  period: "",
  priceInr: "",
  priceUsd: "",
  durationMinutes: "30",
  followUpCount: "0",
  followUpMinutes: "20",
  requiresPayment: true,
  showOnPricing: true,
  featured: false,
  description: "",
  features: "",
};

export function VopdAdminConsole() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [blocked, setBlocked] = useState<BlockedRow[]>([]);
  const [builtinPlans, setBuiltinPlans] = useState<VopdPlan[]>([]);
  const [customPlans, setCustomPlans] = useState<VopdPlan[]>([]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [section, setSection] = useState<"overview" | "appointments" | "plans" | "availability" | "holidays" | "payments" | "profile">("overview");
  const [summary, setSummary] = useState({ total: 0, pending: 0, confirmed: 0, verified_payments: 0, rejected: 0, completed: 0 });
  const [emailProvider, setEmailProvider] = useState<string | null>(null);
  const [planDraft, setPlanDraft] = useState(emptyPlanDraft);
  const [calendar, setCalendar] = useState<{ configured: boolean; reachable: boolean; message: string; senderEmail?: string | null; senderAdvice?: string } | null>(null);
  const [upiConfigured, setUpiConfigured] = useState(true);
  const [filter, setFilter] = useState("PAYMENT_VERIFICATION_PENDING");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<BookingRow | null>(null);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [blockDateValue, setBlockDateValue] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [meetDraft, setMeetDraft] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("status", filter);
      if (query) params.set("q", query);
      const response = await fetch(`/api/admin/vopd/bookings?${params.toString()}`, { cache: "no-store" });
      if (response.status === 401) { setAuthed(false); return; }
      const data = await response.json();
      if (!data.ok) { setNotice(data.error || "Could not load bookings."); return; }
      setAuthed(true);
      setRows(data.bookings ?? []);
      setSummary(data.summary ?? { total: 0, pending: 0, confirmed: 0, verified_payments: 0, rejected: 0, completed: 0 });
      setBlocked(data.blocked ?? []);
      setBuiltinPlans(data.builtinPlans ?? []);
      setCustomPlans(data.customPlans ?? []);
      setCalendar(data.calendar ?? null);
      setUpiConfigured(data.upiConfigured !== false);
      setEmailProvider(data.emailProvider ?? null);
    } catch {
      setNotice("Network error while loading bookings.");
    } finally {
      setLoading(false);
    }
  }, [filter, query]);

  useEffect(() => {
    // Defer the initial fetch so no state is set synchronously in the effect body.
    const timer = setTimeout(() => { void load(); }, 0);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoginError("");
    setBusy(true);
    try {
      const response = await fetch("/api/admin/vopd/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) { setLoginError(data.error || "Login failed."); return; }
      setPassword("");
      await load();
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function openBooking(reference: string) {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/vopd/bookings/${reference}`, { cache: "no-store" });
      const data = await response.json();
      if (!data.ok) { setNotice(data.error || "Could not load booking."); return; }
      setSelected({
        ...data.booking,
        slotStart: data.booking.slotStart,
        createdAt: data.booking.createdAt,
      });
      setAudit(data.audit ?? []);
      setMeetDraft(data.booking.meetUrl ?? "");
    } finally {
      setBusy(false);
    }
  }

  async function act(action: string, extra: Record<string, unknown> = {}) {
    if (!selected) return;
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/vopd/bookings/${selected.reference}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) setNotice(data.error || "Action failed.");
      else if (data.outcome?.message) setNotice(data.outcome.message);
      else if (data.message) setNotice(data.message);
      else setNotice("Action completed.");
      await openBooking(selected.reference);
      await load();
    } catch {
      setNotice("Network error. Nothing was lost; retry.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleBlock(date: string, reason?: string) {
    setBusy(true);
    try {
      const response = await fetch("/api/admin/vopd/blocked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, reason }),
      });
      const data = await response.json();
      setNotice(data.ok ? `Blocked ${date}.` : data.error || "Could not block date.");
      setBlockDateValue("");
      setBlockReason("");
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function unblock(id: number) {
    setBusy(true);
    try {
      await fetch(`/api/admin/vopd/blocked?id=${id}`, { method: "DELETE" });
      await load();
    } finally {
      setBusy(false);
    }
  }

  function editPlan(plan: VopdPlan) {
    setEditingPlanId(plan.id);
    setPlanDraft({
      name: plan.name, subtitle: plan.subtitle || "", period: plan.period || "",
      priceInr: plan.amountMinor != null ? (plan.amountMinor / 100).toString() : "",
      priceUsd: plan.amountMinorUsd != null ? (plan.amountMinorUsd / 100).toString() : "",
      durationMinutes: String(plan.bookingMinutes), followUpCount: String(plan.followUpCount),
      followUpMinutes: String(plan.followUpMinutes || 20), requiresPayment: plan.requiresPayment,
      showOnPricing: plan.showOnPricing !== false, featured: Boolean(plan.featured),
      description: plan.description, features: plan.inclusions.join("\n"),
    });
    setShowPlanForm(true);
  }

  async function addPlan(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch(editingPlanId ? `/api/admin/vopd/plans/${encodeURIComponent(editingPlanId)}` : "/api/admin/vopd/plans", {
        method: editingPlanId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: planDraft.name,
          subtitle: planDraft.subtitle || undefined,
          period: planDraft.period || undefined,
          ...(planDraft.requiresPayment && planDraft.priceInr ? { priceInr: planDraft.priceInr } : {}),
          ...(planDraft.requiresPayment && planDraft.priceUsd ? { priceUsd: planDraft.priceUsd } : {}),
          durationMinutes: Number(planDraft.durationMinutes) || 30,
          followUpCount: Number(planDraft.followUpCount) || 0,
          followUpMinutes: Number(planDraft.followUpMinutes) || 20,
          requiresPayment: planDraft.requiresPayment,
          showOnPricing: planDraft.showOnPricing,
          featured: planDraft.featured,
          description: planDraft.description,
          features: planDraft.features,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setNotice(data.error || "Could not create plan.");
        return;
      }
      setNotice(`${editingPlanId ? "Updated" : "Added"} consultation plan "${data.plan.name}". Existing appointment prices are unchanged.`);
      setPlanDraft(emptyPlanDraft);
      setEditingPlanId(null);
      setShowPlanForm(false);
      await load();
    } catch {
      setNotice("Network error while creating plan.");
    } finally {
      setBusy(false);
    }
  }

  async function togglePlanActive(plan: VopdPlan) {
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/vopd/plans/${encodeURIComponent(plan.id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: plan.active === false }),
      });
      const data = await response.json();
      if (data.ok) {
        setNotice(`Plan "${plan.name}" is now ${data.plan.active ? "visible" : "hidden"} on the Consultation Plan list.`);
        await load();
      }
    } finally {
      setBusy(false);
    }
  }

  async function removePlan(plan: VopdPlan) {
    if (!confirm(`Deactivate "${plan.name}"? Past bookings and their recorded prices will be preserved.`)) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/admin/vopd/plans/${encodeURIComponent(plan.id)}`, { method: "DELETE" });
      const data = await response.json();
      if (data.ok) {
        setNotice(`Deactivated consultation plan "${plan.name}". Historical bookings remain intact.`);
        await load();
      }
    } finally {
      setBusy(false);
    }
  }

  const counts = useMemo(() => {
    return { pending: summary.pending, confirmed: summary.confirmed, shown: rows.length };
  }, [rows, summary]);

  if (!authed) {
    return (
      <main id="main" className="mandala-section relative min-h-screen overflow-hidden bg-cream-50 px-4 pt-28 pb-16">
        <SectionMandalas id="admin-login" palette="peacock" side="left" />
        <div className="mx-auto max-w-md rounded-3xl border border-forest-900/10 bg-white/90 backdrop-blur-md p-6 shadow-luxe sm:p-8">
          <p className="eyebrow text-saffron-700">VOPD admin</p>
          <h1 className="mt-2 font-display text-[26px] text-forest-950">Clinic VOPD Console</h1>
          <p className="mt-2 text-[13.5px] text-forest-800/75">
            Verify UPI payments, manage consultation plans, and update blocked clinic dates.
          </p>
          <form onSubmit={login} className="mt-5 space-y-3">
            <label htmlFor="admin-password" className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-forest-800">
              Administrator password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-forest-900/15 bg-white px-4 py-3 text-sm"
            />
            {loginError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800">{loginError}</p>}
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-950 px-5 py-3 text-sm font-semibold text-cream-50 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 text-saffron-300" />} Sign in
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="mandala-section relative min-h-screen overflow-hidden bg-cream-50 px-3 pt-28 pb-12 sm:px-6">
      <SectionMandalas id="admin-console" palette="peacock" side="right" />
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow text-saffron-700">VOPD admin</p>
            <h1 className="mt-1 font-display text-[26px] text-forest-950">Video Consultation &amp; Plan Console</h1>
            <p className="text-[13px] text-forest-800/70">
              Pending verification: <strong>{counts.pending}</strong> · Confirmed (loaded): <strong>{counts.confirmed}</strong> · Shown: {counts.shown}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void load()} className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/15 bg-white px-4 py-2 text-[12.5px] font-semibold">
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh
            </button>
            <button
              onClick={async () => { await fetch("/api/admin/vopd/logout", { method: "POST" }); setAuthed(false); }}
              className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/15 bg-white px-4 py-2 text-[12.5px] font-semibold"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        {!upiConfigured && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> UPI is not configured yet. Set VOPD_UPI_ID and VOPD_UPI_NAME — the patient payment QR (exact amount + booking reference) is then generated automatically. VOPD_UPI_QR_PATH is an optional static-image override.
          </p>
        )}
        {!emailProvider && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> No email provider is configured, so booking and confirmation emails cannot be sent. Set RESEND_API_KEY (plus FROM_EMAIL) or SMTP_HOST / SMTP_USER / SMTP_PASS in Netlify.
          </p>
        )}
        {calendar && (
          <p className={cn("mt-3 flex items-start gap-2 rounded-xl border px-4 py-3 text-[13px]", calendar.configured && calendar.reachable ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-300 bg-amber-50 text-amber-900")}>
            <Video className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {calendar.message}
              {calendar.senderEmail && calendar.senderAdvice ? <span className="mt-1 block text-[12px] opacity-80">{calendar.senderAdvice}</span> : null}
            </span>
          </p>
        )}
        {notice && <p role="status" className="mt-3 rounded-xl border border-forest-900/15 bg-white px-4 py-3 text-[13px] text-forest-900">{notice}</p>}

        <nav aria-label="Admin sections" className="mt-5 flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-sm">
          {([
            ["overview", "Overview"], ["appointments", "Appointments"], ["plans", "Plans & pricing"],
            ["availability", "Clinic availability"], ["holidays", "Holidays & days off"],
            ["payments", "Payments & history"], ["profile", "Doctor profile"],
          ] as const).map(([key, label]) => (
            <button key={key} type="button" aria-current={section === key ? "page" : undefined}
              onClick={() => { setSection(key); if (key === "appointments") setFilter("all"); if (key === "payments") setFilter("PAYMENT_VERIFICATION_PENDING"); }}
              className={cn("rounded-full px-3 py-2 text-xs font-semibold transition-colors", section === key ? "bg-forest-950 text-white" : "text-forest-900 hover:bg-cream-100")}>
              {label}
            </button>
          ))}
        </nav>
        {section === "overview" && (
          <section className="mt-5">
            <h2 className="font-display text-xl text-forest-950">Dashboard overview</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {([ ["Appointments", summary.total], ["Awaiting verification", summary.pending], ["Confirmed", summary.confirmed],
                ["Verified payments", summary.verified_payments], ["Rejected", summary.rejected], ["Completed", summary.completed] ] as const)
                .map(([label, count]) => <div key={label} className="rounded-xl border border-forest-900/10 bg-white p-4">
                  <p className="text-[11px] font-semibold text-forest-700">{label}</p><p className="mt-2 font-display text-2xl text-forest-950">{count}</p>
                </div>)}
            </div>
            <p className="mt-3 text-sm text-forest-700">Use Payments & history to verify submitted payments. Email alerts remain active; no paid messaging provider has been added.</p>
          </section>
        )}
        {section === "availability" && <AdminAvailabilityEditor view="weekly" />}
        {section === "profile" && <AdminDoctorProfileEditor />}
        {section === "holidays" && <AdminAvailabilityEditor view="dates" />}

        {(section === "appointments" || section === "payments") && (<>
        <div className="mt-5 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="filter" className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-forest-800">Status</label>
            <select id="filter" value={filter} onChange={(event) => setFilter(event.target.value)} className="mt-1 rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm">
              {["PAYMENT_VERIFICATION_PENDING", "PAYMENT_VERIFIED", "CONFIRMED", "PAYMENT_PENDING", "REJECTED", "CANCELLED", "COMPLETED", "EXPIRED", "all"].map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className="min-w-[200px] flex-1">
            <label htmlFor="search" className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-forest-800">Search reference, patient, phone or UTR</label>
            <input id="search" value={query} onChange={(event) => setQuery(event.target.value)} className="mt-1 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm" />
          </div>
          <button onClick={() => void load()} className="rounded-full bg-forest-950 px-4 py-2 text-[12.5px] font-semibold text-cream-50">Apply</button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-forest-900/10 bg-white">
          <table className="w-full min-w-[900px] text-left text-[12.5px]">
            <thead className="bg-forest-950 text-cream-100">
              <tr>{["Reference", "Patient", "Category", "Plan / fee", "Slot (IST)", "Payment", "Status", ""].map((head) => <th key={head} className="px-3 py-2.5 font-semibold">{head}</th>)}</tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={8} className="px-3 py-6 text-center text-forest-700">No bookings in this view.</td></tr>}
              {rows.map((row) => (
                <tr key={row.reference} className="border-t border-forest-900/10 align-top">
                  <td className="px-3 py-2 font-mono">{row.reference}</td>
                  <td className="px-3 py-2">
                    <strong>{row.patientName}</strong> <span className="text-forest-700">({row.patientKind})</span>
                    {row.ageOrDob && <span className="block text-[11px] text-forest-700">DOB: {row.ageOrDob}</span>}
                    {row.guardianName && <span className="block text-[11px] text-forest-700">Guardian: {row.guardianName}</span>}
                    <span className="block text-[11px] text-forest-700">{row.phone}</span>
                  </td>
                  <td className="px-3 py-2">{row.concernCategory}</td>
                  <td className="px-3 py-2">
                    {row.planName}
                    <span className="block text-[11px] text-forest-700">
                      {row.amountMinor != null ? formatMinor(row.amountMinor, row.currency === "USD" ? "USD" : "INR") : "Fee on confirmation"} · {row.durationMinutes} mins
                    </span>
                  </td>
                  <td className="px-3 py-2">{formatClinicDateTime(row.slotStart)}</td>
                  <td className="px-3 py-2">
                    {row.paymentStatus}
                    <span className="block font-mono text-[11px] text-forest-700">{row.upiReference ?? "—"}</span>
                    {row.hasScreenshot && <a className="text-[11px] underline" href={`/api/admin/vopd/bookings/${row.reference}/screenshot`} target="_blank" rel="noopener noreferrer">Screenshot</a>}
                  </td>
                  <td className="px-3 py-2"><span className={cn("rounded-full px-2 py-0.5 text-[10.5px] font-bold", STATUS_STYLES[row.status] ?? "bg-slate-100 text-slate-800")}>{row.status}</span></td>
                  <td className="px-3 py-2"><button onClick={() => void openBooking(row.reference)} className="rounded-full border border-forest-900/20 px-3 py-1 text-[11.5px] font-semibold">Open</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selected && (
          <section className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-forest-900/10 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-display text-[21px] text-forest-950">{selected.reference}</h2>
                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold", STATUS_STYLES[selected.status] ?? "bg-slate-100")}>
                  {selected.status} · {selected.paymentStatus}
                </span>
              </div>
              <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-[13px] sm:grid-cols-2">
                {[
                  ["Patient", `${selected.patientName} (${selected.patientKind}${selected.gender ? ` · ${selected.gender}` : ""})`],
                  ["Date of birth", selected.ageOrDob || "—"],
                  ["Parent / Guardian", selected.guardianName || "—"],
                  ["Phone", selected.phone],
                  ["Email", selected.email || "—"],
                  ["Category", selected.concernCategory],
                  ["Plan", `${selected.planName} · ${selected.durationMinutes} mins${selected.followUpCount ? ` + ${selected.followUpCount} follow-ups` : ""}`],
                  ["Fee", selected.amountMinor != null ? formatMinor(selected.amountMinor, selected.currency === "USD" ? "USD" : "INR") : "Fee on confirmation"],
                  ["Payment method", selected.paymentMethod],
                  ["Slot (IST)", formatClinicDateTime(selected.slotStart)],
                  ["Payer", selected.payerName || "—"],
                  ["UTR", selected.upiReference || "—"],
                  ["Verified by", selected.verifiedBy ? `${selected.verifiedBy} · ${selected.verifiedAt ? formatClinicDateTime(selected.verifiedAt) : ""}` : "—"],
                  ["Calendar", `${selected.calendarStatus}${selected.calendarError ? ` · ${selected.calendarError}` : ""}`],
                  ["Confirmation email", selected.confirmationEmailSentAt
                    ? `Sent · ${formatClinicDateTime(selected.confirmationEmailSentAt)}`
                    : "Not sent yet — use Save & email link"],
                ].map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <dt className="min-w-[110px] text-forest-700">{key}</dt>
                    <dd className="font-medium text-forest-950">{value}</dd>
                  </div>
                ))}
              </dl>
              {selected.hasScreenshot && (
                <a href={`/api/admin/vopd/bookings/${selected.reference}/screenshot`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[12.5px] font-semibold text-saffron-700 underline">
                  Open payment screenshot
                </a>
              )}
              {selected.meetUrl && (
                <p className="mt-2 text-[12.5px]">
                  Meet: <a className="font-semibold underline" href={selected.meetUrl} target="_blank" rel="noopener noreferrer">{selected.meetUrl}</a>
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {selected.status === "PAYMENT_VERIFICATION_PENDING" && (
                  <>
                    <button
                      disabled={busy}
                      onClick={() => { if (confirm("Confirm receipt of this exact amount in the clinic bank/UPI account?")) void act("verify"); }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-[12.5px] font-semibold text-white disabled:opacity-60"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Verify payment &amp; confirm
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => { const reason = prompt("Reason for rejecting this payment?"); if (reason && reason.trim().length >= 3) void act("reject", { reason }); }}
                      className="inline-flex items-center gap-1.5 rounded-full bg-red-700 px-4 py-2 text-[12.5px] font-semibold text-white disabled:opacity-60"
                    >
                      <XCircle className="h-4 w-4" /> Reject payment
                    </button>
                  </>
                )}
                {selected.status === "PAYMENT_VERIFIED" && (
                  <button disabled={busy} onClick={() => void act("retry-calendar")} className="inline-flex items-center gap-1.5 rounded-full bg-sky-700 px-4 py-2 text-[12.5px] font-semibold text-white disabled:opacity-60">
                    <RefreshCw className="h-4 w-4" /> Retry Google Calendar
                  </button>
                )}
                {["PAYMENT_VERIFICATION_PENDING", "PAYMENT_VERIFIED", "CONFIRMED"].includes(selected.status) && (
                  <button
                    disabled={busy}
                    onClick={() => { const reason = prompt("Cancellation reason?"); if (reason && reason.trim().length >= 3) void act("cancel", { reason }); }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/20 px-4 py-2 text-[12.5px] font-semibold disabled:opacity-60"
                  >
                    Cancel booking
                  </button>
                )}
                {["SLOT_RESERVED", "PAYMENT_PENDING", "PAYMENT_VERIFICATION_PENDING", "PAYMENT_VERIFIED", "CONFIRMED"].includes(selected.status) && (
                  <button
                    disabled={busy}
                    onClick={() => { const value = prompt("New slot (ISO datetime, e.g. 2026-11-20T10:30:00+05:30)"); if (value) void act("reschedule", { slotStartIso: value }); }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/20 px-4 py-2 text-[12.5px] font-semibold disabled:opacity-60"
                  >
                    <CalendarClock className="h-4 w-4" /> Reschedule
                  </button>
                )}
                {selected.status === "CONFIRMED" && (
                  <button disabled={busy} onClick={() => void act("complete")} className="rounded-full border border-forest-900/20 px-4 py-2 text-[12.5px] font-semibold disabled:opacity-60">
                    Mark completed
                  </button>
                )}
                {(selected.status === "PAYMENT_VERIFIED" || selected.status === "CONFIRMED") && (
                  <div className="w-full space-y-1.5">
                    {selected.status === "PAYMENT_VERIFIED" && (
                      <p className="text-[11.5px] text-forest-700">
                        Payment is verified. Google Meet was not created automatically — paste a Meet link below to confirm the appointment and email the patient.
                      </p>
                    )}
                    <div className="flex w-full gap-2">
                      <input value={meetDraft} onChange={(event) => setMeetDraft(event.target.value)} placeholder="https://meet.google.com/..." className="min-w-0 flex-1 rounded-xl border border-forest-900/15 px-3 py-2 text-[12.5px]" />
                      <button disabled={busy} onClick={() => void act("set-meet", { meetUrl: meetDraft })} className="rounded-full bg-forest-950 px-4 py-2 text-[12.5px] font-semibold text-cream-50 disabled:opacity-60">
                        Save &amp; email link
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-forest-900/10 bg-white p-4">
              <h3 className="font-display text-[18px] text-forest-950">Audit trail</h3>
              <ol className="mt-2 space-y-2 text-[12px]">
                {audit.map((entry) => (
                  <li key={entry.id} className="border-l-2 border-saffron-500/60 pl-2">
                    <span className="font-semibold">{entry.action}</span> · {entry.actor}
                    <span className="block text-forest-700">
                      {formatClinicDateTime(entry.createdAt)}
                      {entry.fromStatus ? ` · ${entry.fromStatus} → ${entry.toStatus}` : ""}
                    </span>
                    {entry.note && <span className="block text-forest-700">{entry.note}</span>}
                  </li>
                ))}
                {audit.length === 0 && <li className="text-forest-700">No audit entries.</li>}
              </ol>
            </div>
          </section>
        )}

        </>)}
        {/* CONSULTATION PLANS MANAGER — add plans anytime and sync to VOPD, OPD & Pricing */}
        {section === "plans" && <section className="mt-6 rounded-2xl border border-forest-900/10 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 font-display text-[20px] text-forest-950">
                <Sparkles className="h-4 w-4 text-saffron-600" /> Consultation Plans
              </h2>
              <p className="text-[12.5px] text-forest-700">
                Active plans appear automatically on the VOPD Consultation Plan step, OPD plan selector, and (if enabled) Homepage Pricing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setEditingPlanId(null); setPlanDraft(emptyPlanDraft); setShowPlanForm((v) => !v); }}
              className="inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-4 py-2 text-[12.5px] font-semibold text-cream-50 hover:bg-forest-900"
            >
              <Plus className="h-4 w-4 text-saffron-300" /> {showPlanForm ? "Close form" : "Add consultation plan"}
            </button>
          </div>

          {showPlanForm && (
            <form onSubmit={addPlan} className="mt-4 space-y-3 rounded-2xl border border-saffron-500/25 bg-cream-100/70 p-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest-800">Plan name *</label>
                  <input
                    required
                    value={planDraft.name}
                    onChange={(e) => setPlanDraft((d) => ({ ...d, name: e.target.value }))}
                    placeholder="e.g. Pediatric Wellness Plan"
                    className="mt-1 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest-800">Short tagline</label>
                  <input
                    value={planDraft.subtitle}
                    onChange={(e) => setPlanDraft((d) => ({ ...d, subtitle: e.target.value }))}
                    placeholder="e.g. 3-Month Guided Care"
                    className="mt-1 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest-800">Session duration (mins) *</label>
                  <input
                    type="number"
                    min={10}
                    max={120}
                    step={5}
                    required
                    value={planDraft.durationMinutes}
                    onChange={(e) => setPlanDraft((d) => ({ ...d, durationMinutes: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <div>
                  <label className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest-800">India fee (INR ₹) *</label>
                  <input
                    type="number"
                    min={0.01}
                    step="0.01"
                    disabled={!planDraft.requiresPayment}
                    required={planDraft.requiresPayment}
                    value={planDraft.priceInr}
                    onChange={(e) => setPlanDraft((d) => ({ ...d, priceInr: e.target.value }))}
                    placeholder="e.g. 2500"
                    className="mt-1 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest-800">International fee (USD $) *</label>
                  <input
                    type="number"
                    min={0.01}
                    step="0.01"
                    disabled={!planDraft.requiresPayment}
                    required={planDraft.requiresPayment}
                    value={planDraft.priceUsd}
                    onChange={(e) => setPlanDraft((d) => ({ ...d, priceUsd: e.target.value }))}
                    placeholder="e.g. 150"
                    className="mt-1 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest-800">Included follow-ups</label>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={planDraft.followUpCount}
                    onChange={(e) => setPlanDraft((d) => ({ ...d, followUpCount: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest-800">Follow-up mins</label>
                  <input
                    type="number"
                    min={10}
                    max={60}
                    step={5}
                    disabled={Number(planDraft.followUpCount) <= 0}
                    value={planDraft.followUpMinutes}
                    onChange={(e) => setPlanDraft((d) => ({ ...d, followUpMinutes: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest-800">Short description *</label>
                  <textarea
                    rows={2}
                    required
                    value={planDraft.description}
                    onChange={(e) => setPlanDraft((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Briefly describe who this plan suits and what it covers"
                    className="mt-1 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest-800">Bullet inclusions (one per line)</label>
                  <textarea
                    rows={2}
                    value={planDraft.features}
                    onChange={(e) => setPlanDraft((d) => ({ ...d, features: e.target.value }))}
                    placeholder={"30 mins initial session\nPersonalised diet & herb chart"}
                    className="mt-1 w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <label className="block text-xs font-semibold text-forest-800">Period / plan details
                <input value={planDraft.period} onChange={(e) => setPlanDraft((d) => ({ ...d, period: e.target.value }))}
                  className="mt-1 block w-full rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm" />
              </label>
              <div className="flex flex-wrap items-center gap-5 text-[12.5px] text-forest-900">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={planDraft.requiresPayment}
                    onChange={(e) => setPlanDraft((d) => ({ ...d, requiresPayment: e.target.checked }))}
                    className="accent-forest-900"
                  />
                  Collect payment for paid consultations
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={planDraft.showOnPricing}
                    onChange={(e) => setPlanDraft((d) => ({ ...d, showOnPricing: e.target.checked }))}
                    className="accent-forest-900"
                  />
                  Also show card on Homepage Pricing
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={planDraft.featured}
                    onChange={(e) => setPlanDraft((d) => ({ ...d, featured: e.target.checked }))}
                    className="accent-forest-900"
                  />
                  Highlight as recommended
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowPlanForm(false); setEditingPlanId(null); }}
                  className="rounded-full border border-forest-900/15 bg-white px-4 py-2 text-[12.5px] font-semibold text-forest-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full bg-forest-950 px-5 py-2 text-[12.5px] font-semibold text-cream-50 disabled:opacity-60"
                >
                  {editingPlanId ? "Save plan changes" : "Save & publish plan"}
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {builtinPlans.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-forest-900/10 bg-cream-50/70 p-3.5 text-[12.5px]">
                <div className="flex items-start justify-between gap-2">
                  <strong className="text-[13.5px] text-forest-950">{plan.name}</strong>
                  <span className="rounded-full bg-forest-900/10 px-2 py-0.5 text-[10px] font-semibold text-forest-800">Default</span>
                </div>
                <p className="mt-1 font-semibold text-saffron-700">
                  {plan.priceLabel} / {plan.usdPrice || "USD not set"} · {plan.bookingMinutes} mins
                </p>
                <p className="mt-1 text-forest-800/75">{plan.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" onClick={() => editPlan(plan)} className="rounded-full border border-forest-900/20 px-3 py-1 text-xs font-semibold">Edit</button>
                  <button type="button" onClick={() => void togglePlanActive(plan)} className="rounded-full border border-forest-900/20 px-3 py-1 text-xs font-semibold">{plan.active === false ? "Activate" : "Deactivate"}</button>
                </div>
              </div>
            ))}
            {customPlans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "rounded-xl border p-3.5 text-[12.5px]",
                  plan.active === false ? "border-slate-200 bg-slate-50 opacity-70" : "border-saffron-500/35 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <strong className="text-[13.5px] text-forest-950">{plan.name}</strong>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", plan.active === false ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-900")}>
                    {plan.active === false ? "Hidden" : "Live"}
                  </span>
                </div>
                <p className="mt-1 font-semibold text-saffron-700">
                  {plan.priceLabel} / {plan.usdPrice || "USD not set"} · {plan.bookingMinutes} mins
                  {plan.followUpCount > 0 ? ` + ${plan.followUpCount} follow-ups` : ""}
                </p>
                <p className="mt-1 text-forest-800/75">{plan.description}</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <button type="button" disabled={busy} onClick={() => editPlan(plan)} className="rounded-full border border-forest-900/20 px-3 py-1 text-[11px] font-semibold">Edit</button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void togglePlanActive(plan)}
                    className="inline-flex items-center gap-1 rounded-full border border-forest-900/15 px-3 py-1 text-[11px] font-semibold text-forest-800 hover:bg-forest-50"
                  >
                    {plan.active === false ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                    {plan.active === false ? "Show" : "Hide"}
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void removePlan(plan)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1 text-[11px] font-semibold text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" /> Archive
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>}

        {section === "holidays" && <section className="mt-6 rounded-2xl border border-forest-900/10 bg-white p-5">
          <h2 className="font-display text-[19px] text-forest-950">Legacy blocked dates</h2>
          <p className="text-[12.5px] text-forest-700">Blocked dates disappear from public VOPD slot availability.</p>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <input type="date" value={blockDateValue} onChange={(event) => setBlockDateValue(event.target.value)} className="rounded-xl border border-forest-900/15 px-3 py-2 text-sm" />
            <input value={blockReason} onChange={(event) => setBlockReason(event.target.value)} placeholder="Reason (optional)" className="rounded-xl border border-forest-900/15 px-3 py-2 text-sm" />
            <button disabled={busy || !blockDateValue} onClick={() => void toggleBlock(blockDateValue, blockReason)} className="rounded-full bg-forest-950 px-4 py-2 text-[12.5px] font-semibold text-cream-50 disabled:opacity-60">
              Block date
            </button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2 text-[12px]">
            {blocked.map((row) => (
              <li key={row.id} className="inline-flex items-center gap-2 rounded-full border border-forest-900/15 px-3 py-1">
                {row.blockedDate}{row.reason ? ` · ${row.reason}` : ""}
                <button onClick={() => void unblock(row.id)} className="font-semibold text-red-700">Remove</button>
              </li>
            ))}
            {blocked.length === 0 && <li className="text-forest-700">No legacy blocked dates.</li>}
          </ul>
        </section>}
      </div>
    </main>
  );
}
