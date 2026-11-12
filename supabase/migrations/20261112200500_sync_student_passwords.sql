-- Migration: Enable centralized password sync for students
-- Description:
-- 1. Updates all existing student (non-admin) passwords in auth.users to 'BCAstudent@2026'
-- 2. Creates a secure RPC function to allow students entering the centralized passcode to sync their existing accounts

-- Ensure pgcrypto extension exists for hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 1. Mass update existing non-admin users to the centralized student password
UPDATE auth.users
SET encrypted_password = extensions.crypt('BCAstudent@2026', extensions.gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE id NOT IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
);

-- 2. Create RPC function for real-time / on-demand student password synchronization
CREATE OR REPLACE FUNCTION public.sync_student_password(user_email text, passcode text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = extensions, auth, public
AS $$
DECLARE
  v_user_id uuid;
  v_is_admin boolean := false;
BEGIN
  -- Validate that passcode matches accepted student passcodes
  IF passcode NOT IN ('BCAstudent@2026', 'bcastudent@2026', 'BuiltByBCA@2026', 'builtbybca@2026', 'BCA2026', 'bca2026') THEN
    RETURN false;
  END IF;

  -- Find the user by lowercase email
  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(trim(user_email));
  
  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Check if user is an admin; do NOT overwrite admin credentials
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = v_user_id AND role = 'admin'
  ) INTO v_is_admin;

  IF v_is_admin THEN
    RETURN false;
  END IF;

  -- Update to canonical centralized student password and confirm email
  UPDATE auth.users
  SET encrypted_password = extensions.crypt('BCAstudent@2026', extensions.gen_salt('bf')),
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now()
  WHERE id = v_user_id;

  RETURN true;
END;
$$;

-- Grant execution permission to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.sync_student_password(text, text) TO anon, authenticated;
