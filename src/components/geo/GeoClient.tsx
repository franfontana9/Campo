"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { ChevronRight, Package, X, ZoomIn, Plus, Minus, RotateCcw, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import { grainLabel, GRAIN_TYPES } from "@/lib/constants";
import type { Listing } from "@/lib/types";

/* ─── Marker popup ───────────────────────────────────────────────── */
function MarkerPopup({ listing, x, y, currency }: { listing: Listing; x: number; y: number; currency: DisplayCurrency }) {
  const prices = listing.price !== null ? {
    primary: fmtPrice(listing.price, listing.currency, currency),
    usd: `USD ${toUSD(listing.price, listing.currency).toFixed(0)}`,
    ars: `$ ${Math.round(fromUSD(toUSD(listing.price, listing.currency), "ARS")).toLocaleString("es-AR")}`,
    uyu: `$U ${Math.round(fromUSD(toUSD(listing.price, listing.currency), "UYU")).toLocaleString("es-UY")}`,
  } : null;

  return (
    <div
      style={{ left: x + 14, top: y - 60, zIndex: 9999 }}
      className="pointer-events-none fixed min-w-[200px] rounded-xl border border-ink-200 bg-white p-3 shadow-xl"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-accent-500" />
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">{grainLabel(listing.grain_type)}</p>
      </div>
      <p className="text-sm font-medium text-ink-900">
        {listing.tonnage.toLocaleString()} t
        <span className="ml-1 text-xs font-normal text-ink-500">· {listing.city}</span>
      </p>
      {prices ? (
        <>
          <p className="mt-1.5 font-display text-base font-semibold text-ink-900">
            {prices.primary}<span className="text-xs font-normal text-ink-400">/t</span>
          </p>
          <div className="mt-1 space-y-px text-[10px] text-ink-400">
            {currency !== "USD" && <p>{prices.usd}</p>}
            {currency !== "ARS" && <p>{prices.ars}</p>}
            {currency !== "UYU" && <p>{prices.uyu}</p>}
          </div>
        </>
      ) : (
        <p className="mt-1 text-sm text-ink-400">Precio a convenir</p>
      )}
      <p className="mt-2 truncate text-[10px] text-ink-400">{listing.seller?.full_name}</p>
    </div>
  );
}

/* ─── Geo files ─────────────────────────────────────────────────── */
const AR_GEO = "/geo/argentina.geojson";
const UY_GEO = "/geo/uruguay.geojson";

/* ─── Currency helpers ──────────────────────────────────────────── */
type DisplayCurrency = "USD" | "ARS" | "UYU";

const RATES_TO_USD: Record<string, number> = {
  USD: 1, ARS: 1 / 1285, UYU: 1 / 43.2, EUR: 1.08, BRL: 0.19,
};

function toUSD(price: number, currency: string) {
  return price * (RATES_TO_USD[currency] ?? 1);
}
function fromUSD(usd: number, target: DisplayCurrency) {
  if (target === "ARS") return usd * 1285;
  if (target === "UYU") return usd * 43.2;
  return usd;
}
function fmtPrice(price: number | null, origCur: string, target: DisplayCurrency): string {
  if (price === null) return "A convenir";
  const usd = toUSD(price, origCur);
  const v = fromUSD(usd, target);
  if (target === "ARS") return `$ ${Math.round(v).toLocaleString("es-AR")}`;
  if (target === "UYU") return `$U ${Math.round(v).toLocaleString("es-UY")}`;
  return `USD ${v.toFixed(0)}`;
}
function allPrices(price: number | null, origCur: string) {
  if (price === null) return null;
  const usd = toUSD(price, origCur);
  return {
    usd: `USD ${usd.toFixed(0)}`,
    ars: `$ ${Math.round(fromUSD(usd, "ARS")).toLocaleString("es-AR")}`,
    uyu: `$U ${Math.round(fromUSD(usd, "UYU")).toLocaleString("es-UY")}`,
  };
}

/* ─── Map data ───────────────────────────────────────────────────── */
function normalizeName(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
}

