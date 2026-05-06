import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  BadgeCheck,
  ExternalLink,
  ShieldCheck,
  Upload,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { COUNTRIES, USER_TYPES, countryLabel } from "@/lib/constants";
import { CURRENT_USER } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Mi perfil",
  description: "Editá los datos de tu empresa.",
};

export default function PerfilPage() {
  return (
    <div>
      <header className="mb-6 border-b border-ink-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Cuenta
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900">
          Mi perfil
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Estos datos se muestran a los compradores cuando ven tus publicaciones.
        </p>
      </header>

      {/* Tarjeta resumen */}
      <section className="mb-8 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-start gap-4 p-6">
          {/* Avatar / logo con upload mock — botón clickeable que abre file picker */}
          <label
            htmlFor="logo-upload"
            className="group relative flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-brand-100 text-brand-700 ring-4 ring-brand-50 transition-all hover:ring-brand-200"
            title="Cambiar logo"
          >
            <Building2 className="h-7 w-7 transition-opacity group-hover:opacity-30" />
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink-900/0 text-[10px] font-semibold uppercase tracking-wider text-white opacity-0 transition-all group-hover:bg-ink-900/55 group-hover:opacity-100">
              <Upload className="h-4 w-4" />
            </span>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="sr-only"
            />
          </label>
          <div className="min-w-0 flex-1">
            <p className="font-display text-2xl font-medium text-ink-900">
              {CURRENT_USER.full_name}
            </p>
            <p className="mt-0.5 text-sm text-ink-600">
              {CURRENT_USER.city}, {CURRENT_USER.region} ·{" "}
              {countryLabel(CURRENT_USER.country)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="brand">
                <BadgeCheck className="mr-1 h-3 w-3" /> Empresa verificada
              </Badge>
              <Badge variant="neutral">
                {USER_TYPES.find((u) => u.value === CURRENT_USER.user_type)?.label}
              </Badge>
            </div>
          </div>
          <Link
            href={`/u/${CURRENT_USER.id}`}
            className="inline-flex items-center gap-1 text-sm text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Ver perfil público <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <form className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
        <FormSection title="Identidad">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="full_name">Razón social</Label>
              <Input
                id="full_name"
                defaultValue={CURRENT_USER.full_name}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="user_type">Tipo de usuario</Label>
              <Select
                id="user_type"
                defaultValue={CURRENT_USER.user_type}
                className="mt-1.5"
              >
                {USER_TYPES.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                defaultValue={CURRENT_USER.phone}
                className="mt-1.5"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Ubicación">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="country">País</Label>
              <Select
                id="country"
                defaultValue={CURRENT_USER.country}
                className="mt-1.5"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="region">Región / Provincia</Label>
              <Input
                id="region"
                defaultValue={CURRENT_USER.region}
                className="mt-1.5"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                defaultValue={CURRENT_USER.city}
                className="mt-1.5"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Sobre tu empresa">
          <Label htmlFor="bio">A qué se dedica</Label>
          <Textarea
            id="bio"
            rows={5}
            placeholder="Descripción breve: actividad principal, escala, mercados habituales, etc."
            className="mt-1.5"
          />
          <p className="mt-1.5 text-xs text-ink-500">
            Aparece en tu perfil público. Sirve para que los compradores entiendan
            con quién están operando.
          </p>
        </FormSection>

        <div className="flex flex-wrap gap-2 border-t border-ink-100 bg-ink-50/60 px-7 py-5">
          <Button type="submit" size="lg">
            Guardar cambios
          </Button>
          <Button type="button" variant="outline" size="lg">
            Cancelar
          </Button>
        </div>
      </form>

      {/* Verificación — accionable */}
      <section className="mt-8 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-start gap-4 p-7">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-medium text-ink-900">
                Verificación de cuenta
              </h2>
              <Badge variant="success">
                <BadgeCheck className="mr-1 h-3 w-3" />
                Nivel actual: Verificada
              </Badge>
            </div>
            <p className="mt-2 text-sm text-ink-600">
              Tu razón social y contacto fueron revisados manualmente. El
              próximo nivel <strong>«Verified seller»</strong> requiere
              verificación automática vía CUIT / Tax ID e historial de
              operaciones cerradas.
            </p>
          </div>
        </div>
        {/* Niveles + CTA */}
        <div className="grid gap-px bg-ink-100 sm:grid-cols-3">
          <VerifLevel
            label="Email verificado"
            done
            hint="Confirmaste tu mail al registrarte."
          />
          <VerifLevel
            label="Empresa verificada"
            done
            hint="Razón social y contacto chequeados."
          />
          <VerifLevel
            label="Verified seller"
            done={false}
            hint="Sumá CUIT y operaciones cerradas."
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 bg-ink-50/60 px-7 py-4">
          <p className="text-xs text-ink-600">
            Próximo paso: integración con AFIP / Tax ID. Te avisamos cuando
            esté disponible.
          </p>
          <Button size="sm" variant="outline" disabled>
            Iniciar verificación CUIT
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </section>
    </div>
  );
}

function VerifLevel({
  label,
  done,
  hint,
}: {
  label: string;
  done: boolean;
  hint: string;
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
            done
              ? "bg-emerald-100 text-emerald-700"
              : "bg-ink-100 text-ink-400"
          }`}
          aria-hidden
        >
          {done ? (
            <BadgeCheck className="h-3 w-3" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-ink-300" />
          )}
        </span>
        <p
          className={`text-sm font-medium ${done ? "text-ink-900" : "text-ink-500"}`}
        >
          {label}
        </p>
      </div>
      <p className="mt-1.5 text-[11px] leading-relaxed text-ink-500">
        {hint}
      </p>
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
