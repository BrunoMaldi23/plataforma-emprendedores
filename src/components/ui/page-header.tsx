import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
  badge,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {badge ? <div className="mb-3">{badge}</div> : null}
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 text-lg text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
