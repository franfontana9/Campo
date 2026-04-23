import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "success" | "warning" | "danger" | "brand" | "accent";

const variants: Record<Variant, string> = {
  neutral: "bg-ink-100 text-ink-700 ring-1 ring-inset ring-ink-200/50",
  success: "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-200/60",
  warning: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200/60",
  danger: "bg-red-50 text-red-800 ring-1 ring-inset ring-red-200/60",
  brand: "bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-200/70",
  accent: "bg-accent-50 text-accent-700 ring-1 ring-inset ring-accent-200/70",
};

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
};

export function Badge({ className, variant = "neutral", ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-tight",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
