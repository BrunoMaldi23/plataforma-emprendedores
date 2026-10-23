"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { useDemoForm } from "@/features/forms/use-demo-form";
import { forms } from "@/lib/validation";

export function LoginForm() {
  const form = useDemoForm({
    initial: { email: "", password: "" },
    validate: forms.login,
  });

  return (
    <form onSubmit={form.submit} noValidate className="space-y-4">
      <TextField
        id="login-email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        value={form.values.email}
        error={form.errors.email}
        onChange={(e) => form.set("email", e.target.value)}
      />
      <TextField
        id="login-password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={form.values.password}
        error={form.errors.password}
        onChange={(e) => form.set("password", e.target.value)}
      />
      {form.state === "success" ? (
        <Alert tone="warning" title="Aún no hay inicio de sesión real">
          Revisamos el formato de tus datos, pero no se verificó ninguna cuenta. Usa los roles de demostración para
          recorrer la plataforma.
        </Alert>
      ) : null}
      <Button type="submit" loading={form.state === "submitting"} className="w-full">
        {form.state === "submitting" ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
