import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import {
  CURRENT_USER,
  MOCK_CHATS,
  MOCK_LISTINGS,
  type ChatMessage,
} from "@/lib/mock-data";
import { countryLabel, grainLabel } from "@/lib/constants";
import {
  formatDate,
  formatPrice,
  formatTonnage,
  timeAgo,
} from "@/lib/utils";

export const metadata: Metadata = {
  title: "Chat",
};

/** Agrupa mensajes por día para mostrar separadores tipo "Hoy / Ayer / 12 abr". */
function groupMessagesByDay(messages: ChatMessage[]): {
  label: string;
  messages: ChatMessage[];
}[] {
  if (messages.length === 0) return [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  const labelFor = (iso: string) => {
    const d = new Date(iso);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const diff = (today - dayStart) / oneDay;
    if (diff === 0) return "Hoy";
    if (diff === 1) return "Ayer";
    return d.toLocaleDateString("es-AR", { day: "numeric", month: "long" });
  };

  const result: { label: string; messages: ChatMessage[] }[] = [];
  for (const m of messages) {
    const label = labelFor(m.created_at);
    const last = result[result.length - 1];
    if (last && last.label === label) last.messages.push(m);
    else result.push({ label, messages: [m] });
  }
  return result;
}

function formatHourMinute(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function ChatThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chat = MOCK_CHATS.find((c) => c.id === id);
  if (!chat) notFound();
  const listing = MOCK_LISTINGS.find((l) => l.id === chat.listing_id);
  const grouped = groupMessagesByDay(chat.messages);

  return (
    <div className="pb-32">
      <Link
        href="/dashboard/chats"
        className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a chats
      </Link>

      {/* Header del chat */}
      <header className="mt-4 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-start gap-4 p-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/u/${chat.counterparty.id}`}
              className="font-display text-xl font-medium text-ink-900 hover:underline"
            >
              {chat.counterparty.full_name}
            </Link>
            <p className="mt-0.5 text-sm text-ink-500">
              {chat.counterparty.city} ·{" "}
              {countryLabel(chat.counterparty.country)}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="brand">
                <ShieldCheck className="mr-1 h-3 w-3" /> Verificado
              </Badge>
              <Badge variant="neutral">
                {chat.my_role === "seller" ? "Comprador" : "Vendedor"}
              </Badge>
            </div>
          </div>
        </div>

        {listing && (
          <div className="flex flex-wrap items-center gap-3 border-t border-ink-100 bg-ink-50/60 px-5 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                Sobre la publicación
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-ink-900">
                {formatTonnage(listing.tonnage)} de{" "}
                {grainLabel(listing.grain_type).toLowerCase()} —{" "}
                {formatPrice(listing.price, listing.currency)}{" "}
                <span className="text-ink-500">
                  · entrega {formatDate(listing.delivery_date)}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              {chat.my_role === "seller" && (
                <Link
                  href={`/dashboard/publicaciones/${listing.id}`}
                  className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:border-ink-300 hover:bg-ink-50"
                >
                  Ver intereses
                </Link>
              )}
              <Link
                href={`/marketplace/${listing.id}`}
                className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 hover:border-ink-300 hover:bg-ink-50"
              >
                Ver pública
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mensajes — agrupados por día */}
      <div className="mt-6 space-y-6">
        {grouped.map((group) => (
          <section key={group.label}>
            <div className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">
              <span className="h-px flex-1 bg-ink-100" aria-hidden />
              {group.label}
              <span className="h-px flex-1 bg-ink-100" aria-hidden />
            </div>
            <ol className="space-y-2.5">
              {group.messages.map((m) => {
                const mine = m.author_id === CURRENT_USER.id;
                return (
                  <li
                    key={m.id}
                    className={`flex ${mine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                        mine
                          ? "rounded-br-md bg-brand-700 text-ink-50"
                          : "rounded-bl-md border border-ink-100 bg-white text-ink-900"
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed">{m.body}</p>
                      <p
                        className={`mt-1 text-[11px] tabular-nums ${
                          mine ? "text-brand-200/80" : "text-ink-400"
                        }`}
                        title={timeAgo(m.created_at)}
                      >
                        {formatHourMinute(m.created_at)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>

      {/* Composer — sticky bottom */}
      <form className="fixed inset-x-0 bottom-0 z-20 border-t border-ink-100 bg-white/95 px-4 py-3 backdrop-blur-md md:px-10">
        <div className="mx-auto flex w-full max-w-[1440px] items-end gap-3">
          <div className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-ink-200 bg-white focus-within:border-brand-600 focus-within:ring-4 focus-within:ring-brand-600/10">
            <Textarea
              rows={2}
              placeholder="Escribí tu mensaje..."
              className="border-0 focus:ring-0"
              aria-label="Mensaje"
            />
            <div className="flex items-center justify-between border-t border-ink-100 bg-ink-50/60 px-3 py-2">
              <p className="text-[11px] text-ink-500">
                La negociación ocurre por fuera de Campo.
              </p>
              <Button type="submit" size="sm">
                <Send className="h-3.5 w-3.5" /> Enviar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
