-- Debug script for specific event update issue
-- This will help identify why the event update is failing

-- Check if the event exists
SELECT 
    id,
    title,
    organizer_id,
    status,
    created_at
FROM events 
WHERE id = '65500251-066b-4c81-aa3f-6e3ef67bef4f';

-- Check current user info
SELECT 
    auth.uid() as current_user_id,
    auth.jwt() ->> 'email' as current_user_email;

-- Check if current user is admin
SELECT 
    id,
    email,
    role,
    full_name
FROM users 
WHERE id = auth.uid();

-- Check RLS policies on events table
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
WHERE tablename = 'events';

-- Test if current user can see the event
SELECT 
    'Can see event' as test,
    count(*) as result
FROM events 
WHERE id = '65500251-066b-4c81-aa3f-6e3ef67bef4f';

-- Test if current user can theoretically update (without actually updating)
SELECT 
    'Can update check' as test,
    CASE 
        WHEN auth.uid() = organizer_id THEN 'Yes - is organizer'
        WHEN EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'organizer')) THEN 'Yes - is admin/organizer'
        ELSE 'No - insufficient permissions'
    END as result
FROM events 
WHERE id = '65500251-066b-4c81-aa3f-6e3ef67bef4f';
