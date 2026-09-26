create extension if not exists "pgcrypto";

create type public.product_category as enum (
  'Robes',
  'Ensembles',
  'Hauts',
  'Pantalons',
  'Accessoires'
);

create type public.order_status as enum (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'completed',
  'cancelled'
);

create type public.reservation_status as enum (
  'pending',
  'confirmed',
  'expired',
  'cancelled'
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  price numeric(10,2) not null check (price >= 0),
  category public.product_category not null,
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors jsonb not null default '[]'::jsonb,
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  is_new boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  guest_name text,
  guest_phone text,
  guest_email text,
  shipping_address jsonb not null default '{}'::jsonb,
  total numeric(10,2) not null check (total >= 0),
  status public.order_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_price numeric(10,2) not null check (product_price >= 0),
  quantity integer not null check (quantity > 0),
  size text,
  color text,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  size text,
  color text,
  notes text,
  status public.reservation_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reservations enable row level security;

create policy "Public products are viewable by everyone"
  on public.products
  for select
  using (true);

create policy "Authenticated users can manage products"
  on public.products
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Users can view their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can create their own orders"
  on public.orders
  for insert
  with check (auth.uid() = user_id or user_id is null);

create policy "Users can view their own orders"
  on public.orders
  for select
  using (auth.uid() = user_id or user_id is null);

create policy "Users can manage their own order items"
  on public.order_items
  for all
  using (
    exists (
      select 1
      from public.orders o
      where o.id = order_id
        and (o.user_id = auth.uid() or o.user_id is null)
    )
  );

create policy "Anyone can create a reservation"
  on public.reservations
  for insert
  with check (true);

create policy "Authenticated users can manage reservations"
  on public.reservations
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_featured on public.products(featured);
create index if not exists idx_products_new on public.products(is_new);
create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_reservations_product_id on public.reservations(product_id);
