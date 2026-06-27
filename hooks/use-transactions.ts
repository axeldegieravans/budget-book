"use client";

import { useEffect, useMemo, useState } from "react";

import { subscribeToTransactions } from "@/lib/services/transaction-service";
import { defaultTransactionFilters, filterTransactions } from "@/lib/utils/filters";
import type { TransactionFilters } from "@/types/domain";

export function useTransactions(bookId?: string, filters: TransactionFilters = defaultTransactionFilters) {
  const [transactions, setTransactions] = useState<import("@/types/domain").Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) {
      return;
    }
    const unsubscribe = subscribeToTransactions(bookId, (nextTransactions) => {
      setTransactions(nextTransactions);
      setLoading(false);
    });

    return unsubscribe;
  }, [bookId]);

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, filters),
    [filters, transactions],
  );

  return {
    transactions: bookId ? transactions : [],
    filteredTransactions: bookId ? filteredTransactions : [],
    loading: bookId ? loading : false,
    error: null,
  };
}
