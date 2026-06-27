import Link from "next/link";

import { cn } from "@/lib/utils/cn";

const tabs = [
  { suffix: "", label: "Overzicht" },
  { suffix: "/transactions", label: "Transacties" },
  { suffix: "/categories", label: "Categorieen" },
  { suffix: "/insights", label: "Inzichten" },
];

export function BookTabs({ bookId, pathname }: { bookId: string; pathname: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const href = `/books/${bookId}${tab.suffix}`;
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              isActive
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                : "bg-white text-slate-600 hover:bg-slate-100",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
