# Sesión 2026-05-05 — Redesign del home + integración con compañero + plan de unificación de mapa

> Backup completo de proyecto (sin node_modules / .next): `~/Desktop/Campo-backup-2026-05-05-2025h.tar.gz` (7.7 MB).

## Contexto inicial

- Branch `main` con 11 archivos modificados sin commitear + 5 nuevos sin trackear (componentes de listings: HealthDot, PriceCalculator, SortChips, StickyListingHeader, BrowserFrame).
- Visual de la home tenía un mockup de publicación "colgando" en el hero (BrowserFrame con foto rara), que el usuario rechazó.
- Modelo de revenue ya decidido: comisión por transacción (NO 0%). Varios copies del home seguían diciendo "sin comisiones" y había que limpiarlos.

## Cambios aplicados al home (`src/app/page.tsx`)

### Hero
- `min-h-[85vh]` con flex-center → cinemático sin hacerlo gigante.
- Sacado el panel/mockup colgando a la derecha. Hero queda a una sola columna.
- Viñeta inferior suavizada (h-32, rgba 0.55) + textura sutil de puntos compartida con la sección verde para continuidad de tono y eliminar la "línea" visible que se quejaba el usuario.
- Copy corregido: "sin corredores, sin comisiones" → "Vendedores verificados, alcance global".

### Mercado en vivo (verde dark)
- Reemplazado por `<LiveTicker />` (cinta horizontal angosta tipo Bloomberg sobre fondo claro), refinado con país en chip mono, precio inline cuando es fixed, ciudad y timeAgo. Mucho más elegante que la sección verde dark con lista numerada 01-06 que no encajaba con el resto del home.
- Componente `LiveTicker.tsx` actualizado: fondo gradient-to-b from-brand-50/50 to-ink-50, chip "En vivo" con border sage + backdrop, precio en brand-800.

### Cultivos (cards)
- Cards enriquecidas: pills de país principal (ISO code arriba-derecha), "X ofertas" arriba-izquierda, gradient overlay abajo con grain name + "desde USD X/t" calculado desde MOCK_LISTINGS (precio mín de listings active+fixed+USD).
- Helper `cultivoMeta()` que computa count + minPrice + mainCountry por cultivo.

### Precios (NUEVO — entre Cultivos y Trust)
- Sección con 4 cards (soja/maíz/trigo/girasol).
- Cada card: label + región, chip de variación semanal (color + flecha), precio actual `USD/t` grande, sparkline SVG inline de últimas 12 semanas (con área degradada).
- CTA "Ver tabla completa →" hacia `/precios`.
- Helpers locales `Sparkline` y `PriceCard`.
- Es el cambio más diferencial: información de mercado real (no solo claim).

### Trust strip (NUEVO — entre Precios y Cómo funciona)
- 8 nombres reales de empresas tomadas de `MOCK_LISTINGS` (Agro del Sur, Fazenda Esperança, Black Sea Grain Co., etc.).
- 3 stats de credibilidad con `<CountUp>`: Vendedores activos, Países conectados, Cultivos disponibles.
- Helper local `CredItem`.
- Pendiente real: cuando haya logos reemplazar la lista en cursiva por logos. O reemplazar por mapa global con dots (idea de "global hecho visible").

### FAQ
- Pasó de 4 a 6 preguntas. Reescrita la primera (¿Cómo cobra Campo?) honestamente con el modelo de revenue real.
- Agregadas 2 grain-specific:
  - "¿Cómo se valida la calidad del grano?" — menciona SENASA, IRAM, GAFTA, FOSFA.
  - "¿Cómo se manejan la logística y los términos internacionales?" — Incoterms, FOB/CIF.

### CTA banner final
- Edge-to-edge full width con foto de trigo de fondo + 5 capas (gradient diagonal, viñeteado superior, glow sage, textura puntos).
- Headline editorial reducido a `text-5xl` (antes era `text-[80px]`, gigante).
- Stats strip al pie REMOVIDO (ya no había necesidad: stats viven en Trust strip).
- Botones: blanco con shadow sage para primary, outline para secondary.
- Copy de footer del banner: "Publicar es gratis · Crear cuenta lleva un minuto" (no más "sin comisiones").

### Cómo funciona
- Step 02 reescrito sin "sin comisiones": "Cero corredores entre las puntas, cero ruido."

### Otros archivos del MVP

**`src/lib/utils.ts`** — agregado `getListingHealth()` y tipo `ListingHealth` (semáforo good/warn/bad para publicaciones del propio usuario, en base a edad + intereses pendientes + chats sin leer).

**`src/components/listings/`** (nuevos componentes):
- `HealthDot.tsx` — dot de semáforo animado.
- `PriceCalculator.tsx` — slider/input para que comprador calcule subtotal por toneladas.
- `SortChips.tsx` — chips de orden en marketplace (reemplazó `<select>` de ListingFilters).
- `StickyListingHeader.tsx` — header flotante en detalle de publicación al hacer scroll.

**`src/app/marketplace/page.tsx`**: chips de filtros activos en su propia fila + nueva fila SortChips.

