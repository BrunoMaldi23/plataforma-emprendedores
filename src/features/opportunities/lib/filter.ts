import type { Opportunity, OpportunityType } from "@/types";

export const opportunityTypes: OpportunityType[] = ["feria", "capacitacion", "programa", "fondo", "convocatoria"];

export function isOpportunityType(value: string | null): value is OpportunityType {
  return value !== null && (opportunityTypes as string[]).includes(value);
}

export function filterOpportunities(items: Opportunity[], type: OpportunityType | ""): Opportunity[] {
  return type ? items.filter((o) => o.type === type) : items;
}
