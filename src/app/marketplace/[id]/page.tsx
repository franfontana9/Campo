import type { Metadata } from "next";
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
import { DisplayPrice } from "@/components/ui/DisplayPrice";
import { Textarea } from "@/components/ui/Textarea";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import {
  formatDate,
  formatTonnage,
  mockInterestsCount,
  timeAgo,
} from "@/lib/utils";
import { countryLabel, grainLabel } from "@/lib/constants";
import { ListingCard } from "@/components/listings/ListingCard";
import { GrainVisual } from "@/components/listings/GrainVisual";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { InterestForm } from "@/components/listings/InterestForm";
import { StickyListingHeader } from "@/components/listings/StickyListingHeader";
import { PriceCalculator } from "@/components/listings/PriceCalculator";
import { ReportButton } from "@/components/ui/ReportButton";
import { getListingGallery, MOCK_QUESTIONS } from "@/lib/mock-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = MOCK_LISTINGS.find((l) => l.id === id);
  if (!listing) {
    return { title: "Publicación no encontrada" };
  }
  const title = `${formatTonnage(listing.tonnage)} de ${grainLabel(
    listing.grain_type,
  ).toLowerCase()} · ${listing.city}`;
  const desc = `${formatTonnage(listing.tonnage)} de ${grainLabel(
    listing.grain_type,
  ).toLowerCase()} en ${listing.city}, ${countryLabel(
    listing.country,
  )}. Entrega ${listing.delivery_date}. Vendedor: ${
    listing.seller?.full_name ?? "—"
  }.`;
  return { title, description: desc };
}

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
  const gallery = getListingGallery(listing.id);
  const questions = MOCK_QUESTIONS.filter((q) => q.listing_id === listing.id);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 pb-24 pt-10 lg:px-10 lg:pb-10">
      {/* Sticky header al hacer scroll (desktop only) */}
      <StickyListingHeader
        title={`${formatTonnage(listing.tonnage)} de ${grainLabel(listing.grain_type).toLowerCase()} · ${listing.city}`}
        price={listing.price}
        currency={listing.currency}
        priceMode={listing.price_mode}
      />

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

      <div className="grid gap-10 lg:grid-cols-[1fr_400px] xl:gap-14">
        {/* Columna principal */}
        <article>
          {/* Hero visual: galería con lightbox o GrainVisual de fallback */}
          {listing.image_url || gallery.length > 0 ? (
            <div className="relative">
              <ListingGallery
                images={
                  listing.image_url ? [listing.image_url, ...gallery] : gallery
                }
                alt={`${grainLabel(listing.grain_type)} — ${listing.city}`}
              />
              <div className="pointer-events-none absolute left-5 top-5 z-10 flex gap-2">
                <Badge variant="brand" className="shadow-sm">
                  {grainLabel(listing.grain_type)}
                </Badge>
                <Badge variant="success" className="shadow-sm">
                  Activa
                </Badge>
              </div>
              <div className="pointer-events-none absolute left-5 top-[calc(56.25%-2.5rem)] z-10 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink-700 shadow-sm backdrop-blur">
                <Clock className="h-3 w-3" /> publicada {timeAgo(listing.created_at)}
              </div>
            </div>
          ) : (
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-ink-100 shadow-sm">
              <GrainVisual
                grainType={listing.grain_type}
                size="hero"
                className="h-full w-full"
              />
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
          )}

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
              value={
                <DisplayPrice
                  amount={listing.price}
                  from={listing.currency}
                  showApprox={false}
                />
              }
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

          {/* Q&A público */}
          <section className="mt-6 rounded-2xl border border-ink-100 bg-white p-7 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                Preguntas y respuestas
              </h2>
              <span className="text-xs text-ink-500">
                {questions.length}{" "}
                {questions.length === 1 ? "pregunta" : "preguntas"}
              </span>
            </div>

            {questions.length > 0 && (
              <ul className="mt-5 divide-y divide-ink-100">
                {questions.map((q) => (
                  <li key={q.id} className="py-4 first:pt-0 last:pb-0">
                    <p className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-100 text-xs font-semibold text-ink-700">
                        P
                      </span>
                      <span className="flex-1">
                        <span className="text-[15px] text-ink-900">
                          {q.question}
                        </span>
                        <span className="ml-2 text-[11px] text-ink-400">
                          — {q.asker_name} · {timeAgo(q.asked_at)}
                        </span>
                      </span>
                    </p>
                    {q.answer ? (
                      <p className="mt-3 flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
                          R
                        </span>
                        <span className="flex-1">
                          <span className="text-[15px] text-ink-700">
                            {q.answer}
                          </span>
                          {q.answered_at && (
                            <span className="ml-2 text-[11px] text-ink-400">
                              — vendedor · {timeAgo(q.answered_at)}
                            </span>
                          )}
                        </span>
                      </p>
                    ) : (
                      <p className="ml-9 mt-2 text-[11px] italic text-ink-400">
                        Esperando respuesta del vendedor.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <form className="mt-6 flex flex-col gap-2 border-t border-ink-100 pt-5 sm:flex-row sm:items-center">
              <Textarea
                rows={2}
                placeholder="Hacé una pregunta pública sobre esta publicación..."
                className="flex-1"
              />
              <Button type="submit" size="md" className="shrink-0">
                Preguntar
              </Button>
            </form>
            <p className="mt-2 text-[11px] text-ink-500">
              Las preguntas y respuestas son visibles para todos los compradores.
            </p>
          </section>

          {/* Vendedor */}
          <section className="mt-6 rounded-2xl border border-ink-100 bg-white p-7 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Vendedor
            </h2>
            <Link
              href={`/u/${listing.user_id}`}
              className="group mt-5 flex items-start gap-4 rounded-xl p-2 -m-2 transition-colors hover:bg-ink-50"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700 ring-4 ring-brand-50">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-ink-900 group-hover:underline">
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
                  <span className="text-xs text-ink-500 underline-offset-4 group-hover:underline">
                    Ver perfil →
                  </span>
                </div>
              </div>
            </Link>
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

          {/* Reportar */}
          <div className="mt-10 flex justify-end">
            <ReportButton target="listing" />
          </div>
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
                <DisplayPrice
                  amount={listing.price}
                  from={listing.currency}
                  showApprox={false}
                />
              </p>
              {listing.price_mode === "fixed" ? (
                <p className="mt-2 text-sm text-ink-500">
                  Total estimado{" "}
                  <span className="font-medium text-ink-900">
                    <DisplayPrice
                      amount={(listing.price ?? 0) * listing.tonnage}
                      from={listing.currency}
                    />
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

            {/* Calculadora de volumen (sólo precio fijo) */}
            {listing.price_mode === "fixed" && listing.price !== null && (
              <PriceCalculator
                pricePerTon={listing.price}
                totalTonnage={listing.tonnage}
                fromCurrency={listing.currency}
              />
            )}

            {/* Formulario de interés */}
            <div id="message" className="border-t border-ink-100 bg-ink-50/60 p-7">
              <InterestForm
                listingId={listing.id}
                sellerName={listing.seller?.full_name ?? "el vendedor"}
              />
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

      {/* Sticky CTA mobile — visible sólo en <lg, sale del flow */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3 px-2">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xl font-medium text-ink-900">
              <DisplayPrice
                amount={listing.price}
                from={listing.currency}
                showApprox={false}
              />
            </p>
            <p className="truncate text-[11px] uppercase tracking-[0.14em] text-ink-500">
              {listing.price_mode === "fixed" ? "Precio / t" : "A convenir"}
              {" · "}
              {formatTonnage(listing.tonnage)}
            </p>
          </div>
          <a href="#message">
            <Button size="lg" className="shrink-0">
              <MessageSquare className="h-4 w-4" />
              Me interesa
            </Button>
          </a>
        </div>
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
