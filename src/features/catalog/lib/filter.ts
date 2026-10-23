import { normalize } from "@/lib/text";
import type { Business } from "@/types";

export interface CatalogFilters {
  query: string;
  category: string;
  location: string;
}

export const emptyCatalogFilters: CatalogFilters = { query: "", category: "", location: "" };

export function hasActiveFilters(f: CatalogFilters): boolean {
  return Boolean(f.query.trim() || f.category || f.location);
}

/** Todos los términos escritos deben aparecer en nombre, frase, descripción o etiquetas. */
export function filterBusinesses(items: Business[], f: CatalogFilters): Business[] {
  const terms = normalize(f.query).split(/\s+/).filter(Boolean);
  return items.filter((b) => {
    if (f.category && b.categoryId !== f.category) return false;
    if (f.location && b.location !== f.location) return false;
    if (terms.length === 0) return true;
    const haystack = normalize([b.name, b.tagline, b.description, ...b.tags].join(" "));
    return terms.every((t) => haystack.includes(t));
  });
}
