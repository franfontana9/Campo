import type { Currency } from "./constants";

/**
 * Tasas de referencia mock — USD = 1.
 * En producción esto va a venir de un proveedor (BCRA, OXR, fixer, ECB, etc.)
 * con caché diaria. Por ahora son valores plausibles para 2026.
 */
const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  ARS: 1100,
  BRL: 5.1,
};

const SYMBOL: Record<Currency, string> = {
  USD: "USD",
  EUR: "EUR",
  ARS: "ARS",
  BRL: "BRL",
};

export function convertPrice(
  amount: number,
  from: Currency,
  to: Currency,
): number {
  if (from === to) return amount;
  const inUsd = amount / RATES[from];
  return inUsd * RATES[to];
}

export function formatInCurrency(
  amount: number | null,
  currency: Currency,
): string {
  if (amount === null || amount === undefined) return "A convenir";
  const fractionDigits = currency === "ARS" || currency === "BRL" ? 0 : 0;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

/**
 * Convierte y formatea un precio expresado en `from` hacia la moneda `to`.
 * Si `to` no se pasa o coincide, devuelve el formato original.
 */
export function formatPriceIn(
  amount: number | null,
  from: Currency,
  to: Currency,
): string {
  if (amount === null || amount === undefined) return "A convenir";
  const converted = convertPrice(amount, from, to);
  return formatInCurrency(converted, to);
}

export const CURRENCY_LABEL = SYMBOL;
