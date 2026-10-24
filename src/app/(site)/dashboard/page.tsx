import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";
import { SavedCount } from "@/features/dashboard/components/saved-opportunities";
import { getDemoBusiness, getOfferingsFor, listContactRequestsFor } from "@/lib/repository";

// El rol del prototipo solo existe en el cliente (RoleGate): la ruta no se valida como navegación instantánea hasta que la
// autorización pase al servidor (ver docs/ARQUITECTURA.md).
export const instant = false;

export const metadata: Metadata = { title: "Resumen" };

export default function DashboardPage() {
  const business = getDemoBusiness();
  const offerings = getOfferingsFor(business.id).length;
  const newRequests = listContactRequestsFor(business.id).filter((r) => r.status === "new").length;

  const cards = [
    { href: "/dashboard/productos", label: "Productos y servicios", value: <>{offerings}</> },
    { href: "/dashboard/solicitudes", label: "Solicitudes nuevas", value: <>{newRequests}</> },
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
      <section aria-labelledby="pasos" className="rounded-lg border border-line bg-surface p-6">
        <h2 id="pasos" className="text-xl font-bold">Siguientes pasos sugeridos</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li><Link href="/dashboard/perfil" className="font-semibold text-blue-700 underline">Completa tu perfil</Link> con una descripción clara.</li>
          <li><Link href="/dashboard/productos" className="font-semibold text-blue-700 underline">Agrega productos o servicios</Link> con precio referencial.</li>
          <li><Link href="/oportunidades" className="font-semibold text-blue-700 underline">Revisa oportunidades</Link> y marca las que te interesen.</li>
        </ol>
      </section>
    </>
  );
}
