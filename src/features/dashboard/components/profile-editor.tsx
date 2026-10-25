"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BusinessFields } from "@/features/catalog/components/business-fields";
import { toBusinessDraft, toBusinessValues, type BusinessFormValues } from "@/features/catalog/lib/business-form";
import { useDemoForm } from "@/features/forms/use-demo-form";
import { forms } from "@/lib/validation";
import { useDashboard } from "../state/dashboard-store";

function ProfileForm() {
  const { business, categories, locations, actions } = useDashboard();
  const initial = toBusinessValues(business);
  const form = useDemoForm({
    initial,
    validate: forms.business,
    simulate: (values) => actions.updateBusiness(toBusinessDraft(values)),
  });
  const dirty = JSON.stringify(form.values) !== JSON.stringify(initial);

  return (
    <form
      onSubmit={form.submit}
      noValidate
      className="max-w-3xl space-y-4 rounded-lg border border-line bg-surface p-6 sm:p-8"
    >
      <BusinessFields
        prefix="p"
        values={form.values}
        errors={form.errors}
        categories={categories}
        locations={locations}
        onChange={<K extends keyof BusinessFormValues>(field: K, value: BusinessFormValues[K]) => form.set(field, value)}
      />
      {form.errorCount > 0 ? (
        <Alert tone="danger" title="Revisa los campos marcados">
          Hay {form.errorCount} {form.errorCount === 1 ? "campo" : "campos"} por corregir.
        </Alert>
      ) : null}
      <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <Button type="submit" loading={form.state === "submitting"} disabled={!dirty}>
          {form.state === "submitting" ? "Guardando…" : "Guardar cambios"}
        </Button>
        <Button variant="secondary" disabled={!dirty || form.state === "submitting"} onClick={form.reset}>
          Descartar cambios
        </Button>
        <p aria-live="polite" className="text-sm text-muted">
          {dirty ? "Tienes cambios sin guardar." : "Todo guardado en esta sesión de demostración."}
        </p>
      </div>
    </form>
  );
}

export function ProfileEditor() {
  const { business } = useDashboard();
  // Se vuelve a montar cuando cambia el perfil guardado (p. ej. al deshacer), para que el formulario refleje lo guardado.
  return <ProfileForm key={JSON.stringify(toBusinessValues(business))} />;
}
