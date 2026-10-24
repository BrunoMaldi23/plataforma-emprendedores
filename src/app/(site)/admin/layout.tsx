import { Info } from "lucide-react";
import { PanelShell } from "@/components/layout/panel-shell";
import { AdminNav } from "@/features/admin/components/admin-nav";
import { AdminProvider } from "@/features/admin/state/admin-store";
import { RoleGate } from "@/features/auth/role-gate";
import { listActivity, listBusinesses, listCategories, listLocations, listOpportunities } from "@/lib/repository";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  // Datos iniciales (ficticios) del panel; a partir de aquí el estado vive en el cliente mientras la sesión esté abierta.
  const initial = {
    businesses: listBusinesses({ includeUnapproved: true }),
    opportunities: listOpportunities({ includeUnpublished: true }),
    categories: listCategories(),
    activity: listActivity(),
    locations: listLocations(),
  };

  return (
    <AdminProvider initial={initial}>
      <RoleGate permission="admin:read">
        <PanelShell
          title="Gestión de la plataforma"
          navLabel="Área administrativa"
          items={[]}
          nav={<AdminNav />}
        >
          <p className="flex items-start gap-2 rounded-md bg-cyan-100 px-3 py-2 text-sm text-ink">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-blue-700" />
            Panel de demostración: los cambios se comparten entre las secciones y quedan en la actividad, pero se pierden al
            recargar y no afectan al sitio público.
          </p>
          {children}
        </PanelShell>
      </RoleGate>
    </AdminProvider>
  );
}
