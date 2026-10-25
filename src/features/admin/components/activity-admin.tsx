"use client";

import { useMemo, useState } from "react";
import { Download, Search } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { TextField } from "@/components/ui/field";
import { PageHeader } from "@/components/ui/page-header";
import { downloadText, toCsv } from "@/lib/csv";
import { formatDateTime } from "@/lib/format";
import { normalize } from "@/lib/text";
import type { ActivityArea } from "@/types";
import { useAdmin } from "../state/admin-store";
import { FilterChips } from "@/components/ui/filter-chips";

type AreaFilter = ActivityArea | "all";

const areaLabel: Record<ActivityArea, string> = {
  business: "Emprendimientos",
  opportunity: "Oportunidades",
  category: "Rubros",
  system: "Sistema",
};

export function ActivityAdmin() {
  const { activity } = useAdmin();
  const [area, setArea] = useState<AreaFilter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const base: Record<AreaFilter, number> = { all: activity.length, business: 0, opportunity: 0, category: 0, system: 0 };
    for (const a of activity) base[a.area] += 1;
    return base;
  }, [activity]);

  const rows = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return activity
      .filter((a) => (area === "all" ? true : a.area === area))
      .filter((a) => {
        if (terms.length === 0) return true;
        const haystack = normalize([a.action, a.target, a.actor].join(" "));
        return terms.every((t) => haystack.includes(t));
      });
  }, [activity, area, query]);

  function exportCsv() {
    const csv = toCsv(
      ["Fecha", "Área", "Acción", "Detalle", "Responsable"],
      rows.map((a) => [a.at.replace("T", " "), areaLabel[a.area], a.action, a.target, a.actor]),
    );
    downloadText("nexora-actividad-demo.csv", csv);
  }

  return (
    <>
      <PageHeader
        title="Actividad"
        description="Bitácora de las acciones del panel. Se actualiza con lo que haces en esta sesión."
        actions={
          <Button variant="secondary" onClick={exportCsv} disabled={rows.length === 0}>
            <Download aria-hidden="true" className="size-5" />
            Exportar CSV
          </Button>
        }
      />
      <Alert tone="warning" title="Bitácora de ejemplo">
        Los registros iniciales son ficticios y los nuevos solo duran mientras no recargues la página. La auditoría real se
        implementará junto con la autenticación.
      </Alert>

      <div className="space-y-4 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <FilterChips<AreaFilter>
          label="Filtrar por área"
          value={area}
          onChange={setArea}
          options={[
            { value: "all", label: "Todas", count: counts.all },
            { value: "business", label: areaLabel.business, count: counts.business },
            { value: "opportunity", label: areaLabel.opportunity, count: counts.opportunity },
            { value: "category", label: areaLabel.category, count: counts.category },
            { value: "system", label: areaLabel.system, count: counts.system },
          ]}
        />
        <div className="max-w-md">
          <TextField
            id="adm-act-q"
            label="Buscar"
            type="search"
            icon={Search}
            placeholder="Acción, detalle o responsable"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <p role="status" aria-live="polite" className="text-sm text-muted">
        {rows.length === 1 ? "1 registro" : `${rows.length} registros`}
      </p>

      {rows.length === 0 ? (
        <EmptyState
          title="No hay registros con esos filtros"
          description="Cambia el área o la búsqueda."
          action={
            <Button
              onClick={() => {
                setArea("all");
                setQuery("");
              }}
            >
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <DataTable
          caption="Actividad reciente"
          rows={rows}
          rowKey={(a) => a.id}
          columns={[
            { header: "Acción", primary: true, cell: (a) => <span className="font-semibold">{a.action}</span> },
            { header: "Detalle", cell: (a) => a.target },
            { header: "Área", cell: (a) => <Badge tone={a.area === "system" ? "neutral" : "brand"}>{areaLabel[a.area]}</Badge> },
            { header: "Responsable", cell: (a) => a.actor },
            { header: "Fecha", cell: (a) => <span className="whitespace-nowrap">{formatDateTime(a.at)}</span> },
          ]}
        />
      )}
    </>
  );
}
