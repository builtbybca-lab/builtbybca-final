-- Add category column to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'Other';

-- Backfill existing projects with 'Web App' or 'Other' based on tags or default
UPDATE public.projects 
SET category = 'Web App' 
WHERE category = 'Other' AND (
  'web' = ANY(tags) OR 
  'react' = ANY(tags) OR 
  'website' = ANY(tags)
);

-- Improve performance for filtering
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
