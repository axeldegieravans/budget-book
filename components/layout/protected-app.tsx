"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { FirebaseSetupNotice } from "@/components/ui/firebase-setup-notice";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/hooks/use-auth";

export function ProtectedApp({ children }: { children: React.ReactNode }) {
  const { configured, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && configured && !user) {
      router.replace("/login");
    }
  }, [configured, loading, router, user]);

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <FirebaseSetupNotice />
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-full bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow">
          Sessie laden...
        </div>
      </div>
    );
  }

  return <AppShell userName={user.displayName}>{children}</AppShell>;
}
