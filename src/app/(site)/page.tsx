import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  GraduationCap,
  HandCoins,
  Search,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/ui/badge";
import { BusinessCard } from "@/features/catalog/components/business-card";
import { OpportunityCard } from "@/features/opportunities/components/opportunity-card";
import { listBusinesses, listCategories, listOpportunities } from "@/lib/repository";

const axes = [
  { icon: Store, title: "Vende", text: "Muestra tus productos y servicios a quienes buscan comprar en Temuco.", href: "/registro", cta: "Registrar mi negocio", size: "lg", tone: "blue" },
  { icon: Users, title: "Conecta", text: "Encuentra emprendedores, proveedores y posibles alianzas por rubro y sector.", href: "/emprendimientos", cta: "Explorar el catálogo", size: "lg", tone: "leaf" },
  { icon: CalendarDays, title: "Participa", text: "Ferias y actividades para mostrar tu trabajo.", href: "/oportunidades?tipo=feria", cta: "Ver ferias", size: "sm", tone: "sun" },
  { icon: GraduationCap, title: "Aprende", text: "Capacitaciones para ordenar y hacer crecer tu negocio.", href: "/oportunidades?tipo=capacitacion", cta: "Ver capacitaciones", size: "sm", tone: "leaf" },
  { icon: HandCoins, title: "Financia", text: "Fondos y programas de apoyo a la inversión.", href: "/oportunidades?tipo=fondo", cta: "Ver fondos", size: "sm", tone: "sun" },
  { icon: TrendingUp, title: "Crece", text: "Programas de acompañamiento para el siguiente paso.", href: "/oportunidades?tipo=programa", cta: "Ver programas", size: "sm", tone: "blue" },
] as const;

const iconTone = { blue: "text-blue-600", leaf: "text-leaf-600", sun: "text-sun-600" } as const;

export default function HomePage() {
  const categories = listCategories();
  const featured = listBusinesses().slice(0, 3);
  const open = listOpportunities().filter((o) => o.status === "open").slice(0, 3);

  return (
    <>
      <section className="border-b border-line bg-blue-50">
        <div className="bg-nodes">
          <Container className="grid gap-10 py-14 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:py-20">
            <div className="animate-rise">
              <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl">
                Tu próximo gran paso comienza conectando
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted">
                Descubre emprendimientos de Temuco, conoce lo que ofrecen y encuentra ferias, capacitaciones y apoyos
                para hacer crecer el tuyo.
              </p>

              <form action="/emprendimientos" method="get" role="search" className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
                <label htmlFor="home-q" className="sr-only">
                  Buscar emprendimientos
                </label>
                <input
                  id="home-q"
                  name="q"
                  type="search"
                  placeholder="¿Qué buscas? Café, diseño, cerámica…"
                  className="min-h-12 flex-1 rounded-md border border-line bg-white px-4 text-ink placeholder:text-muted"
                />
                <Button type="submit" size="lg">
                  <Search aria-hidden="true" className="size-5" />
                  Buscar
                </Button>
              </form>

              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Rubros populares">
                {categories.slice(0, 5).map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/emprendimientos?rubro=${c.id}`}
                      className="inline-flex min-h-9 items-center rounded-full border border-line bg-white px-3 text-sm hover:border-blue-600 hover:text-blue-700"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-line bg-white/70 p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold">Emprendimientos en el catálogo</h2>
                <DemoBadge />
              </div>
              <ul className="space-y-3">
                {featured.map((b) => (
                  <li key={b.id} className="text-ink">
                    <BusinessCard business={b} />
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </div>
      </section>

      <section className="py-16">
        <Container>
          <h2 className="max-w-2xl text-3xl font-bold sm:text-4xl">Seis formas de avanzar con NEXORA</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {axes.map(({ icon: Icon, title, text, href, cta, size, tone }) => (
              <li
                key={title}
                className={
                  size === "lg"
                    ? `rounded-lg p-6 sm:col-span-1 lg:col-span-2 lg:p-8 ${tone === "blue" ? "bg-blue-600 text-white" : "bg-leaf-100 text-ink"}`
                    : "rounded-lg border border-line bg-surface p-5"
                }
              >
                <Icon
                  aria-hidden="true"
                  className={
                    size === "lg"
                      ? `size-8 ${tone === "blue" ? "text-sun-400" : "text-leaf-600"}`
                      : `size-6 ${iconTone[tone]}`
                  }
                />
                <h3 className={size === "lg" ? "mt-5 text-2xl font-bold" : "mt-4 text-xl font-bold"}>{title}</h3>
                <p className={size === "lg" ? `mt-2 max-w-md ${tone === "blue" ? "text-white" : "text-muted"}` : "mt-2 text-muted"}>{text}</p>
                <Link
                  href={href}
                  className={
                    size === "lg"
                      ? `mt-5 inline-flex items-center gap-2 font-semibold underline underline-offset-4 ${tone === "blue" ? "text-white" : "text-leaf-600"}`
                      : "mt-4 inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline"
                  }
                >
                  {cta}
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="pb-16">
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Oportunidades abiertas</h2>
              <p className="mt-2 max-w-xl text-muted">
                Ejemplos para probar la plataforma. Ninguna corresponde a una convocatoria real.
              </p>
            </div>
            <Button href="/oportunidades" variant="secondary">
              Ver todas
            </Button>
          </div>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {open.map((o) => (
              <li key={o.id}>
                <OpportunityCard opportunity={o} />
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="pb-4">
        <Container>
          <div className="grid gap-6 rounded-lg bg-sun-100 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold sm:text-3xl">Una iniciativa del equipo de Innovación y Desarrollo Tecnológico</h2>
              <p className="mt-3 text-muted">
                NEXORA nace como piloto para Temuco. Hoy es un prototipo navegable; en la siguiente fase incorporará
                cuentas reales, almacenamiento y herramientas de gestión para la municipalidad.
              </p>
            </div>
            <Button href="/registro" size="lg">
              Registrar mi negocio
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
