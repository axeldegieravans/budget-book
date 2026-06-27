import { fireEvent, render, screen } from "@testing-library/react";

import { TransactionTable } from "@/components/transactions/transaction-table";

const categories = [
  {
    id: "cat-1",
    name: "Boodschappen",
    budget: 200,
    color: "#10b981",
    createdAt: "",
    updatedAt: "",
  },
];

const transactions = [
  {
    id: "tx-1",
    title: "Jumbo",
    amount: 45,
    type: "expense" as const,
    date: "2026-06-27",
    categoryId: "cat-1",
    notes: "weekboodschappen",
    createdBy: "user-1",
    createdAt: "",
    updatedAt: "",
  },
];

describe("TransactionTable", () => {
  it("laat transacties zien inclusief gekoppelde categorie", () => {
    render(
      <TransactionTable categories={categories} transactions={transactions} onDelete={jest.fn()} />,
    );

    expect(screen.getByText("Jumbo")).toBeInTheDocument();
    expect(screen.getByText("Boodschappen")).toBeInTheDocument();
    expect(screen.getByText("weekboodschappen")).toBeInTheDocument();
  });

  it("roept edit en delete acties aan", () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn().mockResolvedValue(undefined);

    render(
      <TransactionTable
        categories={categories}
        transactions={transactions}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Bewerk" }));
    fireEvent.click(screen.getByRole("button", { name: "Verwijder" }));

    expect(onEdit).toHaveBeenCalledWith(transactions[0]);
    expect(onDelete).toHaveBeenCalledWith("tx-1");
  });
});
