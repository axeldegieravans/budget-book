"use client";

import { useEffect, useState } from "react";

import { subscribeToCategories } from "@/lib/services/category-service";
import type { Category } from "@/types/domain";

export function useCategories(bookId?: string) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) {
      return;
    }
    const unsubscribe = subscribeToCategories(bookId, (nextCategories) => {
      setCategories(nextCategories);
      setLoading(false);
    });

    return unsubscribe;
  }, [bookId]);

  return { categories: bookId ? categories : [], loading: bookId ? loading : false, error: null };
}
