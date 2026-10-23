"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedOpportunities } from "../saved-store";

export function InterestButton({ opportunityId, title }: { opportunityId: string; title: string }) {
  const { saved, toggle } = useSavedOpportunities();
  const active = saved.includes(opportunityId);
  return (
    <Button
      variant={active ? "secondary" : "primary"}
      aria-pressed={active}
      onClick={() => toggle(opportunityId)}
    >
      {active ? <BookmarkCheck aria-hidden="true" className="size-5" /> : <Bookmark aria-hidden="true" className="size-5" />}
      {active ? "Interés registrado" : "Me interesa"}
      <span className="sr-only">: {title}</span>
    </Button>
  );
}
