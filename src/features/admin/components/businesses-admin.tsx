"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { SelectField, TextField } from "@/components/ui/field";
import { PageHeader } from "@/components/ui/page-header";
import { IfCan } from "@/features/auth/role-gate";
import { Monogram } from "@/features/catalog/components/monogram";
import { reviewStatusLabel } from "@/lib/format";
import { normalize } from "@/lib/text";
import type { Business, ReviewStatus } from "@/types";
import { useAdmin } from "../state/admin-store";
import { BusinessForm } from "./business-form";
import { ConfirmDialog } from "./confirm-dialog";
import { FilterChips } from "./filter-chips";

const tone = { approved: "success", pending: "warning", hidden: "neutral" } as const;
type StatusFilter = ReviewStatus | "all";

export function BusinessesAdmin() {
  const { businesses, categories, locations, actions, isPending, isRecent } = useAdmin();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("");
  const [editing, setEditing] = useState<Business | "new" | null>(null);
  const [deleting, setDeleting] = useState<Business | null>(null);
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

  const counts = useMemo(
    () => ({
      all: businesses.length,
      pending: businesses.filter((b) => b.status === "pending").length,
      approved: businesses.filter((b) => b.status === "approved").length,
      hidden: businesses.filter((b) => b.status === "hidden").length,
    }),
    [businesses],
  );

  const rows = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    const order: Record<ReviewStatus, number> = { pending: 0, approved: 1, hidden: 2 };
    return businesses
      .filter((b) => (status === "all" ? true : b.status === status))
      .filter((b) => (category ? b.categoryId === category : true))
      .filter((b) => {
        if (terms.length === 0) return true;
        const haystack = normalize([b.name, b.tagline, b.location, b.contactEmail, ...b.tags].join(" "));
        return terms.every((t) => haystack.includes(t));
      })
      .sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name, "es"));
  }, [businesses, query, status, category]);

  const filtering = Boolean(query.trim() || category || status !== "all");
  const clear = () => {
    setQuery("");
    setCategory("");
    setStatus("all");
  };

  return (
    <>
      <PageHeader
        title="Emprendimientos"
        description="Crea, edita y revisa los perfiles: aprueba los que cumplen y oculta los que no deben verse en el catálogo."
        actions={
          <IfCan permission="admin:write">
            <Button onClick={() => setEditing("new")}>
              <Plus aria-hidden="true" className="size-5" />
              Nuevo emprendimiento
            </Button>
          </IfCan>
        }
      />

      <div className="space-y-4 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <FilterChips<StatusFilter>
          label="Filtrar por estado"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "Todos", count: counts.all },
            { value: "pending", label: "Pendientes", count: counts.pending },
            { value: "approved", label: "Aprobados", count: counts.approved },
            { value: "hidden", label: "Ocultos", count: counts.hidden },
          ]}
        />
        <div className="grid gap-4 sm:grid-cols-[1fr_16rem]">
          <TextField
            id="adm-biz-q"
            label="Buscar"
            type="search"
            icon={Search}
            placeholder="Nombre, sector, correo o etiqueta"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <SelectField id="adm-biz-cat" label="Rubro" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Todos los rubros</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p role="status" aria-live="polite" className="text-sm text-muted">
          {rows.length === 1 ? "1 emprendimiento" : `${rows.length} emprendimientos`}
        </p>
        {filtering ? (
          <Button variant="ghost" size="sm" onClick={clear}>
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title="No hay emprendimientos con esos filtros"
          description="Cambia la búsqueda, el estado o el rubro, o crea un emprendimiento nuevo."
          action={<Button onClick={clear}>Limpiar filtros</Button>}
        />
      ) : (
        <DataTable
          caption="Emprendimientos registrados"
          rows={rows}
          rowKey={(b) => b.id}
          rowClassName={(b) => (isRecent(b.id) ? "animate-flash" : undefined)}
          columns={[
            {
              header: "Emprendimiento",
              primary: true,
              cell: (b) => (
                <span className="flex items-center gap-3">
                  <Monogram name={b.name} categoryId={b.categoryId} size="sm" />
                  <span className="min-w-0">
                    <span className="block font-semibold">{b.name}</span>
                    <span className="block text-sm font-normal text-muted">{b.location}, Temuco</span>
                  </span>
                </span>
              ),
            },
            { header: "Rubro", cell: (b) => categoryName(b.categoryId) },
            { header: "Contacto", cell: (b) => <span className="break-all">{b.contactEmail}</span> },
            { header: "Estado", cell: (b) => <Badge tone={tone[b.status]}>{reviewStatusLabel[b.status]}</Badge> },
            {
              header: "Acciones",
              cell: (b) => {
                const busy = isPending(b.id);
                return (
                  <div className="flex flex-wrap justify-end gap-2 md:justify-start">
                    <IfCan permission="admin:write">
                      {b.status !== "approved" ? (
                        <Button size="sm" loading={busy} onClick={() => actions.setBusinessStatus(b, "approved")}>
                          Aprobar
                        </Button>
                      ) : null}
                      {b.status !== "hidden" ? (
                        <Button size="sm" variant="secondary" disabled={busy} onClick={() => actions.setBusinessStatus(b, "hidden")}>
                          Ocultar
                        </Button>
                      ) : null}
                      <Button size="sm" variant="ghost" disabled={busy} onClick={() => setEditing(b)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" disabled={busy} onClick={() => setDeleting(b)}>
                        Eliminar
                      </Button>
                    </IfCan>
                    {/* Los creados en esta sesión (id local-…) no existen en el sitio público. */}
                    {b.status === "approved" && !b.id.startsWith("local-") ? (
                      <Link
                        href={`/emprendimientos/${b.slug}`}
                        className="inline-flex min-h-9 items-center rounded-md px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        Ver ficha
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
        title={editing === "new" ? "Nuevo emprendimiento" : "Editar emprendimiento"}
        description="Los cambios son de demostración y no afectan al catálogo público."
      >
        {editing !== null ? (
          <BusinessForm
            business={editing === "new" ? undefined : editing}
            categories={categories}
            locations={locations}
            onCancel={() => setEditing(null)}
            onSubmit={async (draft) => {
              if (editing === "new") await actions.addBusiness(draft);
              else await actions.updateBusiness(editing, draft);
              setEditing(null);
            }}
          />
        ) : null}
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar emprendimiento"
        description={deleting ? `Se eliminará «${deleting.name}» del panel. Podrás deshacerlo unos segundos después.` : ""}
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (deleting) void actions.removeBusiness(deleting);
        }}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
