"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Tab {
  id: string;
  label: string;
  panel: ReactNode;
}

/** Pestañas accesibles (flechas, Inicio y Fin) para separar «Ingresar» de «Explorar con un rol». */
export function AuthTabs({ tabs, label }: { tabs: Tab[]; label: string }) {
  const [active, setActive] = useState(tabs[0].id);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((t) => t.id === active);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActive(tabs[next].id);
    refs.current[tabs[next].id]?.focus();
  }

  return (
    <div className="flex flex-1 flex-col">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="grid grid-cols-2 gap-1 rounded-lg bg-canvas p-1"
      >
        {tabs.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[t.id] = el;
              }}
              role="tab"
              type="button"
              id={`tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={cn(
                "min-h-11 rounded-md px-3 text-sm font-semibold transition-colors sm:text-base",
                selected ? "bg-surface text-blue-700 shadow-raised" : "text-muted hover:text-ink",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== active}
          className="mt-6 flex flex-1 flex-col"
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
