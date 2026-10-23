import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { BusinessesAdmin } from "@/features/admin/components/businesses-admin";
import { listBusinesses, listCategories } from "@/lib/repository";

export const metadata: Metadata = { title: "Gestión de emprendimientos" };

export default function AdminBusinessesPage() {
  return (
    <>
      <PageHeader title="Emprendimientos" description="Revisa, aprueba u oculta perfiles." />
      <BusinessesAdmin initial={listBusinesses({ includeUnapproved: true })} categories={listCategories()} />
    </>
  );
}
