"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TextAreaField, TextField } from "@/components/ui/field";
import { useDemoForm } from "@/features/forms/use-demo-form";
import { forms } from "@/lib/validation";
import type { Business } from "@/types";

export function ProfileEditor({ business }: { business: Business }) {
  const form = useDemoForm({
    initial: {
      name: business.name,
      tagline: business.tagline,
      description: business.description,
      email: business.contactEmail,
    },
    validate: forms.profile,
    keepSavedOnLeave: true,
  });

  return (
    <form onSubmit={form.submit} noValidate className="max-w-2xl space-y-4 rounded-lg border border-line bg-surface p-6">
      <Alert tone="info">
        Los cambios solo viven en esta página mientras la tengas abierta; no se guardan en ningún servidor.
      </Alert>
      <TextField id="p-name" label="Nombre del negocio" value={form.values.name} error={form.errors.name} onChange={(e) => form.set("name", e.target.value)} />
      <TextField id="p-tagline" label="Frase breve" hint="Aparece en las tarjetas del catálogo." value={form.values.tagline} error={form.errors.tagline} onChange={(e) => form.set("tagline", e.target.value)} />
      <TextAreaField id="p-desc" label="Descripción" rows={5} value={form.values.description} error={form.errors.description} onChange={(e) => form.set("description", e.target.value)} />
      <TextField id="p-email" label="Correo de contacto" type="email" value={form.values.email} error={form.errors.email} onChange={(e) => form.set("email", e.target.value)} />
      {form.state === "success" ? (
        <Alert tone="success" title="Cambios aplicados en esta vista">
          Recuerda que es una demostración: al recargar la página volverás a los datos de ejemplo.
        </Alert>
      ) : null}
      <Button type="submit" loading={form.state === "submitting"}>
        {form.state === "submitting" ? "Guardando…" : "Guardar cambios"}
      </Button>
    </form>
  );
}
