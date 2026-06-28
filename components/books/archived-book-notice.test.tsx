import { render, screen } from "@testing-library/react";

import { ArchivedBookNotice } from "@/components/books/archived-book-notice";

describe("ArchivedBookNotice", () => {
  it("toont de archiefmelding met link naar het archief", () => {
    render(<ArchivedBookNotice />);

    expect(screen.getByText("Dit boekje is gearchiveerd")).toBeInTheDocument();
    expect(
      screen.getByText("Herstel het boekje eerst vanuit het archief om het weer te gebruiken."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ga naar archief" })).toHaveAttribute(
      "href",
      "/books/archived",
    );
  });
});
