-- Step 1: Update existing user's role to admin
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = '1939233e-b1f9-486c-b5ad-4fd202c28b99';

-- Step 2: Fix the trigger function to be case-insensitive for future signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  
  -- Assign admin role to specific email (case-insensitive)
  IF LOWER(new.email) = 'builtby.bca@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'user');
  END IF;
  
  RETURN new;
END;
$$;