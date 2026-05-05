/* ─── Loan & Credit Products ─────────────────────────────────────── */

export type LoanProduct = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  minUSD: number;
  maxUSD: number;
  minDays: number;
  maxDays: number;
  baseRateAnnual: number; // base annual rate for best-risk borrower
  maxRateAnnual: number;  // max annual rate for worst-risk borrower
  platformFeeRate: number; // platform fee (annual)
  forBuyer: boolean;
  forSeller: boolean;
  collateralRequired: boolean;
  tag: string;
};

export const LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: "adelanto_cosecha",
    name: "Adelanto de cosecha",
    shortName: "Adelanto",
    description: "El productor recibe fondos ahora a cambio de entregar o vender su grano en una fecha futura acordada. La plataforma adelanta el valor neto del grano con un descuento.",
    minUSD: 5_000,
    maxUSD: 500_000,
    minDays: 30,
    maxDays: 180,
    baseRateAnnual: 0.06,
    maxRateAnnual: 0.18,
    platformFeeRate: 0.015,
    forBuyer: false,
    forSeller: true,
    collateralRequired: true,
    tag: "Productor",
  },
  {
    id: "credito_comprador",
    name: "Crédito comprador",
    shortName: "Crédito",
    description: "Financiamiento para compradores de granos. Permite cerrar operaciones sin inmovilizar capital propio. El grano adquirido actúa como garantía hasta la reventa.",
    minUSD: 10_000,
    maxUSD: 1_000_000,
    minDays: 15,
    maxDays: 120,
    baseRateAnnual: 0.08,
    maxRateAnnual: 0.24,
    platformFeeRate: 0.02,
    forBuyer: true,
    forSeller: false,
    collateralRequired: true,
    tag: "Comprador",
  },
  {
    id: "financiamiento_almacenamiento",
    name: "Financiamiento de acopio",
    shortName: "Acopio",
    description: "Crédito a corto plazo para financiar costos de almacenamiento y conservación. El stock en silo actúa como garantía. Ideal para retener grano esperando mejor precio.",
    minUSD: 3_000,
    maxUSD: 200_000,
    minDays: 30,
    maxDays: 270,
    baseRateAnnual: 0.07,
    maxRateAnnual: 0.20,
    platformFeeRate: 0.012,
    forBuyer: false,
    forSeller: true,
    collateralRequired: true,
    tag: "Productor / Acopio",
  },
  {
    id: "descuento_factura",
    name: "Descuento de factura",
    shortName: "Facturas",
    description: "Anticipo sobre facturas emitidas a compradores calificados. El productor cobra al instante; el comprador paga al vencimiento original. Sin garantía real requerida.",
    minUSD: 2_000,
    maxUSD: 150_000,
    minDays: 10,
    maxDays: 90,
    baseRateAnnual: 0.09,
    maxRateAnnual: 0.22,
    platformFeeRate: 0.018,
    forBuyer: false,
    forSeller: true,
    collateralRequired: false,
    tag: "Sin garantía",
  },
];

/* ─── Risk Scoring ───────────────────────────────────────────────── */

export type RiskLevel = "A" | "B" | "C" | "D";

export type RiskFactor = {
  key: string;
  label: string;
  description: string;
  options: { value: string; label: string; points: number }[];
};

export const RISK_FACTORS: RiskFactor[] = [
  {
    key: "history",
    label: "Historial en la plataforma",
    description: "Transacciones previas completadas en Campo",
    options: [
      { value: "none", label: "Sin historial", points: 0 },
      { value: "new", label: "1–3 operaciones", points: 15 },
      { value: "medium", label: "4–10 operaciones", points: 25 },
      { value: "good", label: "Más de 10 operaciones", points: 35 },
    ],
  },
  {
    key: "volume",
    label: "Volumen anual operado",
    description: "Toneladas compradas/vendidas en los últimos 12 meses",
    options: [
      { value: "low", label: "Menos de 200 t", points: 0 },
      { value: "mid", label: "200–1.000 t", points: 10 },
      { value: "high", label: "1.000–5.000 t", points: 20 },
      { value: "xlarge", label: "Más de 5.000 t", points: 30 },
    ],
  },
  {
    key: "collateral",
    label: "Calidad del colateral",
    description: "Tipo de garantía ofrecida para la operación",
    options: [
      { value: "none", label: "Sin garantía", points: 0 },
      { value: "stock", label: "Stock físico en silo", points: 15 },
      { value: "field", label: "Contrato de cosecha + seguro", points: 25 },
      { value: "real", label: "Garantía real (campo/inmueble)", points: 30 },
    ],
  },
  {
    key: "ltv",
    label: "Ratio LTV solicitado",
    description: "Monto del crédito vs. valor del colateral",
    options: [
      { value: "high", label: "Más del 80% del valor", points: 0 },
      { value: "mid", label: "60–80%", points: 10 },
      { value: "low", label: "40–60%", points: 20 },
      { value: "vlow", label: "Menos del 40%", points: 25 },
    ],
  },
  {
    key: "country",
    label: "País de operación",
    description: "Riesgo regulatorio y cambiario por jurisdicción",
    options: [
      { value: "ar", label: "Argentina", points: 5 },
      { value: "uy", label: "Uruguay", points: 20 },
      { value: "br", label: "Brasil", points: 12 },
    ],
  },
];

