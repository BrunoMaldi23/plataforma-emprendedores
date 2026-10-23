import { PanelShell } from "@/components/layout/panel-shell";
import { RoleGate } from "@/features/auth/role-gate";

const items = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/emprendimientos", label: "Emprendimientos" },
  { href: "/admin/oportunidades", label: "Oportunidades" },
  { href: "/admin/categorias", label: "Rubros" },
  { href: "/admin/actividad", label: "Actividad" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <RoleGate permission="admin:read">
      <PanelShell title="Gestión de la plataforma" navLabel="Área administrativa" items={items}>
        {children}
      </PanelShell>
    </RoleGate>
  );
}
