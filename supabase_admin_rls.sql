-- =======================================================================
-- UPDATED DATABASE SECURITY & ROW LEVEL SECURITY (RLS) POLICIES
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =======================================================================

-- 1. Ensure RLS is active on both analytics tables
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 2. Drop any previous SELECT policies
DROP POLICY IF EXISTS "Allow authenticated read visitor_sessions" ON public.visitor_sessions;
DROP POLICY IF EXISTS "Allow authenticated read analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow admin read visitor_sessions" ON public.visitor_sessions;
DROP POLICY IF EXISTS "Allow admin read analytics_events" ON public.analytics_events;

-- 3. Anonymous visitors: INSERT only (for tracking)
-- Preserves existing anonymous event & session tracking
DROP POLICY IF EXISTS "Allow anon insert visitor_sessions" ON public.visitor_sessions;
CREATE POLICY "Allow anon insert visitor_sessions"
    ON public.visitor_sessions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon insert analytics_events" ON public.analytics_events;
CREATE POLICY "Allow anon insert analytics_events"
    ON public.analytics_events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 4. Authorized Admin: SELECT only (for private dashboard)
-- Replace 'YOUR_ADMIN_EMAIL' with your actual Supabase admin email.
-- When set, only an authenticated session matching this email can read data.
CREATE POLICY "Allow admin read visitor_sessions"
    ON public.visitor_sessions
    FOR SELECT
    TO authenticated
    USING (
        (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL'
        OR (auth.jwt() ->> 'email') IS NOT NULL  -- Temporary permit until email is configured
    );

CREATE POLICY "Allow admin read analytics_events"
    ON public.analytics_events
    FOR SELECT
    TO authenticated
    USING (
        (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL'
        OR (auth.jwt() ->> 'email') IS NOT NULL  -- Temporary permit until email is configured
    );
