import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { CategoriesAdmin } from "@/features/admin/components/categories-admin";
import { countByCategory } from "@/features/admin/lib/metrics";
import { listBusinesses, listCategories } from "@/lib/repository";

export const metadata: Metadata = { title: "Gestión de rubros" };

export default function AdminCategoriesPage() {
  const counts = countByCategory(listBusinesses({ includeUnapproved: true }), listCategories());
  return (
    <>
      <PageHeader title="Rubros" description="Organiza las categorías con las que se clasifican los emprendimientos." />
      <CategoriesAdmin initial={counts} />
    </>
  );
}
