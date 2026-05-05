"use client";

import { useState, useMemo, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Droplets, Wind, Thermometer, Sun, Eye, Leaf, AlertTriangle } from "lucide-react";
import {
  generateClimaData, AR_PROVINCES, UY_DEPARTMENTS,
  CONDITION_LABELS, CONDITION_EMOJI,
  type ClimaData, type WeatherCondition,
} from "@/lib/weather-data";

const AR_GEO = "/geo/argentina.geojson";
const UY_GEO = "/geo/uruguay.geojson";

/* ─── Temp color scale ───────────────────────────────────────────── */
function tempColor(t: number): string {
  // -5°C → blue, 15°C → yellow-green, 35°C → red
  if (t <= 0)  return "#b8d4f0";
  if (t <= 8)  return "#9bc5e8";
  if (t <= 14) return "#a8d4b8";
  if (t <= 18) return "#c5df8a";
  if (t <= 22) return "#e5e070";
  if (t <= 27) return "#f0b84a";
  if (t <= 32) return "#e87a3a";
  return "#cc3a2a";
}

/* ─── Province temp cache (deterministic, computed once) ─────────── */
const PROVINCE_TEMPS: Record<string, number> = {};
AR_PROVINCES.forEach(p => {
  const d = generateClimaData(p, "AR");
  PROVINCE_TEMPS[p] = d.currentTemp;
});
UY_DEPARTMENTS.forEach(p => {
  const d = generateClimaData(p, "UY");
  PROVINCE_TEMPS[p] = d.currentTemp;
});

/* ─── Inline SVG charts ──────────────────────────────────────────── */
function TempHistoryChart({ history }: { history: ClimaData["history"] }) {
  const W = 500, H = 120, PAD = { top: 14, right: 10, bottom: 28, left: 36 };
  const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom;
  const allMax = history.map(h => h.avgTempMax);
  const allMin = history.map(h => h.avgTempMin);
  const gMin = Math.min(...allMin) - 2, gMax = Math.max(...allMax) + 2, gRange = gMax - gMin;

  function toX(i: number) { return PAD.left + (i / (history.length - 1)) * cW; }
  function toY(v: number) { return PAD.top + cH - ((v - gMin) / gRange) * cH; }

  const maxPts = allMax.map((v, i) => `${toX(i).toFixed(0)},${toY(v).toFixed(0)}`).join(" ");
  const minPts = allMin.map((v, i) => `${toX(i).toFixed(0)},${toY(v).toFixed(0)}`).join(" ");

  const bandPath = `M${toX(0)},${toY(allMax[0])} `
    + allMax.slice(1).map((v, i) => `L${toX(i + 1)},${toY(v)}`).join(" ")
    + " "
    + allMin.map((v, i) => `L${toX(history.length - 1 - i)},${toY(allMin[history.length - 1 - i])}`).reverse().join(" ")
    + " Z";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[280px]" preserveAspectRatio="xMidYMid meet">
      <path d={bandPath} fill="#fde9d4" opacity="0.6" />
      <polyline points={maxPts} fill="none" stroke="#e07a3a" strokeWidth="2" strokeLinecap="round" />
      <polyline points={minPts} fill="none" stroke="#3d8cbe" strokeWidth="2" strokeLinecap="round" strokeDasharray="4,2" />
      {history.map((h, i) => (
        <text key={i} x={toX(i).toFixed(0)} y={H - 6} textAnchor="middle" fontSize="9" fill="#8a8a74">{h.month}</text>
      ))}
      {[-10, 0, 10, 20, 30].filter(v => v > gMin && v < gMax).map(v => (
        <g key={v}>
          <line x1={PAD.left} y1={toY(v)} x2={PAD.left + cW} y2={toY(v)} stroke="#ececd9" strokeWidth="1" />
          <text x={PAD.left - 4} y={toY(v)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="#8a8a74">{v}°</text>
        </g>
      ))}
      <text x={PAD.left + 4} y={PAD.top - 2} fontSize="9" fill="#e07a3a">Máx.</text>
      <text x={PAD.left + 30} y={PAD.top - 2} fontSize="9" fill="#3d8cbe">Mín.</text>
    </svg>
  );
}

