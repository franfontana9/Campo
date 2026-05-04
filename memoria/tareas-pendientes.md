# Tareas pendientes — Campo

Backlog vivo de features y mejoras del producto. Se organiza por bloque y prioridad relativa, no por fecha. Cuando algo se completa, se marca con `[x]` y se mueve a `decisiones.md` si la decisión fue no-trivial.

---

## 1. Crítico para que el MVP "funcione"

Sin esto los flujos del producto no cierran.

- [ ] **Auth real con Supabase** — signup, login, logout, callback de email.
- [ ] **Server actions CRUD de publicaciones** — crear, editar, cambiar estado, eliminar.
- [ ] **Reemplazar `MOCK_LISTINGS`** por queries reales con filtros server-side.
- [ ] **Sistema de intereses end-to-end** — `/dashboard/intereses-recibidos`, `/intereses-enviados`, cambio de estado por el vendedor.
- [ ] **Perfil editable** — el usuario tiene que poder actualizar su info post-signup.
- [ ] **Cuenta de prueba / demo** — usuario `demo@campo.test` con publicaciones e intereses precargados, para showcasing y QA.

---

## 2. Confianza y reputación

Lo que hace que el otro lado se anime a operar.

- [ ] **Perfiles públicos del usuario** (`/u/[handle]` o `/empresa/[id]`):
  - razón social + logo (cuando exista upload)
  - ubicación
  - a qué se dedica (productor / acopio / cooperativa / corredor / exportador / molino / fábrica de balanceado)
  - antigüedad en Campo
  - listado de publicaciones activas + cerradas
  - resumen de actividad (operaciones cerradas, tiempo de respuesta)
- [ ] **Verificación de cuenta** — niveles:
  - Email verificado (automático)
  - Empresa verificada (CUIT / CNPJ / Tax ID + revisión manual)
  - "Verified seller" con histórico de operaciones cerradas
- [ ] **Comentarios / reseñas post-operación** — sólo entre partes que efectivamente cerraron una operación (evita spam/manipulación).
- [ ] **Reportar publicación / usuario** — botón discreto en detalle + perfil, va a admin moderation.

---

## 3. Comunicación

Pasar del "Me interesa" estático a una conversación real.

- [ ] **Chat por publicación** — cuando hay un interés enviado o recibido, abre un hilo persistente entre las partes. Estados: pendiente, en conversación, cerrada, rechazada.
- [ ] **Menu de chats activos** en el navbar (junto a notificaciones) — listado de hilos con contador de no leídos.
- [ ] **Notificaciones in-app** — campana en el navbar:
  - Nuevo interés recibido en mi publicación
  - Respuesta en un chat
  - Cambio de estado de mi interés
  - Publicación a punto de expirar
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

- [ ] **Dashboard de tendencias** (público o para usuarios logueados):
  - Precio promedio por grano / país / mes
  - Volumen ofertado vs. demandado
  - Países más activos
  - "Donde se concentra hoy el mercado"
- [ ] **Análisis de clima en el dashboard** — overlay con datos meteorológicos por región del usuario:
  - Pronóstico próximos 14 días
  - Acumulado de lluvia
  - Alertas (sequía, helada, exceso hídrico)
  - Integración con APIs como Open-Meteo, NASA POWER o similares.
- [ ] **Estacionalidad / qué se vende en cada época**:
  - Calendario por hemisferio (siembra / cosecha por grano y país)
  - "En esta época suele moverse más X"
  - Filtro en marketplace: "ofertas típicas de esta estación"

---

## 6. Productos nuevos (post-validación del marketplace base)

### Campo Crédito
- [ ] **Adelantar pago** — el comprador adelanta plata contra una operación cerrada, recibe descuento (yield para él, liquidez para el vendedor).
- [ ] **Atrasar pago** — el vendedor cobra después, recibe rendimiento (interés a su favor).
- [ ] **Ranking crediticio** — score interno basado en:
  - Historial de cumplimiento
  - Antigüedad
  - Volumen operado
  - Verificación
  - Reseñas
- [ ] Modelar como producto financiero independiente. Probablemente requiere alianza con financiera/banco.

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

- [ ] **Panel de Ayuda / Soporte** — `/ayuda`:
  - Centro de ayuda con artículos por tema (publicar, cobrar, verificar, etc.)
  - FAQ ampliada (la actual tiene 6 entradas en landing — escalar a 30+ acá)
  - Búsqueda
- [ ] **Contacto** — formulario simple + email/WhatsApp para casos no resueltos por la ayuda.
- [ ] **Onboarding del primer login** — mini tutorial de 3 pantallas la primera vez.
- [ ] **Tips contextuales** — micro-help en formularios densos (nueva publicación).

---

## 8. Operativa / DX interna

- [ ] **Cuenta de prueba (`demo@campo.test`)** con seed completo: perfil verificado, 3 publicaciones, 2 intereses recibidos, 1 enviado.
- [ ] **Seed script** para poblar Supabase con datos plausibles (`scripts/seed.ts`).
- [ ] **Scripts de migración** si el schema evoluciona.
- [ ] **CI/CD básico** en GitHub Actions: lint + typecheck + build en PRs.
- [ ] **Branch protection** en `main`.

---

## Notas

- Este archivo es **vivo**. Cuando algo se complete, marcalo `[x]` y dejá la línea — no la borres. Si la decisión detrás de hacerlo / no hacerlo fue importante, escribila en `decisiones.md` con la fecha.
- Si una idea nueva entra y no encaja en ningún bloque, agregala al final con título "Sin clasificar" — la próxima vez que se ordene el doc se reubica.
- El orden dentro de cada bloque es prioridad relativa (las primeras son las que más mueven la aguja para ese tema), no fecha.
