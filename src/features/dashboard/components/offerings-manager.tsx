"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Package, Plus, Wrench } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FilterChips } from "@/components/ui/filter-chips";
import { formatClp } from "@/lib/format";
import { forms, type FieldErrors } from "@/lib/validation";
import type { Offering, OfferingKind } from "@/types";
import { useDashboard, type OfferingDraft } from "../state/dashboard-store";

type KindFilter = OfferingKind | "all";
type FieldName = "name" | "description" | "price";

function OfferingForm({
  offering,
  onSubmit,
  onCancel,
}: {
  offering?: Offering;
  onSubmit: (draft: OfferingDraft) => Promise<void>;
  onCancel: () => void;
}) {
  const [kind, setKind] = useState<OfferingKind>(offering?.kind ?? "product");
  const [name, setName] = useState(offering?.name ?? "");
  const [description, setDescription] = useState(offering?.description ?? "");
  const [price, setPrice] = useState(offering?.priceClp ? String(offering.priceClp) : "");
  const [errors, setErrors] = useState<FieldErrors<FieldName>>({});
  const [saving, setSaving] = useState(false);

  const clear = (field: FieldName) => setErrors((prev) => ({ ...prev, [field]: undefined }));

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const found = forms.offering({ name, description, price });
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setTimeout(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0);
      return;
    }
    setSaving(true);
    await onSubmit({
      kind,
      name: name.trim(),
      description: description.trim(),
      priceClp: price.trim() ? Number(price) : undefined,
    });
    setSaving(false);
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <SelectField id="of-kind" label="Tipo" value={kind} onChange={(e) => setKind(e.target.value as OfferingKind)}>
        <option value="product">Producto</option>
        <option value="service">Servicio</option>
      </SelectField>
      <TextField
        id="of-name"
        label="Nombre"
        value={name}
        error={errors.name}
        onChange={(e) => {
          setName(e.target.value);
          clear("name");
        }}
      />
      <TextAreaField
        id="of-desc"
        label="Descripción"
        rows={3}
        value={description}
        error={errors.description}
        onChange={(e) => {
          setDescription(e.target.value);
          clear("description");
        }}
      />
      <TextField
        id="of-price"
        label="Precio referencial (CLP)"
        inputMode="numeric"
        hint="Solo números. Déjalo vacío si es a cotizar."
        value={price}
        error={errors.price}
        onChange={(e) => {
          setPrice(e.target.value);
          clear("price");
        }}
      />
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving}>
          {saving ? "Guardando…" : offering ? "Guardar cambios" : "Agregar"}
        </Button>
      </div>
    </form>
  );
}

export function OfferingsManager() {
  const { offerings, actions, isPending, isRecent } = useDashboard();
  const [filter, setFilter] = useState<KindFilter>("all");
  const [editing, setEditing] = useState<Offering | "new" | null>(null);
  const [deleting, setDeleting] = useState<Offering | null>(null);

  const counts = useMemo(
    () => ({
      all: offerings.length,
      product: offerings.filter((o) => o.kind === "product").length,
      service: offerings.filter((o) => o.kind === "service").length,
    }),
    [offerings],
  );
  const items = filter === "all" ? offerings : offerings.filter((o) => o.kind === filter);

  return (
    <div className="space-y-6">
      <Alert tone="info">Lista de demostración: los cambios duran mientras el panel esté abierto y puedes deshacerlos.</Alert>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterChips<KindFilter>
          label="Filtrar por tipo"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "Todos", count: counts.all },
            { value: "product", label: "Productos", count: counts.product },
            { value: "service", label: "Servicios", count: counts.service },
          ]}
        />
        <Button onClick={() => setEditing("new")}>
          <Plus aria-hidden="true" className="size-5" />
          Agregar producto o servicio
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={offerings.length === 0 ? "Aún no tienes productos ni servicios" : "No hay elementos de ese tipo"}
          description={
            offerings.length === 0
              ? "Agrega al menos uno para que los compradores sepan qué ofreces."
              : "Cambia el filtro o agrega uno nuevo."
          }
          action={<Button onClick={() => setEditing("new")}>Agregar producto o servicio</Button>}
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((o) => {
            const Icon = o.kind === "product" ? Package : Wrench;
            const busy = isPending(o.id);
            return (
              <li
                key={o.id}
                className={`flex flex-col rounded-lg border border-line bg-surface p-5 ${isRecent(o.id) ? "animate-flash" : ""}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Icon className="size-5" />
                  </span>
                  <Badge tone="brand">{o.kind === "product" ? "Producto" : "Servicio"}</Badge>
                </div>
                <p className="mt-4 text-lg font-bold">{o.name}</p>
                <p className="mt-1 flex-1 text-muted">{o.description}</p>
                <p className="mt-4 font-display text-xl font-bold">{o.priceClp ? formatClp(o.priceClp) : "A cotizar"}</p>
                <div className="mt-4 flex gap-2 border-t border-line pt-4">
                  <Button size="sm" variant="secondary" disabled={busy} onClick={() => setEditing(o)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" loading={busy} onClick={() => setDeleting(o)}>
                    Eliminar
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "Agregar producto o servicio" : "Editar producto o servicio"}
      >
        {editing !== null ? (
          <OfferingForm
            offering={editing === "new" ? undefined : editing}
            onCancel={() => setEditing(null)}
            onSubmit={async (draft) => {
              if (editing === "new") await actions.addOffering(draft);
              else await actions.updateOffering(editing, draft);
              setEditing(null);
            }}
          />
        ) : null}
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        title="Eliminar de tu oferta"
        description={deleting ? `Se quitará «${deleting.name}». Podrás deshacerlo unos segundos después.` : ""}
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (deleting) void actions.removeOffering(deleting);
        }}
        onClose={() => setDeleting(null)}
      />
    </div>
  );
}
