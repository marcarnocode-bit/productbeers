-- Create debugging script to check event permissions
-- Debug script to check event update permissions

-- Function to debug current user permissions for a specific event
CREATE OR REPLACE FUNCTION debug_event_update_permissions(event_id UUID)
RETURNS TABLE (
    current_user_id UUID,
    event_organizer_id UUID,
    user_role TEXT,
    user_exists BOOLEAN,
    organizer_match BOOLEAN,
    is_admin BOOLEAN,
    can_update BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        auth.uid() as current_user_id,
        e.organizer_id as event_organizer_id,
        COALESCE(u.role, 'no_user') as user_role,
        (u.id IS NOT NULL) as user_exists,
        (auth.uid() = e.organizer_id) as organizer_match,
        (u.role = 'admin') as is_admin,
        (auth.uid() = e.organizer_id OR u.role = 'admin') as can_update
    FROM events e
    LEFT JOIN users u ON u.id = auth.uid()
    WHERE e.id = event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the current RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'events' 
ORDER BY policyname;
