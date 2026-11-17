"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";

type Range = { start: string; end: string };
type Schedule = { closed: boolean; sessions: Range[]; breaks: Range[]; intervalMinutes: number; reason?: string };
type Weekly = Schedule & { weekday: number; configured: boolean };
type Exception = Schedule & { date: string; updatedBy: string };
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const newRange = (): Range => ({ start: "10:00", end: "11:00" });
const defaultSpecial = (): Schedule => ({ closed: true, sessions: [{ start: "10:00", end: "14:00" }], breaks: [], intervalMinutes: 30, reason: "" });

function Ranges({ label, value, onChange }: { label: string; value: Range[]; onChange: (value: Range[]) => void }) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-1 text-xs font-semibold text-forest-900">{label}</legend>
      {value.map((range, index) => (
        <div key={index} className="flex flex-wrap items-center gap-2 text-xs">
          <input type="time" aria-label={`${label} ${index + 1} start`} value={range.start} onChange={(e) => onChange(value.map((item, i) => i === index ? { ...item, start: e.target.value } : item))}
            className="min-w-0 rounded-lg border border-forest-900/20 bg-white px-2 py-1.5" />
          <span>–</span>
          <input type="time" aria-label={`${label} ${index + 1} end`} value={range.end} onChange={(e) => onChange(value.map((item, i) => i === index ? { ...item, end: e.target.value } : item))}
            className="min-w-0 rounded-lg border border-forest-900/20 bg-white px-2 py-1.5" />
          <button type="button" aria-label={`Remove ${label} ${index + 1}`} onClick={() => onChange(value.filter((_, i) => i !== index))}
            className="rounded-lg border border-red-200 p-2 text-red-700"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, newRange()])} className="inline-flex items-center gap-1 rounded-lg border border-forest-900/20 px-2.5 py-1.5 text-xs font-semibold">
        <Plus className="h-3 w-3" /> Add {label === "Working sessions" ? "session" : "break"}
      </button>
    </fieldset>
  );
}

function Fields({ value, onChange }: { value: Schedule; onChange: (value: Schedule) => void }) {
  return (
    <div className="space-y-3">
      <label className="inline-flex items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={value.closed} onChange={(e) => onChange({ ...value, closed: e.target.checked })} /> Clinic closed
      </label>
      {!value.closed && (
        <>
          <label className="flex flex-wrap items-center gap-2 text-xs font-medium">
            VOPD slot start interval (minutes)
            <input type="number" min={5} max={60} step={5} value={value.intervalMinutes}
              onChange={(e) => onChange({ ...value, intervalMinutes: Number(e.target.value) })}
              className="w-20 rounded-lg border border-forest-900/20 px-2 py-1.5" />
          </label>
          <p className="text-[11px] text-forest-700">The interval sets start times; each plan retains its own consultation duration.</p>
          <Ranges label="Working sessions" value={value.sessions} onChange={(sessions) => onChange({ ...value, sessions })} />
          <Ranges label="Break periods" value={value.breaks} onChange={(breaks) => onChange({ ...value, breaks })} />
        </>
      )}
    </div>
  );
}

export function AdminAvailabilityEditor({ view }: { view: "weekly" | "dates" }) {
  const [weekly, setWeekly] = useState<Weekly[]>([]);
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [date, setDate] = useState("");
  const [special, setSpecial] = useState<Schedule>(defaultSpecial);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    const response = await fetch("/api/admin/vopd/schedule", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "Could not load clinic hours.");
    setWeekly(data.weekly);
    setExceptions(data.exceptions);
  }, []);
  useEffect(() => { void refresh().catch((error) => setNotice(error.message)); }, [refresh]);

  async function save(method: "PATCH" | "POST" | "DELETE", body: Record<string, unknown> | null, targetDate?: string) {
    setBusy(true); setNotice("");
    try {
      const url = method === "DELETE" ? `/api/admin/vopd/schedule?date=${encodeURIComponent(targetDate || "")}` : "/api/admin/vopd/schedule";
      const response = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Schedule could not be saved.");
      setWeekly(data.weekly); setExceptions(data.exceptions);
      setNotice("Schedule saved. Confirmed appointments were not changed.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Save failed."); }
    finally { setBusy(false); }
  }

  return (
    <section className="mt-5 rounded-2xl border border-forest-900/10 bg-white p-4 sm:p-6">
      <h2 className="font-display text-xl text-forest-950">{view === "weekly" ? "Clinic availability" : "Holidays & special dates"}</h2>
      <p className="mt-1 text-sm text-forest-700">Asia/Kolkata timezone · changes affect only new reservations; existing confirmed appointments stay intact.</p>
      {notice && <p role="status" className="mt-3 rounded-lg bg-cream-100 p-3 text-sm text-forest-900">{notice}</p>}
      {view === "weekly" ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {weekly.map((day) => (
            <article key={day.weekday} className="min-w-0 rounded-xl border border-forest-900/10 bg-cream-50/60 p-4">
              <h3 className="mb-3 font-semibold text-forest-950">{DAYS[day.weekday]} {day.configured ? "" : "· default"}</h3>
              <Fields value={day} onChange={(next) => setWeekly((rows) => rows.map((row) => row.weekday === day.weekday ? { ...row, ...next } : row))} />
              <button disabled={busy} onClick={() => void save("PATCH", day)} className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">
                <Save className="h-3.5 w-3.5" /> Save {DAYS[day.weekday]}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-4 max-w-xl space-y-3 rounded-xl border border-forest-900/10 bg-cream-50/60 p-4">
            <label className="block text-sm font-semibold">Date (IST)
              <input type="date" value={date} onChange={(e) => {
                const next = e.target.value; setDate(next);
                const found = exceptions.find((item) => item.date === next);
                setSpecial(found ? { ...found } : defaultSpecial());
              }} className="mt-1 block w-full rounded-lg border border-forest-900/20 bg-white px-3 py-2" />
            </label>
            <label className="block text-sm font-semibold">Reason / holiday name
              <input value={special.reason || ""} maxLength={200} onChange={(e) => setSpecial({ ...special, reason: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-forest-900/20 bg-white px-3 py-2" />
            </label>
            <Fields value={special} onChange={setSpecial} />
            <button disabled={busy || !date} onClick={() => void save("POST", { date, ...special })} className="rounded-full bg-forest-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              Save holiday / special hours
            </button>
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {exceptions.map((item) => <li key={item.date} className="rounded-xl border border-forest-900/10 p-3 text-sm">
              <strong>{item.date}</strong> · {item.closed ? "Closed" : item.sessions.map((range) => `${range.start}–${range.end}`).join(", ")}
              {item.reason && <span className="block text-forest-700">{item.reason}</span>}
              <button disabled={busy} onClick={() => void save("DELETE", null, item.date)} className="mt-2 text-xs font-semibold text-red-700 underline">Remove override</button>
            </li>)}
            {exceptions.length === 0 && <li className="text-sm text-forest-700">No date exceptions saved.</li>}
          </ul>
        </>
      )}
    </section>
  );
}
