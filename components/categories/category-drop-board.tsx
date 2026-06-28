"use client";

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";

import { formatCurrency } from "@/lib/utils/format";
import { getCategoryBudgetStatus } from "@/lib/utils/insights";
import type { Category, Transaction } from "@/types/domain";

const POINTER_DRAG_DISTANCE = 8;
const TOUCH_DRAG_DELAY_MS = 150;
const TOUCH_DRAG_TOLERANCE = 6;

function TransactionCard({
  transaction,
  isDragging = false,
  isGhost = false,
}: {
  transaction: Transaction;
  isDragging?: boolean;
  isGhost?: boolean;
}) {
  return (
    <div
      className={`w-full rounded-2xl border border-white/60 bg-white p-4 text-left shadow-sm transition ${
        isDragging ? "scale-[1.02] shadow-lg" : "hover:shadow-md"
      } ${isGhost ? "opacity-0" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">{transaction.title}</p>
          <p className="mt-1 text-sm text-slate-500">
            Sleep naar een categorie {isDragging ? "..." : ""}
          </p>
        </div>
        <span className="text-sm font-semibold text-slate-700">
          {formatCurrency(transaction.amount)}
        </span>
      </div>
    </div>
  );
}

function DraggableTransaction({ transaction }: { transaction: Transaction }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: transaction.id,
  });

  return (
    <button
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      className="w-full"
    >
      <TransactionCard transaction={transaction} isDragging={isDragging} isGhost={isDragging} />
    </button>
  );
}

function DroppableCategory({
  category,
  remaining,
  onAssignLatest,
}: {
  category: Category;
  remaining: number;
  onAssignLatest: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: category.id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-[1.5rem] border p-4 transition ${
        isOver ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
            <span className="font-semibold text-slate-900">{category.name}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Resterend: {formatCurrency(remaining)}
          </p>
        </div>
        <button
          type="button"
          onClick={onAssignLatest}
          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
        >
          Koppel laatste
        </button>
      </div>
    </div>
  );
}

export function CategoryDropBoard({
  categories,
  transactions,
  uncategorizedTransactions,
  onAssign,
}: {
  categories: Category[];
  transactions: Transaction[];
  uncategorizedTransactions: Transaction[];
  onAssign: (transactionId: string, categoryId: string) => Promise<void>;
}) {
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(null);
  const [pendingAssignments, setPendingAssignments] = useState<string[]>([]);

  const visibleTransactions = useMemo(
    () =>
      uncategorizedTransactions.filter(
        (transaction) => !pendingAssignments.includes(transaction.id),
      ),
    [pendingAssignments, uncategorizedTransactions],
  );
  const categoryBudgetStatuses = useMemo(
    () =>
      new Map(
        categories.map((category) => [category.id, getCategoryBudgetStatus(category, transactions)]),
      ),
    [categories, transactions],
  );

  const activeTransaction =
    visibleTransactions.find((transaction) => transaction.id === activeTransactionId) ??
    uncategorizedTransactions.find((transaction) => transaction.id === activeTransactionId) ??
    null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: POINTER_DRAG_DISTANCE },
    }),
    useSensor(MouseSensor, {
      activationConstraint: { distance: POINTER_DRAG_DISTANCE },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: TOUCH_DRAG_DELAY_MS, tolerance: TOUCH_DRAG_TOLERANCE },
    }),
  );

  const collisionDetection: CollisionDetection = (args) => {
    return pointerWithin(args);
  };

  function handleDragStart(event: { active: { id: string | number } }) {
    setActiveTransactionId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveTransactionId(null);

    if (!event.over) {
      return;
    }

    const transactionId = String(event.active.id);
    const categoryId = String(event.over.id);

    setPendingAssignments((current) =>
      current.includes(transactionId) ? current : [...current, transactionId],
    );

    try {
      await onAssign(transactionId, categoryId);
    } catch {
      setPendingAssignments((current) => current.filter((item) => item !== transactionId));
    }
  }

  function handleDragCancel() {
    setActiveTransactionId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <section className="space-y-4 rounded-[1.75rem] border border-white/60 bg-white/90 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Niet gekoppelde transacties</h3>
          <div className="space-y-3">
            {visibleTransactions.map((transaction) => (
              <DraggableTransaction key={transaction.id} transaction={transaction} />
            ))}
            {visibleTransactions.length === 0 ? (
              <p className="text-sm text-slate-500">Alles is al aan een categorie gekoppeld.</p>
            ) : null}
          </div>
        </section>
        <section className="space-y-4 rounded-[1.75rem] border border-white/60 bg-white/90 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Sleep naar een categorie</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {categories.map((category) => (
              <DroppableCategory
                key={category.id}
                category={category}
                remaining={
                  categoryBudgetStatuses.get(category.id)?.remaining ?? category.budget
                }
                onAssignLatest={() => {
                  const latest = visibleTransactions[0];
                  if (latest) {
                    setPendingAssignments((current) =>
                      current.includes(latest.id) ? current : [...current, latest.id],
                    );
                    void onAssign(latest.id, category.id).catch(() => {
                      setPendingAssignments((current) =>
                        current.filter((item) => item !== latest.id),
                      );
                    });
                  }
                }}
              />
            ))}
          </div>
        </section>
      </div>
      <DragOverlay>
        {activeTransaction ? (
          <div className="w-[min(26rem,calc(100vw-3rem))]">
            <TransactionCard transaction={activeTransaction} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
