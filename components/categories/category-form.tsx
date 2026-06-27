"use client";

import { useState } from "react";

import type { CategoryFormValues } from "@/types/domain";

const defaultValues: CategoryFormValues = {
  name: "",
  budget: 0,
  color: "#10b981",
  endDate: "",
};

export function CategoryForm({
  initialValue = defaultValues,
  submitLabel,
  onSubmit,
}: {
  initialValue?: CategoryFormValues;
  submitLabel: string;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
}) {
  const [values, setValues] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit({
        ...values,
        endDate: values.endDate || undefined,
      });
      if (submitLabel.toLowerCase().includes("toe")) {
        setValues(defaultValues);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Categorie opslaan mislukt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-[1.75rem] border border-white/60 bg-white/85 p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="category-name" className="text-sm font-medium text-slate-700">
            Naam
          </label>
          <input
            id="category-name"
            required
            value={values.name}
            onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label htmlFor="category-budget" className="text-sm font-medium text-slate-700">
            Budget
          </label>
          <input
            id="category-budget"
            required
            min={0}
            step="0.01"
            type="number"
            value={values.budget}
            onChange={(event) =>
              setValues((current) => ({ ...current, budget: Number(event.target.value) }))
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label htmlFor="category-color" className="text-sm font-medium text-slate-700">
            Kleur
          </label>
          <input
            id="category-color"
            type="color"
            value={values.color}
            onChange={(event) => setValues((current) => ({ ...current, color: event.target.value }))}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-2 py-2"
          />
        </div>
        <div>
          <label htmlFor="category-end-date" className="text-sm font-medium text-slate-700">
            Einddatum (optioneel)
          </label>
          <input
            id="category-end-date"
            type="date"
            value={values.endDate ?? ""}
            onChange={(event) =>
              setValues((current) => ({ ...current, endDate: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-400"
          />
        </div>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
      >
        {loading ? "Bezig..." : submitLabel}
      </button>
    </form>
  );
}
