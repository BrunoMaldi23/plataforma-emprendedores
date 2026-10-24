"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

/**
 * Diálogo modal basado en <dialog> nativo: atrapa el foco, se cierra con Escape y devuelve el foco al abrir/cerrar.
 * El contenido solo se monta mientras está abierto (más la animación de cierre), así los formularios internos parten limpios cada vez.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  // El contenido se mantiene montado hasta que termina la animación de cierre.
  const [mounted, setMounted] = useState(open);

  // Estado derivado durante el render (patrón permitido): al abrir, monta el contenido de inmediato.
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open) return;
    const timer = setTimeout(() => setMounted(false), 250);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // Clic en el fondo oscuro (el propio <dialog>) cierra.
        if (e.target === ref.current) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(40rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border border-line bg-surface p-0 text-ink shadow-[0_24px_60px_-20px_rgb(7_21_48/0.5)]"
    >
      {mounted ? (
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-2xl font-bold">
                {title}
              </h2>
              {description ? <p className="mt-1 text-muted">{description}</p> : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="flex size-10 shrink-0 items-center justify-center rounded-md hover:bg-blue-50"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
          <div className="mt-6">{children}</div>
        </div>
      ) : null}
    </dialog>
  );
}
