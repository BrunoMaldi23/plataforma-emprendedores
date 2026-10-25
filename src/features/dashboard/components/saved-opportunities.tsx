"use client";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/components/ui/toast";
import { OpportunityCard } from "@/features/opportunities/components/opportunity-card";
import { useSavedOpportunities } from "@/features/opportunities/saved-store";
import type { Opportunity } from "@/types";

export function SavedOpportunities({ opportunities }: { opportunities: Opportunity[] }) {
  const { saved, toggle } = useSavedOpportunities();
  const { notify } = useToast();
  const items = opportunities.filter((o) => saved.includes(o.id));

  if (items.length === 0) {
    return (
      <EmptyState
        title="Aún no marcas oportunidades de interés"
        description="Entra al detalle de una oportunidad y pulsa «Me interesa» para verla aquí."
        action={<Button href="/oportunidades">Ver oportunidades</Button>}
      />
    );
  }

  return (
    <ul className="grid gap-5 md:grid-cols-2">
      {items.map((o) => (
        <li key={o.id} className="animate-enter space-y-2">
          <OpportunityCard opportunity={o} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toggle(o.id);
              notify(`Quitada de tus intereses: ${o.title}`, { action: { label: "Deshacer", onClick: () => toggle(o.id) } });
            }}
          >
            Quitar de mis intereses
          </Button>
        </li>
      ))}
    </ul>
  );
}

export function SavedCount() {
  const { saved } = useSavedOpportunities();
  return <>{saved.length}</>;
}
