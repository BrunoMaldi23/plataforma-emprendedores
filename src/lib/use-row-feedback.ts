"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Simula la latencia de una llamada al servidor (mientras no exista backend). */
export function simulateLatency(ms = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function addTo(set: ReadonlySet<string>, id: string): Set<string> {
  return new Set(set).add(id);
}

function removeFrom(set: ReadonlySet<string>, id: string): Set<string> {
  const next = new Set(set);
  next.delete(id);
  return next;
}

/**
 * Seguimiento de acciones en curso por id (para mostrar un botón «procesando» y evitar dobles clics)
 * y de elementos recién cambiados (para resaltarlos un instante).
 */
export function useRowFeedback(highlightMs = 1600) {
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set());
  const [recent, setRecent] = useState<ReadonlySet<string>>(new Set());
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const all = timers.current;
    return () => all.forEach((t) => clearTimeout(t));
  }, []);

  /** Ejecuta `work` tras la latencia simulada marcando `id` como en curso; luego lo resalta. */
  const run = useCallback(
    async <T>(id: string, work: () => T): Promise<T> => {
      setPending((prev) => addTo(prev, id));
      await simulateLatency();
      const result = work();
      setPending((prev) => removeFrom(prev, id));
      setRecent((prev) => addTo(prev, id));
      const timer = setTimeout(() => {
        setRecent((prev) => removeFrom(prev, id));
        timers.current.delete(timer);
      }, highlightMs);
      timers.current.add(timer);
      return result;
    },
    [highlightMs],
  );

  const isPending = useCallback((id: string) => pending.has(id), [pending]);
  const isRecent = useCallback((id: string) => recent.has(id), [recent]);

  return { run, isPending, isRecent };
}
