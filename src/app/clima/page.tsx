import type { Metadata } from "next";
import { ClimaClient } from "@/components/weather/ClimaClient";

export const metadata: Metadata = {
  title: "Clima agrícola · Campo",
  description: "Pronósticos e históricos climáticos por provincia y región. Temperatura, precipitaciones y condiciones agropecuarias.",
};

export default function ClimaPage() {
  return <ClimaClient />;
}
