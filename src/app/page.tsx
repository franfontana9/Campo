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
import { GrainVisual } from "@/components/listings/GrainVisual";
import { ListingCard } from "@/components/listings/ListingCard";
import { LiveTicker } from "@/components/listings/LiveTicker";
import { MOCK_LISTINGS, getMarketplaceStats } from "@/lib/mock-data";
import { timeAgo, formatTonnage } from "@/lib/utils";
import { SplitHeadline } from "@/components/effects/SplitHeadline";
import { Reveal } from "@/components/effects/Reveal";

export default function HomePage() {
  const featured = MOCK_LISTINGS.filter((l) => l.status === "active").slice(0, 3);
  const stats = getMarketplaceStats();

  return (
    <>
      {/* Hero cinemático ------------------------------------------------ */}
      <section className="relative isolate overflow-hidden bg-ink-900 text-ink-50">
        {/* Capa 1 — foto: cosechadora en campo de trigo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          aria-hidden
          src="/images/grains/farm-01.jpg"
          alt=""
          className="absolute inset-0 -z-30 h-full w-full object-cover"
        />
        {/* Capa 2 — overlay diagonal: oscuro en izq (texto legible),
                    se atenúa a la derecha para que la foto respire */}
        <div
          aria-hidden
          className="absolute inset-0 -z-20"
          style={{
            background:
              "linear-gradient(105deg, rgba(23,23,15,0.92) 0%, rgba(23,23,15,0.78) 35%, rgba(23,23,15,0.55) 60%, rgba(23,23,15,0.35) 100%)",
          }}
        />
        {/* Capa 3 — viñeteado inferior para anclar al fondo */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-48"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(23,23,15,0.85) 100%)",
          }}
        />

        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-20 md:grid-cols-[1.2fr_1fr] md:gap-16 md:pt-28">
          <div className="anim-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-ink-50/15 bg-ink-50/[0.06] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-50/80">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-300" />
              Marketplace global de granos · {GRAIN_TYPES.length} cultivos
            </p>

            <h1
              className="mt-7 font-display text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl lg:text-[56px]"
              aria-label="Comprá y vendé granos físicos, directo entre empresas."
            >
              <SplitHeadline>
                Comprá y vendé granos físicos,{" "}
                <span className="italic text-brand-200">
                  directo entre empresas
                </span>
                .
              </SplitHeadline>
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

          {/* Panel lateral — stats glassmorphic */}
          <aside className="anim-fade-up anim-delay-2 hidden self-end md:block">
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-50/15 bg-ink-900/55 shadow-2xl backdrop-blur-md">
              <Stat
                value={formatTonnage(stats.totalTonnage)}
                label="Toneladas disponibles"
              />
              <Stat value={`${stats.activeCount}`} label="Ofertas activas" />
              <Stat value={`${stats.newToday}`} label="Nuevas hoy" />
              <Stat value="0%" label="Comisión MVP" />
            </div>
            <p className="mt-4 text-xs text-ink-50/55">
              Datos del marketplace · MVP en validación.
            </p>
          </aside>
        </div>
      </section>

      {/* Live ticker de actividad --------------------------------------- */}
      <LiveTicker />

      {/* Cultivos — grid clickeable ------------------------------------- */}
      <section className="border-b border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                Cultivos disponibles
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900 md:text-4xl">
                Explorá por <em className="text-brand-700">grano</em>.
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {GRAIN_TYPES.map((g) => {
              const count = MOCK_LISTINGS.filter(
                (l) => l.status === "active" && l.grain_type === g.value,
              ).length;
              return (
                <Link
                  key={g.value}
                  href={`/marketplace?grain=${g.value}`}
                  className="group relative block aspect-square overflow-hidden rounded-2xl border border-ink-100 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-ink-200 hover:shadow-lg"
                >
                  {/* Capa visual */}
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]">
                    <GrainVisual
                      grainType={g.value}
                      size="card"
                      className="h-full w-full"
                    />
                  </div>
                  {/* Capa contenido */}
                  <div className="relative z-10 flex h-full flex-col justify-between p-4">
                    <span className="self-start rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-medium text-ink-700 shadow-sm backdrop-blur">
                      {count} {count === 1 ? "oferta" : "ofertas"}
                    </span>
                    <p className="font-display text-3xl font-medium leading-none tracking-tight text-white drop-shadow-md">
                      {g.label}
                    </p>
                  </div>
                </Link>
              );
            })}
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
          {featured.map((l, i) => (
            <Reveal key={l.id} delay={i * 80}>
              <ListingCard listing={l} />
            </Reveal>
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

      {/* FAQ ------------------------------------------------------------ */}
      <section className="border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                Preguntas frecuentes
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900 md:text-4xl">
                Lo que querés saber.
              </h2>
              <p className="mt-4 text-sm text-ink-600">
                ¿No encontrás respuesta?{" "}
                <Link
                  href="/contacto"
                  className="font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
                >
                  Escribinos.
                </Link>
              </p>
            </div>
            <div className="divide-y divide-ink-100 border-y border-ink-100">
              <FaqItem
                q="¿Campo cobra alguna comisión?"
                a="Durante el MVP, cero. Publicar y mostrar interés es gratis. Si en el futuro agregamos servicios pagos (logística, escrow, financiación), serán opcionales."
              />
              <FaqItem
                q="¿Cómo se verifica un vendedor?"
                a="Hoy es manual: revisamos razón social, contacto y antecedentes. La marca «Empresa verificada» refleja esa revisión. A futuro vamos a integrar verificación automática vía CUIT/Tax ID."
              />
              <FaqItem
                q="¿Qué pasa después del «Me interesa»?"
                a="El vendedor recibe tu mensaje y datos de contacto. La negociación, los términos comerciales y el pago se manejan por fuera de Campo — como ya lo hacés hoy."
              />
              <FaqItem
                q="¿De qué países pueden ser las publicaciones?"
                a="Globales. Hoy tenemos vendedores y compradores activos en Argentina, Brasil, Uruguay, Paraguay, EE. UU., Canadá, Ucrania, Francia, Australia y más."
              />
              <FaqItem
                q="¿Puedo publicar sin precio fijo?"
                a="Sí. La modalidad «A convenir» permite abrir la negociación sin anclarte a un valor — útil cuando esperás cierre por mercado o cuando es un volumen grande."
              />
              <FaqItem
                q="¿Cómo manejan la confidencialidad?"
                a="Sólo se muestra públicamente: tipo de grano, toneladas, ubicación, precio (si lo cargás) y razón social. Tu teléfono y email se comparten cuando hay interés mutuo."
              />
            </div>
          </div>
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
    <div className="bg-transparent px-6 py-6">
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

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-5 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
        <span className="font-medium text-ink-900 transition-colors group-hover:text-brand-800">
          {q}
        </span>
        <span
          aria-hidden
          className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink-200 text-ink-500 transition-all group-open:rotate-45 group-open:border-brand-700 group-open:bg-brand-700 group-open:text-white"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1.5v9M1.5 6h9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </summary>
      <p className="mt-3 max-w-2xl pr-10 text-[15px] leading-relaxed text-ink-600">
        {a}
      </p>
    </details>
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
