"use client";

import { useParams, usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { BookTabs } from "@/components/books/book-tabs";
import { CategoryBudgetCard } from "@/components/categories/category-budget-card";
import { CategoryDropBoard } from "@/components/categories/category-drop-board";
import { CategoryForm } from "@/components/categories/category-form";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useBook } from "@/hooks/use-books";
import { useCategories } from "@/hooks/use-categories";
import { useScrollToElement } from "@/hooks/use-scroll-to-element";
import { useTransactions } from "@/hooks/use-transactions";
import { createCategory, deleteCategory, updateCategory } from "@/lib/services/category-service";
import { assignCategory } from "@/lib/services/transaction-service";
import { getErrorMessage } from "@/lib/utils/errors";
import { useToast } from "@/providers/toast-provider";
import type { Category, CategoryFormValues } from "@/types/domain";

export default function CategoriesPage() {
  const params = useParams<{ bookId: string }>();
  const pathname = usePathname();
  const { book } = useBook(params.bookId);
  const { categories } = useCategories(params.bookId);
  const { transactions } = useTransactions(params.bookId);
  const toast = useToast();
  const formSectionRef = useRef<HTMLDivElement | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  useScrollToElement(formSectionRef, Boolean(editingCategory));

  async function handleCreate(values: CategoryFormValues) {
    try {
      await createCategory(params.bookId, values);
      toast.success(`Categorie "${values.name}" is toegevoegd.`);
    } catch (createError) {
      toast.error(getErrorMessage(createError, "Categorie aanmaken mislukt."));
      throw createError;
    }
  }

  async function handleUpdate(values: CategoryFormValues) {
    if (!editingCategory) {
      return;
    }

    try {
      await updateCategory(params.bookId, editingCategory.id, values);
      toast.success(`Categorie "${values.name}" is bijgewerkt.`);
      setEditingCategory(null);
    } catch (updateError) {
      toast.error(getErrorMessage(updateError, "Categorie bijwerken mislukt."));
      throw updateError;
    }
  }

  async function handleDelete(category: Category) {
    try {
      await deleteCategory(params.bookId, category.id);
      toast.success(`Categorie "${category.name}" is verwijderd.`);
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError, "Categorie verwijderen mislukt."));
    }
  }

  async function handleAssign(transactionId: string, categoryId: string) {
    const transaction = transactions.find((item) => item.id === transactionId);
    const category = categories.find((item) => item.id === categoryId);

    try {
      await assignCategory(params.bookId, transactionId, categoryId);

      if (transaction && category) {
        toast.success(`"${transaction.title}" is gekoppeld aan "${category.name}".`);
        return;
      }

      toast.success("Transactie is aan de categorie gekoppeld.");
    } catch (assignError) {
      toast.error(getErrorMessage(assignError, "Koppelen aan categorie mislukt."));
      throw assignError;
    }
  }

  if (!book) {
    return null;
  }

  const uncategorizedTransactions = transactions.filter((transaction) => !transaction.categoryId);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Categorieen"
        title={`Categorieen in ${book.name}`}
        description="Beheer je categorieen en koppel transacties."
        actions={<BookTabs bookId={book.id} pathname={pathname} />}
      />
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.95fr]">
        <div className="space-y-4">
          {categories.length === 0 ? (
            <EmptyState
              title="Nog geen categorieen"
              description="Voeg een categorie toe om te beginnen."
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
                      onClick={() => void handleDelete(category)}
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
        <div ref={formSectionRef} className="space-y-4">
          <CategoryForm
            mode={editingCategory ? "edit" : "create"}
            key={editingCategory ? `edit-${editingCategory.id}` : "create-category"}
            initialValue={
              editingCategory
                ? {
                    name: editingCategory.name,
                    budget: editingCategory.budget,
                    color: editingCategory.color,
                    endDate: editingCategory.endDate,
                  }
                : undefined
            }
            submitLabel={editingCategory ? "Werk categorie bij" : "Voeg categorie toe"}
            onSubmit={editingCategory ? handleUpdate : handleCreate}
            onCancel={editingCategory ? () => setEditingCategory(null) : undefined}
          />
        </div>
      </section>
      <CategoryDropBoard
        categories={categories}
        transactions={transactions}
        uncategorizedTransactions={uncategorizedTransactions}
        onAssign={handleAssign}
      />
    </div>
  );
}
