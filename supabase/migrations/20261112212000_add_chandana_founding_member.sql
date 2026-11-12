-- Insert or Update Chandana B.M as Vice-President in Founding Team (2025–2026)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.team_members WHERE name ILIKE '%chandana%') THEN
    UPDATE public.team_members
    SET 
      name = 'Chandana B.M',
      role = 'Vice-President',
      division = 'Core Team',
      image_url = 'https://rzqkhomoeoihxlqokeek.supabase.co/storage/v1/object/public/team-images/ql6a5ncorsf-1771308053372.jpeg',
      tenure = '2025–2026',
      is_founding = true,
      is_current = false,
      display_order = 2,
      year = '2nd Year',
      batch = '2024–2027',
      bio = 'Vice-President of the Founding Council (2025–2026). Dedicated to leadership, student community development, and operational coordination for BuiltBy.BCA.'
    WHERE name ILIKE '%chandana%';
  ELSE
    INSERT INTO public.team_members (
      name,
      role,
      division,
      image_url,
      tenure,
      is_founding,
      is_current,
      display_order,
      year,
      batch,
      bio
    ) VALUES (
      'Chandana B.M',
      'Vice-President',
      'Core Team',
      'https://rzqkhomoeoihxlqokeek.supabase.co/storage/v1/object/public/team-images/ql6a5ncorsf-1771308053372.jpeg',
      '2025–2026',
      true,
      false,
      2,
      '2nd Year',
      '2024–2027',
      'Vice-President of the Founding Council (2025–2026). Dedicated to leadership, student community development, and operational coordination for BuiltBy.BCA.'
    );
  END IF;
END $$;

