export const GRAIN_TYPES = [
  { value: "soja", label: "Soja" },
  { value: "maiz", label: "Maíz" },
  { value: "trigo", label: "Trigo" },
  { value: "girasol", label: "Girasol" },
  { value: "sorgo", label: "Sorgo" },
  { value: "cebada", label: "Cebada" },
  { value: "avena", label: "Avena" },
  { value: "arroz", label: "Arroz" },
] as const;

export type GrainType = (typeof GRAIN_TYPES)[number]["value"];

export function grainLabel(value: string) {
  return GRAIN_TYPES.find((g) => g.value === value)?.label ?? value;
}

// Principales países productores/compradores de granos.
export const COUNTRIES = [
  { value: "AR", label: "Argentina" },
  { value: "BR", label: "Brasil" },
  { value: "UY", label: "Uruguay" },
  { value: "PY", label: "Paraguay" },
  { value: "US", label: "Estados Unidos" },
  { value: "CA", label: "Canadá" },
  { value: "MX", label: "México" },
  { value: "UA", label: "Ucrania" },
  { value: "RU", label: "Rusia" },
  { value: "FR", label: "Francia" },
  { value: "DE", label: "Alemania" },
  { value: "ES", label: "España" },
  { value: "IT", label: "Italia" },
  { value: "CN", label: "China" },
  { value: "IN", label: "India" },
  { value: "AU", label: "Australia" },
  { value: "ZA", label: "Sudáfrica" },
  { value: "OTHER", label: "Otro" },
] as const;

export type Country = (typeof COUNTRIES)[number]["value"];

export function countryLabel(code: string) {
  return COUNTRIES.find((c) => c.value === code)?.label ?? code;
}

export const CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "ARS", label: "ARS" },
  { value: "BRL", label: "BRL" },
] as const;

export type Currency = (typeof CURRENCIES)[number]["value"];

export const LISTING_STATUSES = [
  { value: "active", label: "Activa" },
  { value: "negotiating", label: "En negociación" },
  { value: "closed", label: "Cerrada" },
  { value: "inactive", label: "Inactiva" },
] as const;

export type ListingStatus = (typeof LISTING_STATUSES)[number]["value"];

export const PRICE_MODES = [
  { value: "fixed", label: "Precio fijo" },
  { value: "to_agree", label: "A convenir" },
] as const;

export type PriceMode = (typeof PRICE_MODES)[number]["value"];

export const USER_TYPES = [
  { value: "seller", label: "Vendedor" },
  { value: "buyer", label: "Comprador" },
  { value: "both", label: "Ambos" },
] as const;

export type UserType = (typeof USER_TYPES)[number]["value"];
