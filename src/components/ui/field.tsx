import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const control =
  "block w-full rounded-md border bg-surface px-3 min-h-11 text-base text-ink placeholder:text-muted/70 " +
  "disabled:bg-canvas disabled:text-muted";

function borderFor(error?: string) {
  return error ? "border-danger" : "border-line hover:border-navy-700";
}

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

/** Envuelve etiqueta, ayuda y error; los controles enlazan con aria-describedby. */
function FieldShell({ id, label, error, hint, children }: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}

type BaseProps = { id: string; label: string; error?: string; hint?: string };

export function TextField({
  id,
  label,
  error,
  hint,
  className,
  ...rest
}: BaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, "id">) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        className={cn(control, borderFor(error), className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...rest}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  hint,
  className,
  ...rest
}: BaseProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        rows={4}
        className={cn(control, "py-2.5", borderFor(error), className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...rest}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  error,
  hint,
  className,
  children,
  ...rest
}: BaseProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, "id">) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <select
        id={id}
        className={cn(control, borderFor(error), className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        {...rest}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export function CheckboxField({
  id,
  label,
  error,
  ...rest
}: { id: string; label: ReactNode; error?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type">) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          className="mt-1 size-5 shrink-0 accent-blue-600"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...rest}
        />
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
