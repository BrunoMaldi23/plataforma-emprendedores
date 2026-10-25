import type { Metadata } from "next";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";

// El rol del prototipo solo existe en el cliente (RoleGate): la ruta no se valida como navegación instantánea hasta que la
// autorización pase al servidor (ver docs/ARQUITECTURA.md).
export const instant = false;

export const metadata: Metadata = { title: "Resumen" };

export default function DashboardPage() {
  return <DashboardOverview />;
}
