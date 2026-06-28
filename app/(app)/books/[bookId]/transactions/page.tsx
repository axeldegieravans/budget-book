"use client";

import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
import { getErrorMessage } from "@/lib/utils/errors";
import { defaultTransactionFilters } from "@/lib/utils/filters";
import { useToast } from "@/providers/toast-provider";
import type { Transaction } from "@/types/domain";

export default function TransactionsPage() {
  const params = useParams<{ bookId: string }>();
  const pathname = usePathname();
  const { user } = useAuth();
  const { book } = useBook(params.bookId);
  const { categories } = useCategories(params.bookId);
  const toast = useToast();
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const [filters, setFilters] = useState(defaultTransactionFilters);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { filteredTransactions } = useTransactions(params.bookId, filters);

  async function handleCreate(values: {
    title: string;
    amount: number;
    type: "expense" | "income";
    date: string;
    categoryId?: string;
    notes?: string;
  }) {
    try {
      await createTransaction(book!.id, user!.uid, values);
      toast.success(`Transactie "${values.title}" is toegevoegd.`);
    } catch (createError) {
      toast.error(getErrorMessage(createError, "Transactie aanmaken mislukt."));
      throw createError;
    }
  }

  async function handleUpdate(values: {
    title: string;
    amount: number;
    type: "expense" | "income";
    date: string;
    categoryId?: string;
    notes?: string;
  }) {
    if (!editingTransaction) {
      return;
    }

    try {
      await updateTransaction(book!.id, editingTransaction.id, values);
      toast.success(`Transactie "${values.title}" is bijgewerkt.`);
      setEditingTransaction(null);
    } catch (updateError) {
      toast.error(getErrorMessage(updateError, "Transactie bijwerken mislukt."));
      throw updateError;
    }
  }

  async function handleDelete(transaction: Transaction) {
    try {
      await deleteTransaction(book!.id, transaction.id);
      toast.success(`Transactie "${transaction.title}" is verwijderd.`);
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, "Transactie verwijderen mislukt."));
    }
  }

  useEffect(() => {
    if (!editingTransaction) {
      return;
    }

    const top = (formSectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 128;
    window.scrollTo({ top, behavior: "smooth" });
  }, [editingTransaction]);

  if (!book || !user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Transacties"
        title={`Transacties in ${book.name}`}
        description="Bekijk, filter en beheer je transacties."
        actions={<BookTabs bookId={book.id} pathname={pathname} />}
      />
      <div ref={formSectionRef}>
        <TransactionForm
          key={editingTransaction ? `edit-${editingTransaction.id}` : "create-transaction"}
          categories={categories}
          initialValue={
            editingTransaction
              ? {
                  title: editingTransaction.title,
                  amount: editingTransaction.amount,
                  type: editingTransaction.type,
                  date: editingTransaction.date,
                  categoryId: editingTransaction.categoryId ?? "",
                  notes: editingTransaction.notes ?? "",
                }
              : undefined
          }
          submitLabel={editingTransaction ? "Werk transactie bij" : "Voeg transactie toe"}
          onSubmit={editingTransaction ? handleUpdate : handleCreate}
          onCancel={editingTransaction ? () => setEditingTransaction(null) : undefined}
        />
      </div>
      <SearchFilterBar categories={categories} filters={filters} onChange={setFilters} />
      {filteredTransactions.length === 0 ? (
        <EmptyState
          title="Geen transacties gevonden"
          description="Pas je filters aan of voeg een transactie toe."
        />
      ) : (
        <TransactionTable
          categories={categories}
          transactions={filteredTransactions}
          onEdit={setEditingTransaction}
          onDelete={(transactionId) => {
            const transaction = filteredTransactions.find((item) => item.id === transactionId);
            if (!transaction) {
              return Promise.resolve();
            }

            return handleDelete(transaction);
          }}
        />
      )}
    </div>
  );
}
