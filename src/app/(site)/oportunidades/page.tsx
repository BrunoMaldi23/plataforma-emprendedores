import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { DemoBadge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { OpportunitiesExplorer } from "@/features/opportunities/components/opportunities-explorer";
import { listOpportunities } from "@/lib/repository";

export const metadata: Metadata = {
  title: "Oportunidades",
  description: "Ferias, capacitaciones, programas, fondos y convocatorias de demostración.",
};

export default function OpportunitiesPage() {
  return (
    <Container className="space-y-8 py-10">
      <PageHeader
        badge={<DemoBadge />}
        title="Oportunidades para emprender"
        description="Ferias, capacitaciones, programas, fondos y convocatorias. Son ejemplos para probar la plataforma: no existen ni están abiertas realmente."
      />
      <Suspense fallback={<p role="status" className="text-muted">Cargando oportunidades…</p>}>
        <OpportunitiesExplorer opportunities={listOpportunities()} />
      </Suspense>
    </Container>
  );
}
