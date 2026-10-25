import { PanelShell } from "@/components/layout/panel-shell";
import { DashboardProvider } from "@/features/dashboard/state/dashboard-store";
import { RoleGate } from "@/features/auth/role-gate";
import { getDemoBusiness, getOfferingsFor, listCategories, listContactRequestsFor, listLocations } from "@/lib/repository";

const items = [
  { href: "/dashboard", label: "Resumen", exact: true },
  { href: "/dashboard/perfil", label: "Perfil" },
  { href: "/dashboard/productos", label: "Productos" },
  { href: "/dashboard/solicitudes", label: "Solicitudes" },
  { href: "/dashboard/oportunidades", label: "Oportunidades" },
];

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  // Datos iniciales (ficticios) del área del emprendedor; a partir de aquí el estado vive en el cliente mientras esté abierta.
  const business = getDemoBusiness();
  const initial = {
    business,
    offerings: getOfferingsFor(business.id),
    requests: listContactRequestsFor(business.id),
    categories: listCategories(),
    locations: listLocations(),
  };

  return (
    <DashboardProvider initial={initial}>
      <RoleGate permission="dashboard:access">
        <PanelShell title="Mi emprendimiento" navLabel="Área del emprendedor" items={items}>
          {children}
        </PanelShell>
      </RoleGate>
    </DashboardProvider>
  );
}
