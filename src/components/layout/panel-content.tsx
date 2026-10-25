"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Contenido de un panel. Al cambiar de sección se vuelve a montar con una entrada suave, así el cambio se nota
 * (el estado compartido de cada panel vive más arriba y no se pierde).
 */
export function PanelContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-enter min-w-0 space-y-8">
      {children}
    </div>
  );
}
