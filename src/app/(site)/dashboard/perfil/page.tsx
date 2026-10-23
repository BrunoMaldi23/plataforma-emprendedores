import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProfileEditor } from "@/features/dashboard/components/profile-editor";
import { getDemoBusiness } from "@/lib/repository";

export const metadata: Metadata = { title: "Perfil del negocio" };

export default function ProfilePage() {
  return (
    <>
      <PageHeader title="Perfil del negocio" description="Así te presentas ante quienes buscan en el catálogo." />
      <ProfileEditor business={getDemoBusiness()} />
    </>
  );
}
