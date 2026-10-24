import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { OfferingsManager } from "@/features/dashboard/components/offerings-manager";
import { getDemoBusiness, getOfferingsFor } from "@/lib/repository";

// El rol del prototipo solo existe en el cliente (RoleGate): la ruta no se valida como navegación instantánea hasta que la
// autorización pase al servidor (ver docs/ARQUITECTURA.md).
export const instant = false;

export const metadata: Metadata = { title: "Productos y servicios" };

export default function OfferingsPage() {
  const business = getDemoBusiness();
  return (
    <>
      <PageHeader title="Productos y servicios" description="Lo que ofreces, con precio referencial o «a cotizar»." />
      <OfferingsManager businessId={business.id} initial={getOfferingsFor(business.id)} />
    </>
  );
}
