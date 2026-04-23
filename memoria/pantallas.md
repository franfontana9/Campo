# Pantallas del MVP — Campo

## Públicas
| Ruta | Descripción |
|------|-------------|
| `/` | Landing: propuesta de valor, CTA a registro y al marketplace. |
| `/marketplace` | Listado de publicaciones activas con filtros (grano, provincia, rango ton, modalidad) y ordenamiento. |
| `/marketplace/[id]` | Detalle de una publicación + botón "Me interesa" (si está logueado). |
| `/login` | Login. |
| `/register` | Registro con tipo de usuario y datos mínimos. |

## Privadas (requieren sesión)
| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Resumen: publicaciones activas, intereses recibidos sin leer, intereses enviados. |
| `/dashboard/publicaciones` | Lista de publicaciones propias (todos los estados). |
| `/dashboard/publicaciones/nueva` | Formulario de creación. |
| `/dashboard/publicaciones/[id]/editar` | Edición + cambio de estado + eliminar. |
| `/dashboard/intereses-recibidos` | Intereses sobre mis publicaciones. |
| `/dashboard/intereses-enviados` | Intereses que mandé a publicaciones de otros. |

## Admin (requieren `role='admin'`)
| Ruta | Descripción |
|------|-------------|
| `/admin` | Métricas básicas (conteos). |
| `/admin/usuarios` | Lista de usuarios. |
| `/admin/publicaciones` | Lista completa, permite desactivar. |
| `/admin/intereses` | Lista completa. |

## User flows clave

### F1 — Publicar oferta
`/register` → `/dashboard` → `/dashboard/publicaciones/nueva` → `/dashboard/publicaciones` (publicación activa visible en marketplace).

### F2 — Explorar y mostrar interés
`/marketplace` → filtros → click card → `/marketplace/[id]` → "Me interesa" + mensaje → aparece en `/dashboard/intereses-enviados` del buyer y en `/dashboard/intereses-recibidos` del seller.

### F3 — Gestionar publicación
`/dashboard/publicaciones` → editar → cambiar estado a "en negociación" o "cerrada" → desaparece de marketplace público.

### F4 — Moderación admin
`/admin/publicaciones` → desactivar publicación reportada → quitada del marketplace.
