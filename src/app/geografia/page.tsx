import type { Metadata } from "next";
import { GeoClient } from "@/components/geo/GeoClient";

export const metadata: Metadata = {
  title: "Geografía",
  description: "Explorá el mapa de Argentina y Uruguay por provincia. Descubrí qué granos y semillas se venden en cada zona.",
};

export default function GeografiaPage() {
  return <GeoClient />;
}
