"use client";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { CategoryDropBoard } from "@/components/categories/category-drop-board";

jest.mock("@dnd-kit/core", () => {
  const pointerWithin = jest.fn();

  return {
    DndContext: ({
      children,
      collisionDetection,
      onDragStart,
      onDragEnd,
      onDragCancel,
    }: {
      children: React.ReactNode;
      collisionDetection?: (...args: unknown[]) => unknown;
      onDragStart?: (event: { active: { id: string } }) => void;
      onDragEnd?: (event: { active: { id: string }; over: { id: string } | null }) => void;
      onDragCancel?: () => void;
    }) => {
      collisionDetection?.({});

      return (
        <div>
          <button type="button" onClick={() => onDragStart?.({ active: { id: "tx-1" } })}>
            Mock drag start
          </button>
          <button
            type="button"
            onClick={() => onDragEnd?.({ active: { id: "tx-1" }, over: { id: "cat-1" } })}
          >
            Mock drag end success
          </button>
          <button
            type="button"
            onClick={() => onDragEnd?.({ active: { id: "tx-1" }, over: null })}
          >
            Mock drag end none
          </button>
          <button type="button" onClick={() => onDragCancel?.()}>
            Mock drag cancel
          </button>
          {children}
        </div>
      );
    },
    DragOverlay: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="drag-overlay">{children}</div>
    ),
    MouseSensor: function MouseSensor() {},
    PointerSensor: function PointerSensor() {},
    TouchSensor: function TouchSensor() {},
    pointerWithin,
    useDraggable: () => ({
      attributes: {},
      listeners: {},
      setNodeRef: jest.fn(),
      transform: null,
      isDragging: false,
    }),
    useDroppable: () => ({
      setNodeRef: jest.fn(),
      isOver: false,
    }),
    useSensor: jest.fn((_sensor, config) => ({ config })),
    useSensors: jest.fn((...sensors) => sensors),
  };
});

jest.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Translate: {
      toString: () => undefined,
    },
  },
}));

const categories = [
  {
    id: "cat-1",
    name: "Boodschappen",
    budget: 20,
    color: "#10b981",
    createdAt: "",
    updatedAt: "",
  },
  {
    id: "cat-2",
    name: "Vervoer",
    budget: 50,
    color: "#0ea5e9",
    createdAt: "",
    updatedAt: "",
  },
];

const uncategorizedTransactions = [
  {
    id: "tx-1",
    title: "Zalm",
    amount: 10,
    type: "expense" as const,
    date: "2026-06-28",
    categoryId: null,
    notes: "",
    createdBy: "user-1",
    createdAt: "",
    updatedAt: "",
  },
];

describe("CategoryDropBoard", () => {
  it("koppelt de laatste transactie via de knop en toont daarna de lege staat", async () => {
    const onAssign = jest.fn().mockResolvedValue(undefined);

    render(
      <CategoryDropBoard
        categories={categories}
        transactions={uncategorizedTransactions}
        uncategorizedTransactions={uncategorizedTransactions}
        onAssign={onAssign}
      />,
    );

    fireEvent.click(screen.getAllByRole("button", { name: "Koppel laatste" })[0]);

    await waitFor(() => {
      expect(onAssign).toHaveBeenCalledWith("tx-1", "cat-1");
      expect(screen.getByText("Alles is al aan een categorie gekoppeld.")).toBeInTheDocument();
    });
  });

  it("toont de drag overlay en annuleert een drag zonder koppeling", () => {
    const onAssign = jest.fn().mockResolvedValue(undefined);

    render(
      <CategoryDropBoard
        categories={categories}
        transactions={uncategorizedTransactions}
        uncategorizedTransactions={uncategorizedTransactions}
        onAssign={onAssign}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Mock drag start" }));

    expect(screen.getByText("Sleep naar een categorie ...")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mock drag end none" }));

    expect(onAssign).not.toHaveBeenCalled();
    expect(screen.queryByText("Sleep naar een categorie ...")).not.toBeInTheDocument();
  });

  it("herstel de transactie wanneer koppelen mislukt en annuleert een drag", async () => {
    const onAssign = jest.fn().mockRejectedValue(new Error("Mislukt"));

    render(
      <CategoryDropBoard
        categories={categories}
        transactions={uncategorizedTransactions}
        uncategorizedTransactions={uncategorizedTransactions}
        onAssign={onAssign}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Mock drag end success" }));

    await waitFor(() => {
      expect(onAssign).toHaveBeenCalledWith("tx-1", "cat-1");
      expect(screen.getByText("Zalm")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Mock drag start" }));
    fireEvent.click(screen.getByRole("button", { name: "Mock drag cancel" }));

    expect(screen.queryByText("Sleep naar een categorie ...")).not.toBeInTheDocument();
  });
});
