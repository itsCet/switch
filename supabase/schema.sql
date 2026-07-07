-- Run this once in the Supabase SQL editor (Dashboard > SQL Editor > New query)

create table if not exists public.app_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

create policy "Users can view own state"
  on public.app_state for select
  using (auth.uid() = user_id);

create policy "Users can insert own state"
  on public.app_state for insert
  with check (auth.uid() = user_id);

create policy "Users can update own state"
  on public.app_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
