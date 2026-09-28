import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { isAuthorizedAdmin } from '../config/adminConfig';
import AdminLogin from '../components/admin/AdminLogin';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

/**
 * Admin Page:
 * Private route for the surprise creator to securely monitor visitor engagement.
 * Requires Supabase Authentication & Admin Email Authorization.
 */
export default function Admin() {
  const [session, setSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Validate user authentication & admin authorization
  const validateUser = useCallback(async (currentSession) => {
    if (!currentSession) {
      setSession(null);
      setCurrentUser(null);
      setLoading(false);
      return;
    }

    try {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();

      if (error || !user) {
        await supabase.auth.signOut();
        setSession(null);
        setCurrentUser(null);
        setAuthError(error?.message || 'Session expired. Please sign in again.');
        setLoading(false);
        return;
      }

      // Check authorization
      if (!isAuthorizedAdmin(user)) {
        await supabase.auth.signOut();
        setSession(null);
        setCurrentUser(null);
        setAuthError('Access denied: You are not authorized to view this dashboard.');
        setLoading(false);
        return;
      }

      setAuthError(null);
      setCurrentUser(user);
      setSession(currentSession);
    } catch (err) {
      console.error('Auth verification error:', err);
      setAuthError('Error validating admin credentials.');
      setSession(null);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      setAuthError('Supabase is not configured in .env file.');
      return;
    }

    // 1. Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      validateUser(session);
    });

    // 2. Listen for auth changes (login, logout, token refresh)
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === 'SIGNED_OUT' || !newSession) {
        setSession(null);
        setCurrentUser(null);
        setLoading(false);
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        validateUser(newSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [validateUser]);

  const handleSignOut = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Sign out note:', err);
      }
    }
    setSession(null);
    setCurrentUser(null);
    setAuthError(null);
  };

  const handleLoginSuccess = (newSession, user) => {
    setAuthError(null);
    setCurrentUser(user);
    setSession(newSession);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: '#0c0a0f',
          color: '#d48b9f',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          gap: '14px'
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(212, 139, 159, 0.2)',
            borderTopColor: '#d48b9f',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <div style={{ fontSize: '0.9rem', color: '#9e8e97' }}>
          Verifying private access…
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!session || !currentUser) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
        authErrorMessage={authError}
      />
    );
  }

  return (
    <AnalyticsDashboard
      adminUser={currentUser}
      onSignOut={handleSignOut}
    />
  );
}
