"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Banknote, ShieldCheck, TrendingUp, AlertTriangle,
  ChevronRight, Info, BarChart2, Users, Landmark,
  Wallet, Coins,
} from "lucide-react";
import {
  LOAN_PRODUCTS, RISK_FACTORS, simulate, computeRiskScore,
  fmtUSD, fmtPct,
  type LoanProduct, type SimResult,
} from "@/lib/loan-data";
import { Button } from "@/components/ui/Button";

/* ─── Risk styling — alineado con la paleta del design system ────── */
const RISK_TONE: Record<
  string,
  { dot: string; text: string; border: string; bg: string; barFill: string }
> = {
  A: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    border: "border-emerald-300/60",
    bg: "bg-emerald-50",
    barFill: "bg-emerald-500",
  },
  B: {
    dot: "bg-amber-500",
    text: "text-amber-700",
    border: "border-amber-300/60",
    bg: "bg-amber-50",
    barFill: "bg-amber-500",
  },
  C: {
    dot: "bg-orange-500",
    text: "text-orange-700",
    border: "border-orange-300/60",
    bg: "bg-orange-50",
    barFill: "bg-orange-500",
  },
  D: {
    dot: "bg-rose-500",
    text: "text-rose-700",
    border: "border-rose-300/60",
    bg: "bg-rose-50",
    barFill: "bg-rose-500",
  },
};

/* ─── Helpers ────────────────────────────────────────────────────── */
function RiskBadge({ level, label }: { level: string; label: string }) {
  const t = RISK_TONE[level] ?? RISK_TONE.A;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${t.border} ${t.bg} ${t.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${t.dot}`} />
      {level} · {label}
    </span>
  );
}

function Stat({
  label, value, sub, highlight,
}: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-brand-200 bg-brand-50/60" : "border-ink-100 bg-white"}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-500">{label}</p>
      <p className={`mt-2 font-display text-2xl font-medium tracking-tight ${highlight ? "text-brand-700" : "text-ink-900"}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-ink-500">{sub}</p>}
    </div>
  );
}

