import type { Business, Category, Opportunity, OpportunityType } from "@/types";

export interface Overview {
  businesses: number;
  approved: number;
  pending: number;
  hidden: number;
  opportunities: number;
  published: number;
  openOpportunities: number;
  drafts: number;
}

/** Métricas calculadas exclusivamente sobre los datos de demostración recibidos. */
export function computeOverview(businesses: Business[], opportunities: Opportunity[]): Overview {
  return {
    businesses: businesses.length,
    approved: businesses.filter((b) => b.status === "approved").length,
    pending: businesses.filter((b) => b.status === "pending").length,
    hidden: businesses.filter((b) => b.status === "hidden").length,
    opportunities: opportunities.length,
    published: opportunities.filter((o) => o.published).length,
    openOpportunities: opportunities.filter((o) => o.published && o.status === "open").length,
    drafts: opportunities.filter((o) => !o.published).length,
  };
}

export interface CategoryCount {
  category: Category;
  count: number;
}

export function countByCategory(businesses: Business[], categories: Category[]): CategoryCount[] {
  return categories
    .map((category) => ({ category, count: businesses.filter((b) => b.categoryId === category.id).length }))
    .sort((a, b) => b.count - a.count || a.category.name.localeCompare(b.category.name, "es"));
}

export function countByType(opportunities: Opportunity[], types: OpportunityType[]): Array<{ type: OpportunityType; count: number }> {
  return types
    .map((type) => ({ type, count: opportunities.filter((o) => o.type === type).length }))
    .sort((a, b) => b.count - a.count);
}
