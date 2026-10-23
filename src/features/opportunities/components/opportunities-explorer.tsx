"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/cn";
import { opportunityTypeLabel } from "@/lib/format";
import type { Opportunity } from "@/types";
import { filterOpportunities, isOpportunityType, opportunityTypes } from "../lib/filter";
import { OpportunityCard } from "./opportunity-card";

export function OpportunitiesExplorer({ opportunities }: { opportunities: Opportunity[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const raw = params.get("tipo");
  const type = isOpportunityType(raw) ? raw : "";
  const results = filterOpportunities(opportunities, type);

  function select(next: string) {
    router.replace(next ? `${pathname}?tipo=${next}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-6">
      <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
        {[{ id: "", label: "Todas" }, ...opportunityTypes.map((t) => ({ id: t, label: opportunityTypeLabel[t] }))].map(
          (opt) => (
            <button
              key={opt.id || "all"}
              type="button"
              aria-pressed={type === opt.id}
              onClick={() => select(opt.id)}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm font-semibold",
                type === opt.id
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-line bg-surface hover:border-blue-600",
              )}
            >
              {opt.label}
            </button>
          ),
        )}
      </div>

      <p role="status" aria-live="polite" className="text-sm text-muted">
        {results.length === 1 ? "1 oportunidad" : `${results.length} oportunidades`}
      </p>

      {results.length === 0 ? (
        <EmptyState
          title="No hay oportunidades en esta categoría"
          description="Revisa otra categoría o vuelve a ver todas las publicadas."
          action={<Button onClick={() => select("")}>Ver todas</Button>}
        />
      ) : (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((o) => (
            <li key={o.id}>
              <OpportunityCard opportunity={o} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
