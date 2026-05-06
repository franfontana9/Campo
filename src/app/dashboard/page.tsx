import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Inbox,
  Send,
  CheckCircle2,
  Circle,
  PlusCircle,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CountUp } from "@/components/effects/CountUp";
import {
  CURRENT_USER,
  MOCK_CHATS,
  MOCK_INTERESTS,
  MOCK_LISTINGS,
  getUserStats,
} from "@/lib/mock-data";
import { countryLabel, grainLabel, LISTING_STATUSES } from "@/lib/constants";
import { formatPrice, formatTonnage, timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mi panel",
  description: "Resumen de tu actividad en Campo.",
};

function getGreeting(): { greeting: string; emoji: string } {
  const h = new Date().getHours();
  if (h < 6) return { greeting: "Buenas noches", emoji: "🌙" };
  if (h < 13) return { greeting: "Buen día", emoji: "🌅" };
  if (h < 20) return { greeting: "Buenas tardes", emoji: "☀️" };
  return { greeting: "Buenas noches", emoji: "🌙" };
}

/** Intereses recibidos en publicaciones del usuario, pending y con > 24 h
 *  desde que llegaron — son los que requieren acción YA. */
function getUrgentReceivedInterests() {
  const myListingIds = new Set(
    MOCK_LISTINGS.filter((l) => l.user_id === CURRENT_USER.id).map((l) => l.id),
  );
  const URGENT_THRESHOLD_HOURS = 24;
  const now = Date.now();
  return MOCK_INTERESTS.filter(
    (i) => myListingIds.has(i.listing_id) && i.status === "pending",
  )
    .filter(
      (i) =>
        (now - new Date(i.created_at).getTime()) / (1000 * 60 * 60) >
        URGENT_THRESHOLD_HOURS,
    )
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
}

