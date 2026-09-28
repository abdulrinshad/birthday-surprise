import { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { isAuthorizedAdmin } from '../../config/adminConfig';

/**
 * AdminLogin:
 * Professional dark-themed login screen for the private analytics dashboard.
 * Requires Supabase Authentication (email + password).
 * Strictly forbids public account creation.
 */
export default function AdminLogin({ onLoginSuccess, authErrorMessage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(authErrorMessage || null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Supabase credentials are not configured in your .env file.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        setErrorMsg(error.message || 'Invalid login credentials.');
        setLoading(false);
        return;
      }

      if (!data?.user || !data?.session) {
        setErrorMsg('Authentication failed. Please verify credentials.');
        setLoading(false);
        return;
      }

      // 2. Authorize admin identity
      if (!isAuthorizedAdmin(data.user)) {
        await supabase.auth.signOut();
        setErrorMsg('Access denied: You are not authorized to view this dashboard.');
        setLoading(false);
        return;
      }

      // 3. Grant access
      if (onLoginSuccess) {
        onLoginSuccess(data.session, data.user);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your admin email above first.');
      return;
    }

    setForgotLoading(true);
    setErrorMsg(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + '/admin'
      });
      if (error) {
        setErrorMsg(error.message);
      } else {
        setForgotSent(true);
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Error requesting password reset.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#0c0a0f',
        color: '#e2dbe6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(116, 34, 78, 0.18) 0%, rgba(12, 10, 15, 0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(22, 19, 27, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 139, 159, 0.2)',
          borderRadius: '16px',
          padding: '36px 28px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(212, 139, 159, 0.15)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(212, 139, 159, 0.1)',
              border: '1px solid rgba(212, 139, 159, 0.25)',
              color: '#d48b9f',
              fontSize: '1.25rem',
              marginBottom: '14px'
            }}
          >
            🔒
          </div>
          <h1
            style={{
              fontSize: '1.45rem',
              fontWeight: 600,
              color: '#f7f1e6',
              margin: '0 0 6px 0',
              letterSpacing: '-0.02em'
            }}
          >
            A Little Surprise
          </h1>
          <p
            style={{
              fontSize: '0.85rem',
              color: '#9e8e97',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 500
            }}
          >
            Private Access
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
              padding: '11px 14px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              marginBottom: '20px',
              lineHeight: 1.45
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              htmlFor="admin-email"
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 500,
                color: '#d5cad1',
                marginBottom: '6px'
              }}
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(212, 139, 159, 0.25)',
                backgroundColor: '#0e0b12',
                color: '#f7f1e6',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(212, 139, 159, 0.6)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(212, 139, 159, 0.25)';
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label
                htmlFor="admin-password"
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: '#d5cad1'
                }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(!showForgotPassword)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d48b9f',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  padding: 0,
                  opacity: 0.85
                }}
              >
                Forgot password?
              </button>
            </div>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(212, 139, 159, 0.25)',
                backgroundColor: '#0e0b12',
                color: '#f7f1e6',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(212, 139, 159, 0.6)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(212, 139, 159, 0.25)';
              }}
            />
          </div>

          {/* Forgot Password Sub-Panel */}
          {showForgotPassword && (
            <div
              style={{
                backgroundColor: 'rgba(212, 139, 159, 0.08)',
                border: '1px solid rgba(212, 139, 159, 0.2)',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '0.8rem',
                color: '#d5cad1'
              }}
            >
              {forgotSent ? (
                <div style={{ color: '#6ee7b7' }}>
                  ✓ Password reset link sent to your email. Check your inbox.
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    Send password reset email to: <strong>{email || '(enter email above)'}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading || !email.trim()}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(212, 139, 159, 0.35)',
                      backgroundColor: 'rgba(116, 34, 78, 0.3)',
                      color: '#f7f1e6',
                      fontSize: '0.78rem',
                      cursor: forgotLoading || !email.trim() ? 'not-allowed' : 'pointer',
                      opacity: forgotLoading || !email.trim() ? 0.6 : 1
                    }}
                  >
                    {forgotLoading ? 'Sending…' : 'Send Reset Link'}
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #74224e 0%, #4a1532 100%)',
              color: '#f7f1e6',
              fontSize: '0.92rem',
              fontWeight: 600,
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: '0 4px 14px rgba(116, 34, 78, 0.35)',
              transition: 'opacity 0.2s ease, transform 0.1s ease',
              opacity: loading ? 0.75 : 1
            }}
          >
            {loading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a
            href="/"
            style={{
              color: '#9e8e97',
              fontSize: '0.82rem',
              textDecoration: 'none',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#f7f1e6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9e8e97';
            }}
          >
            ← Return to Surprise Experience
          </a>
        </div>
      </div>
    </div>
  );
}
