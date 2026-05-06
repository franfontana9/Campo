"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp, TrendingDown, Minus, GitCompare,
  BarChart2, Activity, RefreshCw, ChevronDown,
} from "lucide-react";
import {
  GRAIN_PRICES,
  REGIONS_AR,
  REGIONS_UY,
  RANGE_OPTIONS,
  convertPrice,
  formatCurrencyPrice,
  type Currency,
  type GrainPrice,
  type RangeOption,
  type WeekPrice,
} from "@/lib/price-data";
import { GRAIN_TYPES } from "@/lib/constants";

/* ─── Colors ─────────────────────────────────────────────────────── */
const GRAIN_COLORS: Record<string, { line: string; area: string }> = {
  soja:    { line: "#4f632f", area: "#e5ebd8" },
  maiz:    { line: "#c97b55", area: "#fbf3ee" },
  trigo:   { line: "#9b4d31", area: "#f4dfd1" },
  girasol: { line: "#b6a040", area: "#fdf8e1" },
  sorgo:   { line: "#657d3e", area: "#edf3e0" },
  cebada:  { line: "#7c6b3d", area: "#f5f0e4" },
  avena:   { line: "#3d6e7c", area: "#e0f0f5" },
  arroz:   { line: "#5c7c6b", area: "#e0f5ec" },
};
function gc(grain: string) { return GRAIN_COLORS[grain] ?? { line: "#4f632f", area: "#e5ebd8" }; }

/* ─── Sparkline ──────────────────────────────────────────────────── */
function Sparkline({ values, up }: { values: number[]; up: boolean }) {
  const min = Math.min(...values), max = Math.max(...values), range = max - min || 1;
  const W = 72, H = 28;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const color = up ? "#4f632f" : "#b66240";
  const lastY = H - ((values[values.length - 1] - min) / range) * (H - 4) - 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={W} cy={lastY.toFixed(1)} r="3" fill={color} />
    </svg>
  );
}

/* ─── Price + Area chart ─────────────────────────────────────────── */
type Series = { label: string; vals: number[]; color: string; areaColor: string; dashed?: boolean };

