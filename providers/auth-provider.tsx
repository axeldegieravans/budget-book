"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";

import { isFirebaseConfigured } from "@/lib/firebase/config";
import { subscribeToAuth } from "@/lib/services/auth-service";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  configured: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    const unsubscribe = subscribeToAuth((nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      configured: isFirebaseConfigured,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
