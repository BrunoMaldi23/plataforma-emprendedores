import {
  activity,
  businesses,
  categories,
  contactRequests,
  DEMO_BUSINESS_ID,
  offerings,
  opportunities,
} from "@/data";
import type { Business, Category, Offering, OfferingStats, Opportunity } from "@/types";

/**
 * Punto único de acceso a datos. Hoy lee datos ficticios; al conectar el backend
 * se reemplaza la implementación manteniendo estas firmas (principio D de SOLID).
 */

export function listCategories(): Category[] {
  return categories;
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function listBusinesses(options: { includeUnapproved?: boolean } = {}): Business[] {
  return options.includeUnapproved ? businesses : businesses.filter((b) => b.status === "approved");
}

export function getBusinessBySlug(slug: string): Business | undefined {
  return businesses.find((b) => b.slug === slug && b.status === "approved");
}

export function getOfferingsFor(businessId: string): Offering[] {
  return offerings.filter((o) => o.businessId === businessId);
}

export function getOfferingStats(businessId: string): OfferingStats {
  const items = getOfferingsFor(businessId);
  const prices = items.flatMap((o) => (o.priceClp ? [o.priceClp] : []));
  return { count: items.length, fromPriceClp: prices.length ? Math.min(...prices) : undefined };
}

/** Estadísticas de oferta por id de negocio, para las tarjetas del catálogo. */
export function listOfferingStats(): Record<string, OfferingStats> {
  return Object.fromEntries(listBusinesses().map((b) => [b.id, getOfferingStats(b.id)]));
}

export function listOpportunities(options: { includeUnpublished?: boolean } = {}): Opportunity[] {
  return options.includeUnpublished ? opportunities : opportunities.filter((o) => o.published);
}

export function getOpportunityBySlug(slug: string): Opportunity | undefined {
  return opportunities.find((o) => o.slug === slug && o.published);
}

export function getDemoBusiness(): Business {
  const business = businesses.find((b) => b.id === DEMO_BUSINESS_ID);
  if (!business) throw new Error("Negocio de demostración no encontrado");
  return business;
}

export function listContactRequestsFor(businessId: string) {
  return contactRequests.filter((r) => r.businessId === businessId);
}

export function listActivity() {
  return activity;
}

export function listLocations(): string[] {
  return [...new Set(listBusinesses().map((b) => b.location))].sort((a, b) => a.localeCompare(b, "es"));
}
