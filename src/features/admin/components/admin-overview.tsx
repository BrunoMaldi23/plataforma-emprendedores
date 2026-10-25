"use client";

import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { IfCan } from "@/features/auth/role-gate";
import { Monogram } from "@/features/catalog/components/monogram";
import { opportunityTypes } from "@/features/opportunities/lib/filter";
import { formatDateTime, opportunityTypeLabel } from "@/lib/format";
import { computeOverview, countByCategory, countByType } from "../lib/metrics";
import { useAdmin } from "../state/admin-store";

function BarRow({
  label,
  count,
  max,
  tone = "bg-blue-600",
}: {
  label: string;
  count: number;
  max: number;
  tone?: string;
}) {
  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 sm:grid-cols-[11rem_1fr_auto]">
      <span className="text-sm font-medium">{label}</span>
      <span
        aria-hidden="true"
        className="order-last col-span-2 h-3 overflow-hidden rounded-full bg-canvas sm:order-none sm:col-span-1"
      >
        <span className={`block h-full rounded-full ${tone}`} style={{ width: `${(count / max) * 100}%` }} />
      </span>
      <span className="text-sm font-semibold tabular-nums">{count}</span>
    </li>
  );
}

function Panel({
  id,
  title,
  action,
  children,
}: {
  id: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="rounded-lg border border-line bg-surface p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 id={id} className="text-xl font-bold">
          {title}
        </h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AdminOverview() {
  const { businesses, opportunities, categories, activity, actions, isPending } = useAdmin();
  const o = computeOverview(businesses, opportunities);
  const byCategory = countByCategory(businesses, categories);
  const byType = countByType(opportunities, opportunityTypes);
  const pending = businesses.filter((b) => b.status === "pending");
  const drafts = opportunities.filter((x) => !x.published);
  const maxCat = Math.max(1, ...byCategory.map((c) => c.count));
  const maxType = Math.max(1, ...byType.map((t) => t.count));
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? id;

  const stats = [
    { label: "Emprendimientos", value: o.businesses, note: `${o.approved} aprobados` },
    {
      label: "Pendientes de revisión",
      value: o.pending,
      note: o.pending ? "Requieren una decisión" : "Todo al día",
      warn: o.pending > 0,
    },
    { label: "Oportunidades", value: o.opportunities, note: `${o.published} publicadas · ${o.drafts} en borrador` },
    { label: "Abiertas ahora", value: o.openOpportunities, note: "Publicadas y con postulación abierta" },
  ];

  return (
    <>
      <PageHeader
        title="Resumen de gestión"
        description="Vista general del piloto calculada sobre los datos de demostración. No son estadísticas reales."
      />

      <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-line bg-surface p-5">
            <dt className="text-sm text-muted">{s.label}</dt>
            <dd className={`mt-1 font-display text-4xl font-bold ${s.warn ? "text-sun-600" : "text-blue-700"}`}>
              {s.value}
            </dd>
            <p className="mt-1 text-sm text-muted">{s.note}</p>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <Panel
          id="atencion"
          title="Requiere atención"
          action={
            <Link
              href="/admin/emprendimientos"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
            >
              Ver todos <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          }
        >
          {pending.length === 0 && drafts.length === 0 ? (
            <p className="flex items-center gap-2 text-muted">
              <CircleCheck aria-hidden="true" className="size-5 text-leaf-600" />
              Todo al día: no hay perfiles pendientes ni oportunidades en borrador.
            </p>
          ) : (
            <div className="space-y-5">
              {pending.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold text-muted">Perfiles por revisar ({pending.length})</h3>
                  <ul className="mt-2 divide-y divide-line">
                    {pending.slice(0, 4).map((b) => (
                      <li key={b.id} className="animate-enter flex flex-wrap items-center gap-3 py-3">
                        <Monogram name={b.name} categoryId={b.categoryId} size="sm" />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{b.name}</p>
                          <p className="text-sm text-muted">
                            {categoryName(b.categoryId)} · {b.location}
                          </p>
                        </div>
                        <IfCan permission="admin:write">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              loading={isPending(b.id)}
                              onClick={() => actions.setBusinessStatus(b, "approved")}
                            >
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={isPending(b.id)}
                              onClick={() => actions.setBusinessStatus(b, "hidden")}
                            >
                              Ocultar
                            </Button>
                          </div>
                        </IfCan>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {drafts.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold text-muted">Oportunidades en borrador ({drafts.length})</h3>
                  <ul className="mt-2 divide-y divide-line">
                    {drafts.slice(0, 3).map((d) => (
                      <li key={d.id} className="animate-enter flex flex-wrap items-center gap-3 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{d.title}</p>
                          <p className="text-sm text-muted">{opportunityTypeLabel[d.type]}</p>
                        </div>
                        <IfCan permission="admin:write">
                          <Button
                            size="sm"
                            loading={isPending(d.id)}
                            onClick={() => actions.setOpportunityPublished(d, true)}
                          >
                            Publicar
                          </Button>
                        </IfCan>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </Panel>

        <Panel
          id="reciente"
          title="Actividad reciente"
          action={
            <Link
              href="/admin/actividad"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline"
            >
              Ver toda <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          }
        >
          <ol className="space-y-4">
            {activity.slice(0, 5).map((a) => (
              <li key={a.id} className="border-l-2 border-line pl-4">
                <p className="font-semibold">{a.action}</p>
                <p className="text-sm">{a.target}</p>
                <p className="text-xs text-muted">
                  {formatDateTime(a.at)} · {a.actor}
                </p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel id="por-rubro" title="Emprendimientos por rubro">
          <ul className="space-y-3">
            {byCategory.map(({ category, count }) => (
              <BarRow key={category.id} label={category.name} count={count} max={maxCat} />
            ))}
          </ul>
        </Panel>
        <Panel id="por-tipo" title="Oportunidades por categoría">
          <ul className="space-y-3">
            {byType.map(({ type, count }) => (
              <BarRow key={type} label={opportunityTypeLabel[type]} count={count} max={maxType} tone="bg-leaf-600" />
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted">
            <Badge tone="demo">Datos de demostración</Badge> Cifras calculadas sobre los ejemplos cargados.
          </p>
        </Panel>
      </div>
    </>
  );
}
