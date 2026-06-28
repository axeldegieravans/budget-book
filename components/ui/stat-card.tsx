import { cn } from "@/lib/utils/cn";

export function StatCard({
  label,
  value,
  hint,
  accent = "emerald",
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "emerald" | "amber" | "rose" | "sky";
}) {
  const accentStyles = {
    emerald: "from-emerald-500/10 to-emerald-50 text-emerald-700",
    amber: "from-amber-500/10 to-amber-50 text-amber-700",
    rose: "from-rose-500/10 to-rose-50 text-rose-700",
    sky: "from-sky-500/10 to-sky-50 text-sky-700",
  };

  return (
    <article
      className={cn(
        "rounded-[1.75rem] bg-gradient-to-br p-5 shadow-[0_16px_36px_rgba(15,23,42,0.08)]",
        accentStyles[accent],
      )}
    >
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      {hint ? <p className="mt-2 text-sm text-slate-600">{hint}</p> : null}
    </article>
  );
}
