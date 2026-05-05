"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

type Props = {
  buyerName: string;
};

/**
 * Botones Aceptar / Rechazar de un interés recibido. Hoy son optimistas
 * (sólo toasts). Cuando exista server action `updateInterestStatus()` se
 * cablea acá.
 */
export function InterestActions({ buyerName }: Props) {
  const [pending, setPending] = useState<"accept" | "decline" | null>(null);
  const [done, setDone] = useState<"accepted" | "declined" | null>(null);

  async function handle(kind: "accept" | "decline") {
    if (pending || done) return;
    setPending(kind);
    await new Promise((r) => setTimeout(r, 500));
    setPending(null);
    if (kind === "accept") {
      setDone("accepted");
      toast.success("Interés aceptado", {
        description: `Se abrió un chat con ${buyerName}.`,
        action: {
          label: "Ir a chats",
          onClick: () => {
            window.location.href = "/dashboard/chats";
          },
        },
      });
    } else {
      setDone("declined");
      toast(`Interés rechazado`, {
        description: `${buyerName} fue notificado.`,
      });
    }
  }

  if (done === "accepted") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200/60">
        <Check className="h-3.5 w-3.5" /> Aceptado
      </span>
    );
  }
  if (done === "declined") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-800 ring-1 ring-red-200/60">
        <X className="h-3.5 w-3.5" /> Rechazado
      </span>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handle("decline")}
        disabled={pending !== null}
      >
        {pending === "decline" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <X className="h-3.5 w-3.5" />
        )}
        Rechazar
      </Button>
      <Button
        size="sm"
        onClick={() => handle("accept")}
        disabled={pending !== null}
      >
        {pending === "accept" ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Check className="h-3.5 w-3.5" />
        )}
        Aceptar
      </Button>
    </>
  );
}
