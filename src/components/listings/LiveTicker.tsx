import Link from "next/link";
import { Circle } from "lucide-react";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import { countryLabel, grainLabel } from "@/lib/constants";
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
      className="ticker overflow-hidden border-y border-ink-100 bg-ink-50"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <span className="inline-flex shrink-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
          <Circle className="h-2 w-2 animate-pulse fill-brand-600 text-brand-600" />
          En vivo
        </span>
        <div className="relative flex-1 overflow-hidden">
          {/* Fades laterales */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-ink-50 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-ink-50 to-transparent"
          />
          <div className="ticker-track">
            {loop.map((l, i) => (
              <Link
                key={`${l.id}-${i}`}
                href={`/marketplace/${l.id}`}
                className="group flex shrink-0 items-center gap-2 text-sm text-ink-700 hover:text-ink-900"
              >
                <span className="text-ink-400">{timeAgo(l.created_at)}</span>
                <span className="text-ink-300">·</span>
                <span className="font-medium">
                  {formatTonnage(l.tonnage)} de {grainLabel(l.grain_type).toLowerCase()}
                </span>
                <span className="text-ink-300">·</span>
                <span className="text-ink-500 underline-offset-4 group-hover:underline">
                  {l.city}, {countryLabel(l.country)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
