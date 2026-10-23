"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckboxField, TextField } from "@/components/ui/field";
import { useDemoForm } from "@/features/forms/use-demo-form";
import { forms } from "@/lib/validation";

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
    <form onSubmit={form.submit} noValidate className="space-y-4">
      <TextField
        id="reg-name"
        label="Tu nombre"
        autoComplete="name"
        value={form.values.name}
        error={form.errors.name}
        onChange={(e) => form.set("name", e.target.value)}
      />
      <TextField
        id="reg-business"
        label="Nombre de tu emprendimiento"
        autoComplete="organization"
        value={form.values.businessName}
        error={form.errors.businessName}
        onChange={(e) => form.set("businessName", e.target.value)}
      />
      <TextField
        id="reg-email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        value={form.values.email}
        error={form.errors.email}
        onChange={(e) => form.set("email", e.target.value)}
      />
      <TextField
        id="reg-password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        hint="Mínimo 8 caracteres, con letras y números."
        value={form.values.password}
        error={form.errors.password}
        onChange={(e) => form.set("password", e.target.value)}
      />
      <TextField
        id="reg-confirm"
        label="Repite la contraseña"
        type="password"
        autoComplete="new-password"
        value={form.values.confirm}
        error={form.errors.confirm}
        onChange={(e) => form.set("confirm", e.target.value)}
      />
      <CheckboxField
        id="reg-terms"
        label="Entiendo que esta es una demostración y que no se crea una cuenta real."
        checked={form.values.terms}
        error={form.errors.terms}
        onChange={(e) => form.set("terms", e.target.checked)}
      />
      {form.state === "error" ? (
        <Alert tone="danger" title="No pudimos procesar el formulario">
          Intenta de nuevo en unos segundos.
        </Alert>
      ) : null}
      <Button type="submit" loading={form.state === "submitting"} className="w-full">
        {form.state === "submitting" ? "Validando…" : "Crear cuenta"}
      </Button>
    </form>
  );
}
