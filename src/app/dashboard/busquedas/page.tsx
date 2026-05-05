import type { Metadata } from "next";
import { SavedSearches } from "@/components/listings/SavedSearches";

export const metadata: Metadata = {
  title: "Búsquedas guardadas",
  description: "Combinaciones de filtros que guardaste en el marketplace.",
};

export default function BusquedasPage() {
  return (
    <div>
      <header className="mb-6 border-b border-ink-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Marketplace
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900">
          Búsquedas guardadas
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Las combinaciones de filtros que guardás aparecen acá. Tocá una para
          volver a aplicarla en el marketplace.
        </p>
      </header>

      <SavedSearches />
    </div>
  );
}
