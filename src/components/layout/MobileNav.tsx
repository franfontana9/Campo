"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, LayoutDashboard, PlusCircle, LogIn, UserPlus, TrendingUp, Map as MapIcon, Banknote } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-ink-100 hover:text-ink-900 md:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>
      <Drawer open={open} onOpenChange={setOpen} title="Menú" side="right">
        <nav className="flex flex-col p-2">
          <SectionLabel>Producto</SectionLabel>
          <NavItem
            href="/marketplace"
            icon={<ShoppingBag className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Marketplace
          </NavItem>
          <NavItem
            href="/precios"
            icon={<TrendingUp className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Precios
          </NavItem>

          <SectionLabel>Más</SectionLabel>
          <NavItem
            href="/mapa"
            icon={<MapIcon className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Mapa
          </NavItem>
          <NavItem
            href="/prestamos"
            icon={<Banknote className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Préstamos
          </NavItem>

          <SectionLabel>Cuenta</SectionLabel>
          <NavItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Mi panel
          </NavItem>
          <NavItem
            href="/dashboard/publicaciones/nueva"
            icon={<PlusCircle className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Publicar oferta
          </NavItem>
          <div className="my-3 border-t border-ink-100" />
          <NavItem
            href="/login"
            icon={<LogIn className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Ingresar
          </NavItem>
          <NavItem
            href="/register"
            icon={<UserPlus className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Crear cuenta
          </NavItem>
        </nav>
      </Drawer>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-400 first:mt-1">
      {children}
    </p>
  );
}

function NavItem({
  href,
  icon,
  children,
  onClick,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] text-ink-800 transition-colors hover:bg-ink-50 hover:text-ink-900"
    >
      <span className="text-ink-400">{icon}</span>
      {children}
    </Link>
  );
}