export default function DashboardPage() {
  const stats = getUserStats();
  const firstName = CURRENT_USER.full_name.split(" ")[0];
  const { greeting } = getGreeting();
  const urgentInterests = getUrgentReceivedInterests();

  // Checklist dinámico
  const steps = [
    {
      n: "01",
      title: "Completá tu perfil",
      desc: "Razón social, ubicación y contacto. Los compradores quieren saber con quién hablan.",
      cta: "Editar perfil",
      href: "/dashboard/perfil",
      done: CURRENT_USER.full_name.length > 0 && CURRENT_USER.phone.length > 0,
    },
    {
      n: "02",
      title: "Publicá tu primera oferta",
      desc: "Cargá grano, toneladas, ubicación y precio. Aparece en el marketplace en segundos.",
      cta: "Nueva publicación",
      href: "/dashboard/publicaciones/nueva",
      done: stats.totalListings > 0,
      primary: stats.totalListings === 0,
    },
    {
      n: "03",
      title: "Explorá el marketplace",
      desc: "Mirá qué se está moviendo en tu grano y región. Es la mejor forma de fijar tu precio.",
      cta: "Ir al marketplace",
      href: "/marketplace",
      done: stats.sentTotal > 0,
    },
  ];
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div>
      <header className="mb-8 border-b border-ink-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Panel
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink-900">
          {greeting}, <span className="italic text-brand-700">{firstName}</span>
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          {new Date().toLocaleDateString("es-AR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}{" "}
          · Tu actividad en Campo en un vistazo.
        </p>
      </header>

      {/* Banner de acción — intereses pendientes hace > 24 h */}
      {urgentInterests.length > 0 && (
        <section className="mb-8 overflow-hidden rounded-2xl border border-amber-300/60 bg-gradient-to-r from-amber-50/80 to-amber-50/30 shadow-sm">
          <div className="flex flex-wrap items-center gap-4 p-5 md:flex-nowrap">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-ink-900">
                {urgentInterests.length === 1
                  ? "1 interés sin responder"
                  : `${urgentInterests.length} intereses sin responder`}{" "}
                <span className="text-ink-600">hace más de 24 h</span>
              </p>
              <p className="mt-0.5 text-xs text-ink-600">
                <span className="font-medium text-ink-800">
                  {urgentInterests[0].buyer?.full_name ?? "Un comprador"}
                </span>{" "}
                espera respuesta hace {timeAgo(urgentInterests[0].created_at)}
                {urgentInterests.length > 1 &&
                  ` y otros ${urgentInterests.length - 1} más`}
                .
              </p>
            </div>
            <Link href="/dashboard/intereses?tipo=recibidos" className="shrink-0">
              <Button size="sm" className="whitespace-nowrap">
                Responder ahora <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={<FileText className="h-4 w-4" />}
          label="Publicaciones activas"
          value={stats.activeListings}
          empty="Sin publicaciones aún"
          href="/dashboard/publicaciones"
        />
        <Stat
          icon={<Inbox className="h-4 w-4" />}
          label="Intereses recibidos"
          value={stats.receivedTotal}
          hint={
            stats.receivedPending > 0
              ? `${stats.receivedPending} sin responder`
              : undefined
          }
          empty="Nadie te contactó todavía"
          href="/dashboard/intereses?tipo=recibidos"
        />
        <Stat
          icon={<Send className="h-4 w-4" />}
          label="Intereses enviados"
          value={stats.sentTotal}
          hint={
            stats.sentPending > 0
              ? `${stats.sentPending} esperando respuesta`
              : undefined
          }
          empty="No mostraste interés todavía"
          href="/dashboard/intereses?tipo=enviados"
        />
      </div>

      {/* Primeros pasos */}
      {doneCount < steps.length && (
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                Primeros pasos
              </p>
              <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink-900">
                Empezá a usar Campo
              </h2>
            </div>
            <span className="text-sm text-ink-500">
              {doneCount} / {steps.length}
            </span>
          </div>

          <ol className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
            {steps.map((s) => (
              <Step
                key={s.n}
                n={s.n}
                title={s.title}
                desc={s.desc}
                cta={s.cta}
                href={s.href}
                done={s.done}
                primary={s.primary}
              />
            ))}
          </ol>
        </section>
      )}

      {/* Actividad reciente — 2 columnas para usar el ancho */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        {/* Mis publicaciones recientes con métricas */}
        <div className="rounded-2xl border border-ink-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Mis publicaciones
            </h2>
            <Link
              href="/dashboard/publicaciones"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
            >
              Ver todas <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {(() => {
            const myListings = MOCK_LISTINGS.filter(
              (l) => l.user_id === CURRENT_USER.id,
            ).slice(0, 4);
            if (myListings.length === 0) {
              return (
                <div className="p-6 text-center text-sm text-ink-500">
                  Todavía no publicaste nada.
                </div>
              );
            }
            return (
              <ul className="divide-y divide-ink-100">
                {myListings.map((l) => {
                  const lInterests = MOCK_INTERESTS.filter(
                    (i) => i.listing_id === l.id,
                  );
                  const pending = lInterests.filter(
                    (i) => i.status === "pending",
                  ).length;
                  const status = LISTING_STATUSES.find(
                    (s) => s.value === l.status,
                  );
                  return (
                    <li key={l.id}>
                      <Link
                        href={`/dashboard/publicaciones/${l.id}`}
                        className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-ink-50"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge variant="brand">
                              {grainLabel(l.grain_type)}
                            </Badge>
                            {status && (
                              <Badge variant="neutral">{status.label}</Badge>
                            )}
                          </div>
                          <p className="mt-1.5 truncate text-sm font-medium text-ink-900">
                            {formatTonnage(l.tonnage)} ·{" "}
                            {formatPrice(l.price, l.currency)} · {l.city},{" "}
                            {countryLabel(l.country)}
                          </p>
                          <p className="mt-0.5 text-[11px] text-ink-500">
                            <span
                              className={
                                pending > 0
                                  ? "font-medium text-brand-700"
                                  : ""
                              }
                            >
                              {lInterests.length}{" "}
                              {lInterests.length === 1 ? "interés" : "intereses"}
                              {pending > 0 && ` · ${pending} pendiente${pending === 1 ? "" : "s"}`}
                            </span>
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-ink-300" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            );
          })()}
        </div>

        {/* Mensajes recientes */}
        <div className="rounded-2xl border border-ink-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Mensajes recientes
            </h2>
            <Link
              href="/dashboard/chats"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
            >
              Ir a chats <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {MOCK_CHATS.length === 0 ? (
            <div className="p-6 text-center text-sm text-ink-500">
              Sin chats abiertos.
            </div>
          ) : (
            <ul className="divide-y divide-ink-100">
              {MOCK_CHATS.slice(0, 4).map((c) => {
                const last = c.messages[c.messages.length - 1];
                const fromMe = last?.author_id === CURRENT_USER.id;
                return (
                  <li key={c.id}>
                    <Link
                      href={`/dashboard/chats/${c.id}`}
                      className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-ink-50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <p
                            className={`truncate text-sm ${
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
                          className={`mt-0.5 truncate text-xs ${
                            c.unread > 0 ? "text-ink-900" : "text-ink-500"
                          }`}
                        >
                          {fromMe && (
                            <span className="text-ink-400">Vos: </span>
                          )}
                          {last?.body}
                        </p>
                      </div>
                      {c.unread > 0 && (
                        <span className="ml-2 flex h-5 min-w-[20px] shrink-0 items-center justify-center self-center rounded-full bg-brand-700 px-1.5 text-[10px] font-semibold text-white">
                          {c.unread}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Atajos */}
      <section className="mt-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Atajos
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Shortcut
            href="/dashboard/publicaciones/nueva"
            icon={<PlusCircle className="h-5 w-5" />}
            title="Publicar oferta"
            sub="Carga rápida en 60 segundos"
          />
          <Shortcut
            href="/marketplace"
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Buscar granos"
            sub="Filtros por país, volumen, modalidad"
          />
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  empty,
  hint,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  empty: string;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <>
      {/* Línea de acento verde arriba — aparece en hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand-400 via-brand-600 to-brand-700 transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
      <div className="flex items-center justify-between text-ink-500">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
          {label}
        </p>
        <span className="text-ink-400 transition-colors group-hover:text-brand-700">
          {icon}
        </span>
      </div>
      <p className="mt-3 font-display text-4xl font-medium tracking-tight text-ink-900">
        <CountUp to={value} />
      </p>
      <p
        className={`mt-1 text-xs ${
          hint ? "text-brand-700 font-medium" : "text-ink-500"
        }`}
      >
        {value === 0 ? empty : (hint ?? "—")}
      </p>
    </>
  );

  const base =
    "group relative block overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 shadow-sm";

  if (href) {
    return (
      <Link
        href={href}
        className={`${base} transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_40px_-18px_rgba(62,79,38,0.35)]`}
      >
        {inner}
      </Link>
    );
  }
  return <div className={base}>{inner}</div>;
}

function Step({
  n,
  title,
  desc,
  cta,
  href,
  done,
  primary,
}: {
  n: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  done: boolean;
  primary?: boolean;
}) {
  return (
    <li className="flex flex-col gap-4 border-b border-ink-100 p-6 last:border-b-0 sm:flex-row sm:items-center">
      <div className="flex shrink-0 items-center gap-4 sm:w-[280px]">
        {done ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />
        ) : (
          <Circle className="h-5 w-5 shrink-0 text-ink-300" />
        )}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            Paso {n}
          </p>
          <p className="mt-0.5 font-medium text-ink-900">{title}</p>
        </div>
      </div>
      <p className="flex-1 text-sm text-ink-600">{desc}</p>
      <Link href={href} className="shrink-0">
        <Button
          size="sm"
          variant={primary ? "primary" : "outline"}
          className="whitespace-nowrap"
        >
          {cta}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </li>
  );
}

function Shortcut({
  href,
  icon,
  title,
  sub,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-[0_18px_40px_-18px_rgba(62,79,38,0.35)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand-400 via-brand-600 to-brand-700 transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-100">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-ink-900">{title}</p>
        <p className="text-xs text-ink-500">{sub}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-ink-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-700" />
    </Link>
  );
}