function PrecipChart({ history, nowMonth }: { history: ClimaData["history"]; nowMonth: number }) {
  const W = 500, H = 100, PAD = { top: 10, right: 10, bottom: 28, left: 44 };
  const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom;
  const maxP = Math.max(...history.map(h => h.precipMm));
  const step = cW / history.length;
  const bW   = Math.max(4, step - 4);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[280px]" preserveAspectRatio="xMidYMid meet">
      <text x={PAD.left - 4} y={PAD.top + 4} textAnchor="end" fontSize="9" fill="#8a8a74">{maxP}mm</text>
      <text x={PAD.left - 4} y={PAD.top + cH / 2} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="#8a8a74">{Math.round(maxP / 2)}mm</text>
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left + cW} y2={PAD.top} stroke="#ececd9" strokeWidth="1" />
      <line x1={PAD.left} y1={PAD.top + cH / 2} x2={PAD.left + cW} y2={PAD.top + cH / 2} stroke="#ececd9" strokeWidth="1" />

      {history.map((h, i) => {
        const bH = maxP ? (h.precipMm / maxP) * cH : 0;
        const x  = PAD.left + i * step + (step - bW) / 2;
        const y  = PAD.top + cH - bH;
        const isCurrent = i === nowMonth;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bW} height={bH}
              fill={isCurrent ? "#4f632f" : "#839b57"} opacity={isCurrent ? 0.9 : 0.55} rx="2">
              <title>{h.month}: {h.precipMm} mm</title>
            </rect>
            <text x={x + bW / 2} y={H - 6} textAnchor="middle" fontSize="9" fill={isCurrent ? "#3e4f26" : "#8a8a74"} fontWeight={isCurrent ? "700" : "400"}>
              {h.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function SunHoursChart({ history }: { history: ClimaData["history"] }) {
  const W = 500, H = 80, PAD = { top: 8, right: 10, bottom: 24, left: 36 };
  const cW = W - PAD.left - PAD.right, cH = H - PAD.top - PAD.bottom;
  const maxS = Math.max(...history.map(h => h.sunHours));

  function toX(i: number) { return PAD.left + (i / (history.length - 1)) * cW; }
  function toY(v: number) { return PAD.top + cH - (v / maxS) * cH; }

  const pts = history.map((h, i) => `${toX(i).toFixed(0)},${toY(h.sunHours).toFixed(0)}`).join(" ");
  const area = `M${toX(0)},${toY(history[0].sunHours)} `
    + history.slice(1).map((h, i) => `L${toX(i + 1)},${toY(h.sunHours)}`).join(" ")
    + ` L${toX(history.length - 1)},${PAD.top + cH} L${toX(0)},${PAD.top + cH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[280px]" preserveAspectRatio="xMidYMid meet">
      <path d={area} fill="#fde9a0" opacity="0.5" />
      <polyline points={pts} fill="none" stroke="#c4a020" strokeWidth="2" strokeLinecap="round" />
      {history.map((h, i) => (
        <text key={i} x={toX(i).toFixed(0)} y={H - 4} textAnchor="middle" fontSize="9" fill="#8a8a74">{h.month}</text>
      ))}
      <text x={PAD.left - 4} y={PAD.top + 4} textAnchor="end" fontSize="9" fill="#8a8a74">{maxS}h</text>
    </svg>
  );
}

/* ─── Forecast card ──────────────────────────────────────────────── */
function ForecastCard({
  day, isToday,
}: { day: ClimaData["forecast"][number]; isToday: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all ${
      isToday ? "border-brand-200 bg-brand-50/60" : "border-ink-100 bg-white hover:border-ink-200"
    }`}>
      <p className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${isToday ? "text-brand-700" : "text-ink-500"}`}>
        {isToday ? "Hoy" : day.date.split(" ")[0]}
      </p>
      <p className="text-[10px] text-ink-400">{day.date.split(" ")[1]}</p>
      <span className="text-2xl leading-none">{CONDITION_EMOJI[day.condition]}</span>
      <p className="text-[10px] text-ink-500 leading-tight">{CONDITION_LABELS[day.condition]}</p>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-bold text-ink-900">{day.tempMax}°</span>
        <span className="text-xs text-ink-400">{day.tempMin}°</span>
      </div>
      {day.precipMm > 0 && (
        <div className="flex items-center gap-1 text-[10px] text-blue-500">
          <Droplets className="h-3 w-3" />
          {day.precipMm}mm
        </div>
      )}
      <div className="flex items-center gap-1 text-[10px] text-ink-400">
        <Wind className="h-3 w-3" />
        {day.windKph}km/h {day.windDir}
      </div>
    </div>
  );
}

/* ─── Agro card ──────────────────────────────────────────────────── */
function AgroCard({
  icon, label, value, sub, accent,
}: { icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${accent ? "border-brand-200 bg-brand-50/50" : "border-ink-100 bg-white"}`}>
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full ${accent ? "bg-brand-100 text-brand-700" : "bg-ink-50 text-ink-500"}`}>
        {icon}
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-500">{label}</p>
      <p className={`mt-1.5 font-display text-xl font-medium ${accent ? "text-brand-700" : "text-ink-900"}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-400">{sub}</p>}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────── */
export function ClimaClient() {
  const [country, setCountry] = useState<"AR" | "UY">("AR");
  const [province, setProvince] = useState("Buenos Aires");
  const [mapVar, setMapVar] = useState<"temp" | "precip">("temp");
  const [mapHover, setMapHover] = useState<string | null>(null);
  const [histTab, setHistTab] = useState<"temp" | "precip" | "sun">("temp");

  const provinces = country === "AR" ? AR_PROVINCES : UY_DEPARTMENTS;
  const MAY_IDX = 4; // current month index

  // Ensure province is valid when country changes
  useEffect(() => {
    if (!provinces.includes(province)) setProvince(provinces[0]);
  }, [country, provinces]);

  const data: ClimaData = useMemo(
    () => generateClimaData(province, country),
    [province, country]
  );

  // All provinces' precip data for choropleth (derived from month history index 4)
  const precipMap = useMemo(() => {
    const out: Record<string, number> = {};
    (country === "AR" ? AR_PROVINCES : UY_DEPARTMENTS).forEach(p => {
      const d = generateClimaData(p, country);
      out[p] = d.history[MAY_IDX].precipMm;
    });
    return out;
  }, [country]);

  const maxPrecip = Math.max(...Object.values(precipMap));

  function getProvinceColor(name: string): string {
    if (mapVar === "temp") {
      const t = PROVINCE_TEMPS[name] ?? 18;
      return tempColor(t);
    } else {
      const p = precipMap[name] ?? 0;
      const intensity = p / (maxPrecip || 1);
      const r = Math.round(220 - intensity * 120);
      const g = Math.round(235 - intensity * 60);
      const b = Math.round(255 - intensity * 80);
      return `rgb(${r},${g},${b})`;
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 py-12 lg:px-10">

      {/* Header */}
      <header className="mb-10 border-b border-ink-100 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Clima agrícola</p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-ink-900 md:text-6xl">
          Pronóstico <em className="text-brand-700">y clima</em>.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-600">
          Temperatura, precipitaciones y condiciones agropecuarias por provincia. Seleccioná tu región para ver el detalle.
        </p>
      </header>

      {/* ── Location selector ── */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-ink-200 bg-white p-1 text-sm">
          {(["AR", "UY"] as const).map(c => (
            <button key={c} onClick={() => setCountry(c)}
              className={`rounded-md px-4 py-1.5 font-medium transition-colors ${country === c ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-50"}`}>
              {c === "AR" ? "🇦🇷 Argentina" : "🇺🇾 Uruguay"}
            </button>
          ))}
        </div>
        <select value={province} onChange={e => setProvince(e.target.value)}
          className="select-campo h-9 rounded-lg border border-ink-200 bg-white px-3 pr-8 text-sm text-ink-800">
          {provinces.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <span className="text-xs text-ink-400">Zona climática: <strong className="text-ink-700">{data.zone}</strong></span>
      </div>

      {/* ── Current conditions strip ── */}
      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-2xl border border-ink-100 bg-white px-6 py-5 shadow-sm">
        <div className="flex items-center gap-4 border-r border-ink-100 pr-6">
          <span className="text-5xl leading-none">{CONDITION_EMOJI[data.currentCondition]}</span>
          <div>
            <p className="font-display text-4xl font-medium text-ink-900">{data.currentTemp}°C</p>
            <p className="text-sm text-ink-500">{CONDITION_LABELS[data.currentCondition]}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          {[
            { icon: <Thermometer className="h-4 w-4" />, label: "Sensación", value: `${data.feelsLike}°C` },
            { icon: <Droplets className="h-4 w-4" />, label: "Humedad", value: `${data.humidity}%` },
            { icon: <Wind className="h-4 w-4" />, label: "Viento", value: `${data.windKph} km/h ${data.windDir}` },
            { icon: <Sun className="h-4 w-4" />, label: "UV", value: `${data.uvIndex}` },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-2 text-ink-700">
              <span className="text-ink-400">{icon}</span>
              <span className="text-ink-400">{label}</span>
              <span className="font-semibold text-ink-900">{value}</span>
            </div>
          ))}
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-ink-400 uppercase tracking-[0.12em] font-semibold">{province}</p>
          <p className="text-xs text-ink-400">{country === "AR" ? "Argentina" : "Uruguay"}</p>
        </div>
      </div>

      {/* ── 7-day forecast ── */}
      <div className="mb-8">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">Próximos 7 días</p>
        <div className="grid grid-cols-7 gap-2">
          {data.forecast.map((day, i) => (
            <ForecastCard key={i} day={day} isToday={i === 0} />
          ))}
        </div>
      </div>

      {/* ── Map + Agro panel ── */}
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_360px]">

        {/* Map */}
        <div className="rounded-2xl border border-ink-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">Mapa climático</p>
              <p className="mt-0.5 text-sm text-ink-700">
                {mapVar === "temp" ? "Temperatura actual (°C)" : "Precipitación mensual (mm)"}
              </p>
            </div>
            <div className="flex gap-1 rounded-lg border border-ink-200 bg-ink-50 p-1 text-xs">
              <button onClick={() => setMapVar("temp")}
                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${mapVar === "temp" ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"}`}>
                Temperatura
              </button>
              <button onClick={() => setMapVar("precip")}
                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${mapVar === "precip" ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"}`}>
                Precipitación
              </button>
            </div>
          </div>

          <div className="relative" style={{ height: 420 }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={country === "AR"
                ? { scale: 700, center: [-65, -38] }
                : { scale: 2200, center: [-56, -33] }}
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup>
                <Geographies geography={country === "AR" ? AR_GEO : UY_GEO}>
                  {({ geographies }: { geographies: any[] }) =>
                    geographies.map((geo) => {
                      const name: string = geo.properties.name ?? geo.properties.NAME ?? "";
                      const isSelected = name === province;
                      const isHover = name === mapHover;
                      const baseColor = getProvinceColor(name);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onClick={() => setProvince(name)}
                          onMouseEnter={() => setMapHover(name)}
                          onMouseLeave={() => setMapHover(null)}
                          style={{
                            default: {
                              fill: isSelected ? "#3e4f26" : baseColor,
                              stroke: "#fff",
                              strokeWidth: 0.8,
                              outline: "none",
                            },
                            hover: {
                              fill: isHover && !isSelected ? "#839b57" : isSelected ? "#3e4f26" : baseColor,
                              stroke: "#fff",
                              strokeWidth: 0.8,
                              outline: "none",
                              cursor: "pointer",
                            },
                            pressed: { fill: "#3e4f26", outline: "none" },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>

            {/* Hover tooltip */}
            {mapHover && (
              <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-ink-200 bg-white px-3 py-2 shadow-md text-sm">
                <p className="font-semibold text-ink-900">{mapHover}</p>
                {mapVar === "temp"
                  ? <p className="text-ink-500">{PROVINCE_TEMPS[mapHover] ?? "—"}°C</p>
                  : <p className="text-ink-500">{precipMap[mapHover] ?? "—"} mm/mes</p>
                }
              </div>
            )}

            {/* Color legend */}
            <div className="absolute bottom-3 right-3 rounded-lg border border-ink-100 bg-white/90 px-3 py-2 backdrop-blur-sm">
              {mapVar === "temp" ? (
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold text-ink-500">Temperatura (°C)</p>
                  <div className="flex gap-1 items-center">
                    {[0, 8, 14, 18, 22, 27, 32].map(t => (
                      <div key={t} title={`${t}°C`} className="h-3 w-4 rounded-sm" style={{ backgroundColor: tempColor(t) }} />
                    ))}
                  </div>
                  <div className="mt-1 flex justify-between text-[9px] text-ink-400">
                    <span>0°</span><span>32°+</span>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="mb-1.5 text-[10px] font-semibold text-ink-500">Precipitación (mm)</p>
                  <div className="flex gap-1 items-center">
                    {[0.1, 0.3, 0.5, 0.7, 0.9].map(f => {
                      const r = Math.round(220 - f * 120), g = Math.round(235 - f * 60), b = Math.round(255 - f * 80);
                      return <div key={f} className="h-3 w-4 rounded-sm" style={{ backgroundColor: `rgb(${r},${g},${b})` }} />;
                    })}
                  </div>
                  <div className="mt-1 flex justify-between text-[9px] text-ink-400">
                    <span>Seco</span><span>Húmedo</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agro panel */}
        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">Indicadores agropecuarios — {province}</p>

          <div className="grid grid-cols-2 gap-3">
            <AgroCard
              icon={<Droplets className="h-4 w-4" />}
              label="Precip. 30 días"
              value={`${data.agro.accumulatedPrecip30d} mm`}
              sub={`Normal: ${data.agro.normalPrecip30d} mm`}
              accent={data.agro.accumulatedPrecip30d >= data.agro.normalPrecip30d * 0.85}
            />
            <AgroCard
              icon={<Leaf className="h-4 w-4" />}
              label="GDDs acumulados"
              value={`${data.agro.gdd.toLocaleString()}`}
              sub="Grados día crecimiento (base 10°C)"
            />
            <AgroCard
              icon={<AlertTriangle className="h-4 w-4" />}
              label="Riesgo de helada"
              value={data.agro.frostRisk.charAt(0).toUpperCase() + data.agro.frostRisk.slice(1)}
              sub="Próximas 4 semanas"
            />
            <AgroCard
              icon={<Eye className="h-4 w-4" />}
              label="Humedad de suelo"
              value={`${data.agro.soilMoisturePercent}%`}
              sub="Estimación por precipitación"
              accent={data.agro.soilMoisturePercent > 50}
            />
          </div>

          {/* Drought index */}
          <div className={`rounded-2xl border p-4 ${
            data.agro.droughtIndex === "normal" ? "border-brand-200 bg-brand-50/40" :
            data.agro.droughtIndex === "sequía leve" ? "border-yellow-200 bg-yellow-50/40" :
            data.agro.droughtIndex === "sequía moderada" ? "border-orange-200 bg-orange-50/40" :
            "border-red-200 bg-red-50/40"
          }`}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-500">Índice de sequía</p>
            <p className={`mt-1.5 font-display text-xl font-medium capitalize ${
              data.agro.droughtIndex === "normal" ? "text-brand-700" :
              data.agro.droughtIndex === "sequía leve" ? "text-yellow-700" :
              data.agro.droughtIndex === "sequía moderada" ? "text-orange-700" :
              "text-red-700"
            }`}>{data.agro.droughtIndex}</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${(data.agro.accumulatedPrecip30d / (data.agro.normalPrecip30d * 1.2)) * 100}%`,
                  backgroundColor: data.agro.droughtIndex === "normal" ? "#4f632f" :
                    data.agro.droughtIndex === "sequía leve" ? "#c4a020" :
                    data.agro.droughtIndex === "sequía moderada" ? "#e07a3a" : "#cc3a2a",
                  maxWidth: "100%",
                }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-ink-400">
              <span>0 mm</span>
              <span>{data.agro.accumulatedPrecip30d} mm / normal {data.agro.normalPrecip30d} mm</span>
            </div>
          </div>

          {/* Frost calendar */}
          <div className="rounded-2xl border border-ink-100 bg-white p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-500">Días de helada / mes</p>
            <div className="flex gap-1">
              {data.history.map((h, i) => (
                <div key={i} className="flex-1 text-center">
                  <div
                    className="mx-auto rounded-sm transition-all"
                    style={{
                      height: Math.max(4, (h.frostDays / 12) * 40),
                      backgroundColor: h.frostDays > 0 ? "#b8d4f0" : "#ececd9",
                      opacity: i === MAY_IDX ? 1 : 0.7,
                    }}
                    title={`${h.month}: ${h.frostDays} días`}
                  />
                  <p className="mt-1 text-[9px] text-ink-400">{h.month.slice(0, 1)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Historical charts ── */}
      <div className="rounded-2xl border border-ink-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">Histórico mensual</p>
            <p className="mt-0.5 font-display text-lg font-medium text-ink-900">{province}</p>
          </div>
          <div className="flex gap-1 rounded-lg border border-ink-200 bg-ink-50 p-1 text-xs">
            {([
              { id: "temp", label: "Temperatura" },
              { id: "precip", label: "Precipitación" },
              { id: "sun", label: "Horas de sol" },
            ] as const).map(({ id, label }) => (
              <button key={id} onClick={() => setHistTab(id)}
                className={`rounded-md px-3 py-1.5 font-medium transition-colors ${histTab === id ? "bg-white text-ink-900 shadow-sm" : "text-ink-500 hover:text-ink-800"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-5">
          {histTab === "temp" && (
            <>
              <p className="mb-3 text-xs text-ink-500">Temperatura promedio máx. y mín. mensual (°C)</p>
              <TempHistoryChart history={data.history} />
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  { label: "Mes más cálido", value: `${data.history.reduce((a, b) => a.avgTempMax > b.avgTempMax ? a : b).month} — ${Math.round(data.history.reduce((a, b) => a.avgTempMax > b.avgTempMax ? a : b).avgTempMax)}°C` },
                  { label: "Mes más frío", value: `${data.history.reduce((a, b) => a.avgTempMin < b.avgTempMin ? a : b).month} — ${Math.round(data.history.reduce((a, b) => a.avgTempMin < b.avgTempMin ? a : b).avgTempMin)}°C` },
                  { label: "Amplitud anual", value: `${Math.round(Math.max(...data.history.map(h => h.avgTempMax)) - Math.min(...data.history.map(h => h.avgTempMin)))}°C` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-ink-100 bg-ink-50/50 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-ink-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-ink-800">{value}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {histTab === "precip" && (
            <>
              <p className="mb-3 text-xs text-ink-500">Precipitación mensual promedio (mm) — mes actual resaltado</p>
              <PrecipChart history={data.history} nowMonth={MAY_IDX} />
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  { label: "Total anual", value: `${data.history.reduce((s, h) => s + h.precipMm, 0)} mm` },
                  { label: "Mes más lluvioso", value: `${data.history.reduce((a, b) => a.precipMm > b.precipMm ? a : b).month} — ${data.history.reduce((a, b) => a.precipMm > b.precipMm ? a : b).precipMm} mm` },
                  { label: "Mes más seco", value: `${data.history.reduce((a, b) => a.precipMm < b.precipMm ? a : b).month} — ${data.history.reduce((a, b) => a.precipMm < b.precipMm ? a : b).precipMm} mm` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-ink-100 bg-ink-50/50 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-ink-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-ink-800">{value}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {histTab === "sun" && (
            <>
              <p className="mb-3 text-xs text-ink-500">Horas de sol promedio por día en el mes</p>
              <SunHoursChart history={data.history} />
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  { label: "Mes con más sol", value: `${data.history.reduce((a, b) => a.sunHours > b.sunHours ? a : b).month} — ${data.history.reduce((a, b) => a.sunHours > b.sunHours ? a : b).sunHours}h/día` },
                  { label: "Mes con menos sol", value: `${data.history.reduce((a, b) => a.sunHours < b.sunHours ? a : b).month} — ${data.history.reduce((a, b) => a.sunHours < b.sunHours ? a : b).sunHours}h/día` },
                  { label: "Promedio anual", value: `${(data.history.reduce((s, h) => s + h.sunHours, 0) / 12).toFixed(1)}h/día` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-ink-100 bg-ink-50/50 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.11em] text-ink-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-ink-800">{value}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="border-t border-ink-100 px-6 py-3 text-[11px] text-ink-400">
          Datos climáticos ilustrativos basados en promedios históricos por zona climática. No representa pronóstico oficial. Para datos en tiempo real, consultá SMN (Argentina) o Meteorología Uruguay.
        </div>
      </div>
    </div>
  );
}
