-- Create notification_dismissals table to track which users have dismissed which notifications
CREATE TABLE IF NOT EXISTS public.notification_dismissals (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE NOT NULL,
    dismissed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (user_id, notification_id)
);

-- Enable RLS
ALTER TABLE public.notification_dismissals ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own dismissals
CREATE POLICY "Users can dismiss notifications"
ON public.notification_dismissals
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to see their own dismissals
CREATE POLICY "Users can view their own dismissals"
ON public.notification_dismissals
FOR SELECT
USING (auth.uid() = user_id);
