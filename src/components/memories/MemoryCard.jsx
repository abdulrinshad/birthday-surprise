import { motion } from 'framer-motion';
import MemoryAudioPlayer from './MemoryAudioPlayer';

/**
 * MemoryCard:
 * Intimate, cinematic presentation for a single memory:
 * - Chapter tag (e.g. MEMORY 01)
 * - Premium framed photograph preserving true aspect ratio without unneeded cropping
 * - Personal typography caption (supports Malayalam & English)
 * - Delicate hairline divider
 * - Custom voice player
 */
export default function MemoryCard({ memory, onVoicePlayStart }) {
  if (!memory) return null;

  return (
    <motion.div
      key={`memory-card-${memory.id}`}
      initial={{ opacity: 0, scale: 0.97, y: 14 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: 0.65,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      exit={{
        opacity: 0,
        scale: 0.97,
        y: -14,
        transition: {
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1]
        }
      }}
      style={{
        width: '100%',
        maxWidth: '540px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {/* Memory Tag / Header */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-rose)'
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.76rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--accent-rose-soft)',
            fontWeight: 600
          }}
        >
          {memory.tag || `MEMORY 0${memory.id}`}
        </span>
        <span
          style={{
            display: 'inline-block',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-rose)'
          }}
        />
      </div>

      {/* Premium Framed Photograph */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div
          style={{
            position: 'relative',
            padding: '10px',
            background:
              'linear-gradient(145deg, rgba(38, 16, 36, 0.8) 0%, rgba(20, 9, 20, 0.9) 100%)',
            border: '1.2px solid rgba(212, 139, 159, 0.28)',
            borderRadius: '20px',
            boxShadow:
              '0 20px 45px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(212, 139, 159, 0.14)',
            maxWidth: '100%',
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {/* Subtle inner matting border */}
          <div
            style={{
              position: 'relative',
              borderRadius: '14px',
              overflow: 'hidden',
              backgroundColor: '#0d070e',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={memory.image}
              alt={memory.alt || `Memory ${memory.id}`}
              loading="eager"
              decoding="async"
              style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: 'clamp(260px, 46vh, 440px)',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '13px'
              }}
            />

            {/* Subtle vintage vignette glaze over photo */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                boxShadow: 'inset 0 0 30px rgba(11, 9, 13, 0.45)',
                pointerEvents: 'none',
                borderRadius: '13px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Personal Caption */}
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '0 12px',
          marginBottom: '20px'
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.15rem, 2.5vw, 1.35rem)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'var(--text-cream)',
            lineHeight: 1.6,
            letterSpacing: '0.015em',
            margin: 0,
            textShadow: '0 2px 14px rgba(212, 139, 159, 0.15)'
          }}
        >
          {memory.caption}
        </p>
      </div>

      {/* Subtle Hairline Divider with Motif */}
      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '260px',
          marginBottom: '18px',
          opacity: 0.7
        }}
      >
        <div
          style={{
            flex: 1,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(212, 139, 159, 0.35) 100%)'
          }}
        />
        <span
          style={{
            margin: '0 12px',
            color: 'var(--accent-rose-soft)',
            fontSize: '0.75rem',
            lineHeight: 1
          }}
        >
          ✧
        </span>
        <div
          style={{
            flex: 1,
            height: '1px',
            background:
              'linear-gradient(90deg, rgba(212, 139, 159, 0.35) 0%, transparent 100%)'
          }}
        />
      </div>

      {/* Matching Voice Recording Audio Player */}
      <div style={{ width: '100%' }}>
        <MemoryAudioPlayer
          audioSrc={memory.audio}
          memoryId={memory.id}
          onPlayStart={onVoicePlayStart}
        />
      </div>
    </motion.div>
  );
}
