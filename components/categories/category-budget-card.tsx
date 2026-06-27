import { getCategoryBudgetStatus } from "@/lib/utils/insights";
import { formatCurrency } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Category, Transaction } from "@/types/domain";

export function CategoryBudgetCard({
  category,
  transactions,
  actions,
}: {
  category: Category;
  transactions: Transaction[];
  actions?: React.ReactNode;
}) {
  const status = getCategoryBudgetStatus(category, transactions);
  const toneStyles = {
    healthy: "border-emerald-200 bg-emerald-50/70 text-emerald-800",
    warning: "border-amber-200 bg-amber-50/70 text-amber-800",
    danger: "border-rose-200 bg-rose-50/80 text-rose-800",
  };

  return (
    <article className="rounded-[1.75rem] border border-white/60 bg-white/90 p-5 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color }} />
              <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Budget: {formatCurrency(category.budget)}
            </p>
          </div>
          {actions}
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(status.usageRatio * 100, 100)}%`,
              backgroundColor: category.color,
            }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <span>Besteed: {formatCurrency(status.spent)}</span>
          <span>Resterend: {formatCurrency(status.remaining)}</span>
        </div>
        <div className={cn("rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em]", toneStyles[status.tone])}>
          {status.label}
        </div>
      </div>
    </article>
  );
}
