import Link from "next/link";
import { MapPin, ArrowUpRight, Building2, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DisplayPrice } from "@/components/ui/DisplayPrice";
import {
  formatDate,
  formatTonnage,
  mockInterestsCount,
  timeAgo,
} from "@/lib/utils";
import { countryLabel, grainLabel } from "@/lib/constants";
import type { Listing } from "@/lib/types";
import { GrainVisual } from "./GrainVisual";

export function ListingCard({ listing }: { listing: Listing }) {
  const interests = mockInterestsCount(listing.id);

  return (
    <Link
      href={`/marketplace/${listing.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_40px_-18px_rgba(62,79,38,0.35)]"
    >
      {/* Visual */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {listing.image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={listing.image_url}
            alt={`${grainLabel(listing.grain_type)} — ${listing.city}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <GrainVisual
            grainType={listing.grain_type}
            size="card"
            className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04]"
          />
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <Badge variant="brand" className="bg-white/95 backdrop-blur">
            {grainLabel(listing.grain_type)}
          </Badge>
          <span className="rounded-full bg-white/85 px-2.5 py-0.5 text-[11px] font-medium text-ink-700 shadow-sm backdrop-blur">
            {timeAgo(listing.created_at)}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-1 flex-col p-5">
        {/* Título dominante: toneladas + grano */}
        <h3 className="font-display text-[28px] font-medium leading-tight tracking-tight text-ink-900">
          {formatTonnage(listing.tonnage)}{" "}
          <span className="text-ink-500">de</span>{" "}
          <span className="italic">{grainLabel(listing.grain_type).toLowerCase()}</span>
        </h3>

        {/* Meta secundaria */}
        <div className="mt-2 space-y-1 text-[13px] text-ink-500">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-ink-400" />
            <span className="truncate">
              {listing.city}, {listing.region} · {countryLabel(listing.country)}
            </span>
          </div>
          <p>Entrega {formatDate(listing.delivery_date)}</p>
        </div>

        {/* Vendedor + confianza */}
        <div className="mt-4 flex items-center gap-2.5 rounded-lg bg-ink-50/70 px-3 py-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Building2 className="h-3.5 w-3.5" />
          </div>
          <p className="min-w-0 flex-1 truncate text-[13px] font-medium text-ink-800">
            {listing.seller?.full_name}
          </p>
          <span
            title="Empresa verificada"
            className="inline-flex items-center gap-0.5 text-brand-700"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* Precio + CTA */}
        <div className="mt-5 flex items-end justify-between border-t border-ink-100 pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              {listing.price_mode === "fixed" ? "Precio / t" : "Modalidad"}
            </p>
            <p className="mt-0.5 font-display text-2xl font-medium text-ink-900">
              <DisplayPrice
                amount={listing.price}
                from={listing.currency}
                showApprox={false}
              />
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-ink-900 px-3.5 py-2 text-xs font-medium text-ink-50 transition-colors group-hover:bg-brand-700">
            Ver oferta
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>

        {/* Micro-stat: interesados */}
        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-ink-500">
          <Users className="h-3 w-3" />
          {interests} {interests === 1 ? "interesado" : "interesados"}
        </p>
      </div>
    </Link>
  );
}
