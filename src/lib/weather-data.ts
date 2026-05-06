/* ─── Weather mock data — deterministic by province name ─────────── */

export type WeatherCondition =
  | "sunny" | "partly_cloudy" | "cloudy" | "light_rain"
  | "rain" | "storm" | "frost" | "windy" | "foggy";

export type DayForecast = {
  date: string;       // "Lun 05/05"
  condition: WeatherCondition;
  tempMax: number;
  tempMin: number;
  precipMm: number;
  humidity: number;   // 0–100
  windKph: number;
  windDir: string;
};

export type MonthHistory = {
  month: string;       // "Ene", "Feb" …
  avgTempMax: number;
  avgTempMin: number;
  precipMm: number;
  frostDays: number;
  sunHours: number;
};

export type ClimaData = {
  province: string;
  country: string;
  zone: string;        // "Pampeana", "Patagónica", etc.
  currentTemp: number;
  currentCondition: WeatherCondition;
  humidity: number;
  windKph: number;
  windDir: string;
  feelsLike: number;
  uvIndex: number;
  forecast: DayForecast[];
  history: MonthHistory[];
  agro: AgroIndicators;
};

export type AgroIndicators = {
  accumulatedPrecip30d: number;  // mm
  normalPrecip30d: number;       // mm historical average
  gdd: number;                   // growing degree days (base 10°C)
  frostRisk: "bajo" | "moderado" | "alto";
  droughtIndex: "normal" | "sequía leve" | "sequía moderada" | "sequía severa";
  soilMoisturePercent: number;
};

/* ─── Climate zones ──────────────────────────────────────────────── */
type ClimateZone = {
  name: string;
  tempBase: number;
  tempAmplitude: number;   // max yearly swing ÷ 2
  precipBase: number;      // annual mm
  precipSeasonality: number; // 0 = uniform, 1 = very seasonal
  frostMonths: number[];   // 0=Jan
};

const ZONES: Record<string, ClimateZone> = {
  pampeana: {
    name: "Pampeana",
    tempBase: 18, tempAmplitude: 11, precipBase: 950,
    precipSeasonality: 0.3, frostMonths: [5, 6, 7],
  },
  noa: {
    name: "Noroeste Árido",
    tempBase: 22, tempAmplitude: 9, precipBase: 600,
    precipSeasonality: 0.7, frostMonths: [6, 7],
  },
  noa_humedo: {
    name: "Noroeste Húmedo",
    tempBase: 25, tempAmplitude: 7, precipBase: 1200,
    precipSeasonality: 0.65, frostMonths: [6],
  },
  nea: {
    name: "Noreste Subtropical",
    tempBase: 26, tempAmplitude: 6, precipBase: 1600,
    precipSeasonality: 0.25, frostMonths: [],
  },
  cuyo: {
    name: "Cuyana Árida",
    tempBase: 20, tempAmplitude: 13, precipBase: 280,
    precipSeasonality: 0.5, frostMonths: [5, 6, 7, 8],
  },
  patagonico: {
    name: "Patagónica",
    tempBase: 10, tempAmplitude: 13, precipBase: 250,
    precipSeasonality: 0.35, frostMonths: [4, 5, 6, 7, 8, 9],
  },
  uruguay: {
    name: "Atlántica Templada",
    tempBase: 17, tempAmplitude: 10, precipBase: 1100,
    precipSeasonality: 0.15, frostMonths: [6, 7],
  },
};

const PROVINCE_ZONE: Record<string, string> = {
  // Argentina
  "Buenos Aires": "pampeana", "Córdoba": "pampeana", "Santa Fe": "pampeana",
  "Entre Ríos": "pampeana", "La Pampa": "pampeana",
  "Santiago del Estero": "noa", "San Juan": "cuyo", "Mendoza": "cuyo",
  "San Luis": "cuyo", "La Rioja": "noa",
  "Salta": "noa_humedo", "Jujuy": "noa_humedo", "Tucumán": "noa_humedo",
  "Catamarca": "noa",
  "Chaco": "nea", "Formosa": "nea", "Misiones": "nea", "Corrientes": "nea",
  "Neuquén": "patagonico", "Río Negro": "patagonico", "Chubut": "patagonico",
  "Santa Cruz": "patagonico", "Tierra del Fuego": "patagonico",
  // Uruguay
  "Montevideo": "uruguay", "Canelones": "uruguay", "Maldonado": "uruguay",
  "Colonia": "uruguay", "San José": "uruguay", "Flores": "uruguay",
  "Florida": "uruguay", "Durazno": "uruguay", "Tacuarembó": "uruguay",
  "Rivera": "uruguay", "Artigas": "uruguay", "Salto": "uruguay",
  "Paysandú": "uruguay", "Soriano": "uruguay",
  "Rocha": "uruguay", "Lavalleja": "uruguay", "Treinta y Tres": "uruguay",
  "Cerro Largo": "uruguay",
};

