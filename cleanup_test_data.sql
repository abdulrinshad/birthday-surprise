-- =======================================================================
-- CLEAN UP DEVELOPMENT & INTEGRATION TEST DATA IN SUPABASE
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =======================================================================

BEGIN;

-- 1. Create a temporary table to log exactly which sessions are identified as test records
CREATE TEMP TABLE temp_deleted_sessions AS
SELECT session_id, first_seen_at, created_at
FROM public.visitor_sessions
WHERE 
    session_id LIKE 'test_%'
    OR session_id LIKE 'test_col_%'
    OR session_id LIKE 'col_%'
    OR session_id LIKE 'inspect_%'
    OR session_id LIKE 'duplicate_%'
    OR session_id LIKE 'upsert_%'
    OR session_id LIKE 'insert_%'
    OR session_id LIKE 'flow_%'
    OR session_id LIKE 'sim_%'
    OR session_id LIKE 'del_%'
    OR session_id = 'server_session';

-- 2. Create a temporary table to log test analytics events identified
CREATE TEMP TABLE temp_deleted_events AS
SELECT id, session_id, event_name, page, metadata, created_at
FROM public.analytics_events
WHERE 
    session_id LIKE 'test_%'
    OR session_id LIKE 'test_col_%'
    OR session_id LIKE 'col_%'
    OR session_id LIKE 'inspect_%'
    OR session_id LIKE 'duplicate_%'
    OR session_id LIKE 'upsert_%'
    OR session_id LIKE 'insert_%'
    OR session_id LIKE 'flow_%'
    OR session_id LIKE 'sim_%'
    OR session_id LIKE 'del_%'
    OR session_id = 'server_session'
    OR (metadata->>'simulated')::boolean = true
    OR (metadata->>'test')::boolean = true;

-- 3. Delete the identified test events from analytics_events
DELETE FROM public.analytics_events
WHERE id IN (SELECT id FROM temp_deleted_events);

-- 4. Delete the identified test sessions from visitor_sessions
DELETE FROM public.visitor_sessions
WHERE session_id IN (SELECT session_id FROM temp_deleted_sessions);

COMMIT;

-- =======================================================================
-- VERIFICATION & AUDIT REPORT
-- The queries below will display the results immediately after running
-- =======================================================================

-- A. Summary of deleted records
SELECT 
    (SELECT COUNT(*) FROM temp_deleted_sessions) AS deleted_visitor_sessions_count,
    (SELECT COUNT(*) FROM temp_deleted_events) AS deleted_analytics_events_count;

-- B. Total remaining genuine records
SELECT 
    (SELECT COUNT(*) FROM public.visitor_sessions) AS remaining_visitor_sessions,
    (SELECT COUNT(*) FROM public.analytics_events) AS remaining_analytics_events;

-- C. Preview of remaining visitor sessions
SELECT * FROM public.visitor_sessions ORDER BY created_at DESC;

-- D. Preview of remaining analytics events
SELECT session_id, event_name, page, created_at 
FROM public.analytics_events 
ORDER BY created_at DESC 
LIMIT 50;
