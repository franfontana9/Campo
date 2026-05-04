import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { COUNTRIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description: "Unite a Campo en minutos. Publicá ofertas o explorá granos.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-5xl px-6 py-12">
      <div className="grid w-full gap-10 md:grid-cols-[1fr_360px]">
        {/* Form */}
        <div className="rounded-2xl border border-ink-100 bg-white p-8 shadow-sm md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
            Nueva cuenta
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900">
            Unite a <em className="text-brand-700">Campo</em>.
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            Creá tu cuenta para publicar ofertas o contactar vendedores.
          </p>

          <form className="mt-7 space-y-6">
            {/* Tipo de usuario — segmentación visual */}
            <fieldset>
              <legend className="text-sm font-medium text-ink-800">
                ¿Para qué vas a usar Campo?
              </legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <UserTypeOption
                  value="seller"
                  label="Vendedor"
                  desc="Publicar ofertas"
                />
                <UserTypeOption
                  value="buyer"
                  label="Comprador"
                  desc="Buscar granos"
                />
                <UserTypeOption
                  value="both"
                  label="Ambos"
                  desc="Comprar y vender"
                  defaultChecked
                />
              </div>
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="full_name">Nombre o razón social</Label>
                <Input id="full_name" className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+54 ..."
                  className="mt-1.5"
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">País</Label>
                <Select id="country" className="mt-1.5" defaultValue="">
                  <option value="" disabled>
                    Seleccioná un país
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
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  className="mt-1.5"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <Label htmlFor="password_confirm">Repetir contraseña</Label>
                <Input
                  id="password_confirm"
                  type="password"
                  className="mt-1.5"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <p className="text-xs text-ink-500">
              Al crear cuenta aceptás nuestros{" "}
              <Link
                href="/terminos"
                className="text-ink-700 underline underline-offset-4 hover:text-ink-900"
              >
                Términos
              </Link>{" "}
              y{" "}
              <Link
                href="/privacidad"
                className="text-ink-700 underline underline-offset-4 hover:text-ink-900"
              >
                Política de privacidad
              </Link>
              .
            </p>

            <Button type="submit" size="lg" className="w-full">
              Crear cuenta
            </Button>
          </form>

          <p className="mt-8 border-t border-ink-100 pt-6 text-center text-sm text-ink-600">
            ¿Ya tenés cuenta?{" "}
            <Link
              href="/login"
              className="font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
            >
              Ingresar
            </Link>
          </p>
        </div>

        {/* Panel lateral — beneficios */}
        <aside className="hidden md:block">
          <div className="sticky top-24 rounded-2xl border border-ink-100 bg-ink-900 p-8 text-ink-50">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-300">
              Lo que te llevás
            </p>
            <h2 className="mt-3 font-display text-2xl font-medium leading-tight">
              Empezá a operar en minutos.
            </h2>
            <ul className="mt-6 space-y-4 text-sm text-ink-50/85">
              <Benefit>Publicar ofertas ilimitadas, gratis</Benefit>
              <Benefit>Acceso al marketplace global de granos</Benefit>
              <Benefit>Contacto directo con la contraparte</Benefit>
              <Benefit>0% de comisión durante el MVP</Benefit>
              <Benefit>Tu razón social como «Empresa verificada»</Benefit>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function UserTypeOption({
  value,
  label,
  desc,
  defaultChecked,
}: {
  value: string;
  label: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="group relative flex cursor-pointer flex-col gap-1 rounded-xl border border-ink-200 bg-white p-3 text-center transition-colors hover:border-ink-300 has-[:checked]:border-brand-700 has-[:checked]:bg-brand-50 has-[:checked]:ring-2 has-[:checked]:ring-brand-700/15">
      <input
        type="radio"
        name="user_type"
        value={value}
        defaultChecked={defaultChecked}
        className="sr-only"
      />
      <span className="text-sm font-medium text-ink-900 group-has-[:checked]:text-brand-800">
        {label}
      </span>
      <span className="text-[11px] text-ink-500">{desc}</span>
    </label>
  );
}

function Benefit({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
        <Check className="h-3 w-3" />
      </span>
      <span>{children}</span>
    </li>
  );
}
