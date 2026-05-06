import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  MapPin,
  ExternalLink,
  Send,
  Inbox,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InterestActions } from "@/components/listings/InterestActions";
import {
  CURRENT_USER,
  MOCK_INTERESTS,
  MOCK_LISTINGS,
} from "@/lib/mock-data";
import { countryLabel, grainLabel } from "@/lib/constants";
import { formatPrice, formatTonnage, timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Intereses",
  description: "Bandeja unificada de intereses recibidos y enviados.",
};

const STATUS_LABEL = {
  pending: { label: "Pendiente", variant: "warning" as const },
  accepted: { label: "Aceptado", variant: "success" as const },
  declined: { label: "Rechazado", variant: "danger" as const },
};

type Tipo = "recibidos" | "enviados";

function isTipo(v: string | undefined): v is Tipo {
  return v === "recibidos" || v === "enviados";
}

function buildHref(tipo: Tipo, status?: string) {
  const params = new URLSearchParams();
  params.set("tipo", tipo);
  if (status) params.set("status", status);
  return `/dashboard/intereses?${params.toString()}`;
}

export default async function InteresesPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const tipo: Tipo = isTipo(sp.tipo) ? sp.tipo : "recibidos";

  const myListingIds = new Set(
    MOCK_LISTINGS.filter((l) => l.user_id === CURRENT_USER.id).map((l) => l.id),
  );
  const recibidos = MOCK_INTERESTS.filter((i) =>
    myListingIds.has(i.listing_id),
  );
  const enviados = MOCK_INTERESTS.filter(
    (i) => i.buyer_id === CURRENT_USER.id,
  );

  const list = tipo === "recibidos" ? recibidos : enviados;
  const filtered = sp.status
    ? list.filter((i) => i.status === sp.status)
    : list;
  const pending = list.filter((i) => i.status === "pending").length;

  const recibidosPending = recibidos.filter(
    (i) => i.status === "pending",
  ).length;
  const enviadosPending = enviados.filter(
    (i) => i.status === "pending",
  ).length;

  return (
    <div>
      <header className="mb-6 border-b border-ink-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Bandeja
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900">
          Intereses
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          {tipo === "recibidos"
            ? recibidos.length === 0
              ? "Cuando alguien muestre interés en tus publicaciones, va a aparecer acá."
              : `${recibidos.length} mensajes recibidos${pending > 0 ? ` — ${pending} sin responder` : ""}.`
            : enviados.length === 0
              ? "Cuando muestres interés en una publicación, aparece acá."
              : `${enviados.length} mensajes enviados${pending > 0 ? ` — ${pending} esperando respuesta` : ""}.`}
        </p>
      </header>

      {/* Tabs principales: Recibidos / Enviados (segmented control) */}
      <div className="mb-6 inline-flex items-center rounded-full border border-ink-200 bg-white p-0.5 shadow-sm">
        <TipoTab
          active={tipo === "recibidos"}
          href={buildHref("recibidos")}
          icon={<Inbox className="h-3.5 w-3.5" />}
          count={recibidos.length}
          unread={recibidosPending}
        >
          Recibidos
        </TipoTab>
        <TipoTab
          active={tipo === "enviados"}
          href={buildHref("enviados")}
          icon={<Send className="h-3.5 w-3.5" />}
          count={enviados.length}
          unread={enviadosPending}
        >
          Enviados
        </TipoTab>
      </div>

      {/* Filtros de status (chips secundarios) */}
      {list.length > 0 && (
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            Estado
          </span>
          <StatusChip href={buildHref(tipo)} active={!sp.status}>
            Todos <span className="ml-1 text-ink-400">({list.length})</span>
          </StatusChip>
          {(["pending", "accepted", "declined"] as const).map((s) => {
            const count = list.filter((i) => i.status === s).length;
            return (
              <StatusChip
                key={s}
                href={buildHref(tipo, s)}
                active={sp.status === s}
              >
                {STATUS_LABEL[s].label}{" "}
                <span className="ml-1 text-ink-400">({count})</span>
              </StatusChip>
            );
          })}
        </nav>
      )}

      {filtered.length === 0 ? (
        <EmptyState empty={list.length === 0} tipo={tipo} />
      ) : (
        <ul className="space-y-3">
          {filtered.map((i) =>
            tipo === "recibidos" ? (
              <RecibidoItem key={i.id} interest={i} />
            ) : (
              <EnviadoItem key={i.id} interest={i} />
            ),
          )}
        </ul>
      )}
    </div>
  );
}

