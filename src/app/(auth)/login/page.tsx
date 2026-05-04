import type { Metadata } from "next";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Accedé a tu cuenta de Campo.",
};

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

        {/* OAuth */}
        <div className="mt-6 space-y-2">
          <Button variant="outline" size="lg" className="w-full">
            <GoogleMark /> Continuar con Google
          </Button>
        </div>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-ink-100" />
          <p className="text-[11px] uppercase tracking-[0.14em] text-ink-400">
            o con email
          </p>
          <div className="h-px flex-1 bg-ink-100" />
        </div>

        <form className="space-y-5">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Contraseña</Label>
              <Link
                href="/recuperar"
                className="text-xs text-brand-700 underline underline-offset-4 hover:text-brand-800"
              >
                ¿La olvidaste?
              </Link>
            </div>
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

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
      <path
        d="M15.68 8.18c0-.55-.05-1.07-.14-1.58H8v3h4.31a3.69 3.69 0 0 1-1.6 2.42v2.01h2.59c1.51-1.39 2.38-3.44 2.38-5.85Z"
        fill="#4285F4"
      />
      <path
        d="M8 16c2.16 0 3.97-.71 5.3-1.93l-2.59-2.01c-.72.48-1.64.77-2.71.77-2.08 0-3.85-1.4-4.48-3.29H.85v2.07A8 8 0 0 0 8 16Z"
        fill="#34A853"
      />
      <path
        d="M3.52 9.54a4.81 4.81 0 0 1 0-3.07V4.4H.85a8 8 0 0 0 0 7.2l2.67-2.06Z"
        fill="#FBBC05"
      />
      <path
        d="M8 3.18c1.18 0 2.23.4 3.06 1.19l2.3-2.3C11.97.83 10.16 0 8 0 4.86 0 2.15 1.8.85 4.4l2.67 2.07C4.15 4.58 5.92 3.18 8 3.18Z"
        fill="#EA4335"
      />
    </svg>
  );
}
