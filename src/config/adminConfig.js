/**
 * Admin Configuration & Event Mapping
 *
 * Set your authorized Supabase Admin email below.
 * You can also set VITE_ADMIN_EMAIL in the .env file.
 */
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'YOUR_ADMIN_EMAIL';

/**
 * Checks whether an authenticated user is the designated admin.
 * If ADMIN_EMAIL is still 'YOUR_ADMIN_EMAIL', allows the logged-in Supabase user
 * but logs a reminder to configure ADMIN_EMAIL for strict production security.
 */
export function isAuthorizedAdmin(user) {
  if (!user || !user.email) return false;
  if (!ADMIN_EMAIL || ADMIN_EMAIL === 'YOUR_ADMIN_EMAIL') {
    // If user hasn't set the specific email yet, allow any authenticated Supabase user
    // while notifying them in the console
    console.info(
      'Admin authorization notice: Set VITE_ADMIN_EMAIL or update ADMIN_EMAIL in src/config/adminConfig.js to restrict access to a specific email.'
    );
    return true;
  }
  return user.email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
}

/**
 * Human-friendly labels with icons for all technical event names.
 */
export const EVENT_LABELS = {
  LINK_OPENED: {
    label: 'Opened the surprise',
    icon: '🔗',
    badgeColor: '#93c5fd',
    badgeBg: 'rgba(59, 130, 246, 0.16)',
    borderColor: 'rgba(59, 130, 246, 0.35)'
  },
  PAGE_1_VIEWED: {
    label: 'Viewed the letter',
    icon: '💌',
    badgeColor: '#c7d2fe',
    badgeBg: 'rgba(99, 102, 241, 0.16)',
    borderColor: 'rgba(99, 102, 241, 0.35)'
  },
  ENVELOPE_OPENED: {
    label: 'Opened the envelope',
    icon: '✉️',
    badgeColor: '#fbcfe8',
    badgeBg: 'rgba(236, 72, 153, 0.16)',
    borderColor: 'rgba(236, 72, 153, 0.35)'
  },
  PAGE_2_VIEWED: {
    label: 'Viewed the sketch',
    icon: '🎨',
    badgeColor: '#e9d5ff',
    badgeBg: 'rgba(168, 85, 247, 0.16)',
    borderColor: 'rgba(168, 85, 247, 0.35)'
  },
  SKETCH_INTERACTION_STARTED: {
    label: 'Started the sketch',
    icon: '✏️',
    badgeColor: '#fef08a',
    badgeBg: 'rgba(234, 179, 8, 0.16)',
    borderColor: 'rgba(234, 179, 8, 0.35)'
  },
  SKETCH_COMPLETED: {
    label: 'Completed the sketch',
    icon: '✨',
    badgeColor: '#bbf7d0',
    badgeBg: 'rgba(34, 197, 94, 0.16)',
    borderColor: 'rgba(34, 197, 94, 0.35)'
  },
  SKETCH_DOWNLOADED: {
    label: 'Downloaded the sketch',
    icon: '⬇️',
    badgeColor: '#99f6e4',
    badgeBg: 'rgba(20, 184, 166, 0.16)',
    borderColor: 'rgba(20, 184, 166, 0.35)'
  },
  PAGE_3_VIEWED: {
    label: 'Visited memories',
    icon: '🎞️',
    badgeColor: '#ddd6fe',
    badgeBg: 'rgba(139, 92, 246, 0.16)',
    borderColor: 'rgba(139, 92, 246, 0.35)'
  },
  MEMORY_1_VIEWED: {
    label: 'Viewed Memory 1',
    icon: '📸',
    badgeColor: '#f9a8d4',
    badgeBg: 'rgba(244, 114, 182, 0.16)',
    borderColor: 'rgba(244, 114, 182, 0.35)'
  },
  MEMORY_2_VIEWED: {
    label: 'Viewed Memory 2',
    icon: '📸',
    badgeColor: '#f9a8d4',
    badgeBg: 'rgba(244, 114, 182, 0.16)',
    borderColor: 'rgba(244, 114, 182, 0.35)'
  },
  MEMORY_3_VIEWED: {
    label: 'Viewed Memory 3',
    icon: '📸',
    badgeColor: '#f9a8d4',
    badgeBg: 'rgba(244, 114, 182, 0.16)',
    borderColor: 'rgba(244, 114, 182, 0.35)'
  },
  MEMORY_4_VIEWED: {
    label: 'Viewed Memory 4',
    icon: '📸',
    badgeColor: '#f9a8d4',
    badgeBg: 'rgba(244, 114, 182, 0.16)',
    borderColor: 'rgba(244, 114, 182, 0.35)'
  },
  MEMORY_5_VIEWED: {
    label: 'Viewed Memory 5',
    icon: '📸',
    badgeColor: '#f9a8d4',
    badgeBg: 'rgba(244, 114, 182, 0.16)',
    borderColor: 'rgba(244, 114, 182, 0.35)'
  },
  VOICE_1_PLAYED: {
    label: 'Listened to Voice 1',
    icon: '🎙️',
    badgeColor: '#fed7aa',
    badgeBg: 'rgba(251, 146, 60, 0.16)',
    borderColor: 'rgba(251, 146, 60, 0.35)'
  },
  VOICE_2_PLAYED: {
    label: 'Listened to Voice 2',
    icon: '🎙️',
    badgeColor: '#fed7aa',
    badgeBg: 'rgba(251, 146, 60, 0.16)',
    borderColor: 'rgba(251, 146, 60, 0.35)'
  },
  VOICE_3_PLAYED: {
    label: 'Listened to Voice 3',
    icon: '🎙️',
    badgeColor: '#fed7aa',
    badgeBg: 'rgba(251, 146, 60, 0.16)',
    borderColor: 'rgba(251, 146, 60, 0.35)'
  },
  VOICE_4_PLAYED: {
    label: 'Listened to Voice 4',
    icon: '🎙️',
    badgeColor: '#fed7aa',
    badgeBg: 'rgba(251, 146, 60, 0.16)',
    borderColor: 'rgba(251, 146, 60, 0.35)'
  },
  VOICE_5_PLAYED: {
    label: 'Listened to Voice 5',
    icon: '🎙️',
    badgeColor: '#fed7aa',
    badgeBg: 'rgba(251, 146, 60, 0.16)',
    borderColor: 'rgba(251, 146, 60, 0.35)'
  },
  PAGE_4_VIEWED: {
    label: 'Reached birthday',
    icon: '🎂',
    badgeColor: '#fecdd3',
    badgeBg: 'rgba(244, 63, 94, 0.16)',
    borderColor: 'rgba(244, 63, 94, 0.35)'
  },
  CANDLES_STARTED: {
    label: 'Started candle interaction',
    icon: '🕯️',
    badgeColor: '#fed7aa',
    badgeBg: 'rgba(249, 115, 22, 0.16)',
    borderColor: 'rgba(249, 115, 22, 0.35)'
  },
  CANDLES_BLOWN: {
    label: 'Blew out the candles',
    icon: '💨',
    badgeColor: '#bae6fd',
    badgeBg: 'rgba(14, 165, 233, 0.16)',
    borderColor: 'rgba(14, 165, 233, 0.35)'
  },
  BIRTHDAY_COMPLETED: {
    label: 'Completed the birthday experience',
    icon: '❤️',
    badgeColor: '#a7f3d0',
    badgeBg: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.45)'
  }
};

/**
 * Ordered list of user milestones for the visitor progress checklist.
 */
export const MILESTONES_LIST = [
  { key: 'LINK_OPENED', label: 'Link opened' },
  { key: 'PAGE_1_VIEWED', label: 'Page 1' },
  { key: 'ENVELOPE_OPENED', label: 'Envelope opened' },
  { key: 'PAGE_2_VIEWED', label: 'Page 2' },
  { key: 'SKETCH_INTERACTION_STARTED', label: 'Sketch interaction' },
  { key: 'SKETCH_COMPLETED', label: 'Sketch completed' },
  { key: 'SKETCH_DOWNLOADED', label: 'Sketch downloaded' },
  { key: 'PAGE_3_VIEWED', label: 'Page 3' },
  { key: 'PAGE_4_VIEWED', label: 'Page 4' },
  { key: 'CANDLES_STARTED', label: 'Candles started' },
  { key: 'CANDLES_BLOWN', label: 'Candles blown' },
  { key: 'BIRTHDAY_COMPLETED', label: 'Birthday completed' }
];
