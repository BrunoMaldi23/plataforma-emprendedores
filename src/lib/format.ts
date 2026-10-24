import type { OpportunityStatus, OpportunityType, ReviewStatus } from "@/types";

const clp = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function formatClp(value: number): string {
  return clp.format(value);
}

/** Formatea una fecha ISO yyyy-mm-dd sin depender de la zona horaria. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${day} ${months[month - 1]} ${year}`;
}

/** Acepta yyyy-mm-dd o yyyy-mm-ddThh:mm; agrega la hora cuando existe. */
export function formatDateTime(iso: string): string {
  const [date, time] = iso.split("T");
  return time ? `${formatDate(date)}, ${time.slice(0, 5)}` : formatDate(date);
}

export const opportunityTypeLabel: Record<OpportunityType, string> = {
  feria: "Feria",
  capacitacion: "Capacitación",
  programa: "Programa",
  fondo: "Fondo",
  convocatoria: "Convocatoria",
};

export const opportunityStatusLabel: Record<OpportunityStatus, string> = {
  open: "Abierta",
  upcoming: "Próximamente",
  closed: "Cerrada",
};

export const reviewStatusLabel: Record<ReviewStatus, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  hidden: "Oculto",
};
