"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/format";
import type { ContactRequest, ContactRequestStatus } from "@/types";

const statusLabel: Record<ContactRequestStatus, string> = {
  new: "Nueva",
  answered: "Respondida",
  archived: "Archivada",
};

export function RequestsList({ initial }: { initial: ContactRequest[] }) {
  const [items, setItems] = useState(initial);

  function setStatus(id: string, status: ContactRequestStatus) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div className="space-y-6">
      <Alert tone="info">Solicitudes de ejemplo. Los cambios de estado no se guardan.</Alert>
      {items.length === 0 ? (
        <EmptyState
          title="Todavía no recibes solicitudes"
          description="Cuando alguien te escriba desde tu ficha, aparecerá aquí."
        />
      ) : (
        <ul className="space-y-4">
          {items.map((r) => (
            <li key={r.id} className="rounded-lg border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{r.fromName}</p>
                <Badge tone={r.status === "new" ? "warning" : r.status === "answered" ? "success" : "neutral"}>
                  {statusLabel[r.status]}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted">
                {r.fromEmail} · {formatDate(r.createdAt)}
              </p>
              <p className="mt-3">{r.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {r.status === "new" ? (
                  <Button size="sm" onClick={() => setStatus(r.id, "answered")}>
                    Marcar como respondida
                  </Button>
                ) : null}
                {r.status !== "archived" ? (
                  <Button size="sm" variant="secondary" onClick={() => setStatus(r.id, "archived")}>
                    Archivar
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => setStatus(r.id, "new")}>
                    Restaurar
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
