import { CalendarDays, GraduationCap, HandCoins, Store, TrendingUp, Users, type LucideIcon } from "lucide-react";

export type AxisId = "vende" | "conecta" | "participa" | "aprende" | "financia" | "crece";

export interface Axis {
  id: AxisId;
  title: string;
  text: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  /** Color del trazo (variable CSS del tema). */
  stroke: string;
  /** Borde del nodo en reposo. */
  ring: string;
  /** Color del icono en reposo. */
  iconIdle: string;
  /** Relleno y texto del nodo activo (el texto cumple contraste sobre su relleno). */
  active: string;
  /** Acento de la tarjeta de detalle. */
  accent: string;
}

/** Copia y estilo de los seis ejes. Los ejemplos reales se calculan aparte, desde los datos. */
export const axes: Axis[] = [
  {
    id: "vende",
    title: "Vende",
    text: "Muestra tus productos y servicios a quienes buscan comprar en Temuco.",
    href: "/registro",
    cta: "Registrar mi negocio",
    icon: Store,
    stroke: "var(--color-blue-600)",
    ring: "border-blue-600",
    iconIdle: "text-blue-600",
    active: "bg-blue-600 text-white border-blue-600",
    accent: "bg-blue-600",
  },
  {
    id: "conecta",
    title: "Conecta",
    text: "Encuentra emprendedores, proveedores y posibles alianzas por rubro y sector.",
    href: "/emprendimientos",
    cta: "Explorar el catálogo",
    icon: Users,
    stroke: "var(--color-leaf-600)",
    ring: "border-leaf-600",
    iconIdle: "text-leaf-600",
    active: "bg-leaf-400 text-ink border-leaf-600",
    accent: "bg-leaf-400",
  },
  {
    id: "participa",
    title: "Participa",
    text: "Ferias y actividades para mostrar tu trabajo y vender en persona.",
    href: "/oportunidades?tipo=feria",
    cta: "Ver ferias",
    icon: CalendarDays,
    stroke: "var(--color-sun-600)",
    ring: "border-sun-600",
    iconIdle: "text-sun-600",
    active: "bg-sun-600 text-ink border-sun-600",
    accent: "bg-sun-600",
  },
  {
    id: "aprende",
    title: "Aprende",
    text: "Capacitaciones para ordenar tus costos, tus precios y tus ventas.",
    href: "/oportunidades?tipo=capacitacion",
    cta: "Ver capacitaciones",
    icon: GraduationCap,
    stroke: "var(--color-leaf-600)",
    ring: "border-leaf-600",
    iconIdle: "text-leaf-600",
    active: "bg-leaf-600 text-white border-leaf-600",
    accent: "bg-leaf-600",
  },
  {
    id: "financia",
    title: "Financia",
    text: "Fondos y programas de apoyo para invertir en tu emprendimiento.",
    href: "/oportunidades?tipo=fondo",
    cta: "Ver fondos",
    icon: HandCoins,
    stroke: "var(--color-sun-500)",
    ring: "border-sun-500",
    iconIdle: "text-sun-600",
    active: "bg-sun-400 text-ink border-sun-500",
    accent: "bg-sun-400",
  },
  {
    id: "crece",
    title: "Crece",
    text: "Programas de acompañamiento para dar el siguiente paso.",
    href: "/oportunidades?tipo=programa",
    cta: "Ver programas",
    icon: TrendingUp,
    stroke: "var(--color-cyan-700)",
    ring: "border-cyan-700",
    iconIdle: "text-cyan-700",
    active: "bg-cyan-700 text-white border-cyan-700",
    accent: "bg-cyan-700",
  },
];
