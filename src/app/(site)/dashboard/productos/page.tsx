import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { OfferingsManager } from "@/features/dashboard/components/offerings-manager";

// El rol del prototipo solo existe en el cliente (RoleGate): la ruta no se valida como navegación instantánea hasta que la
// autorización pase al servidor (ver docs/ARQUITECTURA.md).
export const instant = false;

export const metadata: Metadata = { title: "Productos y servicios" };

export default function OfferingsPage() {
  return (
    <>
      <PageHeader title="Productos y servicios" description="Lo que ofreces, con precio referencial o «a cotizar»." />
      <OfferingsManager />
    </>
  );
}
