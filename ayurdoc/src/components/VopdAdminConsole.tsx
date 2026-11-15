"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarClock, CheckCircle2, Loader2, LogOut, RefreshCw, ShieldCheck, Video, XCircle } from "lucide-react";
import { formatClinicDateTime, formatMinor } from "@/content/vopd";
import { cn } from "@/lib/cn";

type BookingRow = {
  reference: string;
  patientKind: string;
  patientName: string;
  guardianName: string | null;
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

export function VopdAdminConsole() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [blocked, setBlocked] = useState<BlockedRow[]>([]);
  const [calendar, setCalendar] = useState<{ configured: boolean; reachable: boolean; message: string } | null>(null);
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
      setBlocked(data.blocked ?? []);
      setCalendar(data.calendar ?? null);
      setUpiConfigured(data.upiConfigured !== false);
    } catch {
      setNotice("Network error while loading bookings.");
    } finally {
      setLoading(false);
    }
  }, [filter, query]);

  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setLoginError("");
    setBusy(true);
    try {
      const response = await fetch("/api/admin/vopd/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
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
      if (!response.ok || !data.ok) { setNotice(data.error || "Action failed."); }
      else if (data.outcome?.message) setNotice(data.outcome.message);
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
      const response = await fetch("/api/admin/vopd/blocked", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date, reason }) });
      const data = await response.json();
      setNotice(data.ok ? `Blocked ${date}.` : data.error || "Could not block date.");
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

  const counts = useMemo(() => {
    const pending = rows.filter((row) => row.status === "PAYMENT_VERIFICATION_PENDING").length;
    const confirmed = rows.filter((row) => row.status === "CONFIRMED").length;
    return { pending, confirmed, shown: rows.length };
  }, [rows]);

  if (!authed) {
    return (
      <main id="main" className="min-h-screen bg-cream-50 px-4 py-16">
        <div className="mx-auto max-w-md rounded-3xl border border-forest-900/10 bg-white p-6 shadow-luxe sm:p-8">
          <p className="eyebrow text-saffron-700">VOPD admin</p>
          <h1 className="mt-2 font-display text-[26px] text-forest-950">Payment verification console</h1>
          <p className="mt-2 text-[13.5px] text-forest-800/75">Authorised clinic staff only. Administrators verify UPI payments in the clinic account before confirming appointments.</p>
          <form onSubmit={login} className="mt-5 space-y-3">
            <label htmlFor="admin-password" className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-forest-800">Administrator password</label>
            <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required className="w-full rounded-xl border border-forest-900/15 px-4 py-3 text-sm" />
            {loginError && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-800">{loginError}</p>}
            <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-forest-950 px-5 py-3 text-sm font-semibold text-cream-50 disabled:opacity-60">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4 text-saffron-300" />} Sign in
            </button>
          </form>
          <p className="mt-4 text-[11.5px] text-forest-700/70">Configure VOPD_ADMIN_PASSWORD and VOPD_ADMIN_SESSION_SECRET on the server. Sessions expire after two hours.</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main" className="min-h-screen bg-cream-50 px-3 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow text-saffron-700">VOPD admin</p>
            <h1 className="mt-1 font-display text-[26px] text-forest-950">Video consultation payment verification</h1>
            <p className="text-[13px] text-forest-800/70">Pending verification: <strong>{counts.pending}</strong> · Confirmed (loaded): <strong>{counts.confirmed}</strong> · Shown: {counts.shown}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void load()} className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/15 px-4 py-2 text-[12.5px] font-semibold"><RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> Refresh</button>
            <button onClick={async () => { await fetch("/api/admin/vopd/logout", { method: "POST" }); setAuthed(false); }} className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/15 px-4 py-2 text-[12.5px] font-semibold"><LogOut className="h-4 w-4" /> Sign out</button>
          </div>
        </div>

        {!upiConfigured && (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> UPI QR/beneficiary settings are not configured. Patients will be asked to contact the clinic. Set VOPD_UPI_ID, VOPD_UPI_NAME and VOPD_UPI_QR_PATH.</p>
        )}
        {calendar && (
          <p className={cn("mt-3 flex items-start gap-2 rounded-xl border px-4 py-3 text-[13px]", calendar.configured && calendar.reachable ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-300 bg-amber-50 text-amber-900")}>
            <Video className="mt-0.5 h-4 w-4 shrink-0" /> {calendar.message} {calendar.configured && calendar.reachable ? "Meet generation requires a real end-to-end test." : "Payments still verify; bookings remain safe and can use a manual Meet link."}
          </p>
        )}
        {notice && <p role="status" className="mt-3 rounded-xl border border-forest-900/15 bg-white px-4 py-3 text-[13px] text-forest-900">{notice}</p>}

        <div className="mt-5 flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="filter" className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-forest-800">Status</label>
            <select id="filter" value={filter} onChange={(event) => setFilter(event.target.value)} className="mt-1 rounded-xl border border-forest-900/15 bg-white px-3 py-2 text-sm">
              {["PAYMENT_VERIFICATION_PENDING", "PAYMENT_VERIFIED", "CONFIRMED", "PAYMENT_PENDING", "REJECTED", "CANCELLED", "COMPLETED", "EXPIRED", "all"].map((value) => <option key={value} value={value}>{value}</option>)}
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
                  <td className="px-3 py-2"><strong>{row.patientName}</strong> <span className="text-forest-700">({row.patientKind})</span>{row.guardianName && <span className="block text-[11px] text-forest-700">Guardian: {row.guardianName}</span>}<span className="block text-[11px] text-forest-700">{row.phone}</span></td>
                  <td className="px-3 py-2">{row.concernCategory}</td>
                  <td className="px-3 py-2">{row.planName}<span className="block text-[11px] text-forest-700">{row.amountMinor != null ? formatMinor(row.amountMinor, "INR") : "Fee on confirmation"} · {row.durationMinutes} min</span></td>
                  <td className="px-3 py-2">{formatClinicDateTime(row.slotStart)}</td>
                  <td className="px-3 py-2">{row.paymentStatus}<span className="block font-mono text-[11px] text-forest-700">{row.upiReference ?? "—"}</span>{row.hasScreenshot && <a className="text-[11px] underline" href={`/api/admin/vopd/bookings/${row.reference}/screenshot`} target="_blank" rel="noopener noreferrer">Screenshot</a>}</td>
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
                <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold", STATUS_STYLES[selected.status] ?? "bg-slate-100")}>{selected.status} · {selected.paymentStatus}</span>
              </div>
              <dl className="mt-3 grid gap-x-6 gap-y-1.5 text-[13px] sm:grid-cols-2">
                {[
                  ["Patient", `${selected.patientName} (${selected.patientKind})`],
                  ["Parent / Guardian", selected.guardianName || "—"],
                  ["Phone", selected.phone],
                  ["Email", selected.email || "—"],
                  ["Category", selected.concernCategory],
                  ["Plan", `${selected.planName} · ${selected.durationMinutes} min${selected.followUpCount ? ` + ${selected.followUpCount} follow-ups` : ""}`],
                  ["Fee", selected.amountMinor != null ? formatMinor(selected.amountMinor, "INR") : "Fee on confirmation"],
                  ["Slot (IST)", formatClinicDateTime(selected.slotStart)],
                  ["Payer", selected.payerName || "—"],
                  ["UTR", selected.upiReference || "—"],
                  ["Verified by", selected.verifiedBy ? `${selected.verifiedBy} · ${selected.verifiedAt ? formatClinicDateTime(selected.verifiedAt) : ""}` : "—"],
                  ["Calendar", `${selected.calendarStatus}${selected.calendarError ? ` · ${selected.calendarError}` : ""}`],
                ].map(([key, value]) => <div key={key} className="flex gap-2"><dt className="min-w-[110px] text-forest-700">{key}</dt><dd className="font-medium text-forest-950">{value}</dd></div>)}
              </dl>
              {selected.hasScreenshot && <a href={`/api/admin/vopd/bookings/${selected.reference}/screenshot`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[12.5px] font-semibold text-saffron-700 underline">Open payment screenshot (private)</a>}
              {selected.meetUrl && <p className="mt-2 text-[12.5px]">Meet: <a className="font-semibold underline" href={selected.meetUrl} target="_blank" rel="noopener noreferrer">{selected.meetUrl}</a></p>}

              <div className="mt-4 flex flex-wrap gap-2">
                {selected.status === "PAYMENT_VERIFICATION_PENDING" && (
                  <>
                    <button disabled={busy} onClick={() => { if (confirm("Confirm you have seen this exact amount in the clinic bank/UPI account. This verifies payment and attempts Calendar confirmation.")) void act("verify"); }} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-4 py-2 text-[12.5px] font-semibold text-white disabled:opacity-60"><CheckCircle2 className="h-4 w-4" /> Verify payment &amp; confirm</button>
                    <button disabled={busy} onClick={() => { const reason = prompt("Reason for rejecting this payment?"); if (reason && reason.trim().length >= 3) void act("reject", { reason }); }} className="inline-flex items-center gap-1.5 rounded-full bg-red-700 px-4 py-2 text-[12.5px] font-semibold text-white disabled:opacity-60"><XCircle className="h-4 w-4" /> Reject payment</button>
                  </>
                )}
                {selected.status === "PAYMENT_VERIFIED" && (
                  <button disabled={busy} onClick={() => void act("retry-calendar")} className="inline-flex items-center gap-1.5 rounded-full bg-sky-700 px-4 py-2 text-[12.5px] font-semibold text-white disabled:opacity-60"><RefreshCw className="h-4 w-4" /> Retry Google Calendar</button>
                )}
                {["PAYMENT_VERIFICATION_PENDING", "PAYMENT_VERIFIED", "CONFIRMED"].includes(selected.status) && (
                  <button disabled={busy} onClick={() => { const reason = prompt("Cancellation reason?"); if (reason && reason.trim().length >= 3) void act("cancel", { reason }); }} className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/20 px-4 py-2 text-[12.5px] font-semibold disabled:opacity-60">Cancel booking</button>
                )}
                {["SLOT_RESERVED", "PAYMENT_PENDING", "PAYMENT_VERIFICATION_PENDING", "PAYMENT_VERIFIED", "CONFIRMED"].includes(selected.status) && (
                  <button disabled={busy} onClick={() => { const value = prompt("New slot (ISO datetime, e.g. 2026-11-20T10:30:00+05:30)"); if (value) void act("reschedule", { slotStartIso: value }); }} className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/20 px-4 py-2 text-[12.5px] font-semibold disabled:opacity-60"><CalendarClock className="h-4 w-4" /> Reschedule</button>
                )}
                {selected.status === "CONFIRMED" && (
                  <>
                    <button disabled={busy} onClick={() => void act("complete")} className="rounded-full border border-forest-900/20 px-4 py-2 text-[12.5px] font-semibold disabled:opacity-60">Mark completed</button>
                    <div className="flex w-full gap-2">
                      <input value={meetDraft} onChange={(event) => setMeetDraft(event.target.value)} placeholder="https://meet.google.com/..." className="min-w-0 flex-1 rounded-xl border border-forest-900/15 px-3 py-2 text-[12.5px]" />
                      <button disabled={busy} onClick={() => void act("set-meet", { meetUrl: meetDraft })} className="rounded-full bg-forest-950 px-4 py-2 text-[12.5px] font-semibold text-cream-50 disabled:opacity-60">Save &amp; email link</button>
                    </div>
                  </>
                )}
              </div>
              <p className="mt-3 text-[11.5px] text-forest-700/75">Never verify from a UTR or screenshot alone. Confirm the amount and payer in the clinic&apos;s actual bank/UPI account. Calendar failure never removes a verified payment.</p>
            </div>

            <div className="rounded-2xl border border-forest-900/10 bg-white p-4">
              <h3 className="font-display text-[18px] text-forest-950">Audit trail</h3>
              <ol className="mt-2 space-y-2 text-[12px]">
                {audit.map((entry) => (
                  <li key={entry.id} className="border-l-2 border-saffron-500/60 pl-2">
                    <span className="font-semibold">{entry.action}</span> · {entry.actor}
                    <span className="block text-forest-700">{formatClinicDateTime(entry.createdAt)}{entry.fromStatus ? ` · ${entry.fromStatus} → ${entry.toStatus}` : ""}</span>
                    {entry.note && <span className="block text-forest-700">{entry.note}</span>}
                  </li>
                ))}
                {audit.length === 0 && <li className="text-forest-700">No audit entries.</li>}
              </ol>
            </div>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-forest-900/10 bg-white p-4">
          <h2 className="font-display text-[19px] text-forest-950">Blocked dates</h2>
          <p className="text-[12.5px] text-forest-700">Blocked dates disappear from public availability. Existing bookings are unaffected.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <input type="date" value={blockDateValue} onChange={(event) => setBlockDateValue(event.target.value)} className="rounded-xl border border-forest-900/15 px-3 py-2 text-sm" />
            <input value={blockReason} onChange={(event) => setBlockReason(event.target.value)} placeholder="Reason (optional)" className="rounded-xl border border-forest-900/15 px-3 py-2 text-sm" />
            <button disabled={busy || !blockDateValue} onClick={() => void toggleBlock(blockDateValue, blockReason)} className="rounded-full bg-forest-950 px-4 py-2 text-[12.5px] font-semibold text-cream-50 disabled:opacity-60">Block date</button>
          </div>
          <ul className="mt-3 flex flex-wrap gap-2 text-[12px]">
            {blocked.map((row) => (
              <li key={row.id} className="inline-flex items-center gap-2 rounded-full border border-forest-900/15 px-3 py-1">
                {row.blockedDate}{row.reason ? ` · ${row.reason}` : ""}
                <button onClick={() => void unblock(row.id)} className="font-semibold text-red-700">Remove</button>
              </li>
            ))}
            {blocked.length === 0 && <li className="text-forest-700">No blocked dates.</li>}
          </ul>
        </section>
      </div>
    </main>
  );
}
