"use client";

import { BookCard } from "@/components/books/book-card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { useAuth } from "@/hooks/use-auth";
import { useBooks } from "@/hooks/use-books";
import { restoreBook } from "@/lib/services/book-service";

export default function ArchivedBooksPage() {
  const { user } = useAuth();
  const { books, loading } = useBooks(user?.uid, true);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Archief"
        title="Gearchiveerde boekjes"
        description="Hier staan boekjes die niet meer in je normale overzicht zichtbaar zijn. Je kunt ze altijd herstellen."
      />
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-[1.75rem] bg-white/80 p-6 text-sm text-slate-600 shadow-sm">
            Archief laden...
          </div>
        ) : books.length === 0 ? (
          <EmptyState
            title="Archief is leeg"
            description="Zodra je een boekje archiveert verschijnt het hier."
          />
        ) : (
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              actions={
                <button
                  type="button"
                  onClick={() => void restoreBook(book.id)}
                  className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                >
                  Herstel
                </button>
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
