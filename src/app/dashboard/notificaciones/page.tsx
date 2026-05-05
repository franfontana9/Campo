import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, MessageSquare, Check, X, Info } from "lucide-react";
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

export default function NotificacionesPage() {
  const items = MOCK_NOTIFICATIONS;
  const unread = items.filter((n) => !n.read).length;

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
            {items.length === 0
              ? "Todavía no hay notificaciones."
              : `${items.length} en total — ${unread} sin leer.`}
          </p>
        </div>
        {unread > 0 && (
          <button
            type="button"
            className="text-xs font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Marcar todas como leídas
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-14 text-center">
          <p className="font-display text-2xl font-medium text-ink-900">
            Todo tranquilo
          </p>
          <p className="mt-2 text-sm text-ink-500">
            Las notificaciones de actividad de tus publicaciones aparecen acá.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
          {items.map((n) => (
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
                      n.read ? "text-ink-700" : "font-medium text-ink-900"
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
      )}
    </div>
  );
}
