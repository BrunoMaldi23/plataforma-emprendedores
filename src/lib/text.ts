/** Convierte un texto en un identificador para URL: minúsculas, sin tildes y con guiones. */
export function slugify(value: string): string {
  return normalize(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Convierte «café, tostado, oficinas» en una lista limpia: sin vacíos, sin repetidos y en minúsculas. */
export function parseTags(text: string): string[] {
  const seen = new Set<string>();
  for (const raw of text.split(",")) {
    const tag = raw.trim().toLowerCase();
    if (tag) seen.add(tag);
  }
  return [...seen];
}

/** Minúsculas y sin tildes, para búsquedas tolerantes. */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}
