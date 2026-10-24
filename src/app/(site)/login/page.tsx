import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Megaphone, Store } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { AuthShell, type AuthBenefit } from "@/features/auth/components/auth-shell";
import { AuthTabs } from "@/features/auth/components/auth-tabs";
import { LoginForm } from "@/features/auth/components/login-form";
import { RoleChooser } from "@/features/auth/components/role-chooser";

export const metadata: Metadata = { title: "Ingresar" };

const benefits: AuthBenefit[] = [
  { icon: Store, title: "Tu negocio, visible", text: "Administra tu perfil, tus productos y tus servicios.", tone: "blue" },
  { icon: Megaphone, title: "Oportunidades a tu medida", text: "Guarda ferias, capacitaciones y fondos que te interesan.", tone: "leaf" },
  { icon: BarChart3, title: "Seguimiento claro", text: "Revisa las solicitudes de contacto que recibes.", tone: "sun" },
];

export default function LoginPage() {
  return (
    <AuthShell
      heading="Entra a tu espacio en NEXORA"
      lead="Gestiona tu emprendimiento y descubre oportunidades en Temuco."
      benefits={benefits}
    >
      <div className="flex flex-1 flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Bienvenido</h1>
          <p className="mt-1 text-muted">Ingresa con tu cuenta o explora la plataforma con un rol de demostración.</p>
        </div>

        <AuthTabs
          label="Formas de acceso"
          tabs={[
            {
              id: "cuenta",
              label: "Ingresar",
              panel: (
                <div className="flex flex-1 flex-col gap-5">
                  <Alert tone="warning" title="Autenticación pendiente">
                    Todavía no existe inicio de sesión real: este formulario solo valida el formato de los datos.
                  </Alert>
                  <LoginForm />
                  <p className="mt-auto pt-2 text-sm text-muted">
                    ¿Aún no tienes cuenta?{" "}
                    <Link href="/registro" className="font-semibold text-blue-700 underline">
                      Registra tu negocio
                    </Link>
                    .
                  </p>
                </div>
              ),
            },
            { id: "roles", label: "Explorar con un rol", panel: <RoleChooser /> },
          ]}
        />
      </div>
    </AuthShell>
  );
}
