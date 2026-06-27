"use client";

import Link from "next/link";
import { useState } from "react";

import { BookCard } from "@/components/books/book-card";
import { BookForm } from "@/components/books/book-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/hooks/use-auth";
import { useBooks } from "@/hooks/use-books";
import { archiveBook, createBook, updateBook } from "@/lib/services/book-service";
import { getErrorMessage } from "@/lib/utils/errors";
import { useToast } from "@/providers/toast-provider";
import type { HouseholdBook } from "@/types/domain";

export default function BooksPage() {
  const { user } = useAuth();
  const { books, loading, error } = useBooks(user?.uid);
  const toast = useToast();
  const [editingBook, setEditingBook] = useState<HouseholdBook | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<HouseholdBook | null>(null);

  const ownedBooks = books.filter((book) => book.role === "owner");
  const sharedBooks = books.filter((book) => book.role === "member");

  async function handleCreate(values: { name: string; description: string }) {
    if (!user) {
      return;
    }

    try {
      await createBook(user.uid, values);
      toast.success(`Boekje "${values.name}" is aangemaakt.`);
    } catch (createError) {
      toast.error(getErrorMessage(createError, "Boekje aanmaken mislukt."));
      throw createError;
    }
  }

  async function handleUpdate(values: { name: string; description: string }) {
    if (!editingBook) {
      return;
    }

    try {
      await updateBook(editingBook.id, values);
      toast.success(`Boekje "${values.name}" is bijgewerkt.`);
      setEditingBook(null);
    } catch (updateError) {
      toast.error(getErrorMessage(updateError, "Boekje bijwerken mislukt."));
      throw updateError;
    }
  }

  async function handleArchive() {
    if (!archiveTarget) {
      return;
    }

    try {
      await archiveBook(archiveTarget.id);
      toast.success(`Boekje "${archiveTarget.name}" is gearchiveerd.`);
      setArchiveTarget(null);
    } catch (archiveError) {
      toast.error(getErrorMessage(archiveError, "Boekje archiveren mislukt."));
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Boekjes"
        title="Jouw huishoudboekjes"
        description="Beheer meerdere budgetten naast elkaar, bijvoorbeeld voor thuis, een projectgroep of een vakantiepot."
        actions={
          <Link
            href="/books/archived"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Bekijk archief
          </Link>
        }
      />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Totaal boekjes"
          value={String(books.length)}
          hint="Alle actieve boekjes waar jij toegang tot hebt."
          accent="emerald"
        />
        <StatCard
          label="Van jou"
          value={String(ownedBooks.length)}
          hint="Boekjes die jij zelf beheert en kunt delen of archiveren."
          accent="sky"
        />
        <StatCard
          label="Gedeeld"
          value={String(sharedBooks.length)}
          hint="Boekjes die door iemand anders met jou gedeeld zijn."
          accent="amber"
        />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <div className="space-y-4">
          {loading ? (
            <div className="rounded-[1.75rem] bg-white/80 p-6 text-sm text-slate-600 shadow-sm">
              Boekjes laden...
            </div>
          ) : books.length === 0 ? (
            <EmptyState
              title="Nog geen boekjes"
              description="Maak je eerste huishoudboekje aan om transacties, categorieen en inzichten bij te houden."
            />
          ) : (
            <div className="space-y-4">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={book.role === "owner" ? () => setEditingBook(book) : undefined}
                  onArchive={book.role === "owner" ? () => setArchiveTarget(book) : undefined}
                />
              ))}
            </div>
          )}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
        <div className="space-y-4">
          <BookForm submitLabel="Maak boekje aan" onSubmit={handleCreate} />
          {archiveTarget ? (
            <ConfirmDialog
              title={`Archiveer "${archiveTarget.name}"`}
              description="Het boekje verdwijnt uit dit overzicht en komt in het archief terecht. Je kunt het later altijd herstellen."
              confirmLabel="Bevestig archiveren"
              onConfirm={() => void handleArchive()}
            />
          ) : null}
          {editingBook ? (
            <BookForm
              initialValue={{
                name: editingBook.name,
                description: editingBook.description,
              }}
              submitLabel="Sla wijzigingen op"
              onSubmit={handleUpdate}
            />
          ) : null}
          {!editingBook && !archiveTarget ? (
            <div className="rounded-[1.9rem] border border-dashed border-emerald-200 bg-emerald-50/70 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Sneller werken met boekjes</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Geef elk boekje een duidelijke naam, bijvoorbeeld per huis, project of reis. Dan blijven overzicht, categorieen en transacties later veel makkelijker scanbaar.
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
