import type { Metadata } from "next";
import Link from "next/link";
import {
  Inbox,
  MessageSquare,
  Check,
  X,
  Info,
  CheckCheck,
} from "lucide-react";
import { MOCK_NOTIFICATIONS, type Notification } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Notificaciones",
};

const ICONS: Record<Notification["type"], React.ReactNode> = {
  interest_received: <Inbox className="h-4 w-4" />,
  interest_accepted: <Check className="h-4 w-4" />,
  interest_declined: <X className="h-4 w-4" />,
  new_message: <MessageSquare className="h-4 w-4" />,
  system: <Info className="h-4 w-4" />,
};

const FILTERS = [
  { value: "all", label: "Todas" },
  { value: "interest", label: "Intereses" },
  { value: "new_message", label: "Mensajes" },
  { value: "system", label: "Sistema" },
] as const;

type FilterValue = (typeof FILTERS)[number]["value"];

function isFilter(v: string | undefined): v is FilterValue {
  return FILTERS.some((f) => f.value === v);
}

function matchesFilter(n: Notification, f: FilterValue): boolean {
  if (f === "all") return true;
  if (f === "interest")
    return (
      n.type === "interest_received" ||
      n.type === "interest_accepted" ||
      n.type === "interest_declined"
    );
  return n.type === f;
}

/** Agrupa notificaciones por día relativo: Hoy / Ayer / Esta semana / Más viejas. */
function bucketize(items: Notification[]): {
  label: string;
  items: Notification[];
}[] {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const buckets: Record<string, Notification[]> = {
    Hoy: [],
    Ayer: [],
    "Esta semana": [],
    "Más viejas": [],
  };
  for (const n of items) {
    const ageDays = (now - new Date(n.created_at).getTime()) / oneDay;
    if (ageDays < 1) buckets["Hoy"].push(n);
    else if (ageDays < 2) buckets["Ayer"].push(n);
    else if (ageDays < 7) buckets["Esta semana"].push(n);
    else buckets["Más viejas"].push(n);
  }
  return (Object.keys(buckets) as Array<keyof typeof buckets>)
    .map((label) => ({ label: label as string, items: buckets[label] }))
    .filter((b) => b.items.length > 0);
}

export default async function NotificacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const sp = await searchParams;
  const filter: FilterValue = isFilter(sp.tipo) ? sp.tipo : "all";

  const all = MOCK_NOTIFICATIONS;
  const unreadTotal = all.filter((n) => !n.read).length;
  const filtered = all.filter((n) => matchesFilter(n, filter));
  const buckets = bucketize(filtered);

  return (
    <div>
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-ink-100 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
            Bandeja
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900">
            Notificaciones
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            {all.length === 0
              ? "Todavía no hay notificaciones."
              : `${all.length} en total — ${unreadTotal} sin leer.`}
          </p>
        </div>
        {unreadTotal > 0 && (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:border-brand-400 hover:bg-brand-50/40 hover:text-brand-800"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Marcar todas como leídas
          </button>
        )}
      </header>

      {/* Filtros por tipo */}
      {all.length > 0 && (
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            Tipo
          </span>
          {FILTERS.map((f) => {
            const count = all.filter((n) => matchesFilter(n, f.value)).length;
            const active = filter === f.value;
            return (
              <Link
                key={f.value}
                href={
                  f.value === "all"
                    ? "/dashboard/notificaciones"
                    : `/dashboard/notificaciones?tipo=${f.value}`
                }
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-ink-200 bg-white text-ink-700 hover:border-brand-400 hover:bg-brand-50/40"
                }`}
              >
                {f.label}
                <span
                  className={`ml-1.5 ${active ? "text-brand-100" : "text-ink-400"}`}
                >
                  ({count})
                </span>
              </Link>
            );
          })}
        </nav>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-14 text-center">
          <p className="font-display text-2xl font-medium text-ink-900">
            {all.length === 0 ? "Todo tranquilo" : "Sin resultados"}
          </p>
          <p className="mt-2 text-sm text-ink-500">
            {all.length === 0
              ? "Las notificaciones de actividad de tus publicaciones aparecen acá."
              : "Probá con otro tipo."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {buckets.map((bucket) => (
            <section key={bucket.label}>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                {bucket.label}
              </p>
              <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
                {bucket.items.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.href}
                      className={`flex gap-4 px-6 py-4 transition-colors hover:bg-ink-50 ${
                        n.read ? "" : "bg-brand-50/40"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                          n.read
                            ? "bg-ink-100 text-ink-500"
                            : "bg-brand-100 text-brand-700"
                        }`}
                      >
                        {ICONS[n.type]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[15px] ${
                            n.read
                              ? "text-ink-700"
                              : "font-medium text-ink-900"
                          }`}
                        >
                          {n.title}
                        </p>
                        <p className="mt-1 text-sm text-ink-600">{n.body}</p>
                        <p className="mt-2 text-[11px] text-ink-400">
                          {timeAgo(n.created_at)}
                        </p>
                      </div>
                      {!n.read && (
                        <span
                          className="mt-3 h-2 w-2 shrink-0 rounded-full bg-brand-600"
                          aria-hidden
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
