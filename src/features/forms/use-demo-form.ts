"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { FieldErrors } from "@/lib/validation";

export type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Estado común de formularios del prototipo: valida, simula el envío y expone el estado.
 * `simulate` reemplaza al servicio real; en la fase de integración se inyecta la acción de servidor.
 *
 * Next conserva las páginas ya visitadas, por lo que sin esto un formulario a medio llenar reaparecería igual al volver.
 * Al salir de la página se descarta lo no enviado; con `keepSavedOnLeave` se conserva lo que sí se guardó (p. ej. el perfil).
 */
export function useDemoForm<V, K extends string>({
  initial,
  validate,
  simulate,
  keepSavedOnLeave = false,
}: {
  initial: V;
  validate: (values: V) => FieldErrors<K>;
  simulate?: (values: V) => Promise<void>;
  keepSavedOnLeave?: boolean;
}) {
  const [values, setValues] = useState<V>(initial);
  const [errors, setErrors] = useState<FieldErrors<K>>({});
  const [state, setState] = useState<SubmitState>("idle");
  const initialRef = useRef(initial);
  const savedRef = useRef(initial);
  const hasSavedRef = useRef(false);
  const stateRef = useRef<SubmitState>("idle");

  useEffect(() => {
    stateRef.current = state;
  });

  // Se ejecuta al salir de la página (o al ocultarla Next al navegar): descarta lo que no se envió.
  useEffect(
    () => () => {
      // Con `keepSavedOnLeave`, lo guardado antes se conserva; lo editado después y no guardado se descarta.
      const keepSaved = keepSavedOnLeave && hasSavedRef.current;
      setValues(keepSaved ? savedRef.current : initialRef.current);
      setErrors({});
      if (!(keepSaved && stateRef.current === "success")) setState("idle");
    },
    [keepSavedOnLeave],
  );

  function set<F extends keyof V>(field: F, value: V[F]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Editar después de guardar vuelve a dejar el formulario "sin guardar".
    setState((prev) => (prev === "success" ? "idle" : prev));
    // Quita el error del campo al corregirlo.
    setErrors((prev) => {
      if (!(field as string in prev)) return prev;
      const next = { ...prev };
      delete next[field as unknown as K];
      return next;
    });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setState("idle");
      // Lleva el foco al primer campo con error, una vez que React lo marcó como inválido.
      setTimeout(() => formElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 0);
      return;
    }
    setState("submitting");
    try {
      await (simulate ? simulate(values) : new Promise((r) => setTimeout(r, 700)));
      savedRef.current = values;
      hasSavedRef.current = true;
      setState("success");
    } catch {
      setState("error");
    }
  }

  function reset() {
    setValues(initial);
    setErrors({});
    setState("idle");
  }

  const errorCount = Object.keys(errors).length;
  return { values, errors, errorCount, state, set, submit, reset };
}
