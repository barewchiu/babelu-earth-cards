import { assetUrl } from './assetUrl';

const MUTE_KEY = 'babelu-audio-muted-v1';
const BGM_SRC = assetUrl('/audio/bgm.mp3');

let bgm: HTMLAudioElement | null = null;
let unlocked = false;
let audioCtx: AudioContext | null = null;
let muted = (() => {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
})();

const listeners = new Set<(muted: boolean) => void>();

function ensureBgm() {
  if (bgm) return bgm;
  bgm = new Audio(BGM_SRC);
  bgm.loop = true;
  bgm.preload = 'auto';
  bgm.volume = 0.32;
  return bgm;
}

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

function notify() {
  listeners.forEach((fn) => fn(muted));
}

export function isMuted() {
  return muted;
}

export function subscribeMute(fn: (muted: boolean) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setMuted(next: boolean) {
  muted = next;
  try {
    localStorage.setItem(MUTE_KEY, next ? '1' : '0');
  } catch {
    /* ignore */
  }
  const audio = ensureBgm();
  audio.muted = next;
  if (next) {
    audio.pause();
  } else if (unlocked) {
    void audio.play().catch(() => undefined);
  }
  notify();
}

export function toggleMute() {
  setMuted(!muted);
}

/** Call once after a user gesture so autoplay policies allow BGM. */
export function unlockAudio() {
  unlocked = true;
  ensureCtx();
  if (muted) return;
  const audio = ensureBgm();
  audio.muted = false;
  void audio.play().catch(() => undefined);
}

export function duckBgm(active: boolean) {
  const audio = ensureBgm();
  audio.volume = active ? 0.12 : 0.32;
}

function tone(
  ctx: AudioContext,
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType,
  gainPeak: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainPeak, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** Soft UI tap for buttons. */
export function playClickSfx() {
  if (muted || !unlocked) return;
  const ctx = ensureCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  tone(ctx, 620, t, 0.06, 'triangle', 0.08);
  tone(ctx, 920, t + 0.015, 0.05, 'sine', 0.05);
}

/** Magical chime when a card is revealed after the earth stops. */
export function playCardRevealSfx() {
  if (muted || !unlocked) return;
  const ctx = ensureCtx();
  if (!ctx) return;
  const t = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const start = t + i * 0.09;
    tone(ctx, freq, start, 0.45, 'sine', 0.11);
    tone(ctx, freq * 2, start + 0.02, 0.28, 'triangle', 0.035);
  });
  // Soft sparkle shimmer
  tone(ctx, 1568, t + 0.38, 0.35, 'sine', 0.04);
}
