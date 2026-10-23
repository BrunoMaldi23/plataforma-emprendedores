import Link from "next/link";

export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  const text = tone === "dark" ? "text-white" : "text-navy-900";
  const sub = tone === "dark" ? "text-blue-100" : "text-muted";
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="NEXORA, ir al inicio">
      <svg viewBox="0 0 40 40" className="size-10 shrink-0" aria-hidden="true">
        <rect width="40" height="40" rx="10" className="fill-blue-600" />
        <path d="M11 29V11l18 18V11" fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="11" cy="11" r="2.6" className="fill-leaf-400" />
        <circle cx="29" cy="29" r="2.6" className="fill-sun-400" />
      </svg>
      <span className="leading-tight">
        <span className={`block font-display text-xl font-extrabold tracking-tight ${text}`}>NEXORA</span>
        <span className={`block text-xs font-medium ${sub}`}>Innovación y Desarrollo</span>
      </span>
    </Link>
  );
}
