"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";

/**
 * Drawer básico controlado por estado externo (open/onOpenChange).
 * Cierra con Escape, click en backdrop y trapeo de scroll del body.
 * Side: "right" (default) | "bottom" — bottom es el patrón mobile típico.
 */
export function Drawer({
  open,
  onOpenChange,
  title,
  children,
  side = "right",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: ReactNode;
  side?: "right" | "bottom";
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onOpenChange]);

  if (!mounted) return null;

  const panelPos =
    side === "bottom"
      ? "inset-x-0 bottom-0 max-h-[90dvh] rounded-t-2xl"
      : "inset-y-0 right-0 max-w-md w-full";

  const panelTransform = open
    ? "translate-x-0 translate-y-0"
    : side === "bottom"
      ? "translate-y-full"
      : "translate-x-full";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
    >
      {/* Backdrop */}
      <div
        onClick={() => onOpenChange(false)}
        className={`absolute inset-0 bg-ink-900/40 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        className={`absolute ${panelPos} flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${panelTransform}`}
      >
        <header className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
