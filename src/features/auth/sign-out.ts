"use client";

import { useRouter } from "next/navigation";
import { setDemoRole } from "./demo-session";

/** Cierra la sesión de DEMOSTRACIÓN (vuelve al rol visitante) y lleva al inicio. */
export function useDemoSignOut(): () => void {
  const router = useRouter();
  return () => {
    setDemoRole("visitor");
    router.push("/");
  };
}
