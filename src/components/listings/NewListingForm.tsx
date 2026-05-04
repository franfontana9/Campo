"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  GRAIN_TYPES,
  COUNTRIES,
  PRICE_MODES,
  CURRENCIES,
} from "@/lib/constants";
import { listingSchema } from "@/lib/validation/listing";

type Errors = Partial<Record<string, string>>;

export function NewListingForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [priceMode, setPriceMode] = useState("fixed");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = listingSchema.safeParse({
      ...raw,
      tonnage: raw.tonnage ? Number(raw.tonnage) : undefined,
      price: raw.price ? Number(raw.price) : null,
    });
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0]?.toString() ?? "_";
        if (!next[k]) next[k] = issue.message;
      }
      setErrors(next);
      // scroll al primer error
      const firstKey = Object.keys(next)[0];
      if (firstKey) {
        document.getElementById(firstKey)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }
    setErrors({});
    setSubmitted(true);
    // TODO: cuando esté Supabase, server action acá.
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-700 text-white">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h2 className="mt-4 font-display text-2xl font-medium text-ink-900">
          Publicación lista (preview)
        </h2>
        <p className="mt-2 text-sm text-ink-600">
          La validación pasó. Cuando conectemos Supabase esto persiste y aparece
          en el marketplace.
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-6"
          onClick={() => setSubmitted(false)}
        >
          Cargar otra
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm"
    >
      <FormSection title="Grano y volumen">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="grain_type" label="Grano" error={errors.grain_type}>
            <Select id="grain_type" name="grain_type" defaultValue="soja">
              {GRAIN_TYPES.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field id="tonnage" label="Toneladas" error={errors.tonnage}>
            <Input
              id="tonnage"
              name="tonnage"
              type="number"
              min={1}
              step={1}
              placeholder="ej. 500"
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Ubicación">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="country" label="País" error={errors.country}>
            <Select id="country" name="country" defaultValue="">
              <option value="" disabled>
                Seleccioná
              </option>
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            id="region"
            label="Región / Provincia / Estado"
            error={errors.region}
          >
            <Input id="region" name="region" />
          </Field>
          <div className="sm:col-span-2">
            <Field id="city" label="Ciudad" error={errors.city}>
              <Input id="city" name="city" />
            </Field>
          </div>
        </div>
      </FormSection>

      <FormSection title="Comercial">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="price_mode"
            label="Modalidad de precio"
            error={errors.price_mode}
          >
            <Select
              id="price_mode"
              name="price_mode"
              value={priceMode}
              onChange={(e) => setPriceMode(e.target.value)}
            >
              {PRICE_MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            id="price"
            label="Precio por tonelada"
            error={errors.price}
            disabled={priceMode === "to_agree"}
            hint={
              priceMode === "to_agree"
                ? "Modalidad a convenir — no se carga precio"
                : undefined
            }
          >
            <div className="flex gap-2">
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step={1}
                disabled={priceMode === "to_agree"}
                placeholder={priceMode === "to_agree" ? "—" : "ej. 410"}
              />
              <Select
                name="currency"
                defaultValue="USD"
                className="w-28"
                disabled={priceMode === "to_agree"}
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
          </Field>
          <div className="sm:col-span-2">
            <Field
              id="delivery_date"
              label="Fecha estimada de entrega"
              error={errors.delivery_date}
            >
              <Input id="delivery_date" name="delivery_date" type="date" />
            </Field>
          </div>
        </div>
      </FormSection>

      <FormSection title="Detalle">
        <div className="grid gap-5">
          <Field
            id="image_url"
            label="URL de foto (opcional)"
            error={errors.image_url}
            hint="Si no agregás una, usamos un visual genérico del grano."
          >
            <Input
              id="image_url"
              name="image_url"
              type="url"
              placeholder="https://..."
            />
          </Field>
          <Field
            id="description"
            label="Descripción / observaciones"
            error={errors.description}
          >
            <Textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Condición comercial, humedad, forma de pago, etc."
            />
          </Field>
        </div>
      </FormSection>

      <div className="flex flex-wrap gap-2 border-t border-ink-100 bg-ink-50/60 px-7 py-5">
        <Button type="submit" size="lg">
          Publicar
        </Button>
        <Button type="button" variant="outline" size="lg">
          Guardar como borrador
        </Button>
      </div>
    </form>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-4 border-b border-ink-100 p-7 md:grid-cols-[180px_1fr]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        {title}
      </p>
      <div>{children}</div>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  hint,
  disabled,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={disabled ? "opacity-70" : ""}>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}
