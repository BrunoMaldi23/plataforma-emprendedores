import type { Metadata } from "next";
import { ActivityAdmin } from "@/features/admin/components/activity-admin";

// El rol del prototipo solo existe en el cliente (RoleGate): la ruta no se valida como navegación instantánea hasta que la
// autorización pase al servidor (ver docs/ARQUITECTURA.md).
export const instant = false;

export const metadata: Metadata = { title: "Actividad" };

export default function AdminActivityPage() {
  return <ActivityAdmin />;
}
