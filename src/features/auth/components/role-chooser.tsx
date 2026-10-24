"use client";

import { useRouter } from "next/navigation";
import { Eye, Landmark, ShieldCheck, Store, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { roleHome, roleLabel } from "@/lib/permissions";
import type { Role } from "@/types";
import { setDemoRole, useDemoRole } from "../demo-session";

const options: Array<{ role: Role; description: string; icon: LucideIcon }> = [
  { role: "entrepreneur", description: "Gestiona el perfil de un negocio de ejemplo.", icon: Store },
  { role: "admin", description: "Modera perfiles, oportunidades y rubros.", icon: ShieldCheck },
  { role: "municipal", description: "Consulta indicadores, sin editar.", icon: Landmark },
  { role: "visitor", description: "Navega como persona sin sesión.", icon: Eye },
];

/** Selector de rol de demostración: cada rol es una tarjeta completa y clicable. */
export function RoleChooser() {
  const router = useRouter();
  const current = useDemoRole();

  function choose(role: Role) {
    setDemoRole(role);
    router.push(roleHome[role]);
  }

  return (
    <section aria-labelledby="demo-roles">
      <h2 id="demo-roles" className="text-xl font-bold">
        Explorar sin cuenta
      </h2>
      <p className="mt-1 text-sm text-muted">
        Elige un rol de demostración para recorrer cada área. Es solo un interruptor visual guardado en este navegador,
        no una medida de seguridad.
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {options.map(({ role, description, icon: Icon }) => {
          const active = current === role;
          return (
            <li key={role}>
              <button
                type="button"
                onClick={() => choose(role)}
                aria-pressed={active}
                className={cn(
                  "flex h-full w-full flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
                  active ? "border-blue-600 bg-blue-50" : "border-line bg-surface hover:border-blue-600",
                )}
              >
                <span className="flex w-full items-center justify-between gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-10 items-center justify-center rounded-lg",
                      active ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  {active ? <Badge tone="brand">Rol activo</Badge> : null}
                </span>
                <span className="font-display text-lg font-bold leading-tight">{roleLabel[role]}</span>
                <span className="text-sm text-muted">{description}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
