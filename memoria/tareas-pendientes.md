# Tareas pendientes — Campo

Backlog vivo de features y mejoras del producto. Se organiza por bloque y prioridad relativa, no por fecha. Cuando algo se completa, se marca con `[x]` y se mueve a `decisiones.md` si la decisión fue no-trivial.

> **Última actualización**: 2026-05-05 — sesión de redesign del home + integración con cambios del compañero (Préstamos / Clima / Precios mejorada) + unificación de mapa fase 1. Ver `conversaciones/2026-05-05-home-redesign-y-unificacion-mapa.md`.

## ⭐ Top of mind — próximos pasos

Lo que más mueve la aguja para pasar de MVP visual a MVP funcional:
1. **Auth real con Supabase** (bloque 1) — todo el resto depende de esto.
2. **Server actions CRUD de publicaciones + reemplazo de `MOCK_LISTINGS`** (bloque 1).
3. **Definir el modelo de comisión concreto** (bloque 0) — % / quién paga / trigger.
4. **Mapa fase 2** — extraer `<MapShell>` compartido y refactor de las dos capas (bloque 9 / Mapa unificado).
5. **Cuenta demo + seed** para showcasing (bloque 8).

Limpieza inmediata antes de Auth (≤ 30 min):
- Borrar `src/components/effects/Onboarding.tsx` — archivo dead code, ya no se importa en ningún lado y todavía dice "sin comisiones".
- Actualizar copy en `src/app/layout.tsx:49,55` (description metadata + openGraph) que sigue diciendo "Sin corredores, sin comisiones".

---

## 0. Cambio de modelo — comisión por transacción

> **Decisión 2026-05-04**: Campo cobra por transacción cerrada (no es 0% comisión como dice hoy la landing y varios FAQs). Hay que actualizar copy, definir tarifa/quien paga/cuándo se cobra, y empezar a modelar el flujo de cobro.

- [ ] **Definir el modelo concreto**:
  - % de comisión sobre monto operado (¿1%? ¿0,5%? ¿escalonado por volumen?)
  - ¿Lo paga vendedor, comprador, o se split 50/50?
  - ¿Se cobra al cerrar el chat ("operación cerrada"), al confirmar entrega, o al pago?
  - Mínimo / máximo por operación
  - Política para operaciones sub-marketplace ("cierran por afuera")
- [x] **Actualizar copy en toda la app** — *parcialmente hecho* (sesión 2026-05-05):
  - [x] `src/app/page.tsx` — hero, FAQ, CTA final, Cómo funciona reescritos sin "sin comisiones".
  - [ ] `src/app/layout.tsx` — `description` metadata + `openGraph.description` siguen diciendo "Sin corredores, sin comisiones" (líneas 49 y 55).
  - [ ] `src/components/effects/Onboarding.tsx` — archivo dead code, removido del root layout pero todavía existe. Borrarlo o reescribir si se reactiva.
  - [ ] `src/components/layout/Footer.tsx` — verificar claim "sin corredores".
  - [ ] `memoria/product-definition.md`, `decisiones.md`.
  - [ ] Términos y privacidad.
- [ ] **Schema DB**: tabla `transactions` o `fees` (operation_id, amount, currency, fee_amount, fee_currency, status, paid_at, payer).
- [ ] **Trigger del cobro**: cuando un chat pasa a estado "cerrada" — disparar creación de fee record.
- [ ] **Integración de pago**: definir si Mercado Pago + Stripe, dlocal, escrow especializado en agro, o factura manual al inicio del MVP.
- [ ] **Dashboard de facturación** del usuario — ver fees pendientes, pagas, comprobantes descargables.
- [ ] **Reportar comisión cobrada** en el detalle de la operación (tanto al vendedor como al comprador, según quién pague).
- [ ] **Política antifraude / antielusion** — la lógica natural va a ser que las partes intenten cerrar por afuera para evitar la comisión. Estrategias: bonus de calificación, verificación de operación, garantía de cumplimiento, escrow opcional.

---

## 1. Crítico para que el MVP "funcione"

Sin esto los flujos del producto no cierran.

