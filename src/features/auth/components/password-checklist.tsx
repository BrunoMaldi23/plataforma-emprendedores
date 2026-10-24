import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/cn";
import { passwordChecks } from "@/lib/validation";

/** Requisitos de contraseña con estado en vivo (cumplido / pendiente) para ayudar antes de enviar. */
export function PasswordChecklist({ value }: { value: string }) {
  const checks = passwordChecks(value);
  return (
    <ul aria-label="Requisitos de la contraseña" className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {checks.map((c) => (
        <li key={c.id} className={cn("flex items-center gap-1.5", c.ok ? "text-success" : "text-muted")}>
          {c.ok ? (
            <Check aria-hidden="true" className="size-4" />
          ) : (
            <Circle aria-hidden="true" className="size-3.5" />
          )}
          {c.label}
          <span className="sr-only">{c.ok ? " (cumplido)" : " (pendiente)"}</span>
        </li>
      ))}
    </ul>
  );
}
