-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Create buckets (insert if they don't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('project-images', 'project-images', true),
  ('blog-images', 'blog-images', true),
  ('event-images', 'event-images', true),
  ('team-images', 'team-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Policy: Allow Public Read Access to these buckets
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id in ('blog-images', 'event-images', 'team-images', 'project-images') );

-- 3. Policy: Allow Authenticated Users to Upload (Insert)
create policy "Authenticated Uploads"
on storage.objects for insert
to authenticated
with check ( bucket_id in ('blog-images', 'event-images', 'team-images', 'project-images') );

-- 4. Simplified Admin Policy for all operations
create policy "Admin All Access"
on storage.objects
for all
to authenticated
using ( 
  auth.jwt() ->> 'role' = 'service_role' 
  OR 
  exists (
    select 1 from public.profiles 
    where profiles.id = auth.uid() and profiles.role = 'admin'
  )
);
