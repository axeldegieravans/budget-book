"use client";

import { act, fireEvent, render, screen } from "@testing-library/react";

import { ToastProvider, useToast } from "@/providers/toast-provider";

function ToastHarness() {
  const toast = useToast();

  return (
    <div>
      <button type="button" onClick={() => toast.success("Gelukt")}>
        Toon succes
      </button>
      <button type="button" onClick={() => toast.error("Fout gegaan")}>
        Toon fout
      </button>
    </div>
  );
}

describe("ToastProvider", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("toont en sluit een succesmelding", () => {
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Toon succes" }));

    expect(screen.getByText("Gelukt")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sluit melding" }));

    expect(screen.queryByText("Gelukt")).not.toBeInTheDocument();
  });

  it("verwijdert een foutmelding automatisch na de timeout", () => {
    render(
      <ToastProvider>
        <ToastHarness />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Toon fout" }));

    expect(screen.getByText("Fout gegaan")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(screen.queryByText("Fout gegaan")).not.toBeInTheDocument();
  });

  it("gooit een fout buiten de provider", () => {
    function InvalidHarness() {
      useToast();
      return null;
    }

    expect(() => render(<InvalidHarness />)).toThrow("useToast must be used within a ToastProvider.");
  });
});
