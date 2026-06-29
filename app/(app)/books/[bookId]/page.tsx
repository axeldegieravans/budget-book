"use client";

import { usePathname, useParams } from "next/navigation";
import { useMemo } from "react";

import { ArchivedBookNotice } from "@/components/books/archived-book-notice";
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
import { formatCurrency } from "@/lib/utils/format";
import { buildCategoryInsights, buildMonthlyInsights, getBookTotals } from "@/lib/utils/insights";

export default function BookDetailPage() {
  const params = useParams<{ bookId: string }>();
  const pathname = usePathname();
  const { user } = useAuth();
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
