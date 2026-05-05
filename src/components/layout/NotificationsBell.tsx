"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Inbox, MessageSquare, Check, X, Info } from "lucide-react";
import { MOCK_NOTIFICATIONS, type Notification } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";

const ICONS: Record<Notification["type"], React.ReactNode> = {
  interest_received: <Inbox className="h-4 w-4" />,
  interest_accepted: <Check className="h-4 w-4" />,
  interest_declined: <X className="h-4 w-4" />,
  new_message: <MessageSquare className="h-4 w-4" />,
  system: <Info className="h-4 w-4" />,
};

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const items = MOCK_NOTIFICATIONS;
  const unread = items.filter((n) => !n.read).length;

  // Cerrar al click afuera
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900"
        aria-label={`Notificaciones${unread > 0 ? ` (${unread} sin leer)` : ""}`}
        aria-expanded={open}
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-500/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[360px] overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-xl">
          <header className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
            <p className="text-sm font-semibold text-ink-900">Notificaciones</p>
            {unread > 0 && (
              <span className="rounded-full bg-accent-50 px-2 py-0.5 text-[11px] font-medium text-accent-700">
                {unread} sin leer
              </span>
            )}
          </header>

          {items.length === 0 ? (
            <div className="p-8 text-center text-sm text-ink-500">
              Todavía no hay notificaciones.
            </div>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto divide-y divide-ink-100">
              {items.slice(0, 6).map((n) => (
                <li key={n.id}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`flex gap-3 px-5 py-3 transition-colors hover:bg-ink-50 ${
                      n.read ? "" : "bg-brand-50/40"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        n.read
                          ? "bg-ink-100 text-ink-500"
                          : "bg-brand-100 text-brand-700"
                      }`}
                    >
                      {ICONS[n.type]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm ${
                          n.read ? "text-ink-700" : "font-medium text-ink-900"
                        }`}
                      >
                        {n.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">
                        {n.body}
                      </p>
                      <p className="mt-1 text-[11px] text-ink-400">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                    {!n.read && (
                      <span
                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-600"
                        aria-hidden
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <Link
            href="/dashboard/notificaciones"
            onClick={() => setOpen(false)}
            className="block border-t border-ink-100 bg-ink-50/60 px-5 py-3 text-center text-sm font-medium text-brand-700 transition-colors hover:bg-ink-50 hover:text-brand-800"
          >
            Ver todas
          </Link>
        </div>
      )}
    </div>
  );
}
