-- Migration: Allow authenticated users to submit testimonials
-- Description:
-- 1. Updates RLS policy on public.testimonials to permit authenticated users to submit testimonials
-- 2. Creates a secure SECURITY DEFINER RPC function 'submit_testimonial' to ensure seamless submissions

-- 1. Update RLS policies
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can insert testimonials" ON public.testimonials;

-- Allow all authenticated users to submit testimonials
CREATE POLICY "Authenticated users can insert testimonials" ON public.testimonials
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Ensure public can view testimonials
DROP POLICY IF EXISTS "Anyone can view testimonials" ON public.testimonials;
CREATE POLICY "Anyone can view testimonials" ON public.testimonials
    FOR SELECT USING (true);

-- Ensure admins can manage (update/delete) testimonials
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
CREATE POLICY "Admins can update testimonials" ON public.testimonials
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
CREATE POLICY "Admins can delete testimonials" ON public.testimonials
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

-- 2. Create RPC function for real-time submission with validation
CREATE OR REPLACE FUNCTION public.submit_testimonial(
    p_name text,
    p_role text,
    p_content text,
    p_rating integer DEFAULT 5,
    p_avatar_url text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
    new_id uuid;
    clean_name text;
    clean_role text;
    clean_content text;
BEGIN
    clean_content := TRIM(COALESCE(p_content, ''));
    IF clean_content = '' THEN
        RAISE EXCEPTION 'Testimonial content cannot be empty';
    END IF;

    clean_name := COALESCE(NULLIF(TRIM(p_name), ''), 'Anonymous');
    clean_role := COALESCE(NULLIF(TRIM(p_role), ''), 'Community Member');

    INSERT INTO public.testimonials (
        name,
        role,
        content,
        rating,
        avatar_url,
        display_order
    )
    VALUES (
        clean_name,
        clean_role,
        clean_content,
        GREATEST(1, LEAST(5, COALESCE(p_rating, 5))),
        p_avatar_url,
        0
    )
    RETURNING id INTO new_id;

    RETURN new_id;
END;
$$;

-- Grant execution permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.submit_testimonial(text, text, text, integer, text) TO anon, authenticated;

