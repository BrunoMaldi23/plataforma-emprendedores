"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Intereses marcados en oportunidades (DEMOSTRACIÓN): viven en localStorage del navegador,
 * no se envían a ningún servidor ni a la organización responsable.
 */
const KEY = "nexora-demo-saved-opportunities";
const EVENT = "nexora-demo-saved-change";

function readRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function parse(raw: string): string[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useSavedOpportunities() {
  // El snapshot es una cadena (estable por valor); se parsea con useMemo.
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  const saved = useMemo(() => parse(raw), [raw]);

  const toggle = useCallback((id: string) => {
    const current = parse(readRaw());
    const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* sin almacenamiento: el interés no se conserva */
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { saved, toggle };
}
