import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileEditor } from "@/features/dashboard/components/profile-editor";
import { getDemoBusiness } from "@/lib/repository";

// El rol del prototipo solo existe en el cliente (RoleGate): la ruta no se valida como navegación instantánea hasta que la
// autorización pase al servidor (ver docs/ARQUITECTURA.md).
export const instant = false;

export const metadata: Metadata = { title: "Perfil del negocio" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Perfil del negocio" description="Así te presentas ante quienes buscan en el catálogo." />
      <ProfileEditor business={getDemoBusiness()} />
    </>
  );
}