/* ─── Items ─────────────────────────────────────────────────────────── */

function RecibidoItem({
  interest,
}: {
  interest: (typeof MOCK_INTERESTS)[number];
}) {
  const listing = MOCK_LISTINGS.find((l) => l.id === interest.listing_id);
  if (!listing) return null;
  const meta = STATUS_LABEL[interest.status];
  return (
    <li className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-start gap-4 p-5">
        {/* Comprador */}
        <div className="flex min-w-[240px] flex-1 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-ink-900">
              {interest.buyer?.full_name ?? "—"}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
              <MapPin className="h-3 w-3" />
              {interest.buyer?.city},{" "}
              {countryLabel(interest.buyer?.country ?? "")}
            </p>
            <p className="mt-1 text-[11px] text-ink-400">
              recibido {timeAgo(interest.created_at)}
            </p>
          </div>
        </div>

        {/* Publicación */}
        <Link
          href={`/dashboard/publicaciones/${listing.id}`}
          className="group flex min-w-[200px] flex-1 items-center gap-2 rounded-lg border border-ink-100 bg-ink-50/60 px-3 py-2 hover:bg-ink-50"
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
          {interest.message}
        </p>
      </div>

      {interest.status === "pending" && (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-ink-100 px-5 py-3">
          <InterestActions
            buyerName={interest.buyer?.full_name ?? "el comprador"}
          />
        </div>
      )}
    </li>
  );
}

function EnviadoItem({
  interest,
}: {
  interest: (typeof MOCK_INTERESTS)[number];
}) {
  const listing = MOCK_LISTINGS.find((l) => l.id === interest.listing_id);
  if (!listing) return null;
  const meta = STATUS_LABEL[interest.status];
  return (
    <li className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
      <div className="flex flex-wrap items-start gap-4 p-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{grainLabel(listing.grain_type)}</Badge>
            <Badge variant={meta.variant}>{meta.label}</Badge>
            <span className="text-[11px] text-ink-500">
              enviado {timeAgo(interest.created_at)}
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
          {interest.message}
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
}

/* ─── Helpers ──────────────────────────────────────────────────────── */

function TipoTab({
  active,
  href,
  icon,
  count,
  unread,
  children,
}: {
  active: boolean;
  href: string;
  icon: React.ReactNode;
  count: number;
  unread: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-brand-700 text-white shadow-sm"
          : "text-ink-700 hover:text-ink-900"
      }`}
    >
      {icon}
      {children}
      <span
        className={`text-xs ${active ? "text-brand-100" : "text-ink-400"}`}
      >
        {count}
      </span>
      {unread > 0 && !active && (
        <span
          aria-label={`${unread} pendientes`}
          className="absolute -top-0.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-500"
        />
      )}
    </Link>
  );
}

function StatusChip({
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
      aria-current={active ? "page" : undefined}
      className={`inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-brand-700 bg-brand-700 text-white"
          : "border-ink-200 bg-white text-ink-700 hover:border-brand-400 hover:bg-brand-50/40"
      }`}
    >
      {children}
    </Link>
  );
}

function EmptyState({ empty, tipo }: { empty: boolean; tipo: Tipo }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-14 text-center">
      <p className="font-display text-2xl font-medium text-ink-900">
        {empty
          ? tipo === "recibidos"
            ? "Bandeja vacía"
            : "Todavía no enviaste intereses"
          : "Sin resultados"}
      </p>
      <p className="mt-2 text-sm text-ink-500">
        {empty
          ? tipo === "recibidos"
            ? "Cuando un comprador muestre interés en una de tus publicaciones, aparece acá."
            : "Encontrá ofertas en el marketplace y mandá tu primer mensaje."
          : "No hay intereses en este estado todavía."}
      </p>
      {empty && tipo === "enviados" && (
        <Link href="/marketplace" className="mt-5 inline-block">
          <Button size="md">
            <Send className="h-4 w-4" /> Ir al marketplace
          </Button>
        </Link>
      )}
    </div>
  );
}
