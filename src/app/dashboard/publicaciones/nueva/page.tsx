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

      <form className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
        <FormSection title="Grano y volumen">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="grain_type">Grano</Label>
              <Select id="grain_type" className="mt-1.5" defaultValue="soja">
                {GRAIN_TYPES.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="tonnage">Toneladas</Label>
              <Input
                id="tonnage"
                type="number"
                min={1}
                step={1}
                className="mt-1.5"
                required
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Ubicación">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="country">País</Label>
              <Select id="country" className="mt-1.5" defaultValue="">
                <option value="" disabled>
                  Seleccioná
                </option>
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="region">Región / Provincia / Estado</Label>
              <Input id="region" className="mt-1.5" required />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input id="city" className="mt-1.5" required />
            </div>
          </div>
        </FormSection>

        <FormSection title="Comercial">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="price_mode">Modalidad de precio</Label>
              <Select id="price_mode" className="mt-1.5" defaultValue="fixed">
                {PRICE_MODES.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Precio por tonelada</Label>
              <div className="mt-1.5 flex gap-2">
                <Input id="price" type="number" min={0} step={1} />
                <Select defaultValue="USD" className="w-28">
                  {CURRENCIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="delivery_date">Fecha estimada de entrega</Label>
              <Input
                id="delivery_date"
                type="date"
                className="mt-1.5"
                required
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Detalle">
          <div className="grid gap-5">
            <div>
              <Label htmlFor="image_url">URL de foto (opcional)</Label>
              <Input
                id="image_url"
                type="url"
                placeholder="https://..."
                className="mt-1.5"
              />
              <p className="mt-1.5 text-xs text-ink-500">
                Si no agregás una, usamos un visual genérico del grano.
              </p>
            </div>
            <div>
              <Label htmlFor="description">Descripción / observaciones</Label>
              <Textarea
                id="description"
                rows={5}
                className="mt-1.5"
                placeholder="Condición comercial, humedad, forma de pago, etc."
              />
            </div>
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
    </div>
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
