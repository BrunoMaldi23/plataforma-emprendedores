import type { ReactNode } from "react";
import { Info, TriangleAlert, CircleCheck, CircleAlert } from "lucide-react";
import { cn } from "@/lib/cn";

type Tone = "info" | "success" | "warning" | "danger";

const tones: Record<Tone, { box: string; Icon: typeof Info }> = {
  info: { box: "border-cyan-400/50 bg-cyan-100 text-navy-900", Icon: Info },
  success: { box: "border-success/30 bg-success-soft text-success", Icon: CircleCheck },
  warning: { box: "border-warning/30 bg-warning-soft text-warning", Icon: TriangleAlert },
  danger: { box: "border-danger/30 bg-danger-soft text-danger", Icon: CircleAlert },
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const { box, Icon } = tones[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-md border p-4 text-sm", box, className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={title ? "mt-0.5" : undefined}>{children}</div>
      </div>
    </div>
  );
}
