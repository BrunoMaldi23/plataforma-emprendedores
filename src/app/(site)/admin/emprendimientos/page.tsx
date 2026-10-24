import type { Metadata } from "next";
import { BusinessesAdmin } from "@/features/admin/components/businesses-admin";

// El rol del prototipo solo existe en el cliente (RoleGate): la ruta no se valida como navegación instantánea hasta que la
// autorización pase al servidor (ver docs/ARQUITECTURA.md).
export const instant = false;

export const metadata: Metadata = { title: "Gestión de emprendimientos" };

export default function AdminBusinessesPage() {
  return <BusinessesAdmin />;
}