- [ ] **Auth real con Supabase** — signup, login, logout, callback de email. *(UI de login/register existe, falta cableado)*
- [ ] **Server actions CRUD de publicaciones** — crear, editar, cambiar estado, eliminar. *(form de nueva existe; `/dashboard/publicaciones/[id]/editar` sigue siendo placeholder)*
- [ ] **Reemplazar `MOCK_LISTINGS`** por queries reales con filtros server-side.
- [x] **Sistema de intereses — UI completa** — `/dashboard/intereses-recibidos`, `/intereses-enviados`, vista por publicación con accept/decline.
  - [ ] Persistencia: botones Aceptar/Rechazar son visuales, falta server action que cambie status y abra chat.
- [ ] **Perfil editable** — el usuario tiene que poder actualizar su info post-signup. *(UI lista en `/dashboard/perfil`, falta save action)*
- [ ] **Cuenta de prueba / demo** — usuario `demo@campo.test` con publicaciones e intereses precargados, para showcasing y QA.

---

## 2. Confianza y reputación

Lo que hace que el otro lado se anime a operar.

- [x] **Perfiles públicos del usuario** (`/u/[id]`) — UI lista:
  - razón social + avatar (logo cuando haya upload)
  - ubicación, antigüedad
  - mini-stats (publicaciones activas, cerradas, intereses recibidos, tiempo de respuesta)
  - listado de publicaciones activas
  - "a qué se dedica" — placeholder textual; falta campo `bio` real en `profiles`
- [ ] **Verificación de cuenta** — niveles:
  - Email verificado (automático)
  - Empresa verificada (CUIT / CNPJ / Tax ID + revisión manual) *(badge visual existe, sin lógica real)*
  - "Verified seller" con histórico de operaciones cerradas
- [ ] **Comentarios / reseñas post-operación** — sólo entre partes que efectivamente cerraron una operación (evita spam/manipulación).
- [x] **Reportar publicación / usuario** — `<ReportButton>` en detalle de publicación + perfil. *(UI; falta destino de moderación)*

---

## 3. Comunicación

Pasar del "Me interesa" estático a una conversación real.

- [x] **Chat por publicación — UI** — listado en `/dashboard/chats` y thread en `/dashboard/chats/[id]`. Cabecera muestra contraparte + publicación + atajos "Ver intereses" / "Ver pública".
  - [ ] Persistencia real (Supabase tables `chats` + `messages`); composer no envía nada todavía.
  - [ ] Estados del hilo: pendiente, en conversación, cerrada, rechazada.
- [x] **Menu de chats activos en navbar** — ícono con badge de no leídos linkea a `/dashboard/chats`.
- [x] **Notificaciones in-app — campana en navbar** — `<NotificationsBell>` con dropdown y página `/dashboard/notificaciones`.
  - Tipos cubiertos: `interest_received`, `interest_accepted`, `interest_declined`, `new_message`, `system`.
  - [ ] Cableado real: hoy lee de `MOCK_NOTIFICATIONS`; falta tabla + triggers desde server actions.
  - [ ] "Marcar todas como leídas" no hace nada todavía.
- [ ] **Notificaciones email** (opcional, configurable):
  - Nuevo interés
  - Respuesta sin leer hace > 24h
  - Resumen semanal de actividad
- [ ] **Push notifications** (post-MVP) cuando haya app o PWA.

---

## 4. Historial y trazabilidad

- [ ] **Historial de operaciones** del usuario:
  - Publicaciones que vendió + a quién + cuándo + ton + monto (si declarado)
  - Compras / intereses que cerró + a quién
  - Filtrable por grano / fecha / contraparte
- [ ] **Historial visible en perfil público** (con privacidad: el usuario decide qué se muestra).
- [ ] **Export de historial** a CSV / PDF para cierre de balance.

---

## 5. Inteligencia y dashboards

