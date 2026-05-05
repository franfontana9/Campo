import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MessageSquare, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import {
  CURRENT_USER,
  MOCK_CHATS,
  MOCK_LISTINGS,
} from "@/lib/mock-data";
import { countryLabel, grainLabel } from "@/lib/constants";
import { formatTonnage, timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Chats",
  description: "Conversaciones por publicación con tus contrapartes.",
};

export default function ChatsPage() {
  const chats = MOCK_CHATS;
  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  return (
    <div>
      <header className="mb-6 border-b border-ink-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Bandeja
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900">
          Chats
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          {chats.length === 0
            ? "Cuando alguien acepte tu interés (o vos aceptes uno) se abre un hilo acá."
            : `${chats.length} hilos${totalUnread > 0 ? ` — ${totalUnread} mensajes sin leer` : ""}.`}
        </p>
      </header>

      {chats.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-14 text-center">
          <p className="font-display text-2xl font-medium text-ink-900">
            Sin chats abiertos
          </p>
          <p className="mt-2 text-sm text-ink-500">
            Empezá una conversación mostrando interés en una publicación del
            marketplace.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
          {chats.map((c) => {
            const listing = MOCK_LISTINGS.find((l) => l.id === c.listing_id);
            const lastMsg = c.messages[c.messages.length - 1];
            const lastFromMe = lastMsg?.author_id === CURRENT_USER.id;
            return (
              <li key={c.id}>
                <Link
                  href={`/dashboard/chats/${c.id}`}
                  className="flex gap-4 px-5 py-4 transition-colors hover:bg-ink-50"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
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
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-ink-500">
                      {listing && (
                        <>
                          <Badge variant="brand">
                            {grainLabel(listing.grain_type)}
                          </Badge>
                          <span>
                            {formatTonnage(listing.tonnage)} ·{" "}
                            {listing.city}
                          </span>
                        </>
                      )}
                    </p>
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

      {/* Hint sobre cómo abrir nuevos chats */}
      <p className="mt-6 inline-flex items-center gap-2 text-xs text-ink-500">
        <MapPin className="h-3 w-3" />
        Tip: cuando aceptes un interés en{" "}
        <Link
          href="/dashboard/intereses-recibidos"
          className="text-brand-700 underline underline-offset-4 hover:text-brand-800"
        >
          intereses recibidos
        </Link>
        , se abre un hilo acá automáticamente.
      </p>
    </div>
  );
}
