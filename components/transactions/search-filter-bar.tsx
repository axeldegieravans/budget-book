"use client";

import type { Category, TransactionFilters } from "@/types/domain";

export function SearchFilterBar({
  categories,
  filters,
  onChange,
}: {
  categories: Category[];
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}) {
  return (
    <div className="grid gap-3 rounded-[1.75rem] border border-white/60 bg-white/85 p-5 shadow-sm md:grid-cols-4">
      <input
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
        placeholder="Zoek op titel of notities"
        className="rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
      />
      <select
        value={filters.type}
        onChange={(event) =>
          onChange({ ...filters, type: event.target.value as TransactionFilters["type"] })
        }
        className="rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
      >
        <option value="all">Alle typen</option>
        <option value="expense">Uitgaven</option>
        <option value="income">Inkomsten</option>
      </select>
      <select
        value={filters.categoryId}
        onChange={(event) => onChange({ ...filters, categoryId: event.target.value })}
        className="rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
      >
        <option value="all">Alle categorieen</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input
        type="month"
        value={filters.month === "all" ? "" : filters.month}
        onChange={(event) =>
          onChange({
            ...filters,
            month: event.target.value || "all",
          })
        }
        className="rounded-full border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400"
      />
    </div>
  );
}
