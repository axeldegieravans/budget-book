"use client";

import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

import { BookTabs } from "@/components/books/book-tabs";
import { SearchFilterBar } from "@/components/transactions/search-filter-bar";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/hooks/use-auth";
import { useBook } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import { useTransactions } from "@/hooks/use-transactions";
import {
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "@/lib/services/transaction-service";
import { defaultTransactionFilters } from "@/lib/utils/filters";
import type { Transaction } from "@/types/domain";

export default function TransactionsPage() {
  const params = useParams<{ bookId: string }>();
  const pathname = usePathname();
  const { user } = useAuth();
  const { book } = useBook(params.bookId);
  const { categories } = useCategories(params.bookId);
  const [filters, setFilters] = useState(defaultTransactionFilters);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { filteredTransactions } = useTransactions(params.bookId, filters);

  if (!book || !user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Transacties"
        title={`Transacties in ${book.name}`}
        description="Alle resources updaten realtime. Filter direct op type, categorie, maand of zoekterm."
        actions={<BookTabs bookId={book.id} pathname={pathname} />}
      />
      <TransactionForm
        categories={categories}
        submitLabel="Voeg transactie toe"
        onSubmit={(values) => createTransaction(book.id, user.uid, values)}
      />
      {editingTransaction ? (
        <TransactionForm
          categories={categories}
          initialValue={{
            title: editingTransaction.title,
            amount: editingTransaction.amount,
            type: editingTransaction.type,
            date: editingTransaction.date,
            categoryId: editingTransaction.categoryId ?? "",
            notes: editingTransaction.notes ?? "",
          }}
          submitLabel="Werk transactie bij"
          onSubmit={async (values) => {
            await updateTransaction(book.id, editingTransaction.id, values);
            setEditingTransaction(null);
          }}
        />
      ) : null}
      <SearchFilterBar categories={categories} filters={filters} onChange={setFilters} />
      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="Geen transacties gevonden"
          description="Pas je filters aan of voeg een eerste transactie toe."
        />
      ) : (
        <TransactionTable
          categories={categories}
          transactions={filteredTransactions}
          onEdit={setEditingTransaction}
          onDelete={(transactionId) => deleteTransaction(book.id, transactionId)}
        />
      )}
    </div>
  );
}
