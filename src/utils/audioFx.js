/**
 * audioFx:
 * Lightweight procedural sound synthesis for tactile graphite sketching using Web Audio API.
 * Uses zero external assets/files, runs entirely client-side.
 */

class SoundController {
  constructor() {
    this.ctx = null;
    this.noiseBuffer = null;
    this.brushSource = null;
    this.brushGain = null;
    this.isBrushing = false;
    this.muted = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.generateNoiseBuffer();
      }
    } catch {
      // Audio not supported or blocked, fail silently
    }
  }

  generateNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    // Pink-noise generator for realistic soft paper & graphite tooth texture
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = lastOut * 0.92 + white * 0.08;
      data[i] = lastOut * 1.5;
    }
    this.noiseBuffer = buffer;
  }

  startBrushStroke() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.noiseBuffer) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isBrushing) return;
    this.isBrushing = true;

    try {
      this.brushSource = this.ctx.createBufferSource();
      this.brushSource.buffer = this.noiseBuffer;
      this.brushSource.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400; // Characteristic paper whisper
      filter.Q.value = 1.8;

      this.brushGain = this.ctx.createGain();
      this.brushGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.brushGain.gain.linearRampToValueAtTime(0.045, this.ctx.currentTime + 0.06);

      this.brushSource.connect(filter);
      filter.connect(this.brushGain);
      this.brushGain.connect(this.ctx.destination);

      this.brushSource.start();
    } catch {
      // Fail silently
    }
  }

  stopBrushStroke() {
    if (!this.isBrushing || !this.ctx || !this.brushGain) return;
    this.isBrushing = false;
    try {
      const now = this.ctx.currentTime;
      this.brushGain.gain.setValueAtTime(this.brushGain.gain.value, now);
      this.brushGain.gain.linearRampToValueAtTime(0.0001, now + 0.08);
      setTimeout(() => {
        if (this.brushSource) {
          try {
            this.brushSource.stop();
            this.brushSource.disconnect();
          } catch {
            // Ignored
          }
          this.brushSource = null;
        }
      }, 100);
    } catch {
      // Ignored
    }
  }

  playBlowDust() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.noiseBuffer) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const source = this.ctx.createBufferSource();
      source.buffer = this.noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(2200, this.ctx.currentTime + 0.5);
      filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 1.2);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.3);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start();
      source.stop(this.ctx.currentTime + 1.4);
    } catch {
      // Ignored
    }
  }
}

export const soundFx = new SoundController();
