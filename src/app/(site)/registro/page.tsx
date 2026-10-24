import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck, Info, Search, Store } from "lucide-react";
import { AuthShell, type AuthBenefit } from "@/features/auth/components/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = { title: "Registrar mi negocio" };

const benefits: AuthBenefit[] = [
  { icon: Search, title: "Que te encuentren", text: "Tu negocio aparece en el catálogo por rubro y sector.", tone: "blue" },
  { icon: Store, title: "Muestra lo que ofreces", text: "Publica productos y servicios con precio referencial.", tone: "leaf" },
  { icon: CalendarCheck, title: "No te pierdas nada", text: "Ferias, capacitaciones y fondos en un solo lugar.", tone: "sun" },
];

export default function RegisterPage() {
  return (
    <AuthShell
      heading="Haz crecer tu emprendimiento con NEXORA"
      lead="Crea tu perfil comercial y conecta con compradores y oportunidades de Temuco."
      benefits={benefits}
    >
      <div className="flex flex-1 flex-col gap-5">
        <div>
          <h1 className="text-3xl font-bold">Registra tu emprendimiento</h1>
          <p className="mt-1 flex items-start gap-2 text-sm text-muted">
            <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-blue-600" />
            Registro de demostración: valida tus datos, pero no se crea ninguna cuenta ni se guarda nada.
          </p>
        </div>
        <RegisterForm />
        <p className="mt-auto text-sm text-muted">
          ¿Ya probaste la plataforma?{" "}
          <Link href="/login" className="font-semibold text-blue-700 underline">
            Ingresar
          </Link>
          .
        </p>
      </div>
    </AuthShell>
  );
}
