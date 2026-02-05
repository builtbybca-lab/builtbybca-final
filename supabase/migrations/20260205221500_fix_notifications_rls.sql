-- Enable RLS
ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;

-- Policy for Admins to INSERT
DROP POLICY IF EXISTS "Admins can insert notifications" ON "public"."notifications";
CREATE POLICY "Admins can insert notifications"
ON "public"."notifications"
FOR INSERT
WITH CHECK (
  exists (
    select 1 from user_roles
    where user_roles.user_id = auth.uid()
    and user_roles.role = 'admin'
  )
);

-- Policy for Admins to UPDATE
DROP POLICY IF EXISTS "Admins can update notifications" ON "public"."notifications";
CREATE POLICY "Admins can update notifications"
ON "public"."notifications"
FOR UPDATE
USING (
  exists (
    select 1 from user_roles
    where user_roles.user_id = auth.uid()
    and user_roles.role = 'admin'
  )
);

-- Policy for Admins to DELETE
DROP POLICY IF EXISTS "Admins can delete notifications" ON "public"."notifications";
CREATE POLICY "Admins can delete notifications"
ON "public"."notifications"
FOR DELETE
USING (
  exists (
    select 1 from user_roles
    where user_roles.user_id = auth.uid()
    and user_roles.role = 'admin'
  )
);

-- Policy for Everyone to VIEW
DROP POLICY IF EXISTS "Everyone can view notifications" ON "public"."notifications";
CREATE POLICY "Everyone can view notifications"
ON "public"."notifications"
FOR SELECT
USING (true);
