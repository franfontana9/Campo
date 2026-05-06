import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ExternalLink,
  Inbox,
  MessageSquare,
  Pencil,
  PlusCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HealthDot } from "@/components/listings/HealthDot";
import {
  CURRENT_USER,
  MOCK_CHATS,
  MOCK_INTERESTS,
  MOCK_LISTINGS,
} from "@/lib/mock-data";
import {
  formatDate,
  formatPrice,
  formatTonnage,
  getListingHealth,
  timeAgo,
} from "@/lib/utils";
import { countryLabel, grainLabel, LISTING_STATUSES } from "@/lib/constants";
import type { ListingStatus } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Mis publicaciones",
  description: "Gestioná tus ofertas activas, en negociación y cerradas.",
};

const STATUS_VARIANT: Record<
  ListingStatus,
  "success" | "warning" | "neutral" | "danger"
> = {
  active: "success",
  negotiating: "warning",
  closed: "neutral",
  inactive: "danger",
};

export default async function MisPublicacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const all = MOCK_LISTINGS.filter((l) => l.user_id === CURRENT_USER.id);
  const filtered = sp.status
    ? all.filter((l) => l.status === sp.status)
    : all;

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-ink-100 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
            Cuenta
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900">
            Mis publicaciones
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            {all.length === 0
              ? "Cuando publiques una oferta va a aparecer acá."
              : `${all.length} ${all.length === 1 ? "publicación" : "publicaciones"} en tu cuenta.`}
          </p>
        </div>
        <Link href="/dashboard/publicaciones/nueva">
          <Button size="md">
            <PlusCircle className="h-4 w-4" /> Nueva publicación
          </Button>
        </Link>
      </header>

      {/* Tabs por estado */}
      <nav className="mb-6 flex flex-wrap gap-2 text-sm">
        <StatusTab href="/dashboard/publicaciones" active={!sp.status}>
          Todas{" "}
          <span className="ml-1 text-ink-400">({all.length})</span>
        </StatusTab>
        {LISTING_STATUSES.map((s) => {
          const count = all.filter((l) => l.status === s.value).length;
          return (
            <StatusTab
              key={s.value}
              href={`/dashboard/publicaciones?status=${s.value}`}
              active={sp.status === s.value}
            >
              {s.label}{" "}
              <span className="ml-1 text-ink-400">({count})</span>
            </StatusTab>
          );
        })}
      </nav>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-14 text-center">
          <p className="font-display text-2xl font-medium text-ink-900">
            {all.length === 0
              ? "Todavía no publicaste nada"
              : "Sin resultados en este estado"}
          </p>
          <p className="mt-2 text-sm text-ink-500">
            {all.length === 0
              ? "Crear tu primera oferta toma menos de 2 minutos."
              : "Probá ver las publicaciones de otro estado."}
          </p>
          {all.length === 0 && (
            <Link
              href="/dashboard/publicaciones/nueva"
              className="mt-5 inline-block"
            >
              <Button size="md">
                <PlusCircle className="h-4 w-4" /> Crear publicación
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
          {filtered.map((l) => {
            const listingInterests = MOCK_INTERESTS.filter(
              (i) => i.listing_id === l.id,
            );
            const pending = listingInterests.filter(
              (i) => i.status === "pending",
            ).length;
            const listingChats = MOCK_CHATS.filter(
              (c) => c.listing_id === l.id,
            );
            const unread = listingChats.reduce((s, c) => s + c.unread, 0);
            // Hubo "actividad" si llegó un interés o un mensaje en los últimos 7 días.
            const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            const hasActivityInLast7d =
              listingInterests.some(
                (i) => new Date(i.created_at).getTime() >= sevenDaysAgo,
              ) ||
              listingChats.some(
                (c) => new Date(c.last_message_at).getTime() >= sevenDaysAgo,
              );
            const health = getListingHealth({
              createdAt: l.created_at,
              pendingInterests: pending,
              unreadChats: unread,
              hasActivityInLast7d,
            });
            return (
              <li key={l.id} className="group">
                <Link
                  href={`/dashboard/publicaciones/${l.id}`}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-ink-50 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <HealthDot health={health} />
                      <Badge variant="brand">{grainLabel(l.grain_type)}</Badge>
                      <Badge variant={STATUS_VARIANT[l.status]}>
                        {LISTING_STATUSES.find((s) => s.value === l.status)?.label}
                      </Badge>
                      <span className="text-[11px] text-ink-500">
                        publicada {timeAgo(l.created_at)}
                      </span>
                    </div>
                    <p className="mt-2 font-display text-xl font-medium text-ink-900 group-hover:underline">
                      {formatTonnage(l.tonnage)} de{" "}
                      <span className="italic">
                        {grainLabel(l.grain_type).toLowerCase()}
                      </span>
                    </p>
                    <p className="mt-0.5 text-sm text-ink-500">
                      {l.city}, {l.region} · {countryLabel(l.country)} · Entrega{" "}
                      {formatDate(l.delivery_date)}
                    </p>

                    {/* Métricas inline */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 ${
                          pending > 0 ? "font-medium text-brand-700" : "text-ink-500"
                        }`}
                      >
                        <Inbox className="h-3.5 w-3.5" />
                        {listingInterests.length}{" "}
                        {listingInterests.length === 1 ? "interés" : "intereses"}
                        {pending > 0 && ` · ${pending} sin responder`}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1.5 ${
                          unread > 0 ? "font-medium text-brand-700" : "text-ink-500"
                        }`}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        {listingChats.length}{" "}
                        {listingChats.length === 1 ? "chat" : "chats"}
                        {unread > 0 && ` · ${unread} sin leer`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                        {l.price_mode === "fixed" ? "Precio / t" : "Modalidad"}
                      </p>
                      <p className="font-display text-xl font-medium text-ink-900">
                        {formatPrice(l.price, l.currency)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-700" />
                  </div>
                </Link>

                {/* Acciones rápidas — fuera del Link para no anidar.
                    Visibles siempre en touch (sm:opacity-0) y on-hover en desktop. */}
                <div className="flex items-center justify-end gap-1.5 px-5 pb-3 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                  <Link
                    href={`/marketplace/${l.id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-xs font-medium text-ink-500 transition-colors hover:border-ink-200 hover:bg-white hover:text-ink-900"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ver pública
                  </Link>
                  <Link
                    href={`/dashboard/publicaciones/${l.id}/editar`}
                    className="inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-xs font-medium text-ink-500 transition-colors hover:border-ink-200 hover:bg-white hover:text-ink-900"
                  >
                    <Pencil className="h-3 w-3" />
                    Editar
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

function StatusTab({
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
