"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CircleCheck, X } from "lucide-react";
import { cn } from "@/lib/cn";

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface Toast {
  id: number;
  message: string;
  action?: ToastAction;
  leaving: boolean;
}

interface ToastApi {
  /** Muestra un aviso breve. Con `action` (p. ej. «Deshacer») permanece más tiempo. */
  notify: (message: string, options?: { action?: ToastAction }) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}

const LIFETIME_MS = 4500;
const LIFETIME_WITH_ACTION_MS = 8000;
const EXIT_MS = 200;
const MAX_VISIBLE = 3;

/** Avisos apilados abajo a la derecha. Se anuncian a lectores de pantalla y se ocultan con una transición. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismiss = useCallback(
    (id: number) => {
      const timer = timers.current.get(id);
      if (timer) clearTimeout(timer);
      timers.current.delete(id);
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      setTimeout(() => remove(id), EXIT_MS);
    },
    [remove],
  );

  const notify = useCallback<ToastApi["notify"]>(
    (message, options) => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-(MAX_VISIBLE - 1)), { id, message, action: options?.action, leaving: false }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), options?.action ? LIFETIME_WITH_ACTION_MS : LIFETIME_MS),
      );
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => clearTimeout(t));
  }, []);

  const api = useMemo<ToastApi>(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:items-end"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border border-leaf-600/40 bg-surface p-4 shadow-[0_12px_30px_-12px_rgb(7_21_48/0.4)]",
              t.leaving ? "animate-toast-out" : "animate-toast-in",
            )}
          >
            <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-leaf-600" />
            <p className="flex-1 text-sm font-medium">{t.message}</p>
            {t.action ? (
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick();
                  dismiss(t.id);
                }}
                className="-my-1 shrink-0 rounded-md px-2 py-1 text-sm font-bold text-blue-700 hover:bg-blue-50"
              >
                {t.action.label}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              aria-label="Cerrar aviso"
              className="-mr-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-md hover:bg-blue-50"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
