import { Fragment, type ReactNode } from "react";

/**
 * Renderiza children word-by-word con animación de subida en stagger.
 * Cada nodo de texto se descompone en palabras envueltas en spans con
 * --i incremental para CSS calcular el delay.
 *
 * Soporta nodos hijo (ej. <span class="italic">…</span>): preserva la
 * estructura, sólo descompone el texto interno.
 */
export function SplitHeadline({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  // Counter compartido para el stagger entre todos los nodos de texto
  const ctx = { i: 0 };
  return (
    <span className={`headline-reveal ${className}`}>
      {splitNode(children, ctx)}
    </span>
  );
}

function splitNode(node: ReactNode, ctx: { i: number }): ReactNode {
  if (typeof node === "string") {
    return splitText(node, ctx);
  }
  if (Array.isArray(node)) {
    return node.map((child, idx) => (
      <Fragment key={idx}>{splitNode(child, ctx)}</Fragment>
    ));
  }
  if (
    node &&
    typeof node === "object" &&
    "props" in node &&
    typeof (node as { props?: { children?: ReactNode } }).props === "object"
  ) {
    const el = node as React.ReactElement<{ children?: ReactNode }>;
    const cloned: React.ReactElement<{ children?: ReactNode }> = {
      ...el,
      props: { ...el.props, children: splitNode(el.props.children, ctx) },
    } as React.ReactElement<{ children?: ReactNode }>;
    return cloned;
  }
  return node;
}

function splitText(text: string, ctx: { i: number }) {
  const parts = text.split(/(\s+)/); // mantiene espacios
  return parts.map((part, idx) => {
    if (/^\s+$/.test(part)) {
      return <span key={`s${idx}`}>{part}</span>;
    }
    if (part === "") return null;
    const i = ctx.i++;
    return (
      <span key={`w${idx}`} className="word">
        <span style={{ ["--i" as string]: i }}>{part}</span>
      </span>
    );
  });
}
