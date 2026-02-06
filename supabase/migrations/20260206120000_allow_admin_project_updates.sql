-- Give Admins permission to UPDATE projects (required for approval)
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;

CREATE POLICY "Admins can update projects" ON public.projects
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_roles.user_id = (SELECT auth.uid()) 
            AND user_roles.role = 'admin'
        )
    );
