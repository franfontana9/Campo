# Campo — Marketplace global de granos

MVP B2B para conectar vendedores y compradores de granos físicos. Publicás tu oferta, explorás por grano/país/volumen, expresás interés y cerrás por fuera. Sin corredores, sin comisiones.

**Granos soportados:** soja, maíz, trigo, girasol, sorgo, cebada, avena, arroz.
**Alcance:** global (AR, BR, UY, PY, US, CA, UA, FR, RU, IN, AU, entre otros).

## Stack

- **Next.js 15** (App Router) + **React 19** + TypeScript (strict)
- **Tailwind CSS v4**
- **Supabase** (Auth + Postgres + RLS) vía `@supabase/ssr`
- **Zod** para validación (schemas por implementar)
- **Turbopack** en dev
- Tipografías: **Fraunces** (display) + **Inter Tight** (body) via `next/font`

## Puesta en marcha

```bash
npm install
cp .env.local.example .env.local   # completar variables si querés conectar Supabase
npm run dev                         # levanta en http://localhost:3001 con Turbopack
```

> El marketplace usa **datos mock** (16 publicaciones) hasta que se conecte Supabase. La migración inicial está en [`supabase/migrations/0001_initial_schema.sql`](./supabase/migrations/0001_initial_schema.sql).

### Variables de entorno

```
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=   # opcional, sólo server, sólo para tareas admin
```

## Estructura

```
src/
├── app/
│   ├── (auth)/             # /login, /register (UI)
│   ├── admin/              # placeholders
│   ├── auth/callback/      # para OAuth / confirm email (pendiente)
│   ├── dashboard/          # resumen + /publicaciones/nueva
│   ├── marketplace/        # listado + [id] (detalle)
│   ├── globals.css         # tema + utilidades
│   ├── layout.tsx
│   └── page.tsx            # landing
├── components/
│   ├── layout/             # Navbar, Footer
│   ├── listings/           # ListingCard, ListingFilters, GrainVisual
│   └── ui/                 # Button, Input, Select, Badge, ...
├── lib/
│   ├── supabase/           # browser + server + middleware clients
│   ├── constants.ts        # GRAIN_TYPES, COUNTRIES, enums
│   ├── mock-data.ts        # 16 publicaciones + helpers
│   ├── types.ts
│   └── utils.ts
└── middleware.ts
supabase/migrations/         # SQL inicial
memoria/                     # docs del proyecto (product, schema, decisiones, etc.)
public/images/grains/        # 16 fotos agro (Pexels, uso libre)
```

## Páginas

| Ruta | Estado |
|------|--------|
| `/` | ✅ Landing con hero editorial, destacados, trust strip, CTA |
| `/marketplace` | ✅ Listado con filtros (grano, país, toneladas, modalidad) + búsqueda global `?q=` |
| `/marketplace/[id]` | ✅ Detalle con "buy box" tipo Amazon |
| `/login`, `/register` | ⚠️ UI lista, falta submit real |
| `/dashboard` | ⚠️ Shell con stats placeholders |
| `/dashboard/publicaciones/nueva` | ⚠️ Form listo, falta server action |
| `/admin/*`, `/auth/callback` | ❌ Placeholders |

## Lo que falta del MVP

### Crítico
- [ ] Auth real con Supabase (signup, login, logout, callback)
- [ ] Server actions CRUD de publicaciones
- [ ] Listado "Mis publicaciones" + edición + cambio de estado
- [ ] Sistema de intereses (crear, bandejas in/out, cambio de estado)
- [ ] Reemplazar `MOCK_LISTINGS` por queries reales a Supabase
- [ ] Perfil editable

### Importante
- [ ] Admin panel (métricas + moderación)
- [ ] Upload de fotos (Supabase Storage)
- [ ] Validación con Zod (client + server)
- [ ] Mobile menu (drawer)
- [ ] Página 404 custom y estados vacíos
- [ ] Paginación / infinite scroll
- [ ] Email transaccional (confirmación, nuevo interés)

### Backlog
Favoritos, verificación CUIT/tax ID, notificaciones in-app, chat por publicación, mapa, sitemap/SEO, i18n.

## Documentación

Toda la info clave vive en [`memoria/`](./memoria/):

- [`product-definition.md`](./memoria/product-definition.md) — problema, propuesta, alcance
- [`arquitectura.md`](./memoria/arquitectura.md) — stack y patrones
- [`schema-db.md`](./memoria/schema-db.md) — tablas, RLS, triggers
- [`pantallas.md`](./memoria/pantallas.md) — rutas y flujos
- [`plan-implementacion.md`](./memoria/plan-implementacion.md) — sprints
- [`design-patterns.md`](./memoria/design-patterns.md) — referencias UX (Zillow, ML, Amazon…)
- [`decisiones.md`](./memoria/decisiones.md) — registro de decisiones
