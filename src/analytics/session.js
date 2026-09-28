import { supabase, isSupabaseConfigured } from '../lib/supabase';

const SESSION_STORAGE_KEY = 'surprise_session_id';

let sessionInitPromise = null;

/**
 * Generates an anonymous UUID or fallback string.
 * Strictly anonymous — no personal info, IP, or device fingerprinting.
 */
function generateAnonymousSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return (
    'sess_' +
    Math.random().toString(36).substring(2, 10) +
    '_' +
    Date.now().toString(36)
  );
}

/**
 * Generates or retrieves the persistent anonymous session ID.
 * Strictly anonymous — no personal info, IP, or device fingerprinting.
 */
export function getOrCreateSessionId() {
  if (typeof window === 'undefined') return 'server_session';

  try {
    let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = generateAnonymousSessionId();
      localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return 'fallback_session_' + Date.now();
  }
}

/**
 * Initializes the visitor session in Supabase public.visitor_sessions table.
 *
 * Flow:
 * 1. Checks localStorage for existing surprise_session_id.
 * 2. If it already exists:
 *    - Reuses it.
 *    - Does NOT create another visitor_sessions row.
 * 3. If it does not exist:
 *    - Generates a new anonymous session ID.
 *    - Saves it locally in localStorage.
 *    - Inserts exactly one row into public.visitor_sessions with:
 *      session_id, first_seen_at, created_at.
 * 4. Protected against duplicates using DB session_id UNIQUE constraint.
 * 5. Concurrent callers await the same in-flight Promise so only one DB insert is executed.
 *
 * @returns {Promise<string>} The anonymous session_id
 */
export async function initVisitorSession() {
  if (sessionInitPromise) return sessionInitPromise;

  sessionInitPromise = (async () => {
    try {
      let isNewVisitor = false;
      let sessionId = null;

      if (typeof window !== 'undefined') {
        try {
          sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
        } catch {
          // localStorage disabled or restricted
        }
      }

      if (sessionId) {
        // Returning visitor: reuse existing ID, do NOT create another visitor_sessions record
        return sessionId;
      }

      // New visitor: generate new anonymous session ID and save locally
      isNewVisitor = true;
      sessionId = generateAnonymousSessionId();

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
        } catch {
          // localStorage write failure fallback
        }
      }

      // Create exactly one row in public.visitor_sessions
      if (isNewVisitor && isSupabaseConfigured && supabase) {
        const now = new Date().toISOString();
        const { error } = await supabase.from('visitor_sessions').insert([
          {
            session_id: sessionId,
            first_seen_at: now,
            created_at: now
          }
        ]);

        if (error && error.code !== '23505') {
          console.warn('Visitor session creation note:', error.message || error);
        }
      }

      return sessionId;
    } catch (err) {
      console.warn('Anonymous session init note:', err?.message || err);
      return getOrCreateSessionId();
    }
  })();

  return sessionInitPromise;
}

/**
 * Touch session helper kept for backwards compatibility.
 */
export async function touchSession() {
  // Safe no-op — visitor_sessions schema stores first_seen_at and created_at
}
