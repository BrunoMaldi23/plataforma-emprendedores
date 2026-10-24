"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftRight, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { useDemoSignOut } from "@/features/auth/sign-out";
import { cn } from "@/lib/cn";
import { roleHome, roleLabel } from "@/lib/permissions";
import type { Role } from "@/types";

/** Menú de cuenta de escritorio: rol activo, ir al panel, cambiar de rol y salir. */
export function AccountMenu({ role }: { role: Exclude<Role, "visitor"> }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const signOut = useDemoSignOut();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item =
    "flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left font-medium hover:bg-blue-50 hover:text-blue-700";

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-cuenta"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 items-center gap-3 rounded-full border border-line bg-surface py-1 pl-1 pr-3 hover:border-blue-600"
      >
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-full bg-blue-600 font-display text-base font-bold text-white"
        >
          {roleLabel[role].charAt(0)}
        </span>
        <span className="text-left leading-tight">
          <span className="block text-sm font-semibold">{roleLabel[role]}</span>
          <span className="block text-xs text-muted">Sesión de demostración</span>
        </span>
        <ChevronDown aria-hidden="true" className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          id="menu-cuenta"
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-line bg-surface p-2 shadow-raised"
        >
          <p className="px-3 py-2 text-xs text-muted">
            Rol de demostración: no es una cuenta real y se guarda solo en este navegador.
          </p>
          <Link href={roleHome[role]} onClick={() => setOpen(false)} className={item}>
            <LayoutDashboard aria-hidden="true" className="size-4 text-blue-600" />
            Ir a mi panel
          </Link>
          <Link href="/login" onClick={() => setOpen(false)} className={item}>
            <ArrowLeftRight aria-hidden="true" className="size-4 text-blue-600" />
            Cambiar de rol
          </Link>
          <button
            type="button"
            className={cn(item, "border-t border-line")}
            onClick={() => {
              setOpen(false);
              signOut();
            }}
          >
            <LogOut aria-hidden="true" className="size-4 text-blue-600" />
            Salir
          </button>
        </div>
      ) : null}
    </div>
  );
}
