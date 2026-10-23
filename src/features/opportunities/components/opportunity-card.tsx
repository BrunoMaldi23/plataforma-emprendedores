import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, opportunityStatusLabel, opportunityTypeLabel } from "@/lib/format";
import type { Opportunity, OpportunityStatus } from "@/types";

const statusTone: Record<OpportunityStatus, "success" | "warning" | "neutral"> = {
  open: "success",
  upcoming: "warning",
  closed: "neutral",
};

export function OpportunityStatusBadge({ status }: { status: OpportunityStatus }) {
  return <Badge tone={statusTone[status]}>{opportunityStatusLabel[status]}</Badge>;
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <article className="relative flex h-full flex-col rounded-lg border border-line bg-surface p-5 shadow-raised transition-colors hover:border-blue-600">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="brand">{opportunityTypeLabel[opportunity.type]}</Badge>
        <OpportunityStatusBadge status={opportunity.status} />
      </div>
      <h3 className="mt-3 text-lg font-bold leading-snug">
        <Link
          href={`/oportunidades/${opportunity.slug}`}
          className="after:absolute after:inset-0 after:content-['']"
        >
          {opportunity.title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-muted">{opportunity.summary}</p>
      <p className="mt-4 flex items-center gap-2 text-sm text-muted">
        <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
        {opportunity.deadline ? `Postula hasta el ${formatDate(opportunity.deadline)}` : `Desde el ${formatDate(opportunity.startDate)}`}
      </p>
      <p className="mt-1 text-sm text-muted">{opportunity.organization}</p>
    </article>
  );
}
