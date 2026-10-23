import { PanelShell } from "@/components/layout/panel-shell";
import { RoleGate } from "@/features/auth/role-gate";

const items = [
  { href: "/dashboard", label: "Resumen", exact: true },
  { href: "/dashboard/perfil", label: "Perfil" },
  { href: "/dashboard/productos", label: "Productos" },
  { href: "/dashboard/solicitudes", label: "Solicitudes" },
  { href: "/dashboard/oportunidades", label: "Oportunidades" },
];

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <RoleGate permission="dashboard:access">
      <PanelShell title="Mi emprendimiento" navLabel="Área del emprendedor" items={items}>
        {children}
      </PanelShell>
    </RoleGate>
  );
}
