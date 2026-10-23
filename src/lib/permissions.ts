import type { Permission, Role } from "@/types";

const rolePermissions: Record<Role, readonly Permission[]> = {
  visitor: [],
  entrepreneur: ["dashboard:access"],
  admin: ["admin:read", "admin:write"],
  municipal: ["admin:read"],
};

export function can(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission);
}

export const roleLabel: Record<Role, string> = {
  visitor: "Visitante",
  entrepreneur: "Emprendedor",
  admin: "Administrador",
  municipal: "Usuario municipal",
};

/** Lugar al que lleva cada rol tras "entrar" en la demostración. */
export const roleHome: Record<Role, string> = {
  visitor: "/",
  entrepreneur: "/dashboard",
  admin: "/admin",
  municipal: "/admin",
};
