"use client";

import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";

import { ArchivedBookNotice } from "@/components/books/archived-book-notice";
import { BookTabs } from "@/components/books/book-tabs";
import { OverviewCharts } from "@/components/dashboard/overview-charts";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useBook } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import { useTransactions } from "@/hooks/use-transactions";
import { formatCurrency } from "@/lib/utils/format";
import { buildCategoryInsights, buildMonthlyInsights, getBookTotals } from "@/lib/utils/insights";

export default function InsightsPage() {
  const params = useParams<{ bookId: string }>();
  const pathname = usePathname();
  const { book, loading } = useBook(params.bookId);
  const activeBookId = !loading && book && !book.isArchived ? params.bookId : undefined;
  const { categories } = useCategories(activeBookId);
  const { transactions } = useTransactions(activeBookId);

  const totals = useMemo(() => getBookTotals(transactions), [transactions]);
  const monthlyData = useMemo(() => buildMonthlyInsights(transactions), [transactions]);
  const categoryData = useMemo(
    () => buildCategoryInsights(categories, transactions),
    [categories, transactions],
  );

  if (loading || !book) {
    return (
      <div className="rounded-[1.75rem] bg-white/80 p-6 text-sm text-slate-600 shadow-sm">
        Boekje laden...
      </div>
    );
  }

  if (book.isArchived) {
    return <ArchivedBookNotice />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inzichten"
        title={`Inzichten voor ${book.name}`}
        description="Bekijk je cijfers en grafieken."
        actions={<BookTabs bookId={book.id} pathname={pathname} />}
      />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Totale inkomsten" value={formatCurrency(totals.income)} accent="sky" />
        <StatCard label="Totale uitgaven" value={formatCurrency(totals.expenses)} accent="rose" />
        <StatCard label="Eindsaldo" value={formatCurrency(totals.balance)} accent="emerald" />
      </section>
      <OverviewCharts monthlyData={monthlyData} categoryData={categoryData} />
    </div>
  );
}
