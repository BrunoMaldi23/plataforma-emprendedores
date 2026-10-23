import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCategory } from "@/lib/repository";
import type { Business } from "@/types";
import { Monogram } from "./monogram";

export function BusinessCard({ business }: { business: Business }) {
  const category = getCategory(business.categoryId);
  return (
    <article className="group relative flex h-full flex-col rounded-lg border border-line bg-surface p-5 shadow-raised transition-colors hover:border-blue-600">
      <div className="flex items-start gap-4">
        <Monogram name={business.name} categoryId={business.categoryId} />
        <div className="min-w-0">
          <h3 className="text-lg font-bold leading-snug">
            <Link
              href={`/emprendimientos/${business.slug}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-lg"
            >
              {business.name}
            </Link>
          </h3>
          <p className="mt-0.5 flex items-center gap-1 text-sm text-muted">
            <MapPin aria-hidden="true" className="size-4 shrink-0" />
            {business.location}, Temuco
          </p>
        </div>
      </div>
      <p className="mt-4 flex-1 text-muted">{business.tagline}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {category ? <Badge tone="brand">{category.name}</Badge> : null}
      </div>
    </article>
  );
}
