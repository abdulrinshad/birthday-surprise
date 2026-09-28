import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';

/**
 * Format seconds into M:SS
 */
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null || seconds === undefined) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * MemoryAudioPlayer:
 * Custom, intimate, ultra-refined audio player for voice notes.
 * Strictly respects:
 * - NO autoplay.
 * - Stops and resets whenever memory changes.
 * - Clean progress scrubbing, timestamps, replay state, animated waveform equalizer.
 */
export default function MemoryAudioPlayer({
  audioSrc,
  memoryId,
  onPlayStart
}) {
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // When audio source or memory changes: reset completely and pause
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setIsEnded(false);
  }, [audioSrc, memoryId]);

  // Audio event listeners
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsEnded(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (isEnded) {
        audioRef.current.currentTime = 0;
        setIsEnded(false);
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          if (onPlayStart) {
            onPlayStart(memoryId);
          }
        })
        .catch((err) => {
          console.warn('Audio playback note:', err?.message || err);
        });
    }
  };

  // Seek bar interaction
  const handleSeek = useCallback(
    (e) => {
      if (!progressBarRef.current || !duration || !audioRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;

      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      if (isEnded) setIsEnded(false);
    },
    [duration, isEnded]
  );

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleSeek(e);

    const onMouseMove = (moveEvent) => handleSeek(moveEvent);
    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onMouseMove);
      window.removeEventListener('touchend', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onMouseMove);
    window.addEventListener('touchend', onMouseUp);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '420px',
        margin: '0 auto',
        position: 'relative'
      }}
    >
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* Glassmorphic Player Card */}
      <div
        style={{
          background: 'rgba(28, 12, 26, 0.65)',
          border: '1px solid rgba(212, 139, 159, 0.22)',
          borderRadius: '18px',
          padding: '16px 20px',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          boxShadow: isPlaying
            ? '0 12px 30px -8px rgba(0, 0, 0, 0.7), 0 0 24px rgba(212, 139, 159, 0.18)'
            : '0 8px 24px -10px rgba(0, 0, 0, 0.6)',
          transition: 'all 0.35s ease'
        }}
      >
        {/* Top Row: Play/Pause button + Status + Animated Waveform */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Play / Pause / Replay Button */}
            <motion.button
              type="button"
              id={`memory-audio-btn-${memoryId}`}
              aria-label={
                isEnded
                  ? 'Replay voice note'
                  : isPlaying
                  ? 'Pause voice note'
                  : 'Play voice note'
              }
              onClick={togglePlay}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: isPlaying
                  ? 'linear-gradient(135deg, #d48b9f 0%, #a84b65 100%)'
                  : 'rgba(212, 139, 159, 0.14)',
                border: isPlaying
                  ? '1px solid rgba(250, 245, 237, 0.4)'
                  : '1px solid rgba(212, 139, 159, 0.35)',
                color: isPlaying ? '#160a15' : 'var(--accent-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isPlaying
                  ? '0 0 18px rgba(212, 139, 159, 0.5)'
                  : 'none',
                transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease',
                flexShrink: 0
              }}
            >
              {isEnded ? (
                <RotateCcw size={17} strokeWidth={2.4} />
              ) : isPlaying ? (
                <Pause size={17} strokeWidth={2.4} />
              ) : (
                <Play size={17} strokeWidth={2.4} style={{ marginLeft: '2px' }} />
              )}
            </motion.button>

            {/* Label and Subtitle */}
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.86rem',
                  fontWeight: 500,
                  color: isPlaying ? 'var(--text-cream)' : 'var(--text-ivory)',
                  letterSpacing: '0.02em',
                  lineHeight: 1.2
                }}
              >
                {isEnded
                  ? 'Listen again'
                  : isPlaying
                  ? 'Playing voice note…'
                  : 'Listen to this memory'}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.72rem',
                  color: 'var(--accent-rose-soft)',
                  letterSpacing: '0.05em',
                  marginTop: '2px',
                  opacity: 0.85
                }}
              >
                {isPlaying ? 'Voice memory playing' : 'Tap to hear voice note'}
              </div>
            </div>
          </div>

          {/* Animated Equalizer Waveform */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '3px',
              height: '20px',
              paddingRight: '4px'
            }}
            aria-hidden="true"
          >
            {[0.6, 1.0, 0.4, 0.85, 0.5].map((scale, i) => (
              <motion.span
                key={i}
                animate={
                  isPlaying
                    ? {
                        scaleY: [0.35, scale * 1.2, 0.3, scale * 0.9, 0.35],
                        opacity: [0.6, 1, 0.7, 0.95, 0.6]
                      }
                    : { scaleY: 0.25, opacity: 0.35 }
                }
                transition={
                  isPlaying
                    ? {
                        repeat: Infinity,
                        duration: 0.9 + i * 0.15,
                        ease: 'easeInOut'
                      }
                    : { duration: 0.3 }
                }
                style={{
                  display: 'inline-block',
                  width: '3px',
                  height: '18px',
                  background: isPlaying
                    ? 'linear-gradient(to top, #d48b9f, #dfb89e)'
                    : 'rgba(212, 139, 159, 0.4)',
                  borderRadius: '2px',
                  transformOrigin: 'bottom'
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress Bar (Scrubbable) */}
        <div
          ref={progressBarRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          role="slider"
          aria-label="Audio playback progress"
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(currentTime)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (!audioRef.current || !duration) return;
            if (e.key === 'ArrowRight') {
              const next = Math.min(duration, currentTime + 3);
              audioRef.current.currentTime = next;
              setCurrentTime(next);
            } else if (e.key === 'ArrowLeft') {
              const prev = Math.max(0, currentTime - 3);
              audioRef.current.currentTime = prev;
              setCurrentTime(prev);
            }
          }}
          style={{
            position: 'relative',
            width: '100%',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            touchAction: 'none'
          }}
        >
          {/* Track Background */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '4px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              overflow: 'visible'
            }}
          >
            {/* Active Progress Fill */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${progressPercent}%`,
                borderRadius: '999px',
                background:
                  'linear-gradient(90deg, var(--accent-rose-soft) 0%, var(--accent-rose) 60%, var(--accent-gold) 100%)',
                boxShadow: isPlaying ? '0 0 10px rgba(212, 139, 159, 0.5)' : 'none',
                transition: isDragging ? 'none' : 'width 0.1s linear'
              }}
            />

            {/* Scrub Thumb Handle */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${progressPercent}%`,
                transform: 'translate(-50%, -50%)',
                width: isDragging ? '14px' : '10px',
                height: isDragging ? '14px' : '10px',
                borderRadius: '50%',
                backgroundColor: 'var(--text-cream)',
                border: '2px solid var(--accent-rose)',
                boxShadow: '0 0 8px rgba(212, 139, 159, 0.7)',
                pointerEvents: 'none',
                transition: isDragging
                  ? 'transform 0.1s ease, width 0.15s ease, height 0.15s ease'
                  : 'left 0.1s linear, transform 0.1s ease'
              }}
            />
          </div>
        </div>

        {/* Time Counters Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.04em'
          }}
        >
          <span>{formatTime(currentTime)}</span>
          <span style={{ opacity: 0.65 }}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}
