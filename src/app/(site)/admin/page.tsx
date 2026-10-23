import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { computeOverview, countByCategory } from "@/features/admin/lib/metrics";
import { listBusinesses, listCategories, listOpportunities } from "@/lib/repository";

export const metadata: Metadata = { title: "Resumen de gestión" };

export default function AdminPage() {
  const businesses = listBusinesses({ includeUnapproved: true });
  const opportunities = listOpportunities({ includeUnpublished: true });
  const overview = computeOverview(businesses, opportunities);
  const byCategory = countByCategory(businesses, listCategories());
  const max = Math.max(1, ...byCategory.map((c) => c.count));

  const stats = [
    { label: "Emprendimientos", value: overview.businesses },
    { label: "Pendientes de revisión", value: overview.pending, href: "/admin/emprendimientos" },
    { label: "Oportunidades", value: overview.opportunities },
    { label: "Oportunidades abiertas", value: overview.openOpportunities, href: "/admin/oportunidades" },
  ];

  return (
    <>
      <PageHeader title="Resumen de gestión" description="Vista general del piloto calculada sobre los datos de demostración." />
      <Alert tone="warning" title="No son estadísticas reales">
        Todas las cifras salen de datos ficticios de ejemplo y no representan al municipio ni a Temuco.
      </Alert>

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-line bg-surface p-5">
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className="mt-1 font-display text-4xl font-bold text-blue-700">{s.value}</dd>
            {s.href ? (
              <Link href={s.href} className="mt-2 inline-block text-sm font-semibold text-blue-700 underline">
                Revisar
              </Link>
            ) : null}
          </div>
        ))}
      </dl>

      <section aria-labelledby="por-rubro" className="rounded-lg border border-line bg-surface p-6">
        <h2 id="por-rubro" className="text-xl font-bold">Emprendimientos por rubro</h2>
        <ul className="mt-4 space-y-3">
          {byCategory.map(({ category, count }) => (
            <li key={category.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[200px_1fr_auto]">
              <span className="text-sm font-medium">{category.name}</span>
              <span className="order-last col-span-2 h-3 overflow-hidden rounded-full bg-canvas sm:order-none sm:col-span-1" aria-hidden="true">
                <span className="block h-full rounded-full bg-blue-600" style={{ width: `${(count / max) * 100}%` }} />
              </span>
              <span className="text-sm font-semibold tabular-nums">{count}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
