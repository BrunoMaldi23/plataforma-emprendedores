import type { ActivityEntry } from "@/types";

/** DATOS FICTICIOS: bitácora de ejemplo, no corresponde a actividad real. */
export const activity: ActivityEntry[] = [
  { id: "a01", area: "business", at: "2026-10-19", actor: "Admin demo", action: "Aprobó perfil", target: "Panadería Las Araucarias" },
  { id: "a02", area: "opportunity", at: "2026-10-18", actor: "Admin demo", action: "Publicó oportunidad", target: "Feria Emprende Temuco (demo)" },
  { id: "a03", area: "system", at: "2026-10-16", actor: "Sistema", action: "Perfil pendiente de revisión", target: "Miel y Bosque" },
  { id: "a04", area: "category", at: "2026-10-14", actor: "Admin demo", action: "Creó rubro", target: "Turismo y experiencias" },
  { id: "a05", area: "system", at: "2026-10-12", actor: "Sistema", action: "Perfil pendiente de revisión", target: "Calzado Pewen" },
];
