"use client";

import { useState, type FormEvent } from "react";
import type { FieldErrors } from "@/lib/validation";

export type SubmitState = "idle" | "submitting" | "success" | "error";

/**
 * Estado común de formularios del prototipo: valida, simula el envío y expone el estado.
 * `simulate` reemplaza al servicio real; en la fase de integración se inyecta la acción de servidor.
 */
export function useDemoForm<V, K extends string>({
  initial,
  validate,
  simulate,
}: {
  initial: V;
  validate: (values: V) => FieldErrors<K>;
  simulate?: (values: V) => Promise<void>;
}) {
  const [values, setValues] = useState<V>(initial);
  const [errors, setErrors] = useState<FieldErrors<K>>({});
  const [state, setState] = useState<SubmitState>("idle");

  function set<F extends keyof V>(field: F, value: V[F]) {
    setValues((prev) => ({ ...prev, [field]: value }));
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
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setState("idle");
      return;
    }
    setState("submitting");
    try {
      await (simulate ? simulate(values) : new Promise((r) => setTimeout(r, 700)));
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

  return { values, errors, state, set, submit, reset };
}
