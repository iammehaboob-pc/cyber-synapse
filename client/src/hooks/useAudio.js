import { useState, useEffect } from 'react';

// Create a custom hook for Web Audio API synthesis
export const useAudio = () => {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('isMuted');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('isMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  // Helper to get or create AudioContext safely
  const getAudioContext = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    return new AudioContextClass();
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const playSound = (type) => {
    if (isMuted) return;

    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if suspended (browser security autoplays)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'click':
        // Quick subtle click/tick sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'flip':
        // A sweep upwards representing card flip
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;

      case 'match':
        // A bright synth arpeggio (C5 then E5 then G5)
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((freq, idx) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          
          noteOsc.type = 'sine';
          noteOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
          
          noteGain.gain.setValueAtTime(0.0, now);
          noteGain.gain.linearRampToValueAtTime(0.06, now + idx * 0.08 + 0.02);
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);
          
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);
          
          noteOsc.start(now + idx * 0.08);
          noteOsc.stop(now + idx * 0.08 + 0.35);
        });
        break;

      case 'mismatch':
        // Detuned sad buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.25);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;

      case 'win':
        // Neon Victory arpeggio scale upwards
        const winScale = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4 to C6
        winScale.forEach((freq, idx) => {
          const wOsc = ctx.createOscillator();
          const wGain = ctx.createGain();
          wOsc.type = 'triangle';
          wOsc.frequency.setValueAtTime(freq, now + idx * 0.1);
          
          wGain.gain.setValueAtTime(0.0, now);
          wGain.gain.linearRampToValueAtTime(0.08, now + idx * 0.1 + 0.03);
          wGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
          
          wOsc.connect(wGain);
          wGain.connect(ctx.destination);
          
          wOsc.start(now + idx * 0.1);
          wOsc.stop(now + idx * 0.1 + 0.45);
        });
        break;

      default:
        break;
    }
  };

  return {
    isMuted,
    toggleMute,
    playSound
  };
};
