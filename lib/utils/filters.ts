import type { Transaction, TransactionFilters } from "@/types/domain";

export const defaultTransactionFilters: TransactionFilters = {
  query: "",
  type: "all",
  categoryId: "all",
  month: "all",
};

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
) {
  return transactions.filter((transaction) => {
    const matchesQuery =
      !filters.query ||
      transaction.title.toLowerCase().includes(filters.query.toLowerCase()) ||
      transaction.notes?.toLowerCase().includes(filters.query.toLowerCase());
    const matchesType = filters.type === "all" || transaction.type === filters.type;
    const matchesCategory =
      filters.categoryId === "all" || transaction.categoryId === filters.categoryId;
    const matchesMonth =
      filters.month === "all" || transaction.date.slice(0, 7) === filters.month;

    return matchesQuery && matchesType && matchesCategory && matchesMonth;
  });
}
