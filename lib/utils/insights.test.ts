import {
  buildCategoryInsights,
  buildMonthlyInsights,
  getBookTotals,
  getCategoryBudgetStatus,
} from "@/lib/utils/insights";
import type { Category, Transaction } from "@/types/domain";

const categories: Category[] = [
  {
    id: "cat-1",
    name: "Boodschappen",
    budget: 300,
    color: "#10b981",
    createdAt: "",
    updatedAt: "",
  },
];

const transactions: Transaction[] = [
  {
    id: "tx-1",
    title: "Supermarkt",
    amount: 120,
    type: "expense",
    date: "2026-05-01",
    categoryId: "cat-1",
    createdBy: "user-1",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "tx-2",
    title: "Salaris",
    amount: 2000,
    type: "income",
    date: "2026-05-02",
    categoryId: null,
    createdBy: "user-1",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "tx-3",
    title: "Extra boodschappen",
    amount: 160,
    type: "expense",
    date: "2026-06-02",
    categoryId: "cat-1",
    createdBy: "user-1",
    createdAt: "",
    updatedAt: "",
  },
];

describe("insights utilities", () => {
  it("berekent budgetstatus inclusief warning/danger", () => {
    const status = getCategoryBudgetStatus(categories[0], transactions);

    expect(status.spent).toBe(280);
    expect(status.remaining).toBe(20);
    expect(status.tone).toBe("warning");
  });

  it("markeert een nulbudget met uitgaven als overschreden", () => {
    const zeroBudgetCategory: Category = {
      ...categories[0],
      budget: 0,
    };

    const status = getCategoryBudgetStatus(zeroBudgetCategory, transactions);

    expect(status.spent).toBe(280);
    expect(status.remaining).toBe(-280);
    expect(status.tone).toBe("danger");
    expect(status.label).toBe("Budget overschreden");
  });

  it("bouwt maandgrafiekdata en totalen", () => {
    const monthly = buildMonthlyInsights(transactions);
    const totals = getBookTotals(transactions);

    expect(monthly).toHaveLength(2);
    expect(totals.income).toBe(2000);
    expect(totals.expenses).toBe(280);
    expect(totals.balance).toBe(1720);
  });

  it("maakt categorie-inzichten voor staafdiagram", () => {
    const categoryInsights = buildCategoryInsights(categories, transactions);

    expect(categoryInsights).toEqual([
      {
        name: "Boodschappen",
        budget: 300,
        spent: 280,
      },
    ]);
  });
});
