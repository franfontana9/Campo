"use client";

import { useState, useEffect, useRef } from "react";
import { Gavel, Clock, TrendingUp, Users, ChevronRight, X, Zap, Calendar, CheckCircle2, ArrowUpRight } from "lucide-react";
import { AUCTIONS, AuctionSpec, seededBids, liveAuctions, upcomingAuctions, endedAuctions } from "@/lib/auction-data";

type Tab = "live" | "upcoming" | "ended";

/* ── Countdown ──────────────────────────────────────────────── */
function useCountdown(secondsRemaining: number) {
  const [secs, setSecs] = useState(secondsRemaining);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return { secs, h, m, s };
}

function Countdown({ secondsRemaining, urgent }: { secondsRemaining: number; urgent?: boolean }) {
  const { h, m, s } = useCountdown(secondsRemaining);
  const fmt = (n: number) => String(n).padStart(2, "0");
  return (
    <span className={`font-mono text-sm font-bold tabular-nums ${urgent ? "text-red-600" : "text-ink-800"}`}>
      {h > 0 ? `${fmt(h)}:` : ""}{fmt(m)}:{fmt(s)}
    </span>
  );
}

/* ── Bid panel ──────────────────────────────────────────────── */
function BidPanel({ auc, onClose }: { auc: AuctionSpec; onClose: () => void }) {
  const [bidAmount, setBidAmount] = useState(auc.currentBidUSD + 500);
  const [submitted, setSubmitted] = useState(false);
  const minBid = auc.currentBidUSD + 100;
  const bids = seededBids(auc);
  const secsRemaining = Math.max(0, auc.secondsTotal - auc.secondsElapsed);

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        </div>
        <div>
          <p className="text-lg font-semibold text-ink-900">¡Oferta enviada!</p>
          <p className="mt-1 text-sm text-ink-500">
            Tu oferta de <span className="font-medium text-ink-800">USD {bidAmount.toLocaleString("en-US")}</span> fue registrada.
          </p>
          <p className="mt-0.5 text-xs text-ink-400">Recibirás notificación si sos superado.</p>
        </div>
        <button
          onClick={onClose}
          className="mt-2 rounded-full bg-brand-700 px-6 py-2 text-sm font-medium text-white hover:bg-brand-800"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Auction summary */}
      <div className="rounded-xl border border-ink-100 bg-ink-50/60 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{auc.seller}</p>
            <p className="mt-0.5 text-lg font-bold text-ink-900">{auc.grainLabel}</p>
            <p className="text-sm text-ink-600">{auc.tonnage.toLocaleString("es-AR")} t · {auc.region}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-400">Mejor oferta</p>
            <p className="text-xl font-bold text-brand-700">USD {auc.currentBidUSD.toLocaleString("en-US")}</p>
            <p className="text-xs text-ink-500">{auc.bidCount} ofertas</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-red-500" />
          <Countdown secondsRemaining={secsRemaining} urgent={secsRemaining < 120} />
          <span className="text-xs text-ink-400 ml-1">restantes</span>
        </div>
      </div>

      {/* Bid input */}
      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">Tu oferta (USD)</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={bidAmount}
            min={minBid}
            step={100}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            className="flex-1 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-base font-semibold text-ink-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
          <button
            type="button"
            onClick={() => setBidAmount((v) => v + 500)}
            className="rounded-xl border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            +500
          </button>
          <button
            type="button"
            onClick={() => setBidAmount((v) => v + 1000)}
            className="rounded-xl border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50"
          >
            +1k
          </button>
        </div>
        {bidAmount < minBid && (
          <p className="mt-1.5 text-xs text-red-500">Mínimo: USD {minBid.toLocaleString("en-US")}</p>
        )}
        <p className="mt-1.5 text-xs text-ink-400">
          USD {Math.round(bidAmount / auc.tonnage).toLocaleString("en-US")}/ton · reserva USD {auc.reserveUSD.toLocaleString("en-US")}
        </p>
      </div>

      {/* Submit */}
      <button
        disabled={bidAmount < minBid}
        onClick={() => setSubmitted(true)}
        className="w-full rounded-xl bg-brand-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Confirmar oferta — USD {bidAmount.toLocaleString("en-US")}
      </button>

      {/* Bid history */}
      {bids.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400">Historial de ofertas</p>
          <ul className="space-y-1.5">
            {bids.map((b, i) => (
              <li
                key={i}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                  i === bids.length - 1 ? "bg-brand-50 font-medium" : "bg-ink-50"
                }`}
              >
                <span className="text-ink-700 truncate max-w-[60%]">{b.bidder}</span>
                <span className={`font-semibold tabular-nums ${i === bids.length - 1 ? "text-brand-700" : "text-ink-800"}`}>
                  USD {b.amountUSD.toLocaleString("en-US")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ── Live auction card ──────────────────────────────────────── */
function LiveCard({ auc, onBid }: { auc: AuctionSpec; onBid: () => void }) {
  const secsRemaining = Math.max(0, auc.secondsTotal - auc.secondsElapsed);
  const progress = Math.min(1, auc.secondsElapsed / auc.secondsTotal);
  const urgent = secsRemaining < 5 * 60;
  const pricePerTon = Math.round(auc.currentBidUSD / auc.tonnage);

  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Live badge */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-600">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
          En vivo
        </span>
        <span className="text-[11px] font-medium text-ink-400">{auc.seller}</span>
      </div>

      {/* Grain + region */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white text-base font-bold"
          style={{ backgroundColor: auc.grainColor }}
        >
          {auc.grainLabel[0]}
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold text-ink-900">{auc.grainLabel}</p>
          <p className="text-sm text-ink-500">{auc.tonnage.toLocaleString("es-AR")} t · {auc.region}, {auc.country}</p>
          <p className="mt-0.5 text-[11px] text-ink-400 truncate">{auc.quality}</p>
        </div>
      </div>

      {/* Bid stats */}
      <div className="grid grid-cols-3 gap-3 rounded-xl bg-ink-50/70 p-3">
        <div>
          <p className="text-[10px] text-ink-400 uppercase tracking-wide">Mejor oferta</p>
          <p className="mt-0.5 text-sm font-bold text-brand-700">USD {auc.currentBidUSD.toLocaleString("en-US")}</p>
          <p className="text-[10px] text-ink-500">{pricePerTon}/t</p>
        </div>
        <div>
          <p className="text-[10px] text-ink-400 uppercase tracking-wide">Reserva</p>
          <p className="mt-0.5 text-sm font-semibold text-ink-700">USD {auc.reserveUSD.toLocaleString("en-US")}</p>
          <p className="text-[10px] text-ink-500">{Math.round(auc.reserveUSD / auc.tonnage)}/t</p>
        </div>
        <div>
          <p className="text-[10px] text-ink-400 uppercase tracking-wide">Ofertas</p>
          <p className="mt-0.5 text-sm font-semibold text-ink-700">{auc.bidCount}</p>
          <p className="text-[10px] flex items-center gap-0.5 text-ink-500"><Users className="h-2.5 w-2.5" /> postores</p>
        </div>
      </div>

      {/* Progress bar + countdown */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock className={`h-3.5 w-3.5 ${urgent ? "text-red-500" : "text-ink-400"}`} />
            <Countdown secondsRemaining={secsRemaining} urgent={urgent} />
          </div>
          <span className="text-[11px] text-ink-400">{Math.round(progress * 100)}% transcurrido</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className={`h-full rounded-full transition-all ${urgent ? "bg-red-500" : "bg-brand-600"}`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onBid}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 active:scale-[0.98]"
      >
        <Gavel className="h-4 w-4" />
        Ofertar ahora
      </button>
    </div>
  );
}

/* ── Upcoming card ──────────────────────────────────────────── */
function UpcomingCard({ auc }: { auc: AuctionSpec }) {
  const secsUntil = Math.abs(auc.secondsElapsed);
  const h = Math.floor(secsUntil / 3600);
  const m = Math.floor((secsUntil % 3600) / 60);
  const timeLabel = h >= 24 ? `${Math.floor(h / 24)}d ${h % 24}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-600">
          <Calendar className="h-3 w-3" />
          Próxima
        </span>
        <span className="text-[11px] font-medium text-ink-400">{auc.seller}</span>
      </div>

      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white text-base font-bold opacity-75"
          style={{ backgroundColor: auc.grainColor }}
        >
          {auc.grainLabel[0]}
        </div>
        <div className="min-w-0">
          <p className="text-base font-bold text-ink-900">{auc.grainLabel}</p>
          <p className="text-sm text-ink-500">{auc.tonnage.toLocaleString("es-AR")} t · {auc.region}, {auc.country}</p>
          <p className="mt-0.5 text-[11px] text-ink-400 truncate">{auc.quality}</p>
        </div>
      </div>

      <div className="rounded-xl bg-amber-50/70 px-4 py-3">
        <p className="text-[11px] text-amber-600 font-medium uppercase tracking-wide">Empieza en</p>
        <p className="mt-0.5 text-xl font-bold text-amber-700">{timeLabel}</p>
        <p className="text-[11px] text-amber-600 mt-0.5">Reserva: USD {auc.reserveUSD.toLocaleString("en-US")}</p>
      </div>

      <p className="text-xs text-ink-500 leading-relaxed">{auc.description}</p>

      <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-200 bg-brand-50/60 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-100">
        <Zap className="h-4 w-4" />
        Activar alerta
      </button>
    </div>
  );
}

/* ── Ended card ─────────────────────────────────────────────── */
function EndedCard({ auc }: { auc: AuctionSpec }) {
  const pricePerTon = Math.round(auc.currentBidUSD / auc.tonnage);
  const premium = Math.round(((auc.currentBidUSD - auc.reserveUSD) / auc.reserveUSD) * 100 * 10) / 10;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ink-100 bg-ink-50/40 p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
          <CheckCircle2 className="h-3 w-3" />
          Finalizada
        </span>
        <span className="text-[11px] font-medium text-ink-400">{auc.seller}</span>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-sm font-bold opacity-50"
          style={{ backgroundColor: auc.grainColor }}
        >
          {auc.grainLabel[0]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink-700">{auc.grainLabel}</p>
          <p className="text-xs text-ink-500">{auc.tonnage.toLocaleString("es-AR")} t · {auc.region}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-ink-800">USD {auc.currentBidUSD.toLocaleString("en-US")}</p>
          <p className="text-xs text-ink-500">{pricePerTon}/t</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg bg-white border border-ink-100 px-3 py-2 text-xs text-ink-500">
        <span>{auc.bidCount} ofertas</span>
        <span className="text-ink-200">·</span>
        <span className="flex items-center gap-0.5 text-emerald-600 font-medium">
          <ArrowUpRight className="h-3 w-3" />
          +{premium}% sobre reserva
        </span>
      </div>
    </div>
  );
}

/* ── Modal wrapper ──────────────────────────────────────────── */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        ref={ref}
        className="relative z-10 w-full max-w-md overflow-y-auto max-h-[90vh] rounded-2xl border border-ink-100 bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-ink-100 bg-white px-5 py-4">
          <p className="font-semibold text-ink-900">{title}</p>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-ink-100 text-ink-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ── Stats bar ──────────────────────────────────────────────── */
function StatsBar() {
  const live = liveAuctions();
  const totalVolume = live.reduce((s, a) => s + a.currentBidUSD, 0);
  const totalTons = live.reduce((s, a) => s + a.tonnage, 0);
  const totalBids = live.reduce((s, a) => s + a.bidCount, 0);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[
        { label: "Subastas activas", value: live.length.toString(), icon: <Zap className="h-4 w-4" /> },
        { label: "Volumen en juego", value: `USD ${(totalVolume / 1_000_000).toFixed(2)}M`, icon: <TrendingUp className="h-4 w-4" /> },
        { label: "Toneladas", value: totalTons.toLocaleString("es-AR") + " t", icon: <Gavel className="h-4 w-4" /> },
        { label: "Ofertas totales", value: totalBids.toString(), icon: <Users className="h-4 w-4" /> },
      ].map((s) => (
        <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            {s.icon}
          </div>
          <div>
            <p className="text-[11px] text-ink-400">{s.label}</p>
            <p className="font-bold text-ink-900">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────── */
export function SubastasClient() {
  const [tab, setTab] = useState<Tab>("live");
  const [bidding, setBidding] = useState<AuctionSpec | null>(null);

  const tabs: { value: Tab; label: string; count: number }[] = [
    { value: "live", label: "En curso", count: liveAuctions().length },
    { value: "upcoming", label: "Próximas", count: upcomingAuctions().length },
    { value: "ended", label: "Finalizadas", count: endedAuctions().length },
  ];

  const visible =
    tab === "live" ? liveAuctions() :
    tab === "upcoming" ? upcomingAuctions() :
    endedAuctions();

  return (
    <>
      {/* Header */}
      <div className="border-b border-ink-100 bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-10">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-red-500" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-red-500">En vivo</p>
              </div>
              <h1 className="mt-1 font-display text-3xl font-medium text-ink-900">Subastas</h1>
              <p className="mt-1 text-sm text-ink-500">Remates en tiempo real de granos físicos entre empresas</p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-ink-300" />
              <span className="text-sm text-ink-500">Actualizando en tiempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-10 flex flex-col gap-8">
        {/* Stats */}
        <StatsBar />

        {/* Tabs */}
        <div>
          <div className="flex items-center gap-1 rounded-full border border-ink-200 bg-ink-50/60 p-0.5 w-fit">
            {tabs.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  tab === t.value ? "bg-brand-700 text-white shadow-sm" : "text-ink-700 hover:text-ink-900"
                }`}
              >
                {t.label}
                <span
                  className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                    tab === t.value ? "bg-white/20 text-white" : "bg-ink-200 text-ink-600"
                  }`}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((auc) =>
              tab === "live" ? (
                <LiveCard key={auc.id} auc={auc} onBid={() => setBidding(auc)} />
              ) : tab === "upcoming" ? (
                <UpcomingCard key={auc.id} auc={auc} />
              ) : (
                <EndedCard key={auc.id} auc={auc} />
              )
            )}
          </div>

          {visible.length === 0 && (
            <div className="mt-16 text-center text-ink-400">
              <Gavel className="mx-auto h-10 w-10 opacity-30" />
              <p className="mt-3 font-medium text-ink-600">No hay subastas en esta categoría</p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-ink-400 text-center">
          Las subastas son demostrativas. El sistema de remates en vivo estará disponible en la versión 1.0 de Campo.
        </p>
      </div>

      {/* Bid modal */}
      {bidding && (
        <Modal title={`Ofertar — ${bidding.grainLabel} ${bidding.tonnage}t`} onClose={() => setBidding(null)}>
          <BidPanel auc={bidding} onClose={() => setBidding(null)} />
        </Modal>
      )}
    </>
  );
}
