import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Check, X, MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CURRENT_USER, MOCK_INTERESTS, MOCK_LISTINGS } from "@/lib/mock-data";
import { countryLabel, grainLabel } from "@/lib/constants";
import { formatTonnage, timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Intereses recibidos",
  description: "Compradores que mostraron interés en tus publicaciones.",
};

const STATUS_LABEL = {
  pending: { label: "Pendiente", variant: "warning" as const },
  accepted: { label: "Aceptado", variant: "success" as const },
  declined: { label: "Rechazado", variant: "danger" as const },
};

export default async function InteresesRecibidosPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const myListingIds = new Set(
    MOCK_LISTINGS.filter((l) => l.user_id === CURRENT_USER.id).map((l) => l.id),
  );
  const all = MOCK_INTERESTS.filter((i) => myListingIds.has(i.listing_id));
  const filtered = sp.status
    ? all.filter((i) => i.status === sp.status)
    : all;
  const pending = all.filter((i) => i.status === "pending").length;

  return (
    <div>
      <header className="mb-6 border-b border-ink-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Bandeja
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900">
          Intereses recibidos
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          {all.length === 0
            ? "Cuando alguien muestre interés en tus publicaciones, va a aparecer acá."
            : `${all.length} mensajes — ${pending} sin responder.`}
        </p>
      </header>

      {/* Tabs */}
      {all.length > 0 && (
        <nav className="mb-6 flex flex-wrap gap-2 text-sm">
          <Tab href="/dashboard/intereses-recibidos" active={!sp.status}>
            Todos <span className="ml-1 text-ink-400">({all.length})</span>
          </Tab>
          {(["pending", "accepted", "declined"] as const).map((s) => {
            const count = all.filter((i) => i.status === s).length;
            return (
              <Tab
                key={s}
                href={`/dashboard/intereses-recibidos?status=${s}`}
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
        <EmptyState empty={all.length === 0} />
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
                  {/* Comprador */}
                  <div className="flex flex-1 items-start gap-3 min-w-[240px]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-ink-900">
                        {i.buyer?.full_name ?? "—"}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
                        <MapPin className="h-3 w-3" />
                        {i.buyer?.city}, {countryLabel(i.buyer?.country ?? "")}
                      </p>
                      <p className="mt-1 text-[11px] text-ink-400">
                        recibido {timeAgo(i.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Publicación — abre la vista de detalle del dashboard */}
                  <Link
                    href={`/dashboard/publicaciones/${listing.id}`}
                    className="group flex flex-1 min-w-[200px] items-center gap-2 rounded-lg border border-ink-100 bg-ink-50/60 px-3 py-2 hover:bg-ink-50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                        Sobre
                      </p>
                      <p className="truncate text-sm font-medium text-ink-900">
                        {formatTonnage(listing.tonnage)} de{" "}
                        {grainLabel(listing.grain_type).toLowerCase()}
                      </p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-ink-400 group-hover:text-ink-700" />
                  </Link>

                  <Badge variant={meta.variant}>{meta.label}</Badge>
                </div>

                <div className="border-t border-ink-100 bg-ink-50/40 p-5">
                  <p className="text-[15px] leading-relaxed text-ink-800">
                    {i.message}
                  </p>
                </div>

                {/* Acciones */}
                {i.status === "pending" && (
                  <div className="flex flex-wrap items-center justify-end gap-2 border-t border-ink-100 px-5 py-3">
                    <Button size="sm" variant="outline">
                      <X className="h-3.5 w-3.5" /> Rechazar
                    </Button>
                    <Button size="sm">
                      <Check className="h-3.5 w-3.5" /> Aceptar
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function EmptyState({ empty }: { empty: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-14 text-center">
      <p className="font-display text-2xl font-medium text-ink-900">
        {empty ? "Bandeja vacía" : "Sin resultados"}
      </p>
      <p className="mt-2 text-sm text-ink-500">
        {empty
          ? "Cuando un comprador muestre interés en una de tus publicaciones, aparece acá."
          : "No hay intereses en este estado todavía."}
      </p>
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
