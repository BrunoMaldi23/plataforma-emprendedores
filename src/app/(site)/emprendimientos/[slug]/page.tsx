import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AtSign, CalendarDays, Mail, MapPin, MessageSquare, Package, Wrench } from "lucide-react";
import { Badge, DemoBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FactTile } from "@/components/ui/fact-tile";
import { BusinessCard, CoverDecor } from "@/features/catalog/components/business-card";
import { ContactForm } from "@/features/catalog/components/contact-form";
import { Monogram } from "@/features/catalog/components/monogram";
import { categoryTheme } from "@/features/catalog/category-theme";
import { formatClp } from "@/lib/format";
import {
  getBusinessBySlug,
  getCategory,
  getOfferingStats,
  getOfferingsFor,
  listBusinesses,
} from "@/lib/repository";

export function generateStaticParams() {
  return listBusinesses().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/emprendimientos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  return business ? { title: business.name, description: business.tagline } : { title: "Emprendimiento" };
}

export default async function BusinessPage({ params }: PageProps<"/emprendimientos/[slug]">) {
  const { slug } = await params;
  const business = getBusinessBySlug(slug);
  if (!business) notFound();

  const category = getCategory(business.categoryId);
  const theme = categoryTheme(business.categoryId);
  const offerings = getOfferingsFor(business.id);
  const stats = getOfferingStats(business.id);

  // Otros negocios: primero los del mismo rubro, luego el resto.
  const others = listBusinesses().filter((b) => b.id !== business.id);
  const related = [
    ...others.filter((b) => b.categoryId === business.categoryId),
    ...others.filter((b) => b.categoryId !== business.categoryId),
  ].slice(0, 3);

  return (
    <Container className="py-8">
      <nav aria-label="Ruta de navegación" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/emprendimientos" className="font-medium text-blue-700 hover:underline">
              Emprendimientos
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-ink">
            {business.name}
          </li>
        </ol>
      </nav>

      <section
        aria-labelledby="titulo"
        className="mt-4 overflow-hidden rounded-lg border border-line bg-surface shadow-raised"
      >
        <div className={`relative h-44 sm:h-56 ${theme.cover}`}>
          <div className="absolute inset-y-0 right-0 w-full max-w-xl">
            <CoverDecor className={theme.decor} />
          </div>
          {category ? (
            <span className="absolute left-6 top-6 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold">
              {category.name}
            </span>
          ) : null}
        </div>

        <div className="relative px-6 pb-8 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
              <Monogram
                name={business.name}
                categoryId={business.categoryId}
                size="2xl"
                className="border-4 border-surface shadow-raised"
              />
              <div className="sm:pb-1">
                <div className="mb-2">
                  <DemoBadge />
                </div>
                <h1 id="titulo" className="text-3xl font-extrabold sm:text-4xl">
                  {business.name}
                </h1>
                <p className="mt-1 text-lg text-muted">{business.tagline}</p>
              </div>
            </div>
            <Button href="#contacto" size="lg" className="w-full sm:w-auto">
              <MessageSquare aria-hidden="true" className="size-5" />
              Contactar
            </Button>
          </div>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <FactTile icon={MapPin} label="Sector">
              {business.location}, Temuco
            </FactTile>
            <FactTile icon={CalendarDays} label="En el rubro desde">
              {business.foundedYear}
            </FactTile>
            <FactTile icon={Package} label="Oferta">
              {stats.count === 0
                ? "Sin publicar"
                : `${stats.count} ${stats.count === 1 ? "producto o servicio" : "productos y servicios"}`}
            </FactTile>
            <FactTile icon={business.instagram ? AtSign : Mail} label={business.instagram ? "Instagram" : "Correo"}>
              {business.instagram ?? business.contactEmail}
            </FactTile>
          </dl>
        </div>
      </section>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-10">
          <section aria-labelledby="sobre">
            <h2 id="sobre" className="text-2xl font-bold">
              Sobre el negocio
            </h2>
            <p className="mt-3 max-w-prose text-lg">{business.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Etiquetas">
              {business.tags.map((t) => (
                <li key={t}>
                  <Badge>{t}</Badge>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="ofrece">
            <h2 id="ofrece" className="text-2xl font-bold">
              Productos y servicios
            </h2>
            {offerings.length === 0 ? (
              <p className="mt-3 text-muted">Este negocio aún no publica productos ni servicios.</p>
            ) : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {offerings.map((o) => {
                  const Icon = o.kind === "product" ? Package : Wrench;
                  return (
                    <li key={o.id} className="flex flex-col rounded-lg border border-line bg-surface p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span
                          aria-hidden="true"
                          className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700"
                        >
                          <Icon className="size-5" />
                        </span>
                        <Badge tone="brand">{o.kind === "product" ? "Producto" : "Servicio"}</Badge>
                      </div>
                      <p className="mt-4 text-lg font-bold">{o.name}</p>
                      <p className="mt-1 flex-1 text-muted">{o.description}</p>
                      <p className="mt-4 border-t border-line pt-3 font-display text-xl font-bold">
                        {o.priceClp ? formatClp(o.priceClp) : "A cotizar"}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        <aside
          id="contacto"
          aria-labelledby="contacto-titulo"
          className="scroll-mt-24 rounded-lg border border-line bg-surface p-6 shadow-raised lg:sticky lg:top-24"
        >
          <h2 id="contacto-titulo" className="text-xl font-bold">
            Contactar a {business.name}
          </h2>
          <p className="mt-1 text-sm text-muted">Cuéntale qué necesitas y para cuándo.</p>
          <div className="mt-5">
            <ContactForm businessName={business.name} />
          </div>
        </aside>
      </div>

      <section aria-labelledby="mas" className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 id="mas" className="text-2xl font-bold sm:text-3xl">
            Otros emprendimientos
          </h2>
          <Button href="/emprendimientos" variant="secondary">
            Ver todos
          </Button>
        </div>
        <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {related.map((b) => (
            <li key={b.id}>
              <BusinessCard business={b} categoryName={getCategory(b.categoryId)?.name} stats={getOfferingStats(b.id)} />
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
