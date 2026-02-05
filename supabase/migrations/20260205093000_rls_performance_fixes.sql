-- Migration: Optimize RLS Policies for Performance
-- Fixes: auth_rls_initplan (wrap auth functions in select)
-- Fixes: multiple_permissive_policies (consolidate duplicate policies)
-- Note: Uses user_roles table for admin checks (not profiles.role)

-- ============================================
-- 1. PROFILES TABLE
-- ============================================

-- Fix: Users can update own profile (wrap auth.uid() in select)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (id = (SELECT auth.uid()));

-- ============================================
-- 2. BLOG_POSTS TABLE
-- ============================================

-- Drop existing policies that have issues
DROP POLICY IF EXISTS "Admins can insert blogs" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can update blogs" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins can delete blogs" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can submit blogs for review" ON public.blog_posts;
DROP POLICY IF EXISTS "Anyone can view published blogs or own posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated users can insert blogs" ON public.blog_posts;

-- Consolidated INSERT policy (fixes multiple_permissive_policies)
CREATE POLICY "Authenticated users can insert blogs" ON public.blog_posts
    FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Fixed SELECT policy
CREATE POLICY "Anyone can view published blogs or own posts" ON public.blog_posts
    FOR SELECT USING (
        published = true 
        OR author_id = (SELECT auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

-- Fixed UPDATE policy (admins only)
CREATE POLICY "Admins can update blogs" ON public.blog_posts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

-- Fixed DELETE policy (admins only)
CREATE POLICY "Admins can delete blogs" ON public.blog_posts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

-- ============================================
-- 3. PROJECTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Anyone can view approved projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;

-- Fixed SELECT policy
CREATE POLICY "Anyone can view approved projects" ON public.projects
    FOR SELECT USING (
        approved = true 
        OR user_id = (SELECT auth.uid())
        OR EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

-- Fixed INSERT policy
CREATE POLICY "Authenticated users can insert projects" ON public.projects
    FOR INSERT TO authenticated
    WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- Fixed UPDATE policy
CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (user_id = (SELECT auth.uid()));

-- Fixed DELETE policy
CREATE POLICY "Admins can delete projects" ON public.projects
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

-- ============================================
-- 4. EVENTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;

-- Consolidated SELECT policy (fixes multiple_permissive_policies)
CREATE POLICY "Anyone can view events" ON public.events
    FOR SELECT USING (true);

-- Separate admin policies for INSERT, UPDATE, DELETE
CREATE POLICY "Admins can insert events" ON public.events
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update events" ON public.events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete events" ON public.events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

-- ============================================
-- 5. TEAM_MEMBERS TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins can manage team" ON public.team_members;
DROP POLICY IF EXISTS "Anyone can view team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can insert team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can update team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins can delete team members" ON public.team_members;

-- Consolidated SELECT policy (fixes multiple_permissive_policies)
CREATE POLICY "Anyone can view team members" ON public.team_members
    FOR SELECT USING (true);

-- Separate admin policies
CREATE POLICY "Admins can insert team members" ON public.team_members
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update team members" ON public.team_members
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete team members" ON public.team_members
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

-- ============================================
-- 6. TESTIMONIALS TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Anyone can view testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;

-- Consolidated SELECT policy
CREATE POLICY "Anyone can view testimonials" ON public.testimonials
    FOR SELECT USING (true);

-- Separate admin policies
CREATE POLICY "Admins can insert testimonials" ON public.testimonials
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update testimonials" ON public.testimonials
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete testimonials" ON public.testimonials
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

-- ============================================
-- 7. RESOURCES TABLE
-- ============================================

DROP POLICY IF EXISTS "Enable insert for admins only" ON public.resources;
DROP POLICY IF EXISTS "Enable update for admins only" ON public.resources;
DROP POLICY IF EXISTS "Enable delete for admins only" ON public.resources;

-- Fixed admin policies with select wrapper
CREATE POLICY "Enable insert for admins only" ON public.resources
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Enable update for admins only" ON public.resources
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Enable delete for admins only" ON public.resources
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

-- ============================================
-- 8. NOTIFICATIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "Admins can manage notifications" ON public.notifications;
DROP POLICY IF EXISTS "Everyone can read active notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can update notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can delete notifications" ON public.notifications;

-- Consolidated SELECT policy
CREATE POLICY "Everyone can read active notifications" ON public.notifications
    FOR SELECT USING (active = true);

-- Separate admin policies
CREATE POLICY "Admins can insert notifications" ON public.notifications
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update notifications" ON public.notifications
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete notifications" ON public.notifications
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );

-- ============================================
-- 9. NOTIFICATION_DISMISSALS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can dismiss notifications" ON public.notification_dismissals;
DROP POLICY IF EXISTS "Users can view their own dismissals" ON public.notification_dismissals;

-- Fixed policies with select wrapper
CREATE POLICY "Users can dismiss notifications" ON public.notification_dismissals
    FOR INSERT TO authenticated
    WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "Users can view their own dismissals" ON public.notification_dismissals
    FOR SELECT USING (user_id = (SELECT auth.uid()));