- [x] **Dashboard de tendencias — sección Precios** (`/precios`): tabla con rango 4 sem (barra min/actual/max), badge variación, delta absoluto, barra de volumen, conversión multi-moneda. Mejorado por compañero (commit `8215896`).
  - [x] **Preview en home** — sección "Lo que se está pagando" entre Cultivos y Trust con 4 cards (soja/maíz/trigo/girasol) + sparkline 12 sem + chip variación + CTA a tabla completa (sesión 2026-05-05).
  - [x] **Hydration fix** — `price-data.ts` usaba `Math.random()` al cargar módulo → diferentes números server vs client → hydration error. Reemplazado por PRNG determinístico (mismo patrón de `weather-data.ts`) seeded por nombre de grano (sesión 2026-05-05).
  - [ ] **Volumen ofertado vs demandado** — falta cuando haya distinción entre publicaciones de venta y de compra.
  - [ ] **Países más activos** — falta ranking dinámico.
  - [ ] **"Donde se concentra hoy el mercado"** — overlay temporal sobre el mapa de ofertas.
- [x] **Análisis de clima como sección** — sesión del compañero (commit `8215896`): mapa choropleth AR/UY por temperatura/precipitación, pronóstico 7 días, indicadores agropecuarios (GDD, sequía, helada, humedad), histórico mensual de temperatura/precipitación/sol. Disponible en `/mapa?layer=clima` (antes `/clima`, redirect activo). Componente: `src/components/weather/ClimaClient.tsx`, datos: `src/lib/weather-data.ts`.
  - [ ] **Cableado al dashboard del usuario** — hoy es standalone; falta overlay personalizado por región del perfil.
  - [ ] **Pronóstico a 14 días** (hoy son 7).
  - [ ] **Integración con APIs reales** (Open-Meteo, NASA POWER) — hoy son datos generados.
  - [ ] **Fix duplicado en `weather-data.ts:116`**: `"Río Negro"` está como provincia AR (Patagonia) y depto UY simultáneamente. Runtime usa la última (UY). Coordinar con compañero cómo namespacearlo.
- [ ] **Estacionalidad / qué se vende en cada época**:
  - Calendario por hemisferio (siembra / cosecha por grano y país)
  - "En esta época suele moverse más X"
  - Filtro en marketplace: "ofertas típicas de esta estación"

---

## 6. Productos nuevos (post-validación del marketplace base)

### Campo Crédito (`/prestamos`)
- [x] **UI completa** — sesión del compañero (commit `8215896`, 2026-05-05): simulador con scoring crediticio A/B/C/D, 4 productos (adelanto cosecha, crédito comprador, acopio, facturas), amortización francesa/alemana/bullet, vista tomador/inversor, cronograma de pagos, composición de tasa, matriz de riesgo. Componente: `src/components/loans/LoansClient.tsx`, datos: `src/lib/loan-data.ts`.
- [ ] **Adelantar pago** — el comprador adelanta plata contra una operación cerrada, recibe descuento (yield para él, liquidez para el vendedor). *(producto financiero real, no solo simulador)*
- [ ] **Atrasar pago** — el vendedor cobra después, recibe rendimiento (interés a su favor).
- [ ] **Ranking crediticio** — score interno basado en:
  - Historial de cumplimiento
  - Antigüedad
  - Volumen operado
  - Verificación
  - Reseñas
- [ ] **Cableado real con la operación**: hoy el simulador es standalone — falta linkear con publicaciones / chats cerrados.
- [ ] **Alianzas con financiera / banco** para originar.

### Alquiler de parcelas
- [ ] Listado tipo marketplace pero para parcelas en alquiler:
  - Hectáreas
  - Ubicación (mapa)
  - Tipo de suelo / aptitud
  - Servicios (agua, electricidad, accesos)
  - Modalidad (porcentaje / fijo en USD/ha / mixto)
  - Fechas (campaña entera, multi-año)
- [ ] Schema separado pero misma plataforma de auth + chat + intereses.

---

## 7. Soporte y onboarding

- [ ] **Panel de Ayuda / Soporte** — `/ayuda` *(página existe con FAQ base; falta escalar a 30+ artículos + búsqueda)*:
  - Centro de ayuda con artículos por tema (publicar, cobrar, verificar, etc.)
  - FAQ ampliada (la actual tiene 6 entradas en landing — escalar a 30+ acá)
  - Búsqueda
