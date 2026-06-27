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
  onCancel,
}: {
  initialValue?: BookFormValues;
  submitLabel: string;
  onSubmit: (values: BookFormValues) => Promise<void>;
  onCancel?: () => void;
}) {
  const isEditing = Boolean(onCancel);
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
      className={`space-y-5 rounded-[1.9rem] border bg-white/95 p-6 text-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.08)] ${
        isEditing ? "border-sky-200 ring-1 ring-sky-100" : "border-white/70"
      }`}
    >
      <div>
        <p
          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
            isEditing ? "bg-sky-100 text-sky-800" : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {isEditing ? "Bewerkmodus" : "Nieuw boekje"}
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          {isEditing ? "Boekje bewerken" : "Boekje aanmaken"}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {isEditing
            ? "Je past nu een bestaand boekje aan. Sla je wijzigingen op of annuleer als je toch niets wilt veranderen."
            : "Maak een nieuw boekje aan met een duidelijke naam en korte context zodat je later snel het juiste overzicht terugvindt."}
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
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Bezig..." : submitLabel}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Annuleren
          </button>
        ) : null}
      </div>
    </form>
  );
}
