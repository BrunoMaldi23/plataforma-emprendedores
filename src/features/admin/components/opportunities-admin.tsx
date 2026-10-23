"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { IfCan } from "@/features/auth/role-gate";
import { OpportunityStatusBadge } from "@/features/opportunities/components/opportunity-card";
import { formatDate, opportunityTypeLabel } from "@/lib/format";
import type { Opportunity } from "@/types";

export function OpportunitiesAdmin({ initial }: { initial: Opportunity[] }) {
  const [items, setItems] = useState(initial);

  function patch(id: string, change: Partial<Opportunity>) {
    setItems((prev) => prev.map((o) => (o.id === id ? { ...o, ...change } : o)));
  }

  return (
    <div className="space-y-6">
      <Alert tone="info">Operaciones de demostración: publicar o cerrar no afecta a la vista pública.</Alert>
      <DataTable
        caption="Oportunidades"
        rows={items}
        rowKey={(o) => o.id}
        columns={[
          { header: "Título", primary: true, cell: (o) => o.title },
          { header: "Categoría", cell: (o) => opportunityTypeLabel[o.type] },
          { header: "Cierre", cell: (o) => (o.deadline ? formatDate(o.deadline) : "Sin fecha") },
          { header: "Vigencia", cell: (o) => <OpportunityStatusBadge status={o.status} /> },
          { header: "Publicación", cell: (o) => <Badge tone={o.published ? "success" : "neutral"}>{o.published ? "Publicada" : "Borrador"}</Badge> },
          {
            header: "Acciones",
            cell: (o) => (
              <IfCan permission="admin:write">
                <div className="flex flex-wrap justify-end gap-2 md:justify-start">
                  <Button size="sm" variant="secondary" onClick={() => patch(o.id, { published: !o.published })}>
                    {o.published ? "Despublicar" : "Publicar"}
                  </Button>
                  {o.status !== "closed" ? (
                    <Button size="sm" variant="ghost" onClick={() => patch(o.id, { status: "closed" })}>
                      Cerrar
                    </Button>
                  ) : null}
                </div>
              </IfCan>
            ),
          },
        ]}
      />
    </div>
  );
}
