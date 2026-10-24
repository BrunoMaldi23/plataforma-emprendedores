/**
 * Tema visual por rubro. Un solo lugar define los colores de portada y avatar, de modo que
 * tarjetas, fichas y monogramas se mantengan coherentes. Los rubros nuevos usan `fallback`.
 * Regla de contraste: texto sobre amarillo/naranja/verde claro siempre en `ink`.
 */
export interface CategoryTheme {
  /** Fondo de la portada de la tarjeta. */
  cover: string;
  /** Color del trazo decorativo de la portada. */
  decor: string;
  /** Avatar (inicial del negocio). */
  avatar: string;
}

const fallback: CategoryTheme = { cover: "bg-blue-50", decor: "text-blue-600/25", avatar: "bg-blue-100 text-blue-700" };

const themes: Record<string, CategoryTheme> = {
  gastronomia: { cover: "bg-sun-100", decor: "text-sun-500/60", avatar: "bg-sun-500 text-ink" },
  artesania: { cover: "bg-sun-100", decor: "text-sun-600/40", avatar: "bg-sun-600 text-ink" },
  moda: { cover: "bg-blue-50", decor: "text-sun-500/50", avatar: "bg-sun-100 text-ink" },
  servicios: { cover: "bg-blue-100", decor: "text-blue-600/35", avatar: "bg-blue-600 text-white" },
  tecnologia: { cover: "bg-cyan-100", decor: "text-cyan-700/35", avatar: "bg-blue-100 text-blue-700" },
  turismo: { cover: "bg-leaf-100", decor: "text-leaf-600/40", avatar: "bg-leaf-600 text-white" },
  agro: { cover: "bg-leaf-100", decor: "text-leaf-400", avatar: "bg-leaf-400 text-ink" },
};

export function categoryTheme(categoryId: string): CategoryTheme {
  return themes[categoryId] ?? fallback;
}
