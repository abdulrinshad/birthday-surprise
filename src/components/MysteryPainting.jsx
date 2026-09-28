import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GraphiteCanvas from './GraphiteCanvas';
import GraphiteTools from './GraphiteTools';
import SketchReveal from './SketchReveal';
import { trackEvent, AnalyticsEvents } from '../analytics/analytics';

/**
 * MysteryPainting:
 * The complete Page 2 Graphite Powder Sketch Reveal experience.
 *
 * Concept flow:
 * BLANK WHITE PAPER
 *       ↓
 * BLACK GRAPHITE POWDER INTERACTION
 *       ↓
 * USER DRAGS / BRUSHES THE POWDER
 *       ↓
 * HIDDEN SKETCH GRADUALLY REVEALS
 *       ↓
 * "FINISH THE SKETCH"
 *       ↓
 * FULL PROFESSIONAL SKETCH REVEAL (eshal-main.png)
 */
export default function MysteryPainting({ onBack, onContinue }) {
  const [stage, setStage] = useState('sketching'); // 'sketching' | 'reveal'
  const [coveragePercent, setCoveragePercent] = useState(0);
  const [activeTool, setActiveTool] = useState('sponge'); // 'sponge' | 'stump' | 'brush'
  const [brushSize, setBrushSize] = useState('medium');  // 'small' | 'medium' | 'large'
  const [isFinishing, setIsFinishing] = useState(false);

  const canvasMethodsRef = useRef(null);

  const setCanvasRef = useCallback((methods) => {
    canvasMethodsRef.current = methods;
  }, []);

  const handleCoverageChange = useCallback((percent) => {
    setCoveragePercent(percent);
    if (percent > 0) {
      trackEvent(AnalyticsEvents.SKETCH_INTERACTION_STARTED, 'page2');
    }
  }, []);

  // "Finish the Sketch" triggered by user
  const handleFinishSketch = useCallback(() => {
    if (isFinishing) return;
    setIsFinishing(true);
    trackEvent(AnalyticsEvents.SKETCH_COMPLETED, 'page2');

    // Gently fill remaining coverage on canvas before unveiling
    if (canvasMethodsRef.current?.fillComplete) {
      canvasMethodsRef.current.fillComplete();
    }

    setTimeout(() => {
      setStage('reveal');
      setIsFinishing(false);
    }, 500);
  }, [isFinishing]);

  // Restart / Replay shading from blank white paper
  const handleReplay = useCallback(() => {
    setStage('sketching');
    setCoveragePercent(0);
    setIsFinishing(false);
    if (canvasMethodsRef.current?.clearCanvas) {
      canvasMethodsRef.current.clearCanvas();
    }
  }, []);

  // Quick waft helper
  const handleWaftPowder = useCallback(() => {
    if (canvasMethodsRef.current?.waftPowder) {
      canvasMethodsRef.current.waftPowder();
    }
  }, []);

  // Clear paper
  const handleClearPaper = useCallback(() => {
    if (canvasMethodsRef.current?.clearCanvas) {
      canvasMethodsRef.current.clearCanvas();
      setCoveragePercent(0);
    }
  }, []);

  // Poetic encouragement based on shading coverage
  const getProgressHint = () => {
    if (coveragePercent === 0) {
      return 'Touch and drag across the paper to brush the graphite powder.';
    }
    if (coveragePercent < 20) {
      return 'The first delicate lines are beginning to emerge...';
    }
    if (coveragePercent < 50) {
      return 'Shading deeper into the paper tooth... Keep brushing.';
    }
    if (coveragePercent < 80) {
      return 'The portrait is coming alive before your eyes.';
    }
    return 'The graphite is richly blended. Ready to finish the sketch!';
  };

  return (
    <motion.section
      className="mystery-painting-section"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -25, transition: { duration: 0.8 } }}
      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100svh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(20px, 4vh, 40px) clamp(14px, 4vw, 24px)',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header & Poetic Direction */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{
          textAlign: 'center',
          marginBottom: '14px',
          maxWidth: '640px'
        }}
      >
        {/* Back Button to Page 1 Letter */}
        {onBack && stage !== 'reveal' && (
          <button
            type="button"
            onClick={onBack}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '8px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--accent-rose)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
          >
            <span>←</span>
            <span>Back to Letter</span>
          </button>
        )}

        {stage !== 'reveal' && (
          <>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
                color: 'var(--text-cream)',
                fontWeight: 400,
                lineHeight: 1.2,
                margin: '0 0 6px 0',
                letterSpacing: '0.01em'
              }}
            >
              Something hidden in the graphite.
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.84rem',
                color: 'var(--accent-rose-soft)',
                letterSpacing: '0.08em',
                margin: 0,
                fontWeight: 400
              }}
            >
              {getProgressHint()}
            </p>
          </>
        )}
      </motion.div>

      {/* Main Interactive Stage */}
      <AnimatePresence mode="wait">
        {stage === 'reveal' ? (
          /* Climax Full Professional Sketch Reveal View */
          <SketchReveal
            key="sketch-reveal-stage"
            onReplay={handleReplay}
            onContinue={onContinue}
          />
        ) : (
          /* Active Blank Paper & Graphite Shading View */
          <motion.div
            key="sketch-drawing-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            style={{
              width: '100%',
              maxWidth: '680px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* Shading Progress & "Finish the Sketch" Header Bar */}
            <div
              style={{
                width: '100%',
                maxWidth: '540px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px',
                padding: '0 4px'
              }}
            >
              {/* Progress Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.74rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-rose)',
                    fontWeight: 600
                  }}
                >
                  Shaded: {coveragePercent}%
                </span>

                <div
                  style={{
                    width: '65px',
                    height: '4px',
                    backgroundColor: 'rgba(212, 139, 159, 0.18)',
                    borderRadius: '999px',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    style={{
                      height: '100%',
                      backgroundColor: 'var(--accent-rose)',
                      borderRadius: '999px'
                    }}
                    animate={{ width: `${coveragePercent}%` }}
                    transition={{ ease: 'easeOut', duration: 0.3 }}
                  />
                </div>
              </div>

              {/* FINISH THE SKETCH BUTTON */}
              <motion.button
                type="button"
                onClick={handleFinishSketch}
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 0 20px rgba(212, 139, 159, 0.5)'
                }}
                whileTap={{ scale: 0.96 }}
                animate={{
                  boxShadow:
                    coveragePercent >= 40
                      ? [
                          '0 0 10px rgba(223, 184, 158, 0.3)',
                          '0 0 22px rgba(212, 139, 159, 0.55)',
                          '0 0 10px rgba(223, 184, 158, 0.3)'
                        ]
                      : 'none'
                }}
                transition={{
                  boxShadow: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' }
                }}
                style={{
                  background:
                    coveragePercent >= 25
                      ? 'linear-gradient(135deg, rgba(84, 25, 60, 0.95), rgba(46, 14, 40, 0.95))'
                      : 'rgba(32, 12, 28, 0.75)',
                  border:
                    coveragePercent >= 25
                      ? '1px solid rgba(223, 184, 158, 0.6)'
                      : '1px solid rgba(212, 139, 159, 0.25)',
                  color: 'var(--text-cream)',
                  borderRadius: '999px',
                  padding: '7px 18px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                title="Finish the sketch and reveal the final portrait"
              >
                <span>Finish the Sketch</span>
                <span style={{ color: 'var(--accent-gold)' }}>✨</span>
              </motion.button>
            </div>

            {/* The Blank White Paper & Graphite Canvas */}
            <GraphiteCanvas
              activeTool={activeTool}
              brushSize={brushSize}
              onCoverageChange={handleCoverageChange}
              isFinishing={isFinishing}
              canvasRefCallback={setCanvasRef}
            />

            {/* Black Graphite Powder Interaction Tray */}
            <GraphiteTools
              activeTool={activeTool}
              onSelectTool={setActiveTool}
              brushSize={brushSize}
              onSelectBrushSize={setBrushSize}
              onWaftPowder={handleWaftPowder}
              onClearPaper={handleClearPaper}
              coveragePercent={coveragePercent}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
