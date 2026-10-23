import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { RequestsList } from "@/features/dashboard/components/requests-list";
import { getDemoBusiness, listContactRequestsFor } from "@/lib/repository";

export const metadata: Metadata = { title: "Solicitudes" };

export default function RequestsPage() {
  const business = getDemoBusiness();
  return (
    <>
      <PageHeader title="Solicitudes recibidas" description="Mensajes de personas interesadas en tu negocio." />
      <RequestsList initial={listContactRequestsFor(business.id)} />
    </>
  );
}
