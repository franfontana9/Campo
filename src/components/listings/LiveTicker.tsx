import Link from "next/link";
import { Circle } from "lucide-react";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import { grainLabel } from "@/lib/constants";
import { formatTonnage, timeAgo } from "@/lib/utils";

/**
 * Marquee horizontal con las publicaciones más recientes.
 * Sensación de marketplace vivo. Animación CSS sin JS.
 */
export function LiveTicker() {
  const items = [...MOCK_LISTINGS]
    .filter((l) => l.status === "active")
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 12);

  // Duplicado para loop seamless
  const loop = [...items, ...items];

  return (
    <section
      aria-label="Actividad reciente del marketplace"
      className="ticker relative overflow-hidden border-y border-ink-100 bg-gradient-to-b from-brand-50/50 to-ink-50"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-5 px-6 py-3.5">
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-300/40 bg-white/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-800 shadow-sm backdrop-blur-sm">
          <Circle className="h-1.5 w-1.5 animate-pulse fill-brand-600 text-brand-600" />
          En vivo
        </span>
        <div className="relative flex-1 overflow-hidden">
          {/* Fades laterales */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink-50 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink-50 to-transparent"
          />
          <div className="ticker-track">
            {loop.map((l, i) => (
              <Link
                key={`${l.id}-${i}`}
                href={`/marketplace/${l.id}`}
                className="group flex shrink-0 items-center gap-2 text-sm text-ink-700 hover:text-ink-900"
              >
                <span className="rounded-full bg-ink-900/[0.04] px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-ink-700">
                  {l.country}
                </span>
                <span className="font-medium text-ink-900">
                  {formatTonnage(l.tonnage)}{" "}
                  <span className="text-ink-500">de</span>{" "}
                  <span className="italic">
                    {grainLabel(l.grain_type).toLowerCase()}
                  </span>
                </span>
                {l.price_mode === "fixed" && l.price !== null && (
                  <>
                    <span className="text-ink-300">·</span>
                    <span className="font-medium tabular-nums text-brand-800">
                      {l.currency} {l.price}
                      <span className="text-ink-400">/t</span>
                    </span>
                  </>
                )}
                <span className="text-ink-300">·</span>
                <span className="text-ink-500 underline-offset-4 group-hover:underline">
                  {l.city}
                </span>
                <span className="text-ink-300">·</span>
                <span className="text-ink-400">{timeAgo(l.created_at)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
