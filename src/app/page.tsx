import Link from "next/link";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Globe2,
  Handshake,
  PlusCircle,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GRAIN_TYPES } from "@/lib/constants";
import { ListingCard } from "@/components/listings/ListingCard";
import { MOCK_LISTINGS, getMarketplaceStats } from "@/lib/mock-data";
import { timeAgo, formatTonnage } from "@/lib/utils";

export default function HomePage() {
  const featured = MOCK_LISTINGS.filter((l) => l.status === "active").slice(0, 3);
  const stats = getMarketplaceStats();

  return (
    <>
      {/* Hero editorial ------------------------------------------------ */}
      <section className="relative isolate overflow-hidden bg-ink-900 text-ink-50">
        {/* Capa 1 — gradiente base profundo */}
        <div
          aria-hidden
          className="absolute inset-0 -z-30"
          style={{
            background:
              "linear-gradient(160deg, #17170f 0%, #1e2a18 35%, #2a3a20 65%, #3e4f26 100%)",
          }}
        />
        {/* Capa 2 — glow cálido (único, sutil) */}
        <div
          aria-hidden
          className="absolute -right-32 -top-56 -z-20 h-[520px] w-[520px] rounded-full opacity-40 blur-2xl"
          style={{
            background: "radial-gradient(circle, #a8bc7f 0%, transparent 70%)",
          }}
        />
        {/* Capa 3 — horizonte de campos estilizado (SVG) al pie */}
        <svg
          aria-hidden
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 -z-10 h-64 w-full opacity-60"
        >
          <defs>
            <linearGradient id="hillA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f632f" stopOpacity="0" />
              <stop offset="100%" stopColor="#25301a" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="hillB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3e4f26" stopOpacity="0" />
              <stop offset="100%" stopColor="#17170f" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M0,220 C180,180 340,200 520,200 C700,200 860,170 1060,180 C1240,188 1360,200 1440,210 L1440,320 L0,320 Z"
            fill="url(#hillA)"
          />
          <path
            d="M0,260 C160,230 320,260 500,250 C700,238 860,270 1060,260 C1240,252 1360,270 1440,262 L1440,320 L0,320 Z"
            fill="url(#hillB)"
          />
        </svg>

        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-20 md:grid-cols-[1.2fr_1fr] md:gap-16 md:pt-28">
          <div className="anim-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-ink-50/15 bg-ink-50/[0.06] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-50/80">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />
              Marketplace global de granos · {GRAIN_TYPES.length} cultivos
            </p>

            <h1 className="mt-7 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl lg:text-[56px]">
              Comprá y vendé granos físicos,{" "}
              <span className="italic text-brand-200">
                directo entre empresas
              </span>
              .
            </h1>
            <p className="mt-3 font-display text-base italic text-ink-50/60">
              El campo, conectado.
            </p>

            <p className="mt-6 max-w-xl text-lg text-ink-50/80">
              Productores, acopios, cooperativas y compradores publican y
              descubren ofertas en minutos — sin corredores, sin comisiones.
            </p>

            {/* CTAs primarios */}
            <div className="anim-fade-up anim-delay-2 mt-10 flex flex-wrap items-center gap-3">
              <Link href="/marketplace">
                <Button size="lg" className="h-12 px-7">
                  <Search className="h-4 w-4" /> Explorar ofertas
                </Button>
              </Link>
              <Link href="/dashboard/publicaciones/nueva">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-ink-50/30 bg-transparent px-7 text-ink-50 hover:bg-ink-50/10"
                >
                  <PlusCircle className="h-4 w-4" /> Publicar oferta
                </Button>
              </Link>
            </div>

            {/* Bar de actividad */}
            <p className="anim-fade-up anim-delay-3 mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-50/70">
              <span className="inline-flex items-center gap-1.5">
                <Circle className="h-2 w-2 animate-pulse fill-brand-300 text-brand-300" />
                <span className="font-medium text-ink-50">
                  {stats.activeCount}
                </span>{" "}
                ofertas activas
              </span>
              {stats.latestAt && (
                <>
                  <span className="text-ink-50/30">·</span>
                  <span>última {timeAgo(stats.latestAt)}</span>
                </>
              )}
            </p>
          </div>

          {/* Panel lateral — stats */}
          <aside className="anim-fade-up anim-delay-2 hidden self-end md:block">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-50/10 bg-ink-50/[0.08]">
              <Stat
                value={formatTonnage(stats.totalTonnage).replace(" t", " t")}
                label="Toneladas disponibles"
              />
              <Stat value={`${stats.activeCount}`} label="Ofertas activas" />
              <Stat value={`${stats.newToday}`} label="Nuevas hoy" />
              <Stat value="0%" label="Comisión MVP" />
            </div>
            <p className="mt-4 text-xs text-ink-50/50">
              Datos del marketplace · MVP en validación.
            </p>
          </aside>
        </div>
      </section>

      {/* Granos disponibles — tira editorial ---------------------------- */}
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-6 py-6 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
            Granos disponibles
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-ink-800">
            {GRAIN_TYPES.map((g, i) => (
              <span key={g.value} className="inline-flex items-center gap-5">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-ink-300" />}
                <span>{g.label}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Destacados ---------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Ofertas destacadas
            </p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink-900 md:text-5xl">
              Publicaciones <em className="text-brand-700">activas</em>.
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="hidden items-center gap-1.5 text-sm font-medium text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors hover:text-brand-800 hover:decoration-brand-700 md:inline-flex"
          >
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* Cómo funciona — tres pasos editoriales -------------------------- */}
      <section className="border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Cómo funciona
            </p>
            <h2 className="mt-3 font-display text-4xl font-medium tracking-tight text-ink-900 md:text-5xl">
              Del lote al comprador en <em className="text-brand-700">tres pasos</em>.
            </h2>
          </div>
          <div className="mt-12 grid gap-10 border-t border-ink-100 pt-10 md:grid-cols-3">
            <Step
              n="01"
              title="Publicá o explorá"
              text="Cargá tu oferta con toneladas, ubicación y precio — o filtrá por grano y país para encontrar lo que necesitás."
            />
            <Step
              n="02"
              title="Contactá directo"
              text="Un mensaje con el botón “Me interesa”. Sin corredores, sin chats complejos, sin comisiones."
            />
            <Step
              n="03"
              title="Cerrá por fuera"
              text="Negocian condiciones y logística como siempre lo hicieron. Campo sólo conecta las puntas."
            />
          </div>
        </div>
      </section>

      {/* Trust strip ---------------------------------------------------- */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 md:grid-cols-3">
          <TrustItem
            icon={<Globe2 className="h-5 w-5" />}
            title="Global desde el día uno"
            text="Productores y compradores de Argentina, Brasil, EE.UU., Ucrania, la UE y más."
          />
          <TrustItem
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Sin intermediarios"
            text="Contacto directo entre vendedor y comprador. Vos controlás la operación."
          />
          <TrustItem
            icon={<Handshake className="h-5 w-5" />}
            title="0% de comisión"
            text="Mientras dure el MVP. Publicás y mostrás interés gratis, siempre."
          />
        </div>
      </section>

      {/* CTA final ------------------------------------------------------ */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-brand-800 bg-brand-800 p-10 text-ink-50 md:p-16">
          <div
            aria-hidden
            className="absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, #a8bc7f 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="max-w-2xl font-display text-4xl font-medium tracking-tight md:text-5xl">
              Tu primer lote, <em className="italic text-brand-200">hoy</em>.
            </h2>
            <p className="mt-4 max-w-xl text-ink-50/80">
              Productores, acopios, cooperativas, corredores y compradores.
              Campo es abierto a todos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg" className="bg-ink-50 text-brand-800 hover:bg-white">
                  Crear cuenta gratis
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-ink-50/30 bg-transparent text-ink-50 hover:bg-ink-50/10"
                >
                  Explorar ofertas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-ink-900/85 px-6 py-6">
      <p className="font-display text-3xl font-medium tracking-tight text-ink-50">
        {value}
      </p>
      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-50/75">
        {label}
      </p>
    </div>
  );
}

function Step({
  n,
  title,
  text,
}: {
  n: string;
  title: string;
  text: string;
}) {
  return (
    <div className="relative">
      <div className="font-display text-5xl font-medium text-brand-100">
        <span className="italic text-brand-700">/</span>
        {n}
      </div>
      <h3 className="mt-4 font-display text-2xl font-medium tracking-tight text-ink-900">
        {title}
      </h3>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{text}</p>
    </div>
  );
}

function TrustItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white p-8">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        {icon}
      </div>
      <p className="mt-4 font-display text-xl font-medium tracking-tight text-ink-900">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{text}</p>
    </div>
  );
}
