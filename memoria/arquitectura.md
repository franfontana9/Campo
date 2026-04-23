# Arquitectura — Campo MVP

## Stack

| Capa | Tecnología | Racional |
|------|-----------|----------|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript | Server components, streaming, simple deploy. |
| Estilos | Tailwind CSS v4 | Velocidad, estética consistente sin CSS custom. |
| DB + Auth + Storage | Supabase (Postgres + RLS) | Una sola plataforma, sesión SSR, row-level security. |
| Validación | Zod | Esquemas compartidos entre client y server. |
| Deploy | Vercel (frontend) + Supabase Cloud (backend) | Deploy trivial. |
| Icons | lucide-react | Minimal y consistente. |

## Principios

1. **RLS-first**: la autorización vive en la DB. Las páginas consumen Supabase directamente con la sesión del usuario; no hay capa de API innecesaria.
2. **Server Components por defecto**: sólo convertimos a client component cuando hay interacción (formularios, filtros con estado).
3. **Formularios con Server Actions**: evita endpoints separados para operaciones CRUD.
4. **Mock data al principio, datos reales después**: la primera iteración del marketplace usa datos mock para mostrar la UI lista; luego se reemplaza por queries a Supabase sin cambiar la UI.
5. **No sobreingeniería**: no hay state manager global, no hay microservicios, no hay capa de repositorios. Funciones helper en `lib/` alcanzan.

## Layout de carpetas

```
Campo/
├── memoria/                      # docs del proyecto (esta carpeta)
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── marketplace/
│   │   │   └── [id]/
│   │   ├── dashboard/
│   │   │   ├── publicaciones/
│   │   │   │   ├── nueva/
│   │   │   │   └── [id]/editar/
│   │   │   ├── intereses-recibidos/
│   │   │   └── intereses-enviados/
│   │   ├── admin/
│   │   │   ├── usuarios/
│   │   │   ├── publicaciones/
│   │   │   └── intereses/
│   │   ├── auth/callback/        # OAuth / confirm email
│   │   ├── layout.tsx
│   │   ├── page.tsx              # landing
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                   # primitivos: Button, Input, etc.
│   │   ├── listings/             # cards, filters
│   │   └── layout/               # Nav, Footer
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # browser client
│   │   │   ├── server.ts         # server client (cookies)
│   │   │   └── middleware.ts     # refresh de sesión
│   │   ├── validation/           # zod schemas
│   │   ├── constants.ts          # grains, provinces, enums
│   │   ├── types.ts              # tipos de DB
│   │   └── utils.ts              # cn(), format helpers
│   └── middleware.ts
└── supabase/
    └── migrations/
        └── 0001_initial_schema.sql
```

## Autenticación y sesión

- Supabase Auth con email + password.
- Cookie de sesión manejada por `@supabase/ssr`.
- Middleware de Next refresca la cookie en cada request.
- El rol admin se almacena en `profiles.role` (enum) y se chequea server-side.

## Secrets
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo server, sólo para tareas admin que necesiten bypass RLS — por ahora no se usa).
