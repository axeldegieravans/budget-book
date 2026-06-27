export type BookRole = "owner" | "member";
export type TransactionType = "expense" | "income";
export type BudgetTone = "healthy" | "warning" | "danger";

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface HouseholdBook {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  role: BookRole;
}

export interface Category {
  id: string;
  name: string;
  budget: number;
  endDate?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string;
  categoryId?: string | null;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetStatus {
  spent: number;
  remaining: number;
  usageRatio: number;
  tone: BudgetTone;
  label: string;
}

export interface MonthlyInsightPoint {
  month: string;
  expenses: number;
  income: number;
}

export interface CategoryInsightPoint {
  name: string;
  spent: number;
  budget: number;
}

export interface TransactionFilters {
  query: string;
  type: "all" | TransactionType;
  categoryId: string;
  month: string;
}

export interface BookFormValues {
  name: string;
  description: string;
}

export interface CategoryFormValues {
  name: string;
  budget: number;
  color: string;
  endDate?: string;
}

export interface TransactionFormValues {
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId?: string;
  notes?: string;
}
