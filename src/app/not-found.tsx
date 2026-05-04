import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
        Error 404
      </p>
      <h1 className="mt-3 font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink-900 md:text-6xl">
        Esta página{" "}
        <em className="text-brand-700">se cosechó hace tiempo</em>.
      </h1>
      <p className="mt-5 max-w-lg text-lg text-ink-600">
        El link no existe o la publicación se cerró. Probá volver al
        marketplace o explorá ofertas activas.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/marketplace">
          <Button size="lg">
            <Search className="h-4 w-4" /> Ir al marketplace
          </Button>
        </Link>
        <Link href="/">
          <Button size="lg" variant="outline">
            Volver al inicio <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
