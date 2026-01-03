create index on memberships(user_id);
create index on memberships(org_id);
create index on projects(org_id);
create index on tasks(org_id);
create index on audit_logs(org_id, created_at desc);
