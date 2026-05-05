import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPin, ExternalLink, Send } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CURRENT_USER, MOCK_INTERESTS, MOCK_LISTINGS } from "@/lib/mock-data";
import { countryLabel, grainLabel } from "@/lib/constants";
import {
  formatPrice,
  formatTonnage,
  timeAgo,
} from "@/lib/utils";

export const metadata: Metadata = {
  title: "Intereses enviados",
  description: "Publicaciones donde mostraste interés.",
};

const STATUS_LABEL = {
  pending: { label: "Pendiente", variant: "warning" as const },
  accepted: { label: "Aceptado", variant: "success" as const },
  declined: { label: "Rechazado", variant: "danger" as const },
};

export default async function InteresesEnviadosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const all = MOCK_INTERESTS.filter((i) => i.buyer_id === CURRENT_USER.id);
  const filtered = sp.status
    ? all.filter((i) => i.status === sp.status)
    : all;

  return (
    <div>
      <header className="mb-6 border-b border-ink-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Bandeja
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900">
          Intereses enviados
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          {all.length === 0
            ? "Cuando muestres interés en una publicación, aparece acá."
            : `${all.length} mensajes enviados — esperando respuesta del vendedor.`}
        </p>
      </header>

      {all.length > 0 && (
        <nav className="mb-6 flex flex-wrap gap-2 text-sm">
          <Tab href="/dashboard/intereses-enviados" active={!sp.status}>
            Todos <span className="ml-1 text-ink-400">({all.length})</span>
          </Tab>
          {(["pending", "accepted", "declined"] as const).map((s) => {
            const count = all.filter((i) => i.status === s).length;
            return (
              <Tab
                key={s}
                href={`/dashboard/intereses-enviados?status=${s}`}
                active={sp.status === s}
              >
                {STATUS_LABEL[s].label}{" "}
                <span className="ml-1 text-ink-400">({count})</span>
              </Tab>
            );
          })}
        </nav>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-14 text-center">
          <p className="font-display text-2xl font-medium text-ink-900">
            {all.length === 0 ? "Todavía no enviaste intereses" : "Sin resultados"}
          </p>
          <p className="mt-2 text-sm text-ink-500">
            {all.length === 0
              ? "Encontrá ofertas en el marketplace y mandá tu primer mensaje."
              : "No hay intereses en este estado."}
          </p>
          {all.length === 0 && (
            <Link href="/marketplace" className="mt-5 inline-block">
              <Button size="md">
                <Send className="h-4 w-4" /> Ir al marketplace
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((i) => {
            const listing = MOCK_LISTINGS.find((l) => l.id === i.listing_id);
            if (!listing) return null;
            const meta = STATUS_LABEL[i.status];
            return (
              <li
                key={i.id}
                className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm"
              >
                <div className="flex flex-wrap items-start gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="brand">
                        {grainLabel(listing.grain_type)}
                      </Badge>
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      <span className="text-[11px] text-ink-500">
                        enviado {timeAgo(i.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 font-display text-xl font-medium text-ink-900">
                      {formatTonnage(listing.tonnage)} de{" "}
                      <span className="italic">
                        {grainLabel(listing.grain_type).toLowerCase()}
                      </span>
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-ink-500">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {listing.seller?.full_name}
                      </span>
                      <span className="text-ink-300">·</span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {listing.city}, {countryLabel(listing.country)}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                      {listing.price_mode === "fixed" ? "Precio / t" : "Modalidad"}
                    </p>
                    <p className="font-display text-xl font-medium text-ink-900">
                      {formatPrice(listing.price, listing.currency)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-ink-100 bg-ink-50/40 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                    Tu mensaje
                  </p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-800">
                    {i.message}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-ink-100 px-5 py-3">
                  <Link href={`/marketplace/${listing.id}`}>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3.5 w-3.5" /> Ver publicación
                    </Button>
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Tab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-full border px-3.5 py-1.5 transition-colors ${
        active
          ? "border-brand-700 bg-brand-700 text-white"
          : "border-ink-200 bg-white text-ink-700 hover:border-ink-300"
      }`}
    >
      {children}
    </Link>
  );
}
