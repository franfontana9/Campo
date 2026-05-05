import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-br from-brand-700 to-brand-800 text-white hover:from-brand-600 hover:to-brand-700 hover:shadow-[0_8px_20px_-8px_rgba(62,79,38,0.55)] focus-visible:ring-brand-600 shadow-sm",
  secondary:
    "bg-gradient-to-br from-ink-900 to-ink-800 text-white hover:from-ink-800 hover:to-ink-700 focus-visible:ring-ink-700 shadow-sm",
  ghost:
    "bg-transparent text-ink-800 hover:bg-ink-100 focus-visible:ring-ink-300",
  outline:
    "bg-white text-ink-900 border border-ink-200 hover:border-brand-400 hover:bg-brand-50/40 focus-visible:ring-brand-400",
  accent:
    "bg-gradient-to-br from-accent-500 to-accent-600 text-white hover:from-accent-400 hover:to-accent-500 focus-visible:ring-accent-500 shadow-sm",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "shimmer-on-hover inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-[background,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
