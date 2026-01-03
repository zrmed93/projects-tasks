-- Helper functions
create or replace function is_org_member(org uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from memberships
    where memberships.org_id = org
    and memberships.user_id = auth.uid()
  );
$$;

create or replace function is_org_owner(org uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from memberships
    where memberships.org_id = org
    and memberships.user_id = auth.uid()
    and role = 'owner'
  );
$$;

-- Enable RLS
alter table organizations enable row level security;
alter table memberships enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table invites enable row level security;
alter table audit_logs enable row level security;

-- Organizations
create policy "org members can read org"
on organizations for select
using (is_org_member(id));

-- Memberships
create policy "members read memberships"
on memberships for select
using (is_org_member(org_id));

create policy "owners insert memberships"
on memberships for insert
with check (is_org_owner(org_id));

-- Projects
create policy "members read projects"
on projects for select
using (is_org_member(org_id));

create policy "members create projects"
on projects for insert
with check (is_org_member(org_id));

-- Tasks
create policy "members read tasks"
on tasks for select
using (is_org_member(org_id));

create policy "members write tasks"
on tasks for all
using (is_org_member(org_id))
with check (is_org_member(org_id));

-- Invites
create policy "owners create invites"
on invites for insert
with check (is_org_owner(org_id));

create policy "read own invite"
on invites for select
using (email = auth.jwt()->>'email');

-- Audit logs
create policy "members read logs"
on audit_logs for select
using (is_org_member(org_id));

create policy "members insert logs"
on audit_logs for insert
with check (is_org_member(org_id));
