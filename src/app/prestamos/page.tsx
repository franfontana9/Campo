import type { Metadata } from "next";
import { LoansClient } from "@/components/loans/LoansClient";

export const metadata: Metadata = {
  title: "Préstamos y Financiamiento · Campo",
  description: "Simulá adelantos de cosecha, créditos para compradores y financiamiento de acopio. Tasas en tiempo real según perfil de riesgo.",
};

export default function PrestamosPage() {
  return <LoansClient />;
}
