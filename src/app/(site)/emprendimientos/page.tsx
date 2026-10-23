import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { DemoBadge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { CatalogExplorer } from "@/features/catalog/components/catalog-explorer";
import { listBusinesses, listCategories, listLocations } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Emprendimientos",
  description: "Busca emprendimientos de Temuco por nombre, rubro y sector.",
};

export default function CatalogPage() {
  return (
    <Container className="space-y-8 py-10">
      <PageHeader
        badge={<DemoBadge />}
        title="Emprendimientos de Temuco"
        description="Busca por nombre o palabra clave y filtra por rubro y sector. Los negocios de esta versión son ficticios."
      />
      <Suspense fallback={<p role="status" className="text-muted">Cargando catálogo…</p>}>
        <CatalogExplorer businesses={listBusinesses()} categories={listCategories()} locations={listLocations()} />
      </Suspense>
    </Container>
  );
}
