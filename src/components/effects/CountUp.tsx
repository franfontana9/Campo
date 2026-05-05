"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  /** Duración en ms */
  duration?: number;
  className?: string;
  /** Función para formatear (default: separador de miles es-ES) */
  format?: (n: number) => string;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const defaultFormat = (n: number) =>
  new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0 }).format(
    Math.round(n),
  );

/**
 * Anima el número de 0 a `to` la primera vez que entra al viewport.
 * Respeta `prefers-reduced-motion`.
 */
export function CountUp({
  to,
  duration = 900,
  className,
  format = defaultFormat,
}: Props) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setValue(to);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !playedRef.current) {
            playedRef.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const elapsed = now - start;
              const t = Math.min(1, elapsed / duration);
              setValue(easeOut(t) * to);
              if (t < 1) requestAnimationFrame(tick);
              else setValue(to);
            };
            requestAnimationFrame(tick);
            obs.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
