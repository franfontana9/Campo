"use client";

import { useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

type Props = {
  listingId: string;
  sellerName: string;
};

/**
 * Formulario "Me interesa" del buy box. Hoy es mock optimista — sólo dispara
 * un toast. Cuando exista server action `sendInterest()` se cablea acá.
 */
export function InterestForm({ sellerName }: Props) {
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    // Simulación de envío — reemplazar con server action
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setMessage("");
    toast.success("Interés enviado", {
      description: `${sellerName} va a recibir tu mensaje y datos de contacto.`,
      action: {
        label: "Ver enviados",
        onClick: () => {
          window.location.href = "/dashboard/intereses-enviados";
        },
      },
    });
  }

  function onSave() {
    setSaved((v) => {
      const next = !v;
      if (next) {
        toast.success("Guardado para después", {
          description: "Lo encontrás en tus búsquedas guardadas.",
        });
      } else {
        toast("Lo sacaste de guardados");
      }
      return next;
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <Label htmlFor="message">Mensaje inicial</Label>
        <Textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Hola, me interesa la oferta. ¿Podemos hablar sobre condiciones y entrega?"
          className="mt-1.5"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MessageSquare className="h-4 w-4" />
        )}
        {loading ? "Enviando..." : "Me interesa"}
      </Button>
      <Button
        type="button"
        size="lg"
        variant="outline"
        className="w-full"
        onClick={onSave}
      >
        {saved ? "Guardado ✓" : "Guardar para después"}
      </Button>
      <p className="text-center text-xs text-ink-500">
        Necesitás una cuenta para enviar tu interés.
      </p>
    </form>
  );
}