function PriceChart({
  primary, compare, currency, windowSize, showPctChange, labels,
}: {
  primary: Series; compare?: Series; currency: Currency;
  windowSize: number; showPctChange: boolean; labels: string[];
}) {
  const W = 640, H = 210, PAD = { top: 24, right: 20, bottom: 40, left: 72 };
  const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom;

  function toDisplay(s: number[]): number[] {
    if (!showPctChange) return s;
    const base = s[0] || 1;
    return s.map(v => ((v - base) / base) * 100);
  }

  const pVals = toDisplay(primary.vals);
  const cVals = compare ? toDisplay(compare.vals) : undefined;
  const allVals = [...pVals, ...(cVals ?? [])];
  const gMin = Math.min(...allVals), gMax = Math.max(...allVals), gRange = gMax - gMin || 1;

  function toY(v: number) { return PAD.top + cH - ((v - gMin) / gRange) * cH; }
  function toX(i: number, total: number) { return PAD.left + (i / (total - 1)) * cW; }
  function buildPts(vals: number[]) {
    return vals.map((v, i) => `${toX(i, vals.length).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  }
  function buildArea(vals: number[]) {
    const aB = PAD.top + cH;
    const fX = toX(0, vals.length).toFixed(1);
    const lX = toX(vals.length - 1, vals.length).toFixed(1);
    const mid = buildPts(vals).split(" ").slice(1).map(p => `L${p}`).join(" ");
    return `M${fX},${toY(vals[0]).toFixed(1)} ${mid} L${lX},${aB} L${fX},${aB} Z`;
  }

  const ticks = 5;
  const yTickVals = Array.from({ length: ticks + 1 }, (_, i) => gMin + (gRange / ticks) * i);
  const step = windowSize <= 12 ? 1 : windowSize <= 26 ? 2 : 4;

  function fmtY(v: number) {
    if (showPctChange) return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
    if (currency === "ARS") return `$${(v / 1000).toFixed(0)}k`;
    if (currency === "UYU") return `$U${v.toFixed(0)}`;
    return `${v.toFixed(0)}`;
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[340px]" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={primary.areaColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor={primary.areaColor} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTickVals.map((v, i) => (
          <line key={i} x1={PAD.left} y1={toY(v).toFixed(1)} x2={PAD.left + cW} y2={toY(v).toFixed(1)}
            stroke="#ececd9" strokeWidth="1" />
        ))}

        {/* Zero line */}
        {showPctChange && gMin < 0 && gMax > 0 && (
          <line x1={PAD.left} y1={toY(0).toFixed(1)} x2={PAD.left + cW} y2={toY(0).toFixed(1)}
            stroke="#b4b49c" strokeWidth="1" strokeDasharray="4,3" />
        )}

        {/* Compare series */}
        {cVals && compare && (
          <>
            <path d={buildArea(cVals)} fill={compare.areaColor} opacity="0.2" />
            <polyline points={buildPts(cVals)} fill="none" stroke={compare.color}
              strokeWidth="1.5" strokeDasharray="5,3" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {/* Primary area gradient + line */}
        <path d={buildArea(pVals)} fill="url(#areaGrad)" />
        <polyline points={buildPts(pVals)} fill="none" stroke={primary.color}
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Last point marker */}
        <circle
          cx={toX(pVals.length - 1, pVals.length).toFixed(1)}
          cy={toY(pVals[pVals.length - 1]).toFixed(1)}
          r="4" fill={primary.color} stroke="white" strokeWidth="2" />

        {/* Y axis labels */}
        {yTickVals.map((v, i) => (
          <text key={i} x={PAD.left - 8} y={toY(v).toFixed(1)}
            textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#8a8a74">
            {fmtY(v)}
          </text>
        ))}

        {/* X axis labels */}
        {labels.map((lbl, i) => {
          if (i % step !== 0 && i !== labels.length - 1) return null;
          return (
            <text key={i} x={toX(i, labels.length).toFixed(1)} y={H - 10}
              textAnchor="middle" fontSize="10" fill="#8a8a74">
              {lbl}
            </text>
          );
        })}

        {/* Legend */}
        {cVals && compare && (
          <>
            <rect x={PAD.left} y={8} width="10" height="3" rx="1" fill={primary.color} />
            <text x={PAD.left + 14} y={12} fontSize="10" fill="#4d4d42">{primary.label}</text>
            <rect x={PAD.left + 90} y={8} width="10" height="3" rx="1" fill={compare.color} />
            <text x={PAD.left + 104} y={12} fontSize="10" fill="#4d4d42">{compare.label}</text>
          </>
        )}
      </svg>
    </div>
  );
}

/* ─── Volume bar chart ───────────────────────────────────────────── */
function VolumeChart({ history, color }: { history: WeekPrice[]; color: string }) {
  const W = 640, H = 100, PAD = { top: 8, right: 20, bottom: 24, left: 72 };
  const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom;
  const maxVol = Math.max(...history.map(h => h.volume));
  const step = cW / history.length;
  const barW = Math.max(2, step - 2);
  const windowSize = history.length;
  const labelStep = windowSize <= 12 ? 1 : windowSize <= 26 ? 2 : 4;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[340px]" preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        {[0.5, 1].map((f, i) => {
          const y = PAD.top + cH - f * cH;
          return <line key={i} x1={PAD.left} y1={y} x2={PAD.left + cW} y2={y} stroke="#ececd9" strokeWidth="1" />;
        })}

        {/* Y label */}
        <text x={PAD.left - 8} y={PAD.top + 4} textAnchor="end" fontSize="10" fill="#8a8a74">
          {(maxVol / 1000).toFixed(0)}k t
        </text>
        <text x={PAD.left - 8} y={PAD.top + cH / 2} textAnchor="end" dominantBaseline="middle" fontSize="10" fill="#8a8a74">
          {(maxVol / 2000).toFixed(0)}k t
        </text>

        {history.map((h, i) => {
          const bH = (h.volume / maxVol) * cH;
          const x = PAD.left + i * step + (step - barW) / 2;
          const y = PAD.top + cH - bH;
          return (
            <rect key={i} x={x} y={y} width={barW} height={bH}
              fill={color} opacity="0.65" rx="1">
              <title>{h.label}: {h.volume.toLocaleString("es-AR")} t</title>
            </rect>
          );
        })}

        {/* X labels */}
        {history.map((h, i) => {
          if (i % labelStep !== 0 && i !== history.length - 1) return null;
          return (
            <text key={i} x={PAD.left + i * step + step / 2} y={H - 4}
              textAnchor="middle" fontSize="10" fill="#8a8a74">
              {h.week}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Orders chart ───────────────────────────────────────────────── */
function OrdersChart({ history, color }: { history: WeekPrice[]; color: string }) {
  const W = 640, H = 90, PAD = { top: 8, right: 20, bottom: 24, left: 72 };
  const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom;
  const maxO = Math.max(...history.map(h => h.orders));
  const minO = Math.min(...history.map(h => h.orders));
  const range = maxO - minO || 1;

  function toX(i: number) { return PAD.left + (i / (history.length - 1)) * cW; }
  function toY(v: number) { return PAD.top + cH - ((v - minO) / range) * cH; }

  const pts = history.map((h, i) => `${toX(i).toFixed(1)},${toY(h.orders).toFixed(1)}`).join(" ");
  const area = `M${toX(0).toFixed(1)},${toY(history[0].orders).toFixed(1)} ` +
    history.slice(1).map((h, i) => `L${toX(i + 1).toFixed(1)},${toY(h.orders).toFixed(1)}`).join(" ") +
    ` L${toX(history.length - 1).toFixed(1)},${PAD.top + cH} L${toX(0).toFixed(1)},${PAD.top + cH} Z`;

  const windowSize = history.length;
  const labelStep = windowSize <= 12 ? 1 : windowSize <= 26 ? 2 : 4;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[340px]" preserveAspectRatio="xMidYMid meet">
        <text x={PAD.left - 8} y={PAD.top + 4} textAnchor="end" fontSize="10" fill="#8a8a74">{maxO}</text>
        <text x={PAD.left - 8} y={PAD.top + cH} textAnchor="end" dominantBaseline="auto" fontSize="10" fill="#8a8a74">{minO}</text>

        <path d={area} fill={color} opacity="0.12" />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {history.map((h, i) => {
          if (i % labelStep !== 0 && i !== history.length - 1) return null;
          return (
            <text key={i} x={toX(i).toFixed(1)} y={H - 4}
              textAnchor="middle" fontSize="10" fill="#8a8a74">
              {h.week}
            </text>
          );
        })}
        <circle cx={toX(history.length - 1).toFixed(1)} cy={toY(history[history.length - 1].orders).toFixed(1)}
          r="3.5" fill={color} stroke="white" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

/* ─── Trend analysis mini stats ─────────────────────────────────── */
function trendStats(history: WeekPrice[]) {
  const vals = history.map(h => h.usd);
  const n = vals.length;
  if (n < 2) return { slope: 0, r2: 0, maxDrawdown: 0, avgWeeklyChange: 0, volatility: 0 };

  // Linear regression slope (weekly $ change)
  const xMean = (n - 1) / 2;
  const yMean = vals.reduce((a, b) => a + b, 0) / n;
  let ssxy = 0, ssxx = 0;
  for (let i = 0; i < n; i++) { ssxy += (i - xMean) * (vals[i] - yMean); ssxx += (i - xMean) ** 2; }
  const slope = ssxy / ssxx;

  // R²
  const residuals = vals.map((v, i) => v - (yMean + slope * (i - xMean)));
  const ssTot = vals.map(v => (v - yMean) ** 2).reduce((a, b) => a + b, 0);
  const ssRes = residuals.map(r => r ** 2).reduce((a, b) => a + b, 0);
  const r2 = 1 - ssRes / (ssTot || 1);

  // Max drawdown
  let peak = vals[0], maxDD = 0;
  for (const v of vals) { if (v > peak) peak = v; const dd = (peak - v) / peak; if (dd > maxDD) maxDD = dd; }

  // Avg weekly change %
  const weeklyChanges = vals.slice(1).map((v, i) => (v - vals[i]) / vals[i]);
  const avgWeeklyChange = weeklyChanges.reduce((a, b) => a + b, 0) / weeklyChanges.length;

  // Volatility (std of weekly changes)
  const mean = avgWeeklyChange;
  const variance = weeklyChanges.map(c => (c - mean) ** 2).reduce((a, b) => a + b, 0) / weeklyChanges.length;
  const volatility = Math.sqrt(variance);

  return { slope, r2, maxDrawdown: maxDD, avgWeeklyChange, volatility };
}

/* ─── Heatmap row ────────────────────────────────────────────────── */
function HeatmapRow({ grain, history }: { grain: GrainPrice; history: WeekPrice[] }) {
  const monthlyBuckets: number[][] = [];
  for (let i = 0; i < history.length; i++) {
    const approxMonth = Math.floor(i / 4.3);
    if (!monthlyBuckets[approxMonth]) monthlyBuckets[approxMonth] = [];
    monthlyBuckets[approxMonth].push(history[i].usd);
  }
  const monthlyAvgs = monthlyBuckets.filter(b => b && b.length).map(b => b.reduce((a, c) => a + c, 0) / b.length);
  const min = Math.min(...monthlyAvgs), max = Math.max(...monthlyAvgs), range = max - min || 1;
  const color = gc(grain.grain).line;

  return (
    <div className="flex items-center gap-2">
      <span className="w-14 shrink-0 text-xs text-ink-600">{grain.label}</span>
      <div className="flex flex-1 gap-0.5">
        {monthlyAvgs.map((avg, i) => {
          const intensity = (avg - min) / range;
          return (
            <div key={i} title={`USD ${avg.toFixed(1)}`}
              className="h-5 flex-1 rounded-sm transition-opacity"
              style={{ backgroundColor: color, opacity: 0.15 + intensity * 0.85 }} />
          );
        })}
      </div>
    </div>
  );
}

/* ─── Summary card ───────────────────────────────────────────────── */
function SummaryCard({
  label, value, sub, up, neutral,
}: { label: string; value: string; sub?: string; up?: boolean; neutral?: boolean }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-ink-500">{label}</p>
      <p className={`mt-2 font-display text-2xl font-medium tracking-tight ${neutral ? "text-ink-900" : up ? "text-brand-700" : "text-accent-600"}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-ink-400">{sub}</p>}
    </div>
  );
}

/* ─── Main component ─────────────────────────────────────────────── */
export function PricesClient() {
  const [currency, setCurrency]           = useState<Currency>("USD");
  const [grainFilter, setGrainFilter]     = useState("all");
  const [regionFilter, setRegionFilter]   = useState("all");
  const [selectedGrain, setSelectedGrain] = useState<GrainPrice>(GRAIN_PRICES[0]);
  const [windowSize, setWindowSize]       = useState<RangeOption>(12);
  const [compareGrain, setCompareGrain]   = useState("none");
  const [comparePrev, setComparePrev]     = useState(false);
  const [showPct, setShowPct]             = useState(false);
  const [chartTab, setChartTab]           = useState<"price" | "volume" | "orders" | "trend">("price");

  const filtered = useMemo(() =>
    GRAIN_PRICES.filter(g => {
      if (grainFilter !== "all" && g.grain !== grainFilter) return false;
      if (regionFilter !== "all" && g.region !== regionFilter) return false;
      return true;
    }), [grainFilter, regionFilter]);

  const primaryHistory = useMemo(() => selectedGrain.history.slice(-windowSize), [selectedGrain, windowSize]);
  const prevHistory    = useMemo(() => {
    const total = selectedGrain.history.length;
    const start = Math.max(0, total - windowSize * 2);
    return selectedGrain.history.slice(start, total - windowSize);
  }, [selectedGrain, windowSize]);

  const compareGrainData = useMemo(() => GRAIN_PRICES.find(g => g.grain === compareGrain), [compareGrain]);
  const compareHistory   = useMemo(() => compareGrainData?.history.slice(-windowSize) ?? [], [compareGrainData, windowSize]);

  const primaryColors  = gc(selectedGrain.grain);
  const compareColors  = compareGrainData ? gc(compareGrainData.grain) : null;
  const primaryLabels  = primaryHistory.map(h => h.week);

  const last    = primaryHistory[primaryHistory.length - 1]?.usd ?? 0;
  const first   = primaryHistory[0]?.usd ?? 0;
  const pctChange = first ? (((last - first) / first) * 100).toFixed(1) : "0";
  const pctUp   = last >= first;

  const stats = useMemo(() => trendStats(primaryHistory), [primaryHistory]);

  // Market overview stats (all grains, last week)
  const mktUp      = GRAIN_PRICES.filter(g => g.lastUSD >= g.prevUSD).length;
  const mktDown    = GRAIN_PRICES.filter(g => g.lastUSD < g.prevUSD).length;
  const totalVol   = GRAIN_PRICES.reduce((s, g) => s + (g.history[g.history.length - 1]?.volume ?? 0), 0);
  const totalOrders= GRAIN_PRICES.reduce((s, g) => s + (g.history[g.history.length - 1]?.orders ?? 0), 0);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 py-12 lg:px-10">

      {/* ── Header ── */}
      <header className="mb-10 border-b border-ink-100 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Mercado</p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-ink-900 md:text-6xl">
          Precios <em className="text-brand-700">por grano</em>.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-600">
          Dashboard financiero de granos y semillas. Precios de referencia pizarra Rosario / Buenos Aires, actualización semanal.
        </p>

        {/* Currency toggle */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-ink-200 bg-white p-1 text-sm">
            {(["USD", "ARS", "UYU"] as Currency[]).map(c => (
              <button key={c} onClick={() => setCurrency(c)}
                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${currency === c ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"}`}>
                {c}
              </button>
            ))}
          </div>
          {currency !== "USD" && (
            <span className="text-xs text-ink-400">
              1 USD = {currency === "ARS" ? "1.285 ARS" : "43,2 UYU"}
            </span>
          )}
        </div>
      </header>

      {/* ── Market overview strip ── */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Granos al alza"
          value={`${mktUp} de ${GRAIN_PRICES.length}`}
          sub="vs. semana anterior"
          up={mktUp >= mktDown}
          neutral={false}
        />
        <SummaryCard
          label="Granos a la baja"
          value={`${mktDown} de ${GRAIN_PRICES.length}`}
          sub="vs. semana anterior"
          up={false}
          neutral={mktDown === 0}
        />
        <SummaryCard
          label="Volumen total sem."
          value={`${(totalVol / 1000).toFixed(0)}k t`}
          sub="suma de todas las especies"
          neutral
        />
        <SummaryCard
          label="Órdenes activas sem."
          value={`${totalOrders}`}
          sub="suma de todas las especies"
          neutral
        />
      </div>

      {/* ── Filters + Price table ── */}
      <div className="mb-5 space-y-3">
        {/* Grano: chips horizontales */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            Grano
          </span>
          <div className="flex flex-wrap gap-1.5">
            <FilterChip
              active={grainFilter === "all"}
              onClick={() => setGrainFilter("all")}
            >
              Todos
            </FilterChip>
            {GRAIN_TYPES.map((g) => (
              <FilterChip
                key={g.value}
                active={grainFilter === g.value}
                onClick={() => setGrainFilter(g.value)}
              >
                {g.label}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Región: select compacto + hint */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            Región
          </span>
          <div className="relative">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="h-8 appearance-none rounded-full border border-ink-200 bg-white pl-3.5 pr-9 text-xs font-medium text-ink-700 transition-colors hover:border-brand-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/10"
            >
              <option value="all">Todas las regiones</option>
              <optgroup label="Argentina">
                {REGIONS_AR.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Uruguay">
                {REGIONS_UY.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-400"
            />
          </div>
          <span className="ml-auto hidden text-xs text-ink-400 sm:inline">
            Hacé clic en un grano para ver el análisis detallado ↓
          </span>
        </div>
      </div>

      {(() => {
        const maxVol = Math.max(...filtered.map(g => g.history[g.history.length - 1]?.volume ?? 0));
        return (
          <div className="mb-10 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_160px_90px_200px_130px_88px] border-b border-ink-100 bg-ink-50/70 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-500">
              <span>Grano · Mercado</span>
              <span className="text-right">Precio · Δ sem.</span>
              <span className="text-center">Var.</span>
              <span className="pl-2">Rango 4 semanas</span>
              <span className="pl-2">Volumen sem.</span>
              <span className="text-right">4 sem.</span>
            </div>

            {filtered.length === 0 && (
              <div className="px-6 py-14 text-center text-sm text-ink-500">
                No hay datos para los filtros seleccionados.
              </div>
            )}

            {filtered.map(g => {
              const last4  = g.history.slice(-4);
              const last12 = g.history.slice(-12);
              const lv     = convertPrice(g.lastUSD, currency);
              const pv     = convertPrice(g.prevUSD, currency);
              const diff   = lv - pv;
              const pct    = ((diff / pv) * 100).toFixed(2);
              const up     = diff >= 0;
              const flat   = Math.abs(diff) < 0.5;
              const col    = gc(g.grain);
              const isSelected = selectedGrain.grain === g.grain;

              // 4-week range
              const w4prices = last4.map(h => convertPrice(h.usd, currency));
              const wHigh = Math.max(...w4prices);
              const wLow  = Math.min(...w4prices);
              const wRange = wHigh - wLow || 1;
              const wPos  = Math.max(0, Math.min(1, (lv - wLow) / wRange));

              // Volume
              const lastWeekVol = g.history[g.history.length - 1]?.volume ?? 0;
              const volPct = maxVol > 0 ? lastWeekVol / maxVol : 0;
              const totalValue = lastWeekVol * g.lastUSD; // USD

              // % badge color
              const badgeBg  = flat ? "#f0f0e8" : up ? "#e8f0dc" : "#fbe8df";
              const badgeCol = flat ? "#8a8a74" : up ? "#4f632f" : "#b66240";

              return (
                <button
                  key={g.grain}
                  onClick={() => setSelectedGrain(g)}
                  className={`group grid w-full grid-cols-[1fr_160px_90px_200px_130px_88px] items-center border-b border-ink-100 px-6 py-[14px] text-left transition-all last:border-0 hover:bg-brand-50/25 ${isSelected ? "bg-brand-50/50" : ""}`}
                >
                  {/* Left accent bar for selected */}
                  <div className={`col-span-6 -mx-6 mb-[-14px] mt-[-14px] grid grid-cols-[1fr_160px_90px_200px_130px_88px] items-center px-6 py-[14px] transition-all ${isSelected ? "border-l-[3px]" : "border-l-[3px] border-l-transparent"}`}
                    style={isSelected ? { borderLeftColor: col.line } : {}}>
                    {/* Grain name */}
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full transition-transform group-hover:scale-110"
                        style={{ backgroundColor: col.line }} />
                      <div>
                        <p className="font-semibold text-ink-900">{g.label}</p>
                        <p className="text-xs text-ink-400">{g.region} · {g.grain === "avena" ? "UY" : "AR"}</p>
                      </div>
                    </div>

                    {/* Price + absolute delta */}
                    <div className="text-right">
                      <p className="font-display text-lg font-semibold leading-tight text-ink-900">
                        {formatCurrencyPrice(lv, currency)}
                      </p>
                      <p className={`text-xs font-medium ${flat ? "text-ink-400" : up ? "text-brand-700" : "text-accent-600"}`}>
                        {flat ? "—" : `${up ? "+" : ""}${currency === "USD" ? diff.toFixed(1) : Math.round(diff)} ${currency}`}
                      </p>
                    </div>

                    {/* % badge */}
                    <div className="flex justify-center">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold"
                        style={{ backgroundColor: badgeBg, color: badgeCol }}>
                        {flat ? <Minus className="h-3 w-3" /> : up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {up && !flat ? "+" : ""}{pct}%
                      </span>
                    </div>

                    {/* Range bar */}
                    <div className="pl-2">
                      <div className="relative h-1.5 w-full rounded-full bg-ink-100">
                        {/* Fill from low to current */}
                        <div className="absolute left-0 top-0 h-full rounded-full"
                          style={{ width: `${wPos * 100}%`, backgroundColor: col.line, opacity: 0.45 }} />
                        {/* Current marker */}
                        <div className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
                          style={{ left: `${wPos * 100}%`, backgroundColor: col.line }} />
                      </div>
                      <div className="mt-1.5 flex justify-between text-[10px] text-ink-400">
                        <span>{formatCurrencyPrice(wLow, currency)}</span>
                        <span className="text-ink-500 font-medium">{formatCurrencyPrice(lv, currency)}</span>
                        <span>{formatCurrencyPrice(wHigh, currency)}</span>
                      </div>
                    </div>

                    {/* Volume bar + value */}
                    <div className="pl-2">
                      <div className="relative h-1.5 w-full rounded-full bg-ink-100">
                        <div className="absolute left-0 top-0 h-full rounded-full"
                          style={{ width: `${volPct * 100}%`, backgroundColor: col.line, opacity: 0.7 }} />
                      </div>
                      <div className="mt-1.5 flex justify-between text-[10px]">
                        <span className="text-ink-700 font-medium">{(lastWeekVol / 1000).toFixed(1)}k t</span>
                        <span className="text-ink-400">≈ USD {(totalValue / 1_000_000).toFixed(1)}M</span>
                      </div>
                    </div>

                    {/* Sparkline */}
                    <div className="flex justify-end">
                      <Sparkline values={last12.map(h => h.usd)} up={up} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* ── Detail chart panel ── */}
      <div className="rounded-2xl border border-ink-100 bg-white shadow-sm">

        {/* Panel header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: primaryColors.line }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">Análisis de mercado</p>
              <h2 className="mt-0.5 font-display text-2xl font-medium text-ink-900">
                {selectedGrain.label}
                <span className="ml-2 text-ink-300">·</span>
                <span className="ml-2 text-base font-normal text-ink-500">{selectedGrain.region}</span>
              </h2>
            </div>
          </div>
          <div className="flex items-end gap-6">
            <div className="text-right">
              <p className="text-xs text-ink-400">Precio actual</p>
              <p className="font-display text-2xl font-medium text-ink-900">
                {formatCurrencyPrice(convertPrice(selectedGrain.lastUSD, currency), currency)}
                <span className="ml-1 text-xs font-normal text-ink-400">/ t</span>
              </p>
              <p className={`mt-0.5 text-xs font-semibold ${pctUp ? "text-brand-700" : "text-accent-600"}`}>
                {pctUp ? "▲" : "▼"} {pctUp ? "+" : ""}{pctChange}% en el período
              </p>
            </div>
          </div>
        </div>

        {/* Chart controls */}
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 px-6 py-3">
          {/* Range */}
          <div className="flex items-center gap-0.5 rounded-lg border border-ink-200 bg-ink-50 p-0.5 text-xs">
            {RANGE_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setWindowSize(opt.value as RangeOption)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${windowSize === opt.value ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"}`}>
                {opt.label}
              </button>
            ))}
          </div>

          {/* Chart type tabs */}
          <div className="flex items-center gap-0.5 rounded-lg border border-ink-200 bg-ink-50 p-0.5 text-xs">
            {([
              { id: "price",  icon: <Activity className="h-3.5 w-3.5" />, label: "Precio" },
              { id: "volume", icon: <BarChart2 className="h-3.5 w-3.5" />, label: "Volumen" },
              { id: "orders", icon: <RefreshCw className="h-3.5 w-3.5" />, label: "Órdenes" },
              { id: "trend",  icon: <TrendingUp className="h-3.5 w-3.5" />, label: "Tendencia" },
            ] as const).map(({ id, icon, label }) => (
              <button key={id} onClick={() => setChartTab(id)}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 font-medium transition-colors ${chartTab === id ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"}`}>
                {icon}{label}
              </button>
            ))}
          </div>

          {/* Price chart extras */}
          {chartTab === "price" && (
            <>
              <button onClick={() => setShowPct(!showPct)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${showPct ? "border-brand-600 bg-brand-700 text-white" : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"}`}>
                <GitCompare className="h-3.5 w-3.5" />% cambio
              </button>
              <button onClick={() => { setComparePrev(!comparePrev); if (!comparePrev) setCompareGrain("none"); }}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${comparePrev ? "border-accent-600 bg-accent-600 text-white" : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"}`}>
                vs. período anterior
              </button>
              {!comparePrev && (
                <select value={compareGrain} onChange={e => setCompareGrain(e.target.value)}
                  className="select-campo h-8 rounded-lg border border-ink-200 bg-white px-2 pr-7 text-xs text-ink-800">
                  <option value="none">Comparar con…</option>
                  {GRAIN_PRICES.filter(g => g.grain !== selectedGrain.grain).map(g => (
                    <option key={g.grain} value={g.grain}>{g.label}</option>
                  ))}
                </select>
              )}
            </>
          )}
        </div>

        {/* Chart body */}
        <div className="px-6 py-5">

          {chartTab === "price" && (
            <PriceChart
              currency={currency}
              windowSize={windowSize}
              showPctChange={showPct}
              labels={comparePrev ? primaryHistory.map((_, i) => `Sem. ${i + 1}`) : primaryLabels}
              primary={{
                label: selectedGrain.label,
                vals: primaryHistory.map(h => convertPrice(h.usd, currency)),
                color: primaryColors.line,
                areaColor: primaryColors.area,
              }}
              compare={
                comparePrev
                  ? { label: "Período anterior", vals: prevHistory.map(h => convertPrice(h.usd, currency)), color: "#8a8a74", areaColor: "#ececd9", dashed: true }
                  : compareGrain !== "none" && compareGrainData && compareColors
                  ? { label: compareGrainData.label, vals: compareHistory.map(h => convertPrice(h.usd, currency)), color: compareColors.line, areaColor: compareColors.area, dashed: true }
                  : undefined
              }
            />
          )}

          {chartTab === "volume" && (
            <div>
              <p className="mb-3 text-xs text-ink-500">Volumen operado por semana (toneladas) — {selectedGrain.label}</p>
              <VolumeChart history={primaryHistory} color={primaryColors.line} />
              <div className="mt-4 flex gap-6 text-xs text-ink-500">
                <span>Prom. sem.: <strong className="text-ink-800">{(primaryHistory.reduce((s, h) => s + h.volume, 0) / primaryHistory.length / 1000).toFixed(1)}k t</strong></span>
                <span>Máx.: <strong className="text-ink-800">{(Math.max(...primaryHistory.map(h => h.volume)) / 1000).toFixed(1)}k t</strong></span>
                <span>Mín.: <strong className="text-ink-800">{(Math.min(...primaryHistory.map(h => h.volume)) / 1000).toFixed(1)}k t</strong></span>
              </div>
            </div>
          )}

          {chartTab === "orders" && (
            <div>
              <p className="mb-3 text-xs text-ink-500">Cantidad de órdenes activas por semana — {selectedGrain.label}</p>
              <OrdersChart history={primaryHistory} color={primaryColors.line} />
              <div className="mt-4 flex gap-6 text-xs text-ink-500">
                <span>Prom. sem.: <strong className="text-ink-800">{(primaryHistory.reduce((s, h) => s + h.orders, 0) / primaryHistory.length).toFixed(0)} órdenes</strong></span>
                <span>Máx.: <strong className="text-ink-800">{Math.max(...primaryHistory.map(h => h.orders))} órdenes</strong></span>
                <span>Mín.: <strong className="text-ink-800">{Math.min(...primaryHistory.map(h => h.orders))} órdenes</strong></span>
              </div>
            </div>
          )}

          {chartTab === "trend" && (
            <div className="space-y-6">
              {/* Trend stats grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-ink-100 bg-ink-50/50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-500">Tendencia semanal</p>
                  <p className={`mt-2 font-display text-xl font-medium ${stats.slope >= 0 ? "text-brand-700" : "text-accent-600"}`}>
                    {stats.slope >= 0 ? "+" : ""}{stats.slope.toFixed(2)} USD/sem
                  </p>
                  <p className="mt-1 text-xs text-ink-400">Pendiente regresión lineal</p>
                </div>
                <div className="rounded-xl border border-ink-100 bg-ink-50/50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-500">Ajuste R²</p>
                  <p className="mt-2 font-display text-xl font-medium text-ink-900">{(stats.r2 * 100).toFixed(1)}%</p>
                  <p className="mt-1 text-xs text-ink-400">Qué tan lineal es la tendencia</p>
                </div>
                <div className="rounded-xl border border-ink-100 bg-ink-50/50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-500">Máx. drawdown</p>
                  <p className="mt-2 font-display text-xl font-medium text-accent-600">
                    -{(stats.maxDrawdown * 100).toFixed(1)}%
                  </p>
                  <p className="mt-1 text-xs text-ink-400">Mayor caída desde un pico</p>
                </div>
                <div className="rounded-xl border border-ink-100 bg-ink-50/50 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-500">Volatilidad sem.</p>
                  <p className="mt-2 font-display text-xl font-medium text-ink-900">
                    {(stats.volatility * 100).toFixed(2)}%
                  </p>
                  <p className="mt-1 text-xs text-ink-400">Desv. estándar cambios sem.</p>
                </div>
              </div>

              {/* Trend signal */}
              <div className={`flex items-start gap-4 rounded-xl border p-4 ${
                stats.slope >= 0.5 ? "border-brand-200 bg-brand-50/50"
                : stats.slope <= -0.5 ? "border-red-200 bg-red-50/40"
                : "border-ink-100 bg-ink-50/50"
              }`}>
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  stats.slope >= 0.5 ? "bg-brand-100 text-brand-700"
                  : stats.slope <= -0.5 ? "bg-red-100 text-red-600"
                  : "bg-ink-100 text-ink-500"
                }`}>
                  {stats.slope >= 0.5 ? <TrendingUp className="h-4 w-4" /> : stats.slope <= -0.5 ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium text-ink-900">
                    {stats.slope >= 0.5 ? "Tendencia alcista confirmada"
                     : stats.slope <= -0.5 ? "Tendencia bajista confirmada"
                     : "Mercado lateral / sin tendencia clara"}
                  </p>
                  <p className="mt-1 text-sm text-ink-500">
                    {stats.slope >= 0.5
                      ? `El precio sube ${stats.slope.toFixed(2)} USD por semana en promedio (R²: ${(stats.r2 * 100).toFixed(0)}%). La volatilidad es ${stats.volatility < 0.02 ? "baja" : stats.volatility < 0.04 ? "moderada" : "alta"}.`
                      : stats.slope <= -0.5
                      ? `El precio cae ${Math.abs(stats.slope).toFixed(2)} USD por semana en promedio. Drawdown máximo del período: ${(stats.maxDrawdown * 100).toFixed(1)}%.`
                      : `El precio oscila sin dirección definida. Volatilidad semanal: ${(stats.volatility * 100).toFixed(2)}%. Considerá ampliar el rango de análisis.`}
                  </p>
                </div>
              </div>

              {/* Heatmap — all grains */}
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                  Mapa de calor mensual — últimas 52 semanas (intensidad = precio relativo)
                </p>
                <div className="space-y-1.5">
                  {GRAIN_PRICES.map(g => (
                    <HeatmapRow key={g.grain} grain={g} history={g.history} />
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-ink-400">
                  <span className="inline-block h-2.5 w-6 rounded-sm bg-[#4f632f] opacity-20" />
                  <span>Precio mínimo</span>
                  <span className="ml-3 inline-block h-2.5 w-6 rounded-sm bg-[#4f632f] opacity-100" />
                  <span>Precio máximo</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-ink-100 px-6 py-3 text-[11px] text-ink-400">
          Precios de referencia pizarra Rosario / Buenos Aires. Datos ilustrativos, actualización semanal.
          {currency !== "USD" && ` Tipo de cambio referencia: 1 USD = ${currency === "ARS" ? "1.285 ARS" : "43,2 UYU"}.`}
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-brand-700 bg-brand-700 text-white shadow-sm"
          : "border-ink-200 bg-white text-ink-700 hover:border-brand-400 hover:bg-brand-50/40 hover:text-ink-900"
      }`}
    >
      {children}
    </button>
  );
}
