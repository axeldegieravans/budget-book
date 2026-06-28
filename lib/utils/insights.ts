import type {
  BudgetStatus,
  Category,
  CategoryInsightPoint,
  MonthlyInsightPoint,
  Transaction,
} from "@/types/domain";

const OVER_BUDGET_RATIO = 1;
const WARNING_BUDGET_RATIO = 0.8;

function getCategorySpent(categoryId: string, transactions: Transaction[]) {
  return transactions
    .filter((transaction) => transaction.type === "expense" && transaction.categoryId === categoryId)
    .reduce((total, transaction) => total + transaction.amount, 0);
}

export function getCategoryBudgetStatus(
  category: Category,
  transactions: Transaction[],
): BudgetStatus {
  const spent = getCategorySpent(category.id, transactions);
  const remaining = category.budget - spent;

  if (category.budget <= 0) {
    return {
      spent,
      remaining,
      usageRatio: spent > 0 ? 1 : 0,
      tone: spent > 0 ? "danger" : "healthy",
      label: spent > 0 ? "Budget overschreden" : "Budget op schema",
    };
  }

  const usageRatio = spent / category.budget;

  if (usageRatio >= OVER_BUDGET_RATIO) {
    return {
      spent,
      remaining,
      usageRatio,
      tone: "danger",
      label: "Budget overschreden",
    };
  }

  if (usageRatio >= WARNING_BUDGET_RATIO) {
    return {
      spent,
      remaining,
      usageRatio,
      tone: "warning",
      label: "Budget bijna op",
    };
  }

  return {
    spent,
    remaining,
    usageRatio,
    tone: "healthy",
    label: "Budget op schema",
  };
}

export function buildMonthlyInsights(transactions: Transaction[]): MonthlyInsightPoint[] {
  const monthMap = new Map<string, MonthlyInsightPoint>();

  transactions.forEach((transaction) => {
    const month = transaction.date.slice(0, 7);
    const label = new Intl.DateTimeFormat("nl-NL", {
      month: "short",
      year: "2-digit",
    }).format(new Date(`${month}-01`));
    const current = monthMap.get(month) ?? { month: label, expenses: 0, income: 0 };

    if (transaction.type === "expense") {
      current.expenses += transaction.amount;
    } else {
      current.income += transaction.amount;
    }

    monthMap.set(month, current);
  });

  return [...monthMap.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => value);
}

export function buildCategoryInsights(
  categories: Category[],
  transactions: Transaction[],
): CategoryInsightPoint[] {
  return categories.map((category) => ({
    name: category.name,
    budget: category.budget,
    spent: getCategorySpent(category.id, transactions),
  }));
}

export function getBookTotals(transactions: Transaction[]) {
  return transactions.reduce(
    (totals, transaction) => {
      if (transaction.type === "expense") {
        totals.expenses += transaction.amount;
      } else {
        totals.income += transaction.amount;
      }

      totals.balance = totals.income - totals.expenses;

      return totals;
    },
    { income: 0, expenses: 0, balance: 0 },
  );
}
