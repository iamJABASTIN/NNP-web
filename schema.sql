-- ============================================================
-- SMART RESTAURANT MANAGEMENT SYSTEM — SUPABASE SCHEMA
-- ============================================================
-- Sections:
--   1. Enums
--   2. Core tables
--   3. Ordering & sessions
--   4. Billing & feedback
--   5. Staff & inventory
--   6. Triggers
--   7. Indexes
--   8. Row Level Security (RLS)
--   9. Admin dashboard views
-- ============================================================
-- 1. ENUMS
-- ============================================================
create type user_role as enum (
  'customer',
  'admin',
  'waiter',
  'cook',
  'supplier'
);
create type veg_type as enum (
  'veg',       -- green dot
  'non_veg',   -- red dot
  'egg'        -- yellow dot
);
create type table_status as enum (
  'available',
  'occupied',
  'reserved',
  'cleaning'
);
create type session_status as enum (
  'active',
  'billed',
  'closed'
);
create type order_status as enum (
  'pending',      -- placed, not yet seen by kitchen
  'confirmed',    -- kitchen acknowledged
  'preparing',    -- chef is working on it
  'ready',        -- food is ready for pickup
  'served',       -- waiter delivered to table
  'cancelled'
);
create type order_item_status as enum (
  'pending',
  'preparing',
  'ready',
  'served',
  'cancelled'
);
create type payment_status as enum (
  'unpaid',
  'pending',    -- payment initiated
  'paid',
  'failed',
  'refunded'
);
create type payment_method as enum (
  'upi',
  'card',
  'cash',
  'wallet'
);
-- ============================================================
-- 2. CORE TABLES
-- ============================================================

