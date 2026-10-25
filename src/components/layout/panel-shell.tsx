import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { DemoBadge } from "@/components/ui/badge";
import { RoleSummary } from "@/features/auth/components/role-summary";
import { PanelContent } from "./panel-content";
import { SectionNav, type NavItem } from "./section-nav";

/** Estructura común de las áreas privadas (emprendedor y administración). */
export function PanelShell({
  title,
  navLabel,
  items,
  nav,
  children,
}: {
  title: string;
  navLabel: string;
  items: NavItem[];
  /** Navegación personalizada (por ejemplo, con contadores). Si no se indica, se usa `items`. */
  nav?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Container className="py-8">
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="space-y-2">
            <p className="font-display text-lg font-bold">{title}</p>
            <DemoBadge />
          </div>
          {nav ?? <SectionNav items={items} label={navLabel} />}
          <RoleSummary />
        </aside>
        <PanelContent>{children}</PanelContent>
      </div>
    </Container>
  );
}
