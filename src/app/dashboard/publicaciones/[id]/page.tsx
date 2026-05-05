import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Pencil,
  ExternalLink,
  Inbox,
  MessageSquare,
  Eye,
  Calendar,
  Coins,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { InterestActions } from "@/components/listings/InterestActions";
import {
  CURRENT_USER,
  MOCK_CHATS,
  MOCK_INTERESTS,
  MOCK_LISTINGS,
  MOCK_QUESTIONS,
} from "@/lib/mock-data";
import { countryLabel, grainLabel, LISTING_STATUSES } from "@/lib/constants";
import type { ListingStatus } from "@/lib/constants";
import {
  formatDate,
  formatPrice,
  formatTonnage,
  mockInterestsCount,
  timeAgo,
} from "@/lib/utils";

const STATUS_VARIANT: Record<
  ListingStatus,
  "success" | "warning" | "neutral" | "danger"
> = {
  active: "success",
  negotiating: "warning",
  closed: "neutral",
  inactive: "danger",
};

const INTEREST_LABEL = {
  pending: { label: "Pendiente", variant: "warning" as const },
  accepted: { label: "Aceptado", variant: "success" as const },
  declined: { label: "Rechazado", variant: "danger" as const },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = MOCK_LISTINGS.find(
    (l) => l.id === id && l.user_id === CURRENT_USER.id,
  );
  if (!listing) return { title: "Publicación" };
  return {
    title: `${formatTonnage(listing.tonnage)} de ${grainLabel(
      listing.grain_type,
    ).toLowerCase()}`,
    description: "Intereses recibidos y conversaciones de tu publicación.",
  };
}