function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = Math.min(100, (score / max) * 100);
  const fill =
    pct >= 75
      ? RISK_TONE.A.barFill
      : pct >= 50
        ? RISK_TONE.B.barFill
        : pct >= 30
          ? RISK_TONE.C.barFill
          : RISK_TONE.D.barFill;
  return (
    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-100">
      <div
        className={`h-full rounded-full transition-all duration-500 ${fill}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ─── Amortization chart (inline SVG) ───────────────────────────── */
function AmortizationChart({ result }: { result: SimResult }) {
  const { schedule } = result;
  if (schedule.length === 0) return null;

  const maxTotal = Math.max(...schedule.map((r) => r.total));
  const W = 480, H = 140, PAD = { top: 10, right: 10, bottom: 28, left: 10 };
  const bW = Math.max(6, (W - PAD.left - PAD.right) / schedule.length - 2);
  const step = (W - PAD.left - PAD.right) / schedule.length;

  function barY(v: number) {
    return PAD.top + (H - PAD.top - PAD.bottom) - (v / maxTotal) * (H - PAD.top - PAD.bottom);
  }
  function barH(v: number) {
    return (v / maxTotal) * (H - PAD.top - PAD.bottom);
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[260px]" preserveAspectRatio="xMidYMid meet">
        {schedule.map((row, i) => {
          const x = PAD.left + i * step + (step - bW) / 2;
          const hInt = barH(row.interest);
          const hPrin = barH(row.principal);
          const yInt = barY(row.interest + row.principal);
          const yPrin = barY(row.principal);
          return (
            <g key={i}>
              <rect x={x} y={yInt} width={bW} height={hInt} fill="#c97b55" opacity="0.85" rx="2">
                <title>{row.label} — Interés: {fmtUSD(row.interest)}</title>
              </rect>
              <rect x={x} y={yPrin} width={bW} height={hPrin} fill="#4f632f" opacity="0.85" rx="2">
                <title>{row.label} — Capital: {fmtUSD(row.principal)}</title>
              </rect>
              {schedule.length <= 6 && (
                <text x={x + bW / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="#8a8a74">
                  {row.label.replace("Mes ", "M")}
                </text>
              )}
              {schedule.length > 6 && i % 2 === 0 && (
                <text x={x + bW / 2} y={H - 6} textAnchor="middle" fontSize="9" fill="#8a8a74">
                  {row.label.replace("Mes ", "M")}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex items-center gap-4 text-[11px] text-ink-500">
        <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#4f632f]" /> Capital</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#c97b55]" /> Intereses</span>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────── */
const MAX_RISK_SCORE = RISK_FACTORS.reduce(
  (sum, f) => sum + Math.max(...f.options.map((o) => o.points)),
  0
);

const DEFAULT_ANSWERS: Record<string, string> = {
  history: "medium",
  volume: "mid",
  collateral: "stock",
  ltv: "mid",
  country: "ar",
};

export function LoansClient() {
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct>(LOAN_PRODUCTS[0]);
  const [principal, setPrincipal] = useState(50_000);
  const [termDays, setTermDays] = useState(90);
  const [amortization, setAmortization] = useState<"bullet" | "lineal" | "frances">("frances");
  const [riskAnswers, setRiskAnswers] = useState<Record<string, string>>(DEFAULT_ANSWERS);
  const [view, setView] = useState<"borrower" | "investor">("borrower");
  const [tab, setTab] = useState<"simulator" | "products" | "howto">("simulator");

  const clampedPrincipal = Math.min(selectedProduct.maxUSD, Math.max(selectedProduct.minUSD, principal));
  const clampedDays = Math.min(selectedProduct.maxDays, Math.max(selectedProduct.minDays, termDays));

  const result = useMemo(
    () => simulate(selectedProduct, clampedPrincipal, clampedDays, riskAnswers, amortization),
    [selectedProduct, clampedPrincipal, clampedDays, riskAnswers, amortization]
  );

  const riskInfo = useMemo(() => computeRiskScore(riskAnswers), [riskAnswers]);

  function setAnswer(key: string, value: string) {
    setRiskAnswers((prev) => ({ ...prev, [key]: value }));
  }

  const termMonths = Math.round(clampedDays / 30);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 py-12 lg:px-10">

      {/* Header */}
      <header className="mb-10 border-b border-ink-100 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Finanzas agrícolas</p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-ink-900 md:text-6xl">
          Préstamos <em className="text-brand-700">y financiamiento</em>.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-600">
          Adelantá tu cosecha, financiá una compra o acopiá sin inmovilizar capital.
          Tasas calculadas según perfil de riesgo crediticio. Sin bancos intermediarios.
        </p>

        {/* Trust pills — versión sutil: dot + texto, sin border ni bg */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-600">
          {[
            { icon: <ShieldCheck className="h-3.5 w-3.5" />, text: "Garantía sobre grano físico" },
            { icon: <TrendingUp className="h-3.5 w-3.5" />, text: "Tasas desde 6% anual" },
            { icon: <Landmark className="h-3.5 w-3.5" />, text: "Operaciones en USD" },
            { icon: <Users className="h-3.5 w-3.5" />, text: "Plataforma P2P" },
          ].map(({ icon, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-1.5"
            >
              <span className="text-brand-700">{icon}</span>
              {text}
            </span>
          ))}
        </div>
      </header>

      {/* Tab nav */}
      <div className="mb-8 inline-flex items-center gap-1 rounded-xl border border-ink-200 bg-ink-50 p-1 text-sm">
        {(["simulator", "products", "howto"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${tab === t ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"}`}
          >
            {t === "simulator" ? "Simulador" : t === "products" ? "Productos" : "¿Cómo funciona?"}
          </button>
        ))}
      </div>

      {/* Toggle de rol — Tomador / Inversor (solo aplica al simulator) */}
      {tab === "simulator" && (
        <div className="mb-8 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
          <div className="flex flex-wrap items-center gap-3 px-5 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">
              Soy
            </span>
            <div className="flex flex-1 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setView("borrower")}
                aria-pressed={view === "borrower"}
                className={`group inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  view === "borrower"
                    ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                    : "border-ink-200 bg-white text-ink-700 hover:border-brand-400 hover:bg-brand-50/40"
                }`}
              >
                <Wallet className="h-4 w-4" />
                <span className="text-left">
                  <span className="block">Tomador</span>
                  <span
                    className={`block text-[10px] font-normal ${view === "borrower" ? "text-brand-100" : "text-ink-500"}`}
                  >
                    Necesito financiamiento
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setView("investor")}
                aria-pressed={view === "investor"}
                className={`group inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  view === "investor"
                    ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                    : "border-ink-200 bg-white text-ink-700 hover:border-brand-400 hover:bg-brand-50/40"
                }`}
              >
                <Coins className="h-4 w-4" />
                <span className="text-left">
                  <span className="block">Inversor</span>
                  <span
                    className={`block text-[10px] font-normal ${view === "investor" ? "text-brand-100" : "text-ink-500"}`}
                  >
                    Quiero prestar capital
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SIMULATOR TAB ── */}
      {tab === "simulator" && (
        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">

          {/* LEFT — Inputs */}
          <div className="space-y-6">

            {/* Product selector */}
            <div className="rounded-2xl border border-ink-100 bg-white p-6">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-500">Producto</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {LOAN_PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`rounded-xl border p-4 text-left transition-all ${selectedProduct.id === p.id ? "border-brand-600 bg-brand-50/60 ring-1 ring-brand-600/30" : "border-ink-100 hover:border-ink-300 hover:bg-ink-50"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-ink-900 text-sm">{p.name}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${selectedProduct.id === p.id ? "bg-brand-700 text-white" : "bg-ink-100 text-ink-600"}`}>
                        {p.tag}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-500 line-clamp-2">{p.description}</p>
                    <p className="mt-3 text-xs font-semibold text-brand-700">
                      TNA desde {fmtPct(p.baseRateAnnual, 0)} · hasta {fmtPct(p.maxRateAnnual, 0)}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Loan parameters */}
            <div className="rounded-2xl border border-ink-100 bg-white p-6">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-500">Parámetros del préstamo</p>
              <div className="space-y-5">

                {/* Amount */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-ink-800">Monto</label>
                    <span className="font-display text-lg font-medium text-ink-900">{fmtUSD(clampedPrincipal)}</span>
                  </div>
                  <input
                    type="range"
                    min={selectedProduct.minUSD}
                    max={selectedProduct.maxUSD}
                    step={selectedProduct.minUSD}
                    value={clampedPrincipal}
                    onChange={(e) => setPrincipal(+e.target.value)}
                    className="w-full accent-brand-700 h-2 cursor-pointer rounded-full"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-ink-400">
                    <span>{fmtUSD(selectedProduct.minUSD)}</span>
                    <span>{fmtUSD(selectedProduct.maxUSD)}</span>
                  </div>
                </div>

                {/* Term */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-ink-800">Plazo</label>
                    <span className="font-display text-lg font-medium text-ink-900">{clampedDays} días <span className="text-sm font-sans font-normal text-ink-500">({termMonths} mes{termMonths !== 1 ? "es" : ""})</span></span>
                  </div>
                  <input
                    type="range"
                    min={selectedProduct.minDays}
                    max={selectedProduct.maxDays}
                    step={15}
                    value={clampedDays}
                    onChange={(e) => setTermDays(+e.target.value)}
                    className="w-full accent-brand-700 h-2 cursor-pointer rounded-full"
                  />
                  <div className="mt-1 flex justify-between text-[10px] text-ink-400">
                    <span>{selectedProduct.minDays} días</span>
                    <span>{selectedProduct.maxDays} días</span>
                  </div>
                </div>

                {/* Amortization */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-ink-800">Sistema de amortización</label>
                  <div className="flex gap-2 flex-wrap">
                    {(["frances", "lineal", "bullet"] as const).map((a) => (
                      <button
                        key={a}
                        onClick={() => setAmortization(a)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${amortization === a ? "border-brand-600 bg-brand-700 text-white" : "border-ink-200 bg-white text-ink-700 hover:bg-ink-50"}`}
                      >
                        {a === "frances" ? "Francés (cuota fija)" : a === "lineal" ? "Alemán (capital fijo)" : "Bullet (al vencimiento)"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk scoring */}
            <div className="rounded-2xl border border-ink-100 bg-white p-6">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-500">Perfil de riesgo crediticio</p>
                <RiskBadge level={riskInfo.level} label={riskInfo.label} />
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-ink-500 mb-1">
                  <span>Score: {riskInfo.score} / {MAX_RISK_SCORE}</span>
                  <span>Spread: {riskInfo.spread > 0 ? `+${fmtPct(riskInfo.spread, 0)}` : "Sin penalización"}</span>
                </div>
                <ScoreBar score={riskInfo.score} max={MAX_RISK_SCORE} />
              </div>

              <div className="space-y-4">
                {RISK_FACTORS.map((factor) => (
                  <div key={factor.key}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <label className="text-sm font-medium text-ink-800">{factor.label}</label>
                      <span className="group relative cursor-help">
                        <Info className="h-3.5 w-3.5 text-ink-400" />
                        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 w-48 -translate-x-1/2 rounded-lg bg-ink-900 px-3 py-2 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {factor.description}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {factor.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setAnswer(factor.key, opt.value)}
                          className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${riskAnswers[factor.key] === opt.value ? "border-brand-600 bg-brand-700 text-white" : "border-ink-200 bg-white text-ink-700 hover:bg-ink-50"}`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Results */}
          <div className="space-y-5">

            {/* Indicador discreto del rol activo */}
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-600" />
              Vista de {view === "borrower" ? "tomador" : "inversor"}
            </div>

            {/* Summary stats */}
            {view === "borrower" ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="TNA" value={fmtPct(result.tna, 2)} sub="Tasa nominal anual" highlight />
                  <Stat label="TEA" value={fmtPct(result.tea, 2)} sub="Tasa efectiva anual" />
                  <Stat label="Total a pagar" value={fmtUSD(result.totalBorrower)} sub={`sobre ${fmtUSD(result.principal)}`} />
                  <Stat label="Costo financiero" value={fmtUSD(result.interestBorrower)} sub={`en ${clampedDays} días`} />
                </div>
                <div className="rounded-2xl border border-ink-100 bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-500 mb-1">Tasa mensual efectiva</p>
                  <p className="font-display text-3xl font-medium text-ink-900">{fmtPct(result.effectiveMonthlyRate, 2)}</p>
                  <p className="mt-1 text-xs text-ink-500">Equivalente mensual considerando capitalización diaria</p>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Stat label="Rendimiento TNA" value={fmtPct(result.annualRateInvestor, 2)} sub="Tasa neta al inversor" highlight />
                  <Stat label="Ganancia total" value={fmtUSD(result.interestInvestor)} sub={`en ${clampedDays} días`} />
                  <Stat label="Capital prestado" value={fmtUSD(result.principal)} sub="Monto que se fondeará" />
                  <Stat label="Fee plataforma" value={fmtUSD(result.platformRevenue)} sub={fmtPct(result.annualRateBorrower - result.annualRateInvestor) + " anual"} />
                </div>
                <div className="rounded-2xl border border-ink-100 bg-white p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-500 mb-2">Retorno sobre capital</p>
                  <div className="flex items-end gap-2">
                    <p className="font-display text-3xl font-medium text-brand-700">{fmtPct(result.interestInvestor / result.principal, 2)}</p>
                    <p className="mb-1 text-sm text-ink-500">en el período</p>
                  </div>
                  <p className="mt-2 text-xs text-ink-500">Riesgo {riskInfo.level}: {riskInfo.label.toLowerCase()}. El capital no está garantizado por Campo S.A.</p>
                </div>
              </>
            )}

            {/* Risk breakdown */}
            <div className="rounded-2xl border border-ink-100 bg-white p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-500">Composición de tasa ({view === "borrower" ? "Tomador" : "Inversor"})</p>
              <div className="space-y-2 text-sm">
                <RateLine label="Tasa base (grado A)" value={fmtPct(selectedProduct.baseRateAnnual)} color="#4f632f" />
                <RateLine label={`Spread por riesgo (${riskInfo.level})`} value={`+${fmtPct(riskInfo.spread)}`} color={riskInfo.color} />
                {view === "borrower" && <RateLine label="Fee plataforma" value={`+${fmtPct(selectedProduct.platformFeeRate)}`} color="#8a8a74" />}
                {view === "investor" && <RateLine label="Fee plataforma (descuento)" value={`-${fmtPct(selectedProduct.platformFeeRate)}`} color="#8a8a74" />}
                <div className="border-t border-ink-100 pt-2 flex justify-between font-semibold">
                  <span className="text-ink-800">{view === "borrower" ? "TNA tomador" : "TNA inversor"}</span>
                  <span style={{ color: view === "borrower" ? "#b66240" : "#4f632f" }}>
                    {fmtPct(view === "borrower" ? result.tna : result.annualRateInvestor)}
                  </span>
                </div>
              </div>
            </div>

            {/* Amortization chart */}
            <div className="rounded-2xl border border-ink-100 bg-white p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-500">Cronograma de pagos</p>
              <AmortizationChart result={result} />
            </div>

            {/* Schedule table */}
            {result.schedule.length <= 12 && (
              <div className="rounded-2xl border border-ink-100 bg-white overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 bg-ink-50/60 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-500">
                      <th className="px-4 py-2.5 text-left">Período</th>
                      <th className="px-4 py-2.5 text-right">Capital</th>
                      <th className="px-4 py-2.5 text-right">Interés</th>
                      <th className="px-4 py-2.5 text-right">Cuota</th>
                      <th className="px-4 py-2.5 text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr key={row.period} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/40">
                        <td className="px-4 py-2.5 text-ink-700">{row.label}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs text-ink-600">{fmtUSD(row.principal)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs text-accent-600">{fmtUSD(row.interest)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs font-semibold text-ink-900">{fmtUSD(row.total)}</td>
                        <td className="px-4 py-2.5 text-right font-mono text-xs text-ink-500">{fmtUSD(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Disclaimer */}
            <div className="flex gap-2.5 rounded-xl border border-ink-100 bg-ink-50 p-4">
              <AlertTriangle className="h-4 w-4 shrink-0 text-ink-400 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-ink-500">
                Simulación ilustrativa. Las tasas finales están sujetas a aprobación crediticia, verificación de colateral y condiciones de mercado al momento de la operación. Campo no garantiza el crédito ni actúa como entidad financiera regulada.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {tab === "products" && (
        <div className="space-y-5">
          {LOAN_PRODUCTS.map((p) => (
            <div key={p.id} className="rounded-2xl border border-ink-100 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-display text-xl font-medium text-ink-900">{p.name}</h2>
                    <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-[11px] font-semibold text-ink-600">{p.tag}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-600 max-w-xl">{p.description}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => { setSelectedProduct(p); setTab("simulator"); }}
                >
                  Simular <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-4">
                <Detail label="Monto mínimo" value={fmtUSD(p.minUSD)} />
                <Detail label="Monto máximo" value={fmtUSD(p.maxUSD)} />
                <Detail label="Plazo mín." value={`${p.minDays} días`} />
                <Detail label="Plazo máx." value={`${p.maxDays} días`} />
                <Detail label="Tasa base TNA" value={fmtPct(p.baseRateAnnual, 0)} highlight />
                <Detail label="Tasa máx. TNA" value={fmtPct(p.maxRateAnnual, 0)} />
                <Detail label="Fee plataforma" value={fmtPct(p.platformFeeRate, 1)} />
                <Detail label="Garantía" value={p.collateralRequired ? "Requerida" : "No requerida"} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── HOW TO TAB ── */}
      {tab === "howto" && (
        <div className="grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="font-display text-2xl font-medium text-ink-900 mb-1">Para el tomador del crédito</h2>
            <p className="text-sm text-ink-500 mb-6">Productores, acopios y compradores que necesitan financiamiento.</p>
            <ol className="space-y-4">
              {[
                { n: "01", t: "Elegí el producto", d: "Seleccioná el tipo de financiamiento según tu necesidad: adelanto de cosecha, crédito de compra o financiamiento de acopio." },
                { n: "02", t: "Completá tu perfil de riesgo", d: "Respondé preguntas sobre tu historial, volumen operado y la garantía que podés ofrecer. Esto determina tu tasa." },
                { n: "03", t: "Simulá la operación", d: "Ajustá monto, plazo y sistema de amortización. Ves en tiempo real la cuota, el costo total y el cronograma de pagos." },
                { n: "04", t: "Solicitá y esperá aprobación", d: "Un analista de Campo verifica el colateral y aprueba la operación en 24–48hs hábiles." },
                { n: "05", t: "Recibís los fondos", d: "Transferencia directa a tu cuenta. El capital queda en fideicomiso hasta la devolución del crédito." },
              ].map(({ n, t, d }) => (
                <li key={n} className="flex gap-4">
                  <span className="font-display text-3xl font-medium text-brand-200 shrink-0 leading-none mt-1">
                    <span className="italic text-brand-700">/</span>{n}
                  </span>
                  <div>
                    <p className="font-display text-lg font-medium text-ink-900">{t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-display text-2xl font-medium text-ink-900 mb-1">Para el oferente de fondos</h2>
            <p className="text-sm text-ink-500 mb-6">Inversores, empresas o individuos que quieren fondear operaciones agropecuarias.</p>
            <ol className="space-y-4">
              {[
                { n: "01", t: "Explorá las oportunidades", d: "Ves operaciones disponibles con su grado de riesgo (A, B, C, D), tasa ofrecida, plazo y colateral." },
                { n: "02", t: "Analizá el riesgo", d: "Cada operación incluye el scoring crediticio del tomador, tipo de garantía y ratio LTV calculado por Campo." },
                { n: "03", t: "Fondeás la operación", d: "Comprometés el capital en USD. Queda en fideicomiso hasta que se libera al tomador tras la verificación." },
                { n: "04", t: "Cobrás cuotas o bullet", d: "Según el sistema elegido, recibís pagos mensuales o el total al vencimiento, con la tasa neta acordada." },
                { n: "05", t: "Campo gestiona el cobro", d: "Si hay mora, el equipo de Campo ejecuta la garantía. El inversor tiene prioridad sobre el colateral." },
              ].map(({ n, t, d }) => (
                <li key={n} className="flex gap-4">
                  <span className="font-display text-3xl font-medium text-brand-200 shrink-0 leading-none mt-1">
                    <span className="italic text-brand-700">/</span>{n}
                  </span>
                  <div>
                    <p className="font-display text-lg font-medium text-ink-900">{t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">{d}</p>
                  </div>
                </li>
              ))}
            </ol>

            {/* Risk matrix */}
            <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-5">
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-500">Matriz de riesgo / retorno</p>
              <div className="space-y-2">
                {[
                  { level: "A", label: "Riesgo bajo", tna: "6–10%", ltv: "<40%", color: "#4f632f" },
                  { level: "B", label: "Riesgo moderado", tna: "10–14%", ltv: "40–60%", color: "#c97b55" },
                  { level: "C", label: "Riesgo alto", tna: "14–18%", ltv: "60–80%", color: "#b66240" },
                  { level: "D", label: "Riesgo muy alto", tna: "18–24%", ltv: ">80%", color: "#9b2c2c" },
                ].map(({ level, label, tna, ltv, color }) => (
                  <div key={level} className="flex items-center gap-3 rounded-lg border border-ink-100 px-4 py-3">
                    <span className="w-6 font-display text-lg font-medium" style={{ color }}>{level}</span>
                    <span className="flex-1 text-sm text-ink-700">{label}</span>
                    <span className="text-sm font-semibold text-ink-900">{tna}</span>
                    <span className="text-xs text-ink-400">LTV {ltv}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

/* ─── Small helpers ──────────────────────────────────────────────── */
function RateLine({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-600">{label}</span>
      <span className="font-semibold" style={{ color }}>{value}</span>
    </div>
  );
}

function Detail({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${highlight ? "border-brand-200 bg-brand-50/50" : "border-ink-100 bg-ink-50/40"}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-400">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${highlight ? "text-brand-700" : "text-ink-800"}`}>{value}</p>
    </div>
  );
}