- [x] **Contacto** — `/contacto` con formulario y links de canal. *(UI; falta endpoint de envío)*
- [x] **Onboarding del primer login** — `<Onboarding>` en root layout, mini tutorial.
- [ ] **Tips contextuales** — micro-help en formularios densos (nueva publicación).

---

## 8. Operativa / DX interna

- [ ] **Cuenta de prueba (`demo@campo.test`)** con seed completo: perfil verificado, 3 publicaciones, 2 intereses recibidos, 1 enviado.
- [ ] **Seed script** para poblar Supabase con datos plausibles (`scripts/seed.ts`).
- [ ] **Scripts de migración** si el schema evoluciona.
- [ ] **CI/CD básico** en GitHub Actions: lint + typecheck + build en PRs.
- [ ] **Branch protection** en `main`.

---

## 9. Visual / UX — pulir cada pantalla

Bloque transversal: mejorar feel y claridad en cada vista. Listado por pantalla con ideas concretas (no "hacerlo más lindo").

### Landing (`/`) — *Rediseñada en sesión 2026-05-05*

> Estructura actual: Hero (`min-h-[85vh]` con foto + activity bar) · LiveTicker · Cultivos (4 cards con país + precio mín) · Precios (4 cards con sparkline + variación) · Trust strip (8 empresas reales + 3 stats) · Cómo funciona · FAQ (6 preguntas, 2 grain-specific) · CTA edge-to-edge con foto de trigo.

- [x] **Hero más vivo** — bar de actividad con `stats.activeCount` + `timeAgo(latest)` + chip de "vendedores verificados".
- [x] **LiveTicker** marquee horizontal con 12 últimas publicaciones (país, tonelaje, grano, precio, ciudad, timeAgo).
- [x] **Animación de números** en stats — `<CountUp>` aplicado en Trust strip.
- [x] **Sección de Precios en home** — 4 cards con sparkline 12 sem + variación semanal + CTA a `/precios`.
- [x] **Trust strip** — 8 empresas reales del mock + 3 stats de credibilidad (vendedores activos, países, cultivos).
- [x] **Cultivos enriquecidos** — pill de país principal + "desde USD X/t" + count de ofertas.
- [ ] **Mapa global de actividad** — globe interactivo o mapa estilizado mostrando dónde está la oferta activa hoy. Trust strip podría reemplazarse por esto cuando esté.
- [ ] **Testimonials con foto/empresa** — un slot debajo del "Cómo funciona" cuando haya users reales.
- [ ] **CTA flotante sticky** en mobile cuando se hace scroll abajo del hero.
- [ ] **Mock data fresco** — los `created_at` de `MOCK_LISTINGS` están en abril 2026, hoy 5 may → "última publicada hace 13 d". Actualizar a fechas relativas (`Date.now() - X horas`) para que el live se vea vivo.

### Marketplace (`/marketplace`)
- [ ] **Vista mapa** alterna a la grilla — toggle "Lista / Mapa" con pins por publicación. *(parcial: hoy `/mapa?layer=ofertas` cumple esto fuera del marketplace; falta integración del toggle dentro del listado).*
- [ ] **Skeletons** mientras carga (hoy va sync porque es mock; reservar el espacio para evitar layout shift cuando sea async).
- [x] **Sort visual** — `<SortChips>` reemplazó el `<Select>` (sesión 2026-05-05).
- [x] **Filtros aplicados como chips** — fila propia "Filtros activos" + "Limpiar todo".
- [ ] **Chips con color por grano** — los chips funcionan pero son neutros, podrían reflejar el color del grano correspondiente.
- [ ] **Empty state ilustrado** — cuando no hay resultados, sugerir "probá quitar el filtro X" basado en el filtro más restrictivo.
- [ ] **Comparador** — botón "Comparar" en cada card; al seleccionar 2-3 abre overlay con diff lado a lado (precio/t, total, entrega, distancia).
- [ ] **Distancia desde mi ubicación** en cada card si el usuario tiene perfil con `country/region/city`.
- [ ] **Indicador "nuevo"** (publicado hace < 24 h) más prominente, no solo el `timeAgo` chico.

