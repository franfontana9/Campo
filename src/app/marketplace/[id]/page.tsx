import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Scale,
  Calendar,
  Coins,
  Building2,
  ShieldCheck,
  MessageSquare,
  Clock,
  Users,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import {
  formatDate,
  formatPrice,
  formatTonnage,
  mockInterestsCount,
  timeAgo,
} from "@/lib/utils";
import { countryLabel, grainLabel } from "@/lib/constants";
import { ListingCard } from "@/components/listings/ListingCard";
import { GrainVisual } from "@/components/listings/GrainVisual";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = MOCK_LISTINGS.find((l) => l.id === id);
  if (!listing) notFound();

  const related = MOCK_LISTINGS.filter(
    (l) => l.id !== listing.id && l.grain_type === listing.grain_type,
  ).slice(0, 3);
  const interests = mockInterestsCount(listing.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-ink-500">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1 hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" /> Marketplace
        </Link>
        <span className="text-ink-300">/</span>
        <span className="text-ink-700">
          {grainLabel(listing.grain_type)} · {listing.city}
        </span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Columna principal */}
        <article>
          {/* Hero visual */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-ink-100 shadow-sm">
            {listing.image_url ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={listing.image_url}
                alt={`${grainLabel(listing.grain_type)} — ${listing.city}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <GrainVisual
                grainType={listing.grain_type}
                size="hero"
                className="h-full w-full"
              />
            )}
            <div className="absolute left-5 top-5 flex gap-2">
              <Badge variant="brand" className="shadow-sm">
                {grainLabel(listing.grain_type)}
              </Badge>
              <Badge variant="success" className="shadow-sm">
                Activa
              </Badge>
            </div>
            <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink-700 shadow-sm backdrop-blur">
              <Clock className="h-3 w-3" /> publicada {timeAgo(listing.created_at)}
            </div>
          </div>

          {/* Título + meta */}
          <header className="mt-8">
            <h1 className="font-display text-4xl font-medium tracking-tight text-ink-900 md:text-5xl">
              {formatTonnage(listing.tonnage)} de{" "}
              {grainLabel(listing.grain_type).toLowerCase()}
            </h1>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-ink-600">
              <MapPin className="h-4 w-4 text-ink-400" />
              {listing.city}, {listing.region} ·{" "}
              {countryLabel(listing.country)}
            </p>
          </header>

          {/* Specs */}
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-100 bg-ink-100 md:grid-cols-4">
            <Spec
              icon={<Scale className="h-4 w-4" />}
              label="Toneladas"
              value={formatTonnage(listing.tonnage)}
            />
            <Spec
              icon={<Coins className="h-4 w-4" />}
              label={listing.price_mode === "fixed" ? "Precio / t" : "Precio"}
              value={formatPrice(listing.price, listing.currency)}
            />
            <Spec
              icon={<Calendar className="h-4 w-4" />}
              label="Entrega"
              value={formatDate(listing.delivery_date)}
            />
            <Spec
              icon={<MapPin className="h-4 w-4" />}
              label="Origen"
              value={countryLabel(listing.country)}
            />
          </dl>

          {/* Descripción */}
          <section className="mt-8 rounded-2xl border border-ink-100 bg-white p-7 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Descripción
            </h2>
            <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-ink-800">
              {listing.description}
            </p>
          </section>

          {/* Vendedor */}
          <section className="mt-6 rounded-2xl border border-ink-100 bg-white p-7 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Vendedor
            </h2>
            <div className="mt-5 flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 ring-4 ring-brand-50">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink-900">
                  {listing.seller?.full_name}
                </p>
                <p className="mt-0.5 text-sm text-ink-500">
                  {listing.seller?.city}, {listing.seller?.region} ·{" "}
                  {countryLabel(listing.seller?.country ?? "")}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="neutral">Vendedor</Badge>
                  <Badge variant="brand">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    Verificado
                  </Badge>
                </div>
              </div>
            </div>
          </section>

          {/* Relacionados */}
          {related.length > 0 && (
            <section className="mt-12">
              <h2 className="font-display text-2xl font-medium tracking-tight text-ink-900">
                Otras ofertas de{" "}
                {grainLabel(listing.grain_type).toLowerCase()}
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Buy box — patrón Amazon: panel sticky con CTA prominente */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-lg">
            {/* Precio + ubicación */}
            <div className="p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                {listing.price_mode === "fixed"
                  ? "Precio por tonelada"
                  : "Modalidad"}
              </p>
              <p className="mt-2 font-display text-5xl font-medium tracking-tight text-ink-900">
                {formatPrice(listing.price, listing.currency)}
              </p>
              {listing.price_mode === "fixed" ? (
                <p className="mt-2 text-sm text-ink-500">
                  Total estimado{" "}
                  <span className="font-medium text-ink-900">
                    {formatPrice(
                      (listing.price ?? 0) * listing.tonnage,
                      listing.currency,
                    )}
                  </span>{" "}
                  · {formatTonnage(listing.tonnage)}
                </p>
              ) : (
                <p className="mt-2 text-sm text-ink-500">
                  Precio abierto a negociación · {formatTonnage(listing.tonnage)}
                </p>
              )}
              <p className="mt-4 flex items-center gap-1.5 text-sm text-ink-700">
                <MapPin className="h-4 w-4 text-ink-400" />
                {listing.city}, {listing.region} ·{" "}
                {countryLabel(listing.country)}
              </p>
            </div>

            {/* Vendedor */}
            <div className="flex items-center gap-3 border-t border-ink-100 px-7 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-900">
                  {listing.seller?.full_name}
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-brand-700">
                  <BadgeCheck className="h-3 w-3" /> Empresa verificada
                </p>
              </div>
            </div>

            {/* Formulario de interés */}
            <div className="border-t border-ink-100 bg-ink-50/60 p-7">
              <form className="space-y-3">
                <div>
                  <Label htmlFor="message">Mensaje inicial</Label>
                  <Textarea
                    id="message"
                    rows={4}
                    placeholder="Hola, me interesa la oferta. ¿Podemos hablar sobre condiciones y entrega?"
                    className="mt-1.5"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  <MessageSquare className="h-4 w-4" />
                  Me interesa
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="w-full"
                >
                  Guardar para después
                </Button>
                <p className="text-center text-xs text-ink-500">
                  Necesitás una cuenta para enviar tu interés.
                </p>
              </form>
            </div>

            {/* Señales de confianza + actividad */}
            <ul className="divide-y divide-ink-100 border-t border-ink-100 text-sm text-ink-700">
              <li className="flex items-center gap-3 px-7 py-3">
                <Users className="h-4 w-4 text-brand-700" />
                <span>
                  <span className="font-medium text-ink-900">{interests}</span>{" "}
                  interesados en esta oferta
                </span>
              </li>
              <li className="flex items-center gap-3 px-7 py-3">
                <ShieldCheck className="h-4 w-4 text-brand-700" />
                Vendedor verificado
              </li>
              <li className="flex items-center gap-3 px-7 py-3">
                <MessageSquare className="h-4 w-4 text-brand-700" />
                Respuesta promedio en 24 h
              </li>
              <li className="flex items-center gap-3 px-7 py-3">
                <Calendar className="h-4 w-4 text-brand-700" />
                Entrega {formatDate(listing.delivery_date)}
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
        {icon} {label}
      </div>
      <div className="mt-2 text-lg font-medium text-ink-900">{value}</div>
    </div>
  );
}
