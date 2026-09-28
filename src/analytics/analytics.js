import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initVisitorSession, touchSession } from './session';

/**
 * Standardized Analytics Event Names
 */
export const AnalyticsEvents = {
  LINK_OPENED: 'LINK_OPENED',
  PAGE_1_VIEWED: 'PAGE_1_VIEWED',
  ENVELOPE_OPENED: 'ENVELOPE_OPENED',
  PAGE_2_VIEWED: 'PAGE_2_VIEWED',
  SKETCH_INTERACTION_STARTED: 'SKETCH_INTERACTION_STARTED',
  SKETCH_COMPLETED: 'SKETCH_COMPLETED',
  SKETCH_DOWNLOADED: 'SKETCH_DOWNLOADED',
  PAGE_3_VIEWED: 'PAGE_3_VIEWED',
  MEMORY_1_VIEWED: 'MEMORY_1_VIEWED',
  MEMORY_2_VIEWED: 'MEMORY_2_VIEWED',
  MEMORY_3_VIEWED: 'MEMORY_3_VIEWED',
  MEMORY_4_VIEWED: 'MEMORY_4_VIEWED',
  MEMORY_5_VIEWED: 'MEMORY_5_VIEWED',
  VOICE_1_PLAYED: 'VOICE_1_PLAYED',
  VOICE_2_PLAYED: 'VOICE_2_PLAYED',
  VOICE_3_PLAYED: 'VOICE_3_PLAYED',
  VOICE_4_PLAYED: 'VOICE_4_PLAYED',
  VOICE_5_PLAYED: 'VOICE_5_PLAYED',
  PAGE_4_VIEWED: 'PAGE_4_VIEWED',
  CANDLES_STARTED: 'CANDLES_STARTED',
  CANDLES_BLOWN: 'CANDLES_BLOWN',
  BIRTHDAY_COMPLETED: 'BIRTHDAY_COMPLETED'
};

// Events that should be recorded at most once per anonymous session to avoid flooding
const ONCE_PER_SESSION_EVENTS = new Set([
  AnalyticsEvents.LINK_OPENED,
  AnalyticsEvents.PAGE_1_VIEWED,
  AnalyticsEvents.ENVELOPE_OPENED,
  AnalyticsEvents.PAGE_2_VIEWED,
  AnalyticsEvents.SKETCH_INTERACTION_STARTED,
  AnalyticsEvents.SKETCH_COMPLETED,
  AnalyticsEvents.SKETCH_DOWNLOADED,
  AnalyticsEvents.PAGE_3_VIEWED,
  AnalyticsEvents.MEMORY_1_VIEWED,
  AnalyticsEvents.MEMORY_2_VIEWED,
  AnalyticsEvents.MEMORY_3_VIEWED,
  AnalyticsEvents.MEMORY_4_VIEWED,
  AnalyticsEvents.MEMORY_5_VIEWED,
  AnalyticsEvents.VOICE_1_PLAYED,
  AnalyticsEvents.VOICE_2_PLAYED,
  AnalyticsEvents.VOICE_3_PLAYED,
  AnalyticsEvents.VOICE_4_PLAYED,
  AnalyticsEvents.VOICE_5_PLAYED,
  AnalyticsEvents.PAGE_4_VIEWED,
  AnalyticsEvents.CANDLES_STARTED,
  AnalyticsEvents.CANDLES_BLOWN,
  AnalyticsEvents.BIRTHDAY_COMPLETED
]);

// In-memory set of recorded events in this session
const recordedEventsInMemory = new Set();

/**
 * Checks if a one-time event was already dispatched in the active session
 */
function hasAlreadyTracked(eventName) {
  if (recordedEventsInMemory.has(eventName)) return true;

  try {
    const raw = sessionStorage.getItem('tracked_events_cache');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.includes(eventName)) {
        recordedEventsInMemory.add(eventName);
        return true;
      }
    }
  } catch {
    // Ignore storage errors
  }
  return false;
}

/**
 * Marks a one-time event as dispatched in session storage
 */
function markEventTracked(eventName) {
  recordedEventsInMemory.add(eventName);
  try {
    const raw = sessionStorage.getItem('tracked_events_cache');
    const list = raw ? JSON.parse(raw) : [];
    if (!list.includes(eventName)) {
      list.push(eventName);
      sessionStorage.setItem('tracked_events_cache', JSON.stringify(list));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Central tracking helper.
 * All analytics events MUST go through this function.
 *
 * @param {string} eventName - One of AnalyticsEvents.*
 * @param {string} page - Page name (e.g., 'page1', 'page2', 'page3', 'page4')
 * @param {object} metadata - Optional anonymous metadata (e.g., interaction details)
 */
export async function trackEvent(eventName, page = 'unknown', metadata = {}) {
  // Deduplicate milestone events
  if (ONCE_PER_SESSION_EVENTS.has(eventName) && hasAlreadyTracked(eventName)) {
    return;
  }

  // Mark as tracked immediately to prevent race conditions during async calls
  if (ONCE_PER_SESSION_EVENTS.has(eventName)) {
    markEventTracked(eventName);
  }

  if (!isSupabaseConfigured || !supabase) {
    // If Supabase credentials are not set, fail gracefully without error
    return;
  }

  try {
    // Ensure visitor session row exists before inserting analytics events
    const sessionId = await initVisitorSession();

    // Insert event
    await supabase.from('analytics_events').insert([
      {
        session_id: sessionId,
        event_name: eventName,
        page: page,
        metadata: metadata
      }
    ]);

    // Touch session timestamp in background
    touchSession();
  } catch (err) {
    // Never interrupt the user experience or throw to caller
    console.warn('Analytics event note:', err?.message || err);
  }
}
