# Sesión 2026-05-06 — Pasada de UX en dashboard, préstamos, precios + bandeja unificada de intereses

> Commits: `73e00a9` (rediseño home + /mapa) y `f703e78` (UX dashboard + préstamos + precios + intereses).

## Cambios principales

### Home — sección Precios + filtros refinados (`page.tsx`)
- Nueva sección entre Cultivos y Trust con 4 cards (soja/maíz/trigo/girasol): precio actual USD/t + chip variación semanal + sparkline 12 sem + CTA a `/precios`.
- Helpers locales `<Sparkline>` y `<PriceCard>`.
- (Bonus de la sesión anterior, queda mencionado.)

### Bandeja de intereses unificada (`/dashboard/intereses`)
- Las dos páginas separadas (`/intereses-recibidos` y `/intereses-enviados`) se fusionaron en una sola.
- **Segmented control** Recibidos/Enviados arriba con count + dot ámbar para pendientes en cada tab.
- **Filtros de status** como chips secundarios (Todos / Pendiente / Aceptado / Rechazado).
- Cards distintas por tipo:
  - Recibidos: comprador + acciones Aceptar/Rechazar + mensaje.
  - Enviados: vendedor + precio + link a la publicación + tu mensaje.
- URL `?tipo=recibidos|enviados&status=pending|accepted|declined`.
- **Sidebar consolidado**: 1 entrada "Intereses" con badge total de pendientes (recibidos + enviados).
- URLs viejas redirect 307 preservando `?status`.
- Todos los links internos actualizados (banner urgent, chats, InterestForm post-submit, MOCK_NOTIFICATIONS hrefs).

### Filtros de Precios (`PricesClient.tsx`)
- Los dos `<select>` con `.select-campo` (que tiene `width: 100%` baked en `globals.css`) ocupaban toda la fila y stackeaban — visualmente roto.
- **Grano**: chips horizontales (Todos + 8 granos) estilo `<SortChips>` del marketplace.
- **Región**: select compacto custom (rounded-full, chevron propio, pl/pr ajustados, sin `select-campo`).
- Hint "Hacé clic en un grano..." movido a la derecha de la fila de Región (oculto en mobile).
- Helper `<FilterChip>` agregado al final del archivo.

### Mapa — viewport persistente entre capas (`MapaClient.tsx`)
- Cambié `key={active}` (que causaba remount al cambiar capa) por `display: none` toggle.
- Ambas capas montan siempre; cada una preserva su zoom/filtros/provincia al volver.
- Costo: ambos clientes corren en memoria (cheap, sin side effects de mount problemáticos).
- Fase 2.5 verdaderamente "compartida" (lift state) queda como futuro.

### Banner urgent en dashboard (`/dashboard/page.tsx`)
- Aparece arriba del stats grid si hay 1+ intereses recibidos pending hace > 24 h.
- Background gradient amber/cream + icono `<AlertCircle>` + nombre del comprador más viejo + count de otros + CTA "Responder ahora" → `/dashboard/intereses?tipo=recibidos&status=pending`.
- Helper `getUrgentReceivedInterests()` que filtra y ordena oldest first.

### Chat thread (`/dashboard/chats/[id]/page.tsx`)
- **Composer sticky bottom**: `fixed inset-x-0 bottom-0 z-20` con `bg-white/95 backdrop-blur-md`. Ya no se pierde al scrollear chats largos.
- **Mensajes agrupados por día** con divisores estilo "Hoy / Ayer / 12 de mayo":
  - `groupMessagesByDay()` calcula buckets respecto al día actual.
  - Cada bucket tiene un divisor con líneas finas a los costados.
- Cada bubble muestra **HH:MM** (24 h) en lugar del `timeAgo` repetido.
- `pb-32` en el contenedor para que los mensajes no queden tapados por el composer.

### Mis publicaciones (`/dashboard/publicaciones/page.tsx`)
- **Header arreglado**: el `h1` ahora dice "Mis publicaciones" + descripción debajo. Antes el `h1` era el count ("3 publicaciones"), confuso.
- **Acciones limpias**: la banda gris al final de cada card con "Ver pública / Editar" se reemplazó por chips text-only que aparecen `on-hover` y `on-focus-within` en desktop, siempre visibles en touch (sin `sm:opacity-0`).

### Notificaciones (`/dashboard/notificaciones/page.tsx`)
- **Buckets temporales**: Hoy / Ayer / Esta semana / Más viejas, calculados con `bucketize()` por días desde `now`.
- **Filtros por tipo**: chips arriba (Todas / Intereses / Mensajes / Sistema) con count por tipo, vía `?tipo=`. `interest` agrupa `interest_received|accepted|declined`.
- **"Marcar todas como leídas"** ahora es un button outline con `<CheckCheck>` icon (antes era text link suelto, poco visible).

