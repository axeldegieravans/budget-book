import { render, screen } from "@testing-library/react";

import { CategoryBudgetCard } from "@/components/categories/category-budget-card";

describe("CategoryBudgetCard", () => {
  it("toont budgetstatus voor een overschreden categorie", () => {
    render(
      <CategoryBudgetCard
        category={{
          id: "cat-1",
          name: "Boodschappen",
          budget: 25,
          color: "#10b981",
          createdAt: "",
          updatedAt: "",
        }}
        transactions={[
          {
            id: "tx-1",
            title: "Supermarkt",
            amount: 30,
            type: "expense",
            date: "2026-06-28",
            categoryId: "cat-1",
            createdBy: "user-1",
            createdAt: "",
            updatedAt: "",
          },
        ]}
        actions={<button type="button">Bewerk</button>}
      />,
    );

    expect(screen.getByText("Boodschappen")).toBeInTheDocument();
    expect(screen.getByText(/Budget:/)).toHaveTextContent("Budget: € 25,00");
    expect(screen.getByText(/Besteed:/)).toHaveTextContent("Besteed: € 30,00");
    expect(screen.getByText(/Resterend:/)).toHaveTextContent("Resterend: € -5,00");
    expect(screen.getByText("Budget overschreden")).toHaveClass("border-rose-200");
    expect(screen.getByRole("button", { name: "Bewerk" })).toBeInTheDocument();
  });
});