### Detalle de publicación (`/marketplace/[id]`)
- [x] **Sticky header** al hacer scroll: `<StickyListingHeader>` (desktop only, aparece pasados 600px de scroll, ancla al `#message`) (sesión 2026-05-05).
- [x] **"Calculadora rápida"** en el buy box: `<PriceCalculator>` con slider + input numérico, respeta moneda global del `CurrencyProvider`. Solo aparece si `price_mode === "fixed"`.
- [ ] **Galería con zoom y swipe** — el `ListingGallery` ya está pero falta lightbox modal. Verificar UX en mobile.
- [ ] **Mapa de origen** embebido (Mapbox/Leaflet) con pin sobre `city`. *(podría aprovechar el shell de `/mapa`)*
- [ ] **Análisis de calidad / fichas técnicas** en pestaña adicional (Humedad, Proteína, PH, etc. — schema flexible para distintos granos).
- [ ] **Histórico de precios del mismo grano** en gráfico chico (sparkline) — relevante para decidir si la oferta está cara/barata. Podemos reusar el `<Sparkline>` que ya está en `page.tsx` (mover a `/components/effects/`).
- [ ] **Mostrar otras publicaciones del mismo vendedor** abajo, además de las del mismo grano.

### Dashboard resumen (`/dashboard`)
- [x] **Saludo contextual por hora** — "Buenas noches/Buen día/Buenas tardes" + nombre + fecha completa es-AR (sesión 2026-05-05).
- [ ] **Gráfico de actividad** de los últimos 14 días (line chart de intereses recibidos por día).
- [ ] **Notificaciones inline** arriba del checklist cuando hay 1+ intereses pendientes urgentes (ej. > 48 h sin responder).
- [ ] **Streaks / hábitos** — "Llevás 5 días publicando" tipo Duolingo (gamificación liviana, opcional).

### Mis publicaciones (`/dashboard/publicaciones`)
- [x] **Indicador de salud** por publicación: `<HealthDot>` con semáforo good/warn/bad calculado por `getListingHealth()` en `lib/utils.ts` — combina edad + intereses pendientes + chats sin leer + actividad reciente. Aparece en el listado y en el detalle (sesión 2026-05-05).
- [ ] **Vista grilla / tabla** alterna a la lista — toggle.
- [ ] **Bulk actions** — checkbox por fila + "pausar X publicaciones" / "marcar como cerradas".
- [ ] **Ordenar** por más intereses, más viejo, próximo a expirar.
- [ ] **Duplicar publicación** como atajo cuando es zafra repetida.

### Detalle publicación dashboard (`/dashboard/publicaciones/[id]`) — *recién creado*
- [ ] **Tabs** para separar "Intereses / Chats / Q&A / Stats" cuando crezca el contenido.
- [ ] **Gráfico de embudo** vistas → intereses → chats → cerrado.
- [ ] **Acción inline**: responder Q&A pendientes desde acá, no redirigir a la pública.

### Editar publicación (`/dashboard/publicaciones/[id]/editar`)
- [ ] **Pasar de placeholder a form real** (depende de server actions de bloque 1).
- [ ] **Auto-guardado de draft** cada N segundos.
- [ ] **Vista previa** del cambio antes de aplicar (split: form / preview de cómo se va a ver en el marketplace).
- [ ] **Historial de cambios** ("editado hace 2 días: precio 410 → 420 USD").

### Nueva publicación (`/dashboard/publicaciones/nueva`)
- [ ] **Wizard de 3 pasos** en lugar de form único largo: (1) Grano + cantidad, (2) Ubicación + entrega, (3) Precio + descripción.
- [ ] **Estimador de precio sugerido** basado en publicaciones recientes del mismo grano + país.
- [ ] **Validación inline** con mensajes específicos (no genéricos "campo requerido").
- [ ] **Plantillas** — "Volver a usar datos de mi última publicación".
- [ ] **Upload de imágenes con drag-and-drop** + preview.

### Intereses recibidos / enviados
- [ ] **Búsqueda** dentro de la bandeja (por nombre de comprador, ciudad, contenido del mensaje).
- [ ] **Filtros combinados** (estado + grano + país de la contraparte).
- [ ] **Vista agrupada por publicación** como alternativa al listado plano.
- [ ] **Quick reply** desde la card sin entrar al chat.
- [ ] **Plantillas de respuesta** ("Sí, tenemos disponible", "Pasame tu mail" con un click).

