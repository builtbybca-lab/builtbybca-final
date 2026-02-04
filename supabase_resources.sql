-- Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL, -- 'learning', 'tools', 'career', 'downloads'
  type TEXT NOT NULL, -- 'link', 'download', 'video', 'course'
  url TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Resources Policies
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.resources
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for admins only" ON public.resources
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role' OR
    exists (
      select 1 from public.user_roles 
      where user_roles.user_id = auth.uid() and user_roles.role = 'admin'
    )
  );

CREATE POLICY "Enable update for admins only" ON public.resources
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'service_role' OR
    exists (
      select 1 from public.user_roles 
      where user_roles.user_id = auth.uid() and user_roles.role = 'admin'
    )
  );

CREATE POLICY "Enable delete for admins only" ON public.resources
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'service_role' OR
    exists (
      select 1 from public.user_roles 
      where user_roles.user_id = auth.uid() and user_roles.role = 'admin'
    )
  );
