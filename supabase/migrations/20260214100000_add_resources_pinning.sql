-- Add is_pinned column to resources table
ALTER TABLE public.resources 
ADD COLUMN is_pinned BOOLEAN DEFAULT false;
