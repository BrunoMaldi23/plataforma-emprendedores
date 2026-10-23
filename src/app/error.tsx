"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container className="py-20">
      <div role="alert" className="mx-auto max-w-lg text-center">
        <h1 className="text-3xl font-bold">Algo salió mal</h1>
        <p className="mt-3 text-muted">No pudimos mostrar esta página. Puedes reintentar o volver al inicio.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={reset}>Reintentar</Button>
          <Button href="/" variant="secondary">Volver al inicio</Button>
        </div>
      </div>
    </Container>
  );
}
