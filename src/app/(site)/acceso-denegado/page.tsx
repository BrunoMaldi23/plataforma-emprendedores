import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Acceso denegado" };

export default function ForbiddenPage() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-lg text-center">
        <ShieldAlert aria-hidden="true" className="mx-auto size-10 text-warning" />
        <h1 className="mt-4 text-3xl font-bold">Acceso denegado</h1>
        <p className="mt-2 text-muted">Tu rol actual no tiene permiso para ver esa sección.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/login">Cambiar de rol de demostración</Button>
          <Button href="/" variant="secondary">Volver al inicio</Button>
        </div>
      </div>
    </Container>
  );
}
