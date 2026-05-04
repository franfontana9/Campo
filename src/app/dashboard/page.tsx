import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Inbox,
  Send,
  CheckCircle2,
  Circle,
  PlusCircle,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Mi panel",
  description: "Resumen de tu actividad en Campo.",
};

export default function DashboardPage() {
  return (
    <div>
      <header className="mb-8 border-b border-ink-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Panel
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink-900">
          Hola, bienvenido
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Tu actividad en Campo en un vistazo.
        </p>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          icon={<FileText className="h-4 w-4" />}
          label="Publicaciones activas"
          value={0}
          empty="Sin publicaciones aún"
        />
        <Stat
          icon={<Inbox className="h-4 w-4" />}
          label="Intereses recibidos"
          value={0}
          empty="Nadie te contactó todavía"
        />
        <Stat
          icon={<Send className="h-4 w-4" />}
          label="Intereses enviados"
          value={0}
          empty="No mostraste interés todavía"
        />
      </div>

      {/* Primeros pasos */}
      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Primeros pasos
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium tracking-tight text-ink-900">
              Empezá a usar Campo
            </h2>
          </div>
          <span className="text-sm text-ink-500">0 / 3</span>
        </div>

        <ol className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
          <Step
            n="01"
            title="Completá tu perfil"
            desc="Razón social, ubicación y contacto. Los compradores quieren saber con quién hablan."
            cta="Editar perfil"
            href="/dashboard"
            done={false}
          />
          <Step
            n="02"
            title="Publicá tu primera oferta"
            desc="Cargá grano, toneladas, ubicación y precio. Aparece en el marketplace en segundos."
            cta="Nueva publicación"
            href="/dashboard/publicaciones/nueva"
            done={false}
            primary
          />
          <Step
            n="03"
            title="Explorá el marketplace"
            desc="Mirá qué se está moviendo en tu grano y región. Es la mejor forma de fijar tu precio."
            cta="Ir al marketplace"
            href="/marketplace"
            done={false}
          />
        </ol>
      </section>

      {/* Atajos */}
      <section className="mt-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Atajos
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Shortcut
            href="/dashboard/publicaciones/nueva"
            icon={<PlusCircle className="h-5 w-5" />}
            title="Publicar oferta"
            sub="Carga rápida en 60 segundos"
          />
          <Shortcut
            href="/marketplace"
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Buscar granos"
            sub="Filtros por país, volumen, modalidad"
          />
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  empty,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  empty: string;
}) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between text-ink-500">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]">
          {label}
        </p>
        <span className="text-ink-400">{icon}</span>
      </div>
      <p className="mt-3 font-display text-4xl font-medium tracking-tight text-ink-900">
        {value}
      </p>
      <p className="mt-1 text-xs text-ink-500">{empty}</p>
    </div>
  );
}

function Step({
  n,
  title,
  desc,
  cta,
  href,
  done,
  primary,
}: {
  n: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  done: boolean;
  primary?: boolean;
}) {
  return (
    <li className="flex flex-col gap-4 border-b border-ink-100 p-6 last:border-b-0 sm:flex-row sm:items-center">
      <div className="flex shrink-0 items-center gap-4 sm:w-[280px]">
        {done ? (
          <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-600" />
        ) : (
          <Circle className="h-5 w-5 shrink-0 text-ink-300" />
        )}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            Paso {n}
          </p>
          <p className="mt-0.5 font-medium text-ink-900">{title}</p>
        </div>
      </div>
      <p className="flex-1 text-sm text-ink-600">{desc}</p>
      <Link href={href} className="shrink-0">
        <Button
          size="sm"
          variant={primary ? "primary" : "outline"}
          className="whitespace-nowrap"
        >
          {cta}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </li>
  );
}

function Shortcut({
  href,
  icon,
  title,
  sub,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-ink-200 hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-ink-900">{title}</p>
        <p className="text-xs text-ink-500">{sub}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-ink-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-700" />
    </Link>
  );
}
