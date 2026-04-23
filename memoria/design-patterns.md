# Patrones de diseño — referencias y aplicación

Campo se construye **copiando patrones probados** de marketplaces exitosos, no inventando UX nueva. Cada pantalla toma el patrón dominante de una referencia y lo adapta al contexto granero.

## Referencias y qué extraemos de cada una

| Referencia | Qué copiamos | Por qué |
|------------|-------------|---------|
| **Zillow** | Hero full-bleed con imagen + búsqueda grande centrada | Convierte bien: el usuario ya sabe qué quiere y lo busca directo, sin leer copy. |
| **MercadoLibre** | Sidebar de filtros + chips de filtros activos + lista de resultados | Es el mental model más difundido en LatAm para listados. Bajo costo cognitivo. |
| **AutoTrader** | Cards con foto grande dominante + 4 datos escaneables + precio destacado | Activos físicos de alto valor = la foto y el precio venden. Todo lo demás es secundario. |
| **Amazon** | Página de detalle con "buy box" sticky a la derecha, CTA primario grande, información secundaria debajo | Concentra la conversión en un bloque siempre visible. Pone la acción a un clic. |
| **Alibaba** | Botón "Contact supplier / Me interesa" + mensaje libre, sin checkout ni pagos | Es contact-based, no transacción directa. Calca el flujo B2B real. |
| **Linear/Stripe dashboards** | Sidebar vertical + stats arriba + contenido principal | SaaS simple: el usuario ya sabe cómo moverse sin aprender UI nueva. |

## Aplicación pantalla por pantalla

### 1. Homepage — patrón Zillow
- **Hero full-bleed** con foto de campo y overlay oscuro para contraste.
- **Barra de búsqueda dominante** en el centro: sólo 2 selectores (grano + país) + CTA "Buscar".
- El search es la acción primaria; "crear cuenta" es link secundario debajo.
- **Ofertas destacadas** (3 cards) debajo para dar "prueba social" de que hay inventario.
- **Cómo funciona**: 3 pasos numerados para usuarios agro que no son digitales.
- **CTA final** en bloque verde con fondo sólido para el que no buscó.

**Justificación:** En Zillow el usuario entra sabiendo qué busca (ciudad/código postal). En Campo igual: sabe el grano y el país. Eliminamos fricción.

---

### 2. Listado — patrón MercadoLibre
- **Sidebar izquierdo** con filtros persistentes (grano, país, toneladas, modalidad, orden).
- **Chips de filtros activos** arriba de los resultados, con "X" para sacarlos uno por uno + "limpiar todo".
- **Contador de resultados** a la izquierda ("6 publicaciones").
- **Grid de 2/3 columnas** responsive.
- Estado vacío con mensaje claro cuando no hay resultados.

**Justificación:** Los usuarios B2B filtran mucho. El chip pattern deja visible qué está filtrando y permite editar sin volver al sidebar.

---

### 3. Cards — patrón AutoTrader
- **Foto grande 16:10** arriba, con zoom al hover.
- **Badges sobre la foto**: grano (branded) y "hace 2 h" (time-ago neutral).
- **Título claro**: "500 t de soja".
- **2 líneas de metadata**: ubicación completa y fecha de entrega.
- **Precio grande y bold** abajo, con label "Precio / t" o "Modalidad".
- Nombre del vendedor a la derecha del precio.
- **Hover: elevar 2px + sombra más profunda** (microanimación que sugiere "clickable").

**Justificación:** En activos físicos de alto ticket, la foto es el 70% de la decisión de click. La info debajo es para confirmar, no para convencer.

---

### 4. Detalle — patrón Amazon (buy box)
Layout 2 columnas (2/3 + 1/3) en desktop, una sola en mobile.

**Columna izquierda (contenido):**
- Breadcrumb.
- Hero image 16:9 con badges.
- Título grande + ubicación.
- **Strip de specs** (4 ítems: toneladas, precio, entrega, origen) en card horizontal.
- Bloque de descripción.
- Bloque de vendedor con avatar + badges ("verificado").
- **Ofertas relacionadas** (mismo grano) al final, para no perder al usuario si ese lote no le sirve.

**Columna derecha (buy box sticky):**
- **Precio grande y dominante** (4xl) — es lo primero que ve.
- **Total estimado** si es precio fijo (price × tonnage).
- **Textarea de mensaje inicial**.
- **CTA primario "Me interesa"** (full width, size large, verde brand).
- CTA secundario "Guardar para después".
- **Trust signals**: vendedor verificado, tiempo de respuesta, fecha de entrega.

**Justificación:** La buy box sticky mantiene el CTA siempre visible mientras el usuario lee. Replica el patrón que ya asocian con "comprar" aunque acá sea "contactar".

---

### 5. Contacto — patrón Alibaba
- **Sin chat en vivo, sin cotización estructurada.**
- Mensaje libre que el buyer escribe en la buy box del detalle.
- Aparece como "interés" en la bandeja del seller + bandeja del buyer.
- El seller cambia el estado (pendiente → aceptado/rechazado).
- Después se contactan por fuera (teléfono/email).

**Justificación:** Alibaba valida que B2B no necesita transacción in-app para funcionar. Los vendedores quieren leads con contexto, no pedidos automatizados.

---

### 6. Dashboard — patrón SaaS estándar (Linear/Stripe)
- **Sidebar vertical** con 4 entradas: Resumen, Mis publicaciones, Intereses recibidos, Intereses enviados.
- **CTA "Nueva publicación"** destacado debajo de la navegación.
- **Stat cards** arriba en "Resumen" (3 métricas).
- Contenido principal con cards o tablas simples por sección.

**Justificación:** Cualquier usuario SaaS entiende esta estructura en 2 segundos. No hay nada nuevo que aprender.

---

## Decisiones UX justificadas

1. **Search sobre navegación en la home.** La barra de búsqueda en el hero es más prominente que el nav. En marketplaces, el descubrimiento vence al branding.
2. **Cards con foto grande, no tipo tabla.** Se podría mostrar más info por scroll con rows, pero la foto mata dudas de calidad. Prioridad visual.
3. **Chips sobre selects persistentes.** Un usuario que filtra por "Soja + Argentina + 500-1000 t" quiere ver los 3 chips, no 3 selects rellenos en un panel.
4. **Buy box con "total estimado" calculado.** Precio × toneladas. Ahorra mental math y es un micro-commitment: ya visualiza el tamaño de la operación.
5. **Ofertas relacionadas al final del detalle.** Si este lote no le cierra, evita que salga del sitio.
6. **Trust signals bajo el CTA, no arriba.** La decisión primaria es mandar mensaje; la confirmación de confianza viene después, cuando dudás.
7. **Idioma español para el MVP.** Aunque es global, el equipo fundador y el primer mercado son hispanohablantes. Internacionalización = Sprint futuro.

## Lo que NO copiamos

- Reviews/estrellas (Amazon) — no hay volumen todavía para darles contexto real.
- Precio en tiempo real (trading platforms) — fuera de alcance MVP.
- Chat (WhatsApp, Alibaba chat) — overkill; mensaje único alcanza.
- Carrito / checkout — no hay transacción en la plataforma.
- Banners publicitarios (ML) — no hay advertisers.
- "Usuarios viendo este producto" (Booking) — sin volumen real se siente fake.
