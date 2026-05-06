"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { formatPriceIn } from "@/lib/currency";
import type { Currency } from "@/lib/constants";

type Props = {
  pricePerTon: number;
  totalTonnage: number;
  fromCurrency: Currency;
};

/**
 * Recalcula el total estimado para un tonelaje arbitrario.
 * Útil cuando el comprador quiere una porción del lote o hacer cuentas rápidas.
 */
export function PriceCalculator({
  pricePerTon,
  totalTonnage,
  fromCurrency,
}: Props) {
  const { currency: target, ready } = useCurrency();
  const [tons, setTons] = useState(totalTonnage);

  const safe = Math.max(0, Math.min(tons, totalTonnage));
  const subtotal = pricePerTon * safe;
  const display: Currency = ready ? target : fromCurrency;
  const formatted = formatPriceIn(subtotal, fromCurrency, display);
  const showApprox = display !== fromCurrency;

  return (
    <div className="border-t border-ink-100 bg-white p-7">
      <div className="flex items-center gap-2">
        <Calculator className="h-3.5 w-3.5 text-brand-700" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
          Calculá tu volumen
        </p>
      </div>
      <div className="mt-3">
        <label htmlFor="calc-tons" className="text-xs text-ink-600">
          Toneladas a comprar
        </label>
        <div className="mt-1.5 flex items-center gap-3">
          <input
            id="calc-tons"
            type="range"
            min={0}
            max={totalTonnage}
            step={Math.max(1, Math.round(totalTonnage / 100))}
            value={safe}
            onChange={(e) => setTons(Number(e.target.value))}
            className="flex-1 accent-brand-700"
          />
          <input
            type="number"
            min={0}
            max={totalTonnage}
            value={safe}
            onChange={(e) => setTons(Number(e.target.value) || 0)}
            className="h-9 w-20 rounded-lg border border-ink-200 bg-white px-2 text-right text-sm text-ink-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
          <span className="text-xs text-ink-500">/ {totalTonnage} t</span>
        </div>
      </div>
      <p className="mt-4 flex items-baseline justify-between border-t border-dashed border-ink-200 pt-3">
        <span className="text-xs text-ink-500">Total estimado</span>
        <span className="font-display text-xl font-medium text-ink-900">
          {showApprox && <span className="text-ink-400">≈ </span>}
          {formatted}
        </span>
      </p>
    </div>
  );
}
