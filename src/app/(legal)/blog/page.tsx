import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notas y análisis del equipo de Campo.",
};

export default function BlogPage() {
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        Notas del equipo
      </p>
      <h1 className="mt-2">Blog</h1>
      <p>
        Análisis del mercado de granos, lecciones del equipo construyendo
        Campo y novedades del producto. Próximamente.
      </p>

      <div className="not-prose mt-10 rounded-2xl border border-dashed border-ink-200 bg-white p-12 text-center">
        <p className="font-display text-2xl font-medium text-ink-900">
          Sin posts todavía
        </p>
        <p className="mt-2 text-sm text-ink-500">
          Estamos preparando los primeros artículos. Si te interesa
          publicar como invitado, escribinos a{" "}
          <a
            className="font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
            href="mailto:hola@campo.app"
          >
            hola@campo.app
          </a>
          .
        </p>
      </div>
    </>
  );
}
