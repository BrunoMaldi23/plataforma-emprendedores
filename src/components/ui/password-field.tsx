"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { TextField } from "./field";

type Props = Omit<ComponentProps<typeof TextField>, "type" | "icon" | "trailing">;

/** Campo de contraseña con botón para mostrar u ocultar el texto (con etiqueta accesible). */
export function PasswordField(props: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      icon={LockKeyhole}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
          className="flex size-10 items-center justify-center rounded-md text-muted hover:bg-blue-50 hover:text-blue-700"
        >
          {visible ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
        </button>
      }
    />
  );
}
