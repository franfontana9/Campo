import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  BadgeCheck,
  MapPin,
  Calendar,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ReportButton } from "@/components/ui/ReportButton";
import { ListingCard } from "@/components/listings/ListingCard";
import { CURRENT_USER, MOCK_LISTINGS } from "@/lib/mock-data";
import { countryLabel, USER_TYPES } from "@/lib/constants";
import { formatDate, mockInterestsCount } from "@/lib/utils";

type ProfileLike = {
  id: string;
  full_name: string;
  user_type?: string;
  country: string;
  region: string;
  city: string;
  created_at?: string;
};

function findProfile(id: string): ProfileLike | undefined {
  if (id === CURRENT_USER.id) return CURRENT_USER;
  // Buscar en sellers de listings
  const fromListing = MOCK_LISTINGS.find((l) => l.user_id === id)?.seller;
  return fromListing as ProfileLike | undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = findProfile(id);
  if (!p) return { title: "Perfil no encontrado" };
  return {
    title: p.full_name,
    description: `Perfil público de ${p.full_name} en Campo — marketplace global de granos.`,
  };
}

export default async function PerfilPublicoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = findProfile(id);
  if (!profile) notFound();

  const listings = MOCK_LISTINGS.filter((l) => l.user_id === id);
  const active = listings.filter((l) => l.status === "active");
  const closed = listings.filter((l) => l.status === "closed");

  // Stats derivados
  const totalInterests = listings.reduce(
    (sum, l) => sum + mockInterestsCount(l.id),
    0,
  );
  const memberSince = profile.created_at ?? listings[0]?.created_at ?? null;

  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 py-10 lg:px-10">
      <nav className="mb-6 text-sm text-ink-500">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1 hover:text-ink-900"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al marketplace
        </Link>
      </nav>

      {/* Header del perfil */}
      <header className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-sm">
        <div
          className="h-32"
          style={{
            background:
              "linear-gradient(135deg, #25301a 0%, #4f632f 60%, #a8bc7f 100%)",
          }}
        />
        <div className="relative px-7 pb-7">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-100 text-brand-700 ring-4 ring-white">
              <Building2 className="h-10 w-10" />
            </div>
            <div className="flex gap-2">
              <Badge variant="brand">
                <BadgeCheck className="mr-1 h-3 w-3" /> Empresa verificada
              </Badge>
              {profile.user_type && (
                <Badge variant="neutral">
                  {USER_TYPES.find((u) => u.value === profile.user_type)?.label ??
                    profile.user_type}
                </Badge>
              )}
            </div>
          </div>
          <h1 className="mt-5 font-display text-4xl font-medium tracking-tight text-ink-900">
            {profile.full_name}
          </h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-600">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-ink-400" />
              {profile.city}, {profile.region} ·{" "}
              {countryLabel(profile.country)}
            </span>
            {memberSince && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-ink-400" />
                En Campo desde {formatDate(memberSince)}
              </span>
            )}
          </p>

          {/* Mini-stats */}
          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-ink-100 bg-ink-100 sm:grid-cols-4">
            <MiniStat label="Publicaciones activas" value={active.length} />
            <MiniStat label="Operaciones cerradas" value={closed.length} />
            <MiniStat
              label="Total intereses recibidos"
              value={totalInterests}
            />
            <MiniStat label="Tiempo de respuesta" value="< 24 h" />
          </dl>
        </div>
      </header>

      {/* Sobre la empresa */}
      <section className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-ink-100 bg-white p-7 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
            A qué se dedica
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-800">
            {/* Mock — cuando exista campo bio en profiles, viene de ahí */}
            Empresa con operación activa en {countryLabel(profile.country)}.
            Comercializa granos físicos directamente con compradores
            internacionales, con foco en {profile.region}. Vendedor verificado
            por Campo.
          </p>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-7 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
            Confianza
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-ink-700">
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-brand-700" />
              Razón social verificada
            </li>
            <li className="flex items-center gap-3">
              <Send className="h-4 w-4 text-brand-700" />
              Responde habitualmente en menos de 24 h
            </li>
            <li className="flex items-center gap-3">
              <BadgeCheck className="h-4 w-4 text-brand-700" />
              {closed.length > 0
                ? `${closed.length} operaciones cerradas en Campo`
                : "Sin operaciones cerradas todavía"}
            </li>
          </ul>
        </div>
      </section>

      {/* Publicaciones activas */}
      <section className="mt-12">
        <header className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Publicaciones
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900">
              Activas{" "}
              <span className="text-ink-400">({active.length})</span>
            </h2>
          </div>
        </header>
        {active.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-ink-200 bg-white p-10 text-center text-sm text-ink-500">
            Sin publicaciones activas en este momento.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {active.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>

      {/* Reportar usuario */}
      <div className="mt-10 flex justify-end">
        <ReportButton target="user" />
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="bg-white px-5 py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-medium text-ink-900">
        {value}
      </p>
    </div>
  );
}
