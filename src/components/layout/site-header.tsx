"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { roleHome, roleLabel } from "@/lib/permissions";
import { useDemoRole } from "@/features/auth/demo-session";
import { Logo } from "./logo";

const links = [
  { href: "/emprendimientos", label: "Emprendimientos" },
  { href: "/oportunidades", label: "Oportunidades" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const role = useDemoRole();
  const [open, setOpen] = useState(false);

  const signedIn = role !== null && role !== "visitor";
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div aria-hidden="true" className="bg-brand-stripe h-1" />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(pathname, l.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 font-medium text-muted hover:text-blue-700",
                isActive(pathname, l.href) && "bg-blue-50 text-blue-700",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {signedIn && role ? (
            <Link href={roleHome[role]} className={buttonClasses("secondary", "md")}>
              Ir a mi panel ({roleLabel[role]})
            </Link>
          ) : (
            <>
              <Link href="/login" className={buttonClasses("ghost", "md")}>
                Ingresar
              </Link>
              <Link href="/registro" className={buttonClasses("primary", "md")}>
                Registrar mi negocio
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md border border-line md:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>
      </Container>

      {open ? (
        <div id="menu-movil" className="border-t border-line bg-surface md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <nav aria-label="Principal móvil" className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={close}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  className="rounded-md px-3 py-3 text-lg font-medium aria-[current=page]:bg-blue-50 aria-[current=page]:text-blue-700"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-3 border-t border-line pt-4">
              {signedIn && role ? (
                <Link href={roleHome[role]} onClick={close} className={buttonClasses("primary", "lg")}>
                  Ir a mi panel ({roleLabel[role]})
                </Link>
              ) : (
                <>
                  <Link href="/registro" onClick={close} className={buttonClasses("primary", "lg")}>
                    Registrar mi negocio
                  </Link>
                  <Link href="/login" onClick={close} className={buttonClasses("secondary", "lg")}>
                    Ingresar
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
