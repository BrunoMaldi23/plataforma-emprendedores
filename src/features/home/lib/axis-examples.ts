import { formatDate } from "@/lib/format";
import { listBusinesses, listCategories, listLocations, listOpportunities } from "@/lib/repository";
import type { OpportunityType } from "@/types";
import type { AxisId } from "../nexus-axes";

export interface AxisExample {
  headline: string;
  detail?: string;
  /** Cifra calculada sobre los datos de demostración, por ejemplo «1 abierta · 0 próximas». */
  stat?: string;
}

function opportunityStat(type: OpportunityType): string {
  const items = listOpportunities().filter((o) => o.type === type);
  const open = items.filter((o) => o.status === "open").length;
  const upcoming = items.filter((o) => o.status === "upcoming").length;
  return `Abiertas ahora: ${open} · Próximas: ${upcoming}`;
}

function fromOpportunity(type: OpportunityType): AxisExample | undefined {
  const items = listOpportunities().filter((o) => o.type === type && o.status !== "closed");
  const item = items.find((o) => o.status === "open") ?? items[0];
  if (!item) return undefined;
  const when = item.deadline ? `Postula hasta el ${formatDate(item.deadline)}` : `Desde el ${formatDate(item.startDate)}`;
  return { headline: item.title, detail: when, stat: opportunityStat(type) };
}

/** Un ejemplo real (de los datos de demostración) para cada eje; se muestra bajo el mapa del inicio. */
export function buildAxisExamples(): Partial<Record<AxisId, AxisExample>> {
  const businesses = listBusinesses();
  return {
    vende: {
      headline: "Tu ficha aparece en el catálogo por rubro y sector",
      detail: "El registro de esta versión es de demostración.",
      stat: `${businesses.length} emprendimientos visibles`,
    },
    conecta: {
      headline: businesses
        .slice(0, 3)
        .map((b) => b.name)
        .join(" · "),
      detail: "Busca por nombre, rubro o sector.",
      stat: `${listCategories().length} rubros · ${listLocations().length} sectores`,
    },
    participa: fromOpportunity("feria"),
    aprende: fromOpportunity("capacitacion"),
    financia: fromOpportunity("fondo"),
    crece: fromOpportunity("programa"),
  };
}
