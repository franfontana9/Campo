export const USD_TO_ARS = 1285;
export const USD_TO_UYU = 43.2;

export type Currency = "USD" | "ARS" | "UYU";

export type WeekPrice = { week: string; label: string; usd: number };

export type GrainPrice = {
  grain: string;
  label: string;
  region: string;
  lastUSD: number;
  prevUSD: number;
  history: WeekPrice[]; // 52 weeks, oldest → newest
};

/* Generate N weeks of price history ending at a reference date */
function weeks(base: number, volatility: number, n = 52): WeekPrice[] {
  const result: WeekPrice[] = [];
  let price = base * (0.88 + Math.random() * 0.08);
  const end = new Date("2026-04-28");
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i * 7);
    const label = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
    const year = d.getFullYear().toString().slice(2);
    // Add a slight seasonal trend + random walk
    const seasonal = Math.sin((d.getMonth() / 12) * 2 * Math.PI) * volatility * 0.5;
    price = price + (Math.random() - 0.47) * volatility + seasonal * 0.3;
    price = Math.max(price, base * 0.6); // floor at 60% of base
    result.push({ week: label, label: `${label}/${year}`, usd: Math.round(price * 10) / 10 });
  }
  return result;
}

function make(grain: string, label: string, region: string, base: number, vol: number): GrainPrice {
  const history = weeks(base, vol, 52);
  return {
    grain, label, region,
    lastUSD: history[history.length - 1].usd,
    prevUSD: history[history.length - 2].usd,
    history,
  };
}

export const GRAIN_PRICES: GrainPrice[] = [
  make("soja",    "Soja",    "Rosario",         402, 7),
  make("maiz",    "Maíz",    "Rosario",         188, 4),
  make("trigo",   "Trigo",   "Buenos Aires",    242, 5),
  make("girasol", "Girasol", "Buenos Aires",    525, 9),
  make("sorgo",   "Sorgo",   "Córdoba",         172, 3),
  make("cebada",  "Cebada",  "Buenos Aires",    215, 4),
  make("avena",   "Avena",   "Uruguay",         225, 3),
  make("arroz",   "Arroz",   "Entre Ríos",      585, 8),
];

export const REGIONS_AR = [
  "Buenos Aires", "Córdoba", "Santa Fe", "Entre Ríos", "La Pampa",
  "Mendoza", "San Juan", "Neuquén", "Río Negro", "Chubut",
  "Salta", "Jujuy", "Tucumán", "Santiago del Estero", "Chaco",
  "Formosa", "Misiones", "Corrientes", "La Rioja", "Catamarca",
  "San Luis", "Santa Cruz", "Tierra del Fuego",
];

export const REGIONS_UY = [
  "Montevideo", "Canelones", "Maldonado", "Colonia", "San José",
  "Flores", "Florida", "Durazno", "Tacuarembó", "Rivera",
  "Artigas", "Salto", "Paysandú", "Río Negro", "Soriano",
  "Rocha", "Lavalleja", "Treinta y Tres", "Cerro Largo",
];

export function convertPrice(usd: number, currency: Currency): number {
  if (currency === "ARS") return Math.round(usd * USD_TO_ARS);
  if (currency === "UYU") return Math.round(usd * USD_TO_UYU * 10) / 10;
  return usd;
}

export function formatCurrencyPrice(value: number, currency: Currency): string {
  if (currency === "ARS") return `$${value.toLocaleString("es-AR")}`;
  if (currency === "UYU") return `$U ${value.toLocaleString("es-UY")}`;
  return `USD ${value.toLocaleString("en-US", { minimumFractionDigits: 1 })}`;
}

export const RANGE_OPTIONS = [
  { value: 4,  label: "4 sem" },
  { value: 8,  label: "8 sem" },
  { value: 12, label: "12 sem" },
  { value: 26, label: "6 meses" },
  { value: 52, label: "1 año" },
] as const;

export type RangeOption = typeof RANGE_OPTIONS[number]["value"];
