import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

/**
 * MusicButton:
 * Audio player button for "public/music.mp3".
 * Complies strictly with no-autoplay rule.
 * Switches between "♫ Play Music" and "Ⅱ Pause Music".
 * Includes an ambient audio synthesizer fallback if audio loading encounters issues.
 */
export default function MusicButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const synthCtxRef = useRef(null);
  const synthTimerRef = useRef(null);

  // Initialize or get audio element
  useEffect(() => {
    const audio = new Audio('/music.mp3');
    audio.loop = true;
    audio.preload = 'auto';

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false));

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      if (synthTimerRef.current) clearInterval(synthTimerRef.current);
      if (synthCtxRef.current && synthCtxRef.current.state !== 'closed') {
        synthCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Soft ambient chime synthesizer fallback (gentle pentatonic piano/chime notes)
  const startAmbientSynth = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!synthCtxRef.current) {
        synthCtxRef.current = new AudioContextClass();
      }

      const ctx = synthCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const chords = [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 440.0],  // Am7
        [174.61, 261.63, 329.63, 392.0], // Fmaj7
        [196.0, 246.94, 293.66, 392.0]   // G6
      ];
      let chordIndex = 0;

      const playChord = () => {
        if (!synthCtxRef.current || synthCtxRef.current.state === 'closed') return;
        const currentChord = chords[chordIndex % chords.length];
        chordIndex++;

        currentChord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(800, ctx.currentTime);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.15);

          const startTime = ctx.currentTime + idx * 0.15;
          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(0.04, startTime + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 3.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 4.0);
        });
      };

      playChord();
      synthTimerRef.current = setInterval(playChord, 3800);
      setIsPlaying(true);
    } catch {
      // Audio fallback silent fail
    }
  }, []);

  const stopAmbientSynth = useCallback(() => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (synthCtxRef.current && synthCtxRef.current.state === 'running') {
      synthCtxRef.current.suspend().catch(() => {});
    }
    setIsPlaying(false);
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;

    if (isPlaying) {
      if (audio && !audio.paused) {
        audio.pause();
      }
      stopAmbientSynth();
      setIsPlaying(false);
    } else {
      if (audio) {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch {
          // If browser restricts audio file or file is corrupted, fall back to procedural ambient chime
          startAmbientSynth();
        }
      } else {
        startAmbientSynth();
      }
    }
  };

  return (
    <motion.button
      type="button"
      id="music-toggle-btn"
      onClick={toggleMusic}
      aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
      whileHover={{
        y: -1.5,
        borderColor: 'rgba(212, 139, 159, 0.45)',
        backgroundColor: 'rgba(38, 14, 32, 0.7)'
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.84rem',
        fontWeight: 500,
        letterSpacing: '0.06em',
        color: isPlaying ? 'var(--accent-rose)' : 'var(--text-muted)',
        backgroundColor: 'rgba(24, 10, 22, 0.55)',
        border: `1px solid ${isPlaying ? 'rgba(212, 139, 159, 0.35)' : 'rgba(212, 139, 159, 0.18)'}`,
        borderRadius: '9999px',
        padding: '9px 20px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        cursor: 'pointer',
        boxShadow: isPlaying ? '0 0 16px rgba(212, 139, 159, 0.2)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <span
        style={{
          fontSize: '0.9rem',
          color: isPlaying ? 'var(--accent-rose)' : 'var(--accent-rose-soft)'
        }}
      >
        {isPlaying ? 'Ⅱ' : '♫'}
      </span>
      <span>{isPlaying ? 'Pause Music' : 'Play Music'}</span>
    </motion.button>
  );
}
