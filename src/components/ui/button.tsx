import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "inverse";
type Size = "md" | "lg" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-navy-900",
  secondary: "border border-line bg-surface text-ink hover:border-blue-600 hover:text-blue-700",
  ghost: "text-blue-700 hover:bg-blue-50",
  danger: "bg-danger text-white hover:opacity-90",
  inverse: "bg-white text-navy-900 hover:bg-cyan-100",
};

const sizes: Record<Size, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-11 px-4 text-base",
  lg: "min-h-12 px-6 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", extra?: string): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors",
    "disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    extra,
  );
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

type LinkButtonProps = CommonProps & { href: string; external?: boolean };
type NativeButtonProps = CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
  href?: undefined;
  loading?: boolean;
};

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { variant, size, className, children } = props;
  const classes = buttonClasses(variant, size, className);

  if (props.href !== undefined) {
    if (props.external) {
      return (
        <a href={props.href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { loading, type = "button", disabled, ...rest } = props;
  // Se retiran las propiedades propias para no pasarlas al DOM.
  const domProps = { ...rest } as Record<string, unknown>;
  delete domProps.variant;
  delete domProps.size;
  delete domProps.className;
  delete domProps.children;
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...domProps}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : null}
      {children}
    </button>
  );
}
