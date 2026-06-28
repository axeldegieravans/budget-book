import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { BookForm } from "@/components/books/book-form";

describe("BookForm", () => {
  it("stuurt naam en omschrijving door", async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<BookForm mode="create" submitLabel="Maak boekje aan" onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText("Naam"), {
      target: { value: "Vakantie 2026" },
    });
    fireEvent.change(screen.getByLabelText("Omschrijving"), {
      target: { value: "Budget voor zomertrip" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Maak boekje aan" }));

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Vakantie 2026",
        description: "Budget voor zomertrip",
      }),
    );
  });
});
