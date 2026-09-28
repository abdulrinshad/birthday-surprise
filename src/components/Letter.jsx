import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MusicButton from './MusicButton';

/**
 * Letter:
 * Full-screen letter card with staggered reveal animation,
 * dark translucent burgundy glass/paper aesthetic,
 * editorial serif typography, and Malayalam-ready text rendering.
 */
export default function Letter({ onContinue }) {
  const [continueFeedback, setContinueFeedback] = useState(false);

  // Stagger orchestration for the letter reveal
  const containerVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.0,
        ease: [0.25, 0.1, 0.25, 1],
        when: 'beforeChildren',
        staggerChildren: 0.18
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      setContinueFeedback(true);
      setTimeout(() => {
        setContinueFeedback(false);
      }, 3500);
    }
  };

  return (
    <motion.section
      className="letter-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.8 } }}
      transition={{ duration: 0.9 }}
      style={{
        position: 'relative',
        zIndex: 2,
        minHeight: '100svh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 'clamp(28px, 6vh, 60px) clamp(16px, 4vw, 24px)',
        boxSizing: 'border-box'
      }}
    >
      {/* Premium Letter Card */}
      <motion.article
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          maxWidth: '820px',
          margin: 'auto 0',
          backgroundColor: 'rgba(22, 9, 20, 0.82)',
          border: '1px solid rgba(212, 139, 159, 0.18)',
          borderRadius: '14px',
          boxShadow: 'var(--shadow-letter)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          padding: 'clamp(28px, 5vw, 56px) clamp(22px, 5vw, 54px)',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Subtle decorative inner corner glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle at top right, rgba(212, 139, 159, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* 1. Header: Heart symbol */}
        <motion.div
          variants={itemVariants}
          style={{
            textAlign: 'center',
            marginBottom: '12px'
          }}
        >
          <span
            style={{
              fontSize: '1.35rem',
              color: 'var(--accent-rose)',
              display: 'inline-block',
              filter: 'drop-shadow(0 0 10px rgba(212, 139, 159, 0.45))'
            }}
          >
            ♡
          </span>
        </motion.div>

        {/* 2. Header: Subtitle */}
        <motion.p
          variants={itemVariants}
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.78rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--accent-rose-soft)',
            fontWeight: 500,
            margin: '0 0 14px 0',
            opacity: 0.95
          }}
        >
          A LITTLE MESSAGE FROM MY HEART
        </motion.p>

        {/* 3. Header: Main Heading */}
        <motion.h1
          variants={itemVariants}
          style={{
            textAlign: 'center',
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 4.2vw, 3.1rem)',
            fontWeight: 400,
            lineHeight: 1.18,
            color: 'var(--text-cream)',
            margin: '0 0 20px 0'
          }}
        >
          <span>For </span>
          <span
            style={{
              fontStyle: 'italic',
              fontWeight: 400,
              color: 'var(--accent-rose)'
            }}
          >
            Eshal
          </span>
        </motion.h1>

        {/* 4. Subtle Divider */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            margin: '0 auto 36px auto',
            maxWidth: '260px',
            color: 'rgba(212, 139, 159, 0.45)'
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(to right, transparent, rgba(212, 139, 159, 0.35))'
            }}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-rose)' }}>✦</span>
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(to left, transparent, rgba(212, 139, 159, 0.35))'
            }}
          />
        </motion.div>

        {/* 5. Letter Content */}
        <div
          className="letter-body"
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--text-ivory)',
            fontSize: 'clamp(1.06rem, 1.85vw, 1.25rem)',
            lineHeight: 1.84,
            fontWeight: 300,
            letterSpacing: '0.012em',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            wordBreak: 'break-word',
            overflowWrap: 'break-word'
          }}
        >
          {/* Greeting */}
          <motion.p
            variants={itemVariants}
            style={{
              margin: 0,
              fontSize: '1.25em',
              color: 'var(--text-cream)',
              fontWeight: 400
            }}
          >
            Hey Eshal,
          </motion.p>

          {/* Happy Birthday */}
          <motion.p
            variants={itemVariants}
            style={{
              margin: 0,
              fontStyle: 'italic',
              fontSize: '1.18em',
              color: 'var(--accent-rose)',
              fontWeight: 400
            }}
          >
            Happy Birthday ❤️
          </motion.p>

          {/* Paragraph 3 */}
          <motion.p variants={itemVariants} style={{ margin: 0, opacity: 0.95 }}>
            Ninnakk sugamaan enn njan karuthunnu.
          </motion.p>

          {/* Paragraph 4 */}
          <motion.p variants={itemVariants} style={{ margin: 0, opacity: 0.95 }}>
            Innathekku nammal parichayapettittu correct oru year aayirikkunnu.
          </motion.p>

          {/* Paragraph 5 */}
          <motion.p variants={itemVariants} style={{ margin: 0, opacity: 0.95 }}>
            Nee poyathil ente life shunyamaayi ennonnum njan parayunnilla. Angane onnum aayittilla… ennalum nee paranja pole, njan korach hurt aayi.
          </motion.p>

          {/* Paragraph 6 */}
          <motion.p variants={itemVariants} style={{ margin: 0, opacity: 0.95 }}>
            Ank oru kaaryam ariyoo… Ippo nee poyathinu shesham njan cheyyunna oro niskarathilum njan Padachonod prarthikkum — nee onnu pazhaya pole ente friend aavan.
          </motion.p>

          {/* Paragraph 7 */}
          <motion.p variants={itemVariants} style={{ margin: 0, opacity: 0.95 }}>
            Enikkum ninne athrakkum ishtaanedi… annnum, innum, ini eppozhum.
          </motion.p>

          {/* Paragraph 8 */}
          <motion.p variants={itemVariants} style={{ margin: 0, opacity: 0.95 }}>
            Pinne, nee poyappol njan ninne kore verukkan sremichu. Angane njan gymum, motivation okkeyum try cheythu nokki.
          </motion.p>

          {/* Paragraph 9 */}
          <motion.p variants={itemVariants} style={{ margin: 0, opacity: 0.95 }}>
            Pakshe sathyam parayaalo… ennekkond pattunnilla.
          </motion.p>

          {/* Paragraph 10 */}
          <motion.p variants={itemVariants} style={{ margin: 0, opacity: 0.95 }}>
            Nammal friendship nirthumbol njan annodu oru kaaryam paranjirunnu…
          </motion.p>

          {/* Paragraph 11 */}
          <motion.p variants={itemVariants} style={{ margin: 0, opacity: 0.95 }}>
            Enikk ninne ishtaan.
          </motion.p>

          {/* Paragraph 12 */}
          <motion.p variants={itemVariants} style={{ margin: 0, opacity: 0.95 }}>
            Njan ninakk vendi kaathirikkum enn.
          </motion.p>

          {/* Paragraph 13 */}
          <motion.p variants={itemVariants} style={{ margin: 0, opacity: 0.95 }}>
            Ath njan veruthe paranjath alla.
          </motion.p>

          {/* Paragraph 14 */}
          <motion.p variants={itemVariants} style={{ margin: 0, opacity: 0.95 }}>
            Ninakk vendi njan ennum kaathirikkum…
          </motion.p>

          {/* Paragraph 15: Birthday Ending */}
          <motion.p
            variants={itemVariants}
            style={{
              margin: '8px 0 0 0',
              fontStyle: 'italic',
              fontSize: '1.28em',
              color: 'var(--accent-rose)',
              fontWeight: 400
            }}
          >
            Wishing you a very Happy Birthday ❤️
          </motion.p>
        </div>

        {/* 6. Letter Footer Section */}
        <motion.div
          variants={itemVariants}
          style={{
            marginTop: '44px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(212, 139, 159, 0.14)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '24px'
          }}
        >
          {/* Gentle Animated Down Arrow & Subtitle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                fontSize: '1.1rem',
                color: 'var(--accent-rose)',
                lineHeight: 1
              }}
            >
              ↓
            </motion.span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.82rem',
                letterSpacing: '0.12em',
                color: 'var(--text-muted)',
                fontWeight: 400
              }}
            >
              There is more to this little journey
            </span>
          </div>

          {/* Interactive Controls Row: Music + Continue */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              width: '100%'
            }}
          >
            {/* Music Button */}
            <MusicButton />

            {/* Continue Button */}
            <motion.button
              type="button"
              id="continue-journey-btn"
              onClick={handleContinue}
              whileHover={{
                y: -1.5,
                borderColor: 'rgba(212, 139, 159, 0.5)',
                backgroundColor: 'rgba(54, 18, 44, 0.65)',
                boxShadow: '0 8px 24px -6px rgba(212, 139, 159, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                fontWeight: 500,
                letterSpacing: '0.06em',
                color: 'var(--text-cream)',
                backgroundColor: 'rgba(38, 14, 32, 0.55)',
                border: '1px solid rgba(212, 139, 159, 0.28)',
                borderRadius: '9999px',
                padding: '10px 24px',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <span>Continue</span>
              <span style={{ color: 'var(--accent-rose)' }}>→</span>
            </motion.button>
          </div>

          {/* Feedback notice for Continue button placeholder */}
          <AnimatePresence>
            {continueFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.78rem',
                  letterSpacing: '0.04em',
                  color: 'var(--accent-gold)',
                  backgroundColor: 'rgba(40, 16, 32, 0.6)',
                  border: '1px solid rgba(223, 184, 158, 0.2)',
                  borderRadius: '6px',
                  padding: '6px 14px'
                }}
              >
                Page 1 complete. Page 2 (Mystery Painting) will connect here soon.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.article>
    </motion.section>
  );
}
