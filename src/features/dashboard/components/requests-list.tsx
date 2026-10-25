"use client";

import { useMemo, useState } from "react";
import { Mail, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TextField } from "@/components/ui/field";
import { FilterChips } from "@/components/ui/filter-chips";
import { formatDate } from "@/lib/format";
import { normalize } from "@/lib/text";
import type { ContactRequestStatus } from "@/types";
import { useDashboard } from "../state/dashboard-store";

type StatusFilter = ContactRequestStatus | "all";

const statusLabel: Record<ContactRequestStatus, string> = {
  new: "Nueva",
  answered: "Respondida",
  archived: "Archivada",
};
const statusTone = { new: "warning", answered: "success", archived: "neutral" } as const;

export function RequestsList() {
  const { requests, actions, isPending, isRecent } = useDashboard();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      all: requests.length,
      new: requests.filter((r) => r.status === "new").length,
      answered: requests.filter((r) => r.status === "answered").length,
      archived: requests.filter((r) => r.status === "archived").length,
    }),
    [requests],
  );

  const items = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    return requests
      .filter((r) => (status === "all" ? true : r.status === status))
      .filter((r) => {
        if (terms.length === 0) return true;
        const haystack = normalize([r.fromName, r.fromEmail, r.message].join(" "));
        return terms.every((t) => haystack.includes(t));
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [requests, status, query]);

  const filtering = status !== "all" || Boolean(query.trim());
  const clear = () => {
    setStatus("all");
    setQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-lg border border-line bg-surface p-4 sm:p-5">
        <FilterChips<StatusFilter>
          label="Filtrar por estado"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "Todas", count: counts.all },
            { value: "new", label: "Nuevas", count: counts.new },
            { value: "answered", label: "Respondidas", count: counts.answered },
            { value: "archived", label: "Archivadas", count: counts.archived },
          ]}
        />
        <div className="max-w-md">
          <TextField
            id="req-q"
            label="Buscar"
            type="search"
            icon={Search}
            placeholder="Nombre, correo o mensaje"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p role="status" aria-live="polite" className="text-sm text-muted">
          {items.length === 1 ? "1 solicitud" : `${items.length} solicitudes`}
        </p>
        {filtering ? (
          <Button variant="ghost" size="sm" onClick={clear}>
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title={requests.length === 0 ? "Todavía no recibes solicitudes" : "No hay solicitudes con esos filtros"}
          description={
            requests.length === 0
              ? "Cuando alguien te escriba desde tu ficha, aparecerá aquí."
              : "Cambia el estado o la búsqueda."
          }
          action={requests.length === 0 ? undefined : <Button onClick={clear}>Limpiar filtros</Button>}
        />
      ) : (
        <ul className="space-y-4">
          {items.map((r) => {
            const busy = isPending(r.id);
            return (
              <li
                key={r.id}
                className={`rounded-lg border border-line bg-surface p-5 ${isRecent(r.id) ? "animate-flash" : ""}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{r.fromName}</p>
                  <Badge tone={statusTone[r.status]}>{statusLabel[r.status]}</Badge>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail aria-hidden="true" className="size-4" />
                    {r.fromEmail}
                  </span>
                  <span>{formatDate(r.createdAt)}</span>
                </p>
                <p className="mt-3">{r.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {r.status === "new" ? (
                    <Button size="sm" loading={busy} onClick={() => actions.setRequestStatus(r, "answered")}>
                      Marcar como respondida
                    </Button>
                  ) : null}
                  {r.status !== "archived" ? (
                    <Button size="sm" variant="secondary" disabled={busy} onClick={() => actions.setRequestStatus(r, "archived")}>
                      Archivar
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" loading={busy} onClick={() => actions.setRequestStatus(r, "new")}>
                      Restaurar
                    </Button>
                  )}
                  <a
                    href={`mailto:${r.fromEmail}`}
                    className="inline-flex min-h-9 items-center rounded-md px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                  >
                    Responder por correo
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
