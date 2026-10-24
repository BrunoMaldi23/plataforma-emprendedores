"use client";

import { cn } from "@/lib/cn";

export interface ChipOption<T extends string> {
  value: T;
  label: string;
  count?: number;
}

/** Filtro de una sola selección en forma de botones con contador. Los botones usan `aria-pressed`. */
export function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
              active ? "border-blue-600 bg-blue-600 text-white" : "border-line bg-surface hover:border-blue-600",
            )}
          >
            {o.label}
            {o.count !== undefined ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  active ? "bg-white/25 text-white" : "bg-canvas text-muted",
                )}
              >
                {o.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
