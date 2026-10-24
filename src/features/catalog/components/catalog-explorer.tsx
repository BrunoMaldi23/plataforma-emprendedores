"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SelectField, TextField } from "@/components/ui/field";
import type { Business, Category, OfferingStats } from "@/types";
import { emptyCatalogFilters, filterBusinesses, hasActiveFilters, type CatalogFilters } from "../lib/filter";
import { BusinessCard } from "./business-card";

interface Props {
  businesses: Business[];
  categories: Category[];
  locations: string[];
  stats: Record<string, OfferingStats>;
}

export function CatalogExplorer({ businesses, categories, locations, stats }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const categoryParam = params.get("rubro") ?? "";
  const locationParam = params.get("lugar") ?? "";
  const category = categories.some((c) => c.id === categoryParam) ? categoryParam : "";
  const location = locations.includes(locationParam) ? locationParam : "";

  const [query, setQuery] = useState(params.get("q") ?? "");
  const filters: CatalogFilters = { query, category, location };

  const results = filterBusinesses(businesses, filters);
  const categoryNames = new Map(categories.map((c) => [c.id, c.name]));

  function syncUrl(next: CatalogFilters) {
    const search = new URLSearchParams();
    if (next.query.trim()) search.set("q", next.query.trim());
    if (next.category) search.set("rubro", next.category);
    if (next.location) search.set("lugar", next.location);
    const qs = search.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clear() {
    setQuery("");
    syncUrl(emptyCatalogFilters);
  }

  return (
    <div className="space-y-6">
      <form
        role="search"
        aria-label="Buscar emprendimientos"
        className="grid gap-4 rounded-lg border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="sm:col-span-2 lg:col-span-1">
          <TextField
            id="q"
            label="Buscar"
            type="search"
            value={query}
            placeholder="Café, diseño, cerámica…"
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
              syncUrl({ ...filters, query: e.target.value });
            }}
          />
        </div>
        <SelectField
          id="rubro"
          label="Rubro"
          value={category}
          onChange={(e) => syncUrl({ ...filters, category: e.target.value })}
        >
          <option value="">Todos los rubros</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <SelectField
          id="lugar"
          label="Sector"
          value={location}
          onChange={(e) => syncUrl({ ...filters, location: e.target.value })}
        >
          <option value="">Todos los sectores</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </SelectField>
      </form>

      <div className="flex items-center justify-between gap-4">
        <p role="status" aria-live="polite" className="text-sm text-muted">
          {results.length === 1 ? "1 emprendimiento" : `${results.length} emprendimientos`}
        </p>
        {hasActiveFilters(filters) ? (
          <Button variant="ghost" size="sm" onClick={clear}>
            Limpiar filtros
          </Button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <EmptyState
          title="No encontramos emprendimientos con esos filtros"
          description="Prueba con otra palabra, cambia el rubro o el sector."
          action={
            <Button onClick={clear}>
              <Search aria-hidden="true" className="size-4" />
              Limpiar filtros
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {results.map((b) => (
            <li key={b.id}>
              <BusinessCard business={b} categoryName={categoryNames.get(b.categoryId)} stats={stats[b.id]} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
