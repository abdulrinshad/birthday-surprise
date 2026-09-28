import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * FloatingParticles:
 * Extremely subtle, warm, ambient floating particles.
 * Non-distracting, minimal, and organic to feel like soft candlelight embers or delicate motes.
 */
export default function FloatingParticles() {
  const particles = useMemo(() => {
    // A small, restrained collection of 16 particles
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: (i * 6.25 + 3) + ((i * 7) % 6), // distributed horizontally
      y: (i * 5.9 + 5) + ((i * 11) % 8), // distributed vertically
      size: (i % 3 === 0) ? 2.2 : (i % 2 === 0 ? 1.6 : 1.2),
      duration: 7 + (i % 5) * 2.5,
      delay: (i % 4) * 1.2,
      opacityMax: 0.28 + (i % 3) * 0.08,
      color: i % 2 === 0 ? 'rgba(223, 184, 158, ' : 'rgba(212, 139, 159, ',
      driftX: ((i % 5) - 2) * 12,
      driftY: - (20 + (i % 4) * 8)
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 1
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            x: 0,
            y: 0
          }}
          animate={{
            opacity: [0, p.opacityMax, p.opacityMax * 0.4, 0],
            x: [0, p.driftX, p.driftX * 0.5, 0],
            y: [0, p.driftY, p.driftY * 1.8, p.driftY * 2.4]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            backgroundColor: `${p.color}0.85)`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}0.6)`
          }}
        />
      ))}
    </div>
  );
}
