/** Contratos de dominio compartidos. Reflejan el modelo previsto para PostgreSQL (ver docs/ARQUITECTURA.md). */

export type Role = "visitor" | "entrepreneur" | "admin" | "municipal";

export type Permission =
  | "dashboard:access"
  | "admin:read"
  | "admin:write";

export type CategoryId =
  | "gastronomia"
  | "artesania"
  | "moda"
  | "servicios"
  | "tecnologia"
  | "turismo"
  | "agro";

export interface Category {
  id: string;
  name: string;
  description: string;
}

export type ReviewStatus = "approved" | "pending" | "hidden";

export interface Business {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  categoryId: string;
  /** Sector o comuna dentro del área de piloto. */
  location: string;
  tags: string[];
  contactEmail: string;
  instagram?: string;
  foundedYear: number;
  status: ReviewStatus;
}

export type OfferingKind = "product" | "service";

export interface Offering {
  id: string;
  businessId: string;
  kind: OfferingKind;
  name: string;
  description: string;
  /** Precio referencial en CLP; ausente si es "a cotizar". */
  priceClp?: number;
}

export type OpportunityType =
  | "feria"
  | "capacitacion"
  | "programa"
  | "fondo"
  | "convocatoria";

/** Estado fijo en los datos; no se deriva de la fecha actual (ver docs/ARQUITECTURA.md). */
export type OpportunityStatus = "open" | "upcoming" | "closed";

export interface Opportunity {
  id: string;
  slug: string;
  title: string;
  type: OpportunityType;
  summary: string;
  description: string;
  organization: string;
  /** ISO yyyy-mm-dd */
  startDate: string;
  deadline?: string;
  requirements: string[];
  url: string;
  status: OpportunityStatus;
  published: boolean;
}

export type ContactRequestStatus = "new" | "answered" | "archived";

export interface ContactRequest {
  id: string;
  businessId: string;
  fromName: string;
  fromEmail: string;
  message: string;
  createdAt: string;
  status: ContactRequestStatus;
}

export interface ActivityEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
}
