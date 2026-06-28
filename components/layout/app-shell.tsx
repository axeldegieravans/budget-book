"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logout } from "@/lib/services/auth-service";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { href: "/dashboard", label: "Overzicht" },
  { href: "/books", label: "Boekjes" },
  { href: "/books/archived", label: "Archief" },
];

export function AppShell({
  userName,
  children,
}: {
  userName?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#ecfdf5_100%)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 md:px-6">
        <header className="sticky top-6 z-20 mb-6 rounded-[2rem] border border-white/60 bg-white/85 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Link href="/dashboard" className="text-lg font-semibold tracking-tight text-slate-900">
                Huishoudboekje
              </Link>
              <p className="text-sm text-slate-500">Houd je geldzaken netjes bij</p>
            </div>
            <nav className="flex flex-wrap items-center gap-2">
              {navigation.map((item) => {
                const isBooksRoot = item.href === "/books";
                const isActive = isBooksRoot
                  ? pathname === "/books" || pathname.startsWith("/books/")
                    ? !pathname.startsWith("/books/archived")
                    : false
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
                {userName || "Ingelogde gebruiker"}
              </div>
              <button
                type="button"
                onClick={() => void logout()}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Uitloggen
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
