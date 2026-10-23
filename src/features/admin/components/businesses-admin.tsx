"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { SelectField } from "@/components/ui/field";
import { IfCan } from "@/features/auth/role-gate";
import { reviewStatusLabel } from "@/lib/format";
import type { Business, Category, ReviewStatus } from "@/types";

const tone = { approved: "success", pending: "warning", hidden: "neutral" } as const;

export function BusinessesAdmin({ initial, categories }: { initial: Business[]; categories: Category[] }) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<ReviewStatus | "">("");
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;
  const rows = filter ? items.filter((b) => b.status === filter) : items;

  function setStatus(id: string, status: ReviewStatus) {
    setItems((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }

  return (
    <div className="space-y-6">
      <Alert tone="info">Operaciones de demostración: los cambios no se guardan ni afectan al catálogo público.</Alert>
      <div className="max-w-xs">
        <SelectField id="f-status" label="Estado" value={filter} onChange={(e) => setFilter(e.target.value as ReviewStatus | "")}>
          <option value="">Todos</option>
          <option value="approved">Aprobados</option>
          <option value="pending">Pendientes</option>
          <option value="hidden">Ocultos</option>
        </SelectField>
      </div>
      <DataTable
        caption="Emprendimientos registrados"
        rows={rows}
        rowKey={(b) => b.id}
        columns={[
          { header: "Emprendimiento", primary: true, cell: (b) => b.name },
          { header: "Rubro", cell: (b) => categoryName(b.categoryId) },
          { header: "Sector", cell: (b) => b.location },
          { header: "Estado", cell: (b) => <Badge tone={tone[b.status]}>{reviewStatusLabel[b.status]}</Badge> },
          {
            header: "Acciones",
            cell: (b) => (
              <IfCan permission="admin:write">
                <div className="flex flex-wrap justify-end gap-2 md:justify-start">
                  {b.status !== "approved" ? (
                    <Button size="sm" onClick={() => setStatus(b.id, "approved")}>Aprobar</Button>
                  ) : null}
                  {b.status !== "hidden" ? (
                    <Button size="sm" variant="secondary" onClick={() => setStatus(b.id, "hidden")}>Ocultar</Button>
                  ) : null}
                </div>
              </IfCan>
            ),
          },
        ]}
      />
      {rows.length === 0 ? <p className="text-muted">No hay emprendimientos con ese estado.</p> : null}
    </div>
  );
}
