import type { ContactRequest } from "@/types";

/** DATOS FICTICIOS: solicitudes recibidas por el negocio de ejemplo del dashboard. */
export const contactRequests: ContactRequest[] = [
  { id: "r01", businessId: "b01", fromName: "Persona de ejemplo 1", fromEmail: "persona1@ejemplo.example", message: "Quisiera cotizar café para una oficina de 12 personas.", createdAt: "2026-10-18", status: "new" },
  { id: "r02", businessId: "b01", fromName: "Persona de ejemplo 2", fromEmail: "persona2@ejemplo.example", message: "¿Tienen café molido para prensa francesa?", createdAt: "2026-10-15", status: "answered" },
  { id: "r03", businessId: "b01", fromName: "Persona de ejemplo 3", fromEmail: "persona3@ejemplo.example", message: "Busco proveedor para un evento en diciembre.", createdAt: "2026-10-09", status: "archived" },
];
