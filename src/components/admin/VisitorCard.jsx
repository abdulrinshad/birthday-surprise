import { useState } from 'react';
import { EVENT_LABELS, MILESTONES_LIST } from '../../config/adminConfig';

/**
 * Formats ISO timestamp to: "28 Sep 2026 • 12:40 AM"
 */
function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const time = d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${day} ${month} ${year} • ${time}`;
  } catch {
    return iso;
  }
}

/**
 * Formats ISO timestamp to short time: "12:40 AM"
 */
function formatShortTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch {
    return iso;
  }
}

/**
 * VisitorCard:
 * Renders an anonymous visitor's session details, progress checklist,
 * and an interactive detailed journey timeline on click.
 */
export default function VisitorCard({ visitor, index, events = [], isSelected, onSelect }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Set of events completed by this session
  const completedEvents = new Set(events.map((e) => e.event_name));

  // Count how many milestones are completed
  const completedMilestones = MILESTONES_LIST.filter((m) => completedEvents.has(m.key)).length;
  const progressPercent = Math.round((completedMilestones / MILESTONES_LIST.length) * 100);

  // Chronologically sort events for the visitor's detailed timeline (oldest first)
  const sortedEvents = [...events].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  // Determine last activity time: latest event time or visitor created_at
  const latestEventTime = sortedEvents.length > 0 ? sortedEvents[sortedEvents.length - 1].created_at : null;
  const lastActiveTimestamp = latestEventTime || visitor.created_at || visitor.first_seen_at;

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    if (onSelect) onSelect(visitor);
  };

  return (
    <div
      style={{
        backgroundColor: '#16131b',
        border: isSelected || isExpanded
          ? '1px solid rgba(212, 139, 159, 0.45)'
          : '1px solid rgba(212, 139, 159, 0.16)',
        borderRadius: '14px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '18px',
        boxShadow: isSelected || isExpanded
          ? '0 12px 32px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(212, 139, 159, 0.2)'
          : '0 4px 16px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.25s ease'
      }}
    >
      {/* Top Header Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: 'rgba(116, 34, 78, 0.3)',
              border: '1px solid rgba(212, 139, 159, 0.25)',
              color: '#f7f1e6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.95rem'
            }}
          >
            #{index + 1}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#f7f1e6' }}>
                Visitor #{index + 1}
              </h3>
              <span
                style={{
                  fontSize: '0.74rem',
                  color: '#9e8e97',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontFamily: 'monospace'
                }}
              >
                Anonymous Session ({visitor.session_id ? `…${visitor.session_id.slice(-8)}` : 'active'})
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '6px' }}>
              <div style={{ fontSize: '0.8rem', color: '#b8adb4' }}>
                <span style={{ color: '#8f838c' }}>First Visit: </span>
                {formatDateTime(visitor.first_seen_at || visitor.created_at)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#b8adb4' }}>
                <span style={{ color: '#8f838c' }}>Last Activity: </span>
                {formatDateTime(lastActiveTimestamp)}
              </div>
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              backgroundColor: progressPercent === 100
                ? 'rgba(16, 185, 129, 0.2)'
                : 'rgba(212, 139, 159, 0.16)',
              color: progressPercent === 100 ? '#6ee7b7' : '#f2b5c4',
              border: `1px solid ${
                progressPercent === 100 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(212, 139, 159, 0.3)'
              }`
            }}
          >
            {progressPercent === 100 ? '🎉 Completed' : `${completedMilestones}/${MILESTONES_LIST.length} Milestones`}
          </span>

          <button
            type="button"
            onClick={toggleExpand}
            style={{
              background: 'none',
              border: 'none',
              color: '#d48b9f',
              fontSize: '0.8rem',
              cursor: 'pointer',
              padding: '2px 4px',
              textDecoration: 'underline',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isExpanded ? 'Hide Timeline ▲' : `View Timeline (${sortedEvents.length} events) ▼`}
          </button>
        </div>
      </div>

      {/* Progress Checklist Grid */}
      <div>
        <div
          style={{
            fontSize: '0.75rem',
            color: '#8f838c',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '8px',
            fontWeight: 600
          }}
        >
          Progress Checklist:
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '8px',
            backgroundColor: '#0e0b12',
            padding: '14px',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          {MILESTONES_LIST.map((milestone) => {
            const isCompleted = completedEvents.has(milestone.key);
            return (
              <div
                key={milestone.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  color: isCompleted ? '#f7f1e6' : '#5f5560'
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: isCompleted ? '#34d399' : '#4f4550',
                    border: isCompleted
                      ? '1px solid rgba(16, 185, 129, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  {isCompleted ? '✓' : '•'}
                </span>
                <span style={{ fontWeight: isCompleted ? 500 : 400 }}>
                  {milestone.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expanded Detailed Timeline */}
      {isExpanded && (
        <div
          style={{
            backgroundColor: '#0a080d',
            borderRadius: '10px',
            border: '1px solid rgba(212, 139, 159, 0.2)',
            padding: '18px',
            marginTop: '4px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(212, 139, 159, 0.15)',
              paddingBottom: '10px',
              marginBottom: '14px'
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f7f1e6', letterSpacing: '0.04em' }}>
              VISITOR #{index + 1} TIMELINE
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9e8e97' }}>
              {sortedEvents.length} total event{sortedEvents.length === 1 ? '' : 's'}
            </div>
          </div>

          {sortedEvents.length === 0 ? (
            <div style={{ color: '#8f838c', fontSize: '0.82rem', padding: '8px 0', textAlign: 'center' }}>
              No detailed events logged for this session yet.
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                position: 'relative',
                paddingLeft: '12px'
              }}
            >
              {/* Connecting line */}
              <div
                style={{
                  position: 'absolute',
                  left: '19px',
                  top: '12px',
                  bottom: '12px',
                  width: '2px',
                  backgroundColor: 'rgba(212, 139, 159, 0.2)'
                }}
              />

              {sortedEvents.map((ev, evIdx) => {
                const mapping = EVENT_LABELS[ev.event_name] || {
                  label: ev.event_name,
                  icon: '📌',
                  badgeColor: '#e2dbe6',
                  badgeBg: 'rgba(255, 255, 255, 0.1)'
                };

                return (
                  <div
                    key={ev.id || evIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {/* Timestamp on left */}
                    <div
                      style={{
                        minWidth: '68px',
                        fontSize: '0.76rem',
                        color: '#9e8e97',
                        fontFamily: 'monospace',
                        textAlign: 'right'
                      }}
                    >
                      {formatShortTime(ev.created_at)}
                    </div>

                    {/* Node Dot / Icon */}
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#16131b',
                        border: '1px solid rgba(212, 139, 159, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        flexShrink: 0
                      }}
                    >
                      {mapping.icon}
                    </div>

                    {/* Friendly Event Label & Page */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.85rem', color: '#f7f1e6', fontWeight: 500 }}>
                        {mapping.label}
                      </span>
                      {ev.page && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            color: '#8f838c',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            padding: '1px 6px',
                            borderRadius: '4px'
                          }}
                        >
                          {ev.page}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
