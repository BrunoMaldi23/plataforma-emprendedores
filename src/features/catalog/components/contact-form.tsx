"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TextAreaField, TextField } from "@/components/ui/field";
import { useDemoForm } from "@/features/forms/use-demo-form";
import { forms } from "@/lib/validation";

export function ContactForm({ businessName }: { businessName: string }) {
  const form = useDemoForm({
    initial: { name: "", email: "", message: "" },
    validate: forms.contact,
  });

  if (form.state === "success") {
    return (
      <div className="space-y-4">
        <Alert tone="success" title="Solicitud simulada correctamente">
          Esto es una demostración: tu mensaje para {businessName} no fue enviado ni almacenado.
        </Alert>
        <Button variant="secondary" onClick={form.reset}>
          Escribir otro mensaje
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={form.submit} noValidate className="space-y-4">
      <Alert tone="info">Formulario de demostración: no se envía ningún mensaje real.</Alert>
      <TextField
        id="contact-name"
        label="Tu nombre"
        autoComplete="name"
        value={form.values.name}
        error={form.errors.name}
        onChange={(e) => form.set("name", e.target.value)}
      />
      <TextField
        id="contact-email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        value={form.values.email}
        error={form.errors.email}
        onChange={(e) => form.set("email", e.target.value)}
      />
      <TextAreaField
        id="contact-message"
        label="Mensaje"
        hint="Cuenta qué necesitas, para cuándo y en qué cantidad."
        value={form.values.message}
        error={form.errors.message}
        onChange={(e) => form.set("message", e.target.value)}
      />
      {form.state === "error" ? (
        <Alert tone="danger" title="No pudimos completar la simulación">
          Intenta de nuevo en unos segundos.
        </Alert>
      ) : null}
      <Button type="submit" loading={form.state === "submitting"} className="w-full sm:w-auto">
        {form.state === "submitting" ? "Enviando…" : "Enviar solicitud"}
      </Button>
    </form>
  );
}
