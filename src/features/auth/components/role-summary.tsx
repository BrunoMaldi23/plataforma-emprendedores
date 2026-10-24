"use client";

import Link from "next/link";
import { ArrowLeftRight, Eye, LogOut } from "lucide-react";
import { can, roleLabel } from "@/lib/permissions";
import { Button } from "@/components/ui/button";
import { useDemoRole } from "../demo-session";
import { useDemoSignOut } from "../sign-out";

/** Resumen del rol activo en los paneles: qué rol es, si solo puede leer, y cómo cambiarlo o salir. */
export function RoleSummary() {
  const role = useDemoRole();
  const signOut = useDemoSignOut();
  if (role === null || role === "visitor") return null;

  const readOnly = can(role, "admin:read") && !can(role, "admin:write");

  return (
    <section aria-label="Rol de demostración" className="space-y-3 rounded-lg border border-line bg-surface p-4">
      <div>
        <p className="text-xs text-muted">Rol de demostración</p>
        <p className="font-display text-lg font-bold">{roleLabel[role]}</p>
      </div>
      {readOnly ? (
        <p className="flex items-start gap-2 rounded-md bg-blue-50 p-2 text-sm">
          <Eye aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-blue-600" />
          Modo solo lectura: puedes consultar, no editar.
        </p>
      ) : null}
      <div className="flex flex-col gap-2">
        <Link
          href="/login"
          className="inline-flex min-h-10 items-center gap-2 rounded-md px-1 text-sm font-semibold text-blue-700 hover:underline"
        >
          <ArrowLeftRight aria-hidden="true" className="size-4" />
          Cambiar de rol
        </Link>
        <Button variant="secondary" size="sm" onClick={signOut}>
          <LogOut aria-hidden="true" className="size-4" />
          Salir
        </Button>
      </div>
    </section>
  );
}
