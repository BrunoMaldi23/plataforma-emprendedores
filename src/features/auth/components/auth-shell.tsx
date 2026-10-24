import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

export interface AuthBenefit {
  icon: LucideIcon;
  title: string;
  text: string;
  /** Color del icono: variantes del logo. */
  tone: "blue" | "leaf" | "sun";
}

const toneClasses: Record<AuthBenefit["tone"], string> = {
  blue: "bg-blue-600 text-white",
  leaf: "bg-leaf-400 text-ink",
  sun: "bg-sun-400 text-ink",
};

/**
 * Estructura común de login y registro: panel de marca a la izquierda (solo escritorio) y formulario a la derecha.
 * Ambas columnas se estiran a la misma altura.
 */
export function AuthShell({
  heading,
  lead,
  benefits,
  children,
}: {
  heading: string;
  lead: string;
  benefits: AuthBenefit[];
  children: ReactNode;
}) {
  return (
    // Centrado vertical en la ventana (alto de pantalla menos el header) y bordes superiores alineados.
    <Container className="flex py-6 lg:min-h-[calc(100svh-4.5rem)] lg:items-center">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
        <aside className="relative hidden overflow-hidden rounded-lg border border-line bg-canvas lg:block">
          <div aria-hidden="true" className="bg-hero-glow absolute inset-0" />
          <div aria-hidden="true" className="bg-nodes absolute inset-0 opacity-60" />
          <svg
            viewBox="0 0 200 200"
            aria-hidden="true"
            className="absolute -bottom-24 -right-24 size-72 text-blue-600/15"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.2">
              <circle cx="100" cy="100" r="30" />
              <circle cx="100" cy="100" r="60" />
              <circle cx="100" cy="100" r="90" />
            </g>
            <circle cx="100" cy="100" r="6" className="fill-blue-600" />
            <circle cx="160" cy="100" r="5" className="fill-leaf-400" />
            <circle cx="57" cy="143" r="5" className="fill-sun-500" />
            <circle cx="100" cy="10" r="4" className="fill-sun-400" />
          </svg>
          <div className="relative flex h-full flex-col p-8">
            <div aria-hidden="true" className="bg-brand-stripe mb-6 h-1.5 w-20 rounded-full" />
            <h2 className="text-3xl font-extrabold xl:text-4xl">{heading}</h2>
            <p className="mt-3 text-lg text-muted">{lead}</p>
            <ul className="mt-8 space-y-5">
              {benefits.map(({ icon: Icon, title, text, tone }) => (
                <li key={title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className={cn("flex size-11 shrink-0 items-center justify-center rounded-lg shadow-raised", toneClasses[tone])}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold">{title}</p>
                    <p className="text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-8 text-sm text-muted">
              Piloto en Temuco · Todo el contenido es de demostración.
            </p>
          </div>
        </aside>

        {/* Alto mínimo común: Ingresar y Registrar ocupan el mismo espacio; el contenido nace arriba, alineado con el panel. */}
        <div className="flex flex-col rounded-lg border border-line bg-surface p-6 shadow-raised sm:p-8 lg:min-h-[44rem]">
          {children}
        </div>
      </div>
    </Container>
  );
}
