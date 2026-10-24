"use client";

import { Mail } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/field";
import { PasswordField } from "@/components/ui/password-field";
import { useDemoForm } from "@/features/forms/use-demo-form";
import { forms } from "@/lib/validation";

export function LoginForm() {
  const form = useDemoForm({
    initial: { email: "", password: "" },
    validate: forms.login,
  });

  return (
    <form onSubmit={form.submit} noValidate className="space-y-5">
      <TextField
        id="login-email"
        label="Correo electrónico"
        type="email"
        icon={Mail}
        placeholder="nombre@correo.cl"
        autoComplete="email"
        value={form.values.email}
        error={form.errors.email}
        onChange={(e) => form.set("email", e.target.value)}
      />
      <PasswordField
        id="login-password"
        label="Contraseña"
        placeholder="Tu contraseña"
        autoComplete="current-password"
        value={form.values.password}
        error={form.errors.password}
        onChange={(e) => form.set("password", e.target.value)}
      />
      {form.errorCount > 0 ? (
        <Alert tone="danger" title="Revisa los campos marcados">
          Completa tu correo y tu contraseña para continuar.
        </Alert>
      ) : null}
      {form.state === "success" ? (
        <Alert tone="warning" title="Aún no hay inicio de sesión real">
          Revisamos el formato de tus datos, pero no se verificó ninguna cuenta. Usa un rol de demostración para
          recorrer la plataforma.
        </Alert>
      ) : null}
      <Button type="submit" size="lg" loading={form.state === "submitting"} className="w-full">
        {form.state === "submitting" ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
