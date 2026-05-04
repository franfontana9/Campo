import type { Metadata } from "next";
import { NewListingForm } from "@/components/listings/NewListingForm";

export const metadata: Metadata = {
  title: "Nueva publicación",
  description: "Cargá tu oferta en el marketplace.",
};

export default function NuevaPublicacionPage() {
  return (
    <div>
      <header className="mb-8 border-b border-ink-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Publicar
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink-900">
          Nueva publicación
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Cargá los datos de tu oferta para que aparezca en el marketplace.
        </p>
      </header>

      <NewListingForm />
    </div>
  );
}
