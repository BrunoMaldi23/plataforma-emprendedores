import type { Metadata } from "next";
import { OpportunitiesAdmin } from "@/features/admin/components/opportunities-admin";

// El rol del prototipo solo existe en el cliente (RoleGate): la ruta no se valida como navegación instantánea hasta que la
// autorización pase al servidor (ver docs/ARQUITECTURA.md).
export const instant = false;

export const metadata: Metadata = { title: "Gestión de oportunidades" };

export default function AdminOpportunitiesPage() {
  return <OpportunitiesAdmin />;
}
