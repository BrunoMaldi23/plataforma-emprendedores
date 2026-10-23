import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { LoginForm } from "@/features/auth/components/login-form";
import { RoleChooser } from "@/features/auth/components/role-chooser";

export const metadata: Metadata = { title: "Ingresar" };

export default function LoginPage() {
  return (
    <Container className="py-10">
      <div className="mx-auto grid max-w-4xl gap-8 lg:grid-cols-2">
        <section aria-labelledby="login-title" className="space-y-5 rounded-lg border border-line bg-surface p-6">
          <h1 id="login-title" className="text-3xl font-bold">Ingresar</h1>
          <Alert tone="warning" title="Autenticación pendiente">
            Todavía no existe inicio de sesión real. Este formulario solo valida el formato de los datos.
          </Alert>
          <LoginForm />
          <p className="text-sm text-muted">
            ¿Aún no tienes cuenta? <Link href="/registro" className="font-semibold text-blue-700 underline">Registra tu negocio</Link>.
          </p>
        </section>
        <RoleChooser />
      </div>
    </Container>
  );
}
