import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  User,
  PlusCircle,
  MessageSquare,
  Bell,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  CURRENT_USER,
  MOCK_CHATS,
  MOCK_INTERESTS,
  MOCK_LISTINGS,
  MOCK_NOTIFICATIONS,
} from "@/lib/mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unreadChats = MOCK_CHATS.reduce((s, c) => s + c.unread, 0);
  const unreadNotifs = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;
  // Intereses pendientes (recibidos + enviados) — badge global del sidebar
  const myListingIds = new Set(
    MOCK_LISTINGS.filter((l) => l.user_id === CURRENT_USER.id).map((l) => l.id),
  );
  const pendingInterests = MOCK_INTERESTS.filter((i) => {
    if (i.status !== "pending") return false;
    return (
      myListingIds.has(i.listing_id) || i.buyer_id === CURRENT_USER.id
    );
  }).length;
  return (
    <div className="mx-auto w-full max-w-[1440px] px-6 py-12 lg:px-10">
      <div className="md:grid md:gap-10 md:grid-cols-[240px_1fr] xl:gap-14">
        {/* Sidebar — desktop only. En mobile, la nav del dashboard se accede
            desde el MobileNav del header (sección "Mi panel"). */}
        <aside className="hidden md:block md:sticky md:top-24 md:self-start">
          <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-500">
            Mi cuenta
          </p>
          <nav className="flex flex-col gap-0.5 text-sm">
            <NavItem
              href="/dashboard"
              icon={<LayoutDashboard className="h-4 w-4" />}
            >
              Resumen
            </NavItem>
            <NavItem
              href="/dashboard/publicaciones"
              icon={<FileText className="h-4 w-4" />}
            >
              Mis publicaciones
            </NavItem>
            <NavItem
              href="/dashboard/intereses"
              icon={<Inbox className="h-4 w-4" />}
              badge={pendingInterests > 0 ? pendingInterests : undefined}
            >
              Intereses
            </NavItem>
            <NavItem
              href="/dashboard/busquedas"
              icon={<Bookmark className="h-4 w-4" />}
            >
              Búsquedas guardadas
            </NavItem>
            <NavItem
              href="/dashboard/chats"
              icon={<MessageSquare className="h-4 w-4" />}
              badge={unreadChats > 0 ? unreadChats : undefined}
            >
              Chats
            </NavItem>
            <NavItem
              href="/dashboard/notificaciones"
              icon={<Bell className="h-4 w-4" />}
              badge={unreadNotifs > 0 ? unreadNotifs : undefined}
            >
              Notificaciones
            </NavItem>
            <NavItem
              href="/dashboard/perfil"
              icon={<User className="h-4 w-4" />}
            >
              Mi perfil
            </NavItem>
          </nav>
          <div className="mt-4 border-t border-ink-100 pt-4">
            <Link href="/dashboard/publicaciones/nueva">
              <Button size="sm" className="w-full">
                <PlusCircle className="h-4 w-4" />
                Nueva publicación
              </Button>
            </Link>
          </div>
        </aside>

        <section>{children}</section>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  children,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-ink-700 transition-colors hover:bg-white hover:text-ink-900"
    >
      {icon}
      <span className="flex-1">{children}</span>
      {badge !== undefined && badge > 0 && (
        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-700 px-1.5 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}
