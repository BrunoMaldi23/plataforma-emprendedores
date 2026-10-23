import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, DemoBadge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { InterestButton } from "@/features/opportunities/components/interest-button";
import { OpportunityStatusBadge } from "@/features/opportunities/components/opportunity-card";
import { formatDate, opportunityTypeLabel } from "@/lib/format";
import { getOpportunityBySlug, listOpportunities } from "@/lib/repository";

export function generateStaticParams() {
  return listOpportunities().map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: PageProps<"/oportunidades/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = getOpportunityBySlug(slug);
  return item ? { title: item.title, description: item.summary } : { title: "Oportunidad" };
}

export default async function OpportunityPage({ params }: PageProps<"/oportunidades/[slug]">) {
  const { slug } = await params;
  const item = getOpportunityBySlug(slug);
  if (!item) notFound();

  return (
    <Container className="py-10">
      <Button href="/oportunidades" variant="ghost" size="sm">
        Volver a oportunidades
      </Button>

      <header className="mt-4 max-w-3xl">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge tone="brand">{opportunityTypeLabel[item.type]}</Badge>
          <OpportunityStatusBadge status={item.status} />
          <DemoBadge />
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">{item.title}</h1>
        <p className="mt-3 text-lg text-muted">{item.summary}</p>
      </header>

      <Alert tone="warning" title="Contenido ficticio" className="mt-6 max-w-3xl">
        Esta oportunidad es un ejemplo de la demostración. No existe ni recibe postulaciones reales.
      </Alert>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-8">
          <section aria-labelledby="desc">
            <h2 id="desc" className="text-2xl font-bold">De qué trata</h2>
            <p className="mt-3 max-w-prose text-lg">{item.description}</p>
          </section>
          <section aria-labelledby="req">
            <h2 id="req" className="text-2xl font-bold">Requisitos</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-lg">
              {item.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside aria-labelledby="datos" className="h-fit space-y-5 rounded-lg border border-line bg-surface p-6 shadow-raised">
          <h2 id="datos" className="text-xl font-bold">Datos clave</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted">Entidad responsable</dt>
              <dd className="font-semibold">{item.organization}</dd>
            </div>
            <div>
              <dt className="text-muted">Inicio</dt>
              <dd className="font-semibold">{formatDate(item.startDate)}</dd>
            </div>
            <div>
              <dt className="text-muted">Cierre de postulación</dt>
              <dd className="font-semibold">{item.deadline ? formatDate(item.deadline) : "Por anunciar"}</dd>
            </div>
          </dl>
          <div className="flex flex-col gap-3">
            <InterestButton opportunityId={item.id} title={item.title} />
            <Button href={item.url} external variant="secondary">
              Sitio de la convocatoria (ejemplo)
            </Button>
          </div>
          <p className="text-xs text-muted">
            El interés se guarda solo en este navegador y no se comunica a ninguna organización.
          </p>
        </aside>
      </div>
    </Container>
  );
}
