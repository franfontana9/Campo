import Link from "next/link";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  PlusCircle,
  Circle,
  Wheat,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GRAIN_TYPES } from "@/lib/constants";
import { GrainVisual } from "@/components/listings/GrainVisual";
import { LiveTicker } from "@/components/listings/LiveTicker";
import { MOCK_LISTINGS, getMarketplaceStats } from "@/lib/mock-data";
import { GRAIN_PRICES } from "@/lib/price-data";
import { timeAgo } from "@/lib/utils";
import { SplitHeadline } from "@/components/effects/SplitHeadline";
import { CountUp } from "@/components/effects/CountUp";

/** Top 4 granos para el preview de precios en home. */
const PRICE_PREVIEW_GRAINS = ["soja", "maiz", "trigo", "girasol"] as const;

/** Resumen por cultivo — para enriquecer las cards de "Cultivos disponibles". */
function cultivoMeta(grainType: string) {
  const active = MOCK_LISTINGS.filter(
    (l) => l.status === "active" && l.grain_type === grainType,
  );
  const fixedUsd = active.filter(
    (l) =>
      l.price_mode === "fixed" && l.price !== null && l.currency === "USD",
  );
  const minPrice = fixedUsd.length
    ? Math.min(...fixedUsd.map((l) => l.price as number))
    : null;
  const countryFreq = active.reduce<Record<string, number>>((acc, l) => {
    acc[l.country] = (acc[l.country] ?? 0) + 1;
    return acc;
  }, {});
  const mainCountry =
    Object.entries(countryFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
  return { count: active.length, minPrice, mainCountry };
}

export default function HomePage() {
  const stats = getMarketplaceStats();
  const uniqueCountries = new Set(
    MOCK_LISTINGS.filter((l) => l.status === "active").map((l) => l.country),
  ).size;

  // Trust strip — empresas reales operando en el marketplace
  const allSellers = Array.from(
    new Set(
      MOCK_LISTINGS.filter((l) => l.status === "active" && l.seller).map(
        (l) => l.seller!.full_name,
      ),
    ),
  );
  const trustedCompanies = allSellers.slice(0, 8);
  const grainTypesCovered = GRAIN_TYPES.filter((g) =>
    MOCK_LISTINGS.some(
      (l) => l.status === "active" && l.grain_type === g.value,
    ),
  ).length;

  return (
    <>
      {/* Hero cinemático ------------------------------------------------ */}
      <section className="relative isolate flex min-h-[85vh] flex-col justify-center overflow-hidden bg-ink-900 text-ink-50">
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
        {/* Capa 3 — viñeteado inferior SUTIL: solo anclar al fondo,
                    sin crear una banda visible. La foto se va apagando. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-32"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(23,23,15,0.55) 100%)",
          }}
        />
        {/* Capa 4 — textura sutil de puntos, mismo recurso que la sección
                    verde, para que el ojo perciba continuidad de tono */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        <div className="mx-auto w-full max-w-6xl px-6 py-16 md:py-20">
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
              descubren ofertas en minutos. Vendedores verificados, alcance
              global.
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
            <p className="anim-fade-up anim-delay-3 mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-50/70">
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
                  <span>última publicada {timeAgo(stats.latestAt)}</span>
                </>
              )}
              <span className="text-ink-50/30">·</span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-brand-300" />
                Vendedores verificados
              </span>
            </p>
          </div>

        </div>
      </section>

      {/* Live ticker — cinta horizontal con últimas publicaciones ------- */}
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
              const meta = cultivoMeta(g.value);
              if (meta.count === 0) return null;
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
                  {/* Pill arriba-izq: cantidad de ofertas */}
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-medium text-ink-700 shadow-sm backdrop-blur">
                    {meta.count} {meta.count === 1 ? "oferta" : "ofertas"}
                  </span>
                  {/* Pill arriba-der: país principal */}
                  {meta.mainCountry && (
                    <span className="absolute right-3 top-3 z-10 rounded-full bg-ink-900/70 px-2 py-0.5 text-[10px] font-semibold tracking-[0.04em] text-white shadow-sm backdrop-blur">
                      {meta.mainCountry}
                    </span>
                  )}
                  {/* Bottom info bar con gradient overlay */}
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-4 pt-10">
                    <p className="font-display text-3xl font-medium leading-none tracking-tight text-white drop-shadow-md">
                      {g.label}
                    </p>
                    {meta.minPrice !== null && (
                      <p className="mt-1.5 text-[11px] text-white/85">
                        desde{" "}
                        <span className="font-semibold text-white">
                          USD {meta.minPrice}
                        </span>
                        <span className="text-white/65">/t</span>
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Precios referenciales — preview con sparkline + variación ----- */}
      <section className="border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                Precios referenciales
              </p>
              <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-ink-900 md:text-4xl">
                Lo que se está{" "}
                <em className="italic text-brand-700">pagando</em>.
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-600">
                Referencia semanal por grano y región. Histórico de hasta 12
                meses en la sección completa.
              </p>
            </div>
            <Link
              href="/precios"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors hover:text-brand-800 hover:decoration-brand-700"
            >
              Ver tabla completa <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:grid-cols-2 lg:grid-cols-4">
            {PRICE_PREVIEW_GRAINS.map((slug) => {
              const p = GRAIN_PRICES.find((g) => g.grain === slug);
              if (!p) return null;
              return <PriceCard key={p.grain} price={p} />;
            })}
          </div>
        </div>
      </section>

      {/* Trust strip — empresas operando + credibilidad ---------------- */}
      <section className="relative overflow-hidden border-t border-ink-100 bg-ink-50/50">
        {/* Textura sutil de puntos */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.5) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
              Empresas que ya operan en Campo
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink-900 md:text-4xl">
              Productores y compradores en{" "}
              <em className="italic text-brand-700">
                {uniqueCountries} países
              </em>
              .
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-ink-600">
              Razón social, contacto y antecedentes verificados manualmente
              antes de operar.
            </p>
          </div>

          {/* Lista de empresas reales */}
          <div className="mt-12 grid grid-cols-2 items-center gap-x-6 gap-y-7 md:grid-cols-4">
            {trustedCompanies.map((name) => (
              <div
                key={name}
                className="flex items-center justify-center text-center"
              >
                <span className="font-display text-base italic tracking-tight text-ink-700/80 md:text-lg">
                  {name}
                </span>
              </div>
            ))}
          </div>

          {/* Stats de credibilidad */}
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 md:grid-cols-3">
            <CredItem
              icon={<ShieldCheck className="h-5 w-5" />}
              value={allSellers.length}
              label="Vendedores activos"
              hint="Razón social y contacto verificados"
            />
            <CredItem
              icon={<Globe2 className="h-5 w-5" />}
              value={uniqueCountries}
              label="Países conectados"
              hint="América, Europa, Asia y Oceanía"
            />
            <CredItem
              icon={<Wheat className="h-5 w-5" />}
              value={grainTypesCovered}
              label="Cultivos disponibles"
              hint="Soja, maíz, trigo, girasol y más"
            />
          </div>
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
              text="Un mensaje con el botón “Me interesa” y el vendedor recibe tus datos. Sin corredores entre las puntas, sin ruido."
            />
            <Step
              n="03"
              title="Cerrá por fuera"
              text="Negocian condiciones y logística como siempre lo hicieron. Campo sólo conecta las puntas."
            />
          </div>
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
                q="¿Cómo cobra Campo?"
                a="Crear cuenta y publicar es gratis para siempre. Cuando una operación se cierra a través del marketplace, Campo cobra una comisión por transacción al vendedor — el detalle se comunica antes de confirmar el match. Sin abonos mensuales ni costos ocultos."
              />
              <FaqItem
                q="¿Cómo se verifica un vendedor?"
                a="Hoy es manual: revisamos razón social, contacto y antecedentes. La marca «Empresa verificada» refleja esa revisión. A futuro vamos a integrar verificación automática vía CUIT / Tax ID."
              />
              <FaqItem
                q="¿Cómo se valida la calidad del grano?"
                a="La descripción de cada publicación incluye los parámetros relevantes (humedad, proteína, PH, calidad exportación, etc.). Las certificaciones físicas — SENASA, IRAM, GAFTA, FOSFA — las maneja cada parte como ya lo hace en el comercio tradicional. Campo conecta; ustedes validan los certificados durante la negociación."
              />
              <FaqItem
                q="¿Cómo se manejan la logística y los términos internacionales?"
                a="Cada publicación indica la condición (FOB planta, FOB puerto, CIF) y la fecha de entrega. Comprador y vendedor coordinan flete, despacho aduanero y pago según los Incoterms acordados. Para operaciones internacionales sugerimos confirmar Incoterm y banco corresponsal antes de cerrar."
              />
              <FaqItem
                q="¿Qué pasa después del «Me interesa»?"
                a="El vendedor recibe tu mensaje y datos de contacto. La negociación, los términos comerciales y el pago se manejan por fuera de Campo — como ya lo hacés hoy."
              />
              <FaqItem
                q="¿De qué países pueden ser las publicaciones?"
                a="Globales. Hoy tenemos vendedores y compradores activos en Argentina, Brasil, Uruguay, Paraguay, EE. UU., Canadá, Ucrania, Francia, Australia y más."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA final — banner edge-to-edge -------------------------------- */}
      <section className="relative isolate overflow-hidden text-ink-50">
        {/* Capa 1 — foto de trigo a todo el ancho */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          aria-hidden
          src="/images/grains/wheat-01.jpg"
          alt=""
          className="absolute inset-0 -z-30 h-full w-full object-cover"
          loading="lazy"
        />
        {/* Capa 2 — gradient diagonal: oscuro a la izq → respiración a la der */}
        <div
          aria-hidden
          className="absolute inset-0 -z-20"
          style={{
            background:
              "linear-gradient(115deg, rgba(23,23,15,0.92) 0%, rgba(37,48,26,0.82) 45%, rgba(62,79,38,0.55) 75%, rgba(79,99,47,0.35) 100%)",
          }}
        />
        {/* Capa 3 — viñeteado superior + inferior para anclar al fondo */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 -z-10 h-32"
          style={{
            background:
              "linear-gradient(to bottom, rgba(23,23,15,0.5), transparent)",
          }}
        />
        {/* Capa 4 — glow accent verde claro */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/3 -z-10 h-[480px] w-[480px] rounded-full opacity-25 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, #a8bc7f 0%, transparent 70%)",
          }}
        />
        {/* Capa 5 — textura sutil tipo grano */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        {/* Contenido */}
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20 lg:px-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-ink-50/20 bg-ink-50/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-200 backdrop-blur-sm">
            <Circle className="h-1.5 w-1.5 animate-pulse fill-brand-300 text-brand-300" />
            Empezá hoy
          </p>
          <h2 className="mt-5 font-display text-3xl font-medium leading-[1.05] tracking-tight md:text-4xl lg:text-5xl">
            Tu primer lote,{" "}
            <em className="italic text-brand-200">cargado en 2 minutos</em>.
          </h2>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-50/80">
            Productores, acopios, cooperativas y compradores publican y
            descubren ofertas en minutos. Sin corredores intermedios.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href="/register">
              <Button
                size="lg"
                className="h-11 bg-white px-7 text-ink-900 shadow-[0_10px_40px_-10px_rgba(168,188,127,0.55)] hover:bg-brand-50"
              >
                Crear cuenta gratis <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button
                size="lg"
                variant="outline"
                className="h-11 border-ink-50/30 bg-transparent px-6 text-ink-50 hover:bg-ink-50/10"
              >
                Explorar ofertas
              </Button>
            </Link>
          </div>
          <p className="mt-5 text-xs text-ink-50/60">
            Publicar es gratis · Crear cuenta lleva un minuto.
          </p>
        </div>
      </section>
    </>
  );
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 100;
  const h = 28;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;
  const lastY =
    h - ((data[data.length - 1] - min) / range) * h;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-9 w-full text-brand-700"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#spark-fill)" />
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={w} cy={lastY} r="1.6" fill="currentColor" />
    </svg>
  );
}

function PriceCard({
  price,
}: {
  price: (typeof GRAIN_PRICES)[number];
}) {
  const delta = price.lastUSD - price.prevUSD;
  const pct = (delta / price.prevUSD) * 100;
  const up = delta >= 0;
  const last12 = price.history.slice(-12).map((w) => w.usd);

  return (
    <Link
      href={`/precios?grain=${price.grain}`}
      className="group block bg-white p-6 transition-colors hover:bg-brand-50/40"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-base font-medium tracking-tight text-ink-900">
            {price.label}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-ink-500">
            {price.region}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums ${
            up
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {up ? "↑" : "↓"} {Math.abs(pct).toFixed(1)}%
        </span>
      </div>
      <p className="mt-5 font-display text-3xl font-medium leading-none tracking-tight text-ink-900 tabular-nums">
        {price.lastUSD.toFixed(0)}
        <span className="ml-1.5 text-sm font-normal text-ink-400">
          USD/t
        </span>
      </p>
      <Sparkline data={last12} />
      <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-ink-400">
        últimas 12 semanas
      </p>
    </Link>
  );
}

function CredItem({
  icon,
  value,
  label,
  hint,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  hint: string;
}) {
  return (
    <div className="bg-white p-7 md:p-8">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        {icon}
      </div>
      <p className="mt-5 font-display text-3xl font-medium tracking-tight text-ink-900 tabular-nums md:text-4xl">
        <CountUp to={value} />
      </p>
      <p className="mt-1 font-display text-base font-medium tracking-tight text-ink-900">
        {label}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-500">{hint}</p>
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

