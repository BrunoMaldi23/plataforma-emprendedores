"use client";

import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/field";
import { BusinessFields } from "@/features/catalog/components/business-fields";
import {
  emptyBusinessValues,
  toBusinessDraft,
  toBusinessValues,
  type BusinessFieldName,
  type BusinessFormValues,
} from "@/features/catalog/lib/business-form";
import { reviewStatusLabel } from "@/lib/format";
import { forms, type FieldErrors } from "@/lib/validation";
import type { Business, Category, ReviewStatus } from "@/types";
import type { AdminBusinessDraft } from "../state/admin-store";

const MIN_YEAR = 1900;

/** Formulario de emprendimiento del administrador (crear o editar), con estado de revisión y año de inicio. */
export function BusinessForm({
  business,
  categories,
  locations,
  onSubmit,
  onCancel,
}: {
  business?: Business;
  categories: Category[];
  locations: string[];
  onSubmit: (draft: AdminBusinessDraft) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<BusinessFormValues>(() => (business ? toBusinessValues(business) : emptyBusinessValues()));
  const [status, setStatus] = useState<ReviewStatus>(business?.status ?? "approved");
  const [year, setYear] = useState(business ? String(business.foundedYear) : "");
  const [errors, setErrors] = useState<FieldErrors<BusinessFieldName | "foundedYear">>({});
  const [saving, setSaving] = useState(false);

  function change<K extends keyof BusinessFormValues>(field: K, value: BusinessFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field as BusinessFieldName];
      return next;
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const found: FieldErrors<BusinessFieldName | "foundedYear"> = forms.business(values);
    const maxYear = new Date().getFullYear();
    const parsedYear = year.trim() ? Number(year) : undefined;
    if (parsedYear !== undefined && (!Number.isInteger(parsedYear) || parsedYear < MIN_YEAR || parsedYear > maxYear)) {
      found.foundedYear = `Escribe un año entre ${MIN_YEAR} y ${maxYear}.`;
    }
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setTimeout(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0);
      return;
    }
    setSaving(true);
    await onSubmit({ ...toBusinessDraft(values), status, foundedYear: parsedYear });
    setSaving(false);
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <BusinessFields prefix="adm-biz" values={values} errors={errors} categories={categories} locations={locations} onChange={change} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="adm-biz-status" label="Estado" value={status} onChange={(e) => setStatus(e.target.value as ReviewStatus)}>
          {(Object.keys(reviewStatusLabel) as ReviewStatus[]).map((s) => (
            <option key={s} value={s}>
              {reviewStatusLabel[s]}
            </option>
          ))}
        </SelectField>
        <TextField
          id="adm-biz-year"
          label="En el rubro desde"
          inputMode="numeric"
          placeholder="2021"
          hint="Opcional."
          value={year}
          error={errors.foundedYear}
          onChange={(e) => {
            setYear(e.target.value);
            setErrors((p) => ({ ...p, foundedYear: undefined }));
          }}
        />
      </div>
      {errorCount > 0 ? (
        <Alert tone="danger" title="Revisa los campos marcados">
          Hay {errorCount} {errorCount === 1 ? "campo" : "campos"} por corregir.
        </Alert>
      ) : null}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" loading={saving}>
          {saving ? "Guardando…" : business ? "Guardar cambios" : "Crear emprendimiento"}
        </Button>
      </div>
    </form>
  );
}
