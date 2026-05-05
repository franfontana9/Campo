import type { Metadata } from "next";
import Link from "next/link";
import { X, Circle } from "lucide-react";

export const metadata: Metadata = {
  title: "Marketplace",
  description:
    "Explorá ofertas activas de granos físicos en el mundo. Filtrá por grano, país, volumen y modalidad.",
};
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingFilters } from "@/components/listings/ListingFilters";
import { ListingFiltersMobile } from "@/components/listings/ListingFiltersMobile";
import { SaveSearchButton } from "@/components/listings/SaveSearchButton";
import { Reveal } from "@/components/effects/Reveal";
import { MOCK_LISTINGS, getMarketplaceStats } from "@/lib/mock-data";
import { countryLabel, GRAIN_TYPES, PRICE_MODES } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import type { Listing } from "@/lib/types";

type SearchParams = {
  q?: string;
  grain?: string;
  country?: string;
  min?: string;
  max?: string;
  mode?: string;
  sort?: string;
};

function applyFilters(listings: Listing[], sp: SearchParams) {
  let out = listings.filter((l) => l.status === "active");

  if (sp.q) {
    const q = sp.q.toLowerCase().trim();
    if (q.length > 0) {
      out = out.filter((l) => {
        const haystack = [
          l.grain_type,
          l.city,
          l.region,
          l.country,
          l.description,
          l.seller?.full_name ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }
  }

  if (sp.grain) out = out.filter((l) => l.grain_type === sp.grain);
  if (sp.country) out = out.filter((l) => l.country === sp.country);
  if (sp.mode) out = out.filter((l) => l.price_mode === sp.mode);
  if (sp.min) out = out.filter((l) => l.tonnage >= Number(sp.min));
  if (sp.max) out = out.filter((l) => l.tonnage <= Number(sp.max));

  switch (sp.sort) {
    case "price_asc":
      out = [...out].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      break;
    case "price_desc":
      out = [...out].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
      break;
    case "tonnage_desc":
      out = [...out].sort((a, b) => b.tonnage - a.tonnage);
      break;
    default:
      out = [...out].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }
  return out;
}

function activeChips(sp: SearchParams) {
  const chips: { key: keyof SearchParams; label: string }[] = [];
  if (sp.q) chips.push({ key: "q", label: `"${sp.q}"` });
  if (sp.grain) {
    const g = GRAIN_TYPES.find((x) => x.value === sp.grain);
    if (g) chips.push({ key: "grain", label: g.label });
  }
  if (sp.country) {
    chips.push({ key: "country", label: countryLabel(sp.country) });
  }
  if (sp.mode) {
    const m = PRICE_MODES.find((x) => x.value === sp.mode);
    if (m) chips.push({ key: "mode", label: m.label });
  }
  if (sp.min || sp.max) {
    chips.push({
      key: "min",
      label: `${sp.min ?? "0"}–${sp.max ?? "∞"} t`,
    });
  }
  return chips;
}

function chipHref(sp: SearchParams, remove: keyof SearchParams) {
  const params = new URLSearchParams();
  Object.entries(sp).forEach(([k, v]) => {
    if (v && k !== remove && !(remove === "min" && (k === "min" || k === "max"))) {
      params.set(k, v);
    }
  });
  const q = params.toString();
  return q ? `/marketplace?${q}` : "/marketplace";
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const listings = applyFilters(MOCK_LISTINGS, sp);
  const chips = activeChips(sp);
  const stats = getMarketplaceStats();

  // Querystring serializado para guardar la búsqueda actual
  const qsParams = new URLSearchParams();
  Object.entries(sp).forEach(([k, v]) => {
    if (v) qsParams.set(k, v);
  });
  const qsString = qsParams.toString();
  const savedLabel = chips.map((c) => c.label).join(" · ") || "Sin filtros";

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 py-12 lg:px-10">
      <header className="mb-10 border-b border-ink-100 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Marketplace
        </p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-ink-900 md:text-6xl">
          Ofertas <em className="text-brand-700">activas</em>.
        </h1>
        <p className="mt-3 max-w-xl text-ink-600">
          Publicaciones de vendedores verificados en todo el mundo. Filtrá por
          grano, país o volumen.
        </p>

        {/* Activity bar + save search */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-2">
              <Circle className="h-2 w-2 animate-pulse fill-brand-600 text-brand-600" />
              <span className="font-medium text-ink-900">
                {stats.activeCount}
              </span>{" "}
              <span className="text-ink-500">publicaciones activas</span>
            </span>
            <span className="text-ink-300">·</span>
            <span className="text-ink-600">
              <span className="font-medium text-ink-900">
                {stats.newToday}
              </span>{" "}
              nuevas hoy
            </span>
            {stats.latestAt && (
              <>
                <span className="text-ink-300">·</span>
                <span className="text-ink-500">
                  última {timeAgo(stats.latestAt)}
                </span>
              </>
            )}
          </div>
          <SaveSearchButton
            searchString={qsString}
            label={savedLabel}
            hasFilters={chips.length > 0}
          />
        </div>
      </header>

      <div className="grid gap-10 md:grid-cols-[260px_1fr] xl:gap-14">
        <aside className="hidden md:sticky md:top-24 md:block md:self-start">
          <ListingFilters />
        </aside>

        <section>
          {/* Resultado count + chips activos */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-5">
            <div className="flex items-center gap-3">
              <ListingFiltersMobile activeCount={chips.length} />
              <p className="text-[15px]">
                <span className="font-display text-2xl font-medium text-ink-900">
                  {listings.length}
                </span>{" "}
                <span className="text-ink-500">
                  {listings.length === 1 ? "resultado" : "resultados"}
                </span>
              </p>
            </div>
            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {chips.map((c) => (
                  <Link
                    key={c.key}
                    href={chipHref(sp, c.key)}
                    className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white px-3 py-1 text-xs text-ink-700 transition-colors hover:border-ink-300 hover:bg-ink-50"
                  >
                    {c.label}
                    <X className="h-3 w-3" />
                  </Link>
                ))}
                <Link
                  href="/marketplace"
                  className="text-xs text-ink-500 underline underline-offset-4 hover:text-ink-900"
                >
                  Limpiar todo
                </Link>
              </div>
            )}
          </div>

          {listings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-14 text-center">
              <p className="font-display text-2xl font-medium text-ink-900">
                Sin resultados
              </p>
              <p className="mt-2 text-sm text-ink-500">
                Probá ajustar los filtros para ver más ofertas.
              </p>
              <Link
                href="/marketplace"
                className="mt-5 inline-block text-sm font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
              >
                Limpiar filtros
              </Link>
            </div>
          ) : (
            <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {listings.map((l, i) => (
                <Reveal key={l.id} delay={Math.min(i, 8) * 60}>
                  <ListingCard listing={l} />
                </Reveal>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
