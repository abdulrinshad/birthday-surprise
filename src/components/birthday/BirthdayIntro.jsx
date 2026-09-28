import { useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Stage 1: BirthdayIntro
 * Preserves the cinematic introductory text:
 * "One Last Little Surprise…"
 * "And now, something I've been waiting to tell you."
 * Smoothly auto-advances to the cake reveal, or allows immediate continuation.
 */
export default function BirthdayIntro({ onProceed, onBack }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onProceed();
    }, 4200);

    return () => clearTimeout(timer);
  }, [onProceed]);

  return (
    <motion.div
      key="birthday-intro-stage"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: '100%',
        maxWidth: '580px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'clamp(36px, 6vw, 56px) clamp(24px, 5vw, 44px)',
        background:
          'linear-gradient(165deg, rgba(28, 11, 26, 0.82) 0%, rgba(16, 7, 16, 0.9) 100%)',
        border: '1px solid rgba(212, 139, 159, 0.22)',
        boxShadow:
          '0 30px 70px -15px rgba(0, 0, 0, 0.82), 0 0 50px rgba(168, 75, 101, 0.18)',
        borderRadius: '28px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'relative',
        zIndex: 2
      }}
    >
      {/* Delicate glowing star emblem */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'rgba(212, 139, 159, 0.1)',
          border: '1px solid rgba(212, 139, 159, 0.28)',
          color: 'var(--accent-rose)',
          fontSize: '1.25rem',
          marginBottom: '24px',
          boxShadow:
            '0 0 24px rgba(212, 139, 159, 0.3), inset 0 0 12px rgba(212, 139, 159, 0.1)'
        }}
      >
        ✦
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.1rem, 5.2vw, 3.2rem)',
          fontWeight: 400,
          color: 'var(--text-cream)',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
          margin: '0 0 16px 0',
          textShadow:
            '0 2px 24px rgba(212, 139, 159, 0.28), 0 0 40px rgba(77, 18, 53, 0.35)'
        }}
      >
        One Last Little Surprise…
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(1.1rem, 2.5vw, 1.32rem)',
          color: 'var(--accent-dusty-pink)',
          lineHeight: 1.55,
          margin: '0 0 32px 0',
          maxWidth: '460px',
          letterSpacing: '0.015em',
          opacity: 0.95
        }}
      >
        And now, something I&apos;ve been waiting to tell you.
      </motion.p>

      {/* Optional immediate continue button */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <motion.button
          type="button"
          onClick={onProceed}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{
            scale: 1.035,
            y: -1.5,
            boxShadow:
              '0 12px 30px -6px rgba(212, 139, 159, 0.5), 0 0 24px rgba(223, 184, 158, 0.3)'
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            background:
              'linear-gradient(135deg, rgba(82, 24, 60, 0.95) 0%, rgba(42, 14, 38, 0.95) 100%)',
            border: '1.2px solid rgba(212, 139, 159, 0.45)',
            color: 'var(--text-cream)',
            borderRadius: '9999px',
            padding: '11px 28px',
            fontSize: '0.92rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 500,
            letterSpacing: '0.06em',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.7)',
            transition: 'border-color 0.3s ease, background 0.3s ease'
          }}
        >
          <span>Continue</span>
          <span style={{ color: 'var(--accent-rose)' }}>→</span>
        </motion.button>

        {onBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              color: 'var(--text-subtle)',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              padding: '4px 10px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-subtle)';
            }}
          >
            ← Revisit Chapter 3
          </button>
        )}
      </div>
    </motion.div>
  );
}
