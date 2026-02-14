-- Create storage bucket for resource files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resource-files', 'resource-files', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for resource-files bucket
CREATE POLICY "Anyone can view resource files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'resource-files');

CREATE POLICY "Admins can upload resource files" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'resource-files' AND
  (SELECT role FROM public.user_roles WHERE user_id = (SELECT auth.uid()) LIMIT 1) = 'admin'
);

CREATE POLICY "Admins can update resource files" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'resource-files' AND
  (SELECT role FROM public.user_roles WHERE user_id = (SELECT auth.uid()) LIMIT 1) = 'admin'
);

CREATE POLICY "Admins can delete resource files" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'resource-files' AND
  (SELECT role FROM public.user_roles WHERE user_id = (SELECT auth.uid()) LIMIT 1) = 'admin'
);
