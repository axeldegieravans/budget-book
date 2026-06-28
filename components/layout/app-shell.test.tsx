"use client";

import { fireEvent, render, screen } from "@testing-library/react";

import { AppShell } from "@/components/layout/app-shell";

const logout = jest.fn();

jest.mock("@/lib/services/auth-service", () => ({
  logout: () => logout(),
}));

describe("AppShell", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rendert navigatie en logt uit", () => {
    render(
      <AppShell userName="Axel">
        <div>Dashboard inhoud</div>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "Huishoudboekje" })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: "Overzicht" })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: "Boekjes" })).toHaveAttribute("href", "/books");
    expect(screen.getByRole("link", { name: "Archief" })).toHaveAttribute(
      "href",
      "/books/archived",
    );
    expect(screen.getByText("Axel")).toBeInTheDocument();
    expect(screen.getByText("Dashboard inhoud")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Uitloggen" }));

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
