import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { OpportunitiesAdmin } from "@/features/admin/components/opportunities-admin";
import { listOpportunities } from "@/lib/repository";

export const metadata: Metadata = { title: "Gestión de oportunidades" };

export default function AdminOpportunitiesPage() {
  return (
    <>
      <PageHeader title="Oportunidades" description="Publica, despublica o cierra convocatorias." />
      <OpportunitiesAdmin initial={listOpportunities({ includeUnpublished: true })} />
    </>
  );
}
