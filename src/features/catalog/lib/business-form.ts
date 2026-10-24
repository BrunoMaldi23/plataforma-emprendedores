import { parseTags } from "@/lib/text";
import type { Business } from "@/types";

/** Valores de texto del formulario de un emprendimiento (lo comparten el panel del emprendedor y el del administrador). */
export interface BusinessFormValues {
  name: string;
  tagline: string;
  description: string;
  email: string;
  categoryId: string;
  location: string;
  instagram: string;
  /** Etiquetas separadas por comas. */
  tags: string;
}

export type BusinessFieldName = "name" | "tagline" | "description" | "email" | "categoryId" | "location" | "tags";

/** Cambios que el formulario produce sobre un emprendimiento ya validado. */
export interface BusinessDraft {
  name: string;
  tagline: string;
  description: string;
  contactEmail: string;
  categoryId: string;
  location: string;
  instagram?: string;
  tags: string[];
}

export function emptyBusinessValues(): BusinessFormValues {
  return { name: "", tagline: "", description: "", email: "", categoryId: "", location: "", instagram: "", tags: "" };
}

export function toBusinessValues(b: Business): BusinessFormValues {
  return {
    name: b.name,
    tagline: b.tagline,
    description: b.description,
    email: b.contactEmail,
    categoryId: b.categoryId,
    location: b.location,
    instagram: b.instagram ?? "",
    tags: b.tags.join(", "),
  };
}

export function toBusinessDraft(v: BusinessFormValues): BusinessDraft {
  const instagram = v.instagram.trim();
  return {
    name: v.name.trim(),
    tagline: v.tagline.trim(),
    description: v.description.trim(),
    contactEmail: v.email.trim(),
    categoryId: v.categoryId,
    location: v.location,
    instagram: instagram ? (instagram.startsWith("@") ? instagram : `@${instagram}`) : undefined,
    tags: parseTags(v.tags),
  };
}
