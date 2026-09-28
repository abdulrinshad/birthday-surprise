import { motion } from 'framer-motion';

/**
 * CandleAnimation:
 * Renders an individual artisanal candle with:
 * - Slender wax body & wick
 * - Realistic flickering teardrop flame with layered warm glow
 * - Dynamic smoke trail when extinguished
 * - Micro-ember particles
 */
export default function CandleAnimation({
  index,
  isLit,
  isBlown,
  x,
  y = 0,
  height = 42,
  width = 7
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Candle Shadow */}
      <ellipse
        cx={width / 2}
        cy={height + 2}
        rx={width * 0.9}
        ry={2}
        fill="rgba(0, 0, 0, 0.35)"
      />

      {/* Slender Candle Wax Body */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={width / 2}
        fill="url(#candle-wax-gradient)"
        stroke="rgba(223, 184, 158, 0.3)"
        strokeWidth="0.5"
      />

      {/* Wax Highlight Sheen */}
      <line
        x1={width * 0.28}
        y1={3}
        x2={width * 0.28}
        y2={height - 3}
        stroke="rgba(255, 255, 255, 0.25)"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Candle Wick */}
      <line
        x1={width / 2}
        y1={0}
        x2={width / 2}
        y2={-6}
        stroke="#2c2226"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Ambient Flame Glow (Visible when Lit and not Blown) */}
      {isLit && !isBlown && (
        <motion.circle
          cx={width / 2}
          cy={-14}
          r={18}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0.65, 0.85, 0.7, 0.82],
            scale: [0.95, 1.05, 0.98, 1.02]
          }}
          transition={{
            duration: 1.8 + (index % 3) * 0.3,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          fill="url(#candle-ambient-glow)"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Realistic Flickering Flame */}
      {isLit && !isBlown && (
        <motion.g
          initial={{ scale: 0, opacity: 0, y: 4 }}
          animate={{
            scale: [0.95, 1.04, 0.98, 1.02, 0.96],
            opacity: [0.92, 1, 0.95, 1, 0.94],
            y: [-1, 1, -0.5, 0.5, -1],
            rotate: [-1.5, 2, -1, 1.5, -1.5]
          }}
          exit={{ scale: 0, opacity: 0, transition: { duration: 0.25 } }}
          transition={{
            duration: 0.9 + (index % 4) * 0.15,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{ transformOrigin: `${width / 2}px -6px` }}
        >
          {/* Outer Warm Amber Flame */}
          <path
            d={`
              M ${width / 2} -22
              C ${width / 2 + 5} -16, ${width / 2 + 4.5} -8, ${width / 2} -6
              C ${width / 2 - 4.5} -8, ${width / 2 - 5} -16, ${width / 2} -22
              Z
            `}
            fill="url(#candle-flame-outer)"
          />

          {/* Inner Golden Core */}
          <path
            d={`
              M ${width / 2} -18
              C ${width / 2 + 3} -14, ${width / 2 + 2.5} -8, ${width / 2} -6
              C ${width / 2 - 2.5} -8, ${width / 2 - 3} -14, ${width / 2} -18
              Z
            `}
            fill="url(#candle-flame-inner)"
          />

          {/* White Hot Center Core */}
          <ellipse
            cx={width / 2}
            cy={-8}
            rx={1.3}
            ry={2.5}
            fill="#ffffff"
            opacity="0.95"
          />

          {/* Micro Spark / Ember floating above flame */}
          <motion.circle
            cx={width / 2 + (index % 2 === 0 ? 1 : -1)}
            cy={-23}
            r={0.9}
            animate={{
              y: [-2, -8, -12],
              opacity: [0.8, 0.5, 0],
              scale: [1, 0.8, 0.3]
            }}
            transition={{
              duration: 1.4 + (index % 3) * 0.2,
              repeat: Infinity,
              ease: 'easeOut',
              delay: index * 0.25
            }}
            fill="#ffdd99"
          />
        </motion.g>
      )}

      {/* Gentle Rising Smoke Wisps when Extinguished */}
      {isBlown && (
        <motion.g
          initial={{ opacity: 0, y: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 0.7, 0.45, 0],
            y: [-2, -18, -32, -45],
            x: [0, (index % 2 === 0 ? 3 : -3), (index % 2 === 0 ? -4 : 4), (index % 2 === 0 ? 6 : -6)],
            scale: [0.6, 1.2, 1.8, 2.4]
          }}
          transition={{
            duration: 2.2,
            ease: 'easeOut',
            delay: (index % 5) * 0.08
          }}
          style={{ transformOrigin: `${width / 2}px -6px` }}
        >
          {/* Subtle Curled Smoke Trail */}
          <path
            d={`
              M ${width / 2} -7
              Q ${width / 2 + 3} -15, ${width / 2 - 2} -22
              T ${width / 2 + 2} -32
            `}
            fill="none"
            stroke="rgba(215, 205, 215, 0.45)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle
            cx={width / 2}
            cy={-14}
            r={2}
            fill="rgba(215, 205, 215, 0.3)"
            filter="blur(1px)"
          />
        </motion.g>
      )}
    </g>
  );
}
