-- Step 1: Drop the old function to ensure a clean state.
DROP FUNCTION IF EXISTS public.get_published_events();

-- Step 2: Create the function with the corrected 'status' type.
-- The 'status' column in the function's return table is now correctly defined as TEXT.
CREATE OR REPLACE FUNCTION public.get_published_events()
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    location TEXT,
    is_virtual BOOLEAN,
    max_participants INT,
    image_url TEXT,
    status TEXT, -- CORRECTED: Changed from 'event_status' to 'TEXT' to match the table schema.
    organizer_name TEXT,
    registrations_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        e.id,
        e.title,
        e.description,
        e.start_date,
        e.end_date,
        e.location,
        e.is_virtual,
        e.max_participants,
        e.image_url,
        e.status,
        p.full_name AS organizer_name,
        (SELECT COUNT(*) FROM event_registrations er WHERE er.event_id = e.id) AS registrations_count
    FROM
        events e
    LEFT JOIN
        profiles p ON e.organizer_id = p.id
    WHERE
        e.status = 'published'
        AND e.end_date >= NOW()
    ORDER BY
        e.start_date ASC;
END;
$$;

-- Step 3: Grant execution rights to the necessary roles.
GRANT EXECUTE ON FUNCTION public.get_published_events() TO anon;
GRANT EXECUTE ON FUNCTION public.get_published_events() TO authenticated;
