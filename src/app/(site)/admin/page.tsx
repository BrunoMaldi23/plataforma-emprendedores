import type { Metadata } from "next";
import { AdminOverview } from "@/features/admin/components/admin-overview";

// El rol del prototipo solo existe en el cliente (RoleGate): la ruta no se valida como navegación instantánea hasta que la
// autorización pase al servidor (ver docs/ARQUITECTURA.md).
export const instant = false;

export const metadata: Metadata = { title: "Resumen de gestión" };

export default function AdminPage() {
  return <AdminOverview />;
}