const REGION_TO_GEO: Record<string, string> = {
  "Córdoba": "Córdoba", "Buenos Aires": "Buenos Aires", "Santa Fe": "Santa Fe",
  "Entre Ríos": "Entre Ríos", "Mendoza": "Mendoza", "San Juan": "San Juan",
  "Corrientes": "Corrientes", "Misiones": "Misiones", "Chaco": "Chaco",
  "Salta": "Salta", "Jujuy": "Jujuy", "Tucumán": "Tucumán",
  "Santiago del Estero": "Santiago del Estero", "La Pampa": "La Pampa",
  "Neuquén": "Neuquén", "Río Negro": "Río Negro", "Chubut": "Chubut",
  "Santa Cruz": "Santa Cruz", "Tierra del Fuego": "Tierra del Fuego",
  "La Rioja": "La Rioja", "Catamarca": "Catamarca", "Formosa": "Formosa",
  "San Luis": "San Luis", "CABA": "Ciudad de Buenos Aires",
  "Montevideo": "Montevideo", "Canelones": "Canelones", "Maldonado": "Maldonado",
  "Colonia": "Colonia", "San José": "San José", "Flores": "Flores",
  "Florida": "Florida", "Durazno": "Durazno", "Tacuarembó": "Tacuarembó",
  "Rivera": "Rivera", "Artigas": "Artigas", "Salto": "Salto",
  "Paysandú": "Paysandú", "Soriano": "Soriano", "Rocha": "Rocha",
  "Lavalleja": "Lavalleja", "Treinta y Tres": "Treinta y Tres",
  "Cerro Largo": "Cerro Largo",
};

const UY_NAMES = new Set([
  "Montevideo","Canelones","Maldonado","Colonia","San José","Flores","Florida",
  "Durazno","Tacuarembó","Rivera","Artigas","Salto","Paysandú","Soriano",
  "Rocha","Lavalleja","Treinta y Tres","Cerro Largo","Río Negro",
]);

const CITY_COORDS: Record<string, [number, number]> = {
  "Río Cuarto": [-64.35, -33.12], "Paraná": [-60.54, -31.73],
  "Tres Arroyos": [-60.28, -38.38], "Rafaela": [-61.50, -31.25],
  "Tandil": [-59.13, -37.32], "Rosario": [-60.65, -32.95],
  "Buenos Aires": [-58.40, -34.60], "Córdoba": [-64.19, -31.42],
  "Mendoza": [-68.83, -32.89],
};

const PROVINCE_CENTROIDS: Record<string, [number, number]> = {
  "Jujuy": [-65.7, -23.0], "Salta": [-65.4, -24.8], "Formosa": [-60.0, -25.4],
  "Misiones": [-54.6, -27.0], "Chaco": [-61.0, -26.5], "Tucumán": [-65.2, -26.8],
  "Corrientes": [-58.3, -28.8], "Santiago del Estero": [-64.3, -27.8],
  "Catamarca": [-67.5, -27.5], "Entre Ríos": [-59.2, -32.0],
  "Santa Fe": [-60.7, -30.7], "Córdoba": [-64.2, -31.5],
  "San Juan": [-69.0, -31.0], "La Rioja": [-67.0, -29.0],
  "Mendoza": [-68.5, -34.5], "San Luis": [-66.4, -33.5],
  "Buenos Aires": [-60.0, -36.5], "Ciudad de Buenos Aires": [-58.4, -34.6],
  "La Pampa": [-65.5, -37.0], "Neuquén": [-70.0, -38.5],
  "Río Negro": [-67.5, -39.5], "Chubut": [-68.5, -44.0],
  "Santa Cruz": [-69.5, -50.0], "Tierra del Fuego": [-67.5, -54.0],
  "Montevideo": [-56.2, -34.9], "Canelones": [-55.9, -34.5],
  "Maldonado": [-54.8, -34.5], "Colonia": [-57.8, -34.0],
  "San José": [-56.7, -34.3], "Flores": [-56.9, -33.6],
  "Florida": [-56.2, -34.0], "Durazno": [-56.3, -33.0],
  "Tacuarembó": [-55.9, -32.0], "Rivera": [-55.6, -31.4],
  "Artigas": [-56.5, -30.4], "Salto": [-57.9, -31.4],
  "Paysandú": [-58.1, -32.3], "Soriano": [-58.0, -33.5],
  "Rocha": [-53.9, -34.0], "Lavalleja": [-55.2, -33.9],
  "Treinta y Tres": [-54.4, -33.0], "Cerro Largo": [-54.5, -32.0],
};

