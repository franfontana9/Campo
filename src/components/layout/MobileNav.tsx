"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  ShoppingBag,
  LayoutDashboard,
  PlusCircle,
  LogIn,
  UserPlus,
  TrendingUp,
  Map as MapIcon,
  Banknote,
  FileText,
  Inbox,
  MessageSquare,
  Bell,
  User,
  Bookmark,
  Gavel,
} from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import {
  CURRENT_USER,
  MOCK_CHATS,
  MOCK_INTERESTS,
  MOCK_LISTINGS,
  MOCK_NOTIFICATIONS,
} from "@/lib/mock-data";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  // Badges
  const unreadChats = MOCK_CHATS.reduce((s, c) => s + c.unread, 0);
  const unreadNotifs = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
  const myListingIds = new Set(
    MOCK_LISTINGS.filter((l) => l.user_id === CURRENT_USER.id).map((l) => l.id),
  );
  const pendingInterests = MOCK_INTERESTS.filter((i) => {
    if (i.status !== "pending") return false;
    return myListingIds.has(i.listing_id) || i.buyer_id === CURRENT_USER.id;
  }).length;
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
          <NavItem
            href="/subastas"
            icon={<Gavel className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Subastas
          </NavItem>

          <SectionLabel>Mi panel</SectionLabel>
          <NavItem
            href="/dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Resumen
          </NavItem>
          <NavItem
            href="/dashboard/publicaciones"
            icon={<FileText className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Mis publicaciones
          </NavItem>
          <NavItem
            href="/dashboard/intereses"
            icon={<Inbox className="h-4 w-4" />}
            badge={pendingInterests > 0 ? pendingInterests : undefined}
            onClick={() => setOpen(false)}
          >
            Intereses
          </NavItem>
          <NavItem
            href="/dashboard/busquedas"
            icon={<Bookmark className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Búsquedas guardadas
          </NavItem>
          <NavItem
            href="/dashboard/chats"
            icon={<MessageSquare className="h-4 w-4" />}
            badge={unreadChats > 0 ? unreadChats : undefined}
            onClick={() => setOpen(false)}
          >
            Chats
          </NavItem>
          <NavItem
            href="/dashboard/notificaciones"
            icon={<Bell className="h-4 w-4" />}
            badge={unreadNotifs > 0 ? unreadNotifs : undefined}
            onClick={() => setOpen(false)}
          >
            Notificaciones
          </NavItem>
          <NavItem
            href="/dashboard/perfil"
            icon={<User className="h-4 w-4" />}
            onClick={() => setOpen(false)}
          >
            Mi perfil
          </NavItem>

          <SectionLabel>Acciones</SectionLabel>
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
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] text-ink-800 transition-colors hover:bg-ink-50 hover:text-ink-900"
    >
      <span className="text-ink-400">{icon}</span>
      <span className="flex-1">{children}</span>
      {badge !== undefined && badge > 0 && (
        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-700 px-1.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}
