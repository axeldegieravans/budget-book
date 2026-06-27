"use client";

import Link from "next/link";
import { useMemo } from "react";

import { OverviewCharts } from "@/components/dashboard/overview-charts";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/hooks/use-auth";
import { useBooks } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import { useTransactions } from "@/hooks/use-transactions";
import { buildCategoryInsights, buildMonthlyInsights, getBookTotals } from "@/lib/utils/insights";
import { formatCurrency } from "@/lib/utils/format";

export default function DashboardPage() {
  const { user } = useAuth();
  const { books, loading } = useBooks(user?.uid);
  const activeBook = books[0];
  const { categories } = useCategories(activeBook?.id);
  const { transactions } = useTransactions(activeBook?.id);

  const totals = useMemo(() => getBookTotals(transactions), [transactions]);
  const monthlyData = useMemo(() => buildMonthlyInsights(transactions), [transactions]);
  const categoryData = useMemo(
    () => buildCategoryInsights(categories, transactions),
    [categories, transactions],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Realtime overzicht"
        description="Bekijk direct hoe je budgetten, inkomsten en uitgaven zich ontwikkelen. Alles hieronder ververst live via Firestore."
        actions={
          <Link
            href="/books"
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Beheer boekjes
          </Link>
        }
      />

      {loading ? (
        <div className="rounded-[1.75rem] bg-white/80 p-6 text-sm text-slate-600 shadow-sm">
          Dashboard laden...
        </div>
      ) : !activeBook ? (
        <EmptyState
          title="Nog geen actief boekje"
          description="Maak eerst een huishoudboekje aan. Daarna verschijnen hier automatisch je statistieken en grafieken."
          action={
            <Link
              href="/books"
              className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Eerste boekje maken
            </Link>
          }
        />
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Actief boekje" value={activeBook.name} hint={activeBook.description} />
            <StatCard label="Inkomsten" value={formatCurrency(totals.income)} accent="sky" />
            <StatCard label="Uitgaven" value={formatCurrency(totals.expenses)} accent="rose" />
            <StatCard label="Saldo" value={formatCurrency(totals.balance)} accent="amber" />
          </section>
          <OverviewCharts monthlyData={monthlyData} categoryData={categoryData} />
        </>
      )}
    </div>
  );
}
