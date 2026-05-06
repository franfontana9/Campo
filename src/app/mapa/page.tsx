import type { Metadata } from "next";
import { Suspense } from "react";
import { MapaClient } from "@/components/maps/MapaClient";

export const metadata: Metadata = {
  title: "Mapa · Campo",
  description:
    "Mapa de ofertas y clima por provincia. Argentina y Uruguay.",
};

export default function MapaPage() {
  return (
    <Suspense fallback={null}>
      <MapaClient />
    </Suspense>
  );
}
