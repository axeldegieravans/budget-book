"use client";

import { useState } from "react";

import { currentDateInputValue } from "@/lib/utils/format";
import type { Category, TransactionFormValues } from "@/types/domain";

const defaultValues: TransactionFormValues = {
  title: "",
  amount: 0,
  type: "expense",
  date: currentDateInputValue(),
  categoryId: "",
  notes: "",
};

export function TransactionForm({
  categories,
  initialValue = defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  categories: Category[];
  initialValue?: TransactionFormValues;
  submitLabel: string;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
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
      if (submitLabel.toLowerCase().includes("toe")) {
        setValues(defaultValues);
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Transactie opslaan mislukt.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-4 rounded-[1.75rem] border bg-white/90 p-5 shadow-sm ${
        isEditing ? "border-sky-200 ring-1 ring-sky-100" : "border-white/60"
      }`}
    >
      <div>
        <p
          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
            isEditing ? "bg-sky-100 text-sky-800" : "bg-emerald-100 text-emerald-800"
          }`}
        >
          {isEditing ? "Bewerkmodus" : "Nieuwe transactie"}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">
          {isEditing ? "Transactie bewerken" : "Transactie aanmaken"}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {isEditing
            ? "Je past nu een bestaande transactie aan. Controleer titel, bedrag en categorie voordat je opslaat."
            : "Voeg een nieuwe inkomsten- of uitgavetransactie toe zodat je overzicht direct bijgewerkt wordt."}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="transaction-title" className="text-sm font-medium text-slate-700">
            Titel
          </label>
          <input
            id="transaction-title"
            required
            value={values.title}
            onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label htmlFor="transaction-amount" className="text-sm font-medium text-slate-700">
            Bedrag
          </label>
          <input
            id="transaction-amount"
            type="number"
            required
            min={0}
            step="0.01"
            value={values.amount}
            onChange={(event) =>
              setValues((current) => ({ ...current, amount: Number(event.target.value) }))
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label htmlFor="transaction-type" className="text-sm font-medium text-slate-700">
            Type
          </label>
          <select
            id="transaction-type"
            value={values.type}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                type: event.target.value as TransactionFormValues["type"],
              }))
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
          >
            <option value="expense">Uitgave</option>
            <option value="income">Inkomst</option>
          </select>
        </div>
        <div>
          <label htmlFor="transaction-date" className="text-sm font-medium text-slate-700">
            Datum
          </label>
          <input
            id="transaction-date"
            type="date"
            required
            value={values.date}
            onChange={(event) => setValues((current) => ({ ...current, date: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="transaction-category" className="text-sm font-medium text-slate-700">
            Categorie
          </label>
          <select
            id="transaction-category"
            value={values.categoryId}
            onChange={(event) =>
              setValues((current) => ({ ...current, categoryId: event.target.value }))
            }
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
          >
            <option value="">Geen categorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="transaction-notes" className="text-sm font-medium text-slate-700">
            Notities
          </label>
          <input
            id="transaction-notes"
            value={values.notes}
            onChange={(event) => setValues((current) => ({ ...current, notes: event.target.value }))}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
          />
        </div>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
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
