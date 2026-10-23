"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { roleHome, roleLabel } from "@/lib/permissions";
import type { Role } from "@/types";
import { setDemoRole, useDemoRole } from "../demo-session";

const options: Array<{ role: Role; description: string }> = [
  { role: "entrepreneur", description: "Gestiona el perfil de un negocio de ejemplo." },
  { role: "admin", description: "Modera perfiles, oportunidades y rubros." },
  { role: "municipal", description: "Consulta indicadores, sin editar." },
  { role: "visitor", description: "Navega como persona sin sesión." },
];

export function RoleChooser() {
  const router = useRouter();
  const current = useDemoRole();

  function choose(role: Role) {
    setDemoRole(role);
    router.push(roleHome[role]);
  }

  return (
    <section aria-labelledby="demo-roles" className="rounded-lg border border-line bg-surface p-6">
      <h2 id="demo-roles" className="text-xl font-bold">
        Explorar con un rol de demostración
      </h2>
      <p className="mt-2 text-sm text-muted">
        Mientras no exista autenticación real, elige un rol para recorrer cada área. Es solo un interruptor visual
        guardado en este navegador, no una medida de seguridad.
      </p>
      <ul className="mt-4 space-y-3">
        {options.map(({ role, description }) => (
          <li key={role} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">{roleLabel[role]}</p>
              <p className="text-sm text-muted">{description}</p>
            </div>
            <Button
              variant={current === role ? "primary" : "secondary"}
              onClick={() => choose(role)}
              aria-label={`Entrar como ${roleLabel[role]}`}
            >
              {current === role ? "Rol activo" : "Entrar"}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