### Préstamos (`LoansClient.tsx`)
- **Toggle Tomador/Inversor** promoted a card propia ARRIBA del simulador, con:
  - Label "Soy" en tracking-wide.
  - 2 botones grandes con icono (`<Wallet>` para Tomador, `<Coins>` para Inversor) + descripción de rol ("Necesito financiamiento" / "Quiero prestar capital").
  - Activo: bg-brand-700 + shadow.
  - Inactivo: bg-white border-ink-200, hover sage.
- En la columna derecha solo queda un **dot brand discreto** indicando el rol activo (antes había un toggle redundante ahí).
- **`RiskBadge` y `ScoreBar` al design system**:
  - Eliminados hex inline (`#4f632f`, `#c97b55`, `#b66240`, `#9b2c2c`).
  - Mapeo `RISK_TONE: Record<string, { dot, text, border, bg, barFill }>` con clases Tailwind para A/B/C/D → emerald/amber/orange/rose.
  - Consistente con `<HealthDot>` (mismo patrón semáforo).
- **Trust pills más sutiles**: el header pasa de 4 pills con `border-ink-200 bg-white` a versión inline dot+texto sin background.
- **Pendientes**: tooltips `<Info>` no funcionan en mobile (group-hover), sliders nativos sin estilizar, `<RateLine>` aún usa hex inline en call sites (lines 391-398), tab nav inconsistente con el resto de la app.

### Perfil (`/dashboard/perfil/page.tsx`)
- **Avatar con upload mock**: `<label htmlFor="logo-upload">` envuelve el círculo con `<input type="file" accept="image/*" className="sr-only">`. Hover muestra overlay dark con `<Upload>` icon. Sin persistencia real (TODO: Supabase Storage).
- **Sección de verificación accionable**:
  - Header con badge "Nivel actual: Verificada" al lado del título.
  - Grid de 3 niveles (Email / Empresa / Verified seller) con done/pending state, hint por nivel, helper local `<VerifLevel>`.
  - CTA "Iniciar verificación CUIT" disabled con texto "Te avisamos cuando esté disponible".

### Mock data ampliada (`mock-data.ts`)
- De 16 a 32 publicaciones (sesión anterior dejó esto en proceso, ya commiteado en `73e00a9`).
- Fechas frescas (últimos 7-14 días) — el LiveTicker y el "última publicada hace X" del home ahora se ven vivos.

## Decisiones tomadas

- **Bandeja unificada > 2 páginas separadas**: el segmented control Recibidos/Enviados es más natural que dos entradas en sidebar. Mantener dos URLs paralelas con redirect garantiza que ningún link viejo rompe.
- **Composer sticky `fixed` en lugar de `sticky`**: `fixed` se asegura que esté siempre en bottom de viewport, independiente del scroll del contenedor padre. `sticky` requiere que el padre tenga overflow controlado, frágil.
- **Mock data más, no menos**: 32 publicaciones permite hacer demos más realistas y el LiveTicker se ve poblado. Costo: ~430 líneas más en `mock-data.ts`, pero todo es plain JS data.
- **Risk tones a Tailwind, no a paleta brand earth**: aunque la paleta original (`#4f632f`, etc.) era más cálida, alinearlo con `<HealthDot>` (emerald/amber/rose) da consistencia inmediata para el usuario que ya vio esos colores en el dashboard.

## Pendientes después de esta sesión

Ver `tareas-pendientes.md` actualizado, especialmente:

**Crítico (no se hizo, aún)**:
- Auth real con Supabase
- Server actions CRUD de publicaciones + reemplazo de `MOCK_LISTINGS`
- Modelo de comisión concreto

**Limpieza inmediata (≤ 30 min)**:
- Borrar `src/components/effects/Onboarding.tsx` (dead code)
- Actualizar copy `src/app/layout.tsx:49,55` (sigue diciendo "sin comisiones")
- `weather-data.ts:116`: namespacearr `"Río Negro"` (coordinar con compañero)

**UX que quedó pendiente del review pero no se hizo**:
- Stats del dashboard a insights (tasa respuesta / tiempo cierre / valor operado) — requiere mock con `accept_at`/`closed_at`
- Mapa Fase 2: extraer `<MapShell>` compartido
- Tab nav de Préstamos consistente con `/dashboard/intereses` y `/mapa`
- Tooltips Info de Préstamos accesibles en mobile
- Sticky header en `/precios` con grano + precio al scrollear
- Búsqueda en chats / intereses / notificaciones
