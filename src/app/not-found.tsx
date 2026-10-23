import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="flex-1">
        <Container className="py-20">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-4xl font-bold">No encontramos esa página</h1>
            <p className="mt-3 text-muted">
              Puede que el enlace esté mal escrito o que el emprendimiento u oportunidad ya no esté disponible.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/emprendimientos">Ver emprendimientos</Button>
              <Button href="/" variant="secondary">Volver al inicio</Button>
            </div>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
