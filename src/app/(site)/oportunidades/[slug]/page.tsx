import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, CalendarClock, CalendarDays, CircleCheck, Info } from "lucide-react";
import { Badge, DemoBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FactTile } from "@/components/ui/fact-tile";
import { InterestButton } from "@/features/opportunities/components/interest-button";
import { OpportunityCard, OpportunityStatusBadge } from "@/features/opportunities/components/opportunity-card";
import { opportunityTypeTheme } from "@/features/opportunities/type-theme";
import { formatDate, opportunityStatusLabel, opportunityTypeLabel } from "@/lib/format";
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

  const theme = opportunityTypeTheme[item.type];
  const TypeIcon = theme.icon;
  const related = listOpportunities()
    .filter((o) => o.id !== item.id)
    .sort((a, b) => Number(b.type === item.type) - Number(a.type === item.type))
    .slice(0, 3);

  return (
    <Container className="py-8">
      <nav aria-label="Ruta de navegación" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/oportunidades" className="font-medium text-blue-700 hover:underline">
              Oportunidades
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-ink">
            {opportunityTypeLabel[item.type]}
          </li>
        </ol>
      </nav>

      <section
        aria-labelledby="titulo"
        className="mt-4 overflow-hidden rounded-lg border border-line bg-surface shadow-raised"
      >
        <div className={`relative overflow-hidden px-6 py-8 sm:px-10 sm:py-12 ${theme.cover}`}>
          <TypeIcon
            aria-hidden="true"
            className={`pointer-events-none absolute -right-6 top-1/2 size-64 -translate-y-1/2 sm:right-6 sm:size-80 ${theme.decor}`}
            strokeWidth={1}
          />
          <div className="relative max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`flex size-10 items-center justify-center rounded-lg ${theme.chip}`}>
                <TypeIcon aria-hidden="true" className="size-5" />
              </span>
              <Badge tone="brand">{opportunityTypeLabel[item.type]}</Badge>
              <OpportunityStatusBadge status={item.status} />
              <DemoBadge />
            </div>
            <h1 id="titulo" className="mt-4 text-4xl font-extrabold sm:text-5xl">
              {item.title}
            </h1>
            <p className="mt-3 text-lg text-ink/80 sm:text-xl">{item.summary}</p>
            <p className="mt-4 flex items-start gap-2 text-sm text-ink/80">
              <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              Contenido ficticio: esta oportunidad es un ejemplo y no recibe postulaciones reales.
            </p>
          </div>
        </div>

        <dl className="grid gap-3 p-6 sm:grid-cols-2 sm:p-8 xl:grid-cols-4">
          <FactTile icon={Building2} label="Entidad responsable">
            {item.organization}
          </FactTile>
          <FactTile icon={CalendarDays} label="Inicio">
            {formatDate(item.startDate)}
          </FactTile>
          <FactTile icon={CalendarClock} label="Cierre de postulación">
            {item.deadline ? formatDate(item.deadline) : "Por anunciar"}
          </FactTile>
          <FactTile icon={CircleCheck} label="Estado">
            {opportunityStatusLabel[item.status]}
          </FactTile>
        </dl>
      </section>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-10">
          <section aria-labelledby="desc">
            <h2 id="desc" className="text-2xl font-bold">
              De qué trata
            </h2>
            <p className="mt-3 max-w-prose text-lg">{item.description}</p>
          </section>

          <section aria-labelledby="req">
            <h2 id="req" className="text-2xl font-bold">
              Requisitos
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {item.requirements.map((r) => (
                <li key={r} className="flex items-start gap-3 rounded-lg border border-line bg-surface p-4">
                  <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-leaf-600" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside
          aria-labelledby="accion"
          className="space-y-5 rounded-lg border border-line bg-surface p-6 shadow-raised lg:sticky lg:top-24"
        >
          <h2 id="accion" className="text-xl font-bold">
            ¿Te interesa?
          </h2>
          <ol className="space-y-3 border-l-2 border-line pl-5 text-sm">
            <li className="relative">
              <span aria-hidden="true" className="absolute -left-[1.6rem] top-1 size-3 rounded-full bg-leaf-400" />
              <p className="text-muted">Inicio</p>
              <p className="font-semibold">{formatDate(item.startDate)}</p>
            </li>
            <li className="relative">
              <span aria-hidden="true" className="absolute -left-[1.6rem] top-1 size-3 rounded-full bg-sun-600" />
              <p className="text-muted">Cierre de postulación</p>
              <p className="font-semibold">{item.deadline ? formatDate(item.deadline) : "Por anunciar"}</p>
            </li>
          </ol>
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

      <section aria-labelledby="mas" className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 id="mas" className="text-2xl font-bold sm:text-3xl">
            Otras oportunidades
          </h2>
          <Button href="/oportunidades" variant="secondary">
            Ver todas
          </Button>
        </div>
        <ul className="mt-6 grid gap-5 md:grid-cols-3">
          {related.map((o) => (
            <li key={o.id}>
              <OpportunityCard opportunity={o} />
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
