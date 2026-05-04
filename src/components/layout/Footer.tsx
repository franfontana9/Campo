import Link from "next/link";
import { Wheat } from "lucide-react";
import { GRAIN_TYPES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-ink-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_3fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white">
                <Wheat className="h-[18px] w-[18px]" strokeWidth={2} />
              </span>
              <span className="font-display text-[22px] font-medium leading-none tracking-tight text-ink-900">
                Campo
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-500">
              Marketplace global de granos físicos. Conectá vendedores y
              compradores, sin corredores.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-4">
            <FooterCol title="Producto">
              <FooterLink href="/marketplace">Marketplace</FooterLink>
              <FooterLink href="/dashboard">Mi panel</FooterLink>
              <FooterLink href="/dashboard/publicaciones/nueva">
                Publicar oferta
              </FooterLink>
            </FooterCol>

            <FooterCol title="Cuenta">
              <FooterLink href="/login">Ingresar</FooterLink>
              <FooterLink href="/register">Crear cuenta</FooterLink>
            </FooterCol>

            <FooterCol title="Recursos">
              <FooterLink href="/ayuda">Ayuda</FooterLink>
              <FooterLink href="/contacto">Contacto</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
            </FooterCol>

            <FooterCol title="Legal">
              <FooterLink href="/terminos">Términos</FooterLink>
              <FooterLink href="/privacidad">Privacidad</FooterLink>
            </FooterCol>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-ink-100 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            Cultivos
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-700">
            {GRAIN_TYPES.map((g, i) => (
              <span key={g.value} className="inline-flex items-center gap-3">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-ink-300" />}
                <Link
                  href={`/marketplace?grain=${g.value}`}
                  className="hover:text-ink-900"
                >
                  {g.label}
                </Link>
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-2 border-t border-ink-100 pt-6 text-xs text-ink-500 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Campo — marketplace global de granos</p>
          <p className="tracking-[0.14em] uppercase">MVP · v0.1</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
        {title}
      </p>
      <ul className="mt-3 space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link href={href} className="text-ink-700 hover:text-ink-900">
        {children}
      </Link>
    </li>
  );
}
