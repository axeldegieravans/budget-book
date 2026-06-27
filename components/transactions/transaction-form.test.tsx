import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { TransactionForm } from "@/components/transactions/transaction-form";

describe("TransactionForm", () => {
  it("maakt een transactie payload aan", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(
      <TransactionForm
        categories={[
          {
            id: "cat-1",
            name: "Boodschappen",
            budget: 200,
            color: "#10b981",
            createdAt: "",
            updatedAt: "",
          },
        ]}
        submitLabel="Voeg transactie toe"
        onSubmit={onSubmit}
      />,
    );

    fireEvent.change(screen.getByLabelText("Titel"), { target: { value: "Jumbo" } });
    fireEvent.change(screen.getByLabelText("Bedrag"), { target: { value: "45" } });
    fireEvent.change(screen.getByLabelText("Categorie"), { target: { value: "cat-1" } });
    fireEvent.change(screen.getByLabelText("Notities"), { target: { value: "weekboodschappen" } });
    fireEvent.click(screen.getByRole("button", { name: "Voeg transactie toe" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Jumbo",
          amount: 45,
          categoryId: "cat-1",
          notes: "weekboodschappen",
        }),
      ),
    );
  });
});
