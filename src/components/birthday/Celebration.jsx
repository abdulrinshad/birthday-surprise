import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Celebration:
 * Cinematic, elegant birthday celebration effects:
 * - Subtle sparkle burst radiating from the cake
 * - Elegant, restrained confetti (champagne, rose gold, deep plum)
 * - 4 gentle satin balloons slowly ascending
 * - Timed completion callback to reveal the birthday message
 */
export default function Celebration({ onCelebrationSettled }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onCelebrationSettled) {
        onCelebrationSettled();
      }
    }, 4800);

    return () => clearTimeout(timer);
  }, [onCelebrationSettled]);

  // Deterministic particle generation (pure, fast, no re-render flicker)
  const confettiPieces = useMemo(() => {
    const colors = ['#dfb89e', '#d48b9f', '#ffccd5', '#a84b65', '#f7f1e6', '#c47d8f'];
    return Array.from({ length: 32 }, (_, i) => {
      const pseudoRand1 = ((i * 17 + 7) % 31) / 31;
      const pseudoRand2 = ((i * 23 + 11) % 43) / 43;
      const pseudoRand3 = ((i * 29 + 13) % 59) / 59;
      return {
        id: i,
        x: 8 + (i * 84) / 32 + (pseudoRand1 * 6 - 3),
        startY: -10 - pseudoRand2 * 20,
        endY: 105 + pseudoRand3 * 15,
        rotation: pseudoRand1 * 360,
        endRotation: pseudoRand2 * 720 - 360,
        color: colors[i % colors.length],
        size: 5 + pseudoRand1 * 6,
        aspect: i % 3 === 0 ? 'circle' : 'rect',
        duration: 3.4 + pseudoRand2 * 2.0,
        delay: pseudoRand3 * 1.2
      };
    });
  }, []);

  // 4 elegant floating balloons
  const balloons = useMemo(() => [
    { id: 1, x: '18%', delay: 0.2, duration: 6.5, color: '#521b44', size: 54, sway: -25 },
    { id: 2, x: '78%', delay: 0.6, duration: 7.2, color: '#993d62', size: 60, sway: 30 },
    { id: 3, x: '28%', delay: 1.1, duration: 7.8, color: '#dfb89e', size: 48, sway: 20 },
    { id: 4, x: '68%', delay: 1.5, duration: 8.2, color: '#38122d', size: 52, sway: -22 }
  ], []);

  // Sparkle burst particles
  const sparkles = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => {
      const angle = (i / 16) * 2 * Math.PI;
      const pseudoDist = 90 + (((i * 19 + 5) % 29) / 29) * 80;
      const pseudoScale = 0.6 + (((i * 13 + 3) % 17) / 17) * 0.7;
      const pseudoDelay = (((i * 7 + 2) % 11) / 11) * 0.25;
      return {
        id: i,
        targetX: Math.cos(angle) * pseudoDist,
        targetY: Math.sin(angle) * pseudoDist,
        scale: pseudoScale,
        delay: pseudoDelay
      };
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
        overflow: 'hidden'
      }}
    >
      {/* 1. Sparkle Burst Center (originates near cake center) */}
      <div
        style={{
          position: 'absolute',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1px',
          height: '1px'
        }}
      >
        {sparkles.map((sp) => (
          <motion.div
            key={sp.id}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: sp.targetX,
              y: sp.targetY,
              scale: [0, sp.scale, 0],
              opacity: [1, 0.9, 0]
            }}
            transition={{
              duration: 1.6,
              delay: sp.delay,
              ease: [0.25, 1, 0.5, 1]
            }}
            style={{
              position: 'absolute',
              color: '#ffe5b4',
              fontSize: '1.2rem',
              filter: 'drop-shadow(0 0 8px rgba(255, 215, 160, 0.8))'
            }}
          >
            ✦
          </motion.div>
        ))}
      </div>

      {/* 2. Restrained Elegant Confetti Flutter */}
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            top: `${piece.startY}%`,
            left: `${piece.x}%`,
            rotate: piece.rotation,
            opacity: 0,
            scale: 0.8
          }}
          animate={{
            top: `${piece.endY}%`,
            rotate: piece.endRotation,
            opacity: [0, 0.9, 0.9, 0],
            scale: 1,
            x: [0, Math.sin(piece.id) * 35, 0]
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: [0.3, 0.7, 0.4, 1]
          }}
          style={{
            position: 'absolute',
            width: `${piece.size}px`,
            height: piece.aspect === 'rect' ? `${piece.size * 1.5}px` : `${piece.size}px`,
            borderRadius: piece.aspect === 'circle' ? '50%' : '2px',
            backgroundColor: piece.color,
            boxShadow: `0 0 6px ${piece.color}66`
          }}
        />
      ))}

      {/* 3. Elegant Satin Balloons Ascending Slowly */}
      {balloons.map((balloon) => (
        <motion.div
          key={balloon.id}
          initial={{
            bottom: '-120px',
            left: balloon.x,
            opacity: 0,
            x: 0
          }}
          animate={{
            bottom: '115%',
            opacity: [0, 0.85, 0.85, 0],
            x: [0, balloon.sway, -balloon.sway / 2, 0]
          }}
          transition={{
            duration: balloon.duration,
            delay: balloon.delay,
            ease: [0.35, 0.1, 0.25, 1]
          }}
          style={{
            position: 'absolute',
            width: `${balloon.size}px`,
            height: `${balloon.size * 1.25}px`,
            borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
            background: `radial-gradient(circle at 35% 30%, #ffffff55 0%, ${balloon.color} 50%, #00000088 100%)`,
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* Balloon knot */}
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
              width: '6px',
              height: '4px',
              backgroundColor: balloon.color,
              borderRadius: '2px'
            }}
          />
          {/* Subtle curved string */}
          <svg
            width="20"
            height="45"
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              overflow: 'visible'
            }}
          >
            <path
              d="M 10 0 Q 15 15 8 28 T 10 45"
              fill="none"
              stroke="rgba(212, 139, 159, 0.35)"
              strokeWidth="1"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
