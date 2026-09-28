import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BlowCandles:
 * Interaction controller for blowing out the birthday candles.
 * Supports:
 * 1. Primary fallback button: "Blow the candles" (guaranteed to work everywhere).
 * 2. Optional microphone detection: Detects a puff of breath/sound amplitude.
 * Never blocks the user; robust against denied/unsupported mic environments.
 */
export default function BlowCandles({ onBlow }) {
  const [micActive, setMicActive] = useState(false);
  const [micError, setMicError] = useState(null);
  const [micLevel, setMicLevel] = useState(0);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  // Clean up all audio resources
  const stopMicrophone = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setMicActive(false);
  }, []);

  const triggerBlow = useCallback(() => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    stopMicrophone();
    onBlow();
  }, [onBlow, stopMicrophone]);

  // Request & listen to microphone input
  const startMicrophone = async () => {
    setMicError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError('Microphone not supported on this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      mediaStreamRef.current = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.4;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setMicActive(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let consecutiveLoudFrames = 0;

      const checkVolume = () => {
        if (!analyserRef.current || hasTriggeredRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume amplitude
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalized = Math.min(100, Math.round((average / 128) * 100));
        setMicLevel(normalized);

        // Blow detection threshold (puff of air into microphone produces high broadband energy)
        if (average > 42) {
          consecutiveLoudFrames += 1;
          if (consecutiveLoudFrames >= 3) {
            triggerBlow();
            return;
          }
        } else {
          consecutiveLoudFrames = Math.max(0, consecutiveLoudFrames - 1);
        }

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      animationFrameRef.current = requestAnimationFrame(checkVolume);
    } catch (err) {
      console.warn('Microphone access denied or error:', err);
      setMicError('Microphone permission not granted.');
      stopMicrophone();
    }
  };

  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [stopMicrophone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px',
        width: '100%',
        maxWidth: '420px',
        margin: '18px auto 0 auto'
      }}
    >
      {/* Primary Action Button: Guaranteed Blow Action */}
      <motion.button
        type="button"
        id="blow-candles-btn"
        onClick={triggerBlow}
        whileHover={{
          scale: 1.04,
          y: -2,
          boxShadow:
            '0 14px 35px -6px rgba(212, 139, 159, 0.6), 0 0 26px rgba(223, 184, 158, 0.35)'
        }}
        whileTap={{ scale: 0.96 }}
        style={{
          background:
            'linear-gradient(135deg, rgba(88, 24, 62, 0.98) 0%, rgba(44, 14, 38, 0.98) 100%)',
          border: '1.2px solid rgba(223, 184, 158, 0.55)',
          color: 'var(--text-cream)',
          borderRadius: '9999px',
          padding: '13px 34px',
          fontSize: '0.98rem',
          fontFamily: 'var(--font-sans)',
          fontWeight: 500,
          letterSpacing: '0.06em',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow:
            '0 10px 30px -6px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 139, 159, 0.25)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'border-color 0.3s ease'
        }}
      >
        <span>Blow out the candles</span>
        <span style={{ fontSize: '1.1rem' }}>💨</span>
      </motion.button>

      {/* Secondary / Optional Microphone Interaction Toggle */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {!micActive ? (
          <button
            type="button"
            onClick={startMicrophone}
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid rgba(212, 139, 159, 0.18)',
              backgroundColor: 'rgba(28, 12, 26, 0.5)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-cream)';
              e.currentTarget.style.borderColor = 'rgba(212, 139, 159, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'rgba(212, 139, 159, 0.18)';
            }}
          >
            <span>🎙️</span>
            <span>Or blow directly into your microphone</span>
          </button>
        ) : (
          /* Mic Active State with Live Volume Pulse */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 16px',
              borderRadius: '999px',
              backgroundColor: 'rgba(44, 16, 38, 0.75)',
              border: '1px solid rgba(212, 139, 159, 0.35)'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#34d399',
                boxShadow: '0 0 10px #34d399'
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.82rem',
                color: 'var(--text-cream)',
                letterSpacing: '0.02em'
              }}
            >
              Listening… Blow into your mic!
            </span>
            {/* Live Volume Meter Bar */}
            <div
              style={{
                width: '40px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${micLevel}%`,
                  backgroundColor: micLevel > 40 ? '#f43f5e' : '#fbbf24',
                  transition: 'width 0.1s linear'
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Error notification if microphone was denied/unsupported */}
        <AnimatePresence>
          {micError && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.76rem',
                color: 'var(--accent-rose-soft)',
                margin: 0,
                textAlign: 'center'
              }}
            >
              {micError} Tap the button above to blow the candles.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
