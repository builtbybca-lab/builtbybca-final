-- NOTE: Removed ALTER TABLE to avoid ownership errors.
-- NOTE: Corrected Admin check to use user_roles table or has_role function.

-- 1. Create buckets (insert if they don't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('project-images', 'project-images', true),
  ('blog-images', 'blog-images', true),
  ('event-images', 'event-images', true),
  ('team-images', 'team-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing policies to avoid conflicts when re-running
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admin All Access" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1uu5t4_0" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder 1uu5t4_1" ON storage.objects;

-- 3. Policy: Allow Public Read Access to these buckets
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id in ('blog-images', 'event-images', 'team-images', 'project-images') );

-- 4. Policy: Allow Authenticated Users to Upload (Insert)
create policy "Authenticated Uploads"
on storage.objects for insert
to authenticated
with check ( bucket_id in ('blog-images', 'event-images', 'team-images', 'project-images') );

-- 5. Admin Policy (Checking user_roles table instead of profiles.role)
create policy "Admin All Access"
on storage.objects
for all
to authenticated
using ( 
  auth.jwt() ->> 'role' = 'service_role' 
  OR 
  exists (
    select 1 from public.user_roles 
    where user_roles.user_id = auth.uid() and user_roles.role = 'admin'
  )
);
