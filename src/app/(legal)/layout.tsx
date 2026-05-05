import Link from "next/link";

const NAV = [
  { href: "/ayuda", label: "Ayuda" },
  { href: "/contacto", label: "Contacto" },
  { href: "/terminos", label: "Términos" },
  { href: "/privacidad", label: "Privacidad" },
  { href: "/blog", label: "Blog" },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <nav className="mb-10 flex flex-wrap gap-2 border-b border-ink-100 pb-6 text-sm">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-ink-700 transition-colors hover:border-ink-300 hover:text-ink-900"
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <article className="prose-campo">{children}</article>
    </div>
  );
}
