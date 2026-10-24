import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { SavedOpportunities } from "@/features/dashboard/components/saved-opportunities";
import { listOpportunities } from "@/lib/repository";

// El rol del prototipo solo existe en el cliente (RoleGate): la ruta no se valida como navegación instantánea hasta que la
// autorización pase al servidor (ver docs/ARQUITECTURA.md).
export const instant = false;

export const metadata: Metadata = { title: "Mis oportunidades" };

export default function DashboardOpportunitiesPage() {
  return (
    <>
      <PageHeader
        title="Oportunidades de interés"
        description="Las que marcaste con «Me interesa». Se guardan solo en este navegador."
      />
      <SavedOpportunities opportunities={listOpportunities()} />
    </>
  );
}
