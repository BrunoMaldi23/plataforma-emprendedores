"use client";

import { Mail, Store, User } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckboxField, TextField } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { useDemoForm } from "@/features/forms/use-demo-form";
import { forms } from "@/lib/validation";
import { PasswordChecklist } from "./password-checklist";

export function RegisterForm() {
  const form = useDemoForm({
    initial: { name: "", businessName: "", email: "", password: "", confirm: "", terms: false },
    validate: forms.register,
  });

  if (form.state === "success") {
    return (
      <div className="space-y-4">
        <Alert tone="warning" title="Datos válidos, pero no se creó ninguna cuenta">
          La autenticación y el almacenamiento aún no están integrados, por lo que no guardamos ni enviamos nada. En
          la siguiente fase este formulario creará tu cuenta real.
        </Alert>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/login">Probar un rol de demostración</Button>
          <Button variant="secondary" onClick={form.reset}>
            Volver al formulario
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.submit} noValidate className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-bold">Sobre ti y tu negocio</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="reg-name"
            label="Tu nombre"
            icon={User}
            placeholder="Nombre y apellido"
            autoComplete="name"
            value={form.values.name}
            error={form.errors.name}
            onChange={(e) => form.set("name", e.target.value)}
          />
          <TextField
            id="reg-business"
            label="Nombre del emprendimiento"
            icon={Store}
            placeholder="Cómo se llama tu negocio"
            autoComplete="organization"
            value={form.values.businessName}
            error={form.errors.businessName}
            onChange={(e) => form.set("businessName", e.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-lg font-bold">Tu acceso</legend>
        <TextField
          id="reg-email"
          label="Correo electrónico"
          type="email"
          icon={Mail}
          placeholder="nombre@correo.cl"
          autoComplete="email"
          value={form.values.email}
          error={form.errors.email}
          onChange={(e) => form.set("email", e.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <PasswordField
            id="reg-password"
            label="Contraseña"
            placeholder="Crea una contraseña"
            autoComplete="new-password"
            value={form.values.password}
            error={form.errors.password}
            onChange={(e) => form.set("password", e.target.value)}
          />
          <PasswordField
            id="reg-confirm"
            label="Repite la contraseña"
            placeholder="Escríbela de nuevo"
            autoComplete="new-password"
            value={form.values.confirm}
            error={form.errors.confirm}
            onChange={(e) => form.set("confirm", e.target.value)}
          />
        </div>
        <PasswordChecklist value={form.values.password} />
      </fieldset>

      <div className="space-y-4">
        <CheckboxField
          id="reg-terms"
          label="Entiendo que esta es una demostración y que no se crea una cuenta real."
          checked={form.values.terms}
          error={form.errors.terms}
          onChange={(e) => form.set("terms", e.target.checked)}
        />
        {form.errorCount > 0 ? (
          <Alert tone="danger" title="Revisa los campos marcados">
            Hay {form.errorCount} {form.errorCount === 1 ? "campo" : "campos"} por corregir antes de continuar.
          </Alert>
        ) : null}
        {form.state === "error" ? (
          <Alert tone="danger" title="No pudimos procesar el formulario">
            Intenta de nuevo en unos segundos.
          </Alert>
        ) : null}
        <Button type="submit" size="lg" loading={form.state === "submitting"} className="w-full">
          {form.state === "submitting" ? "Validando…" : "Crear cuenta"}
        </Button>
      </div>
    </form>
  );
}
