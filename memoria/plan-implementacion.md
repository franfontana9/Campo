# Plan de implementación — Campo

## Sprint 0 — Scaffolding (sesión actual)
- [x] Carpeta `memoria/` con docs
- [x] Proyecto Next.js + TypeScript + Tailwind v4
- [x] Supabase clients (browser + server + middleware)
- [x] Migración SQL inicial con tablas, enums, RLS, triggers
- [x] UI primitives (Button, Input, Select, Card, Badge, Textarea)
- [x] Layout global + Navbar
- [x] Landing `/`
- [x] Marketplace `/marketplace` con mock data + filtros UI
- [x] Detalle `/marketplace/[id]`
- [x] Páginas `/login` y `/register`
- [x] Shell `/dashboard`

## Sprint 1 — Conexión real a Supabase
- [ ] Configurar proyecto Supabase + ejecutar migración
- [ ] Auth real (signup, login, logout, callback de confirmación)
- [ ] Trigger `handle_new_user` que crea `profiles` con metadata
- [ ] Marketplace leyendo `listings` reales
- [ ] Detalle leyendo real
- [ ] Filtros funcionales server-side

## Sprint 2 — CRUD publicaciones
- [ ] Crear publicación (server action)
- [ ] Editar publicación
- [ ] Cambiar estado
- [ ] Eliminar publicación
- [ ] Listado `/dashboard/publicaciones`

## Sprint 3 — Intereses
- [ ] Crear interés desde detalle
- [ ] `/dashboard/intereses-recibidos`
- [ ] `/dashboard/intereses-enviados`
- [ ] Cambio de estado (accept/decline)
- [ ] Contador de no leídos (opcional)

## Sprint 4 — Admin + pulido
- [ ] `/admin` con métricas
- [ ] `/admin/usuarios`, `/admin/publicaciones`, `/admin/intereses`
- [ ] Desactivar publicaciones
- [ ] Estados vacíos, loading, errores
- [ ] Responsive fino (mobile)
- [ ] SEO básico (metadata, robots)

## Sprint 5 — Deploy
- [ ] Proyecto en Vercel
- [ ] Variables de entorno
- [ ] Seed data demo
- [ ] Dominio
- [ ] README con instrucciones

## Post-MVP (backlog, no ahora)
- Email transaccional (confirmación, nuevo interés)
- Upload de fotos de la mercadería (Supabase Storage)
- Notificaciones in-app
- Chat básico por publicación
- Favoritos / guardar búsqueda
- Verificación de identidad (CUIT)
- Reputación
