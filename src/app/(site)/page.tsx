import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { NexusMap } from "@/features/home/components/nexus-map";
import { buildAxisExamples } from "@/features/home/lib/axis-examples";
import { OpportunityCard } from "@/features/opportunities/components/opportunity-card";
import { listCategories, listOpportunities } from "@/lib/repository";

export default function HomePage() {
  const categories = listCategories();
  const open = listOpportunities()
    .filter((o) => o.status === "open")
    .slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-canvas">
        <div aria-hidden="true" className="bg-hero-glow absolute inset-0" />
        <div aria-hidden="true" className="bg-nodes absolute inset-0 opacity-60" />
        <Container className="relative grid gap-12 py-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10 lg:py-12">
          <div className="animate-rise">
            <div aria-hidden="true" className="bg-brand-stripe mb-6 h-1.5 w-24 rounded-full" />
            <h1 className="text-5xl font-extrabold sm:text-6xl xl:text-7xl">
              Tu próximo gran paso comienza conectando
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
              Descubre emprendimientos de Temuco, conoce lo que ofrecen y encuentra ferias, capacitaciones y apoyos para
              hacer crecer el tuyo.
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
                className="min-h-14 flex-1 rounded-md border border-line bg-white px-4 text-lg text-ink shadow-raised placeholder:text-muted"
              />
              <Button type="submit" size="lg" className="min-h-14">
                <Search aria-hidden="true" className="size-5" />
                Buscar
              </Button>
            </form>

            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Rubros populares">
              {categories.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/emprendimientos?rubro=${c.id}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-medium hover:border-blue-600 hover:text-blue-700"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <NexusMap examples={buildAxisExamples()} />
        </Container>
      </section>

      <section className="py-16">
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
              <h2 className="text-2xl font-bold sm:text-3xl">
                Una iniciativa del equipo de Innovación y Desarrollo Tecnológico
              </h2>
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
