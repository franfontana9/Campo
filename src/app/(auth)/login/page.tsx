import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-6 py-20">
      <div className="rounded-2xl border border-ink-100 bg-white p-8 shadow-sm md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Ingresar
        </p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900">
          Bienvenido de vuelta.
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Accedé a tu cuenta de Campo.
        </p>

        <form className="mt-8 space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              className="mt-1.5"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" className="mt-1.5" required />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Ingresar
          </Button>
        </form>

        <p className="mt-8 border-t border-ink-100 pt-6 text-center text-sm text-ink-600">
          ¿No tenés cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
