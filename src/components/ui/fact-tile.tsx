import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** Dato clave con icono, etiqueta y valor. Se usa dentro de una lista de definición (`<dl>`). */
export function FactTile({ icon: Icon, label, children }: { icon: LucideIcon; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-line bg-canvas p-4">
      <span
        aria-hidden="true"
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"
      >
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <dt className="text-sm text-muted">{label}</dt>
        <dd className="mt-0.5 break-words font-semibold">{children}</dd>
      </div>
    </div>
  );
}
