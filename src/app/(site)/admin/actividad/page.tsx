import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { DataTable } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { formatDate } from "@/lib/format";
import { listActivity } from "@/lib/repository";

export const metadata: Metadata = { title: "Actividad" };

export default function AdminActivityPage() {
  return (
    <>
      <PageHeader title="Actividad reciente" description="Bitácora de acciones relevantes del piloto." />
      <Alert tone="warning" title="Bitácora de ejemplo">
        Estos registros son ficticios. La auditoría real se implementará junto con la autenticación.
      </Alert>
      <DataTable
        caption="Actividad reciente"
        rows={listActivity()}
        rowKey={(a) => a.id}
        columns={[
          { header: "Acción", primary: true, cell: (a) => `${a.action}: ${a.target}` },
          { header: "Fecha", cell: (a) => formatDate(a.at) },
          { header: "Responsable", cell: (a) => a.actor },
        ]}
      />
    </>
  );
}
