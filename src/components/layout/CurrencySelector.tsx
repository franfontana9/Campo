"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Coins } from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/components/providers/CurrencyProvider";
import { CURRENCIES, type Currency } from "@/lib/constants";

export function CurrencySelector() {
  const { currency, setCurrency, ready } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function handleSelect(c: Currency) {
    if (c === currency) {
      setOpen(false);
      return;
    }
    setCurrency(c);
    setOpen(false);
    toast.success(`Mostrando precios en ${c}`, {
      description: "Tu preferencia se guardó en este dispositivo.",
    });
  }

  // Mientras hidrata mostramos un placeholder estable
  const label = ready ? currency : "USD";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 text-xs font-medium text-ink-700 transition-all duration-200 hover:border-brand-400 hover:text-ink-900 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/30"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Coins className="h-3.5 w-3.5 text-brand-700" />
        <span>{label}</span>
        <ChevronDown
          className={`h-3 w-3 text-ink-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="anim-fade-up absolute right-0 top-[calc(100%+8px)] z-50 w-44 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-xl"
        >
          <div className="border-b border-ink-100 bg-ink-50/80 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
              Mostrar precios en
            </p>
          </div>
          <ul className="py-1">
            {CURRENCIES.map((c) => {
              const active = c.value === currency;
              return (
                <li key={c.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(c.value)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-brand-50 text-brand-800"
                        : "text-ink-700 hover:bg-ink-50 hover:text-ink-900"
                    }`}
                    role="option"
                    aria-selected={active}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{c.value}</span>
                      <span className="text-xs text-ink-500">{c.label}</span>
                    </span>
                    {active && <Check className="h-3.5 w-3.5 text-brand-700" />}
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-ink-100 bg-ink-50/40 px-3 py-2 text-[10px] text-ink-500">
            Conversión referencial. La negociación final ocurre en la moneda del
            vendedor.
          </p>
        </div>
      )}
    </div>
  );
}
