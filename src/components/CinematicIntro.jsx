import { motion } from 'framer-motion';

/**
 * CinematicIntro:
 * Full-screen, emotionally resonant introduction stage.
 * Staggered animations with editorial typography and restrained aesthetics.
 */
export default function CinematicIntro({ onStart }) {
  // Stagger orchestration variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.28,
        delayChildren: 0.3
      }
    },
    exit: {
      opacity: 0,
      y: -24,
      transition: {
        duration: 0.9,
        ease: [0.32, 0.72, 0, 1]
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.85,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const headingLineVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.section
      className="intro-section"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
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
          maxWidth: '680px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '28px'
        }}
      >
        {/* Step 3: Small label */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.8rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'var(--accent-rose-soft)',
            fontWeight: 500,
            margin: 0,
            opacity: 0.9
          }}
        >
          A LITTLE MOMENT...
        </motion.p>

        {/* Step 4: Main Heading */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 6vw, 4.4rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.015em',
            color: 'var(--text-cream)',
            margin: 0
          }}
        >
          <motion.span variants={headingLineVariants} style={{ display: 'block' }}>
            Some words
          </motion.span>
          <motion.span variants={headingLineVariants} style={{ display: 'block' }}>
            are difficult
          </motion.span>
          <motion.span
            variants={headingLineVariants}
            style={{
              display: 'block',
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--accent-rose)'
            }}
          >
            to say.
          </motion.span>
        </motion.h1>

        {/* Step 5: Description */}
        <motion.p
          variants={itemVariants}
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)',
            fontWeight: 300,
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            maxWidth: '480px',
            margin: 0,
            letterSpacing: '0.01em'
          }}
        >
          So I decided to put them into a little letter.
        </motion.p>

        {/* Step 6: Button */}
        <motion.div variants={itemVariants} style={{ marginTop: '12px' }}>
          <motion.button
            id="begin-journey-btn"
            type="button"
            onClick={onStart}
            whileHover={{
              y: -2,
              boxShadow: '0 12px 28px -8px rgba(212, 139, 159, 0.28)',
              borderColor: 'rgba(212, 139, 159, 0.45)',
              backgroundColor: 'rgba(40, 16, 34, 0.65)'
            }}
            whileTap={{ scale: 0.98, y: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              color: 'var(--text-cream)',
              backgroundColor: 'rgba(32, 12, 28, 0.45)',
              border: '1px solid rgba(212, 139, 159, 0.25)',
              borderRadius: '9999px',
              padding: '14px 34px',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
            }}
          >
            <span>Begin the journey</span>
            <span
              style={{
                display: 'inline-block',
                transition: 'transform 0.25s ease',
                color: 'var(--accent-rose)'
              }}
            >
              →
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
