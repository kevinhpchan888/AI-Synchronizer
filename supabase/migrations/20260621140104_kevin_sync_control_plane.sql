create extension if not exists pgcrypto;

create table if not exists public.kevin_sync_machines (
  id uuid primary key,
  name text not null,
  platform text not null,
  role text,
  address text,
  last_seen timestamptz not null default now(),
  status jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kevin_sync_projects (
  id uuid primary key,
  name text not null,
  local_path text,
  repo_remote text,
  branch text,
  git_state text not null default 'unknown',
  memory_state text not null default 'unknown',
  memory_freshness integer not null default 0 check (memory_freshness >= 0 and memory_freshness <= 100),
  memory_hash text,
  last_memory_at timestamptz,
  status jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kevin_sync_memory_snapshots (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.kevin_sync_projects(id) on delete cascade,
  machine_id uuid references public.kevin_sync_machines(id) on delete cascade,
  memory_state text not null default 'unknown',
  memory_freshness integer not null default 0 check (memory_freshness >= 0 and memory_freshness <= 100),
  memory_hash text,
  status jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.kevin_sync_memory_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.kevin_sync_projects(id) on delete cascade,
  machine_id uuid references public.kevin_sync_machines(id) on delete set null,
  event_type text not null,
  source_agent text,
  source_machine text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.kevin_sync_jobs (
  id uuid primary key default gen_random_uuid(),
  machine_id uuid references public.kevin_sync_machines(id) on delete cascade,
  target_machine_key text,
  project_id uuid references public.kevin_sync_projects(id) on delete set null,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  result jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.kevin_sync_machines enable row level security;
alter table public.kevin_sync_projects enable row level security;
alter table public.kevin_sync_memory_snapshots enable row level security;
alter table public.kevin_sync_memory_events enable row level security;
alter table public.kevin_sync_jobs enable row level security;

grant select, insert, update, delete on public.kevin_sync_machines to service_role;
grant select, insert, update, delete on public.kevin_sync_projects to service_role;
grant select, insert, update, delete on public.kevin_sync_memory_snapshots to service_role;
grant select, insert, update, delete on public.kevin_sync_memory_events to service_role;
grant select, insert, update, delete on public.kevin_sync_jobs to service_role;

create index if not exists kevin_sync_machines_last_seen_idx on public.kevin_sync_machines (last_seen desc);
create index if not exists kevin_sync_projects_remote_idx on public.kevin_sync_projects (repo_remote);
create index if not exists kevin_sync_projects_memory_state_idx on public.kevin_sync_projects (memory_state, last_memory_at desc);
create index if not exists kevin_sync_memory_snapshots_project_machine_idx on public.kevin_sync_memory_snapshots (project_id, machine_id, created_at desc);
create index if not exists kevin_sync_memory_events_project_time_idx on public.kevin_sync_memory_events (project_id, occurred_at desc);
create index if not exists kevin_sync_jobs_machine_status_idx on public.kevin_sync_jobs (machine_id, status, created_at desc);
create index if not exists kevin_sync_jobs_target_status_idx on public.kevin_sync_jobs (target_machine_key, status, created_at desc);

create or replace function public.set_kevin_sync_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists kevin_sync_machines_set_updated_at on public.kevin_sync_machines;
create trigger kevin_sync_machines_set_updated_at
before update on public.kevin_sync_machines
for each row execute function public.set_kevin_sync_updated_at();

drop trigger if exists kevin_sync_projects_set_updated_at on public.kevin_sync_projects;
create trigger kevin_sync_projects_set_updated_at
before update on public.kevin_sync_projects
for each row execute function public.set_kevin_sync_updated_at();

drop trigger if exists kevin_sync_jobs_set_updated_at on public.kevin_sync_jobs;
create trigger kevin_sync_jobs_set_updated_at
before update on public.kevin_sync_jobs
for each row execute function public.set_kevin_sync_updated_at();
