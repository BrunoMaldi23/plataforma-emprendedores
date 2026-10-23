"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { useDemoForm } from "@/features/forms/use-demo-form";
import { formatClp } from "@/lib/format";
import { forms } from "@/lib/validation";
import type { Offering, OfferingKind } from "@/types";

export function OfferingsManager({ businessId, initial }: { businessId: string; initial: Offering[] }) {
  const [items, setItems] = useState<Offering[]>(initial);
  const [kind, setKind] = useState<OfferingKind>("product");
  const [adding, setAdding] = useState(false);

  const form = useDemoForm({
    initial: { name: "", description: "", price: "" },
    validate: forms.offering,
    simulate: async (values) => {
      setItems((prev) => [
        ...prev,
        {
          id: `local-${prev.length + 1}-${values.name}`,
          businessId,
          kind,
          name: values.name.trim(),
          description: values.description.trim(),
          priceClp: values.price.trim() ? Number(values.price) : undefined,
        },
      ]);
      setAdding(false);
    },
  });

  return (
    <div className="space-y-6">
      <Alert tone="info">Lista de demostración: los cambios se pierden al recargar la página.</Alert>

      <div className="flex justify-end">
        <Button onClick={() => { setAdding((v) => !v); form.reset(); }} variant={adding ? "secondary" : "primary"}>
          <Plus aria-hidden="true" className="size-4" />
          {adding ? "Cerrar formulario" : "Agregar producto o servicio"}
        </Button>
      </div>

      {adding ? (
        <form onSubmit={form.submit} noValidate className="space-y-4 rounded-lg border border-line bg-surface p-6">
          <SelectField id="o-kind" label="Tipo" value={kind} onChange={(e) => setKind(e.target.value as OfferingKind)}>
            <option value="product">Producto</option>
            <option value="service">Servicio</option>
          </SelectField>
          <TextField id="o-name" label="Nombre" value={form.values.name} error={form.errors.name} onChange={(e) => form.set("name", e.target.value)} />
          <TextAreaField id="o-desc" label="Descripción" rows={3} value={form.values.description} error={form.errors.description} onChange={(e) => form.set("description", e.target.value)} />
          <TextField id="o-price" label="Precio referencial (CLP)" inputMode="numeric" hint="Déjalo vacío si es a cotizar." value={form.values.price} error={form.errors.price} onChange={(e) => form.set("price", e.target.value)} />
          <Button type="submit" loading={form.state === "submitting"}>Agregar</Button>
        </form>
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          title="Aún no tienes productos ni servicios"
          description="Agrega al menos uno para que los compradores sepan qué ofreces."
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {items.map((o) => (
            <li key={o.id} className="flex items-start justify-between gap-4 rounded-lg border border-line bg-surface p-4">
              <div className="min-w-0">
                <Badge tone="brand">{o.kind === "product" ? "Producto" : "Servicio"}</Badge>
                <p className="mt-2 font-semibold">{o.name}</p>
                <p className="text-sm text-muted">{o.description}</p>
                <p className="mt-1 text-sm font-semibold">{o.priceClp ? formatClp(o.priceClp) : "A cotizar"}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                aria-label={`Quitar ${o.name}`}
                onClick={() => setItems((prev) => prev.filter((x) => x.id !== o.id))}
              >
                <Trash2 aria-hidden="true" className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
