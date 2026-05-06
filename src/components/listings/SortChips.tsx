"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Clock, ArrowDownNarrowWide, ArrowUpNarrowWide, Scale } from "lucide-react";

type Option = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const OPTIONS: Option[] = [
  { value: "recent", label: "Más recientes", icon: <Clock className="h-3.5 w-3.5" /> },
  {
    value: "price_asc",
    label: "Precio ↑",
    icon: <ArrowUpNarrowWide className="h-3.5 w-3.5" />,
  },
  {
    value: "price_desc",
    label: "Precio ↓",
    icon: <ArrowDownNarrowWide className="h-3.5 w-3.5" />,
  },
  {
    value: "tonnage_desc",
    label: "Más volumen",
    icon: <Scale className="h-3.5 w-3.5" />,
  },
];

export function SortChips() {
  const router = useRouter();
  const sp = useSearchParams();
  const current = sp.get("sort") ?? "recent";

  function setSort(v: string) {
    const params = new URLSearchParams(sp.toString());
    if (v === "recent") params.delete("sort");
    else params.set("sort", v);
    const qs = params.toString();
    router.push(qs ? `/marketplace?${qs}` : "/marketplace");
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
        Ordenar
      </span>
      <div className="flex flex-wrap gap-1.5">
        {OPTIONS.map((opt) => {
          const active = opt.value === current;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSort(opt.value)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                active
                  ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                  : "border-ink-200 bg-white text-ink-700 hover:border-brand-400 hover:bg-brand-50/40"
              }`}
              aria-pressed={active}
            >
              {opt.icon}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