-- Restaurants (supports multi-branch SaaS in future)
create table restaurants (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  logo_url        text,
  address         text,
  phone           text,
  upi_id          text,               -- for QR payment generation
  gst_number      text,               -- for bill generation
  tax_rate        numeric(5,2) default 5.00, -- percentage
  is_open         boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
-- User profiles — mirrors auth.users, auto-created via trigger
create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  role            user_role not null default 'customer',
  display_name    text,
  phone           text,
  avatar_url      text,
  preferred_filter text default 'all',  -- veg / non_veg / egg / all
  restaurant_id   uuid references restaurants(id) on delete set null default '00000000-0000-0000-0000-000000000001',
  -- restaurant_id is null for customers, set for admin/cook/supplier
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
-- Menu categories (e.g. Starters, Main Course, Drinks)
create table categories (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references restaurants(id) on delete cascade,
  name            text not null,
  display_order   int default 0,
  is_active       boolean default true
);
-- Menu items
create table menu_items (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references restaurants(id) on delete cascade,
  category_id     uuid not null references categories(id) on delete restrict,
  name            text not null,
  description     text,
  price           numeric(10,2) not null,
  image_url       text,
  veg_type        veg_type not null default 'veg',
  spice_level     int default 0 check (spice_level between 0 and 3),
  -- 0=none, 1=mild, 2=medium, 3=hot
  is_available    boolean default true,
  is_featured     boolean default false,
  prep_time_mins  int default 15,
  station         text,               -- e.g. 'grill', 'drinks', 'tandoor'
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
-- Physical tables in the restaurant
create table tables (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references restaurants(id) on delete cascade,
  table_number    text not null,
  capacity        int default 4,
  status          table_status default 'available',
  qr_code_url     text,
  -- QR encodes: /menu?rid={restaurant_id}&tid={table_id}
  unique (restaurant_id, table_number)
);


-- ============================================================
-- 3. ORDERING & SESSIONS
-- ============================================================

-- A table session = one group dining experience
-- Multiple users can join; all orders share one session → one bill
create table table_sessions (
  id              uuid primary key default gen_random_uuid(),
  table_id        uuid not null references tables(id) on delete restrict,
  restaurant_id   uuid not null references restaurants(id) on delete cascade,
  session_code    text unique,        -- 6-char code for group join
  status          session_status default 'active',
  host_user_id    uuid references profiles(id) on delete set null,
  -- host = first person to scan the QR at this table
  opened_at       timestamptz default now(),
  closed_at       timestamptz
);

-- Members who joined a group session (for group ordering feature)
create table session_members (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references table_sessions(id) on delete cascade,
  user_id         uuid not null references profiles(id) on delete cascade,
  display_name    text,               -- snapshot of name at time of joining
  joined_at       timestamptz default now(),
  unique (session_id, user_id)
);

-- One order per customer per session (they can add more items)
create table orders (
  id                    uuid primary key default gen_random_uuid(),
  session_id            uuid not null references table_sessions(id) on delete restrict,
  user_id               uuid not null references profiles(id) on delete restrict,
  restaurant_id         uuid not null references restaurants(id) on delete cascade,
  table_id              uuid not null references tables(id) on delete restrict,
  status                order_status default 'pending',
  kot_number            text,         -- Kitchen Order Ticket number (e.g. KOT-042)
  total_amount          numeric(10,2) default 0,
  special_instructions  text,
  is_manual             boolean default false, -- true = placed by waiter on behalf
  placed_at             timestamptz default now(),
  confirmed_at          timestamptz,
  ready_at              timestamptz,
  served_at             timestamptz
);

-- Individual line items within an order
create table order_items (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references orders(id) on delete cascade,
  menu_item_id        uuid not null references menu_items(id) on delete restrict,
  quantity            int not null default 1 check (quantity > 0),
  unit_price          numeric(10,2) not null,  -- snapshot of price at time of order
  spice_level         int default 0 check (spice_level between 0 and 3),
  customisation_note  text,           -- e.g. "no cheese", "extra sauce"
  status              order_item_status default 'pending',
  -- per-item status for station routing in KDS
  station             text            -- copied from menu_item.station at order time
);


-- ============================================================
-- 4. BILLING & FEEDBACK
-- ============================================================

-- One bill per session (covers all orders from all members)
create table bills (
  id                uuid primary key default gen_random_uuid(),
  session_id        uuid not null unique references table_sessions(id) on delete restrict,
  restaurant_id     uuid not null references restaurants(id) on delete cascade,
  subtotal          numeric(10,2) not null default 0,
  tax_rate          numeric(5,2) not null default 5.00,
  tax_amount        numeric(10,2) not null default 0,
  discount_amount   numeric(10,2) default 0,
  total             numeric(10,2) not null default 0,
  payment_status    payment_status default 'unpaid',
  payment_method    payment_method,
  payment_ref       text,             -- Razorpay/Cashfree transaction ID
  receipt_url       text,             -- generated PDF/WhatsApp receipt link
  generated_at      timestamptz default now(),
  paid_at           timestamptz
);

-- Post-meal feedback (shown after bill is paid)
create table feedback (
  id              uuid primary key default gen_random_uuid(),
  session_id      uuid not null references table_sessions(id) on delete cascade,
  user_id         uuid not null references profiles(id) on delete cascade,
  restaurant_id   uuid not null references restaurants(id) on delete cascade,
  food_rating     int check (food_rating between 1 and 5),
  service_rating  int check (service_rating between 1 and 5),
  comment         text,
  created_at      timestamptz default now()
);
-- ============================================================
-- 5. STAFF & INVENTORY
-- ============================================================
-- Audit log for staff actions (admin dashboard: 3-hour window monitoring)
create table staff_activity (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  restaurant_id   uuid not null references restaurants(id) on delete cascade,
  action          text not null,
  -- e.g. 'mark_item_ready', 'update_menu_price', 'mark_out_of_stock'
  metadata        jsonb default '{}',
  -- flexible: { item_id, old_value, new_value, order_id, etc. }
  created_at      timestamptz default now()
);
-- Supplier profiles (linked 1:1 with a profiles row of role='supplier')
create table suppliers (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null unique references profiles(id) on delete cascade,
  restaurant_id   uuid not null references restaurants(id) on delete cascade,
  company_name    text not null,
  contact_name    text,
  phone           text,
  email           text,
  is_active       boolean default true,
  created_at      timestamptz default now()
);
-- Inventory / stock tracking
create table inventory_items (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references restaurants(id) on delete cascade,
  supplier_id     uuid references suppliers(id) on delete set null,
  name            text not null,
  unit            text not null default 'kg',  -- kg, litre, piece, etc.
  current_stock   numeric(10,3) default 0,
  reorder_level   numeric(10,3) default 0,     -- alert when stock falls below this
  last_updated    timestamptz default now()
);
-- ============================================================
-- 6. TRIGGERS
-- ============================================================

-- Auto-create a profile row whenever any user signs up (anon or real)
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'display_name',
    coalesce(
      (new.raw_user_meta_data->>'role')::user_role,
      'customer'
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Sequence for Kitchen Order Ticket (KOT) numbering
create sequence if not exists kot_seq start with 1;

-- Auto-generate KOT number per restaurant on order insert (using sequence for concurrency)
create or replace function generate_kot_number()
returns trigger language plpgsql as $$
declare
  next_num int;
begin
  next_num := nextval('kot_seq');
  new.kot_number := 'KOT-' || lpad(next_num::text, 3, '0');
  return new;
end;
$$;

create trigger set_kot_number
  before insert on orders
  for each row execute procedure generate_kot_number();

-- Auto-update order total when items are added/changed
create or replace function update_order_total()
returns trigger language plpgsql as $$
begin
  update orders
  set total_amount = (
    select coalesce(sum(quantity * unit_price), 0)
    from order_items
    where order_id = coalesce(new.order_id, old.order_id)
  )
  where id = coalesce(new.order_id, old.order_id);
  return new;
end;
$$;

create trigger sync_order_total
  after insert or update or delete on order_items
  for each row execute procedure update_order_total();

-- Auto-generate a 6-character session code on table_session insert
create or replace function generate_session_code()
returns trigger language plpgsql as $$
declare
  code text;
begin
  loop
    code := upper(substring(md5(random()::text) from 1 for 6));
    exit when not exists (
      select 1 from table_sessions where session_code = code
    );
  end loop;
  new.session_code := code;
  return new;
end;
$$;

create trigger set_session_code
  before insert on table_sessions
  for each row
  when (new.session_code is null)
  execute procedure generate_session_code();

-- Auto-update updated_at on restaurants and menu_items
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger touch_restaurants
  before update on restaurants
  for each row execute procedure touch_updated_at();

create trigger touch_menu_items
  before update on menu_items
  for each row execute procedure touch_updated_at();

create trigger touch_profiles
  before update on profiles
  for each row execute procedure touch_updated_at();


-- ============================================================
-- 7. INDEXES
-- ============================================================

-- Hot paths for the customer ordering flow
create index idx_menu_items_restaurant   on menu_items(restaurant_id, is_available);
create index idx_menu_items_category     on menu_items(category_id);
create index idx_menu_items_veg_type     on menu_items(restaurant_id, veg_type);
create index idx_categories_restaurant   on categories(restaurant_id, display_order);

-- Hot paths for the KDS (kitchen display)
create index idx_orders_restaurant_status  on orders(restaurant_id, status, placed_at);
create index idx_order_items_station       on order_items(station, status);
create index idx_orders_session            on orders(session_id);

-- Session & table lookups
create index idx_sessions_table         on table_sessions(table_id, status);
create index idx_sessions_code          on table_sessions(session_code);
create index idx_session_members_user   on session_members(user_id);

-- Admin dashboard
create index idx_bills_restaurant       on bills(restaurant_id, payment_status);
create index idx_staff_activity_window  on staff_activity(restaurant_id, user_id, created_at desc);
create index idx_feedback_restaurant    on feedback(restaurant_id, created_at desc);
create index idx_inventory_low_stock    on inventory_items(restaurant_id, current_stock, reorder_level);


-- ============================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table profiles          enable row level security;
alter table restaurants       enable row level security;
alter table categories        enable row level security;
alter table menu_items        enable row level security;
alter table tables            enable row level security;
alter table table_sessions    enable row level security;
alter table session_members   enable row level security;
alter table orders            enable row level security;
alter table order_items       enable row level security;
alter table bills             enable row level security;
alter table feedback          enable row level security;
alter table staff_activity    enable row level security;
alter table suppliers         enable row level security;
alter table inventory_items   enable row level security;

-- Helper: get current user's role
create or replace function current_user_role()
returns user_role language sql security definer stable as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Helper: get current user's restaurant_id (for staff)
create or replace function current_user_restaurant()
returns uuid language sql security definer stable as $$
  select restaurant_id from public.profiles where id = auth.uid()
$$;

-- profiles: users read own row; admin reads all in their restaurant
create policy "profiles_self_read"
  on profiles for select
  using (id = auth.uid());

create policy "profiles_staff_read"
  on profiles for select
  using (
    current_user_role() in ('admin', 'waiter', 'cook')
    and restaurant_id = current_user_restaurant()
  );

create policy "profiles_self_update"
  on profiles for update
  using (id = auth.uid());

-- restaurants: public read; admin can update their own
create policy "restaurants_public_read"
  on restaurants for select
  using (true);

create policy "restaurants_admin_update"
  on restaurants for update
  using (
    current_user_role() = 'admin'
    and id = current_user_restaurant()
  );

-- menu_items: public read; admin/cook can write
create policy "menu_items_public_read"
  on menu_items for select
  using (true);

create policy "menu_items_staff_write"
  on menu_items for all
  using (
    current_user_role() in ('admin', 'cook')
    and restaurant_id = current_user_restaurant()
  );

-- categories: public read; admin writes
create policy "categories_public_read"
  on categories for select using (true);

create policy "categories_admin_write"
  on categories for all
  using (
    current_user_role() = 'admin'
    and restaurant_id = current_user_restaurant()
  );

-- tables: public read; admin writes
create policy "tables_public_read"
  on tables for select using (true);

create policy "tables_admin_write"
  on tables for all
  using (
    current_user_role() = 'admin'
    and restaurant_id = current_user_restaurant()
  );

-- table_sessions: authenticated users read/create; staff read all for restaurant
create policy "sessions_user_read"
  on table_sessions for select
  using (
    host_user_id = auth.uid()
    or id in (select session_id from session_members where user_id = auth.uid())
  );

create policy "sessions_staff_read"
  on table_sessions for select
  using (
    current_user_role() in ('admin', 'cook')
    and restaurant_id = current_user_restaurant()
  );

create policy "sessions_user_insert"
  on table_sessions for insert
  with check (auth.uid() is not null);

-- orders: owner reads own; staff reads all for restaurant
create policy "orders_owner_read"
  on orders for select
  using (user_id = auth.uid());

create policy "orders_staff_read"
  on orders for select
  using (
    current_user_role() in ('admin', 'waiter', 'cook')
    and restaurant_id = current_user_restaurant()
  );

create policy "orders_user_insert"
  on orders for insert
  with check (auth.uid() is not null);

create policy "orders_staff_update"
  on orders for update
  using (
    current_user_role() in ('admin', 'waiter', 'cook')
    and restaurant_id = current_user_restaurant()
  );

-- order_items: follow parent order access
create policy "order_items_owner_read"
  on order_items for select
  using (
    order_id in (select id from orders where user_id = auth.uid())
  );

create policy "order_items_staff_read"
  on order_items for select
  using (
    order_id in (
      select id from orders
      where restaurant_id = current_user_restaurant()
    )
  );

create policy "order_items_user_insert"
  on order_items for insert
  with check (
    order_id in (select id from orders where user_id = auth.uid())
  );

create policy "order_items_staff_update"
  on order_items for update
  using (
    order_id in (
      select id from orders
      where restaurant_id = current_user_restaurant()
    )
    and current_user_role() in ('admin', 'waiter', 'cook')
  );

-- bills: session members read; admin full access
create policy "bills_session_read"
  on bills for select
  using (
    session_id in (
      select id from table_sessions
      where host_user_id = auth.uid()
      or id in (select session_id from session_members where user_id = auth.uid())
    )
  );

create policy "bills_admin_all"
  on bills for all
  using (
    current_user_role() = 'admin'
    and restaurant_id = current_user_restaurant()
  );

-- feedback: users write own; admin reads all
create policy "feedback_user_insert"
  on feedback for insert
  with check (user_id = auth.uid());

create policy "feedback_admin_read"
  on feedback for select
  using (
    current_user_role() = 'admin'
    and restaurant_id = current_user_restaurant()
  );

-- staff_activity: admin/cook read for their restaurant
create policy "activity_staff_read"
  on staff_activity for select
  using (
    current_user_role() in ('admin', 'waiter')
    and restaurant_id = current_user_restaurant()
  );

create policy "activity_staff_insert"
  on staff_activity for insert
  with check (
    current_user_role() in ('admin', 'waiter', 'cook')
    and restaurant_id = current_user_restaurant()
  );

-- inventory: supplier reads/writes own; admin full access
create policy "inventory_admin_all"
  on inventory_items for all
  using (
    current_user_role() = 'admin'
    and restaurant_id = current_user_restaurant()
  );

create policy "inventory_supplier_read"
  on inventory_items for select
  using (
    supplier_id in (
      select id from suppliers where user_id = auth.uid()
    )
  );
create policy "inventory_supplier_update"
  on inventory_items for update
  using (
    supplier_id in (
      select id from suppliers where user_id = auth.uid()
    )
  );
-- suppliers: admin manages; supplier reads own
create policy "suppliers_admin_all"
  on suppliers for all
  using (
    current_user_role() = 'admin'
    and restaurant_id = current_user_restaurant()
  );

create policy "suppliers_self_read"
  on suppliers for select
  using (user_id = auth.uid());
-- ============================================================
-- 9. ADMIN DASHBOARD VIEWS
-- ============================================================
-- Live orders view for KDS and admin (includes item details)
create or replace view v_live_orders as
select
  o.id                  as order_id,
  o.kot_number,
  o.status              as order_status,
  o.placed_at,
  o.restaurant_id,
  t.table_number,
  p.display_name        as customer_name,
  extract(epoch from (now() - o.placed_at)) / 60 as age_minutes,
  -- ticket aging: 0-15=green, 15-30=yellow, 30+=red
  case
    when extract(epoch from (now() - o.placed_at)) / 60 < 15 then 'green'
    when extract(epoch from (now() - o.placed_at)) / 60 < 30 then 'yellow'
    else 'red'
  end                   as ticket_age_color,
  json_agg(json_build_object(
    'item_id',    oi.id,
    'name',       mi.name,
    'quantity',   oi.quantity,
    'spice',      oi.spice_level,
    'note',       oi.customisation_note,
    'station',    oi.station,
    'status',     oi.status
  ) order by mi.name)   as items
from orders o
join tables t         on t.id = o.table_id
join profiles p       on p.id = o.user_id
join order_items oi   on oi.order_id = o.id
join menu_items mi    on mi.id = oi.menu_item_id
where o.status not in ('served', 'cancelled')
group by o.id, t.table_number, p.display_name;
-- Daily sales summary for admin dashboard
create or replace view v_daily_sales as
select
  b.restaurant_id,
  date_trunc('day', b.paid_at)  as sale_date,
  count(*)                      as total_bills,
  sum(b.subtotal)               as gross_revenue,
  sum(b.tax_amount)             as total_tax,
  sum(b.discount_amount)        as total_discounts,
  sum(b.total)                  as net_revenue,
  avg(b.total)                  as avg_bill_value,
  count(*) filter (
    where b.payment_method = 'upi'
  )                             as upi_payments,
  count(*) filter (
    where b.payment_method = 'cash'
  )                             as cash_payments
from bills b
where b.payment_status = 'paid'
group by b.restaurant_id, date_trunc('day', b.paid_at)
order by sale_date desc;
-- Table occupancy overview for admin
create or replace view v_table_overview as
select
  t.id,
  t.restaurant_id,
  t.table_number,
  t.capacity,
  t.status,
  ts.id               as active_session_id,
  ts.session_code,
  ts.opened_at,
  count(distinct sm.user_id) as member_count,
  count(distinct o.id)       as order_count,
  coalesce(sum(oi.quantity * oi.unit_price), 0) as running_total
from tables t
left join table_sessions ts
  on ts.table_id = t.id and ts.status = 'active'
left join session_members sm on sm.session_id = ts.id
left join orders o
  on o.session_id = ts.id and o.status != 'cancelled'
left join order_items oi on oi.order_id = o.id
group by t.id, ts.id;
-- Top selling items (last 30 days)
create or replace view v_top_items as
select
  mi.restaurant_id,
  mi.id             as item_id,
  mi.name,
  mi.category_id,
  c.name            as category_name,
  mi.price,
  mi.veg_type,
  count(oi.id)      as times_ordered,
  sum(oi.quantity)  as total_quantity_sold,
  sum(oi.quantity * oi.unit_price) as total_revenue
from menu_items mi
join order_items oi on oi.menu_item_id = mi.id
join orders o       on o.id = oi.order_id
join categories c   on c.id = mi.category_id
where o.placed_at >= now() - interval '30 days'
  and o.status != 'cancelled'
group by mi.id, c.name
order by total_quantity_sold desc;
-- Staff activity window (last 3 hours) for admin monitoring
create or replace view v_staff_activity_window as
select
  sa.restaurant_id,
  sa.user_id,
  p.display_name,
  p.role,
  sa.action,
  sa.metadata,
  sa.created_at
from staff_activity sa
join profiles p on p.id = sa.user_id
where sa.created_at >= now() - interval '3 hours'
order by sa.created_at desc;

-- Feedback summary per restaurant
create or replace view v_feedback_summary as
select
  restaurant_id,
  count(*)                        as total_responses,
  round(avg(food_rating), 1)      as avg_food_rating,
  round(avg(service_rating), 1)   as avg_service_rating,
  round(avg((food_rating + service_rating) / 2.0), 1) as avg_overall
from feedback
group by restaurant_id;
-- Low stock alerts for admin / supplier
create or replace view v_low_stock as
select
  i.restaurant_id,
  i.id            as item_id,
  i.name,
  i.unit,
  i.current_stock,
  i.reorder_level,
  s.company_name  as supplier_name,
  s.phone         as supplier_phone
from inventory_items i
left join suppliers s on s.id = i.supplier_id
where i.current_stock <= i.reorder_level
order by (i.current_stock / nullif(i.reorder_level, 0)) asc;

-- ============================================================
-- 10. SEEDING (Single Restaurant Mode)
-- ============================================================

-- Create default restaurant if none exists
insert into restaurants (id, name, address, phone)
values ('00000000-0000-0000-0000-000000000001', 'Main Restaurant', 'Restaurant Address', '1234567890')
on conflict (id) do nothing;
