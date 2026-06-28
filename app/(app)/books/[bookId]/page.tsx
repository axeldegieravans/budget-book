"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useMemo } from "react";

import { BookTabs } from "@/components/books/book-tabs";
import { ShareBookForm } from "@/components/books/share-book-form";
import { OverviewCharts } from "@/components/dashboard/overview-charts";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/hooks/use-auth";
import { useBook } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import { useTransactions } from "@/hooks/use-transactions";
import { shareBook } from "@/lib/services/book-service";
import { buildCategoryInsights, buildMonthlyInsights, getBookTotals } from "@/lib/utils/insights";
import { formatCurrency } from "@/lib/utils/format";

export default function BookDetailPage() {
  const params = useParams<{ bookId: string }>();
  const pathname = usePathname();
  const { user } = useAuth();
  const { book, loading } = useBook(params.bookId);
  const { categories } = useCategories(params.bookId);
  const { transactions } = useTransactions(params.bookId);

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
    return (
      <div className="space-y-4 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-6">
        <h1 className="text-2xl font-semibold text-amber-950">Dit boekje is gearchiveerd</h1>
        <p className="text-sm text-amber-900">
          Herstel het boekje eerst vanuit het archief om het weer te gebruiken.
        </p>
        <Link href="/books/archived" className="text-sm font-semibold text-amber-900 underline">
          Ga naar archief
        </Link>
      </div>
    );
  }

  const isOwner = user?.uid === book.ownerId;
  const canShare = isOwner;
  const roleLabel = isOwner ? "Eigenaar" : "Lid";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Boekje"
        title={book.name}
        description={book.description}
        actions={<BookTabs bookId={book.id} pathname={pathname} />}
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Rol" value={roleLabel} />
        <StatCard label="Categorieen" value={String(categories.length)} accent="sky" />
        <StatCard label="Transacties" value={String(transactions.length)} accent="amber" />
        <StatCard label="Saldo" value={formatCurrency(totals.balance)} accent="emerald" />
      </section>
      {canShare ? <ShareBookForm onShare={(email) => shareBook(book.id, email)} /> : null}
      <OverviewCharts monthlyData={monthlyData} categoryData={categoryData} />
    </div>
  );
}
