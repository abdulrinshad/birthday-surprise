import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * MemoryNavigation:
 * Elegant, minimal controls:
 * ← Previous | 01 / 05 with delicate progress dots | Next →
 */
export default function MemoryNavigation({
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
  onSelectIndex
}) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalCount - 1;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        maxWidth: '440px',
        margin: '24px auto 0 auto'
      }}
    >
      {/* Navigation Buttons & Progress Counter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '0 8px'
        }}
      >
        {/* Previous Button */}
        <motion.button
          type="button"
          id="memory-nav-prev"
          aria-label="Previous memory"
          onClick={onPrevious}
          disabled={isFirst}
          whileHover={!isFirst ? { x: -2 } : {}}
          whileTap={!isFirst ? { scale: 0.95 } : {}}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.84rem',
            letterSpacing: '0.04em',
            color: isFirst ? 'rgba(158, 142, 151, 0.35)' : 'var(--text-muted)',
            cursor: isFirst ? 'default' : 'pointer',
            padding: '10px 14px',
            borderRadius: '999px',
            background: 'transparent',
            transition: 'color 0.2s ease',
            pointerEvents: isFirst ? 'none' : 'auto'
          }}
        >
          <ChevronLeft size={16} strokeWidth={2.2} />
          <span>Previous</span>
        </motion.button>

        {/* Numeric Progress Counter: e.g. 01 / 05 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.82rem',
            letterSpacing: '0.12em',
            color: 'var(--accent-rose-soft)',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 500
          }}
        >
          <span style={{ color: 'var(--text-cream)', fontWeight: 600 }}>
            0{currentIndex + 1}
          </span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ opacity: 0.7 }}>0{totalCount}</span>
        </div>

        {/* Next / Proceed Button */}
        <motion.button
          type="button"
          id="memory-nav-next"
          aria-label={isLast ? 'View final transition' : 'Next memory'}
          onClick={onNext}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.84rem',
            letterSpacing: '0.04em',
            color: isLast ? 'var(--accent-rose)' : 'var(--text-ivory)',
            cursor: 'pointer',
            padding: '10px 14px',
            borderRadius: '999px',
            background: isLast ? 'rgba(212, 139, 159, 0.12)' : 'transparent',
            border: isLast
              ? '1px solid rgba(212, 139, 159, 0.3)'
              : '1px solid transparent',
            transition: 'all 0.25s ease'
          }}
        >
          <span>{isLast ? 'Next' : 'Next'}</span>
          <ChevronRight size={16} strokeWidth={2.2} />
        </motion.button>
      </div>

      {/* Five Delicate Indicator Dots */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
        role="tablist"
        aria-label="Memories progression"
      >
        {Array.from({ length: totalCount }).map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Go to memory 0${idx + 1}`}
              onClick={() => onSelectIndex(idx)}
              style={{
                width: isActive ? '20px' : '6px',
                height: '6px',
                borderRadius: '999px',
                backgroundColor: isActive
                  ? 'var(--accent-rose)'
                  : 'rgba(212, 139, 159, 0.22)',
                boxShadow: isActive
                  ? '0 0 10px rgba(212, 139, 159, 0.6)'
                  : 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)'
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
