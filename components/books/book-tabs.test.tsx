import { render, screen } from "@testing-library/react";

import { BookTabs } from "@/components/books/book-tabs";

describe("BookTabs", () => {
  it("rendert alle tabs en markeert de actieve route", () => {
    render(<BookTabs bookId="book-1" pathname="/books/book-1/categories" />);

    expect(screen.getByRole("link", { name: "Overzicht" })).toHaveAttribute("href", "/books/book-1");
    expect(screen.getByRole("link", { name: "Transacties" })).toHaveAttribute(
      "href",
      "/books/book-1/transactions",
    );
    expect(screen.getByRole("link", { name: "Categorieen" })).toHaveClass("bg-emerald-600");
    expect(screen.getByRole("link", { name: "Inzichten" })).toHaveAttribute(
      "href",
      "/books/book-1/insights",
    );
  });
});
