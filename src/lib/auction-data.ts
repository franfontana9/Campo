export type AuctionStatus = "live" | "upcoming" | "ended";

export type AuctionSpec = {
  id: string;
  grain: string;
  grainLabel: string;
  grainColor: string;
  region: string;
  country: "AR" | "UY";
  tonnage: number;
  quality: string;
  reserveUSD: number;
  currentBidUSD: number;
  bidCount: number;
  secondsTotal: number;
  secondsElapsed: number;
  status: AuctionStatus;
  seller: string;
  description: string;
};

export const AUCTIONS: AuctionSpec[] = [
  {
    id: "auc-1",
    grain: "soja",
    grainLabel: "Soja",
    grainColor: "#d97706",
    region: "Rosario",
    country: "AR",
    tonnage: 500,
    quality: "Grado 1 · 46% proteína · humedad 12%",
    reserveUSD: 196_000,
    currentBidUSD: 202_500,
    bidCount: 14,
    secondsTotal: 30 * 60,
    secondsElapsed: 22 * 60,
    status: "live",
    seller: "Grupo Pampa SA",
    description: "Soja cosecha 2026. Disponible en puerto Rosario. Documentación completa.",
  },
  {
    id: "auc-2",
    grain: "maiz",
    grainLabel: "Maíz",
    grainColor: "#eab308",
    region: "Córdoba",
    country: "AR",
    tonnage: 1_000,
    quality: "Grado 2 · humedad 14% · sin aflatoxinas",
    reserveUSD: 182_000,
    currentBidUSD: 189_800,
    bidCount: 9,
    secondsTotal: 60 * 60,
    secondsElapsed: 47 * 60,
    status: "live",
    seller: "Agroexport Cba SRL",
    description: "Maíz duro amarillo. Disponible en silo bolsa en campo. Logística coordinada.",
  },
  {
    id: "auc-3",
    grain: "trigo",
    grainLabel: "Trigo",
    grainColor: "#f59e0b",
    region: "Buenos Aires",
    country: "AR",
    tonnage: 750,
    quality: "Grado 1 · proteína 12.5% · falling number 350",
    reserveUSD: 178_500,
    currentBidUSD: 185_000,
    bidCount: 6,
    secondsTotal: 45 * 60,
    secondsElapsed: 38 * 60,
    status: "live",
    seller: "Cerealera del Sur",
    description: "Trigo pan. Entrega en planta industrial Buenos Aires. Calidad panadería.",
  },
  {
    id: "auc-4",
    grain: "girasol",
    grainLabel: "Girasol",
    grainColor: "#fbbf24",
    region: "La Pampa",
    country: "AR",
    tonnage: 300,
    quality: "Alto oleico · acidez < 0.5% · humedad 8%",
    reserveUSD: 153_000,
    currentBidUSD: 0,
    bidCount: 0,
    secondsTotal: 90 * 60,
    secondsElapsed: -4 * 3600,
    status: "upcoming",
    seller: "Pampas Commodities",
    description: "Girasol alto oleico para exportación. Subasta en 4 horas.",
  },
  {
    id: "auc-5",
    grain: "sorgo",
    grainLabel: "Sorgo",
    grainColor: "#b45309",
    region: "Salta",
    country: "AR",
    tonnage: 600,
    quality: "Grado 1 · rojo granífero · sin táninos",
    reserveUSD: 99_600,
    currentBidUSD: 0,
    bidCount: 0,
    secondsTotal: 60 * 60,
    secondsElapsed: -18 * 3600,
    status: "upcoming",
    seller: "NOA Agro SA",
    description: "Sorgo granífero norte. Disponible en planta local. Subasta mañana.",
  },
  {
    id: "auc-6",
    grain: "cebada",
    grainLabel: "Cebada",
    grainColor: "#92400e",
    region: "Colonia",
    country: "UY",
    tonnage: 400,
    quality: "Cervecera · calibre ≥ 2.5mm · proteína 10–12%",
    reserveUSD: 84_000,
    currentBidUSD: 0,
    bidCount: 0,
    secondsTotal: 45 * 60,
    secondsElapsed: -36 * 3600,
    status: "upcoming",
    seller: "Campos del Este SAS",
    description: "Cebada cervecera calidad exportación. Puerto Montevideo. Subasta pasado mañana.",
  },
  {
    id: "auc-7",
    grain: "soja",
    grainLabel: "Soja",
    grainColor: "#d97706",
    region: "Santa Fe",
    country: "AR",
    tonnage: 800,
    quality: "Grado 2 · 45% proteína",
    reserveUSD: 314_400,
    currentBidUSD: 328_000,
    bidCount: 21,
    secondsTotal: 30 * 60,
    secondsElapsed: 32 * 60,
    status: "ended",
    seller: "Litoral Granos SRL",
    description: "Subasta finalizada. Adjudicada al mejor postor.",
  },
  {
    id: "auc-8",
    grain: "arroz",
    grainLabel: "Arroz",
    grainColor: "#6d28d9",
    region: "Entre Ríos",
    country: "AR",
    tonnage: 250,
    quality: "Largo fino · perlado · humedad 13%",
    reserveUSD: 143_750,
    currentBidUSD: 149_000,
    bidCount: 8,
    secondsTotal: 45 * 60,
    secondsElapsed: 48 * 60,
    status: "ended",
    seller: "Arrocera Paraná",
    description: "Arroz largo fino. Finalizada. Precio adjudicado: USD 596/t.",
  },
  {
    id: "auc-9",
    grain: "maiz",
    grainLabel: "Maíz",
    grainColor: "#eab308",
    region: "Montevideo",
    country: "UY",
    tonnage: 500,
    quality: "Grado 1 · humedad 13%",
    reserveUSD: 91_500,
    currentBidUSD: 94_000,
    bidCount: 5,
    secondsTotal: 60 * 60,
    secondsElapsed: 65 * 60,
    status: "ended",
    seller: "Uruguay Cereales SA",
    description: "Maíz uruguayo. Subasta finalizada.",
  },
];

export function liveAuctions() {
  return AUCTIONS.filter((a) => a.status === "live");
}
export function upcomingAuctions() {
  return AUCTIONS.filter((a) => a.status === "upcoming");
}
export function endedAuctions() {
  return AUCTIONS.filter((a) => a.status === "ended");
}

export function seededBids(auc: AuctionSpec): { bidder: string; amountUSD: number; agoLabel: string }[] {
  if (auc.status === "upcoming" || auc.bidCount === 0) return [];
  const bidders = [
    "Agro Inversiones SA", "Pampa Trading", "CerealGroup", "Export Granos SRL",
    "Sur Commodities", "Delta Agro", "Nortex SA", "BioGrain",
    "Campo Abierto", "Las Lomas SRL", "Litoral Trade", "Cordillera Grains",
  ];
  const count = Math.min(auc.bidCount, 8);
  const result = [];
  let price = auc.reserveUSD * 0.995;
  const step = (auc.currentBidUSD - price) / count;
  let minutesAgo = auc.secondsElapsed / 60;
  for (let i = 0; i < count; i++) {
    price += step * (0.7 + 0.6 * ((i * 7919 + 1234) % 100) / 100);
    minutesAgo -= (1 + ((i * 13 + 3) % 8));
    result.push({
      bidder: bidders[i % bidders.length],
      amountUSD: Math.round(price / 100) * 100,
      agoLabel: minutesAgo < 1 ? "hace instantes" : minutesAgo < 60 ? `hace ${Math.round(minutesAgo)} min` : `hace ${Math.round(minutesAgo / 60)}h`,
    });
  }
  return result.reverse();
}
