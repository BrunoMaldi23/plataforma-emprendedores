"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import { formatDate } from "@/lib/format";
import { useDashboard } from "../state/dashboard-store";
import { SavedCount } from "./saved-opportunities";

export function DashboardOverview() {
  const { business, offerings, requests } = useDashboard();
  const newRequests = requests.filter((r) => r.status === "new");
  const latest = [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  const cards = [
    { href: "/dashboard/productos", label: "Productos y servicios", value: <>{offerings.length}</> },
    { href: "/dashboard/solicitudes", label: "Solicitudes nuevas", value: <>{newRequests.length}</> },
    { href: "/dashboard/oportunidades", label: "Oportunidades de interés", value: <SavedCount /> },
  ];

  return (
    <>
      <PageHeader title={`Hola, ${business.name}`} description="Resumen de tu emprendimiento de ejemplo." />
      <Alert tone="info">
        Estás viendo un negocio ficticio. En la próxima fase verás aquí los datos reales de tu cuenta.
      </Alert>
      <ul className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <li key={c.href} className="rounded-lg border border-line bg-surface p-5">
            <p className="font-display text-4xl font-bold text-blue-700">{c.value}</p>
            <Link href={c.href} className="mt-2 inline-block font-semibold hover:text-blue-700 hover:underline">
              {c.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="pasos" className="rounded-lg border border-line bg-surface p-6">
          <h2 id="pasos" className="text-xl font-bold">
            Siguientes pasos sugeridos
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>
              <Link href="/dashboard/perfil" className="font-semibold text-blue-700 underline">
                Completa tu perfil
              </Link>{" "}
              con una descripción clara.
            </li>
            <li>
              <Link href="/dashboard/productos" className="font-semibold text-blue-700 underline">
                Agrega productos o servicios
              </Link>{" "}
              con precio referencial.
            </li>
            <li>
              <Link href="/oportunidades" className="font-semibold text-blue-700 underline">
                Revisa oportunidades
              </Link>{" "}
              y marca las que te interesen.
            </li>
          </ol>
        </section>

        <section aria-labelledby="ultima" className="rounded-lg border border-line bg-surface p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="ultima" className="text-xl font-bold">
              Última solicitud
            </h2>
            <Link href="/dashboard/solicitudes" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:underline">
              Ver todas <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          {latest ? (
            <div className="mt-3">
              <p className="flex items-center justify-between gap-2">
                <span className="font-semibold">{latest.fromName}</span>
                <Badge tone={latest.status === "new" ? "warning" : latest.status === "answered" ? "success" : "neutral"}>
                  {latest.status === "new" ? "Nueva" : latest.status === "answered" ? "Respondida" : "Archivada"}
                </Badge>
              </p>
              <p className="text-sm text-muted">{formatDate(latest.createdAt)}</p>
              <p className="mt-2 line-clamp-2">{latest.message}</p>
            </div>
          ) : (
            <p className="mt-3 text-muted">Cuando alguien te escriba desde tu ficha, aparecerá aquí.</p>
          )}
        </section>
      </div>
    </>
  );
}
