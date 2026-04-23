-- ============================================================
-- Campo — schema inicial (alcance global)
-- ============================================================

-- Enums
create type user_type_enum  as enum ('seller', 'buyer', 'both');
create type user_role_enum  as enum ('user', 'admin');
create type grain_type_enum as enum ('soja', 'maiz', 'trigo', 'girasol', 'sorgo', 'cebada', 'avena', 'arroz');
create type currency_enum   as enum ('USD', 'EUR', 'ARS', 'BRL');
create type price_mode_enum as enum ('fixed', 'to_agree');
create type listing_status_enum as enum ('active', 'negotiating', 'closed', 'inactive');
create type interest_status_enum as enum ('pending', 'accepted', 'declined');

-- ============================================================
-- profiles
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  country text not null default '',    -- ISO code (AR, BR, US, ...) o 'OTHER'
  region text not null default '',     -- provincia / estado / región libre
  city text not null default '',
  user_type user_type_enum not null default 'both',
  role user_role_enum not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger que crea perfil al registrarse
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, country, region, city, user_type)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'country', ''),
    coalesce(new.raw_user_meta_data->>'region', ''),
    coalesce(new.raw_user_meta_data->>'city', ''),
    coalesce((new.raw_user_meta_data->>'user_type')::user_type_enum, 'both')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- ============================================================
-- listings
-- ============================================================
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  grain_type grain_type_enum not null,
  tonnage numeric(12,2) not null check (tonnage > 0),
  country text not null,
  region text not null,
  city text not null,
  price numeric(14,2),
  currency currency_enum not null default 'USD',
  price_mode price_mode_enum not null default 'fixed',
  delivery_date date not null,
  description text not null default '',
  image_url text,
  status listing_status_enum not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (price_mode = 'fixed'    and price is not null) or
    (price_mode = 'to_agree' and price is null)
  )
);

create index listings_grain_status_idx on public.listings(grain_type, status);
create index listings_country_status_idx on public.listings(country, status);
create index listings_created_at_idx on public.listings(created_at desc);

create trigger listings_set_updated_at
before update on public.listings
for each row execute function public.set_updated_at();

-- ============================================================
-- interests
-- ============================================================
create table public.interests (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  message text not null default '',
  status interest_status_enum not null default 'pending',
  created_at timestamptz not null default now(),
  unique (listing_id, buyer_id)
);

create index interests_listing_idx on public.interests(listing_id);
create index interests_buyer_idx on public.interests(buyer_id);

-- ============================================================
-- RLS
-- ============================================================
alter table public.profiles  enable row level security;
alter table public.listings  enable row level security;
alter table public.interests enable row level security;

-- helper: ¿es admin?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- profiles: cada uno ve/edita el suyo; admin ve todos; lectura pública básica para mostrar vendedor
create policy profiles_select_public_basic on public.profiles
  for select using (true);

create policy profiles_update_self on public.profiles
  for update using (auth.uid() = id);

-- listings: lectura pública de activas; dueño ve todas las suyas; admin ve todas
create policy listings_select_active_public on public.listings
  for select using (status = 'active' or auth.uid() = user_id or public.is_admin());

create policy listings_insert_own on public.listings
  for insert with check (auth.uid() = user_id);

create policy listings_update_own_or_admin on public.listings
  for update using (auth.uid() = user_id or public.is_admin());

create policy listings_delete_own_or_admin on public.listings
  for delete using (auth.uid() = user_id or public.is_admin());

-- interests: ve el comprador o el dueño del listing; admin todo
create policy interests_select_involved on public.interests
  for select using (
    auth.uid() = buyer_id
    or auth.uid() = (select user_id from public.listings l where l.id = listing_id)
    or public.is_admin()
  );

create policy interests_insert_buyer on public.interests
  for insert with check (
    auth.uid() = buyer_id
    and auth.uid() <> (select user_id from public.listings l where l.id = listing_id)
  );

-- Sólo el dueño del listing puede cambiar el status
create policy interests_update_listing_owner on public.interests
  for update using (
    auth.uid() = (select user_id from public.listings l where l.id = listing_id)
    or public.is_admin()
  );

create policy interests_delete_buyer_or_admin on public.interests
  for delete using (auth.uid() = buyer_id or public.is_admin());
