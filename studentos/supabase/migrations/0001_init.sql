-- StudentOS online layer — schema + Row Level Security.
-- Apply via the Supabase SQL editor (or `supabase db push`).
--
-- Design: each personal record is stored as a JSONB `data` blob keyed by the
-- client-generated domain id, plus a `user_id` owner column. This mirrors the
-- IndexedDB territories 1:1 (LibrettoEntry / Note / StudyTask / FocusSession)
-- without coupling the SQL schema to every domain field — the client stays the
-- schema authority, the server enforces ownership. RLS guarantees a row is only
-- ever visible to its owner: `user_id = auth.uid()`.

-- ── profiles ────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text,
  preset_id     text,
  programme     text,
  year_of_study smallint,
  degree_plan   jsonb not null default '{"totalCfu":180}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── personal territories (one table each, identical shape) ──────────────────
create table if not exists public.libretto_entries (
  user_id    uuid not null references auth.users (id) on delete cascade,
  id         text not null,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.notes (
  user_id    uuid not null references auth.users (id) on delete cascade,
  id         text not null,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.tasks (
  user_id    uuid not null references auth.users (id) on delete cascade,
  id         text not null,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.focus_sessions (
  user_id    uuid not null references auth.users (id) on delete cascade,
  id         text not null,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

-- ── Row Level Security ──────────────────────────────────────────────────────
alter table public.profiles         enable row level security;
alter table public.libretto_entries enable row level security;
alter table public.notes            enable row level security;
alter table public.tasks            enable row level security;
alter table public.focus_sessions   enable row level security;

-- profiles: owner-only on its own id.
drop policy if exists "profiles owner" on public.profiles;
create policy "profiles owner" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- personal tables: owner-only on user_id. One policy block per table.
drop policy if exists "libretto owner" on public.libretto_entries;
create policy "libretto owner" on public.libretto_entries
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "notes owner" on public.notes;
create policy "notes owner" on public.notes
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "tasks owner" on public.tasks;
create policy "tasks owner" on public.tasks
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "focus owner" on public.focus_sessions;
create policy "focus owner" on public.focus_sessions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── auto-provision a profile row on signup ──────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
