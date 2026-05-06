"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DisplayPrice } from "@/components/ui/DisplayPrice";
import type { Currency } from "@/lib/constants";

type Props = {
  title: string;
  price: number | null;
  currency: Currency;
  priceMode: "fixed" | "to_agree";
  /** Pixel offset desde donde aparece el header. Default 600 (~ debajo del hero). */
  appearAfter?: number;
};

/**
 * Header flotante que aparece al hacer scroll por debajo del hero.
 * Muestra título corto + precio + CTA "Me interesa" anclado al form.
 */
export function StickyListingHeader({
  title,
  price,
  currency,
  priceMode,
  appearAfter = 600,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > appearAfter);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [appearAfter]);

  return (
    <div
      className={`fixed inset-x-0 top-16 z-30 border-b border-ink-100 bg-white/95 shadow-sm backdrop-blur-md transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-2 opacity-0"
      } hidden lg:block`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-4 px-6 py-3 lg:px-10">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink-900">{title}</p>
          <p className="text-[11px] text-ink-500">
            {priceMode === "fixed" ? "Precio / t" : "A convenir"}
          </p>
        </div>
        <p className="font-display text-xl font-medium text-ink-900">
          <DisplayPrice amount={price} from={currency} showApprox={false} />
        </p>
        <a href="#message">
          <Button size="sm">
            <MessageSquare className="h-3.5 w-3.5" />
            Me interesa
          </Button>
        </a>
      </div>
    </div>
  );
}
