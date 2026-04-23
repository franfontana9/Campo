"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { GRAIN_TYPES, COUNTRIES, PRICE_MODES } from "@/lib/constants";

export function ListingFilters() {
  const router = useRouter();
  const sp = useSearchParams();

  const update = useCallback(
    (patch: Record<string, string | undefined>) => {
      const params = new URLSearchParams(sp.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (!v) params.delete(k);
        else params.set(k, v);
      });
      router.push(`/marketplace?${params.toString()}`);
    },
    [router, sp],
  );

  const reset = () => router.push("/marketplace");
  const hasActive = Array.from(sp.keys()).length > 0;

  return (
    <div className="rounded-2xl border border-ink-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-ink-500" />
          <p className="text-sm font-semibold text-ink-900">Filtros</p>
        </div>
        {hasActive && (
          <button
            type="button"
            onClick={reset}
            className="text-xs font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-5 p-5">
        <Field label="Grano" htmlFor="f-grain">
          <Select
            id="f-grain"
            defaultValue={sp.get("grain") ?? ""}
            onChange={(e) => update({ grain: e.target.value || undefined })}
          >
            <option value="">Todos</option>
            {GRAIN_TYPES.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="País" htmlFor="f-country">
          <Select
            id="f-country"
            defaultValue={sp.get("country") ?? ""}
            onChange={(e) => update({ country: e.target.value || undefined })}
          >
            <option value="">Todos</option>
            {COUNTRIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Toneladas">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <Input
              type="number"
              min={0}
              placeholder="Mín"
              defaultValue={sp.get("min") ?? ""}
              onBlur={(e) => update({ min: e.target.value || undefined })}
            />
            <span className="text-ink-300">—</span>
            <Input
              type="number"
              min={0}
              placeholder="Máx"
              defaultValue={sp.get("max") ?? ""}
              onBlur={(e) => update({ max: e.target.value || undefined })}
            />
          </div>
        </Field>

        <Field label="Modalidad" htmlFor="f-mode">
          <Select
            id="f-mode"
            defaultValue={sp.get("mode") ?? ""}
            onChange={(e) => update({ mode: e.target.value || undefined })}
          >
            <option value="">Todas</option>
            {PRICE_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Ordenar" htmlFor="f-sort">
          <Select
            id="f-sort"
            defaultValue={sp.get("sort") ?? "recent"}
            onChange={(e) => update({ sort: e.target.value })}
          >
            <option value="recent">Más recientes</option>
            <option value="price_asc">Precio ↑</option>
            <option value="price_desc">Precio ↓</option>
            <option value="tonnage_desc">Más toneladas</option>
          </Select>
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