### Chats (`/dashboard/chats` y `[id]`)
- [ ] **Búsqueda dentro del hilo** y entre hilos.
- [ ] **Indicador de leído** (✓ / ✓✓) y "escribiendo…".
- [ ] **Adjuntos** — foto del lote, análisis PDF, certificado de origen.
- [ ] **Mensaje de sistema** cuando se cambia el estado del interés ("Vendedor aceptó tu interés").
- [ ] **Pin a mensaje importante** y/o "convertir mensaje en nota".
- [ ] **Resumen del hilo** al inicio: lo que se acordó hasta ahora (puede ser AI-generated más adelante).
- [ ] **Mobile**: composer fijo abajo + lista colapsable estilo WhatsApp.

### Notificaciones (`/dashboard/notificaciones`)
- [ ] **Agrupar por día** ("Hoy", "Ayer", "Esta semana").
- [ ] **Filtros por tipo** (intereses, mensajes, sistema).
- [ ] **Acción inline** en cada notificación (aceptar/rechazar interés sin tener que entrar a la otra página).
- [ ] **Configuración de preferencias** — qué notificar, qué silenciar.

### Búsquedas guardadas (`/dashboard/busquedas`)
- [ ] **Alertas** — "avisame cuando aparezca una nueva publicación que matchee" (email/in-app).
- [ ] **Conteo de coincidencias actuales** por búsqueda guardada.
- [ ] **Renombrar / reordenar** búsquedas.

### Precios (`/precios`)
- [ ] **Sticky header** con grano seleccionado + precio actual + cambio % cuando se hace scroll en el gráfico.
- [ ] **Toggle de monedas inline** (USD / ARS / UYU) más destacado — hoy está en el panel pero pasa desapercibido.
- [ ] **Comparar 2-3 granos** sobre el mismo gráfico (multi-line) en vez de uno por vez.
- [ ] **Anotaciones de eventos** sobre el gráfico ("sequía Pampa húmeda", "guerra Ucrania-Rusia", etc.) — ayuda a leer la curva.
- [ ] **Min / max histórico** marcados en la línea con tooltips.
- [ ] **Indicador "actualizado hace X"** en la cabecera + horario de próxima actualización.
- [ ] **Export CSV / PDF** del rango seleccionado.
- [ ] **Sparklines en color** según tendencia (verde/rojo) y no genéricos.
- [ ] **Drilldown a publicaciones**: click en un grano → "ver ofertas activas de soja" linkea al marketplace filtrado.
- [ ] **Mobile**: la tabla de precios necesita scroll horizontal o cards apiladas; revisar con dev tools.

### Mapa unificado (`/mapa`) — *Antes `/clima` y `/geografia` separados*

> Fase 1 hecha en sesión 2026-05-05: `/mapa` con selector "Ofertas / Clima" (`?layer=ofertas|clima`) que monta el cliente correspondiente (`<GeoClient>` o `<ClimaClient>`). URLs viejas (`/clima`, `/geografia`) hacen redirect 307. Navbar y MobileNav consolidados a una sola entrada "Mapa".

**Fase 2 — refactor del shell compartido** (alta prioridad cuando se vuelva a tocar el mapa):
- [ ] Extraer `<MapShell>` con la geo + zoom + controls + país (AR/UY/...) que ambas capas reusan.
- [ ] `<GeoClient>` y `<ClimaClient>` pasan a ser hijos del shell, recibiendo el contenedor de mapa por props/composition.
- [ ] Eliminar duplicación de `AR_GEO`, `UY_GEO`, lógica de zoom, controles +/-, etc.
- [ ] Ambos componentes pesan ~600-700 líneas hoy; bajar a ~300 cada uno.

**Fase 3 — capa combinada**:
- [ ] Toggle de visibilidad (Ofertas + Clima al mismo tiempo) — choropleth de provincias + dots de ciudades sobre el mismo mapa.
- [ ] Resolver overlap visual: ¿qué pasa al hover en un dot que está sobre una provincia coloreada?
- [ ] Filtros combinados (ej. "soja en zonas con > 100mm de lluvia este mes").

