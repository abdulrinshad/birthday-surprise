import { motion } from 'framer-motion';

/**
 * GraphiteTools:
 * Artist studio tray containing:
 * - Black graphite powder dish
 * - Shading tools (Sponge, Blending Stump, Dusting Brush)
 * - Brush stroke width presets
 * - Quick-Waft powder sweep action
 */
export default function GraphiteTools({
  activeTool,
  onSelectTool,
  brushSize,
  onSelectBrushSize,
  onWaftPowder,
  onClearPaper,
  coveragePercent = 0
}) {
  const tools = [
    {
      id: 'sponge',
      label: 'Graphite Sponge',
      subtitle: 'Velvety broad shade',
      icon: '🧽'
    },
    {
      id: 'stump',
      label: 'Blending Stump',
      subtitle: 'Precision tortillon',
      icon: '✏️'
    },
    {
      id: 'brush',
      label: 'Dusting Brush',
      subtitle: 'Soft carbon sweep',
      icon: '🖌️'
    }
  ];

  const sizes = [
    { id: 'small', label: 'Fine' },
    { id: 'medium', label: 'Medium' },
    { id: 'large', label: 'Broad' }
  ];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '540px',
        margin: '18px auto 0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* Upper Bar: Powder Dish & Tool Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          backgroundColor: 'rgba(22, 10, 20, 0.75)',
          border: '1px solid rgba(212, 139, 159, 0.22)',
          borderRadius: '16px',
          padding: '10px 16px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Powder Dish Indicator */}
        <div
          title="Finest Archival Graphite Powder"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {/* Circular dish with graphite shimmer */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onWaftPowder}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 40%, #363238 0%, #161418 70%, #0d0b0f 100%)',
              border: '2px solid rgba(223, 184, 158, 0.4)',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.6), inset 0 2px 6px rgba(0, 0, 0, 0.8)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {/* Shimmering graphite core */}
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #524e54 0%, #201e22 80%)',
                boxShadow: '0 0 8px rgba(223, 184, 158, 0.3)'
              }}
            />
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.88rem',
                color: 'var(--text-cream)',
                letterSpacing: '0.04em',
                lineHeight: 1.1
              }}
            >
              Graphite Powder
            </span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.70rem',
                color: 'var(--accent-rose-soft)',
                letterSpacing: '0.05em'
              }}
            >
              Velvety carbon dust
            </span>
          </div>
        </div>

        {/* Tool Selectors */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(12, 6, 12, 0.55)',
            padding: '4px',
            borderRadius: '999px',
            border: '1px solid rgba(212, 139, 159, 0.15)'
          }}
        >
          {tools.map((tool) => {
            const isSelected = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => onSelectTool(tool.id)}
                title={`${tool.label} (${tool.subtitle})`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: 'none',
                  backgroundColor: isSelected
                    ? 'rgba(212, 139, 159, 0.28)'
                    : 'transparent',
                  color: isSelected ? 'var(--text-cream)' : 'var(--text-muted)',
                  fontSize: '0.74rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: isSelected ? 500 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{tool.icon}</span>
                <span className="tool-label-text">{tool.label.split(' ')[1] || tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lower Bar: Brush Sizes & Quick Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '0 4px'
        }}
      >
        {/* Stroke Size Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.04em'
            }}
          >
            Tip:
          </span>
          {sizes.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectBrushSize(s.id)}
              style={{
                background: brushSize === s.id
                  ? 'rgba(212, 139, 159, 0.2)'
                  : 'rgba(22, 10, 20, 0.4)',
                border: brushSize === s.id
                  ? '1px solid rgba(212, 139, 159, 0.45)'
                  : '1px solid rgba(212, 139, 159, 0.12)',
                color: brushSize === s.id ? 'var(--text-cream)' : 'var(--text-muted)',
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '0.70rem',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Quick Action Helpers */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {/* Quick-Waft Powder Sweep Button */}
          <button
            type="button"
            onClick={onWaftPowder}
            style={{
              background: 'rgba(223, 184, 158, 0.14)',
              border: '1px solid rgba(223, 184, 158, 0.35)',
              color: 'var(--accent-gold)',
              borderRadius: '999px',
              padding: '4px 12px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s ease'
            }}
            title="Sprinkle a quick puff of graphite powder onto the paper"
          >
            <span>✦</span>
            <span>Waft Powder</span>
          </button>

          {/* Reset / Blank Paper Button (if some coverage exists) */}
          {coveragePercent > 5 && (
            <button
              type="button"
              onClick={onClearPaper}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.70rem',
                fontFamily: 'var(--font-sans)',
                cursor: 'pointer',
                opacity: 0.75,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => (e.target.style.opacity = '1')}
              onMouseLeave={(e) => (e.target.style.opacity = '0.75')}
              title="Reset to blank paper"
            >
              Clear ↺
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
