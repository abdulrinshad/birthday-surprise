import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { MEMORIES } from '../data/memoriesData';
import MemoryCard from '../components/memories/MemoryCard';
import MemoryNavigation from '../components/memories/MemoryNavigation';
import { trackEvent, AnalyticsEvents } from '../analytics/analytics';

/**
 * PageThree:
 * Chapter 3 — "Our Memories"
 * 
 * An intimate, cinematic journey through 5 cherished memories.
 * - Stage 'intro': "Some Moments Stay."
 * - Stage 'memories': One memory at a time with photograph, caption, and matching voice recording.
 * - Stage 'outro': "Five memories. And there are still a few things left to say." → Continue to Page 4.
 */
export default function PageThree({ onBack, onContinue }) {
  // 'intro' | 'memories' | 'outro'
  const [stage, setStage] = useState('intro');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Track page viewed on mount
  useEffect(() => {
    trackEvent(AnalyticsEvents.PAGE_3_VIEWED, 'page3');
  }, []);

  // Track memory viewed whenever index changes in 'memories' stage
  useEffect(() => {
    if (stage === 'memories') {
      const memId = MEMORIES[currentIndex]?.id;
      if (memId && AnalyticsEvents[`MEMORY_${memId}_VIEWED`]) {
        trackEvent(AnalyticsEvents[`MEMORY_${memId}_VIEWED`], 'page3', {
          memory_index: currentIndex,
          memory_id: memId
        });
      }
    }
  }, [stage, currentIndex]);

  // Voice play analytics callback
  const handleVoicePlayStart = useCallback((memoryId) => {
    if (memoryId && AnalyticsEvents[`VOICE_${memoryId}_PLAYED`]) {
      trackEvent(AnalyticsEvents[`VOICE_${memoryId}_PLAYED`], 'page3', {
        memory_id: memoryId
      });
    }
  }, []);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentIndex < MEMORIES.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Reached past Memory 5: transition to emotional outro
      setStage('outro');
    }
  }, [currentIndex]);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleSelectIndex = useCallback((index) => {
    if (index >= 0 && index < MEMORIES.length) {
      setCurrentIndex(index);
    }
  }, []);

  // Keyboard navigation: ArrowLeft / ArrowRight
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid intercepting input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (stage === 'memories') {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handlePrevious();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, handleNext, handlePrevious]);

  // Framer Motion variants
  const fadeInVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
    },
    exit: {
      opacity: 0,
      y: -16,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <main
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px 40px 16px',
        zIndex: 1,
        color: 'var(--text-ivory)'
      }}
    >
      {/* Top Bar Navigation: Subtle Back Button */}
      <header
        style={{
          position: 'fixed',
          top: '16px',
          left: '20px',
          right: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 20,
          pointerEvents: 'none'
        }}
      >
        {onBack && (
          <motion.button
            type="button"
            id="page3-back-btn"
            aria-label="Return to previous page"
            onClick={onBack}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.95 }}
            style={{
              pointerEvents: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.82rem',
              letterSpacing: '0.04em',
              color: 'var(--text-muted)',
              background: 'rgba(20, 9, 20, 0.5)',
              border: '1px solid rgba(212, 139, 159, 0.18)',
              borderRadius: '999px',
              padding: '8px 16px',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </motion.button>
        )}

        {/* Quiet Chapter Indicator in Top Right */}
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.74rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--accent-rose-soft)',
            opacity: 0.7,
            pointerEvents: 'none'
          }}
        >
          {stage === 'memories' ? `Memory 0${currentIndex + 1} of 05` : 'Memories'}
        </div>
      </header>

      {/* Atmospheric Central Soft Glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(650px, 92vw)',
          height: 'min(650px, 92vw)',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(168, 75, 101, 0.15) 0%, rgba(46, 14, 38, 0.08) 50%, transparent 75%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Main Flow Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '580px',
          marginTop: '44px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* STAGE 1: CINEMATIC PAGE INTRO                             */}
          {/* ========================================================= */}
          {stage === 'intro' && (
            <motion.div
              key="stage-intro"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: 'clamp(36px, 8vw, 56px) clamp(20px, 5vw, 36px)',
                background:
                  'linear-gradient(165deg, rgba(28, 12, 26, 0.82) 0%, rgba(17, 8, 16, 0.92) 100%)',
                border: '1px solid rgba(212, 139, 159, 0.22)',
                boxShadow:
                  '0 24px 60px -15px rgba(0, 0, 0, 0.75), 0 0 40px rgba(77, 18, 53, 0.2)',
                borderRadius: '26px',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            >
              {/* Emblem */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(212, 139, 159, 0.1)',
                  border: '1px solid rgba(212, 139, 159, 0.3)',
                  color: 'var(--accent-rose)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  marginBottom: '22px',
                  boxShadow: '0 0 24px rgba(212, 139, 159, 0.25)'
                }}
              >
                ✧
              </motion.div>

              {/* Chapter Tag */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.76rem',
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-rose-soft)',
                  fontWeight: 600,
                  margin: '0 0 14px 0'
                }}
              >
                Chapter Three • Our Memories
              </motion.p>

              {/* Main Heading: "Some Moments Stay." */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.3 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2.1rem, 5.5vw, 2.85rem)',
                  fontWeight: 400,
                  color: 'var(--text-cream)',
                  lineHeight: 1.22,
                  margin: '0 0 16px 0',
                  letterSpacing: '0.015em',
                  textShadow: '0 2px 20px rgba(212, 139, 159, 0.22)'
                }}
              >
                Some Moments Stay.
              </motion.h1>

              {/* Supporting Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.4 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.08rem, 2.6vw, 1.25rem)',
                  color: 'var(--text-ivory)',
                  lineHeight: 1.65,
                  margin: '0 0 36px 0',
                  maxWidth: '430px',
                  opacity: 0.92
                }}
              >
                Five little memories I wanted you to keep.
              </motion.p>

              {/* Primary Action Button */}
              <motion.button
                type="button"
                id="page3-open-memories-btn"
                onClick={() => setStage('memories')}
                whileHover={{
                  scale: 1.025,
                  y: -2,
                  boxShadow:
                    '0 12px 30px -6px rgba(212, 139, 159, 0.5), 0 0 24px rgba(223, 184, 158, 0.25)'
                }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background:
                    'linear-gradient(135deg, rgba(74, 22, 54, 0.95) 0%, rgba(38, 12, 33, 0.95) 100%)',
                  border: '1.2px solid rgba(212, 139, 159, 0.45)',
                  color: 'var(--text-cream)',
                  borderRadius: '999px',
                  padding: '13px 32px',
                  fontSize: '0.94rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backdropFilter: 'blur(12px)',
                  boxShadow:
                    '0 8px 24px -6px rgba(0, 0, 0, 0.7), 0 0 16px rgba(212, 139, 159, 0.2)',
                  transition: 'all 0.25s ease'
                }}
              >
                <span>Open Memories</span>
                <span style={{ color: 'var(--accent-rose)' }}>→</span>
              </motion.button>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STAGE 2: MEMORIES DISPLAY (ONE MEMORY AT A TIME)         */}
          {/* ========================================================= */}
          {stage === 'memories' && (
            <motion.div
              key="stage-memories"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <AnimatePresence mode="wait">
                <MemoryCard
                  key={MEMORIES[currentIndex]?.id || currentIndex}
                  memory={MEMORIES[currentIndex]}
                  onVoicePlayStart={handleVoicePlayStart}
                />
              </AnimatePresence>

              {/* Navigation Bar */}
              <MemoryNavigation
                currentIndex={currentIndex}
                totalCount={MEMORIES.length}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onSelectIndex={handleSelectIndex}
              />
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* STAGE 3: EMOTIONAL FINAL MEMORY TRANSITION               */}
          {/* ========================================================= */}
          {stage === 'outro' && (
            <motion.div
              key="stage-outro"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: 'clamp(38px, 8vw, 56px) clamp(22px, 5vw, 40px)',
                background:
                  'linear-gradient(165deg, rgba(28, 12, 26, 0.85) 0%, rgba(17, 8, 16, 0.94) 100%)',
                border: '1px solid rgba(212, 139, 159, 0.25)',
                boxShadow:
                  '0 24px 60px -15px rgba(0, 0, 0, 0.8), 0 0 45px rgba(77, 18, 53, 0.25)',
                borderRadius: '26px',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)'
              }}
            >
              {/* Emblem */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(212, 139, 159, 0.12)',
                  border: '1px solid rgba(212, 139, 159, 0.35)',
                  color: 'var(--accent-rose)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  marginBottom: '22px',
                  boxShadow: '0 0 24px rgba(212, 139, 159, 0.25)'
                }}
              >
                ✦
              </motion.div>

              {/* Title: "Five memories." */}
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.2 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 5vw, 2.7rem)',
                  fontWeight: 400,
                  color: 'var(--text-cream)',
                  lineHeight: 1.25,
                  margin: '0 0 16px 0',
                  letterSpacing: '0.015em',
                  textShadow: '0 2px 20px rgba(212, 139, 159, 0.22)'
                }}
              >
                Five memories.
              </motion.h2>

              {/* Emotional Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.3 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.12rem, 2.6vw, 1.28rem)',
                  color: 'var(--text-ivory)',
                  lineHeight: 1.65,
                  margin: '0 0 36px 0',
                  maxWidth: '420px',
                  opacity: 0.94
                }}
              >
                And there are still a few things left to say.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.4 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '14px',
                  flexWrap: 'wrap',
                  width: '100%'
                }}
              >
                {/* Revisit Memories */}
                <motion.button
                  type="button"
                  id="page3-revisit-btn"
                  onClick={() => {
                    setCurrentIndex(4);
                    setStage('memories');
                  }}
                  whileHover={{
                    y: -1.5,
                    borderColor: 'rgba(212, 139, 159, 0.4)',
                    backgroundColor: 'rgba(38, 14, 32, 0.7)'
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.86rem',
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    color: 'var(--text-muted)',
                    backgroundColor: 'rgba(24, 10, 22, 0.65)',
                    border: '1px solid rgba(212, 139, 159, 0.22)',
                    borderRadius: '999px',
                    padding: '11px 22px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  ← Revisit memories
                </motion.button>

                {/* Continue to Page 4 */}
                <motion.button
                  type="button"
                  id="page3-continue-btn"
                  onClick={onContinue}
                  whileHover={{
                    scale: 1.025,
                    y: -2,
                    boxShadow:
                      '0 12px 30px -6px rgba(212, 139, 159, 0.5), 0 0 24px rgba(223, 184, 158, 0.25)',
                    borderColor: 'rgba(223, 184, 158, 0.6)'
                  }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(74, 22, 54, 0.95) 0%, rgba(38, 12, 33, 0.95) 100%)',
                    border: '1.2px solid rgba(212, 139, 159, 0.45)',
                    color: 'var(--text-cream)',
                    borderRadius: '999px',
                    padding: '12px 30px',
                    fontSize: '0.94rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    backdropFilter: 'blur(12px)',
                    boxShadow:
                      '0 8px 24px -6px rgba(0, 0, 0, 0.7), 0 0 16px rgba(212, 139, 159, 0.2)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <span>Continue</span>
                  <span style={{ color: 'var(--accent-rose)' }}>→</span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
