import Link from "next/link";

import { formatDate } from "@/lib/utils/format";
import type { HouseholdBook } from "@/types/domain";

export function BookCard({
  book,
  actions,
  onEdit,
  onArchive,
}: {
  book: HouseholdBook;
  actions?: React.ReactNode;
  onEdit?: () => void;
  onArchive?: () => void;
}) {
  const roleLabel = book.role === "owner" ? "Eigenaar" : "Gedeeld";

  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white px-6 py-5 shadow-[0_14px_34px_rgba(15,23,42,0.05)] transition hover:border-slate-300 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">{book.name}</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              {roleLabel}
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
              {book.isArchived ? "Archief" : "Actief"}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            {book.description || "Nog geen omschrijving toegevoegd."}
          </p>
        </div>

        <div className="flex flex-col gap-3 xl:items-end">
          <Link
            href={`/books/${book.id}`}
            className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Open boekje
          </Link>
          <div className="flex flex-wrap gap-2">
            {actions}
            {onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Bewerk
              </button>
            ) : null}
            {onArchive ? (
              <button
                type="button"
                onClick={onArchive}
                className="rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
              >
                Archiveer
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
        {[
          { label: "Rol", value: roleLabel === "Gedeeld" ? "Gedeeld met jou" : "Jij beheert dit boekje" },
          { label: "Aangemaakt", value: formatDate(book.createdAt) },
          { label: "Laatste update", value: formatDate(book.updatedAt) },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              {item.label}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800">{item.value}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
