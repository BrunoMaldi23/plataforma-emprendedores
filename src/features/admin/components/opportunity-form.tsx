"use client";

import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckboxField, SelectField, TextAreaField, TextField } from "@/components/ui/field";
import { opportunityStatusLabel, opportunityTypeLabel } from "@/lib/format";
import { forms, type FieldErrors } from "@/lib/validation";
import { opportunityTypes } from "@/features/opportunities/lib/filter";
import type { Opportunity, OpportunityStatus, OpportunityType } from "@/types";
import type { OpportunityDraft } from "../state/admin-store";

type Values = {
  title: string;
  type: OpportunityType;
  status: OpportunityStatus;
  organization: string;
  startDate: string;
  deadline: string;
  summary: string;
  description: string;
  requirements: string;
  url: string;
  published: boolean;
};

type FieldName = "title" | "summary" | "description" | "organization" | "startDate" | "deadline" | "url";

function initialValues(item?: Opportunity): Values {
  return {
    title: item?.title ?? "",
    type: item?.type ?? "feria",
    status: item?.status ?? "upcoming",
    organization: item?.organization ?? "",
    startDate: item?.startDate ?? "",
    deadline: item?.deadline ?? "",
    summary: item?.summary ?? "",
    description: item?.description ?? "",
    requirements: item?.requirements.join("\n") ?? "",
    url: item?.url ?? "",
    published: item?.published ?? false,
  };
}

/** Formulario de oportunidad (crear o editar). Valida con las reglas compartidas y entrega un borrador limpio. */
export function OpportunityForm({
  item,
  onSubmit,
  onCancel,
}: {
  item?: Opportunity;
  onSubmit: (draft: OpportunityDraft) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Values>(() => initialValues(item));
  const [errors, setErrors] = useState<FieldErrors<FieldName>>({});
  const [saving, setSaving] = useState(false);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key as FieldName];
      return next;
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const found = forms.opportunity(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setTimeout(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0);
      return;
    }
    setSaving(true);
    await onSubmit({
      title: values.title.trim(),
      type: values.type,
      status: values.status,
      organization: values.organization.trim(),
      startDate: values.startDate,
      deadline: values.deadline || undefined,
      summary: values.summary.trim(),
      description: values.description.trim(),
      requirements: values.requirements
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean),
      url: values.url.trim() || "https://ejemplo.example/",
      published: values.published,
    });
    setSaving(false);
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <TextField id="op-title" label="Título" value={values.title} error={errors.title} onChange={(e) => set("title", e.target.value)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id="op-type" label="Categoría" value={values.type} onChange={(e) => set("type", e.target.value as OpportunityType)}>
          {opportunityTypes.map((t) => (
            <option key={t} value={t}>
              {opportunityTypeLabel[t]}
            </option>
          ))}
        </SelectField>
        <SelectField id="op-status" label="Vigencia" value={values.status} onChange={(e) => set("status", e.target.value as OpportunityStatus)}>
          {(Object.keys(opportunityStatusLabel) as OpportunityStatus[]).map((s) => (
            <option key={s} value={s}>
              {opportunityStatusLabel[s]}
            </option>
          ))}
        </SelectField>
      </div>
      <TextField id="op-org" label="Entidad responsable" value={values.organization} error={errors.organization} onChange={(e) => set("organization", e.target.value)} />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="op-start" label="Inicio" type="date" value={values.startDate} error={errors.startDate} onChange={(e) => set("startDate", e.target.value)} />
        <TextField id="op-deadline" label="Cierre de postulación" type="date" hint="Opcional." min={values.startDate || undefined} value={values.deadline} error={errors.deadline} onChange={(e) => set("deadline", e.target.value)} />
      </div>
      <TextField id="op-summary" label="Resumen" hint="Una frase para el listado." value={values.summary} error={errors.summary} onChange={(e) => set("summary", e.target.value)} />
      <TextAreaField id="op-desc" label="Descripción" rows={4} value={values.description} error={errors.description} onChange={(e) => set("description", e.target.value)} />
      <TextAreaField id="op-req" label="Requisitos" rows={3} hint="Uno por línea." value={values.requirements} onChange={(e) => set("requirements", e.target.value)} />
      <TextField id="op-url" label="Enlace de la convocatoria" type="url" placeholder="https://" hint="Opcional." value={values.url} error={errors.url} onChange={(e) => set("url", e.target.value)} />
      <CheckboxField id="op-published" label="Publicar en la plataforma" checked={values.published} onChange={(e) => set("published", e.target.checked)} />
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
          {saving ? "Guardando…" : item ? "Guardar cambios" : "Crear oportunidad"}
        </Button>
      </div>
    </form>
  );
}
