import { cn } from "@/lib/cn";
import { categoryTheme } from "../category-theme";

/** Sustituto de imagen mientras no existan fotos reales (se evita usar imágenes de stock engañosas). */
export function Monogram({
  name,
  categoryId,
  size = "md",
  className,
}: {
  name: string;
  categoryId: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}) {
  const sizes = { sm: "size-10 text-base", md: "size-14 text-xl", lg: "size-20 text-3xl", xl: "size-20 rounded-2xl text-4xl",
    "2xl": "size-24 rounded-2xl text-4xl sm:size-28 sm:text-5xl",
  } as const;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg font-display font-bold",
        sizes[size],
        categoryTheme(categoryId).avatar,
        className,
      )}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
