"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookmarkCheck, Check } from "lucide-react";

const KEY = "campo:saved-searches";

type Saved = {
  id: string;
  query: string;
  label: string;
  saved_at: string;
};

function readSaved(): Saved[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Saved[]) : [];
  } catch {
    return [];
  }
}

function writeSaved(list: Saved[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function SaveSearchButton({
  searchString,
  label,
  hasFilters,
}: {
  searchString: string;
  label: string;
  hasFilters: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const list = readSaved();
    setSaved(list.some((s) => s.query === searchString));
  }, [searchString]);

  if (!hasFilters) return null;

  const toggle = () => {
    const list = readSaved();
    if (saved) {
      writeSaved(list.filter((s) => s.query !== searchString));
      setSaved(false);
    } else {
      const next: Saved = {
        id: Math.random().toString(36).slice(2, 9),
        query: searchString,
        label,
        saved_at: new Date().toISOString(),
      };
      writeSaved([next, ...list]);
      setSaved(true);
      setFlash(true);
      window.setTimeout(() => setFlash(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-xs font-medium transition-colors ${
        saved
          ? "border-brand-700 bg-brand-50 text-brand-800"
          : "border-ink-200 bg-white text-ink-700 hover:border-ink-300"
      }`}
    >
      {saved ? (
        <>
          <BookmarkCheck className="h-3.5 w-3.5" />
          {flash ? (
            <span className="inline-flex items-center gap-1 text-brand-700">
              <Check className="h-3 w-3" /> Guardada
            </span>
          ) : (
            "Búsqueda guardada"
          )}
        </>
      ) : (
        <>
          <Bookmark className="h-3.5 w-3.5" />
          Guardar búsqueda
        </>
      )}
    </button>
  );
}
