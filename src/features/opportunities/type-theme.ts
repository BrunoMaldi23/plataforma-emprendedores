import { CalendarDays, GraduationCap, HandCoins, Megaphone, TrendingUp, type LucideIcon } from "lucide-react";
import type { OpportunityType } from "@/types";

export interface OpportunityTypeTheme {
  icon: LucideIcon;
  /** Fondo suave de la portada. */
  cover: string;
  /** Color del icono grande decorativo. */
  decor: string;
  /** Color de la insignia del icono. */
  chip: string;
}

/** Tema visual por categoría de oportunidad (mismos colores del logo que en el resto del sitio). */
export const opportunityTypeTheme: Record<OpportunityType, OpportunityTypeTheme> = {
  feria: { icon: CalendarDays, cover: "bg-sun-100", decor: "text-sun-500/40", chip: "bg-sun-600 text-ink" },
  capacitacion: { icon: GraduationCap, cover: "bg-leaf-100", decor: "text-leaf-400/70", chip: "bg-leaf-600 text-white" },
  programa: { icon: TrendingUp, cover: "bg-blue-100", decor: "text-blue-600/25", chip: "bg-blue-600 text-white" },
  fondo: { icon: HandCoins, cover: "bg-sun-100", decor: "text-sun-600/35", chip: "bg-sun-400 text-ink" },
  convocatoria: { icon: Megaphone, cover: "bg-cyan-100", decor: "text-cyan-700/30", chip: "bg-cyan-700 text-white" },
};
