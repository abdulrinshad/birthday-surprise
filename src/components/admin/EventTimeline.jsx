import { EVENT_LABELS } from '../../config/adminConfig';

/**
 * EventTimeline:
 * Displays recent analytics events in chronological order with friendly labels,
 * icons, visitor IDs, and timestamps.
 */
export default function EventTimeline({ events = [] }) {
  if (!events.length) {
    return (
      <div
        style={{
          padding: '32px 20px',
          textAlign: 'center',
          color: '#8f838c',
          fontSize: '0.86rem',
          backgroundColor: '#16131b',
          borderRadius: '12px',
          border: '1px solid rgba(212, 139, 159, 0.15)'
        }}
      >
        No activity recorded yet.
      </div>
    );
  }

  const formatTimestamp = (iso) => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
      const date = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      return `${time} • ${date}`;
    } catch {
      return iso;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxHeight: '560px',
        overflowY: 'auto',
        paddingRight: '6px'
      }}
    >
      {events.map((ev, idx) => {
        const mapping = EVENT_LABELS[ev.event_name] || {
          label: ev.event_name,
          icon: '📌',
          badgeColor: '#e2dbe6',
          badgeBg: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.15)'
        };

        return (
          <div
            key={ev.id || `${ev.session_id}_${idx}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 14px',
              backgroundColor: '#16131b',
              borderRadius: '10px',
              border: '1px solid rgba(212, 139, 159, 0.12)',
              fontSize: '0.86rem',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  backgroundColor: mapping.badgeBg,
                  color: mapping.badgeColor,
                  border: `1px solid ${mapping.borderColor}`,
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{mapping.icon}</span>
                <span>{mapping.label}</span>
              </span>

              <span
                style={{
                  color: '#9e8e97',
                  fontSize: '0.74rem',
                  fontFamily: 'monospace',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
                title={ev.session_id}
              >
                {ev.session_id ? `…${ev.session_id.slice(-8)}` : 'anon'}
              </span>
            </div>

            <div
              style={{
                color: '#8f838c',
                fontSize: '0.74rem',
                whiteSpace: 'nowrap',
                fontFamily: 'monospace'
              }}
            >
              {formatTimestamp(ev.created_at)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
