"use client";

import { useEffect, useState } from "react";
import { ABOUT_DOCTOR_COPY } from "@/i18n/aboutDoctor";
import { LANGUAGES, type Language } from "@/i18n/config";
import { SITE } from "@/content/site";

type Draft = { introduction: string; careParagraphs: string[] };
const original = (language: Language): Draft => ({ introduction: ABOUT_DOCTOR_COPY[language].introduction,
  careParagraphs: [...ABOUT_DOCTOR_COPY[language].careParagraphs] });

export function AdminDoctorProfileEditor() {
  const [language, setLanguage] = useState<Language>("en");
  const [overrides, setOverrides] = useState<Partial<Record<Language, Draft>>>({});
  const [draft, setDraft] = useState<Draft>(original("en"));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    fetch("/api/doctor-profile", { cache: "no-store" }).then((r) => r.json())
      .then((data) => { if (data?.ok) { setOverrides(data.translations || {}); setDraft(data.translations?.en || original("en")); } })
      .catch(() => setNotice("Default translations are available; saved edits could not be loaded."));
  }, []);

  async function save() {
    setBusy(true); setNotice("");
    try {
      const response = await fetch("/api/admin/vopd/profile", { method: "PUT",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language, ...draft }) });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not save profile.");
      setOverrides((current) => ({ ...current, [language]: draft }));
      setNotice(`${language.toUpperCase()} profile saved and audited. Other languages retain their own content.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Save failed."); }
    finally { setBusy(false); }
  }

  return (
    <section className="mt-5 rounded-2xl border border-forest-900/10 bg-white p-4 sm:p-6">
      <h2 className="font-display text-xl text-forest-950">Doctor profile & website content</h2>
      <p className="mt-1 text-sm text-forest-700">Edit the introduction and care paragraphs for each supported language. Credentials and registration cannot be changed here.</p>
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
        <strong>Verified details (read-only):</strong> {SITE.doctorName} · {SITE.pgDegree} ({SITE.pgCollege}) · {SITE.ugDegree} ({SITE.ugCollege}) · {SITE.registrationAuthority} · Reg. No. {SITE.registrationNumber}
      </div>
      <label className="mt-4 block max-w-xs text-sm font-semibold text-forest-950">Content language
        <select value={language} onChange={(e) => { const selected = e.target.value as Language; setLanguage(selected); setDraft(overrides[selected] || original(selected)); setNotice(""); }}
          className="mt-1 block w-full rounded-lg border border-forest-900/20 bg-white px-3 py-2">
          {LANGUAGES.map((entry) => <option key={entry.code} value={entry.code}>{entry.label} · {entry.native}</option>)}
        </select>
      </label>
      <label className="mt-4 block text-sm font-semibold text-forest-950">Introduction
        <textarea rows={5} value={draft.introduction} onChange={(e) => setDraft((current) => ({ ...current, introduction: e.target.value }))}
          className="mt-1 block w-full rounded-lg border border-forest-900/20 bg-white px-3 py-2 leading-relaxed" />
      </label>
      <div className="mt-4 space-y-3">
        <p className="text-sm font-semibold text-forest-950">Care approach paragraphs</p>
        {draft.careParagraphs.map((text, index) => (
          <label key={index} className="block text-sm text-forest-900">Paragraph {index + 1}
            <textarea rows={4} value={text} onChange={(e) => setDraft((current) => ({ ...current, careParagraphs: current.careParagraphs.map((item, i) => i === index ? e.target.value : item) }))}
              className="mt-1 block w-full rounded-lg border border-forest-900/20 bg-white px-3 py-2 leading-relaxed" />
          </label>
        ))}
      </div>
      {notice && <p role="status" className="mt-3 rounded-lg bg-cream-100 p-3 text-sm text-forest-900">{notice}</p>}
      <button disabled={busy} onClick={() => void save()} className="mt-4 rounded-full bg-forest-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
        {busy ? "Saving…" : `Save ${language.toUpperCase()} profile`}
      </button>
    </section>
  );
}
