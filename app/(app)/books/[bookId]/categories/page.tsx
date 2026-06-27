"use client";

import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

import { BookTabs } from "@/components/books/book-tabs";
import { CategoryBudgetCard } from "@/components/categories/category-budget-card";
import { CategoryDropBoard } from "@/components/categories/category-drop-board";
import { CategoryForm } from "@/components/categories/category-form";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useBook } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import { useTransactions } from "@/hooks/use-transactions";
import { createCategory, deleteCategory, updateCategory } from "@/lib/services/category-service";
import { assignCategory } from "@/lib/services/transaction-service";
import type { Category } from "@/types/domain";

export default function CategoriesPage() {
  const params = useParams<{ bookId: string }>();
  const pathname = usePathname();
  const { book } = useBook(params.bookId);
  const { categories } = useCategories(params.bookId);
  const { transactions } = useTransactions(params.bookId);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  if (!book) {
    return null;
  }

  const uncategorizedTransactions = transactions.filter((transaction) => !transaction.categoryId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Categorieen"
        title={`Categorieen in ${book.name}`}
        description="Beheer budgetten per categorie en koppel transacties direct via drag-and-drop."
        actions={<BookTabs bookId={book.id} pathname={pathname} />}
      />
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.95fr]">
        <div className="space-y-4">
          {categories.length === 0 ? (
            <EmptyState
              title="Nog geen categorieen"
              description="Voeg categorieen toe zodat je budgetten per onderwerp kunt bewaken."
            />
          ) : (
            categories.map((category) => (
              <CategoryBudgetCard
                key={category.id}
                category={category}
                transactions={transactions}
                actions={
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(category)}
                      className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      Bewerk
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteCategory(book.id, category.id)}
                      className="rounded-full bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      Verwijder
                    </button>
                  </div>
                }
              />
            ))
          )}
        </div>
        <div className="space-y-4">
          <CategoryForm
            submitLabel="Voeg categorie toe"
            onSubmit={(values) => createCategory(book.id, values)}
          />
          {editingCategory ? (
            <CategoryForm
              initialValue={{
                name: editingCategory.name,
                budget: editingCategory.budget,
                color: editingCategory.color,
                endDate: editingCategory.endDate,
              }}
              submitLabel="Werk categorie bij"
              onSubmit={async (values) => {
                await updateCategory(book.id, editingCategory.id, values);
                setEditingCategory(null);
              }}
            />
          ) : null}
        </div>
      </section>
      <CategoryDropBoard
        categories={categories}
        uncategorizedTransactions={uncategorizedTransactions}
        onAssign={(transactionId, categoryId) => assignCategory(book.id, transactionId, categoryId)}
      />
    </div>
  );
}