export function computeRiskScore(answers: Record<string, string>): {
  score: number;
  level: RiskLevel;
  label: string;
  color: string;
  spread: number; // extra rate over base, as annual
} {
  let total = 0;
  for (const factor of RISK_FACTORS) {
    const chosen = factor.options.find((o) => o.value === answers[factor.key]);
    if (chosen) total += chosen.points;
  }

  const maxScore = RISK_FACTORS.reduce(
    (sum, f) => sum + Math.max(...f.options.map((o) => o.points)),
    0
  );

  const pct = total / maxScore; // 0..1

  if (pct >= 0.75) return { score: total, level: "A", label: "Riesgo bajo",    color: "#4f632f", spread: 0 };
  if (pct >= 0.50) return { score: total, level: "B", label: "Riesgo moderado",color: "#c97b55", spread: 0.04 };
  if (pct >= 0.30) return { score: total, level: "C", label: "Riesgo alto",    color: "#b66240", spread: 0.08 };
  return                { score: total, level: "D", label: "Riesgo muy alto",  color: "#9b2c2c", spread: 0.14 };
}

/* ─── Simulation ─────────────────────────────────────────────────── */

export type SimResult = {
  principal: number;
  termDays: number;
  annualRateBorrower: number;  // what borrower pays (base + spread + platform)
  annualRateInvestor: number;  // what lender earns (borrower rate - platform)
  platformRevenue: number;
  interestBorrower: number;
  totalBorrower: number;
  interestInvestor: number;
  dailyRate: number;
  effectiveMonthlyRate: number;
  tna: number;   // tasa nominal anual borrower
  tea: number;   // tasa efectiva anual borrower
  schedule: PaymentRow[];
  riskLevel: RiskLevel;
  riskLabel: string;
  riskColor: string;
  riskScore: number;
};

export type PaymentRow = {
  period: number;
  label: string;
  principal: number;
  interest: number;
  total: number;
  balance: number;
};

export function simulate(
  product: LoanProduct,
  principal: number,
  termDays: number,
  riskAnswers: Record<string, string>,
  amortization: "bullet" | "lineal" | "frances"
): SimResult {
  const risk = computeRiskScore(riskAnswers);

  // Clamp rate between base and max
  const rawRate = product.baseRateAnnual + risk.spread;
  const tna = Math.min(rawRate, product.maxRateAnnual);
  const investorRate = tna - product.platformFeeRate;

  // Effective annual rate
  const tea = Math.pow(1 + tna / 365, 365) - 1;

  const dailyRate = tna / 365;
  const effectiveMonthlyRate = Math.pow(1 + dailyRate, 30) - 1;

  // Interest for borrower
  const termFactor = termDays / 365;
  const interestBorrower = principal * tna * termFactor;
  const totalBorrower = principal + interestBorrower;
  const interestInvestor = principal * investorRate * termFactor;
  const platformRevenue = interestBorrower - interestInvestor;

  // Build schedule (monthly periods)
  const schedule: PaymentRow[] = [];
  const periods = Math.max(1, Math.round(termDays / 30));
  const daysPerPeriod = termDays / periods;
  const periodRate = tna * (daysPerPeriod / 365);

  if (amortization === "bullet") {
    // Interest only, principal at end
    for (let i = 1; i <= periods; i++) {
      const interest = principal * periodRate;
      const isLast = i === periods;
      schedule.push({
        period: i,
        label: `Mes ${i}`,
        principal: isLast ? principal : 0,
        interest,
        total: isLast ? principal + interest : interest,
        balance: isLast ? 0 : principal,
      });
    }
  } else if (amortization === "lineal") {
    // Equal principal payments
    const principalPerPeriod = principal / periods;
    let balance = principal;
    for (let i = 1; i <= periods; i++) {
      const interest = balance * periodRate;
      balance -= principalPerPeriod;
      schedule.push({
        period: i,
        label: `Mes ${i}`,
        principal: principalPerPeriod,
        interest,
        total: principalPerPeriod + interest,
        balance: Math.max(0, balance),
      });
    }
  } else {
    // Frances (equal installments)
    const pmt = (principal * periodRate) / (1 - Math.pow(1 + periodRate, -periods));
    let balance = principal;
    for (let i = 1; i <= periods; i++) {
      const interest = balance * periodRate;
      const principalPaid = pmt - interest;
      balance -= principalPaid;
      schedule.push({
        period: i,
        label: `Mes ${i}`,
        principal: principalPaid,
        interest,
        total: pmt,
        balance: Math.max(0, balance),
      });
    }
  }

  return {
    principal,
    termDays,
    annualRateBorrower: tna,
    annualRateInvestor: investorRate,
    platformRevenue,
    interestBorrower,
    totalBorrower,
    interestInvestor,
    dailyRate,
    effectiveMonthlyRate,
    tna,
    tea,
    schedule,
    riskLevel: risk.level,
    riskLabel: risk.label,
    riskColor: risk.color,
    riskScore: risk.score,
  };
}

export function fmtUSD(n: number) {
  return `USD ${n.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function fmtPct(n: number, decimals = 2) {
  return `${(n * 100).toFixed(decimals)}%`;
}
