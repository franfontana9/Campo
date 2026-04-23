# Schema de base de datos — Campo

## Tablas

### `profiles`
Extiende `auth.users`. Se crea automáticamente vía trigger al registrarse.

| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | = auth.users.id |
| full_name | text | razón social o nombre |
| phone | text | |
| province | text | provincia AR |
| city | text | |
| user_type | enum | 'seller' \| 'buyer' \| 'both' |
| role | enum | 'user' \| 'admin' (default 'user') |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | |

### `listings` — publicaciones de oferta
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| user_id | uuid FK profiles | ON DELETE CASCADE |
| grain_type | enum | 'soja' \| 'maiz' \| 'trigo' \| 'girasol' \| 'sorgo' \| 'cebada' \| 'avena' \| 'arroz' |
| tonnage | numeric(12,2) | > 0 |
| province | text | |
| city | text | |
| price | numeric(14,2) | nullable si price_mode='to_agree' |
| currency | enum | 'ARS' \| 'USD' |
| price_mode | enum | 'fixed' \| 'to_agree' |
| delivery_date | date | |
| description | text | |
| status | enum | 'active' \| 'negotiating' \| 'closed' \| 'inactive' (default 'active') |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### `interests` — expresiones de interés
| Campo | Tipo | Notas |
|-------|------|-------|
| id | uuid PK | |
| listing_id | uuid FK listings | ON DELETE CASCADE |
| buyer_id | uuid FK profiles | quien muestra interés |
| message | text | mensaje inicial |
| status | enum | 'pending' \| 'accepted' \| 'declined' (default 'pending') |
| created_at | timestamptz | |
| UNIQUE (listing_id, buyer_id) | | un interés por usuario por publicación |

## RLS (row-level security)

### profiles
- SELECT: propio o cualquier autenticado puede ver `full_name, province, city, user_type` (se expone un sólo campo público vía view o se expone la tabla en modo lectura limitada por policy).
- UPDATE: sólo el dueño (`auth.uid() = id`).
- INSERT: trigger de Supabase al crear usuario.
- Admin: bypass con policy específica `WHERE role = 'admin'`.

### listings
- SELECT público: `status = 'active'` (sin login).
- SELECT propio: dueño ve todas sus publicaciones sin importar status.
- INSERT: autenticado, `auth.uid() = user_id`.
- UPDATE/DELETE: sólo dueño o admin.

### interests
- SELECT: el comprador (buyer_id) o el dueño de la publicación.
- INSERT: autenticado, `auth.uid() = buyer_id`, no permitido si el listing es suyo.
- UPDATE: dueño del listing puede cambiar status; buyer no puede editar su mensaje.
- Admin: bypass.

## Triggers
- `handle_new_user()` en `auth.users` AFTER INSERT → inserta fila vacía en `profiles` con los metadatos del signup.
- `set_updated_at()` en `profiles` y `listings` BEFORE UPDATE.

## Índices
- `listings(grain_type, status)`
- `listings(province, status)`
- `listings(created_at DESC)`
- `interests(listing_id)`
- `interests(buyer_id)`
