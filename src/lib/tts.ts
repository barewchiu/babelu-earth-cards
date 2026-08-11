export type TtsStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';

export interface TtsHandle {
  stop: () => void;
  pause: () => void;
  resume: () => void;
}

export interface SpeakOptions {
  text: string;
  onStatus?: (status: TtsStatus) => void;
  onProgress?: (ratio: number) => void;
  onEnded?: () => void;
  onError?: (message: string) => void;
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

/** Prefer Doubao via /api/tts; fall back to browser speechSynthesis. */
export async function speakLore(options: SpeakOptions): Promise<TtsHandle> {
  const { text, onStatus, onProgress, onEnded, onError } = options;
  onStatus?.('loading');

  try {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      throw new Error(errBody || `TTS HTTP ${res.status}`);
    }

    const ct = res.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const payload = await res.json().catch(() => ({}));
      throw new Error((payload && payload.error) || 'TTS returned JSON error');
    }

    const blob = await res.blob();
    if (!blob.size) throw new Error('empty audio');

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    let cleaned = false;

    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      URL.revokeObjectURL(url);
    };

    audio.onplaying = () => onStatus?.('playing');
    audio.onpause = () => {
      if (!audio.ended) onStatus?.('paused');
    };
    audio.ontimeupdate = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        onProgress?.(clamp01(audio.currentTime / audio.duration));
      }
    };
    audio.onended = () => {
      onProgress?.(1);
      onStatus?.('ended');
      onEnded?.();
      cleanup();
    };
    audio.onerror = () => {
      cleanup();
      throw new Error('audio element failed');
    };

    await audio.play();
    return {
      stop: () => {
        audio.pause();
        audio.currentTime = 0;
        cleanup();
        onStatus?.('idle');
      },
      pause: () => {
        audio.pause();
      },
      resume: () => {
        void audio.play();
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[tts] Doubao unavailable, using speechSynthesis:', message);
    return speakWithBrowser(options);
  }
}

function speakWithBrowser(options: SpeakOptions): TtsHandle {
  const { text, onStatus, onProgress, onEnded, onError } = options;

  if (typeof window === 'undefined' || !window.speechSynthesis) {
    onStatus?.('error');
    onError?.('当前浏览器不支持语音朗读');
    return { stop: () => undefined, pause: () => undefined, resume: () => undefined };
  }

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'zh-CN';
  utter.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const zh =
    voices.find((v) => /zh|chinese/i.test(v.lang) && /female|女|xiaoxiao|tingting/i.test(v.name)) ||
    voices.find((v) => /zh|chinese/i.test(v.lang));
  if (zh) utter.voice = zh;

  let startedAt = 0;
  let timer: number | undefined;
  const estMs = Math.max(4000, text.length * 160);

  const tick = () => {
    if (!startedAt) return;
    onProgress?.(clamp01((Date.now() - startedAt) / estMs));
  };

  utter.onstart = () => {
    startedAt = Date.now();
    onStatus?.('playing');
    timer = window.setInterval(tick, 200);
  };
  utter.onend = () => {
    if (timer) window.clearInterval(timer);
    onProgress?.(1);
    onStatus?.('ended');
    onEnded?.();
  };
  utter.onerror = () => {
    if (timer) window.clearInterval(timer);
    onStatus?.('error');
    onError?.('浏览器朗读失败');
  };

  window.speechSynthesis.speak(utter);
  onStatus?.('playing');

  return {
    stop: () => {
      if (timer) window.clearInterval(timer);
      window.speechSynthesis.cancel();
      onStatus?.('idle');
    },
    pause: () => {
      window.speechSynthesis.pause();
      onStatus?.('paused');
    },
    resume: () => {
      window.speechSynthesis.resume();
      onStatus?.('playing');
    },
  };
}
