"use client";

import { SectionNav, type NavItem } from "@/components/layout/section-nav";
import { useAdmin } from "../state/admin-store";

/** Navegación del panel con el contador de perfiles pendientes de revisión. */
export function AdminNav() {
  const { businesses } = useAdmin();
  const pending = businesses.filter((b) => b.status === "pending").length;
  const items: NavItem[] = [
    { href: "/admin", label: "Resumen", exact: true },
    { href: "/admin/emprendimientos", label: "Emprendimientos", badge: pending },
    { href: "/admin/oportunidades", label: "Oportunidades" },
    { href: "/admin/categorias", label: "Rubros" },
    { href: "/admin/actividad", label: "Actividad" },
  ];
  return <SectionNav items={items} label="Área administrativa" />;
}
