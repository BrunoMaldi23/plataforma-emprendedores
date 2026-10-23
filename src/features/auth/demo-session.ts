"use client";

import { useSyncExternalStore } from "react";
import type { Role } from "@/types";

/**
 * Sesión de DEMOSTRACIÓN. Guarda solo el rol elegido en localStorage del navegador.
 * No es autenticación ni seguridad: cualquiera puede cambiarlo. La autorización real
 * (Spring Security + JWT + verificación en el backend) es la siguiente fase.
 */
const KEY = "nexora-demo-role";
const EVENT = "nexora-demo-role-change";
const ROLES: Role[] = ["visitor", "entrepreneur", "admin", "municipal"];

function read(): Role {
  try {
    const stored = window.localStorage.getItem(KEY);
    return ROLES.includes(stored as Role) ? (stored as Role) : "visitor";
  } catch {
    return "visitor";
  }
}

export function setDemoRole(role: Role): void {
  try {
    window.localStorage.setItem(KEY, role);
  } catch {
    /* almacenamiento no disponible: el rol vuelve a visitante */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Devuelve null mientras se hidrata, para no mostrar contenido de un rol equivocado. */
export function useDemoRole(): Role | null {
  return useSyncExternalStore<Role | null>(subscribe, read, () => null);
}
