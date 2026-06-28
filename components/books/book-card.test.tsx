import { fireEvent, render, screen } from "@testing-library/react";

import { BookCard } from "@/components/books/book-card";

describe("BookCard", () => {
  it("rendert boekinformatie en voert acties uit", () => {
    const onEdit = jest.fn();
    const onArchive = jest.fn();

    render(
      <BookCard
        book={{
          id: "book-1",
          name: "Huishouden",
          description: "",
          ownerId: "user-1",
          memberIds: [],
          isArchived: true,
          createdAt: "2026-06-20T12:00:00.000Z",
          updatedAt: "2026-06-21T09:30:00.000Z",
          role: "member",
        }}
        actions={<button type="button">Herstel</button>}
        onEdit={onEdit}
        onArchive={onArchive}
      />,
    );

    expect(screen.getByText("Huishouden")).toBeInTheDocument();
    expect(screen.getByText("Gedeeld")).toBeInTheDocument();
    expect(screen.getByText("Archief")).toBeInTheDocument();
    expect(screen.getByText("Nog geen omschrijving toegevoegd.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open boekje" })).toHaveAttribute("href", "/books/book-1");
    expect(screen.getByText("Gedeeld met jou")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Herstel" }));
    fireEvent.click(screen.getByRole("button", { name: "Bewerk" }));
    fireEvent.click(screen.getByRole("button", { name: "Archiveer" }));

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onArchive).toHaveBeenCalledTimes(1);
  });
});
