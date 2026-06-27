"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import type { Category, Transaction } from "@/types/domain";

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
      className="w-full rounded-2xl border border-white/60 bg-white p-4 text-left shadow-sm transition hover:shadow-md"
    >
      <p className="font-medium text-slate-900">{transaction.title}</p>
      <p className="mt-1 text-sm text-slate-500">
        Sleep naar een categorie {isDragging ? "..." : ""}
      </p>
    </button>
  );
}

function DroppableCategory({
  category,
  onAssignLatest,
}: {
  category: Category;
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
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
          <span className="font-semibold text-slate-900">{category.name}</span>
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
  uncategorizedTransactions,
  onAssign,
}: {
  categories: Category[];
  uncategorizedTransactions: Transaction[];
  onAssign: (transactionId: string, categoryId: string) => Promise<void>;
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over) {
      return;
    }

    void onAssign(String(event.active.id), String(event.over.id));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
        <section className="space-y-4 rounded-[1.75rem] border border-white/60 bg-white/90 p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Niet gekoppelde transacties</h3>
          <div className="space-y-3">
            {uncategorizedTransactions.map((transaction) => (
              <DraggableTransaction key={transaction.id} transaction={transaction} />
            ))}
            {uncategorizedTransactions.length === 0 ? (
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
                onAssignLatest={() => {
                  const latest = uncategorizedTransactions[0];
                  if (latest) {
                    void onAssign(latest.id, category.id);
                  }
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </DndContext>
  );
}
