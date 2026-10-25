"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { SelectField, TextField } from "@/components/ui/field";
import { PageHeader } from "@/components/ui/page-header";
import { IfCan } from "@/features/auth/role-gate";
import { OpportunityStatusBadge } from "@/features/opportunities/components/opportunity-card";
import { opportunityTypes } from "@/features/opportunities/lib/filter";
import { formatDate, opportunityStatusLabel, opportunityTypeLabel } from "@/lib/format";
import { normalize } from "@/lib/text";
import type { Opportunity, OpportunityStatus, OpportunityType } from "@/types";
import { useAdmin } from "../state/admin-store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FilterChips } from "@/components/ui/filter-chips";
import { OpportunityForm } from "./opportunity-form";

type PublicationFilter = "all" | "published" | "draft";

export function OpportunitiesAdmin() {
  const { opportunities, actions, isPending, isRecent } = useAdmin();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<OpportunityType | "">("");
  const [status, setStatus] = useState<OpportunityStatus | "">("");
  const [publication, setPublication] = useState<PublicationFilter>("all");
  const [editing, setEditing] = useState<Opportunity | "new" | null>(null);
  const [deleting, setDeleting] = useState<Opportunity | null>(null);

  const counts = useMemo(
    () => ({
      all: opportunities.length,
      published: opportunities.filter((o) => o.published).length,
      draft: opportunities.filter((o) => !o.published).length,
    }),
    [opportunities],
  );

  const rows = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return opportunities
      .filter((o) => (type ? o.type === type : true))
      .filter((o) => (status ? o.status === status : true))
      .filter((o) => (publication === "all" ? true : publication === "published" ? o.published : !o.published))
      .filter((o) => {
        if (terms.length === 0) return true;
        const haystack = normalize([o.title, o.organization, o.summary].join(" "));
        return terms.every((t) => haystack.includes(t));
      });
  }, [opportunities, query, type, status, publication]);

  const filtering = Boolean(query.trim() || type || status || publication !== "all");
  const clear = () => {
    setQuery("");
    setType("");
    setStatus("");
    setPublication("all");
  };

  return (
    <>
      <PageHeader
        title="Oportunidades"
        description="Crea, edita, publica y cierra ferias, capacitaciones, programas, fondos y convocatorias."
        actions={
          <IfCan permission="admin:write">
            <Button onClick={() => setEditing("new")}>
              <Plus aria-hidden="true" className="size-5" />
              Nueva oportunidad
            </Button>
          </IfCan>
        }
      />

      <div className="space-y-4 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <FilterChips<PublicationFilter>
          label="Filtrar por publicación"
          value={publication}
          onChange={setPublication}
          options={[
            { value: "all", label: "Todas", count: counts.all },
            { value: "published", label: "Publicadas", count: counts.published },
            { value: "draft", label: "Borradores", count: counts.draft },
          ]}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_13rem_13rem]">
          <div className="sm:col-span-2 xl:col-span-1">
            <TextField
              id="adm-op-q"
              label="Buscar"
              type="search"
              icon={Search}
              placeholder="Título o entidad"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <SelectField
            id="adm-op-type"
            label="Categoría"
            value={type}
            onChange={(e) => setType(e.target.value as OpportunityType | "")}
          >
            <option value="">Todas</option>
            {opportunityTypes.map((t) => (
              <option key={t} value={t}>
                {opportunityTypeLabel[t]}
              </option>
            ))}
          </SelectField>
          <SelectField
            id="adm-op-status"
            label="Vigencia"
            value={status}
            onChange={(e) => setStatus(e.target.value as OpportunityStatus | "")}
          >
            <option value="">Todas</option>
            {(Object.keys(opportunityStatusLabel) as OpportunityStatus[]).map((s) => (
              <option key={s} value={s}>
                {opportunityStatusLabel[s]}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p role="status" aria-live="polite" className="text-sm text-muted">
          {rows.length === 1 ? "1 oportunidad" : `${rows.length} oportunidades`}
        </p>
        {filtering ? (
          <Button variant="ghost" size="sm" onClick={clear}>
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No hay oportunidades con esos filtros"
          description="Cambia los filtros o crea una nueva oportunidad."
          action={<Button onClick={clear}>Limpiar filtros</Button>}
        />
      ) : (
        <DataTable
          caption="Oportunidades"
          rows={rows}
          rowKey={(o) => o.id}
          rowClassName={(o) => (isRecent(o.id) ? "animate-flash" : undefined)}
          columns={[
            {
              header: "Oportunidad",
              primary: true,
              cell: (o) => (
                <span className="block min-w-0">
                  <span className="block font-semibold">{o.title}</span>
                  <span className="block text-sm font-normal text-muted">{o.organization}</span>
                </span>
              ),
            },
            { header: "Categoría", cell: (o) => opportunityTypeLabel[o.type] },
            { header: "Cierre", cell: (o) => (o.deadline ? formatDate(o.deadline) : "Sin fecha") },
            { header: "Vigencia", cell: (o) => <OpportunityStatusBadge status={o.status} /> },
            {
              header: "Publicación",
              cell: (o) => (
                <Badge tone={o.published ? "success" : "neutral"}>{o.published ? "Publicada" : "Borrador"}</Badge>
              ),
            },
            {
              header: "Acciones",
              cell: (o) => {
                const busy = isPending(o.id);
                return (
                  <div className="flex flex-wrap justify-end gap-2 md:justify-start">
                    <IfCan permission="admin:write">
                      <Button size="sm" variant="secondary" disabled={busy} onClick={() => setEditing(o)}>
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant={o.published ? "secondary" : "primary"}
                        loading={busy}
                        onClick={() => actions.setOpportunityPublished(o, !o.published)}
                      >
                        {o.published ? "Despublicar" : "Publicar"}
                      </Button>
                      {o.status === "closed" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={busy}
                          onClick={() => actions.setOpportunityStatus(o, "open")}
                        >
                          Reabrir
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={busy}
                          onClick={() => actions.setOpportunityStatus(o, "closed")}
                        >
                          Cerrar
                        </Button>
                      )}
                      {!o.published ? (
                        <Button size="sm" variant="ghost" disabled={busy} onClick={() => setDeleting(o)}>
                          Eliminar
                        </Button>
                      ) : null}
                    </IfCan>
                    {/* Las creadas en esta sesión (id local-…) no existen en el sitio público. */}
                    {o.published && !o.id.startsWith("local-") ? (
                      <Link
                        href={`/oportunidades/${o.slug}`}
                        className="inline-flex min-h-9 items-center rounded-md px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        Ver
                      </Link>
                    ) : null}
                  </div>
                );
              },
            },
          ]}
        />
      )}

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Nueva oportunidad" : "Editar oportunidad"}
        description="Los cambios son de demostración y no afectan a la vista pública."
      >
        {editing !== null ? (
          <>
            {editing === "new" ? (
              <Alert tone="info" className="mb-4">
                Las oportunidades creadas aquí no aparecen en el sitio público mientras no exista el backend.
              </Alert>
            ) : null}
            <OpportunityForm
              item={editing === "new" ? undefined : editing}
              onCancel={() => setEditing(null)}
              onSubmit={async (draft) => {
                if (editing === "new") await actions.addOpportunity(draft);
                else await actions.updateOpportunity(editing, draft);
                setEditing(null);
              }}
            />
          </>
        ) : null}
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar oportunidad"
        description={deleting ? `Se eliminará «${deleting.title}». Podrás deshacerlo unos segundos después.` : ""}
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (deleting) void actions.removeOpportunity(deleting);
        }}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
