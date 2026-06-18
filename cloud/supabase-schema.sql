create table if not exists public.sync_machines (
  id uuid primary key,
  name text not null,
  platform text not null,
  last_seen timestamptz not null default now(),
  status jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sync_jobs (
  id uuid primary key default gen_random_uuid(),
  machine_id uuid references public.sync_machines(id) on delete cascade,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  result jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sync_machines enable row level security;
alter table public.sync_jobs enable row level security;

grant select, insert, update, delete on public.sync_machines to service_role;
grant select, insert, update, delete on public.sync_jobs to service_role;

create index if not exists sync_machines_last_seen_idx on public.sync_machines (last_seen desc);
create index if not exists sync_jobs_machine_status_idx on public.sync_jobs (machine_id, status, created_at desc);

create or replace function public.set_sync_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sync_machines_set_updated_at on public.sync_machines;
create trigger sync_machines_set_updated_at
before update on public.sync_machines
for each row execute function public.set_sync_updated_at();

drop trigger if exists sync_jobs_set_updated_at on public.sync_jobs;
create trigger sync_jobs_set_updated_at
before update on public.sync_jobs
for each row execute function public.set_sync_updated_at();
