import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { COUNTRIES, USER_TYPES } from "@/lib/constants";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col justify-center px-6 py-16">
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

        <form className="mt-8 grid gap-5 sm:grid-cols-2">
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
          <div className="sm:col-span-2">
            <Label htmlFor="user_type">Tipo de usuario</Label>
            <Select id="user_type" className="mt-1.5" defaultValue="both">
              {USER_TYPES.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="password_confirm">Repetir contraseña</Label>
            <Input
              id="password_confirm"
              type="password"
              className="mt-1.5"
              required
            />
          </div>

          <Button type="submit" size="lg" className="sm:col-span-2">
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
    </div>
  );
}
