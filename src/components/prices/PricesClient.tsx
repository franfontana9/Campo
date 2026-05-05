"use client";

import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, GitCompare } from "lucide-react";
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
} from "@/lib/price-data";
import { GRAIN_TYPES } from "@/lib/constants";

/* ─── Sparkline ──────────────────────────────────────────────────── */
function Sparkline({ values, up }: { values: number[]; up: boolean }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 72, H = 28;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = H - ((v - min) / range) * (H - 4) - 2;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const color = up ? "#4f632f" : "#b66240";
  const lastY = H - ((values[values.length - 1] - min) / range) * (H - 4) - 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={W} cy={lastY.toFixed(1)} r="3" fill={color} />
    </svg>
  );
}

/* ─── Trend Chart ────────────────────────────────────────────────── */
type Series = { label: string; vals: number[]; color: string; areaColor: string; dashed?: boolean };

function TrendChart({
  primary,
  compare,
  currency,
  windowSize,
  showPctChange,
  labels,
}: {
  primary: Series;
  compare?: Series;
  currency: Currency;
  windowSize: number;
  showPctChange: boolean;
  labels: string[];
}) {
  const W = 640, H = 200, PAD = { top: 20, right: 20, bottom: 40, left: 68 };
  const cW = W - PAD.left - PAD.right;
  const cH = H - PAD.top - PAD.bottom;

  /* Normalise to % change from first value */
  function toDisplay(series: number[]): number[] {
    if (!showPctChange) return series;
    const base = series[0] || 1;
    return series.map((v) => ((v - base) / base) * 100);
  }

  const pVals = toDisplay(primary.vals);
  const cVals = compare ? toDisplay(compare.vals) : undefined;

  const allVals = [...pVals, ...(cVals ?? [])];
  const gMin = Math.min(...allVals);
  const gMax = Math.max(...allVals);
  const gRange = gMax - gMin || 1;

  function toY(v: number) {
    return PAD.top + cH - ((v - gMin) / gRange) * cH;
  }
  function toX(i: number, total: number) {
    return PAD.left + (i / (total - 1)) * cW;
  }

  function buildPts(vals: number[]) {
    return vals.map((v, i) => `${toX(i, vals.length).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  }

  function buildArea(vals: number[]) {
    const pts = buildPts(vals);
    const aB = PAD.top + cH;
    const fX = toX(0, vals.length).toFixed(1);
    const lX = toX(vals.length - 1, vals.length).toFixed(1);
    return `M${fX},${toY(vals[0]).toFixed(1)} ${pts.split(" ").slice(1).map((p) => `L${p}`).join(" ")} L${lX},${aB} L${fX},${aB} Z`;
  }

  const ticks = 4;
  const yTickVals = Array.from({ length: ticks + 1 }, (_, i) => gMin + (gRange / ticks) * i);

  /* X label density — show fewer labels when many data points */
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
        {/* Grid */}
        {yTickVals.map((v, i) => (
          <line key={i} x1={PAD.left} y1={toY(v).toFixed(1)} x2={PAD.left + cW} y2={toY(v).toFixed(1)} stroke="#ececd9" strokeWidth="1" />
        ))}

        {/* Zero line for pct change */}
        {showPctChange && gMin < 0 && gMax > 0 && (
          <line x1={PAD.left} y1={toY(0).toFixed(1)} x2={PAD.left + cW} y2={toY(0).toFixed(1)} stroke="#b4b49c" strokeWidth="1" strokeDasharray="4,3" />
        )}

        {/* Compare series (behind) */}
        {cVals && compare && (
          <>
            <path d={buildArea(cVals)} fill={compare.areaColor} opacity="0.3" />
            <polyline points={buildPts(cVals)} fill="none" stroke={compare.color} strokeWidth="2" strokeDasharray="5,3" strokeLinecap="round" strokeLinejoin="round" />
          </>
        )}

        {/* Primary area + line */}
        <path d={buildArea(pVals)} fill={primary.areaColor} opacity="0.45" />
        <polyline points={buildPts(pVals)} fill="none" stroke={primary.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points — primary */}
        {pVals.map((v, i) => (
          <circle key={i} cx={toX(i, pVals.length).toFixed(1)} cy={toY(v).toFixed(1)} r="3" fill={primary.color} opacity="0.75">
            <title>{labels[i]}: {fmtY(v)}</title>
          </circle>
        ))}

        {/* Y axis labels */}
        {yTickVals.map((v, i) => (
          <text key={i} x={PAD.left - 8} y={toY(v).toFixed(1)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#666656">
            {fmtY(v)}
          </text>
        ))}

        {/* X axis labels */}
        {labels.map((lbl, i) => {
          if (i % step !== 0 && i !== labels.length - 1) return null;
          return (
            <text key={i} x={toX(i, labels.length).toFixed(1)} y={H - 10} textAnchor="middle" fontSize="10" fill="#8a8a74">
              {lbl}
            </text>
          );
        })}

        {/* Legend */}
        {cVals && compare && (
          <>
            <rect x={PAD.left} y={PAD.top - 14} width="10" height="3" rx="1" fill={primary.color} />
            <text x={PAD.left + 14} y={PAD.top - 10} fontSize="10" fill="#4d4d42">{primary.label}</text>
            <rect x={PAD.left + 90} y={PAD.top - 14} width="10" height="3" rx="1" fill={compare.color} />
            <text x={PAD.left + 104} y={PAD.top - 10} fontSize="10" fill="#4d4d42">{compare.label}</text>
          </>
        )}
      </svg>
    </div>
  );
}

/* ─── Grain colors ───────────────────────────────────────────────── */
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

function getColors(grain: string) {
  return GRAIN_COLORS[grain] ?? { line: "#4f632f", area: "#e5ebd8" };
}

/* ─── Main ───────────────────────────────────────────────────────── */
export function PricesClient() {
  const [currency, setCurrency]           = useState<Currency>("USD");
  const [grainFilter, setGrainFilter]     = useState("all");
  const [regionFilter, setRegionFilter]   = useState("all");
  const [selectedGrain, setSelectedGrain] = useState<GrainPrice>(GRAIN_PRICES[0]);
  const [windowSize, setWindowSize]       = useState<RangeOption>(12);
  const [compareGrain, setCompareGrain]   = useState("none");
  const [comparePrev, setComparePrev]     = useState(false);
  const [showPct, setShowPct]             = useState(false);

  const filtered = useMemo(() => {
    return GRAIN_PRICES.filter((g) => {
      if (grainFilter !== "all" && g.grain !== grainFilter) return false;
      if (regionFilter !== "all" && g.region !== regionFilter) return false;
      return true;
    });
  }, [grainFilter, regionFilter]);

  /* Slice history to window */
  const primaryHistory = useMemo(
    () => selectedGrain.history.slice(-windowSize),
    [selectedGrain, windowSize]
  );

  /* Previous period (same window, shifted back) */
  const prevHistory = useMemo(() => {
    const total = selectedGrain.history.length;
    const start = Math.max(0, total - windowSize * 2);
    return selectedGrain.history.slice(start, total - windowSize);
  }, [selectedGrain, windowSize]);

  /* Compare grain history */
  const compareGrainData = useMemo(
    () => GRAIN_PRICES.find((g) => g.grain === compareGrain),
    [compareGrain]
  );
  const compareHistory = useMemo(
    () => compareGrainData?.history.slice(-windowSize) ?? [],
    [compareGrainData, windowSize]
  );

  /* Build chart series */
  const primaryColors = getColors(selectedGrain.grain);
  const compareColors = compareGrainData ? getColors(compareGrainData.grain) : null;

  const primaryUp = primaryHistory.length > 1 &&
    primaryHistory[primaryHistory.length - 1].usd >= primaryHistory[0].usd;

  /* X labels */
  const primaryLabels = primaryHistory.map((h) => h.week);
  const prevLabels = comparePrev
    ? primaryHistory.map((_, i) => `Sem. ${i + 1}`)
    : primaryLabels;

  /* Derived stats for selected grain */
  const last = primaryHistory[primaryHistory.length - 1]?.usd ?? 0;
  const first = primaryHistory[0]?.usd ?? 0;
  const pctChange = first ? (((last - first) / first) * 100).toFixed(1) : "0";
  const pctUp = last >= first;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <header className="mb-10 border-b border-ink-100 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Mercado</p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-ink-900 md:text-6xl">
          Precios <em className="text-brand-700">por grano</em>.
        </h1>
        <p className="mt-3 max-w-xl text-ink-600">
          Referencia semanal de precios de granos y semillas. Seleccioná un grano para ver el historial completo.
        </p>
      </header>

      {/* Table filters */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-ink-200 bg-white p-1 text-sm">
          {(["USD", "ARS", "UYU"] as Currency[]).map((c) => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`rounded-md px-3 py-1.5 font-medium transition-colors ${currency === c ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"}`}
            >{c}</button>
          ))}
        </div>
        <select value={grainFilter} onChange={(e) => setGrainFilter(e.target.value)}
          className="select-campo h-9 rounded-lg border border-ink-200 bg-white px-3 pr-8 text-sm text-ink-800">
          <option value="all">Todos los granos</option>
          {GRAIN_TYPES.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
        <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}
          className="select-campo h-9 rounded-lg border border-ink-200 bg-white px-3 pr-8 text-sm text-ink-800">
          <option value="all">Todas las regiones</option>
          <optgroup label="Argentina">{REGIONS_AR.map((r) => <option key={r} value={r}>{r}</option>)}</optgroup>
          <optgroup label="Uruguay">{REGIONS_UY.map((r) => <option key={r} value={r}>{r}</option>)}</optgroup>
        </select>
      </div>

      {/* Price table */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-ink-100 bg-white">
        <div className="grid grid-cols-[1fr_140px_140px_100px_90px] border-b border-ink-100 bg-ink-50/60 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
          <span>Grano · Región</span>
          <span className="text-right">Último cierre</span>
          <span className="text-right">Semana anterior</span>
          <span className="text-right">Variación</span>
          <span className="text-right">Tendencia</span>
        </div>

        {filtered.length === 0 && (
          <div className="px-6 py-14 text-center text-ink-500">No hay datos para los filtros seleccionados.</div>
        )}

        {filtered.map((g) => {
          const last12 = g.history.slice(-12);
          const lv = convertPrice(g.lastUSD, currency);
          const pv = convertPrice(g.prevUSD, currency);
          const diff = lv - pv;
          const pct = ((diff / pv) * 100).toFixed(2);
          const up = diff >= 0;
          const flat = Math.abs(diff) < 0.5;
          const isSelected = selectedGrain.grain === g.grain;

          return (
            <button key={g.grain} onClick={() => setSelectedGrain(g)}
              className={`grid w-full grid-cols-[1fr_140px_140px_100px_90px] items-center border-b border-ink-100 px-6 py-4 text-left transition-colors last:border-0 hover:bg-brand-50/40 ${isSelected ? "bg-brand-50/60 ring-1 ring-inset ring-brand-200" : ""}`}
            >
              <div>
                <p className="font-medium text-ink-900">{g.label}</p>
                <p className="text-xs text-ink-500">{g.region}</p>
              </div>
              <p className="text-right font-display text-lg font-medium text-ink-900">{formatCurrencyPrice(lv, currency)}</p>
              <p className="text-right text-ink-500">{formatCurrencyPrice(pv, currency)}</p>
              <div className={`flex items-center justify-end gap-1 text-sm font-medium ${flat ? "text-ink-500" : up ? "text-brand-700" : "text-accent-600"}`}>
                {flat ? <Minus className="h-3.5 w-3.5" /> : up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                <span>{up && !flat ? "+" : ""}{pct}%</span>
              </div>
              <div className="flex justify-end">
                <Sparkline values={last12.map((h) => h.usd)} up={up} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart section */}
      <div className="rounded-2xl border border-ink-100 bg-white">
        {/* Chart header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">Historial de precios</p>
            <h2 className="mt-1 font-display text-2xl font-medium text-ink-900">
              {selectedGrain.label}
              <span className="ml-2 text-ink-400">·</span>
              <span className="ml-2 text-lg text-ink-500">{selectedGrain.region}</span>
            </h2>
          </div>
          {/* Current price + period change */}
          <div className="text-right">
            <p className="text-xs text-ink-500">Precio actual</p>
            <p className="font-display text-2xl font-medium text-ink-900">
              {formatCurrencyPrice(convertPrice(selectedGrain.lastUSD, currency), currency)}
              <span className="ml-1 text-sm font-normal text-ink-500">/ t</span>
            </p>
            <p className={`mt-0.5 text-xs font-medium ${pctUp ? "text-brand-700" : "text-accent-600"}`}>
              {pctUp ? "+" : ""}{pctChange}% en el período
            </p>
          </div>
        </div>

        {/* Chart controls */}
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 px-6 py-3">
          {/* Range */}
          <div className="flex items-center gap-1 rounded-lg border border-ink-200 bg-ink-50 p-0.5 text-xs">
            {RANGE_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => setWindowSize(opt.value as RangeOption)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors ${windowSize === opt.value ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"}`}
              >{opt.label}</button>
            ))}
          </div>

          {/* % change toggle */}
          <button onClick={() => setShowPct(!showPct)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${showPct ? "border-brand-600 bg-brand-700 text-white" : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"}`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            % cambio
          </button>

          {/* Compare previous period */}
          <button onClick={() => { setComparePrev(!comparePrev); if (!comparePrev) setCompareGrain("none"); }}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${comparePrev ? "border-accent-600 bg-accent-600 text-white" : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"}`}
          >
            vs. período anterior
          </button>

          {/* Compare with another grain */}
          {!comparePrev && (
            <select value={compareGrain} onChange={(e) => setCompareGrain(e.target.value)}
              className="select-campo h-8 rounded-lg border border-ink-200 bg-white px-2 pr-7 text-xs text-ink-800">
              <option value="none">Comparar con…</option>
              {GRAIN_PRICES.filter((g) => g.grain !== selectedGrain.grain).map((g) => (
                <option key={g.grain} value={g.grain}>{g.label}</option>
              ))}
            </select>
          )}
        </div>

        {/* Chart */}
        <div className="px-6 py-4">
          <TrendChart
            currency={currency}
            windowSize={windowSize}
            showPctChange={showPct}
            labels={comparePrev ? primaryHistory.map((_, i) => `Sem. ${i + 1}`) : primaryLabels}
            primary={{
              label: selectedGrain.label,
              vals: primaryHistory.map((h) => convertPrice(h.usd, currency)),
              color: primaryColors.line,
              areaColor: primaryColors.area,
            }}
            compare={
              comparePrev
                ? {
                    label: `Período anterior`,
                    vals: prevHistory.map((h) => convertPrice(h.usd, currency)),
                    color: "#8a8a74",
                    areaColor: "#ececd9",
                    dashed: true,
                  }
                : compareGrain !== "none" && compareGrainData && compareColors
                ? {
                    label: compareGrainData.label,
                    vals: compareHistory.map((h) => convertPrice(h.usd, currency)),
                    color: compareColors.line,
                    areaColor: compareColors.area,
                    dashed: true,
                  }
                : undefined
            }
          />
        </div>

        <div className="border-t border-ink-100 px-6 py-3 text-[11px] text-ink-400">
          Precios de referencia en pizarra Rosario / Buenos Aires. Datos ilustrativos, actualización semanal.
          {currency !== "USD" && ` Tipo de cambio: 1 USD = ${currency === "ARS" ? "1.285 ARS" : "43,2 UYU"}.`}
        </div>
      </div>
    </div>
  );
}
