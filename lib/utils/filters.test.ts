import { defaultTransactionFilters, filterTransactions } from "@/lib/utils/filters";
import type { Transaction } from "@/types/domain";

const transactions: Transaction[] = [
  {
    id: "1",
    title: "Albert Heijn",
    amount: 20,
    type: "expense",
    date: "2026-05-02",
    categoryId: "food",
    notes: "avondeten",
    createdBy: "user",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "2",
    title: "Freelance factuur",
    amount: 200,
    type: "income",
    date: "2026-06-12",
    categoryId: null,
    createdBy: "user",
    createdAt: "",
    updatedAt: "",
  },
];

describe("filterTransactions", () => {
  it("filtert op query, type, categorie en maand", () => {
    const result = filterTransactions(transactions, {
      ...defaultTransactionFilters,
      query: "albert",
      type: "expense",
      categoryId: "food",
      month: "2026-05",
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });
});
