import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { RequestsList } from "@/features/dashboard/components/requests-list";

// El rol del prototipo solo existe en el cliente (RoleGate): la ruta no se valida como navegación instantánea hasta que la
// autorización pase al servidor (ver docs/ARQUITECTURA.md).
export const instant = false;

export const metadata: Metadata = { title: "Solicitudes" };

export default function RequestsPage() {
  return (
    <>
      <PageHeader title="Solicitudes recibidas" description="Mensajes de personas interesadas en tu negocio." />
      <RequestsList />
    </>
  );
}
