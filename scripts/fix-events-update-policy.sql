-- Debug and fix events table RLS policies for updates

-- First, let's check if there are any issues with the existing policy
DROP POLICY IF EXISTS "Organizers can manage their events" ON public.events;

-- Create more specific policies for better debugging
CREATE POLICY "Anyone can view published events" ON public.events
    FOR SELECT USING (status = 'published' OR auth.uid() = organizer_id);

CREATE POLICY "Organizers can insert their events" ON public.events
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their events" ON public.events
    FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their events" ON public.events
    FOR DELETE USING (auth.uid() = organizer_id);

-- Also allow admins to manage all events
CREATE POLICY "Admins can manage all events" ON public.events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

-- Add a function to help debug authentication issues
CREATE OR REPLACE FUNCTION debug_event_permissions(event_id UUID)
RETURNS TABLE (
    current_user_id UUID,
    event_organizer_id UUID,
    user_role TEXT,
    can_edit BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        auth.uid() as current_user_id,
        e.organizer_id as event_organizer_id,
        u.role as user_role,
        (auth.uid() = e.organizer_id OR u.role = 'admin') as can_edit
    FROM events e
    LEFT JOIN users u ON u.id = auth.uid()
    WHERE e.id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
