import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import sketchImgSrc from '../assets/mystery/eshal-main.png';
import { soundFx } from '../utils/audioFx';
import { trackEvent, AnalyticsEvents } from '../analytics/analytics';

/**
 * SketchReveal:
 * Full Professional Sketch Reveal stage.
 * 1. Cinematic "Blow off excess graphite powder" particle breeze transition.
 * 2. Museum-grade gallery frame presentation of eshal-main.png.
 * 3. High-definition close-up inspection lightbox.
 * 4. Emotional "Download My Sketch" feature for the original high-resolution sketch.
 * 5. Re-shade and navigation controls.
 */
export default function SketchReveal({ onReplay, onContinue }) {
  const [stage, setStage] = useState('blowing'); // 'blowing' | 'revealed'
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    // Play gentle wind / dust blowing audio effect
    soundFx.playBlowDust();

    // Transition from dust blowing to the final pristine presentation
    const timer = setTimeout(() => {
      setStage('revealed');
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  // Reliable cross-platform high-resolution file download
  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    trackEvent(AnalyticsEvents.SKETCH_DOWNLOADED, 'page2');

    try {
      const response = await fetch(sketchImgSrc);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = blobUrl;
      link.download = 'A_Little_Sketch_For_You.png';
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 200);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch {
      // Fallback direct download
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = sketchImgSrc;
      link.download = 'A_Little_Sketch_For_You.png';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
      }, 200);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
      style={{
        width: '100%',
        maxWidth: '580px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        position: 'relative',
        zIndex: 20
      }}
    >
      {/* 1. Header & Dedication */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        style={{ textAlign: 'center' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.74rem',
            letterSpacing: '0.26em',
            textTransform: 'uppercase',
            color: 'var(--accent-rose)',
            fontWeight: 600,
            display: 'block',
            marginBottom: '6px'
          }}
        >
          {stage === 'blowing' ? 'BLOWING AWAY EXCESS POWDER...' : 'THE FINISHED SKETCH'}
        </span>

        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.1rem, 4.4vw, 3rem)',
            color: 'var(--text-cream)',
            fontWeight: 400,
            letterSpacing: '0.01em',
            lineHeight: 1.15,
            margin: 0
          }}
        >
          Eshal
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
            color: 'var(--accent-gold)',
            margin: '4px 0 0 0',
            letterSpacing: '0.02em',
            opacity: 0.9
          }}
        >
          A memory etched in graphite & heart.
        </p>
      </motion.div>

      {/* 2. Fine-Art Museum Gallery Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1089 / 1445',
          borderRadius: '16px',
          padding: '12px',
          boxSizing: 'border-box',
          background: 'linear-gradient(145deg, #1f101d, #120813 60%, #1a0b18)',
          border: '1.5px solid rgba(223, 184, 158, 0.35)',
          boxShadow:
            '0 32px 85px -15px rgba(0, 0, 0, 0.95), 0 0 50px rgba(212, 139, 159, 0.22), inset 0 0 20px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Soft Gallery Spotlight Beam from above */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '120%',
            height: '70%',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255, 235, 215, 0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 10
          }}
        />

        {/* Inner Passe-Partout Matting */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: '10px',
            overflow: 'hidden',
            backgroundColor: '#faf7f2',
            boxShadow:
              'inset 0 0 16px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Pristine High-Definition Sketch Image */}
          <motion.img
            src={sketchImgSrc}
            alt="Eshal - Handcrafted Graphite Sketch"
            initial={{ opacity: 0.65, scale: 1.03, filter: 'blur(3px)' }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)'
            }}
            transition={{
              duration: 1.4,
              ease: [0.22, 1, 0.36, 1],
              delay: stage === 'blowing' ? 0.3 : 0
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              cursor: 'zoom-in'
            }}
            onClick={() => setIsZoomed(true)}
            title="Click to view full screen close-up"
          />

          {/* Blowing Dust / Wind Gust Animation (during transition) */}
          {stage === 'blowing' && (
            <motion.div
              initial={{ x: '-60%', opacity: 1 }}
              animate={{ x: '180%', opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(40, 35, 40, 0.35) 40%, rgba(223, 184, 158, 0.4) 60%, transparent 100%)',
                transform: 'skewX(-20deg)',
                pointerEvents: 'none',
                zIndex: 12
              }}
            />
          )}

          {/* Archival Signature & Title Seal in Corner */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              pointerEvents: 'none',
              zIndex: 8
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '0.74rem',
                color: 'rgba(50, 40, 45, 0.55)',
                letterSpacing: '0.08em'
              }}
            >
              Hand-shaded in Graphite
            </span>
          </div>

          {/* Inspect Button Overlay */}
          <button
            type="button"
            onClick={() => setIsZoomed(true)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(18, 8, 16, 0.65)',
              border: '1px solid rgba(223, 184, 158, 0.3)',
              color: 'var(--text-cream)',
              borderRadius: '999px',
              padding: '5px 12px',
              fontSize: '0.72rem',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '0.04em',
              backdropFilter: 'blur(8px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.2s',
              zIndex: 9
            }}
            title="Inspect Close-Up"
          >
            <span>🔍</span>
            <span>Close-Up</span>
          </button>
        </div>
      </div>

      {/* 3. Emotional Message & Download Section (Appears after sketch reveal) */}
      <AnimatePresence>
        {stage === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px',
              marginTop: '4px'
            }}
          >
            {/* Emotional Dedication Text */}
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.05rem, 2.3vw, 1.25rem)',
                color: 'var(--text-cream)',
                letterSpacing: '0.02em',
                margin: 0,
                textAlign: 'center',
                lineHeight: 1.4,
                maxWidth: '460px'
              }}
            >
              &ldquo;A little piece of this moment,
              <br />
              made just for you.&rdquo;
            </p>

            {/* DOWNLOAD MY SKETCH BUTTON */}
            <motion.button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              whileHover={{
                scale: 1.025,
                y: -1.5,
                boxShadow:
                  '0 12px 30px -6px rgba(212, 139, 159, 0.5), 0 0 24px rgba(223, 184, 158, 0.3)'
              }}
              whileTap={{ scale: 0.97 }}
              style={{
                background:
                  'linear-gradient(135deg, rgba(74, 22, 54, 0.95) 0%, rgba(38, 12, 33, 0.95) 100%)',
                border: '1.2px solid rgba(223, 184, 158, 0.45)',
                color: 'var(--text-cream)',
                borderRadius: '999px',
                padding: '12px 28px',
                fontSize: '0.90rem',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                letterSpacing: '0.06em',
                cursor: isDownloading ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backdropFilter: 'blur(12px)',
                boxShadow:
                  '0 8px 24px -6px rgba(0, 0, 0, 0.7), 0 0 16px rgba(212, 139, 159, 0.25)',
                transition: 'border-color 0.3s ease, background 0.3s ease'
              }}
              title="Save the original full-quality sketch to your device"
            >
              {/* Elegant Download Icon */}
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(223, 184, 158, 0.2)',
                  color: 'var(--accent-gold)',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                {downloadSuccess ? '✓' : '↓'}
              </span>

              <span>
                {isDownloading
                  ? 'Saving sketch...'
                  : downloadSuccess
                  ? 'Saved to your device ✨'
                  : 'Download My Sketch'}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Secondary Action Controls (Shade Again / Continue) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginTop: '6px'
        }}
      >
        {/* Shade Again (Replay) */}
        <motion.button
          type="button"
          onClick={onReplay}
          whileHover={{
            y: -1.5,
            borderColor: 'rgba(212, 139, 159, 0.45)',
            backgroundColor: 'rgba(42, 16, 36, 0.75)'
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.82rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: 'var(--text-muted)',
            backgroundColor: 'rgba(24, 10, 22, 0.65)',
            border: '1px solid rgba(212, 139, 159, 0.22)',
            borderRadius: '999px',
            padding: '8px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(8px)'
          }}
        >
          Shade Again ↺
        </motion.button>

        {/* Continue Button */}
        {onContinue && (
          <motion.button
            type="button"
            onClick={onContinue}
            whileHover={{
              y: -1.5,
              borderColor: 'rgba(212, 139, 159, 0.65)',
              backgroundColor: 'rgba(56, 18, 46, 0.85)',
              boxShadow: '0 8px 25px -6px rgba(212, 139, 159, 0.45)'
            }}
            whileTap={{ scale: 0.97 }}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.84rem',
              fontWeight: 500,
              letterSpacing: '0.06em',
              color: 'var(--text-cream)',
              backgroundColor: 'rgba(40, 14, 34, 0.75)',
              border: '1px solid rgba(212, 139, 159, 0.4)',
              borderRadius: '999px',
              padding: '8px 22px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
          >
            <span>Continue Journey</span>
            <span style={{ color: 'var(--accent-rose)' }}>→</span>
          </motion.button>
        )}
      </motion.div>

      {/* 5. Zoom / Close-Up Lightbox Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              backgroundColor: 'rgba(6, 3, 7, 0.92)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              boxSizing: 'border-box',
              cursor: 'zoom-out'
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxHeight: '88vh',
                maxWidth: '92vw',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 30px 100px rgba(0, 0, 0, 0.9), 0 0 50px rgba(212, 139, 159, 0.2)'
              }}
            >
              <img
                src={sketchImgSrc}
                alt="Eshal - High Resolution Full Sketch"
                style={{
                  display: 'block',
                  maxHeight: '88vh',
                  maxWidth: '92vw',
                  width: 'auto',
                  height: 'auto',
                  borderRadius: '16px'
                }}
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(12, 6, 12, 0.75)',
                  border: '1px solid rgba(212, 139, 159, 0.3)',
                  color: 'var(--text-cream)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  fontSize: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)'
                }}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
