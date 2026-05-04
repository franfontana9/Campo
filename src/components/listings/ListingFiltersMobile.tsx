"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { ListingFilters } from "./ListingFilters";

/**
 * Botón que abre los filtros como drawer en mobile.
 * En desktop el sidebar sigue siendo el `<ListingFilters />` directo.
 */
export function ListingFiltersMobile({ activeCount }: { activeCount: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-ink-200 bg-white px-4 text-sm font-medium text-ink-900 shadow-sm transition-colors hover:border-ink-300 md:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filtros
        {activeCount > 0 && (
          <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-700 px-1.5 text-[11px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>
      <Drawer open={open} onOpenChange={setOpen} title="Filtros" side="bottom">
        <div className="p-5">
          <ListingFilters />
        </div>
      </Drawer>
    </>
  );
}
