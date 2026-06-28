"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type ToastTone = "success" | "error";

interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);
const TOAST_DURATION_MS = 4000;

function toneClasses(tone: ToastTone) {
  if (tone === "error") {
    return "border-rose-200 bg-rose-50 text-rose-900";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-900";
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message: string, tone: ToastTone) => {
      const id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      setToasts((current) => [...current, { id, message, tone }]);

      const timeout = setTimeout(() => {
        dismiss(id);
      }, TOAST_DURATION_MS);

      timeoutsRef.current.set(id, timeout);
    },
    [dismiss],
  );

  useEffect(() => {
    const timeouts = timeoutsRef.current;

    return () => {
      for (const timeout of timeouts.values()) {
        clearTimeout(timeout);
      }
      timeouts.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      success: (message: string) => show(message, "success"),
      error: (message: string) => show(message, "error"),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 rounded-[1.4rem] border px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.16)] backdrop-blur ${toneClasses(toast.tone)}`}
            role="status"
            aria-live="polite"
          >
            <p className="text-sm font-medium leading-6">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="rounded-full px-2 py-1 text-xs font-semibold opacity-70 transition hover:opacity-100"
              aria-label="Sluit melding"
            >
              Sluit
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }

  return context;
}
