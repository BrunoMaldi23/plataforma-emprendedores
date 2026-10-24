import Link from "next/link";
import { ArrowUpRight, MapPin, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatClp } from "@/lib/format";
import type { Business, OfferingStats } from "@/types";
import { categoryTheme } from "../category-theme";
import { Monogram } from "./monogram";

const MAX_TAGS = 3;

interface CardProps {
  business: Business;
  categoryName?: string;
  stats?: OfferingStats;
}

/** Trazo decorativo de la portada: círculos concéntricos que evocan "nodos conectados". */
export function CoverDecor({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 200 112"
      aria-hidden="true"
      className={`absolute inset-0 size-full ${className}`}
      preserveAspectRatio="xMaxYMid slice"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="170" cy="30" r="22" />
        <circle cx="170" cy="30" r="44" />
        <circle cx="170" cy="30" r="68" />
      </g>
      <circle cx="170" cy="30" r="5" fill="currentColor" />
      <circle cx="118" cy="82" r="3.5" fill="currentColor" />
    </svg>
  );
}

function offerSummary(stats?: OfferingStats): string | null {
  if (!stats || stats.count === 0) return null;
  const noun = stats.count === 1 ? "producto o servicio" : "productos y servicios";
  return `${stats.count} ${noun}`;
}

/** Tarjeta del catálogo: portada por rubro, avatar superpuesto, etiquetas y pie con oferta. */
export function BusinessCard({ business, categoryName, stats }: CardProps) {
  const theme = categoryTheme(business.categoryId);
  const tags = business.tags.slice(0, MAX_TAGS);
  const extraTags = business.tags.length - tags.length;
  const summary = offerSummary(stats);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-raised transition duration-200 hover:-translate-y-1 hover:border-blue-600 hover:shadow-[0_12px_30px_-12px_rgb(0_90_140/0.35)]">
      <div className={`relative h-32 ${theme.cover}`}>
        <CoverDecor className={theme.decor} />
        {categoryName ? (
          <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink">
            {categoryName}
          </span>
        ) : null}
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-6">
        <Monogram
          name={business.name}
          categoryId={business.categoryId}
          size="xl"
          className="-mt-10 border-4 border-surface shadow-raised"
        />

        <h3 className="mt-4 text-2xl font-bold leading-tight">
          <Link
            href={`/emprendimientos/${business.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-lg"
          >
            {business.name}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
          <MapPin aria-hidden="true" className="size-4 shrink-0 text-blue-600" />
          {business.location}, Temuco
        </p>

        <p className="mt-4 text-base text-ink/80">{business.tagline}</p>

        {tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Etiquetas">
            {tags.map((t) => (
              <li key={t}>
                <Badge>{t}</Badge>
              </li>
            ))}
            {extraTags > 0 ? (
              <li>
                <Badge>+{extraTags}</Badge>
              </li>
            ) : null}
          </ul>
        ) : null}

        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between gap-4 border-t border-line pt-5">
            <div className="min-w-0 text-sm">
              {summary ? (
                <>
                  <p className="flex items-center gap-1.5 font-semibold">
                    <Package aria-hidden="true" className="size-4 shrink-0 text-blue-600" />
                    {summary}
                  </p>
                  <p className="mt-0.5 text-muted">
                    {stats?.fromPriceClp ? `Desde ${formatClp(stats.fromPriceClp)}` : "Precio a cotizar"}
                  </p>
                </>
              ) : (
                <p className="text-muted">Aún sin productos publicados</p>
              )}
            </div>
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white"
            >
              <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
