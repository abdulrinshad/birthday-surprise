import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { finalBirthdayMessage } from '../../data/birthdayMessage';

/**
 * FinalMessage:
 * Stages 6 & 7:
 * - Emotional Birthday Letter reveal
 * - Line-by-line slow, heartfelt fade-in
 * - Editorial serif typography with warm glow
 * - Seamless editable data model via src/data/birthdayMessage.js
 * - Optional subtle "Start Again" action to revisit the experience from Page 1
 */
export default function FinalMessage({ onRestart }) {
  const [messageSettled, setMessageSettled] = useState(false);

  useEffect(() => {
    // Settle message lines
    const timer = setTimeout(() => {
      setMessageSettled(true);
    }, 2000 + (finalBirthdayMessage.lines.length * 800));

    return () => clearTimeout(timer);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.75,
        delayChildren: 0.3
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      key="final-birthday-message-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: 'relative',
        zIndex: 3,
        width: '100%',
        maxWidth: '580px',
        margin: '0 auto',
        padding: 'clamp(36px, 6vw, 56px) clamp(24px, 5.5vw, 48px)',
        background:
          'linear-gradient(165deg, rgba(28, 11, 26, 0.88) 0%, rgba(16, 7, 16, 0.94) 100%)',
        border: '1px solid rgba(212, 139, 159, 0.25)',
        boxShadow:
          '0 32px 80px -15px rgba(0, 0, 0, 0.85), 0 0 50px rgba(168, 75, 101, 0.2)',
        borderRadius: '28px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {/* Delicate Heart Emblem */}
      <motion.div
        variants={lineVariants}
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
          fontSize: '1.2rem',
          marginBottom: '20px',
          boxShadow: '0 0 24px rgba(212, 139, 159, 0.28)'
        }}
      >
        ♡
      </motion.div>

      {/* Main Title: "Happy Birthday ❤️" */}
      <motion.h1
        variants={lineVariants}
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.2rem, 5.4vw, 3.3rem)',
          fontWeight: 400,
          color: 'var(--text-cream)',
          lineHeight: 1.2,
          letterSpacing: '0.01em',
          margin: '0 0 28px 0',
          textShadow:
            '0 2px 24px rgba(212, 139, 159, 0.35), 0 0 45px rgba(168, 75, 101, 0.35)'
        }}
      >
        {finalBirthdayMessage.title}
      </motion.h1>

      {/* Personal Message Body (rendered line-by-line with slow fade) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '22px',
          width: '100%',
          maxWidth: '490px',
          margin: '0 0 24px 0'
        }}
      >
        {finalBirthdayMessage.lines.map((line, idx) => (
          <motion.p
            key={`msg-line-${idx}`}
            variants={lineVariants}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.15rem, 2.7vw, 1.36rem)',
              lineHeight: 1.82,
              color: 'var(--text-cream)',
              letterSpacing: '0.015em',
              margin: 0,
              opacity: 0.96,
              textShadow: '0 1px 16px rgba(212, 139, 159, 0.18)',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              textAlign: 'center'
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      {/* Discreet Restart Button (return to Page 1) */}
      {onRestart && (
        <AnimatePresence>
          {messageSettled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1.0 }}
              style={{ marginTop: '24px' }}
            >
              <button
                type="button"
                id="start-again-btn"
                onClick={onRestart}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.82rem',
                  color: 'var(--text-subtle)',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  padding: '8px 20px',
                  borderRadius: '999px',
                  border: '1px solid rgba(212, 139, 159, 0.18)',
                  backgroundColor: 'rgba(28, 12, 26, 0.45)',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.borderColor = 'rgba(212, 139, 159, 0.38)';
                  e.currentTarget.style.backgroundColor = 'rgba(42, 16, 38, 0.65)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-subtle)';
                  e.currentTarget.style.borderColor = 'rgba(212, 139, 159, 0.18)';
                  e.currentTarget.style.backgroundColor = 'rgba(28, 12, 26, 0.45)';
                }}
              >
                Start Again ↺
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}
