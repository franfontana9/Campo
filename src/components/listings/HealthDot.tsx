import type { ListingHealth } from "@/lib/utils";

const STYLES: Record<
  ListingHealth["level"],
  { dot: string; ring: string; text: string }
> = {
  good: {
    dot: "bg-emerald-500",
    ring: "ring-emerald-500/30",
    text: "text-emerald-700",
  },
  warn: {
    dot: "bg-amber-500",
    ring: "ring-amber-500/30",
    text: "text-amber-700",
  },
  bad: {
    dot: "bg-red-500",
    ring: "ring-red-500/30",
    text: "text-red-700",
  },
};

export function HealthDot({
  health,
  withLabel = false,
}: {
  health: ListingHealth;
  withLabel?: boolean;
}) {
  const s = STYLES[health.level];
  return (
    <span
      title={`${health.label} — ${health.hint}`}
      className={`inline-flex items-center gap-1.5 ${s.text}`}
    >
      <span className="relative flex h-2.5 w-2.5">
        {health.level === "warn" && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full ${s.dot} opacity-60`}
          />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${s.dot} ring-2 ${s.ring}`}
        />
      </span>
      {withLabel && (
        <span className="text-[11px] font-medium">{health.label}</span>
      )}
    </span>
  );
}
