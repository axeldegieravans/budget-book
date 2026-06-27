"use client";

import { useState } from "react";

import type { BookFormValues } from "@/types/domain";

const initialValues: BookFormValues = {
  name: "",
  description: "",
};

export function BookForm({
  initialValue = initialValues,
  submitLabel,
  onSubmit,
}: {
  initialValue?: BookFormValues;
  submitLabel: string;
  onSubmit: (values: BookFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(values);
      if (submitLabel.toLowerCase().includes("maak")) {
        setValues(initialValues);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Opslaan mislukt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[1.9rem] border border-white/70 bg-white/95 p-6 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Boekje instellen
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {submitLabel}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          Geef je boekje een duidelijke naam en korte context zodat je later snel het juiste overzicht terugvindt.
        </p>
      </div>
      <div>
        <label htmlFor="book-name" className="text-sm font-medium text-slate-700">
          Naam
        </label>
        <input
          id="book-name"
          required
          value={values.name}
          onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-emerald-400"
          placeholder="Bijvoorbeeld: Studentenhuis 2026"
        />
      </div>
      <div>
        <label htmlFor="book-description" className="text-sm font-medium text-slate-700">
          Omschrijving
        </label>
        <textarea
          id="book-description"
          value={values.description}
          onChange={(event) =>
            setValues((current) => ({ ...current, description: event.target.value }))
          }
          className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-emerald-400"
          placeholder="Waar gebruik je dit huishoudboekje voor?"
        />
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Bezig..." : submitLabel}
      </button>
    </form>
  );
}
