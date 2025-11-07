-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('blog-images', 'blog-images', true),
  ('event-images', 'event-images', true),
  ('team-images', 'team-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for blog-images bucket
CREATE POLICY "Anyone can view blog images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update blog images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete blog images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'blog-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for event-images bucket
CREATE POLICY "Anyone can view event images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'event-images');

CREATE POLICY "Admins can upload event images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'event-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update event images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'event-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete event images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'event-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for team-images bucket
CREATE POLICY "Anyone can view team images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'team-images');

CREATE POLICY "Admins can upload team images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'team-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update team images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'team-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete team images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'team-images' AND
  has_role(auth.uid(), 'admin'::app_role)
);