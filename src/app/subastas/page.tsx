import { Metadata } from "next";
import { Suspense } from "react";
import { SubastasClient } from "@/components/auctions/SubastasClient";

export const metadata: Metadata = {
  title: "Subastas en vivo",
  description: "Remates en tiempo real de granos. Participá en subastas de soja, maíz, trigo y más.",
};

export default function SubastasPage() {
  return (
    <Suspense>
      <SubastasClient />
    </Suspense>
  );
}
