import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  Send,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
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
              href="/dashboard/intereses-recibidos"
              icon={<Inbox className="h-4 w-4" />}
            >
              Intereses recibidos
            </NavItem>
            <NavItem
              href="/dashboard/intereses-enviados"
              icon={<Send className="h-4 w-4" />}
            >
              Intereses enviados
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
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-ink-700 transition-colors hover:bg-white hover:text-ink-900"
    >
      {icon}
      {children}
    </Link>
  );
}