/* ─── Deterministic PRNG ─────────────────────────────────────────── */
function mkRand(seed: number) {
  let s = seed;
  return function (): number {
    s = (Math.imul(1664525, s) + 1013904223) | 0;
    return (s >>> 0) / 0xffffffff;
  };
}

function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/* ─── Month helpers ──────────────────────────────────────────────── */
const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const DAY_LABELS   = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const WIND_DIRS    = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];

function monthTemp(zone: ClimateZone, month: number): { max: number; min: number } {
  // Southern hemisphere: warmest Jan (0), coldest Jul (6)
  const cosM = Math.cos(((month + 0.5) / 12) * 2 * Math.PI);
  const avg = zone.tempBase + cosM * zone.tempAmplitude;
  return { max: avg + 5, min: avg - 4 };
}

function monthPrecip(zone: ClimateZone, month: number, rnd: () => number): number {
  // Seasonal distribution: summer wet in NOA/NEA, more uniform elsewhere
  const base = zone.precipBase / 12;
  const seasonalFactor = zone.precipSeasonality
    ? 1 + zone.precipSeasonality * Math.sin(((month - 1) / 12) * 2 * Math.PI)
    : 1;
  return Math.max(0, Math.round(base * seasonalFactor * (0.7 + rnd() * 0.6)));
}

const CONDITIONS: WeatherCondition[] = [
  "sunny", "partly_cloudy", "cloudy", "light_rain", "rain", "storm", "windy", "foggy",
];

function pickCondition(precip: number, month: number, zone: ClimateZone, rnd: () => number): WeatherCondition {
  const r = rnd();
  const isFrostMonth = zone.frostMonths.includes(month);
  if (isFrostMonth && r < 0.08) return "frost";
  if (precip > 30) return r < 0.4 ? "storm" : r < 0.7 ? "rain" : "cloudy";
  if (precip > 10) return r < 0.5 ? "light_rain" : r < 0.75 ? "partly_cloudy" : "cloudy";
  return r < 0.5 ? "sunny" : r < 0.75 ? "partly_cloudy" : r < 0.9 ? "cloudy" : "windy";
}

