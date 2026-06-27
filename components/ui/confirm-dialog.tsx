"use client";

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-rose-100 bg-rose-50/80 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h4 className="font-semibold text-rose-950">{title}</h4>
          <p className="text-sm text-rose-800">{description}</p>
        </div>
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