**Geografía / capa Ofertas — pendientes específicos**:
- [ ] **Heatmap por grano** — colorear provincias por intensidad de oferta del grano filtrado.
- [ ] **Lista lateral con resultados** del filtro aplicado (provincias con N publicaciones), sincronizada con hover en el mapa.
- [ ] **Toggle entre AR y UY** más prominente — hoy es un select, podría ser tabs.
- [ ] **Sumar Brasil, Paraguay y Estados Unidos** (tenemos publicaciones de esos países en mock).
- [ ] **Click en marcador → drawer** con preview de la publicación (no solo tooltip).
- [ ] **Persistir zoom y filtros** en URL para compartir vistas.
- [ ] **Leyenda visible** del color/tamaño de los marcadores.
- [ ] **Botón "Reset vista"** además de los +/−.
- [ ] **Mobile**: hoy el mapa puede ser difícil de manipular en touch; evaluar gestos pinch-zoom o un fallback.
- [ ] **Atribución del GeoJSON** y/o Natural Earth en el footer del mapa.

**Clima — pendientes específicos**:
- [ ] **Pronóstico extendido** a 14 días (hoy 7).
- [ ] **Integración con APIs reales** (Open-Meteo, NASA POWER) — hoy son datos generados.
- [ ] **Fix `weather-data.ts:116`**: `"Río Negro"` duplicado AR/UY — namespacearlo.

### Mi perfil (`/dashboard/perfil`)
- [ ] **Upload de logo / avatar** (Supabase Storage).
- [ ] **Preview en vivo** de cómo se ve el perfil público mientras se edita.
- [ ] **Progreso de completitud** ("Tu perfil está 70% completo — sumá X para verificarte").
- [ ] **Validación de teléfono** vía SMS o WhatsApp.

### Perfil público (`/u/[id]`)
- [ ] **Botón "Contactar"** directo (depende de auth + chats).
- [ ] **Tab de reseñas** cuando exista el sistema.
- [ ] **Cover image** custom (no solo el gradiente).
- [ ] **Compartir perfil** (link directo + WhatsApp share).

### Auth (`/login`, `/register`)
- [ ] **OAuth con Google / Apple** además de email.
- [ ] **Magic link** (passwordless) como opción.
- [ ] **Indicador de fortaleza de password** en register.
- [ ] **Recuperar contraseña** flow completo.
- [ ] **Lado izquierdo editorial** con foto de campo + frase de marca en register/login (split-screen estilo Notion/Linear), no el form solo y centrado en cremita.
- [ ] **"Continuar como invitado"** para explorar el marketplace sin registrarse (con CTA para registrarse cuando quieran enviar interés).
- [ ] **Validación inline en email** (formato + dominio existente) antes del submit.
- [ ] **Detección de país** por geo-IP para preseleccionar bandera/teléfono.

### Legales (`/ayuda`, `/contacto`, `/blog`, `/terminos`, `/privacidad`)
- [ ] **TOC sticky** en docs largos.
- [ ] **Anchor links copy-on-hover** en cada heading.
- [ ] **Estimador de tiempo de lectura** en blog.
- [ ] **Última actualización visible** en términos / privacidad.
- [ ] **Búsqueda en /ayuda** con autocompletar artículos.
- [ ] **/ayuda con categorías visuales** (Empezar, Publicar, Operar, Cuenta, Pagos…) en grid de cards.
- [ ] **/contacto con WhatsApp directo** además del form (botón con QR + link `wa.me`).
- [ ] **/blog**: portada editorial con post destacado grande + grilla de posts; tags por tema.
- [ ] **404** custom con ilustración de grano + sugerencias ("¿buscabas X? probá Y").

### Onboarding / primer login
- [ ] **Pasos del Onboarding** ya existe pero hoy son 3 pantallas genéricas; rehacerlas con mock real del producto.
- [ ] **Persistir progreso** del onboarding en `localStorage` (hoy se cierra y vuelve a aparecer).
- [ ] **Tour interactivo** post-onboarding señalando "publicar oferta", "intereses", "chats" en la UI real (popovers con Tippy/Floating UI).
- [ ] **Skip opt-in** para quien ya conoce el producto.

