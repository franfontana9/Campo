"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Wheat,
  Search,
  MessageSquare,
  ChevronDown,
  Banknote,
  Map as MapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";
import { NotificationsBell } from "./NotificationsBell";
import { CurrencySelector } from "./CurrencySelector";
import { MOCK_CHATS } from "@/lib/mock-data";

const MORE_LINKS = [
  {
    href: "/mapa",
    label: "Mapa",
    desc: "Ofertas y clima por provincia",
    icon: <MapIcon className="h-4 w-4" />,
  },
  {
    href: "/prestamos",
    label: "Préstamos",
    desc: "Simulador y financiamiento agropecuario",
    icon: <Banknote className="h-4 w-4" />,
  },
];

export function Navbar() {
  const unreadChats = MOCK_CHATS.reduce((sum, c) => sum + c.unread, 0);
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 4);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    function onClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMoreOpen(false);
    }
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-200 ${
        scrolled
          ? "border-b border-ink-100 bg-white/85 shadow-[0_8px_24px_-12px_rgba(23,23,15,0.08)] backdrop-blur-md"
          : "border-b border-transparent bg-white"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center gap-3 px-6 md:gap-5 lg:px-10">
        {/* Mobile menu (visible <md) */}
        <MobileNav />

        {/* Logo */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Campo — ir al inicio"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white transition-colors group-hover:bg-brand-800">
            <Wheat className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
          <span className="hidden font-display text-[22px] font-medium leading-none tracking-tight text-ink-900 sm:inline">
            Campo
          </span>
        </Link>

        {/* Nav primary (md+) */}
        <nav className="hidden md:block" aria-label="Principal">
          <ul className="flex items-center gap-0.5 text-sm">
            <NavLink href="/marketplace">Marketplace</NavLink>
            <NavLink href="/precios">Precios</NavLink>
            <li className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-900 ${
                  moreOpen ? "bg-ink-50 text-ink-900" : ""
                }`}
              >
                Más
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    moreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {moreOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-[0_20px_50px_-20px_rgba(23,23,15,0.25)]">
                  <ul className="p-1.5">
                    {MORE_LINKS.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={() => setMoreOpen(false)}
                          className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-brand-50/50"
                        >
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                            {l.icon}
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-medium text-ink-900">
                              {l.label}
                            </span>
                            <span className="mt-0.5 block text-[11px] leading-relaxed text-ink-500">
                              {l.desc}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Buscador global — flex-1 para que ocupe el centro disponible */}
        <form
          action="/marketplace"
          method="GET"
          role="search"
          className="hidden flex-1 justify-end md:flex md:max-w-sm md:justify-stretch"
        >
          <label className="flex h-9 w-full items-center gap-2 rounded-full border border-ink-200/70 bg-ink-50/60 px-3.5 transition-all focus-within:border-brand-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-600/10">
            <Search
              className="h-3.5 w-3.5 shrink-0 text-ink-400"
              aria-hidden
            />
            <input
              type="search"
              name="q"
              placeholder="Soja, Córdoba, USD…"
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
              autoComplete="off"
              aria-label="Buscar en el marketplace"
            />
          </label>
        </form>

        {/* Cluster de usuario (md+) */}
        <div className="hidden items-center md:flex">
          <CurrencySelector />
          <Link
            href="/dashboard/chats"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-900"
            aria-label={`Chats${
              unreadChats > 0 ? ` (${unreadChats} sin leer)` : ""
            }`}
          >
            <MessageSquare className="h-[18px] w-[18px]" />
            {unreadChats > 0 && (
              <span className="absolute right-0.5 top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-700 px-1 text-[10px] font-semibold text-white">
                {unreadChats}
              </span>
            )}
          </Link>
          <NotificationsBell />
          <Link
            href="/dashboard"
            className="ml-1 hidden rounded-md px-3 py-1.5 text-sm text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-900 lg:inline-block"
          >
            Mi panel
          </Link>
        </div>

        {/* CTAs auth */}
        <div className="ml-1 flex shrink-0 items-center gap-3 border-l border-ink-100 pl-3 md:ml-2 md:pl-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-ink-700 transition-colors hover:text-ink-900 sm:inline"
          >
            Ingresar
          </Link>
          <Link href="/register">
            <Button size="sm">Crear cuenta</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="rounded-md px-3 py-1.5 text-ink-700 transition-colors hover:bg-ink-50 hover:text-ink-900"
      >
        {children}
      </Link>
    </li>
  );
}
