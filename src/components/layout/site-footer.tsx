import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";

const columns = [
  {
    title: "Explorar",
    links: [
      { href: "/emprendimientos", label: "Emprendimientos" },
      { href: "/oportunidades", label: "Oportunidades" },
    ],
  },
  {
    title: "Cuenta",
    links: [
      { href: "/login", label: "Ingresar" },
      { href: "/registro", label: "Registrar mi negocio" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-blue-50 text-ink">
      <div aria-hidden="true" className="bg-brand-stripe h-1" />
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm">
            Plataforma piloto para visibilizar emprendimientos de Temuco y conectar con oportunidades.
          </p>
          <p className="mt-3 text-sm text-muted">
            Prototipo del equipo de Innovación y Desarrollo Tecnológico. Todo el contenido es de demostración.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-display text-base font-bold">{col.title}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-blue-700 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        NEXORA es un nombre provisional. Sin autenticación ni datos reales en esta versión.
      </div>
    </footer>
  );
}
