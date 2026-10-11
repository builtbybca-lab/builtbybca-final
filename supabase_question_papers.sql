-- Question Papers Table for BuiltBy.BCA
CREATE TABLE IF NOT EXISTS public.question_papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  subject_code TEXT,
  semester INTEGER NOT NULL CHECK (semester BETWEEN 1 AND 6),
  year INTEGER NOT NULL,
  exam_type TEXT NOT NULL,
  scheme TEXT DEFAULT 'NEP 2020',
  file_url TEXT NOT NULL,
  file_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for quick querying by semester and academic year
CREATE INDEX IF NOT EXISTS idx_question_papers_sem ON public.question_papers(semester);
CREATE INDEX IF NOT EXISTS idx_question_papers_year ON public.question_papers(year);

-- Enable Row Level Security
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone (students & guests) can read question papers
CREATE POLICY "Enable read access for all users" ON public.question_papers
  FOR SELECT USING (true);

-- Policy: Only Admins can upload question papers
CREATE POLICY "Enable insert for admins only" ON public.question_papers
  FOR INSERT WITH CHECK (
    auth.jwt() ->> 'role' = 'service_role' OR
    exists (
      select 1 from public.user_roles 
      where user_roles.user_id = auth.uid() and user_roles.role = 'admin'
    )
  );

-- Policy: Only Admins can update question papers
CREATE POLICY "Enable update for admins only" ON public.question_papers
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'service_role' OR
    exists (
      select 1 from public.user_roles 
      where user_roles.user_id = auth.uid() and user_roles.role = 'admin'
    )
  );

-- Policy: Only Admins can delete question papers
CREATE POLICY "Enable delete for admins only" ON public.question_papers
  FOR DELETE USING (
    auth.jwt() ->> 'role' = 'service_role' OR
    exists (
      select 1 from public.user_roles 
      where user_roles.user_id = auth.uid() and user_roles.role = 'admin'
    )
  );
