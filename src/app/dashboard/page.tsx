import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  return (
    <div>
      <header className="mb-8 border-b border-ink-100 pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Panel
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-ink-900">
          Resumen
        </h1>
        <p className="mt-2 text-sm text-ink-600">
          Actividad de tu cuenta en un vistazo.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Publicaciones activas" value="—" />
        <Stat label="Intereses recibidos" value="—" />
        <Stat label="Intereses enviados" value="—" />
      </div>

      <section className="mt-10 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-7 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-50 text-accent-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-medium tracking-tight text-ink-900">
                Empezá con tu primera publicación
              </h2>
              <p className="mt-1 text-sm text-ink-600">
                Todavía no hay datos para mostrar. Cuando conectemos Supabase,
                tus publicaciones e intereses aparecen acá.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:flex-nowrap">
            <Link href="/dashboard/publicaciones/nueva">
              <Button size="sm">Nueva publicación</Button>
            </Link>
            <Link href="/marketplace">
              <Button size="sm" variant="outline">
                Ver marketplace <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
        {label}
      </p>
      <p className="mt-3 font-display text-4xl font-medium tracking-tight text-ink-900">
        {value}
      </p>
    </div>
  );
}
