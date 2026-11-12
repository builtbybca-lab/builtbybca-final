-- Insert or Update Vaibhav B.H as Technical Lead in Founding Team (2025–2026)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.team_members WHERE name ILIKE '%vaibhav%') THEN
    UPDATE public.team_members
    SET 
      name = 'Vaibhav B.H',
      role = 'Technical Lead',
      division = 'Technical Team',
      image_url = 'https://rzqkhomoeoihxlqokeek.supabase.co/storage/v1/object/public/team-images/ggyorm3pt4-1771308681046.jpeg',
      tenure = '2025–2026',
      is_founding = true,
      is_current = false,
      display_order = 10,
      year = '2nd Year',
      batch = '2024–2027',
      bio = 'Technical Lead of the Founding Council (2025–2026). Dedicated to driving technical excellence, guiding student initiatives, and architecting real-world web solutions.'
    WHERE name ILIKE '%vaibhav%';
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
      'Vaibhav B.H',
      'Technical Lead',
      'Technical Team',
      'https://rzqkhomoeoihxlqokeek.supabase.co/storage/v1/object/public/team-images/ggyorm3pt4-1771308681046.jpeg',
      '2025–2026',
      true,
      false,
      10,
      '2nd Year',
      '2024–2027',
      'Technical Lead of the Founding Council (2025–2026). Dedicated to driving technical excellence, guiding student initiatives, and architecting real-world web solutions.'
    );
  END IF;
END $$;

