import type { Metadata } from "next";
import { PricesClient } from "@/components/prices/PricesClient";

export const metadata: Metadata = {
  title: "Precios",
  description: "Precios de referencia semanales de granos y semillas en Argentina y Uruguay. Soja, maíz, trigo, girasol, sorgo, cebada, avena y arroz en USD, ARS y UYU.",
};

export default function PreciosPage() {
  return <PricesClient />;
}
