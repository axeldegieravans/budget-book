import { fireEvent, render, screen } from "@testing-library/react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";

describe("UI primitives", () => {
  it("rendert een confirm dialog en bevestigt de actie", () => {
    const onConfirm = jest.fn();

    render(
      <ConfirmDialog
        title="Verwijder boekje"
        description="Deze actie kan niet ongedaan worden gemaakt."
        confirmLabel="Bevestig"
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByText("Verwijder boekje")).toBeInTheDocument();
    expect(screen.getByText("Deze actie kan niet ongedaan worden gemaakt.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Bevestig" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("rendert een empty state met actie", () => {
    render(
      <EmptyState
        title="Nog niets hier"
        description="Voeg eerst een item toe."
        action={<button type="button">Nieuw item</button>}
      />,
    );

    expect(screen.getByText("Nog niets hier")).toBeInTheDocument();
    expect(screen.getByText("Voeg eerst een item toe.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Nieuw item" })).toBeInTheDocument();
  });

  it("rendert een page header met eyebrow en acties", () => {
    render(
      <PageHeader
        eyebrow="Dashboard"
        title="Overzicht"
        description="Alles in een oogopslag."
        actions={<button type="button">Actie</button>}
      />,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Overzicht" })).toBeInTheDocument();
    expect(screen.getByText("Alles in een oogopslag.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actie" })).toBeInTheDocument();
  });

  it("rendert een stat card met accent en hint", () => {
    render(<StatCard label="Saldo" value="€ 10,00" hint="Laatste update vandaag" accent="rose" />);

    expect(screen.getByText("Saldo")).toBeInTheDocument();
    expect(screen.getByText("€ 10,00")).toBeInTheDocument();
    expect(screen.getByText("Laatste update vandaag")).toBeInTheDocument();
  });
});
