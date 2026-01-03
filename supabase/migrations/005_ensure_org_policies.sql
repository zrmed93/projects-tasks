-- Drop existing policies if they exist (to avoid conflicts)
drop policy if exists "authenticated users can create organizations" on organizations;
drop policy if exists "users can create own owner membership" on memberships;

-- Allow authenticated users to create organizations
create policy "authenticated users can create organizations"
on organizations for insert
with check (auth.uid() is not null);

-- Allow users to create their own owner membership when creating an org
create policy "users can create own owner membership"
on memberships for insert
with check (
  auth.uid() = user_id 
  and role = 'owner'
  and not exists (
    select 1 from memberships m
    where m.org_id = memberships.org_id 
    and m.user_id = auth.uid()
  )
);

