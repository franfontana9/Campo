"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { X, Send, Wheat, ChevronDown, Loader2 } from "lucide-react";
import { GRAIN_PRICES } from "@/lib/price-data";

type Role = "user" | "assistant";
type Msg = { id: number; role: Role; text: string };

let _id = 0;
function mkMsg(role: Role, text: string): Msg {
  return { id: _id++, role, text };
}

/* ── Simple rule-based responder ────────────────────────────── */
function respond(input: string): string {
  const m = input.toLowerCase().trim();

  // Price queries
  const grainMap: Record<string, string> = {
    soja: "soja", maíz: "maiz", maiz: "maiz", trigo: "trigo",
    girasol: "girasol", sorgo: "sorgo", cebada: "cebada", avena: "avena", arroz: "arroz",
  };
  for (const [kw, grain] of Object.entries(grainMap)) {
    if (m.includes(kw)) {
      const g = GRAIN_PRICES.find((p) => p.grain === grain);
      if (g) {
        const delta = g.lastUSD - g.prevUSD;
        const pct = ((delta / g.prevUSD) * 100).toFixed(1);
        const arrow = delta >= 0 ? "↑" : "↓";
        return `**${g.label}** cotiza a **USD ${g.lastUSD}/ton** en ${g.region} (${arrow} ${Math.abs(delta).toFixed(1)} USD · ${pct}% vs semana pasada). Podés ver el historial completo en [Precios](/precios).`;
      }
    }
  }

  if (m.includes("precio") || m.includes("cotización") || m.includes("cotizacion")) {
    const top3 = GRAIN_PRICES.slice(0, 3)
      .map((g) => `${g.label}: USD ${g.lastUSD}`)
      .join(" · ");
    return `Precios actuales: ${top3}. Visitá [Precios](/precios) para ver el dashboard completo con gráficos de tendencia y volumen.`;
  }

  // Weather
  if (m.includes("clima") || m.includes("lluvia") || m.includes("temperatura") || m.includes("pronóstico") || m.includes("pronostico")) {
    return "Para ver clima detallado, pronósticos a 7 días e indicadores agronómicos por provincia, entrá a [Mapa › Clima](/mapa?layer=clima). Cubrimos todas las provincias de Argentina y departamentos de Uruguay.";
  }

  // Loans
  if (m.includes("préstamo") || m.includes("prestamo") || m.includes("crédito") || m.includes("credito") || m.includes("financiamiento") || m.includes("tasa")) {
    return "Ofrecemos 4 líneas de financiamiento: **Adelanto de cosecha**, **Crédito a compradores**, **Financiamiento de almacenamiento** y **Descuento de factura**. Simulá tu cuota, TNA y plan de pagos en [Préstamos](/prestamos).";
  }

  // Auctions
  if (m.includes("subasta") || m.includes("remate") || m.includes("licitación") || m.includes("licitacion") || m.includes("oferta")) {
    return "En [Subastas](/subastas) podés participar en remates en tiempo real. Ahora hay 3 subastas activas con soja, maíz y trigo. Podés ver el historial y alertarte para las próximas.";
  }

  // Marketplace
  if (m.includes("marketplace") || m.includes("publicar") || m.includes("oferta") || m.includes("vender") || m.includes("comprar")) {
    return "En el [Marketplace](/marketplace) encontrás ofertas de granos entre empresas, sin corredores. Podés filtrar por grano, región, precio y calidad. Para publicar tu propia oferta, creá una cuenta.";
  }

  // Map
  if (m.includes("mapa") || m.includes("geografía") || m.includes("geografía") || m.includes("provincia") || m.includes("región")) {
    return "El [Mapa](/mapa) muestra dos capas: **Ofertas** (dónde se está comprando/vendiendo) y **Clima** (temperatura y lluvia por provincia). Podés seleccionar Argentina o Uruguay.";
  }

  // Greetings
  if (m.match(/^(hola|buenas|buen día|buenos días|qué tal|como estas|cómo estás|hi|hey)/)) {
    return "¡Hola! Soy el asistente de Campo. Puedo ayudarte con precios de granos, clima por provincia, simulación de préstamos y subastas en vivo. ¿Qué necesitás?";
  }

  // Help
  if (m.includes("ayuda") || m.includes("qué podés") || m.includes("que podes") || m.includes("cómo") || m.includes("como")) {
    return "Puedo ayudarte con:\n• **Precios** → cotizaciones actuales de soja, maíz, trigo y más\n• **Clima** → pronósticos y datos agronómicos por provincia\n• **Préstamos** → simulación de tasas y cuotas\n• **Subastas** → remates en vivo\n• **Marketplace** → encontrar o publicar ofertas\n\n¿Sobre qué querés saber?";
  }

  // Fallback
  const suggestions = ["precios de soja", "clima en Córdoba", "simular un préstamo", "subastas activas"];
  return `No tengo información específica sobre eso, pero puedo ayudarte con: ${suggestions.map((s) => `**${s}**`).join(", ")}. ¿Querés saber algo de eso?`;
}

/* ── Render message with basic markdown ─────────────────────── */
function MsgBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  // Very lightweight bold/bullet rendering
  const lines = msg.text.split("\n");
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-brand-700 text-white"
            : "rounded-bl-sm bg-ink-100 text-ink-800"
        }`}
      >
        {lines.map((line, i) => {
          // Bold markdown: **text**
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} className={i > 0 ? "mt-0.5" : ""}>
              {parts.map((part, j) =>
                j % 2 === 1 ? <strong key={j}>{part}</strong> : part
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}

const SUGGESTIONS = ["Precio de soja hoy", "Clima en Buenos Aires", "Simular un préstamo", "Ver subastas activas"];

const WELCOME: Msg = mkMsg(
  "assistant",
  "¡Hola! Soy el asistente de **Campo**. Puedo ayudarte con precios de granos, clima, préstamos y subastas. ¿En qué te ayudo?"
);

/* ── Main component ─────────────────────────────────────────── */
export function CampoAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  function send(text?: string) {
    const t = (text ?? input).trim();
    if (!t) return;
    setInput("");
    setMsgs((prev) => [...prev, mkMsg("user", t)]);
    setTyping(true);
    setTimeout(() => {
      setMsgs((prev) => [...prev, mkMsg("assistant", respond(t))]);
      setTyping(false);
    }, 420 + Math.random() * 300);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send();
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[340px] flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-[0_32px_64px_-16px_rgba(23,23,15,0.25)] sm:w-[380px]"
          style={{ maxHeight: "calc(100vh - 120px)" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-ink-100 bg-brand-700 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Wheat className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">Asistente Campo</p>
              <p className="text-[11px] text-white/70">Precios · Clima · Préstamos · Subastas</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Cerrar asistente"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {msgs.map((msg) => (
              <MsgBubble key={msg.id} msg={msg} />
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-ink-100 px-4 py-2.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-400" />
                  <span className="text-xs text-ink-400">Escribiendo…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only when few messages) */}
          {msgs.length <= 2 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-[11px] font-medium text-ink-600 transition-colors hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-ink-100 p-3 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Preguntá algo…"
              className="flex-1 min-w-0 rounded-full border border-ink-200 bg-ink-50 px-4 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white transition-colors hover:bg-brand-800 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar asistente" : "Abrir asistente Campo"}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_8px_32px_-8px_rgba(23,23,15,0.35)] transition-all duration-200 hover:scale-110 active:scale-95 ${
          open ? "bg-ink-800 text-white rotate-0" : "bg-brand-700 text-white"
        }`}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <Wheat className="h-6 w-6" />
        )}
      </button>
    </>
  );
}
