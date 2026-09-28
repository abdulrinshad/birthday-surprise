import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * Envelope:
 * An elegant, layered HTML/CSS/SVG envelope rendered with 3D perspective,
 * warm burgundy tones, cream stationery peek, and an interactive wax seal.
 */
export default function Envelope({ onOpenComplete }) {
  const [isOpening, setIsOpening] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const handleOpen = useCallback(() => {
    if (hasTriggered) return;
    setHasTriggered(true);
    setIsOpening(true);

    // Sequence timing:
    // 0.0s - 0.4s: seal fades & scales
    // 0.3s - 0.9s: 3D flap unfolds backwards
    // 0.7s - 1.4s: cream letter paper rises out of envelope
    // 1.8s: envelope stage completes and signals App to transition to letter
    setTimeout(() => {
      if (onOpenComplete) {
        onOpenComplete();
      }
    }, 1900);
  }, [hasTriggered, onOpenComplete]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <motion.section
      className="envelope-section"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        y: -20,
        transition: { duration: 0.85, ease: [0.32, 0.72, 0, 1] }
      }}
      transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100vh',
        minHeight: '100svh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px 20px',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          width: '100%',
          maxWidth: '480px'
        }}
      >
        {/* Top small label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--accent-rose-soft)',
            fontWeight: 500,
            margin: 0,
            opacity: 0.95
          }}
        >
          A LITTLE SURPRISE FOR YOU
        </motion.p>

        {/* Envelope Container */}
        <div
          style={{
            perspective: '1200px',
            WebkitPerspective: '1200px',
            position: 'relative',
            width: 'min(390px, 88vw)',
            height: 'min(255px, 58vw)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            id="envelope-card"
            role="button"
            tabIndex={0}
            aria-label="Click to open letter envelope"
            onClick={handleOpen}
            onKeyDown={handleKeyDown}
            whileHover={!isOpening ? { y: -5, transition: { duration: 0.3 } } : {}}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '12px',
              cursor: isOpening ? 'default' : 'pointer',
              boxShadow: 'var(--shadow-envelope)',
              outline: 'none',
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d'
            }}
          >
            {/* 1. Envelope Back Interior Background */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '12px',
                background: 'linear-gradient(145deg, #1b0717 0%, #280a22 100%)',
                border: '1px solid var(--envelope-border)',
                overflow: 'hidden',
                zIndex: 1
              }}
            >
              {/* Subtle inner paper shadow gradient */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at 50% 30%, rgba(95, 23, 63, 0.25) 0%, transparent 70%)'
                }}
              />
            </div>

            {/* 2. Letter Paper Rising from inside */}
            <motion.div
              initial={{ y: 0, scale: 0.96 }}
              animate={
                isOpening
                  ? {
                      y: -115,
                      scale: 1,
                      boxShadow: '0 20px 40px -10px rgba(0,0,0,0.6)'
                    }
                  : { y: 0, scale: 0.96 }
              }
              transition={{
                duration: 1.1,
                delay: 0.45,
                ease: [0.22, 1, 0.36, 1]
              }}
              style={{
                position: 'absolute',
                left: '6%',
                right: '6%',
                top: '12%',
                height: '84%',
                backgroundColor: 'var(--envelope-paper)',
                borderRadius: '8px 8px 4px 4px',
                padding: '18px 20px',
                boxSizing: 'border-box',
                boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                zIndex: isOpening ? 6 : 2,
                pointerEvents: 'none',
                overflow: 'hidden'
              }}
            >
              {/* Paper Decorative Elements */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '0.85rem',
                      fontStyle: 'italic',
                      color: '#8c4a60'
                    }}
                  >
                    Dearest...
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#b3798d' }}>✦</span>
                </div>
                {/* Subtle faux calligraphy lines */}
                <div
                  style={{
                    width: '85%',
                    height: '2px',
                    backgroundColor: 'rgba(140, 74, 96, 0.25)',
                    borderRadius: '2px',
                    marginBottom: '7px'
                  }}
                />
                <div
                  style={{
                    width: '95%',
                    height: '2px',
                    backgroundColor: 'rgba(140, 74, 96, 0.18)',
                    borderRadius: '2px',
                    marginBottom: '7px'
                  }}
                />
                <div
                  style={{
                    width: '70%',
                    height: '2px',
                    backgroundColor: 'rgba(140, 74, 96, 0.18)',
                    borderRadius: '2px'
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  borderTop: '1px solid rgba(140, 74, 96, 0.15)',
                  paddingTop: '6px'
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.75rem',
                    fontStyle: 'italic',
                    color: '#94586d'
                  }}
                >
                  With love ♡
                </span>
              </div>
            </motion.div>

            {/* 3. Envelope Front Pocket (SVG shapes for crisp side & bottom folds) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '12px',
                overflow: 'hidden',
                zIndex: 3,
                pointerEvents: 'none'
              }}
            >
              <svg
                viewBox="0 0 390 255"
                preserveAspectRatio="none"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block'
                }}
              >
                <defs>
                  {/* Left flap gradient */}
                  <linearGradient id="leftFoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#250920" />
                    <stop offset="100%" stopColor="#1a0616" />
                  </linearGradient>
                  {/* Right flap gradient */}
                  <linearGradient id="rightFoldGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#290b23" />
                    <stop offset="100%" stopColor="#190516" />
                  </linearGradient>
                  {/* Bottom flap gradient */}
                  <linearGradient id="bottomFoldGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#1c0719" />
                    <stop offset="100%" stopColor="#2e0d28" />
                  </linearGradient>
                </defs>

                {/* Left Triangular Fold */}
                <polygon
                  points="0,0 195,142 0,255"
                  fill="url(#leftFoldGrad)"
                  stroke="rgba(212, 139, 159, 0.15)"
                  strokeWidth="1"
                />

                {/* Right Triangular Fold */}
                <polygon
                  points="390,0 195,142 390,255"
                  fill="url(#rightFoldGrad)"
                  stroke="rgba(212, 139, 159, 0.15)"
                  strokeWidth="1"
                />

                {/* Bottom Triangular Fold */}
                <polygon
                  points="0,255 195,130 390,255"
                  fill="url(#bottomFoldGrad)"
                  stroke="rgba(212, 139, 159, 0.22)"
                  strokeWidth="1"
                />
              </svg>
            </div>

            {/* 4. Top Flap with 3D Rotate */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '146px',
                transformOrigin: 'top center',
                WebkitTransformOrigin: 'top center',
                zIndex: isOpening ? 2 : 4,
                pointerEvents: 'none'
              }}
              animate={
                isOpening
                  ? {
                      rotateX: 180,
                      transition: {
                        duration: 0.85,
                        delay: 0.2,
                        ease: [0.4, 0, 0.2, 1]
                      }
                    }
                  : { rotateX: 0 }
              }
            >
              <svg
                viewBox="0 0 390 146"
                preserveAspectRatio="none"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.5))'
                }}
              >
                <defs>
                  <linearGradient id="topFlapGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#300d2b" />
                    <stop offset="100%" stopColor="#20081d" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,0 390,0 195,144"
                  fill="url(#topFlapGrad)"
                  stroke="rgba(212, 139, 159, 0.28)"
                  strokeWidth="1.2"
                />
              </svg>
            </motion.div>

            {/* 5. Circular Wax Seal Button */}
            <motion.div
              animate={
                isOpening
                  ? {
                      scale: 0.4,
                      opacity: 0,
                      transition: { duration: 0.35, ease: 'easeIn' }
                    }
                  : {
                      scale: 1,
                      opacity: 1
                    }
              }
              whileHover={
                !isOpening
                  ? {
                      scale: 1.08,
                      boxShadow: '0 0 24px rgba(212, 139, 159, 0.55)',
                      transition: {
                        repeat: Infinity,
                        repeatType: 'reverse',
                        duration: 0.9
                      }
                    }
                  : {}
              }
              style={{
                position: 'absolute',
                top: '124px',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 35%, #b94f6e 0%, #872844 70%, #5c142b 100%)',
                border: '1px solid rgba(223, 184, 158, 0.4)',
                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.65), 0 0 12px rgba(184, 84, 113, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                cursor: 'pointer'
              }}
            >
              {/* Delicate Heart Icon inside seal */}
              <span
                style={{
                  color: 'var(--text-cream)',
                  fontSize: '1.05rem',
                  lineHeight: 1,
                  display: 'inline-block',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))'
                }}
              >
                ♡
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Envelope instruction labels below */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            alignItems: 'center'
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 400,
              color: 'var(--text-cream)',
              margin: 0,
              letterSpacing: '0.02em'
            }}
          >
            Open this little letter
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.82rem',
              fontWeight: 400,
              color: 'var(--accent-rose-soft)',
              margin: 0,
              letterSpacing: '0.08em',
              opacity: 0.85
            }}
          >
            Click the envelope gently
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
