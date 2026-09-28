import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import VisitorCard from './VisitorCard';
import EventTimeline from './EventTimeline';

/**
 * AnalyticsDashboard:
 * Private analytics view displaying visitor engagement, milestone completions,
 * top summary statistics, and real-time event activity streams.
 */
export default function AnalyticsDashboard({ adminUser, onSignOut }) {
  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  // Fetch real analytics data from Supabase
  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (!supabase) return;
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setHasError(false);

    try {
      // 1. Fetch visitor sessions (ordered by creation descending)
      const { data: sessionData, error: sessionErr } = await supabase
        .from('visitor_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (sessionErr) throw sessionErr;

      // 2. Fetch analytics events (ordered by creation descending)
      const { data: eventData, error: eventErr } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (eventErr) throw eventErr;

      setSessions(sessionData || []);
      setEvents(eventData || []);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setHasError(true);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Setup lightweight Supabase Realtime listener
    let channel = null;
    try {
      channel = supabase
        .channel('admin_analytics_live')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'visitor_sessions' },
          (payload) => {
            if (payload?.new) {
              setSessions((prev) => {
                if (prev.some((s) => s.session_id === payload.new.session_id)) return prev;
                return [payload.new, ...prev];
              });
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'analytics_events' },
          (payload) => {
            if (payload?.new) {
              setEvents((prev) => [payload.new, ...prev]);
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Realtime subscription note:', err);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchData]);

  // Dynamic calculations based strictly on actual Supabase data
  const uniqueVisitorIds = new Set(sessions.map((s) => s.session_id));
  const totalVisitors = uniqueVisitorIds.size;
  const totalSessions = sessions.length;

  const sketchDownloads = events.filter((e) => e.event_name === 'SKETCH_DOWNLOADED').length;

  const birthdayCompletions = sessions.filter((s) => {
    const sEvents = events.filter((e) => e.session_id === s.session_id);
    return sEvents.some((e) => e.event_name === 'BIRTHDAY_COMPLETED');
  }).length;

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0c0a0f',
        color: '#e2dbe6',
        padding: '36px 20px',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
        {/* Top Header Bar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
            paddingBottom: '20px',
            borderBottom: '1px solid rgba(212, 139, 159, 0.15)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>📊</span>
              <h1
                style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#f7f1e6',
                  letterSpacing: '-0.02em'
                }}
              >
                A Little Surprise
              </h1>
            </div>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '0.85rem',
                color: '#d48b9f',
                fontWeight: 500,
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              Private Analytics
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {adminUser?.email && (
              <span
                style={{
                  fontSize: '0.78rem',
                  color: '#9e8e97',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '6px 12px',
                  borderRadius: '6px'
                }}
              >
                {adminUser.email}
              </span>
            )}

            <button
              type="button"
              onClick={() => fetchData(true)}
              disabled={loading || isRefreshing}
              style={{
                backgroundColor: 'rgba(212, 139, 159, 0.12)',
                border: '1px solid rgba(212, 139, 159, 0.3)',
                color: '#f7f1e6',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 500,
                cursor: loading || isRefreshing ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease',
                opacity: loading || isRefreshing ? 0.6 : 1
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none'
                }}
              >
                ↻
              </span>
              <span>{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
            </button>

            <button
              type="button"
              onClick={onSignOut}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.22)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.12)';
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                border: '3px solid rgba(212, 139, 159, 0.2)',
                borderTopColor: '#d48b9f',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}
            />
            <div style={{ color: '#9e8e97', fontSize: '0.92rem' }}>
              Loading analytics data from Supabase…
            </div>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}

        {/* Error State */}
        {!loading && hasError && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '12px',
              padding: '28px 24px',
              textAlign: 'center',
              margin: '32px 0'
            }}
          >
            <div style={{ fontSize: '1.3rem', marginBottom: '8px' }}>⚠️</div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#fca5a5', margin: '0 0 6px 0' }}>
              Unable to load analytics.
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#e5b8b8', margin: '0 0 18px 0' }}>
              Please check your connection and ensure database permissions are configured.
            </p>
            <button
              type="button"
              onClick={() => fetchData(false)}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.25)',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                color: '#fef2f2',
                padding: '8px 20px',
                borderRadius: '8px',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loaded Content */}
        {!loading && !hasError && (
          <>
            {/* Top Statistics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '16px',
                marginBottom: '36px'
              }}
            >
              <div
                style={{
                  backgroundColor: '#16131b',
                  border: '1px solid rgba(212, 139, 159, 0.18)',
                  borderRadius: '12px',
                  padding: '22px 20px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: '#9e8e97',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 600
                  }}
                >
                  TOTAL VISITORS
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#f7f1e6', marginTop: '6px' }}>
                  {totalVisitors}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8f838c', marginTop: '4px' }}>
                  Unique anonymous visitors
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#16131b',
                  border: '1px solid rgba(212, 139, 159, 0.18)',
                  borderRadius: '12px',
                  padding: '22px 20px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: '#9e8e97',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 600
                  }}
                >
                  TOTAL SESSIONS
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#f7f1e6', marginTop: '6px' }}>
                  {totalSessions}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8f838c', marginTop: '4px' }}>
                  Recorded visitor sessions
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#16131b',
                  border: '1px solid rgba(212, 139, 159, 0.18)',
                  borderRadius: '12px',
                  padding: '22px 20px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: '#9e8e97',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 600
                  }}
                >
                  SKETCH DOWNLOADS
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fed7aa', marginTop: '6px' }}>
                  {sketchDownloads}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8f838c', marginTop: '4px' }}>
                  Artwork saved to device
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#16131b',
                  border: '1px solid rgba(212, 139, 159, 0.18)',
                  borderRadius: '12px',
                  padding: '22px 20px',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.78rem',
                    color: '#9e8e97',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 600
                  }}
                >
                  BIRTHDAY COMPLETIONS
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#6ee7b7', marginTop: '6px' }}>
                  {birthdayCompletions}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8f838c', marginTop: '4px' }}>
                  Reached final milestone
                </div>
              </div>
            </div>

            {/* Main Content: Visitors List on Left, Live Event Feed on Right */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '24px'
              }}
            >
              {/* Visitors Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f7f1e6', margin: 0 }}>
                    Visitor Journeys ({sessions.length})
                  </h2>
                </div>

                {sessions.length === 0 ? (
                  <div
                    style={{
                      padding: '40px 24px',
                      textAlign: 'center',
                      backgroundColor: '#16131b',
                      borderRadius: '14px',
                      border: '1px solid rgba(212, 139, 159, 0.15)'
                    }}
                  >
                    <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>💌</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f7f1e6', marginBottom: '4px' }}>
                      No visits yet.
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#9e8e97' }}>
                      This is where the first surprise visit will appear.
                    </div>
                  </div>
                ) : (
                  sessions.map((visitor, idx) => {
                    const visitorEvents = events.filter((e) => e.session_id === visitor.session_id);
                    return (
                      <VisitorCard
                        key={visitor.id || visitor.session_id}
                        visitor={visitor}
                        index={idx}
                        events={visitorEvents}
                        isSelected={selectedVisitor?.session_id === visitor.session_id}
                        onSelect={(vis) => setSelectedVisitor(vis)}
                      />
                    );
                  })
                )}
              </div>

              {/* Recent Events Feed Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f7f1e6', margin: 0 }}>
                    Live Activity Feed ({events.length})
                  </h2>
                </div>

                <EventTimeline events={events} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
