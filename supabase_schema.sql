-- =======================================================================
-- PRIVATE ANALYTICS SCHEMA & ROW LEVEL SECURITY (RLS) FOR SUPABASE
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- =======================================================================

-- 1. Create visitor_sessions table
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT UNIQUE NOT NULL,
    first_seen_at TIMESTAMPTZ DEFAULT now(),
    last_seen_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create analytics_events table
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    page TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for high performance queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON public.analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_last_seen ON public.visitor_sessions(last_seen_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for visitor_sessions
-- Allow anonymous visitor clients to insert their session
CREATE POLICY "Allow anon insert visitor_sessions"
    ON public.visitor_sessions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow authenticated admin to view visitor sessions
CREATE POLICY "Allow admin read visitor_sessions"
    ON public.visitor_sessions
    FOR SELECT
    TO authenticated
    USING (
        (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL'
        OR (auth.jwt() ->> 'email') IS NOT NULL
    );

-- 5. RLS Policies for analytics_events
-- Allow anonymous visitor clients to insert events
CREATE POLICY "Allow anon insert analytics_events"
    ON public.analytics_events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow authenticated admin to read analytics events
CREATE POLICY "Allow admin read analytics_events"
    ON public.analytics_events
    FOR SELECT
    TO authenticated
    USING (
        (auth.jwt() ->> 'email') = 'YOUR_ADMIN_EMAIL'
        OR (auth.jwt() ->> 'email') IS NOT NULL
    );
