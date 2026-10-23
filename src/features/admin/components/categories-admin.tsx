"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { TextField } from "@/components/ui/field";
import { IfCan } from "@/features/auth/role-gate";
import type { CategoryCount } from "../lib/metrics";

export function CategoriesAdmin({ initial }: { initial: CategoryCount[] }) {
  const [items, setItems] = useState(initial);
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();

  function add(e: React.FormEvent) {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return setError("Escribe el nombre del rubro.");
    if (items.some((i) => i.category.name.toLowerCase() === clean.toLowerCase())) {
      return setError("Ya existe un rubro con ese nombre.");
    }
    setItems((prev) => [
      ...prev,
      { category: { id: `local-${prev.length}`, name: clean, description: "Rubro agregado en la demostración." }, count: 0 },
    ]);
    setName("");
    setError(undefined);
  }

  return (
    <div className="space-y-6">
      <Alert tone="info">Los rubros nuevos solo existen en esta vista de demostración.</Alert>
      <IfCan permission="admin:write">
        <form onSubmit={add} noValidate className="flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <TextField id="cat-name" label="Nuevo rubro" value={name} error={error} onChange={(e) => { setName(e.target.value); setError(undefined); }} />
          </div>
          <Button type="submit">Agregar rubro</Button>
        </form>
      </IfCan>
      <DataTable
        caption="Rubros"
        rows={items}
        rowKey={(i) => i.category.id}
        columns={[
          { header: "Rubro", primary: true, cell: (i) => i.category.name },
          { header: "Descripción", cell: (i) => i.category.description },
          { header: "Emprendimientos", cell: (i) => i.count },
        ]}
      />
    </div>
  );
}
