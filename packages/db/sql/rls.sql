-- 🔒  Row-Level-Security & audit chain -----------------------------

-- 1. Enable RLS
alter table users        enable row level security;
alter table licenses     enable row level security;

-- 2. Users can read themselves
create policy "user reads self"
  on users
  for select
  using ( id = auth.uid() );

-- 3. Pros manage their own licenses
create policy "pro inserts own license"
  on licenses
  for insert with check ( professional_id = auth.uid() );

create policy "pro reads own license"
  on licenses
  for select using ( professional_id = auth.uid() );

-- 4. Admins can update any license
create policy "admin updates license"
  on licenses
  for update using (
      (select role from users where id = auth.uid()) = 'admin'
  );

-- 5. Append-only audit table + hash chain
create table if not exists license_events (
  id          uuid primary key default gen_random_uuid(),
  license_id  uuid references licenses(id) on delete cascade,
  event       text,
  admin_id    uuid references users(id),
  note        text,
  prev_hash   text,
  hash        text,
  created_at  timestamptz default now()
);

alter table license_events enable row level security;
create policy append_only on license_events  for insert with check ( true );
create policy read_all    on license_events  for select using ( true );

create or replace function log_license_event() returns trigger as $$
declare
  prev text := (
    select hash from license_events
    where license_id = NEW.license_id
    order by created_at desc limit 1
  );
begin
  NEW.prev_hash := coalesce(prev, '');
  NEW.hash := encode(
    sha256(
      NEW.event || coalesce(NEW.admin_id::text,'')
      || coalesce(NEW.note,'') || NEW.created_at || NEW.prev_hash
    ),
    'hex'
  );
  return NEW;
end;
$$ language plpgsql;

create trigger t_license_events_hash
  before insert on license_events
  for each row execute procedure log_license_event();
