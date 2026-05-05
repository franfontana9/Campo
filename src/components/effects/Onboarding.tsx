"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, PlusCircle, MessageSquare, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const KEY = "campo:onboarded";

const SLIDES = [
  {
    icon: <Search className="h-6 w-6" />,
    title: "Encontrá lo que buscás",
    body: "Filtrá por grano, país y volumen. Búsqueda libre por ciudad o vendedor desde el navbar.",
  },
  {
    icon: <PlusCircle className="h-6 w-6" />,
    title: "Publicá tu oferta en minutos",
    body: "Cargá grano, toneladas, ubicación y modalidad de precio. Aparece al instante en el marketplace.",
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Conectá directo con la contraparte",
    body: "Mostrás interés con un mensaje, abrís un chat y cierran por fuera. Sin corredores, sin comisiones.",
  },
];

export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!localStorage.getItem(KEY)) {
        // Pequeño delay para que la home se vea primero
        const t = window.setTimeout(() => setOpen(true), 800);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* localStorage no disponible — ignorar */
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (!open) return null;

  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenido a Campo"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm"
        onClick={dismiss}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-8 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
            Bienvenido a Campo · Paso {step + 1} de {SLIDES.length}
          </p>
          <div className="mt-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            {slide.icon}
          </div>
          <h2 className="mt-5 font-display text-3xl font-medium leading-tight tracking-tight text-ink-900">
            {slide.title}
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
            {slide.body}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 px-8 pb-2">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              aria-hidden
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-brand-700" : "w-1.5 bg-ink-200"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-ink-100 bg-ink-50/60 px-7 py-4">
          <button
            type="button"
            onClick={dismiss}
            className="text-sm text-ink-500 hover:text-ink-900"
          >
            Saltar
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
              >
                Atrás
              </Button>
            )}
            {isLast ? (
              <Link href="/marketplace" onClick={dismiss}>
                <Button size="sm">
                  Empezar <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <Button size="sm" onClick={() => setStep((s) => s + 1)}>
                Siguiente <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
