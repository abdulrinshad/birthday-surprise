import { motion } from 'framer-motion';
import CandleAnimation from './CandleAnimation';

/**
 * BirthdayCake:
 * Renders an artisanal, romantic tiered cake illustration with:
 * - 5 candles (individually lightable 1-by-1)
 * - Subtle floating / breathing physics
 * - Dynamic warm candlelight radiance
 * - Premium burgundy, cocoa, champagne, and gold leaf accents
 */
export default function BirthdayCake({
  candlesLitCount, // 0 to 5
  isBlown = false
}) {
  // 5 Candle positions across the top tier of the cake (viewBox 340 x 280)
  // X positions spaced harmoniously across the top surface
  const candleConfigs = [
    { id: 1, x: 104, y: 72, height: 40, width: 6.5 },
    { id: 2, x: 136, y: 66, height: 44, width: 6.5 },
    { id: 3, x: 167, y: 62, height: 48, width: 7 }, // center tallest
    { id: 4, x: 198, y: 66, height: 44, width: 6.5 },
    { id: 5, x: 230, y: 72, height: 40, width: 6.5 }
  ];

  const anyCandlesLit = candlesLitCount > 0 && !isBlown;

  return (
    <motion.div
      style={{
        position: 'relative',
        width: 'min(380px, 86vw)',
        aspectRatio: '340 / 300',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto'
      }}
      animate={{
        y: [0, -7, 0]
      }}
      transition={{
        duration: 4.2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {/* Warm Ambient Candlelight Radiance Behind Cake */}
      {anyCandlesLit && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.35, 0.55, 0.4, 0.5],
            scale: [0.95, 1.06, 0.98, 1.04]
          }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut'
          }}
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '280px',
            height: '240px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255, 180, 100, 0.38) 0%, rgba(212, 139, 159, 0.18) 45%, transparent 75%)',
            filter: 'blur(35px)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      {/* Main Vector Illustration of the Cake */}
      <svg
        viewBox="0 0 340 300"
        width="100%"
        height="100%"
        style={{
          overflow: 'visible',
          filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.75))',
          position: 'relative',
          zIndex: 1
        }}
      >
        <defs>
          {/* Candle Gradients */}
          <linearGradient id="candle-wax-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d9b6a3" />
            <stop offset="45%" stopColor="#f7ede2" />
            <stop offset="85%" stopColor="#d5a894" />
            <stop offset="100%" stopColor="#b68270" />
          </linearGradient>

          <radialGradient id="candle-ambient-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 220, 140, 0.75)" />
            <stop offset="45%" stopColor="rgba(255, 160, 60, 0.35)" />
            <stop offset="100%" stopColor="rgba(212, 139, 159, 0)" />
          </radialGradient>

          <linearGradient id="candle-flame-outer" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#d94b40" />
            <stop offset="50%" stopColor="#ff9a3c" />
            <stop offset="90%" stopColor="#ffd866" />
            <stop offset="100%" stopColor="#fff5cc" />
          </linearGradient>

          <linearGradient id="candle-flame-inner" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ffba49" />
            <stop offset="60%" stopColor="#fff2a8" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Pedestal Stand Gradients */}
          <linearGradient id="pedestal-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1a0b18" />
            <stop offset="35%" stopColor="#411b33" />
            <stop offset="60%" stopColor="#63264c" />
            <stop offset="85%" stopColor="#2c1124" />
            <stop offset="100%" stopColor="#150613" />
          </linearGradient>

          <linearGradient id="gold-trim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a37f5d" />
            <stop offset="50%" stopColor="#f3d7b6" />
            <stop offset="100%" stopColor="#966d48" />
          </linearGradient>

          {/* Cake Tier 1 (Base Tier - Dark Burgundy Chocolate) */}
          <linearGradient id="tier-base-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1e091b" />
            <stop offset="30%" stopColor="#3d1433" />
            <stop offset="65%" stopColor="#521b44" />
            <stop offset="85%" stopColor="#320f29" />
            <stop offset="100%" stopColor="#170614" />
          </linearGradient>

          {/* Cake Tier 2 (Top Tier - Velvety Plum & Rose Cream) */}
          <linearGradient id="tier-top-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2a0d24" />
            <stop offset="35%" stopColor="#4f1b40" />
            <stop offset="70%" stopColor="#692854" />
            <stop offset="90%" stopColor="#3d1331" />
            <stop offset="100%" stopColor="#20081a" />
          </linearGradient>

          {/* Cream Drip Glaze Gradient */}
          <linearGradient id="cream-glaze" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#eae0d5" />
            <stop offset="40%" stopColor="#faf5ef" />
            <stop offset="80%" stopColor="#f0e5da" />
            <stop offset="100%" stopColor="#dcd0c2" />
          </linearGradient>

          <linearGradient id="rose-cream-glaze" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#d4a3b3" />
            <stop offset="50%" stopColor="#ebd2dc" />
            <stop offset="100%" stopColor="#c892a3" />
          </linearGradient>
        </defs>

        {/* 1. CAKE STAND / PEDESTAL */}
        <g id="pedestal-group">
          {/* Pedestal Base Shadow */}
          <ellipse cx="170" cy="274" rx="100" ry="14" fill="rgba(0, 0, 0, 0.6)" filter="blur(4px)" />

          {/* Pedestal Foot */}
          <path
            d="M 120 270 Q 170 276 220 270 L 210 262 Q 170 266 130 262 Z"
            fill="url(#pedestal-metal)"
            stroke="url(#gold-trim)"
            strokeWidth="0.8"
          />

          {/* Pedestal Pillar Stem */}
          <path
            d="M 158 262 C 158 244 150 236 146 228 L 194 228 C 190 236 182 244 182 262 Z"
            fill="url(#pedestal-metal)"
          />

          {/* Gold Ring around Stem */}
          <ellipse cx="170" cy="245" rx="15" ry="3" fill="url(#gold-trim)" />

          {/* Pedestal Plate / Platter Rim */}
          <ellipse cx="170" cy="226" rx="116" ry="16" fill="url(#pedestal-metal)" stroke="url(#gold-trim)" strokeWidth="1.2" />
          <ellipse cx="170" cy="224" rx="112" ry="14" fill="#1b0818" />
        </g>

        {/* 2. BASE TIER (Tier 1) */}
        <g id="tier-base-group">
          {/* Base Tier Body */}
          <path
            d="
              M 72 176
              L 72 216
              C 72 232, 268 232, 268 216
              L 268 176
              C 268 190, 72 190, 72 176
              Z
            "
            fill="url(#tier-base-gradient)"
          />

          {/* Base Tier Top Surface Rim */}
          <ellipse cx="170" cy="176" rx="98" ry="15" fill="#441738" stroke="rgba(212, 139, 159, 0.2)" strokeWidth="0.5" />

          {/* Base Tier Cream Drips & Swirls */}
          <path
            d="
              M 72 176
              C 84 188, 92 182, 102 192
              C 112 200, 118 196, 126 186
              C 134 178, 142 194, 152 198
              C 162 202, 172 188, 182 184
              C 192 182, 200 196, 212 194
              C 222 192, 230 182, 240 188
              C 250 192, 258 184, 268 176
              C 268 168, 72 168, 72 176
              Z
            "
            fill="url(#cream-glaze)"
            opacity="0.95"
          />

          {/* Delicate Gold Leaf Flecks on Base Tier */}
          <circle cx="106" cy="208" r="1.5" fill="url(#gold-trim)" opacity="0.8" />
          <circle cx="188" cy="214" r="1.8" fill="url(#gold-trim)" opacity="0.85" />
          <circle cx="236" cy="206" r="1.4" fill="url(#gold-trim)" opacity="0.75" />
        </g>

        {/* 3. TOP TIER (Tier 2) */}
        <g id="tier-top-group">
          {/* Top Tier Body */}
          <path
            d="
              M 92 118
              L 92 162
              C 92 176, 248 176, 248 162
              L 248 118
              C 248 132, 92 132, 92 118
              Z
            "
            fill="url(#tier-top-gradient)"
          />

          {/* Top Tier Top Surface Rim */}
          <ellipse cx="170" cy="118" rx="78" ry="13" fill="#5c204b" stroke="rgba(223, 184, 158, 0.3)" strokeWidth="0.8" />

          {/* Velvety Glaze on Top Tier */}
          <path
            d="
              M 92 118
              C 102 128, 110 122, 120 134
              C 128 142, 134 136, 142 126
              C 152 138, 164 136, 172 124
              C 182 136, 192 134, 202 126
              C 214 136, 224 132, 234 124
              C 242 122, 246 120, 248 118
              C 248 112, 92 112, 92 118
              Z
            "
            fill="url(#rose-cream-glaze)"
            opacity="0.92"
          />

          {/* Decorative Gold Leaf Flecks & Pearl Accents */}
          <circle cx="132" cy="120" r="2" fill="url(#gold-trim)" />
          <circle cx="152" cy="122" r="1.6" fill="#ffffff" opacity="0.9" />
          <circle cx="178" cy="122" r="2" fill="url(#gold-trim)" />
          <circle cx="198" cy="120" r="1.6" fill="#ffffff" opacity="0.9" />
          <circle cx="218" cy="121" r="1.8" fill="url(#gold-trim)" />
        </g>

        {/* 4. THE 5 ARTISANAL CANDLES */}
        <g id="candles-group">
          {candleConfigs.map((candle, idx) => (
            <CandleAnimation
              key={candle.id}
              index={idx}
              x={candle.x}
              y={candle.y}
              height={candle.height}
              width={candle.width}
              isLit={idx < candlesLitCount}
              isBlown={isBlown}
            />
          ))}
        </g>
      </svg>
    </motion.div>
  );
}
