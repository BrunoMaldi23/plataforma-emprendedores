"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export interface NavItem {
  href: string;
  label: string;
  /** Si es true, solo está activo con coincidencia exacta (p. ej. el resumen). */
  exact?: boolean;
}

/** Navegación lateral en escritorio; en móvil se reorganiza en una cuadrícula táctil sin desplazamiento. */
export function SectionNav({ items, label }: { items: NavItem[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label}>
      <ul className="grid grid-cols-2 gap-2 xs:grid-cols-3 lg:grid-cols-1">
        {items.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center rounded-md border px-3 text-sm font-semibold",
                  active
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-line bg-surface text-ink hover:border-blue-600",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
