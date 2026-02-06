-- Add batch and division columns to team_members table
ALTER TABLE public.team_members
ADD COLUMN IF NOT EXISTS batch text,
ADD COLUMN IF NOT EXISTS division text;

-- Add comments for clarity
COMMENT ON COLUMN public.team_members.batch IS 'The batch year range, e.g., 2023-2026';
COMMENT ON COLUMN public.team_members.division IS 'The division/team within the club, e.g., Core Team, Technical Team, Media Team';

-- Optional: Create an index on division and batch for faster filtering
CREATE INDEX IF NOT EXISTS idx_team_members_division ON public.team_members(division);
CREATE INDEX IF NOT EXISTS idx_team_members_batch ON public.team_members(batch);