**`src/app/marketplace/[id]/page.tsx`**: integrado StickyListingHeader + PriceCalculator (solo si fixed price); form de interés con `id="message"` para anchor desde sticky.

**`src/app/dashboard/page.tsx`**: saludo dinámico por hora del día + fecha completa es-AR.

**`src/app/dashboard/publicaciones/page.tsx` + `[id]/page.tsx`**: HealthDot integrado en lista y detalle de mis publicaciones.

**`src/app/not-found.tsx`**: rediseñada con ilustración SVG de espigas + 4 sugerencias (Soja / Precios / Mapa / Ayuda).

**`src/app/layout.tsx`**: removido `<Onboarding />`.

**`src/components/ui/Drawer.tsx`**: transición de fade aplicada al root del dialog (no solo al backdrop).

**`src/components/effects/BrowserFrame.tsx`**: ELIMINADO (era para el mockup colgante del hero, ya no se usa).

## Integración con compañero

Compañero (Facu) pusheó commit `8215896` durante la sesión:
- Sección **Préstamos** (`/prestamos`): simulador con scoring A/B/C/D, 4 productos, amortizaciones, vista tomador/inversor, cronograma, matriz de riesgo. Componente: `LoansClient.tsx` (577 líneas), datos: `loan-data.ts` (326 líneas).
- Sección **Clima** (`/clima`): mapa choropleth AR/UY por temperatura/precipitación, pronóstico 7 días, indicadores agropecuarios (GDD, sequía, helada, humedad), histórico mensual. Componente: `ClimaClient.tsx` (590 líneas), datos: `weather-data.ts` (311 líneas).
- Mejora de **Precios** (`PricesClient.tsx`): tabla con rango 4 sem (barra min/actual/max), badge de variación, delta absoluto, barra de volumen.

Pull resuelto sin conflictos (zero overlap entre sus archivos y los míos). Rebase fast-forward limpio.

**Issue chico flageado** (no fixeado): `src/lib/weather-data.ts:116` tiene `"Río Negro"` duplicado (existe como provincia AR-Patagonia y depto. UY). El runtime usa la última (UY → uruguay). Funcional pero TypeScript warn-loggea. Decisión a tomar con compañero: namespacearlo (`"Río Negro AR"` / `"Río Negro UY"`) o dejarlo.

## Navbar refresh

`src/components/layout/Navbar.tsx` reescrito como client component:
- Reorganización: `Marketplace · Precios · Más ▾` (dropdown agrupa Préstamos / Clima / Geografía con ícono + descripción corta).
- Scroll-aware: al hacer scroll > 4px agrega backdrop-blur + shadow. Sticky pero "alive".
- Search bar: `max-w-sm` (antes ocupaba todo el centro), placeholder específico "Soja, Córdoba, USD…", focus ring brand.
- Cluster de usuario más compacto (Currency + Chat + Bell + Mi panel).
- "Ingresar" como text link (no más button ghost), "Crear cuenta" como primary button con border-l separator.
- Closes-on-outside-click + escape para el dropdown.

`src/components/layout/MobileNav.tsx`: agrupado en secciones (Producto / Más / Cuenta) con `<SectionLabel>` helper. Mantiene flat list pero con jerarquía visible.

## Decisión clave a futuro: unificación `/clima` + `/geografia` → `/mapa`

Diagnóstico:
- Ambos usan `react-simple-maps` con los mismos geojson `/geo/argentina.geojson` y `/geo/uruguay.geojson`.
- Mismo viewport AR + UY. Misma infraestructura (zoom, pan, controls).
- Distintas preguntas que responden:
  - Geografía → "¿dónde se vende qué?" (markers con popup de ofertas + precio)
  - Clima → "¿qué temperatura/lluvia/agro tiene mi zona?" (choropleth por provincia)
- Combinable: ver "mi provincia tiene 28°C + 4 ofertas activas" en una sola vista.

Plan en 3 fases:
- **Fase 1 (siguiente)**: crear `/mapa` con shell + selector de capa (`?layer=ofertas | clima`). URLs viejas redirect. Mínimo refactor — los Clients existentes se mantienen como capas.
- **Fase 2 (futuro)**: extraer `<MapShell>` compartido (geo + zoom + controles) y dejar capas como hijos.
- **Fase 3 (futuro)**: capa combinada con toggles de visibilidad (ver ofertas Y clima a la vez).

> Antes de Fase 1, conviene avisarle al compañero (recién pusheó Clima) para coordinar.

## Estado al cierre de la sesión

- 11 archivos modificados sin commitear (home + dashboard + marketplace + utils + layout + drawer + listings filters).
- 4 archivos nuevos sin trackear (HealthDot, PriceCalculator, SortChips, StickyListingHeader).
- Branch `main` al día con `origin/main` (`8215896`).
- Backup tarball generado: `~/Desktop/Campo-backup-2026-05-05-2025h.tar.gz`.
- Próximo paso: ejecutar Fase 1 de la unificación de mapa.
