import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "demo";

const tones: Record<Tone, string> = {
  neutral: "bg-canvas text-muted border-line",
  brand: "bg-blue-50 text-blue-700 border-blue-100",
  success: "bg-success-soft text-success border-transparent",
  warning: "bg-warning-soft text-warning border-transparent",
  danger: "bg-danger-soft text-danger border-transparent",
  demo: "bg-cyan-100 text-cyan-700 border-transparent",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Marca contenido ficticio de forma consistente en toda la interfaz. */
export function DemoBadge() {
  return <Badge tone="demo">Datos de demostración</Badge>;
}
