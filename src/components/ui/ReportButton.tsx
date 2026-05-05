"use client";

import { useState } from "react";
import { Flag, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Drawer } from "./Drawer";
import { Button } from "./Button";
import { Label } from "./Label";
import { Textarea } from "./Textarea";

const REASONS_LISTING = [
  { value: "false", label: "Información falsa o engañosa" },
  { value: "duplicate", label: "Publicación duplicada" },
  { value: "spam", label: "Spam o publicidad" },
  { value: "fraud", label: "Sospecha de fraude" },
  { value: "wrong_category", label: "Cultivo o categoría incorrecta" },
  { value: "other", label: "Otro motivo" },
];

const REASONS_USER = [
  { value: "fake", label: "Empresa o identidad falsa" },
  { value: "harassment", label: "Acoso o trato inapropiado" },
  { value: "fraud", label: "Sospecha de fraude" },
  { value: "spam", label: "Spam o publicidad" },
  { value: "other", label: "Otro motivo" },
];

export function ReportButton({
  target,
  className = "",
}: {
  target: "listing" | "user";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const reasons = target === "listing" ? REASONS_LISTING : REASONS_USER;
  const targetLabel = target === "listing" ? "esta publicación" : "este usuario";

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: server action cuando esté Supabase + tabla de moderación
    setDone(true);
  };

  const close = () => {
    setOpen(false);
    // Resetear después de la animación
    setTimeout(() => setDone(false), 350);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ||
          "inline-flex items-center gap-1.5 text-xs text-ink-500 underline underline-offset-4 hover:text-ink-900"
        }
      >
        <Flag className="h-3 w-3" /> Reportar
      </button>

      <Drawer
        open={open}
        onOpenChange={(v) => (v ? setOpen(true) : close())}
        title={`Reportar ${targetLabel}`}
        side="right"
      >
        {done ? (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="mt-4 font-display text-2xl font-medium text-ink-900">
              Reporte enviado
            </p>
            <p className="mt-2 max-w-sm text-sm text-ink-600">
              Gracias. Lo revisamos en menos de 24 h. Si necesitamos más
              información te escribimos por mail.
            </p>
            <Button onClick={close} className="mt-6" size="md">
              Cerrar
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6 p-6">
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-sm leading-relaxed">
                Los reportes son confidenciales. Revisamos cada uno
                manualmente; los abusos se sancionan.
              </p>
            </div>

            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-medium text-ink-900">
                ¿Cuál es el motivo?
              </legend>
              {reasons.map((r, i) => (
                <label
                  key={r.value}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-ink-200 px-4 py-3 transition-colors hover:border-ink-300 has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    defaultChecked={i === 0}
                    className="h-4 w-4 accent-brand-700"
                  />
                  <span className="text-sm text-ink-800">{r.label}</span>
                </label>
              ))}
            </fieldset>

            <div>
              <Label htmlFor="report-detail">Detalle (opcional)</Label>
              <Textarea
                id="report-detail"
                name="detail"
                rows={4}
                placeholder="Contanos qué viste para que podamos actuar más rápido."
                className="mt-1.5"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" size="md">
                Enviar reporte
              </Button>
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={close}
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </Drawer>
    </>
  );
}
