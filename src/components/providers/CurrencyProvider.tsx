"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Currency } from "@/lib/constants";

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  ready: boolean;
};

const CurrencyContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "campo:display-currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Currency | null;
      if (saved) setCurrencyState(saved);
    } catch {
      // ignore — privacy mode, etc.
    }
    setReady(true);
  }, []);

  function setCurrency(c: Currency) {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // ignore
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, ready }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Sin provider — devolvemos default sin romper SSR
    return { currency: "USD" as Currency, setCurrency: () => {}, ready: false };
  }
  return ctx;
}
