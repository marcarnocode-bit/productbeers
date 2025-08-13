-- Final fix for events RLS policies
-- This ensures admins and organizers can properly update events

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Anyone can view published events" ON events;
DROP POLICY IF EXISTS "Organizers can manage their events" ON events;
DROP POLICY IF EXISTS "Admins can view all events" ON events;
DROP POLICY IF EXISTS "Admins can create events" ON events;
DROP POLICY IF EXISTS "Admins can update all events" ON events;
DROP POLICY IF EXISTS "Admins can delete all events" ON events;
DROP POLICY IF EXISTS "Organizers can view their events" ON events;
DROP POLICY IF EXISTS "Organizers can create events" ON events;
DROP POLICY IF EXISTS "Organizers can update their events" ON events;
DROP POLICY IF EXISTS "Organizers can delete their events" ON events;

-- Create comprehensive policies
-- SELECT: Anyone can view published events, admins/organizers can view all
CREATE POLICY "Public can view published events" ON events
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins and organizers can view all events" ON events
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'organizer')
        )
    );

-- INSERT: Only admins and organizers can create events
CREATE POLICY "Admins and organizers can create events" ON events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('admin', 'organizer')
        )
    );

-- UPDATE: Admins can update any event, organizers can update their own events
CREATE POLICY "Admins can update all events" ON events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Organizers can update their events" ON events
    FOR UPDATE USING (
        auth.uid() = organizer_id 
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'organizer'
        )
    );

-- DELETE: Admins can delete any event, organizers can delete their own events
CREATE POLICY "Admins can delete all events" ON events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Organizers can delete their events" ON events
    FOR DELETE USING (
        auth.uid() = organizer_id 
        AND EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'organizer'
        )
    );
