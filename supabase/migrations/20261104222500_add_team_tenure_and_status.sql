-- Add tenure, is_current, and is_founding columns to team_members
ALTER TABLE public.team_members
ADD COLUMN IF NOT EXISTS tenure TEXT DEFAULT '2025–2026',
ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_founding BOOLEAN DEFAULT false;

-- Add comments for clarity
COMMENT ON COLUMN public.team_members.tenure IS 'Academic year or tenure range, e.g., 2025–2026, 2026–2027';
COMMENT ON COLUMN public.team_members.is_current IS 'True if the member is part of the currently active council; false for Hall of Fame / Past Councils';
COMMENT ON COLUMN public.team_members.is_founding IS 'True if the member belongs to the charter founding council';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_team_members_tenure ON public.team_members(tenure);
CREATE INDEX IF NOT EXISTS idx_team_members_is_current ON public.team_members(is_current);

-- Clean up any generic placeholder duplicates
DELETE FROM public.team_members 
WHERE name IN ('Events Coordinator', 'Core Member', 'Design Lead', 'Creative Lead');

-- Mark current members as 2025–2026 inaugural founding council
UPDATE public.team_members
SET tenure = '2025–2026',
    is_founding = true,
    is_current = true
WHERE tenure IS NULL OR tenure = '';

