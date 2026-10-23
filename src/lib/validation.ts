/** Validadores puros y reutilizables por todos los formularios. Devuelven un mensaje de error o undefined. */

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function required(value: string, label: string): string | undefined {
  return value.trim() ? undefined : `Ingresa ${label}.`;
}

export function email(value: string): string | undefined {
  if (!value.trim()) return "Ingresa tu correo electrónico.";
  return EMAIL_PATTERN.test(value.trim()) ? undefined : "Escribe un correo válido, por ejemplo nombre@dominio.cl.";
}

export function minLength(value: string, min: number, label: string): string | undefined {
  if (!value.trim()) return `Ingresa ${label}.`;
  return value.trim().length >= min ? undefined : `${capitalize(label)} debe tener al menos ${min} caracteres.`;
}

export function password(value: string): string | undefined {
  if (!value) return "Ingresa una contraseña.";
  if (value.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Incluye al menos una letra y un número.";
  return undefined;
}

export function matches(value: string, other: string): string | undefined {
  return value === other ? undefined : "Las contraseñas no coinciden.";
}

/** Elimina las claves sin error para que `Object.keys(errors).length` indique validez. */
export function compact<K extends string>(errors: FieldErrors<K>): FieldErrors<K> {
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => Boolean(v))) as FieldErrors<K>;
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const forms = {
  contact(values: { name: string; email: string; message: string }) {
    return compact<"name" | "email" | "message">({
      name: required(values.name, "tu nombre"),
      email: email(values.email),
      message: minLength(values.message, 10, "el mensaje"),
    });
  },
  login(values: { email: string; password: string }) {
    return compact<"email" | "password">({
      email: email(values.email),
      password: required(values.password, "tu contraseña"),
    });
  },
  register(values: {
    name: string;
    businessName: string;
    email: string;
    password: string;
    confirm: string;
    terms: boolean;
  }) {
    return compact<"name" | "businessName" | "email" | "password" | "confirm" | "terms">({
      name: required(values.name, "tu nombre"),
      businessName: required(values.businessName, "el nombre de tu emprendimiento"),
      email: email(values.email),
      password: password(values.password),
      confirm: password(values.password) ? undefined : matches(values.confirm, values.password),
      terms: values.terms ? undefined : "Debes aceptar para continuar.",
    });
  },
  profile(values: { name: string; tagline: string; description: string; email: string }) {
    return compact<"name" | "tagline" | "description" | "email">({
      name: required(values.name, "el nombre del negocio"),
      tagline: required(values.tagline, "una frase breve"),
      description: minLength(values.description, 30, "la descripción"),
      email: email(values.email),
    });
  },
  offering(values: { name: string; description: string; price: string }) {
    const price = values.price.trim();
    return compact<"name" | "description" | "price">({
      name: required(values.name, "el nombre"),
      description: required(values.description, "una descripción"),
      price: price && !/^\d+$/.test(price) ? "Usa solo números, sin puntos ni símbolos." : undefined,
    });
  },
};
