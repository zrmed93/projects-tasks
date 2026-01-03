-- Enable extensions
create extension if not exists "pgcrypto";

-- Organizations
create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Memberships
create table memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz default now(),
  unique (org_id, user_id)
);

-- Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

-- Tasks
create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  org_id uuid not null,
  title text not null,
  done boolean default false,
  created_at timestamptz default now()
);

-- Invites
create table invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  token text not null unique,
  created_at timestamptz default now(),
  accepted_at timestamptz
);

-- Audit logs
create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  actor uuid references auth.users(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);
