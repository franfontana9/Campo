# Registro de decisiones

Se registran decisiones técnicas o de producto no triviales, con fecha y racional.

## 2026-04-22 — Stack base
**Decisión:** Next.js 15 (App Router) + TypeScript + Tailwind v4 + Supabase.
**Racional:** Stack moderno, deploy trivial en Vercel, Auth + DB + RLS en una sola plataforma, server components reducen JS del cliente, escala bien a mediano plazo.

## 2026-04-22 — RLS-first, sin capa de API
**Decisión:** Las páginas server-side consultan Supabase directamente con la sesión del usuario. No se crea una capa de API REST intermedia.
**Racional:** RLS impone la autorización en DB. Agregar API routes sería duplicar reglas y sumar latencia. Si en el futuro un cliente externo necesita la API, se expone.

## 2026-04-22 — Mock data en scaffolding inicial
**Decisión:** El primer build usa datos mock en `/marketplace`.
**Racional:** Permite ver la UI funcional antes de conectar Supabase. Se reemplaza por queries reales en Sprint 1 sin cambiar la UI.

## 2026-04-22 — Granos iniciales: soja, maíz, trigo
**Decisión:** Enum cerrado `grain_type`.
**Racional:** Simplifica filtros y validación. Agregar girasol/sorgo más adelante es una migración trivial.

## 2026-04-22 — Ampliación del catálogo de granos (8 cultivos)
**Decisión:** Se amplía `grain_type_enum` a: soja, maíz, trigo, girasol, sorgo, cebada, avena, arroz.
**Racional:** El MVP se posiciona como marketplace global de granos, no sólo oleaginosas y trigo. 5 cultivos adicionales cubren mercados grandes (cebada cervecera, arroz en Brasil/India, girasol en AR/RU, sorgo como forraje). Fácil de extender más adelante.

## 2026-04-22 — Imágenes servidas localmente desde `public/images/grains/`
**Decisión:** Las fotos de las publicaciones mock (y las por defecto en producción si no hay upload) viven en `/public/images/grains/` dentro del repo, servidas como estáticos por Next. Fuente: Pexels (licencia libre).
**Racional:** Se probó primero Unsplash via hot-link y resultó poco confiable — varios IDs de foto fueron reasignados por Unsplash y devolvían imágenes distintas (emojis 3D, verduras). Local es inmune a esto, carga más rápido y no depende de un CDN externo. Cuando haya upload de usuario real, esas imágenes van a Supabase Storage.

## 2026-04-22 — Modalidad de precio fija o "a convenir"
**Decisión:** Enum `price_mode` + `price` nullable.
**Racional:** Refleja cómo funciona el mercado real — muchas operaciones se cierran por fuera.

## 2026-04-22 — Rol admin vía `profiles.role`
**Decisión:** No usar un claim custom en JWT; se consulta `profiles.role` server-side.
**Racional:** Simpler, no hay que tocar hooks de Supabase Auth. El costo de una query extra es mínimo.
