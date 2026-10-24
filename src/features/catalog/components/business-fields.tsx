import { AtSign, Mail } from "lucide-react";
import { SelectField, TextAreaField, TextField } from "@/components/ui/field";
import type { FieldErrors } from "@/lib/validation";
import type { Category } from "@/types";
import type { BusinessFieldName, BusinessFormValues } from "../lib/business-form";

/**
 * Campos de un emprendimiento, sin estado propio: quien lo usa guarda los valores y los errores.
 * `prefix` evita ids repetidos si hubiera dos formularios en la misma página.
 */
export function BusinessFields({
  prefix,
  values,
  errors,
  categories,
  locations,
  onChange,
}: {
  prefix: string;
  values: BusinessFormValues;
  errors: FieldErrors<BusinessFieldName>;
  categories: Category[];
  locations: string[];
  onChange: <K extends keyof BusinessFormValues>(field: K, value: BusinessFormValues[K]) => void;
}) {
  return (
    <>
      <TextField id={`${prefix}-name`} label="Nombre del negocio" value={values.name} error={errors.name} onChange={(e) => onChange("name", e.target.value)} />
      <TextField
        id={`${prefix}-tagline`}
        label="Frase breve"
        hint="Aparece en las tarjetas del catálogo."
        value={values.tagline}
        error={errors.tagline}
        onChange={(e) => onChange("tagline", e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField id={`${prefix}-category`} label="Rubro" value={values.categoryId} error={errors.categoryId} onChange={(e) => onChange("categoryId", e.target.value)}>
          <option value="">Elige un rubro</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <SelectField id={`${prefix}-location`} label="Sector" value={values.location} error={errors.location} onChange={(e) => onChange("location", e.target.value)}>
          <option value="">Elige un sector</option>
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </SelectField>
      </div>
      <TextAreaField
        id={`${prefix}-description`}
        label="Descripción"
        rows={4}
        hint="Cuenta qué haces y para quién (mínimo 30 caracteres)."
        value={values.description}
        error={errors.description}
        onChange={(e) => onChange("description", e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id={`${prefix}-email`} label="Correo de contacto" type="email" icon={Mail} value={values.email} error={errors.email} onChange={(e) => onChange("email", e.target.value)} />
        <TextField id={`${prefix}-instagram`} label="Instagram" icon={AtSign} placeholder="@tunegocio" hint="Opcional." value={values.instagram} onChange={(e) => onChange("instagram", e.target.value)} />
      </div>
      <TextField
        id={`${prefix}-tags`}
        label="Etiquetas"
        placeholder="café, tostado, oficinas"
        hint="Separadas por comas, hasta 6. Ayudan a que te encuentren."
        value={values.tags}
        error={errors.tags}
        onChange={(e) => onChange("tags", e.target.value)}
      />
    </>
  );
}
