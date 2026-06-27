"use client";

import { useEffect, useState } from "react";

import { subscribeToBook, subscribeToBooks } from "@/lib/services/book-service";
import type { HouseholdBook } from "@/types/domain";

export function useBooks(userId?: string, archived = false) {
  const [books, setBooks] = useState<HouseholdBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const unsubscribe = subscribeToBooks(
      userId,
      (nextBooks) => {
        setBooks(nextBooks);
        setLoading(false);
      },
      { archived },
    );

    return unsubscribe;
  }, [archived, userId]);

  return { books: userId ? books : [], loading: userId ? loading : false, error: null };
}

export function useBook(bookId?: string) {
  const [book, setBook] = useState<HouseholdBook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) {
      return;
    }
    const unsubscribe = subscribeToBook(bookId, (nextBook) => {
      setBook(nextBook);
      setLoading(false);
    });

    return unsubscribe;
  }, [bookId]);

  return { book: bookId ? book : null, loading: bookId ? loading : false, error: null };
}
