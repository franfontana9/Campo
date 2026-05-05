"use client";

import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatPriceIn } from "@/lib/currency";
import type { Currency } from "@/lib/constants";

type Props = {
  amount: number | null;
  from: Currency;
  /** Si true, muestra "≈" cuando hubo conversión, para señalar que es referencial. */
  showApprox?: boolean;
  /** Texto cuando amount es null. */
  fallback?: string;
  className?: string;
};

/**
 * Muestra un precio convertido a la moneda preferida del usuario (ver CurrencyProvider).
 * Si la moneda destino coincide con la origen, muestra el valor tal cual.
 */
export function DisplayPrice({
  amount,
  from,
  showApprox = true,
  fallback = "A convenir",
  className,
}: Props) {
  const { currency: to, ready } = useCurrency();

  if (amount === null || amount === undefined) {
    return <span className={className}>{fallback}</span>;
  }

  // Antes de hidratar mostramos el original — evita mismatch SSR/client
  const target: Currency = ready ? to : from;
  const converted = formatPriceIn(amount, from, target);
  const showHint = showApprox && target !== from;

  return (
    <span className={className}>
      {showHint && <span className="text-ink-400">≈ </span>}
      {converted}
    </span>
  );
}
