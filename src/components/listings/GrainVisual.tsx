import { Sprout, Wheat, Leaf, Flower2, Grip } from "lucide-react";
import type { GrainType } from "@/lib/constants";

type Size = "card" | "hero";

const PALETTE: Record<
  GrainType,
  { a: string; b: string; accent: string; Icon: typeof Sprout }
> = {
  soja:    { a: "#25301a", b: "#4f632f", accent: "#a8bc7f", Icon: Sprout },
  maiz:    { a: "#3f2a08", b: "#a66b14", accent: "#f0b54a", Icon: Leaf },
  trigo:   { a: "#5b3d10", b: "#b88231", accent: "#ead29a", Icon: Wheat },
  girasol: { a: "#4a2d05", b: "#c48016", accent: "#f4c430", Icon: Flower2 },
  sorgo:   { a: "#4a1a0f", b: "#8a3a20", accent: "#d87a4a", Icon: Grip },
  cebada:  { a: "#46391a", b: "#9a7a33", accent: "#d9c274", Icon: Wheat },
  avena:   { a: "#3d3520", b: "#87744a", accent: "#d9c89c", Icon: Wheat },
  arroz:   { a: "#2b3d2b", b: "#6a8460", accent: "#c8d9b8", Icon: Sprout },
};

export function GrainVisual({
  grainType,
  size = "card",
  className = "",
}: {
  grainType: GrainType;
  size?: Size;
  className?: string;
}) {
  const p = PALETTE[grainType];
  const Icon = p.Icon;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(120% 80% at 20% 0%, ${p.accent}22 0%, transparent 55%), linear-gradient(140deg, ${p.a} 0%, ${p.b} 100%)`,
      }}
    >
      <div
        aria-hidden
        className="absolute -right-12 -top-12 h-48 w-48 rounded-full"
        style={{
          background: `radial-gradient(circle, ${p.accent}55 0%, transparent 70%)`,
        }}
      />
      <Icon
        aria-hidden
        strokeWidth={1.2}
        className={`absolute text-white/20 ${
          size === "hero"
            ? "-bottom-10 -right-8 h-80 w-80"
            : "-bottom-6 -right-4 h-40 w-40"
        }`}
      />
    </div>
  );
}
