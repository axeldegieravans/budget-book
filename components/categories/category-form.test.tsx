import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { CategoryForm } from "@/components/categories/category-form";

describe("CategoryForm", () => {
  it("verstuurd category waarden inclusief budget en kleur", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<CategoryForm mode="create" submitLabel="Voeg categorie toe" onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Naam"), {
      target: { value: "Boodschappen" },
    });
    fireEvent.change(screen.getByLabelText("Budget"), {
      target: { value: "250" },
    });
    fireEvent.change(screen.getByLabelText("Kleur"), {
      target: { value: "#ff0000" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Voeg categorie toe" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Boodschappen",
        budget: 250,
        color: "#ff0000",
        endDate: undefined,
      }),
    );
  });
});
