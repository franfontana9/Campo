import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CURRENT_USER, MOCK_LISTINGS } from "@/lib/mock-data";
import { grainLabel, LISTING_STATUSES } from "@/lib/constants";
import { formatTonnage } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Editar publicación",
};

export default async function EditarPublicacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = MOCK_LISTINGS.find(
    (l) => l.id === id && l.user_id === CURRENT_USER.id,
  );
  if (!listing) notFound();

  return (
    <div>
      <header className="mb-6 border-b border-ink-100 pb-6">
        <Link
          href="/dashboard/publicaciones"
          className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a mis publicaciones
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
          Editar publicación
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-medium tracking-tight text-ink-900">
            {formatTonnage(listing.tonnage)} de{" "}
            <span className="italic">
              {grainLabel(listing.grain_type).toLowerCase()}
            </span>
          </h1>
          <Badge variant="neutral">
            {LISTING_STATUSES.find((s) => s.value === listing.status)?.label}
          </Badge>
        </div>
      </header>

      <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center">
        <p className="font-display text-2xl font-medium text-ink-900">
          Edición — pendiente de cableado
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-600">
          Cuando conectemos Supabase, este formulario va a cargar los valores
          actuales de la publicación, persistir cambios con server actions y
          permitir el cambio de estado (activa → en negociación → cerrada) y
          el borrado.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href={`/marketplace/${listing.id}`}>
            <Button variant="outline" size="md">
              Ver publicación pública
            </Button>
          </Link>
          <Link href="/dashboard/publicaciones">
            <Button variant="ghost" size="md">
              Volver al listado
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
