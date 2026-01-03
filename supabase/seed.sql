-- Disable RLS temporarily (safe for local only)
create extension if not exists "pgcrypto" with schema auth;

set session_replication_role = replica;

-- -------------------------------------------------
-- USERS
-- -------------------------------------------------

insert into auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) values (
  '11111111-1111-1111-1111-111111111111',
  'owner@example.com',
  public.crypt('password123', public.gen_salt('bf')),
  now(),
  now(),
  now()
),
(
  '22222222-2222-2222-2222-222222222222',
  'member@example.com',
  public.crypt('password123', public.gen_salt('bf')),
  now(),
  now(),
  now()
);

-- -------------------------------------------------
-- ORGANIZATION
-- -------------------------------------------------

insert into organizations (id, name)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Demo Organization');

-- -------------------------------------------------
-- MEMBERSHIPS
-- -------------------------------------------------

insert into memberships (org_id, user_id, role)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '11111111-1111-1111-1111-111111111111',
   'owner'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '22222222-2222-2222-2222-222222222222',
   'member');

-- -------------------------------------------------
-- PROJECTS
-- -------------------------------------------------

insert into projects (id, org_id, name)
values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'Website Redesign');

-- -------------------------------------------------
-- TASKS
-- -------------------------------------------------

insert into tasks (org_id, project_id, title, done)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   'Set up Next.js project',
   true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
   'Configure Supabase',
   false);

-- -------------------------------------------------
-- AUDIT LOGS
-- -------------------------------------------------

insert into audit_logs (
  org_id,
  actor,
  action,
  entity_type,
  entity_id
) values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'project.created',
  'project',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
),
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '22222222-2222-2222-2222-222222222222',
  'task.created',
  'task',
  null
);

-- Re-enable RLS
set session_replication_role = origin;
