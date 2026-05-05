"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

const KEY = "campo:saved-searches";

type Saved = {
  id: string;
  query: string;
  label: string;
  saved_at: string;
};

export function SavedSearches() {
  const [items, setItems] = useState<Saved[] | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      setItems(raw ? (JSON.parse(raw) as Saved[]) : []);
    } catch {
      setItems([]);
    }
  }, []);

  const remove = (id: string) => {
    if (!items) return;
    const next = items.filter((s) => s.id !== id);
    setItems(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const clear = () => {
    setItems([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  if (items === null) {
    return (
      <div className="rounded-2xl border border-ink-100 bg-white p-10 text-center text-sm text-ink-500">
        Cargando…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-14 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 text-ink-500">
          <Bookmark className="h-5 w-5" />
        </div>
        <p className="mt-4 font-display text-2xl font-medium text-ink-900">
          Todavía no guardaste búsquedas
        </p>
        <p className="mt-2 text-sm text-ink-500">
          En el marketplace aplicá filtros y tocá «Guardar búsqueda» para
          volver con un click.
        </p>
        <Link href="/marketplace" className="mt-5 inline-block">
          <Button size="md">
            <Search className="h-4 w-4" /> Ir al marketplace
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-ink-500">
          {items.length}{" "}
          {items.length === 1 ? "búsqueda" : "búsquedas"} guardadas
        </p>
        <button
          type="button"
          onClick={clear}
          className="text-xs text-ink-500 underline underline-offset-4 hover:text-ink-900"
        >
          Borrar todas
        </button>
      </div>
      <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
        {items.map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <Bookmark className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink-900">{s.label}</p>
              <p className="mt-0.5 truncate font-mono text-[11px] text-ink-500">
                {s.query || "—"}
              </p>
            </div>
            <Link href={`/marketplace${s.query ? `?${s.query}` : ""}`}>
              <Button size="sm" variant="outline">
                Aplicar
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => remove(s.id)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label="Eliminar búsqueda guardada"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