### Globales / sistema de diseño
- [x] **Toasts** — `<Toaster>` de `sonner` montado en root layout (commit `978bf8c`).
- [x] **Selector de moneda global** persistente en navbar (USD / ARS / BRL / UYU / EUR) — `<CurrencySelector>` + `<CurrencyProvider>`. Afecta listing detail, calculator, etc.
- [x] **Navbar refresh** (sesión 2026-05-05) — dropdown "Más ▾", scroll-aware shadow + blur, search compacto con placeholder específico, "Ingresar" como text link, jerarquía de CTAs. MobileNav agrupado en secciones (Producto / Más / Cuenta).
- [ ] **Dark mode** — el design system ya tiene neutros cálidos; sería natural extenderlo.
- [ ] **Loading states unificados** — spinner / skeleton consistente entre rutas.
- [ ] **Estados de error** decentes — hoy `not-found` está pero no hay `error.tsx` por ruta.
- [ ] **Accesibilidad pass** — focus visible, aria-labels, contraste, navegación por teclado en menús/drawers.
- [ ] **Internacionalización (i18n)** — hoy todo en español; preparar para PT-BR (Brasil), EN (US/UA/AU) dado el alcance global del marketplace.
- [ ] **Animaciones de transición entre rutas** (fade/slide leve con Next 15 view transitions).
- [ ] **Imágenes optimizadas** — auditar `<img>` directos vs `<Image>` de Next; los hero usan `<img>` con `aria-hidden`.
- [ ] **Empty states con personalidad** — ilustraciones de grano/campo en vez de solo texto.
- [ ] **Mobile UX pass** — hay `MobileNav` y bottom CTAs en detalle; revisar dashboard sidebar (hoy se apila arriba sin el menú collapsable).
- [ ] **Selector de unidad** (toneladas / bushels) — relevante para la audiencia US/global.
- [ ] **Selector de idioma** preparado para i18n (es / pt / en) en navbar/footer.
- [ ] **Modal share / link copy** unificado (hoy no hay; se va a necesitar para perfiles, publicaciones, búsquedas).
- [ ] **Confirmación destructiva** estandarizada (ej. "¿Eliminar publicación?") con un único componente Dialog.
- [ ] **Banner de cookies / consentimiento** — necesario para EU + buena práctica.
- [ ] **Print styles** decentes en publicaciones y perfil — los compradores van a imprimir o PDF para mostrar al equipo.
- [ ] **Favicon + OG images** custom por sección (hoy hay genérico).
- [ ] **Prefetch / hover-prefetch** en navbar y cards para que la navegación se sienta instantánea.
- [ ] **Reduced motion** ya respetado en globals.css; auditar componentes nuevos.

### Performance & SEO
- [ ] **Server components donde corresponda** — hoy hay client components para cosas que podrían ser RSC (SavedSearches, NotificationsBell). Revisar bundle.
- [ ] **next/image en lugar de `<img>`** para fotos de granos del hero, marketplace cards, perfiles.
- [ ] **Lazy-load** mapa de geografía y gráficos de precios — hoy se cargan junto a la página (`react-simple-maps` pesa).
- [ ] **Sitemap.xml** y robots.txt.
- [ ] **JSON-LD structured data** en publicaciones (Product schema) y perfiles (Organization schema) para SEO.
- [ ] **Open Graph dinámico** por publicación con imagen del grano.
- [ ] **RSS** del blog y de "nuevas ofertas por grano/país" (para integradores).
- [ ] **Métricas de Core Web Vitals** — instrumentar Vercel Analytics o equivalente.

---

## Notas

- Este archivo es **vivo**. Cuando algo se complete, marcalo `[x]` y dejá la línea — no la borres. Si la decisión detrás de hacerlo / no hacerlo fue importante, escribila en `decisiones.md` con la fecha.
- Si una idea nueva entra y no encaja en ningún bloque, agregala al final con título "Sin clasificar" — la próxima vez que se ordene el doc se reubica.
- El orden dentro de cada bloque es prioridad relativa (las primeras son las que más mueven la aguja para ese tema), no fecha.