const AR_PROVINCE_NAMES = Object.entries(REGION_TO_GEO)
  .filter(([, v]) => !UY_NAMES.has(v))
  .map(([k]) => k)
  .sort();

const UY_PROVINCE_NAMES = Object.entries(REGION_TO_GEO)
  .filter(([, v]) => UY_NAMES.has(v))
  .map(([k]) => k)
  .sort();

const DEFAULT_CENTER: [number, number] = [-62, -38];
const DEFAULT_ZOOM = 1;

type GeoFeature = { rsmKey: string; properties: { name: string } };

/* ─── Tooltip ────────────────────────────────────────────────────── */
function Tooltip({ name, x, y }: { name: string; x: number; y: number }) {
  return (
    <div
      style={{ left: x + 14, top: y - 10 }}
      className="pointer-events-none fixed z-50 rounded-lg border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-900 shadow-lg"
    >
      {name}
    </div>
  );
}

/* ─── Listing card in panel ──────────────────────────────────────── */
function ListingCard({ l, currency }: { l: (typeof MOCK_LISTINGS)[0]; currency: DisplayCurrency }) {
  const prices = allPrices(l.price, l.currency);
  return (
    <Link
      href={`/marketplace/${l.id}`}
      className="group flex items-start justify-between gap-3 p-4 transition-colors hover:bg-ink-50"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink-900">
          {l.tonnage.toLocaleString()} t de {grainLabel(l.grain_type)}
        </p>
        <p className="mt-0.5 truncate text-xs text-ink-500">{l.city} · {l.seller?.full_name}</p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold text-ink-900">
          {fmtPrice(l.price, l.currency, currency)}<span className="text-[10px] font-normal text-ink-400">/t</span>
        </p>
        {prices && (
          <div className="mt-0.5 space-y-px text-[10px] text-ink-400">
            {currency !== "USD" && <p>{prices.usd}</p>}
            {currency !== "ARS" && <p>{prices.ars}</p>}
            {currency !== "UYU" && <p>{prices.uyu}</p>}
          </div>
        )}
        <ChevronRight className="ml-auto mt-1 h-3 w-3 text-ink-400 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

/* ─── Main ───────────────────────────────────────────────────────── */
export function GeoClient() {
  const [hovered, setHovered] = useState<{ name: string; x: number; y: number } | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
  });

  const [markerHover, setMarkerHover] = useState<{ listing: Listing; x: number; y: number } | null>(null);

  /* Filters */
  const [currency, setCurrency] = useState<DisplayCurrency>("USD");
  const [filterGrain, setFilterGrain] = useState("all");
  const [filterCountry, setFilterCountry] = useState<"all" | "AR" | "UY">("all");
  const [filterProvince, setFilterProvince] = useState("all");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");

  /* Prevent scroll zoom on the map container */
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  /* Zoom buttons */
  const handleZoomIn = () =>
    setPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.6, 14) }));
  const handleZoomOut = () =>
    setPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.6, 1) }));
  const handleReset = () => {
    setSelectedName(null);
    setPosition({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
  };

  /* Filtered listings (AR+UY only) */
  const filteredListings = useMemo(() => {
    return MOCK_LISTINGS.filter((l) => {
      if (l.country !== "AR" && l.country !== "UY") return false;
      if (filterCountry !== "all" && l.country !== filterCountry) return false;
      if (filterGrain !== "all" && l.grain_type !== filterGrain) return false;
      if (filterProvince !== "all") {
        const geoName = REGION_TO_GEO[l.region];
        if (geoName !== REGION_TO_GEO[filterProvince]) return false;
      }
      if (l.price !== null) {
        const usdPrice = toUSD(l.price, l.currency);
        const displayPrice = fromUSD(usdPrice, currency);
        if (filterMinPrice && displayPrice < Number(filterMinPrice)) return false;
        if (filterMaxPrice && displayPrice > Number(filterMaxPrice)) return false;
      }
      return true;
    });
  }, [filterCountry, filterGrain, filterProvince, filterMinPrice, filterMaxPrice, currency]);

  /* Index filtered listings by province */
  const listingsByProvince = useMemo(() => {
    const map: Record<string, typeof MOCK_LISTINGS> = {};
    filteredListings.forEach((l) => {
      const geoName = REGION_TO_GEO[l.region];
      if (!geoName) return;
      const key = normalizeName(geoName);
      if (!map[key]) map[key] = [];
      map[key].push(l);
    });
    return map;
  }, [filteredListings]);

  const provincesWithListings = useMemo(
    () => new Set(Object.keys(listingsByProvince)),
    [listingsByProvince]
  );

  const selectedListings = selectedName
    ? (listingsByProvince[normalizeName(selectedName)] ?? [])
    : [];

  const handleProvinceClick = useCallback(
    (name: string) => {
      if (selectedName === name) {
        setSelectedName(null);
        setPosition({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
        setFilterProvince("all");
        return;
      }
      setSelectedName(name);
      setFilterProvince(
        Object.keys(REGION_TO_GEO).find((k) => REGION_TO_GEO[k] === name) ?? "all"
      );
      const center = PROVINCE_CENTROIDS[name];
      if (center) setPosition({ coordinates: center, zoom: 5 });
    },
    [selectedName]
  );

  /* Sync province dropdown → map */
  const handleProvinceFilter = (prov: string) => {
    setFilterProvince(prov);
    if (prov === "all") {
      setSelectedName(null);
      setPosition({ coordinates: DEFAULT_CENTER, zoom: DEFAULT_ZOOM });
    } else {
      const geoName = REGION_TO_GEO[prov];
      if (geoName) {
        setSelectedName(geoName);
        const center = PROVINCE_CENTROIDS[geoName];
        if (center) setPosition({ coordinates: center, zoom: 5 });
      }
    }
  };

  const zoomed = position.zoom > 2;

  const geoStyle = (name: string) => {
    const isSelected = selectedName === name;
    const hasListings = provincesWithListings.has(normalizeName(name));
    return {
      default: {
        fill: isSelected ? "#3e4f26" : hasListings ? "#839b57" : "white",
        stroke: "#1a1a0f",
        strokeWidth: isSelected ? 1.2 : 0.5,
        outline: "none",
      },
      hover: {
        fill: isSelected ? "#4f632f" : "#a8bc7f",
        stroke: "#3e4f26",
        strokeWidth: 0.8,
        outline: "none",
        cursor: "pointer",
      },
      pressed: { fill: "#657d3e", outline: "none" },
    };
  };

  const activeFiltersCount = [
    filterGrain !== "all",
    filterCountry !== "all",
    filterProvince !== "all",
    filterMinPrice !== "",
    filterMaxPrice !== "",
  ].filter(Boolean).length;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 py-12 lg:px-10">
      {/* Header */}
      <header className="mb-10 border-b border-ink-100 pb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Explorar</p>
        <h1 className="mt-3 font-display text-5xl font-medium tracking-tight text-ink-900 md:text-6xl">
          Geografía <em className="text-brand-700">del grano</em>.
        </h1>
        <p className="mt-3 max-w-xl text-ink-600">
          Pasá el cursor sobre una provincia para identificarla. Hacé clic para hacer zoom y ver las ofertas.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* ── MAP ─────────────────────────────────────────────── */}
        <div
          ref={mapRef}
          className="relative overflow-hidden rounded-2xl border border-ink-100 bg-ink-50 select-none"
        >
          {/* Zoom controls — top-left */}
          <div className="absolute left-4 top-4 z-20 flex flex-col gap-1">
            <button
              onClick={handleZoomIn}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-700 shadow-sm transition-colors hover:bg-ink-50 hover:text-ink-900"
              title="Acercar"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-700 shadow-sm transition-colors hover:bg-ink-50 hover:text-ink-900"
              title="Alejar"
            >
              <Minus className="h-4 w-4" />
            </button>
            {zoomed && (
              <button
                onClick={handleReset}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-ink-200 bg-white text-ink-700 shadow-sm transition-colors hover:bg-ink-50 hover:text-ink-900"
                title="Ver mapa completo"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Selected province label */}
          {selectedName && (
            <div className="absolute bottom-16 left-4 z-20 rounded-lg border border-brand-200 bg-brand-700 px-3 py-1.5 shadow">
              <p className="text-xs font-semibold text-white">{selectedName}</p>
            </div>
          )}

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 700, center: [-62, -38] }}
            width={700}
            height={740}
            className="w-full"
            style={{ background: "#f9f8f4" }}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={(pos: { coordinates: [number, number]; zoom: number }) =>
                setPosition(pos)
              }
              maxZoom={14}
              minZoom={1}
            >
              {/* Argentina */}
              <Geographies geography={AR_GEO}>
                {({ geographies }: { geographies: GeoFeature[] }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.name;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleProvinceClick(name)}
                        onMouseEnter={(e: React.MouseEvent) =>
                          setHovered({ name, x: e.clientX, y: e.clientY })
                        }
                        onMouseMove={(e: React.MouseEvent) =>
                          setHovered((h) =>
                            h?.name === name ? { name, x: e.clientX, y: e.clientY } : { name, x: e.clientX, y: e.clientY }
                          )
                        }
                        onMouseLeave={() => setHovered(null)}
                        style={geoStyle(name)}
                      />
                    );
                  })
                }
              </Geographies>

              {/* Uruguay */}
              <Geographies geography={UY_GEO}>
                {({ geographies }: { geographies: GeoFeature[] }) =>
                  geographies.map((geo) => {
                    const name = geo.properties.name;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleProvinceClick(name)}
                        onMouseEnter={(e: React.MouseEvent) =>
                          setHovered({ name, x: e.clientX, y: e.clientY })
                        }
                        onMouseMove={(e: React.MouseEvent) =>
                          setHovered({ name, x: e.clientX, y: e.clientY })
                        }
                        onMouseLeave={() => setHovered(null)}
                        style={geoStyle(name)}
                      />
                    );
                  })
                }
              </Geographies>

              {/* Listing markers when zoomed */}
              {zoomed &&
                selectedListings.map((l) => {
                  const coords = CITY_COORDS[l.city];
                  if (!coords) return null;
                  return (
                    <Marker key={l.id} coordinates={coords}>
                      <circle
                        r={6}
                        fill="#b66240"
                        stroke="white"
                        strokeWidth={1.5}
                        style={{ cursor: "pointer" }}
                        onMouseEnter={(e: React.MouseEvent) =>
                          setMarkerHover({ listing: l, x: e.clientX, y: e.clientY })
                        }
                        onMouseMove={(e: React.MouseEvent) =>
                          setMarkerHover({ listing: l, x: e.clientX, y: e.clientY })
                        }
                        onMouseLeave={() => setMarkerHover(null)}
                      />
                    </Marker>
                  );
                })}
            </ZoomableGroup>
          </ComposableMap>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 rounded-lg border border-ink-100 bg-white/90 p-2.5 text-[11px] text-ink-600 backdrop-blur-sm">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm" style={{ background: "#839b57", border: "1px solid #657d3e" }} />
              Con ofertas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm border border-ink-200 bg-white" />
              Sin ofertas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm" style={{ background: "#3e4f26" }} />
              Seleccionada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-500" />
              Oferta activa
            </span>
          </div>
        </div>

        {/* ── PANEL ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">

          {/* Filters */}
          <div className="rounded-2xl border border-ink-100 bg-white">
            <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium text-ink-800">
                <SlidersHorizontal className="h-4 w-4 text-ink-400" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="rounded-full bg-brand-700 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={() => {
                    setFilterGrain("all");
                    setFilterCountry("all");
                    setFilterMinPrice("");
                    setFilterMaxPrice("");
                    handleProvinceFilter("all");
                  }}
                  className="text-[11px] text-ink-400 underline underline-offset-4 hover:text-ink-700"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="space-y-3 p-4">
              {/* Currency */}
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Moneda</p>
                <div className="flex rounded-lg border border-ink-200 bg-ink-50 p-0.5 text-xs">
                  {(["USD", "ARS", "UYU"] as DisplayCurrency[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`flex-1 rounded-md py-1.5 font-semibold transition-colors ${
                        currency === c
                          ? "bg-ink-900 text-white shadow-sm"
                          : "text-ink-500 hover:text-ink-800"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country */}
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">País</p>
                <div className="flex gap-1.5">
                  {(["all", "AR", "UY"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterCountry(f)}
                      className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                        filterCountry === f
                          ? "border-brand-600 bg-brand-700 text-white"
                          : "border-ink-200 bg-white text-ink-600 hover:bg-ink-50"
                      }`}
                    >
                      {f === "all" ? "Ambos" : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grain */}
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Grano</p>
                <select
                  value={filterGrain}
                  onChange={(e) => setFilterGrain(e.target.value)}
                  className="select-campo h-8 w-full rounded-lg border border-ink-200 bg-white px-2 pr-7 text-xs text-ink-800"
                >
                  <option value="all">Todos los granos</option>
                  {GRAIN_TYPES.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              {/* Province */}
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">Provincia / Depto.</p>
                <select
                  value={filterProvince}
                  onChange={(e) => handleProvinceFilter(e.target.value)}
                  className="select-campo h-8 w-full rounded-lg border border-ink-200 bg-white px-2 pr-7 text-xs text-ink-800"
                >
                  <option value="all">Todas las zonas</option>
                  <optgroup label="Argentina">
                    {AR_PROVINCE_NAMES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Uruguay">
                    {UY_PROVINCE_NAMES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Price range */}
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                  Precio / t ({currency})
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Mín"
                    value={filterMinPrice}
                    onChange={(e) => setFilterMinPrice(e.target.value)}
                    className="h-8 w-full rounded-lg border border-ink-200 bg-white px-2 text-xs text-ink-800 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                  <span className="shrink-0 text-xs text-ink-400">—</span>
                  <input
                    type="number"
                    placeholder="Máx"
                    value={filterMaxPrice}
                    onChange={(e) => setFilterMaxPrice(e.target.value)}
                    className="h-8 w-full rounded-lg border border-ink-200 bg-white px-2 text-xs text-ink-800 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Province detail */}
          {!selectedName ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white px-8 py-10 text-center">
              <ZoomIn className="mb-3 h-8 w-8 text-ink-300" />
              <p className="font-display text-lg font-medium text-ink-700">Seleccioná una zona</p>
              <p className="mt-1 text-sm text-ink-400">
                Hacé clic en el mapa o usá el filtro de provincia de arriba.
              </p>
              {filteredListings.length > 0 && (
                <p className="mt-3 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                  {filteredListings.length} oferta{filteredListings.length !== 1 ? "s" : ""} visible{filteredListings.length !== 1 ? "s" : ""} en el mapa
                </p>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-ink-100 bg-white">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-ink-100 p-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                    {UY_NAMES.has(selectedName) ? "Uruguay" : "Argentina"}
                  </p>
                  <h2 className="mt-0.5 font-display text-xl font-medium text-ink-900">{selectedName}</h2>
                  <p className="mt-1 text-xs text-ink-500">
                    {selectedListings.length === 0
                      ? "Sin ofertas con estos filtros"
                      : `${selectedListings.length} oferta${selectedListings.length !== 1 ? "s" : ""}`}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="rounded-full p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Listings */}
              <div className="divide-y divide-ink-100">
                {selectedListings.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 p-8 text-center">
                    <Package className="h-6 w-6 text-ink-300" />
                    <p className="text-sm text-ink-500">No hay ofertas con los filtros actuales.</p>
                  </div>
                ) : (
                  selectedListings.map((l) => (
                    <ListingCard key={l.id} l={l} currency={currency} />
                  ))
                )}
              </div>

              {selectedListings.length > 0 && (
                <div className="border-t border-ink-100 p-4">
                  <Link
                    href={`/marketplace?region=${encodeURIComponent(selectedName)}`}
                    className="text-xs font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
                  >
                    Ver en marketplace →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Province name tooltip */}
      {hovered && !markerHover && <Tooltip name={hovered.name} x={hovered.x} y={hovered.y} />}

      {/* Marker offer popup */}
      {markerHover && (
        <MarkerPopup
          listing={markerHover.listing}
          x={markerHover.x}
          y={markerHover.y}
          currency={currency}
        />
      )}
    </div>
  );
}
