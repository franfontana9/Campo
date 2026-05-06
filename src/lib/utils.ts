import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Currency } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTonnage(tons: number) {
  return `${new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(tons)} t`;
}

export function formatPrice(price: number | null, currency: Currency) {
  if (price === null || price === undefined) return "A convenir";
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "hace segundos";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  return `hace ${Math.floor(diff / 86400)} d`;
}

// Conteo mock determinístico de "interesados" por listing. Usa un hash simple
// del id para que cada card muestre un número estable entre sesiones.
export function mockInterestsCount(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(h % 9) + 1; // 1..9
}

/**
 * Salud de una publicación — semáforo rápido para el dueño.
 *  - good: actividad reciente, todo respondido
 *  - warn: intereses pendientes hace > 24 h, o algún chat sin leer
 *  - bad: sin actividad en 7+ días
 */
export type ListingHealth = {
  level: "good" | "warn" | "bad";
  label: string;
  hint: string;
};

export function getListingHealth({
  createdAt,
  pendingInterests,
  unreadChats,
  hasActivityInLast7d,
}: {
  createdAt: string;
  pendingInterests: number;
  unreadChats: number;
  hasActivityInLast7d: boolean;
}): ListingHealth {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  const ageDays = ageMs / (24 * 60 * 60 * 1000);

  if (ageDays > 7 && !hasActivityInLast7d) {
    return {
      level: "bad",
      label: "Sin actividad",
      hint: "No hubo intereses ni chats en los últimos 7 días",
    };
  }
  if (pendingInterests > 0 || unreadChats > 0) {
    const parts: string[] = [];
    if (pendingInterests > 0) parts.push(`${pendingInterests} sin responder`);
    if (unreadChats > 0) parts.push(`${unreadChats} mensajes sin leer`);
    return {
      level: "warn",
      label: "Requiere acción",
      hint: parts.join(" · "),
    };
  }
  return {
    level: "good",
    label: "Saludable",
    hint: "Al día con tus contrapartes",
  };
}
