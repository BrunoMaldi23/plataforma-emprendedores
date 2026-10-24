import type { Metadata } from "next";
import { CategoriesAdmin } from "@/features/admin/components/categories-admin";

// El rol del prototipo solo existe en el cliente (RoleGate): la ruta no se valida como navegación instantánea hasta que la
// autorización pase al servidor (ver docs/ARQUITECTURA.md).
export const instant = false;

export const metadata: Metadata = { title: "Gestión de rubros" };

export default function AdminCategoriesPage() {
  return <CategoriesAdmin />;
}
