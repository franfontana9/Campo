import Link from "next/link";
import { Wheat, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-100 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6 md:gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Campo — ir al inicio"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white transition-colors group-hover:bg-brand-800">
            <Wheat className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <span className="font-display text-[22px] font-medium leading-none tracking-tight text-ink-900">
            Campo
          </span>
        </Link>

        {/* Buscador global (Enter envía) */}
        <form
          action="/marketplace"
          method="GET"
          role="search"
          className="flex flex-1 justify-center"
        >
          <label className="flex h-10 w-full max-w-md items-center gap-2 rounded-full border border-ink-200 bg-ink-50 px-4 transition-colors focus-within:border-brand-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-600/10">
            <Search className="h-4 w-4 shrink-0 text-ink-400" aria-hidden />
            <input
              type="search"
              name="q"
              placeholder="Buscar granos, ciudad, vendedor…"
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
              autoComplete="off"
              aria-label="Buscar en el marketplace"
            />
          </label>
        </form>

        {/* Nav + cuenta */}
        <nav className="hidden items-center gap-5 text-sm md:flex">
          <Link
            href="/marketplace"
            className="text-ink-700 transition-colors hover:text-ink-900"
          >
            Marketplace
          </Link>
          <Link
            href="/dashboard"
            className="text-ink-700 transition-colors hover:text-ink-900"
          >
            Mi panel
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/login" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm">
              Ingresar
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Crear cuenta</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
