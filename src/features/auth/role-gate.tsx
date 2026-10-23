"use client";

import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { can, roleLabel } from "@/lib/permissions";
import type { Permission } from "@/types";
import { useDemoRole } from "./demo-session";

/**
 * Protección VISUAL por rol para el prototipo. No impide el acceso a los datos:
 * la autorización real debe ocurrir en el servidor en la siguiente fase.
 */
export function RoleGate({ permission, children }: { permission: Permission; children: ReactNode }) {
  const role = useDemoRole();

  if (role === null) {
    return (
      <Container className="py-16">
        <p role="status" className="text-muted">
          Verificando rol de demostración…
        </p>
      </Container>
    );
  }

  if (!can(role, permission)) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg rounded-lg border border-line bg-surface p-8 text-center">
          <ShieldAlert aria-hidden="true" className="mx-auto size-10 text-warning" />
          <h1 className="mt-4 text-2xl font-bold">Acceso denegado</h1>
          <p className="mt-2 text-muted">
            Tu rol actual de demostración es «{roleLabel[role]}» y no tiene permiso para ver esta sección.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/login">Cambiar de rol</Button>
            <Button href="/" variant="secondary">
              Volver al inicio
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  return <>{children}</>;
}

/** Muestra los hijos solo si el rol demo tiene el permiso. Útil para ocultar acciones de edición. */
export function IfCan({ permission, children }: { permission: Permission; children: ReactNode }) {
  const role = useDemoRole();
  return role !== null && can(role, permission) ? <>{children}</> : null;
}
