"use client";

import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";

import { BookTabs } from "@/components/books/book-tabs";
import { OverviewCharts } from "@/components/dashboard/overview-charts";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useBook } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import { useTransactions } from "@/hooks/use-transactions";
import { buildCategoryInsights, buildMonthlyInsights, getBookTotals } from "@/lib/utils/insights";
import { formatCurrency } from "@/lib/utils/format";

export default function InsightsPage() {
  const params = useParams<{ bookId: string }>();
  const pathname = usePathname();
  const { book } = useBook(params.bookId);
  const { categories } = useCategories(params.bookId);
  const { transactions } = useTransactions(params.bookId);

  const totals = useMemo(() => getBookTotals(transactions), [transactions]);
  const monthlyData = useMemo(() => buildMonthlyInsights(transactions), [transactions]);
  const categoryData = useMemo(
    () => buildCategoryInsights(categories, transactions),
    [categories, transactions],
  );

  if (!book) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inzichten"
        title={`Budgetinzichten voor ${book.name}`}
        description="Gebruik de grafieken om trends, categorie-uitgaven en budgetdruk vroeg te signaleren."
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