export default async function PublicacionDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = MOCK_LISTINGS.find(
    (l) => l.id === id && l.user_id === CURRENT_USER.id,
  );
  if (!listing) notFound();

  const interests = MOCK_INTERESTS.filter((i) => i.listing_id === listing.id);
  const pending = interests.filter((i) => i.status === "pending");
  const chats = MOCK_CHATS.filter((c) => c.listing_id === listing.id);
  const questions = MOCK_QUESTIONS.filter((q) => q.listing_id === listing.id);
  const unanswered = questions.filter((q) => q.answer === null).length;
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);
  const views = mockInterestsCount(listing.id) * 14 + 23; // mock estable

  const statusMeta = LISTING_STATUSES.find((s) => s.value === listing.status);

  return (
    <div>
      <Link
        href="/dashboard/publicaciones"
        className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a mis publicaciones
      </Link>

      {/* Resumen de la publicación */}
      <header className="mt-4 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
        <div className="grid gap-6 p-7 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand">{grainLabel(listing.grain_type)}</Badge>
              {statusMeta && (
                <Badge variant={STATUS_VARIANT[listing.status]}>
                  {statusMeta.label}
                </Badge>
              )}
              <span className="text-[11px] text-ink-500">
                publicada {timeAgo(listing.created_at)}
              </span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink-900 md:text-4xl">
              {formatTonnage(listing.tonnage)} de{" "}
              <span className="italic">
                {grainLabel(listing.grain_type).toLowerCase()}
              </span>
            </h1>
            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-600">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-ink-400" />
                {listing.city}, {listing.region} ·{" "}
                {countryLabel(listing.country)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-ink-400" />
                Entrega {formatDate(listing.delivery_date)}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                {listing.price_mode === "fixed" ? "Precio / t" : "Modalidad"}
              </p>
              <p className="font-display text-3xl font-medium text-ink-900">
                {formatPrice(listing.price, listing.currency)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/marketplace/${listing.id}`}>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Ver pública
                </Button>
              </Link>
              <Link href={`/dashboard/publicaciones/${listing.id}/editar`}>
                <Button size="sm">
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Specs en faja */}
        <dl className="grid grid-cols-2 gap-px border-t border-ink-100 bg-ink-100 md:grid-cols-4">
          <Spec
            icon={<Scale className="h-4 w-4" />}
            label="Volumen"
            value={formatTonnage(listing.tonnage)}
          />
          <Spec
            icon={<Coins className="h-4 w-4" />}
            label={listing.price_mode === "fixed" ? "Total estimado" : "Modalidad"}
            value={
              listing.price_mode === "fixed" && listing.price
                ? formatPrice(listing.price * listing.tonnage, listing.currency)
                : "A convenir"
            }
          />
          <Spec
            icon={<Calendar className="h-4 w-4" />}
            label="Entrega"
            value={formatDate(listing.delivery_date)}
          />
          <Spec
            icon={<MapPin className="h-4 w-4" />}
            label="Origen"
            value={countryLabel(listing.country)}
          />
        </dl>
      </header>

      {/* KPIs de actividad */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          icon={<Eye className="h-4 w-4" />}
          label="Vistas"
          value={views}
          hint="últimos 7 días"
        />
        <Kpi
          icon={<Inbox className="h-4 w-4" />}
          label="Intereses recibidos"
          value={interests.length}
          hint={
            pending.length > 0
              ? `${pending.length} sin responder`
              : "todos respondidos"
          }
          highlight={pending.length > 0}
        />
        <Kpi
          icon={<MessageSquare className="h-4 w-4" />}
          label="Chats abiertos"
          value={chats.length}
          hint={
            totalUnread > 0
              ? `${totalUnread} sin leer`
              : chats.length === 0
                ? "ninguno todavía"
                : "al día"
          }
          highlight={totalUnread > 0}
        />
        <Kpi
          icon={<MessageSquare className="h-4 w-4" />}
          label="Preguntas públicas"
          value={questions.length}
          hint={
            unanswered > 0
              ? `${unanswered} sin responder`
              : questions.length === 0
                ? "ninguna todavía"
                : "todas respondidas"
          }
          highlight={unanswered > 0}
        />
      </section>

      {/* Intereses recibidos sobre esta publicación */}
      <section className="mt-10">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Intereses recibidos
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink-900">
              Intereses en esta publicación
            </h2>
          </div>
          {interests.length > 0 && (
            <p className="text-sm text-ink-500">
              {interests.length} en total
              {pending.length > 0 && ` · ${pending.length} pendientes`}
            </p>
          )}
        </header>

        {interests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center">
            <p className="font-display text-xl font-medium text-ink-900">
              Sin intereses todavía
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
              Cuando un comprador toque «Me interesa» en esta publicación, su
              mensaje aparece acá para que aceptes o rechaces.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {interests.map((i) => {
              const meta = INTEREST_LABEL[i.status];
              const chatForThis = chats.find(
                (c) => c.counterparty.id === i.buyer_id,
              );
              return (
                <li
                  key={i.id}
                  className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm"
                >
                  <div className="flex flex-wrap items-start gap-4 p-5">
                    <div className="flex flex-1 items-start gap-3 min-w-[240px]">
                      <Link
                        href={`/u/${i.buyer_id}`}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition-colors hover:bg-brand-200"
                      >
                        <Building2 className="h-5 w-5" />
                      </Link>
                      <div className="min-w-0">
                        <Link
                          href={`/u/${i.buyer_id}`}
                          className="font-medium text-ink-900 hover:underline"
                        >
                          {i.buyer?.full_name ?? "—"}
                        </Link>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-500">
                          <MapPin className="h-3 w-3" />
                          {i.buyer?.city},{" "}
                          {countryLabel(i.buyer?.country ?? "")}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-brand-700">
                          <ShieldCheck className="h-3 w-3" /> Empresa verificada
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      <span className="text-[11px] text-ink-400">
                        recibido {timeAgo(i.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-ink-100 bg-ink-50/40 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                      Mensaje
                    </p>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-800">
                      {i.message}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2 border-t border-ink-100 px-5 py-3">
                    {chatForThis && (
                      <Link href={`/dashboard/chats/${chatForThis.id}`}>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Abrir chat
                          {chatForThis.unread > 0 && (
                            <span className="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-700 px-1 text-[10px] font-semibold text-white">
                              {chatForThis.unread}
                            </span>
                          )}
                        </Button>
                      </Link>
                    )}
                    {i.status === "pending" && (
                      <InterestActions
                        buyerName={i.buyer?.full_name ?? "el comprador"}
                      />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Chats abiertos por esta publicación */}
      <section className="mt-10">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Conversaciones
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink-900">
              Chats abiertos
            </h2>
          </div>
          {chats.length > 0 && totalUnread > 0 && (
            <p className="text-sm text-brand-700">
              {totalUnread} {totalUnread === 1 ? "mensaje" : "mensajes"} sin leer
            </p>
          )}
        </header>

        {chats.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center text-sm text-ink-500">
            Cuando aceptes un interés se abre un chat acá.
          </div>
        ) : (
          <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
            {chats.map((c) => {
              const lastMsg = c.messages[c.messages.length - 1];
              const lastFromMe = lastMsg?.author_id === CURRENT_USER.id;
              return (
                <li key={c.id}>
                  <Link
                    href={`/dashboard/chats/${c.id}`}
                    className="flex gap-4 px-5 py-4 transition-colors hover:bg-ink-50"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p
                          className={`truncate ${
                            c.unread > 0
                              ? "font-semibold text-ink-900"
                              : "font-medium text-ink-800"
                          }`}
                        >
                          {c.counterparty.full_name}
                        </p>
                        <span className="shrink-0 text-[11px] text-ink-500">
                          {timeAgo(c.last_message_at)}
                        </span>
                      </div>
                      <p
                        className={`mt-1.5 truncate text-sm ${
                          c.unread > 0 ? "text-ink-900" : "text-ink-600"
                        }`}
                      >
                        {lastFromMe && (
                          <span className="text-ink-400">Vos: </span>
                        )}
                        {lastMsg?.body}
                      </p>
                    </div>
                    {c.unread > 0 && (
                      <span className="ml-2 flex h-6 min-w-[24px] shrink-0 items-center justify-center self-center rounded-full bg-brand-700 px-1.5 text-[11px] font-semibold text-white">
                        {c.unread}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Q&A público */}
      {questions.length > 0 && (
        <section className="mt-10">
          <header className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Q&amp;A público
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink-900">
              Preguntas en la publicación
            </h2>
          </header>
          <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
            {questions.map((q) => (
              <li key={q.id} className="p-5">
                <p className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs font-semibold text-ink-700">
                    P
                  </span>
                  <span className="flex-1">
                    <span className="text-[15px] text-ink-900">
                      {q.question}
                    </span>
                    <span className="ml-2 text-[11px] text-ink-400">
                      — {q.asker_name} · {timeAgo(q.asked_at)}
                    </span>
                  </span>
                </p>
                {q.answer ? (
                  <p className="mt-3 flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
                      R
                    </span>
                    <span className="flex-1 text-[15px] text-ink-700">
                      {q.answer}
                    </span>
                  </p>
                ) : (
                  <div className="ml-9 mt-3 rounded-lg border border-dashed border-ink-200 bg-ink-50/60 p-3 text-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                      Sin responder
                    </p>
                    <p className="mt-1 text-ink-600">
                      Respondé desde la vista pública para que aparezca a todos
                      los compradores.
                    </p>
                    <Link
                      href={`/marketplace/${listing.id}#qa`}
                      className="mt-2 inline-block text-xs font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
                    >
                      Responder en la publicación →
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
        {icon} {label}
      </div>
      <div className="mt-2 text-base font-medium text-ink-900">{value}</div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  hint,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between text-ink-500">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
          {label}
        </p>
        <span className="text-ink-400">{icon}</span>
      </div>
      <p className="mt-3 font-display text-4xl font-medium tracking-tight text-ink-900">
        {value}
      </p>
      <p
        className={`mt-1 text-xs ${
          highlight ? "font-medium text-brand-700" : "text-ink-500"
        }`}
      >
        {hint}
      </p>
    </div>
  );
}