/* ─── Main generator ─────────────────────────────────────────────── */
export function generateClimaData(province: string, country: "AR" | "UY"): ClimaData {
  const zoneKey = PROVINCE_ZONE[province] ?? (country === "UY" ? "uruguay" : "pampeana");
  const zone    = ZONES[zoneKey];
  const rnd     = mkRand(hashStr(province));

  // Today = 2026-05-05 → month index 4 (May)
  const nowMonth = 4;
  const nowDay   = 5;

  const curT = monthTemp(zone, nowMonth);
  const curPrecip = monthPrecip(zone, nowMonth, rnd);
  const currentTemp = Math.round(curT.max - 3 + rnd() * 6);
  const humidity    = Math.round(40 + rnd() * 45);
  const windKph     = Math.round(5 + rnd() * 40);
  const currentCondition = pickCondition(curPrecip, nowMonth, zone, rnd);

  // 7-day forecast
  const forecast: DayForecast[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(2026, 4, nowDay + i); // May 5 + i
    const m = d.getMonth();
    const t = monthTemp(zone, m);
    const dayPrecip = Math.round(Math.max(0, (rnd() - 0.55) * curPrecip * 2));
    const cond = pickCondition(dayPrecip, m, zone, rnd);
    forecast.push({
      date: `${DAY_LABELS[d.getDay()]} ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      condition: cond,
      tempMax: Math.round(t.max + (rnd() - 0.5) * 4),
      tempMin: Math.round(t.min + (rnd() - 0.5) * 4),
      precipMm: dayPrecip,
      humidity: Math.round(35 + rnd() * 55),
      windKph: Math.round(5 + rnd() * 45),
      windDir: WIND_DIRS[Math.floor(rnd() * 8)],
    });
  }

  // 12-month history (Jan–Dec)
  const history: MonthHistory[] = MONTH_LABELS.map((label, m) => {
    const t = monthTemp(zone, m);
    const precip = monthPrecip(zone, m, rnd);
    const frostDays = zone.frostMonths.includes(m) ? Math.round(rnd() * 12) : 0;
    const sunHours  = Math.round(4 + (1 - Math.min(1, precip / 150)) * 6 + rnd() * 2);
    return {
      month: label,
      avgTempMax: Math.round(t.max * 10) / 10,
      avgTempMin: Math.round(t.min * 10) / 10,
      precipMm: precip,
      frostDays,
      sunHours,
    };
  });

  // Agro indicators
  const last30precip = Math.round(history[nowMonth].precipMm * 0.8 + history[(nowMonth - 1 + 12) % 12].precipMm * 0.2);
  const normalPrecip = Math.round(zone.precipBase / 12);
  const precipRatio  = last30precip / normalPrecip;
  const droughtIndex: AgroIndicators["droughtIndex"] =
    precipRatio < 0.4 ? "sequía severa" :
    precipRatio < 0.65 ? "sequía moderada" :
    precipRatio < 0.85 ? "sequía leve" : "normal";

  const gdd = Math.round(
    history.slice(0, nowMonth + 1).reduce((sum, h) => {
      const avg = (h.avgTempMax + h.avgTempMin) / 2;
      return sum + Math.max(0, avg - 10) * 30;
    }, 0)
  );

  const hasFrostRisk = zone.frostMonths.includes(nowMonth) || zone.frostMonths.includes((nowMonth + 1) % 12);
  const frostRisk: AgroIndicators["frostRisk"] = hasFrostRisk
    ? (zone.frostMonths.length > 4 ? "alto" : "moderado")
    : "bajo";

  return {
    province,
    country,
    zone: zone.name,
    currentTemp,
    currentCondition,
    humidity,
    windKph,
    windDir: WIND_DIRS[Math.floor(rnd() * 8)],
    feelsLike: Math.round(currentTemp - windKph * 0.05),
    uvIndex: Math.round(1 + rnd() * 7),
    forecast,
    history,
    agro: {
      accumulatedPrecip30d: last30precip,
      normalPrecip30d: normalPrecip,
      gdd,
      frostRisk,
      droughtIndex,
      soilMoisturePercent: Math.round(25 + precipRatio * 45 + rnd() * 10),
    },
  };
}

/* ─── Province lists ─────────────────────────────────────────────── */
export const AR_PROVINCES = [
  "Buenos Aires", "Córdoba", "Santa Fe", "Entre Ríos", "La Pampa",
  "Mendoza", "San Juan", "Neuquén", "Río Negro", "Chubut",
  "Salta", "Jujuy", "Tucumán", "Santiago del Estero", "Chaco",
  "Formosa", "Misiones", "Corrientes", "La Rioja", "Catamarca",
  "San Luis", "Santa Cruz", "Tierra del Fuego",
];

export const UY_DEPARTMENTS = [
  "Montevideo", "Canelones", "Maldonado", "Colonia", "San José",
  "Flores", "Florida", "Durazno", "Tacuarembó", "Rivera",
  "Artigas", "Salto", "Paysandú", "Río Negro", "Soriano",
  "Rocha", "Lavalleja", "Treinta y Tres", "Cerro Largo",
];

export const CONDITION_LABELS: Record<WeatherCondition, string> = {
  sunny: "Soleado",
  partly_cloudy: "Parcialmente nublado",
  cloudy: "Nublado",
  light_rain: "Llovizna",
  rain: "Lluvia",
  storm: "Tormenta",
  frost: "Helada",
  windy: "Ventoso",
  foggy: "Niebla",
};

export const CONDITION_EMOJI: Record<WeatherCondition, string> = {
  sunny: "☀️",
  partly_cloudy: "⛅",
  cloudy: "☁️",
  light_rain: "🌦️",
  rain: "🌧️",
  storm: "⛈️",
  frost: "🌨️",
  windy: "💨",
  foggy: "🌫️",
};

// Province's approximate temperature right now (for choropleth)
export function provinceCurrentTemp(province: string, country: "AR" | "UY"): number {
  return generateClimaData(province, country).currentTemp;
}
