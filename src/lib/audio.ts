import { assetUrl } from './assetUrl';

const MUTE_KEY = 'babelu-audio-muted-v1';
const BGM_SRC = assetUrl('/audio/bgm.mp3');

let bgm: HTMLAudioElement | null = null;
let unlocked = false;
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

function notify() {
  listeners.forEach((fn) => fn(muted));
}

export function isMuted() {
  return muted;
}

export function subscribeMute(fn: (muted: boolean) => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
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
  if (muted) return;
  const audio = ensureBgm();
  audio.muted = false;
  void audio.play().catch(() => undefined);
}

export function duckBgm(active: boolean) {
  const audio = ensureBgm();
  audio.volume = active ? 0.12 : 0.32;
}
