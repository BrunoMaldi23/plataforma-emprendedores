"use client";

import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog } from "@/components/ui/dialog";
import { TextAreaField, TextField } from "@/components/ui/field";
import { PageHeader } from "@/components/ui/page-header";
import { IfCan } from "@/features/auth/role-gate";
import { forms } from "@/lib/validation";
import type { Category } from "@/types";
import { countByCategory } from "../lib/metrics";
import { useAdmin } from "../state/admin-store";
import { ConfirmDialog } from "./confirm-dialog";

function CategoryForm({
  category,
  others,
  onSubmit,
  onCancel,
}: {
  category?: Category;
  others: Category[];
  onSubmit: (name: string, description: string) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const found: { name?: string; description?: string } = forms.category({ name, description });
    if (!found.name && others.some((c) => c.name.toLowerCase() === name.trim().toLowerCase())) {
      found.name = "Ya existe un rubro con ese nombre.";
    }
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setTimeout(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0);
      return;
    }
    setSaving(true);
    await onSubmit(name, description);
    setSaving(false);
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <TextField
        id="cat-name"
        label="Nombre del rubro"
        value={name}
        error={errors.name}
        onChange={(e) => {
          setName(e.target.value);
          setErrors((p) => ({ ...p, name: undefined }));
        }}
      />
      <TextAreaField
        id="cat-desc"
        label="Descripción"
        rows={3}
        hint="Explica qué tipo de negocios incluye."
        value={description}
        error={errors.description}
        onChange={(e) => {
          setDescription(e.target.value);
          setErrors((p) => ({ ...p, description: undefined }));
        }}
      />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving}>
          {saving ? "Guardando…" : category ? "Guardar cambios" : "Crear rubro"}
        </Button>
      </div>
    </form>
  );
}

export function CategoriesAdmin() {
  const { businesses, categories, actions, isPending, isRecent } = useAdmin();
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const rows = countByCategory(businesses, categories);
  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <>
      <PageHeader
        title="Rubros"
        description="Organiza las categorías con las que se clasifican los emprendimientos. Un rubro en uso no se puede eliminar."
        actions={
          <IfCan permission="admin:write">
            <Button onClick={() => setEditing("new")}>
              <Plus aria-hidden="true" className="size-5" />
              Nuevo rubro
            </Button>
          </IfCan>
        }
      />

      <DataTable
        caption="Rubros"
        rows={rows}
        rowKey={(r) => r.category.id}
        rowClassName={(r) => (isRecent(r.category.id) ? "animate-flash" : undefined)}
        columns={[
          { header: "Rubro", primary: true, cell: (r) => <span className="font-semibold">{r.category.name}</span> },
          { header: "Descripción", cell: (r) => <span className="text-muted">{r.category.description}</span> },
          {
            header: "Emprendimientos",
            cell: (r) => (
              <span className="flex items-center gap-3">
                <span aria-hidden="true" className="hidden h-2.5 w-24 overflow-hidden rounded-full bg-canvas md:block">
                  <span
                    className="block h-full rounded-full bg-blue-600"
                    style={{ width: `${(r.count / max) * 100}%` }}
                  />
                </span>
                <span className="font-semibold tabular-nums">{r.count}</span>
              </span>
            ),
          },
          {
            header: "Acciones",
            cell: (r) => {
              const busy = isPending(r.category.id);
              return (
                <IfCan permission="admin:write">
                  <div className="flex flex-wrap items-center justify-end gap-2 md:justify-start">
                    <Button size="sm" variant="secondary" disabled={busy} onClick={() => setEditing(r.category)}>
                      Editar
                    </Button>
                    {r.count === 0 ? (
                      <Button size="sm" variant="ghost" loading={busy} onClick={() => setDeleting(r.category)}>
                        Eliminar
                      </Button>
                    ) : (
                      <span className="text-sm text-muted">En uso</span>
                    )}
                  </div>
                </IfCan>
              );
            },
          },
        ]}
      />

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Nuevo rubro" : "Editar rubro"}
      >
        {editing !== null ? (
          <CategoryForm
            category={editing === "new" ? undefined : editing}
            others={categories.filter((c) => editing === "new" || c.id !== editing.id)}
            onCancel={() => setEditing(null)}
            onSubmit={async (name, description) => {
              if (editing === "new") await actions.addCategory(name, description);
              else await actions.updateCategory(editing, name, description);
              setEditing(null);
            }}
          />
        ) : null}
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar rubro"
        description={
          deleting ? `Se eliminará el rubro «${deleting.name}». Podrás deshacerlo unos segundos después.` : ""
        }
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (deleting) void actions.removeCategory(deleting);
        }}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
