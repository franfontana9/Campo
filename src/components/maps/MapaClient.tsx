"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, CloudSun } from "lucide-react";
import { ClimaClient } from "@/components/weather/ClimaClient";
import { GeoClient } from "@/components/geo/GeoClient";

type Layer = "ofertas" | "clima";

const LAYERS: {
  value: Layer;
  label: string;
  icon: React.ReactNode;
  hint: string;
}[] = [
  {
    value: "ofertas",
    label: "Ofertas",
    icon: <MapPin className="h-3.5 w-3.5" />,
    hint: "Dónde se está vendiendo qué",
  },
  {
    value: "clima",
    label: "Clima",
    icon: <CloudSun className="h-3.5 w-3.5" />,
    hint: "Temperatura y lluvia por provincia",
  },
];

function isLayer(v: string | null): v is Layer {
  return v === "ofertas" || v === "clima";
}

export function MapaClient() {
  const sp = useSearchParams();
  const router = useRouter();
  const param = sp.get("layer");
  const active: Layer = isLayer(param) ? param : "ofertas";
  const activeMeta = LAYERS.find((l) => l.value === active)!;

  function setLayer(v: Layer) {
    const params = new URLSearchParams(sp.toString());
    params.set("layer", v);
    router.replace(`/mapa?${params.toString()}`, { scroll: false });
  }

  return (
    <div>
      {/* Selector de capa — header del mapa (no-sticky para no tapar contenido al scrollear) */}
      <div className="border-b border-ink-100 bg-white">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-3 px-6 py-3 lg:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-500">
            Mapa
          </p>
          <span
            aria-hidden
            className="hidden h-3 w-px bg-ink-200 sm:inline-block"
          />
          <div
            role="tablist"
            aria-label="Capa del mapa"
            className="flex items-center gap-1 rounded-full border border-ink-200 bg-ink-50/60 p-0.5"
          >
            {LAYERS.map((l) => {
              const isActive = active === l.value;
              return (
                <button
                  key={l.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setLayer(l.value)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-brand-700 text-white shadow-sm"
                      : "text-ink-700 hover:text-ink-900"
                  }`}
                >
                  {l.icon}
                  {l.label}
                </button>
              );
            })}
          </div>
          <span className="hidden text-[11px] text-ink-500 md:inline">
            {activeMeta.hint}
          </span>
        </div>
      </div>

      {/* Ambas capas montadas — alternamos visibilidad para preservar
          el estado interno (zoom, filtros, provincia seleccionada) de cada
          capa al cambiar de tab. */}
      <div
        aria-hidden={active !== "ofertas"}
        style={{ display: active === "ofertas" ? "block" : "none" }}
      >
        <GeoClient />
      </div>
      <div
        aria-hidden={active !== "clima"}
        style={{ display: active === "clima" ? "block" : "none" }}
      >
        <ClimaClient />
      </div>
    </div>
  );
}
