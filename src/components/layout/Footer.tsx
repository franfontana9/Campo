import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-ink-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-xl font-medium tracking-tight text-ink-900">
              Campo
            </p>
            <p className="mt-1 max-w-xs text-sm text-ink-500">
              Marketplace global de soja, maíz y trigo.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                Producto
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/marketplace" className="text-ink-700 hover:text-ink-900">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-ink-700 hover:text-ink-900">
                    Mi panel
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                Cuenta
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/login" className="text-ink-700 hover:text-ink-900">
                    Ingresar
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="text-ink-700 hover:text-ink-900">
                    Crear cuenta
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                Granos
              </p>
              <ul className="mt-3 space-y-2 text-ink-700">
                <li>Soja</li>
                <li>Maíz</li>
                <li>Trigo</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-ink-100 pt-6 text-xs text-ink-500 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Campo — marketplace global de granos</p>
          <p className="tracking-[0.14em] uppercase">MVP · v0.1</p>
        </div>
      </div>
    </footer>
  );
}
