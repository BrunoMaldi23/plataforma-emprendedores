import { cn } from "@/lib/cn";

/** Sustituto de imagen mientras no existan fotos reales (se evita usar imágenes de stock engañosas). */
const tones: Record<string, string> = {
  gastronomia: "bg-sun-500 text-ink",
  artesania: "bg-sun-600 text-ink",
  moda: "bg-sun-100 text-ink",
  servicios: "bg-blue-600 text-white",
  tecnologia: "bg-blue-100 text-blue-700",
  turismo: "bg-leaf-600 text-white",
  agro: "bg-leaf-400 text-ink",
};

export function Monogram({
  name,
  categoryId,
  size = "md",
}: {
  name: string;
  categoryId: string;
  size?: "md" | "lg";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg font-display font-bold",
        size === "lg" ? "size-20 text-3xl" : "size-14 text-xl",
        tones[categoryId] ?? "bg-blue-100 text-blue-700",
      )}
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
