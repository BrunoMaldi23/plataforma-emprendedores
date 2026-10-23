import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = { title: "Registrar mi negocio" };

export default function RegisterPage() {
  return (
    <Container className="py-10">
      <div className="mx-auto max-w-xl space-y-5 rounded-lg border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-3xl font-bold">Registra tu emprendimiento</h1>
        <Alert tone="warning" title="Registro de demostración">
          Aún no se crean cuentas reales: valida tus datos para probar el formulario, pero nada se guarda.
        </Alert>
        <RegisterForm />
        <p className="text-sm text-muted">
          ¿Ya probaste la plataforma? <Link href="/login" className="font-semibold text-blue-700 underline">Ingresar</Link>.
        </p>
      </div>
    </Container>
  );
}
