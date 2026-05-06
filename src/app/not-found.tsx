import Link from "next/link";
import {
  ArrowRight,
  Search,
  Wheat,
  TrendingUp,
  MapPin,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 py-16 lg:px-10">
      <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-center">
        {/* Ilustración SVG */}
        <div className="relative order-2 md:order-1">
          <div
            className="relative aspect-square overflow-hidden rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, #f4f6ef 0%, #e5ebd8 60%, #cdd8b2 100%)",
            }}
          >
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 h-full w-full"
              role="img"
              aria-label="Espigas de trigo y un 4 0 4 estilizado"
            >
              {/* 4 0 4 grande */}
              <text
                x="50%"
                y="55%"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="180"
                fontWeight="500"
                fill="#3e4f26"
                opacity="0.18"
                fontStyle="italic"
              >
                404
              </text>

              {/* Espigas estilizadas */}
              <g
                stroke="#4f632f"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.85"
              >
                {/* Tallo central */}
                <path d="M200 360 Q198 280 200 200 Q202 140 200 80" />
                {/* Granos a los lados (espiga) */}
                <g fill="#839b57">
                  <ellipse cx="186" cy="100" rx="6" ry="11" />
                  <ellipse cx="214" cy="100" rx="6" ry="11" />
                  <ellipse cx="184" cy="124" rx="6" ry="11" />
                  <ellipse cx="216" cy="124" rx="6" ry="11" />
                  <ellipse cx="183" cy="148" rx="6" ry="11" />
                  <ellipse cx="217" cy="148" rx="6" ry="11" />
                  <ellipse cx="184" cy="172" rx="6" ry="11" />
                  <ellipse cx="216" cy="172" rx="6" ry="11" />
                  <ellipse cx="186" cy="196" rx="6" ry="11" />
                  <ellipse cx="214" cy="196" rx="6" ry="11" />
                </g>
                {/* Aristas */}
                <path d="M200 78 L195 60 M200 78 L200 55 M200 78 L205 60" />
              </g>

              {/* Tallos secundarios (decoración) */}
              <g
                stroke="#4f632f"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              >
                <path d="M120 360 Q125 290 130 230" />
                <path d="M280 360 Q275 290 270 230" />
                <path d="M70 360 Q78 320 86 290" />
                <path d="M330 360 Q322 320 314 290" />
              </g>
            </svg>
          </div>
        </div>

        {/* Texto + sugerencias */}
        <div className="order-1 md:order-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
            Error 404
          </p>
          <h1 className="mt-3 font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink-900 md:text-6xl">
            Esta página{" "}
            <em className="italic text-brand-700">
              se cosechó hace tiempo
            </em>
            .
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink-600">
            El link no existe o la publicación se cerró. Probá alguno de los
            atajos de abajo para retomar.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/marketplace">
              <Button size="lg">
                <Search className="h-4 w-4" /> Ir al marketplace
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline">
                Volver al inicio <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Sugerencias */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <Suggestion
              href="/marketplace?grain=soja"
              icon={<Wheat className="h-4 w-4" />}
              title="Soja"
              sub="Las ofertas más buscadas"
            />
            <Suggestion
              href="/precios"
              icon={<TrendingUp className="h-4 w-4" />}
              title="Precios"
              sub="Referencia semanal por grano"
            />
            <Suggestion
              href="/geografia"
              icon={<MapPin className="h-4 w-4" />}
              title="Mapa"
              sub="Dónde se mueve cada grano"
            />
            <Suggestion
              href="/ayuda"
              icon={<LifeBuoy className="h-4 w-4" />}
              title="Ayuda"
              sub="Preguntas frecuentes"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Suggestion({
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
      className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-ink-100 bg-white p-3.5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-[0_12px_30px_-14px_rgba(62,79,38,0.35)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-brand-400 via-brand-600 to-brand-700 transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 transition-colors group-hover:bg-brand-100">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink-900">{title}</p>
        <p className="truncate text-xs text-ink-500">{sub}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-brand-700" />
    </Link>
  );
}
