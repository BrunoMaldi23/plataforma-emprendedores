import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AtSign, Mail, MapPin } from "lucide-react";
import { Badge, DemoBadge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/features/catalog/components/contact-form";
import { Monogram } from "@/features/catalog/components/monogram";
import { formatClp } from "@/lib/format";
import { getBusinessBySlug, getCategory, getOfferingsFor, listBusinesses } from "@/lib/repository";

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
  const offerings = getOfferingsFor(business.id);

  return (
    <Container className="py-10">
      <Button href="/emprendimientos" variant="ghost" size="sm">
        Volver al catálogo
      </Button>

      <header className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
        <Monogram name={business.name} categoryId={business.categoryId} size="lg" />
        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {category ? <Badge tone="brand">{category.name}</Badge> : null}
            <DemoBadge />
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">{business.name}</h1>
          <p className="mt-1 text-lg text-muted">{business.tagline}</p>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          <section aria-labelledby="sobre">
            <h2 id="sobre" className="text-2xl font-bold">Sobre el negocio</h2>
            <p className="mt-3 max-w-prose text-lg">{business.description}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Etiquetas">
              {business.tags.map((t) => (
                <li key={t}><Badge>{t}</Badge></li>
              ))}
            </ul>
            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <MapPin aria-hidden="true" className="size-4 text-blue-600" />
                <dt className="sr-only">Ubicación</dt>
                <dd>{business.location}, Temuco</dd>
              </div>
              <div className="flex items-center gap-2">
                <Mail aria-hidden="true" className="size-4 text-blue-600" />
                <dt className="sr-only">Correo</dt>
                <dd className="break-all">{business.contactEmail}</dd>
              </div>
              {business.instagram ? (
                <div className="flex items-center gap-2">
                  <AtSign aria-hidden="true" className="size-4 text-blue-600" />
                  <dt className="sr-only">Instagram</dt>
                  <dd>{business.instagram}</dd>
                </div>
              ) : null}
              <div>Desde {business.foundedYear}</div>
            </dl>
          </section>

          <section aria-labelledby="ofrece">
            <h2 id="ofrece" className="text-2xl font-bold">Productos y servicios</h2>
            {offerings.length === 0 ? (
              <p className="mt-3 text-muted">Este negocio aún no publica productos ni servicios.</p>
            ) : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {offerings.map((o) => (
                  <li key={o.id} className="rounded-lg border border-line bg-surface p-4">
                    <Badge tone="brand">{o.kind === "product" ? "Producto" : "Servicio"}</Badge>
                    <p className="mt-2 font-semibold">{o.name}</p>
                    <p className="text-sm text-muted">{o.description}</p>
                    <p className="mt-2 font-semibold">{o.priceClp ? formatClp(o.priceClp) : "A cotizar"}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside aria-labelledby="contacto" className="h-fit rounded-lg border border-line bg-surface p-6 shadow-raised">
          <h2 id="contacto" className="text-xl font-bold">Contactar a {business.name}</h2>
          <div className="mt-4">
            <ContactForm businessName={business.name} />
          </div>
        </aside>
      </div>
    </Container>
  );
}
