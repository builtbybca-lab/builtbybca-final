-- Add gallery_images column to events table
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.events.gallery_images IS 'Array of image URLs for event gallery';