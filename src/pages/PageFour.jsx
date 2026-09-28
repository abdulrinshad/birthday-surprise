import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BirthdayIntro from '../components/birthday/BirthdayIntro';
import BirthdayCake from '../components/birthday/BirthdayCake';
import BlowCandles from '../components/birthday/BlowCandles';
import Celebration from '../components/birthday/Celebration';
import FinalMessage from '../components/birthday/FinalMessage';
import { trackEvent, AnalyticsEvents } from '../analytics/analytics';

/**
 * PageFour:
 * The emotional final birthday experience:
 * Stage 1: Intro ("One Last Little Surprise…")
 * Stage 2: Cake Reveal ("Make a wish..." → "Light the moment.")
 * Stage 3: Light the Candles (1 by 1 sequential lighting with glow & flicker)
 * Stage 4: Blow the Candles (Microphone puff detection + Guaranteed fallback button)
 * Stage 5: Candle Blowout & Celebration (Smoke, slight dim, sparkle burst, confetti, balloons)
 * Stage 6 & 7: Final Birthday Message (Line-by-line Malayalam fade-in)
 * Stage 8: Ending Whisper & optional return to beginning
 */
export default function PageFour({ onBack, onRestart }) {
  // State machine for Page 4
  // 'intro' | 'cake-unlit' | 'lighting' | 'candles-lit' | 'blowing' | 'celebration' | 'message'
  const [stage, setStage] = useState('intro');
  const [candlesLitCount, setCandlesLitCount] = useState(0);
  const [isBlown, setIsBlown] = useState(false);
  const [promptText, setPromptText] = useState('Make a wish…');

  // Stage 2: Text progression ("Make a wish..." -> "Light the moment.")
  useEffect(() => {
    if (stage === 'cake-unlit') {
      const timer = setTimeout(() => {
        setPromptText('Light the moment.');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Stage 3: Light candles sequentially 1 by 1
  const handleStartLighting = () => {
    trackEvent(AnalyticsEvents.CANDLES_STARTED, 'page4');
    setStage('lighting');
    setCandlesLitCount(1);

    const interval = setInterval(() => {
      setCandlesLitCount((prev) => {
        if (prev >= 5) {
          clearInterval(interval);
          setStage('candles-lit');
          return 5;
        }
        return prev + 1;
      });
    }, 450);
  };

  // Stage 4: Blowing out the candles
  const handleBlowCandles = () => {
    trackEvent(AnalyticsEvents.CANDLES_BLOWN, 'page4');
    setStage('blowing');
    setIsBlown(true);

    // Short pause with smoke & dimmed atmosphere before celebration begins
    setTimeout(() => {
      setStage('celebration');
    }, 1200);
  };

  // Stage 5 -> Stage 6: Celebration settles and reveals the final message
  const handleCelebrationSettled = () => {
    trackEvent(AnalyticsEvents.BIRTHDAY_COMPLETED, 'page4');
    setStage('message');
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
        padding: '28px 16px',
        overflowX: 'hidden'
      }}
    >
      {/* Intimate atmospheric ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(640px, 92vw)',
          height: 'min(640px, 92vw)',
          borderRadius: '50%',
          background:
            stage === 'blowing'
              ? 'radial-gradient(circle, rgba(20, 6, 18, 0.4) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(168, 75, 101, 0.22) 0%, rgba(54, 18, 44, 0.12) 48%, transparent 75%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0,
          transition: 'all 1.2s ease'
        }}
      />

      {/* Screen Dimming Overlay during the candle-blowout pause */}
      <AnimatePresence>
        {stage === 'blowing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: '#050206',
              pointerEvents: 'none',
              zIndex: 4
            }}
          />
        )}
      </AnimatePresence>

      {/* Active Stage Renderer */}
      <AnimatePresence mode="wait">
        {/* STAGE 1: INTRO */}
        {stage === 'intro' && (
          <BirthdayIntro
            key="stage-intro"
            onProceed={() => setStage('cake-unlit')}
            onBack={onBack}
          />
        )}

        {/* STAGE 2, 3, 4, 5: CAKE & CANDLE INTERACTION */}
        {(stage === 'cake-unlit' ||
          stage === 'lighting' ||
          stage === 'candles-lit' ||
          stage === 'blowing' ||
          stage === 'celebration') && (
          <motion.div
            key="stage-cake-container"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(6px)', transition: { duration: 0.9 } }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'relative',
              zIndex: 2,
              width: '100%',
              maxWidth: '560px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            {/* Header Subtitle / Cue */}
            <motion.p
              key={stage === 'candles-lit' ? 'lit-prompt' : promptText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.95, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.15rem, 3vw, 1.45rem)',
                color: stage === 'candles-lit' ? 'var(--accent-gold)' : 'var(--accent-dusty-pink)',
                letterSpacing: '0.04em',
                margin: '0 0 16px 0',
                textShadow: '0 0 20px rgba(212, 139, 159, 0.35)'
              }}
            >
              {stage === 'candles-lit'
                ? 'Now make a wish…'
                : stage === 'blowing'
                ? 'May your wish come true…'
                : stage === 'celebration'
                ? '✨ Happy Birthday! ✨'
                : promptText}
            </motion.p>

            {/* The Birthday Cake */}
            <BirthdayCake
              candlesLitCount={candlesLitCount}
              isBlown={isBlown}
            />

            {/* Stage 2 Controls: Light Candles Button */}
            {stage === 'cake-unlit' && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                style={{ marginTop: '24px' }}
              >
                <motion.button
                  type="button"
                  id="light-candles-btn"
                  onClick={handleStartLighting}
                  whileHover={{
                    scale: 1.04,
                    y: -2,
                    boxShadow:
                      '0 14px 34px -6px rgba(212, 139, 159, 0.55), 0 0 26px rgba(223, 184, 158, 0.35)',
                    borderColor: 'rgba(223, 184, 158, 0.7)'
                  }}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(82, 24, 60, 0.96) 0%, rgba(42, 14, 38, 0.96) 100%)',
                    border: '1.2px solid rgba(212, 139, 159, 0.45)',
                    color: 'var(--text-cream)',
                    borderRadius: '9999px',
                    padding: '13px 32px',
                    fontSize: '0.96rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 10px 28px -6px rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <span>Light the candles</span>
                  <span style={{ color: 'var(--accent-gold)' }}>✨</span>
                </motion.button>
              </motion.div>
            )}

            {/* Stage 3 Controls: Active Lighting Feedback */}
            {stage === 'lighting' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                style={{
                  marginTop: '24px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.84rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--accent-gold)'
                }}
              >
                Lighting Candle {candlesLitCount} of 5…
              </motion.div>
            )}

            {/* Stage 4 Controls: Blow Out Candles (Mic + Fallback Button) */}
            {stage === 'candles-lit' && (
              <BlowCandles onBlow={handleBlowCandles} />
            )}

            {/* Stage 5: Celebration Effects Overlay */}
            {stage === 'celebration' && (
              <Celebration onCelebrationSettled={handleCelebrationSettled} />
            )}
          </motion.div>
        )}

        {/* STAGES 6, 7 & 8: FINAL PERSONAL BIRTHDAY MESSAGE */}
        {stage === 'message' && (
          <FinalMessage
            key="stage-final-message"
            onRestart={onRestart}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
