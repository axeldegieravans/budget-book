"use client";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { ShareBookForm } from "@/components/books/share-book-form";

const success = jest.fn();
const error = jest.fn();

jest.mock("@/providers/toast-provider", () => ({
  useToast: () => ({
    success,
    error,
  }),
}));

describe("ShareBookForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deelt een boekje succesvol", async () => {
    const onShare = jest.fn().mockResolvedValue(undefined);

    render(<ShareBookForm onShare={onShare} />);

    fireEvent.change(screen.getByPlaceholderText("teamgenoot@student.nl"), {
      target: { value: "vriend@student.nl" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Deel boekje" }));

    await waitFor(() => {
      expect(onShare).toHaveBeenCalledWith("vriend@student.nl");
      expect(success).toHaveBeenCalledWith("Boekje is gedeeld met vriend@student.nl.");
    });

    expect(screen.getByText("Boekje succesvol gedeeld.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("teamgenoot@student.nl")).toHaveValue("");
  });

  it("toont een foutmelding wanneer delen mislukt", async () => {
    const onShare = jest.fn().mockRejectedValue(new Error("Gebruiker niet gevonden."));

    render(<ShareBookForm onShare={onShare} />);

    fireEvent.change(screen.getByPlaceholderText("teamgenoot@student.nl"), {
      target: { value: "fout@student.nl" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Deel boekje" }));

    expect(await screen.findByText("Gebruiker niet gevonden.")).toBeInTheDocument();
    expect(error).toHaveBeenCalledWith("Gebruiker niet gevonden.");
  });
});
