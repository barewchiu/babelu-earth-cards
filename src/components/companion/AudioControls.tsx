import React, { useEffect, useState } from 'react';
import { isMuted, subscribeMute, toggleMute, unlockAudio } from '../../lib/audio';

/** Global mute + unlock BGM on first interaction. */
const AudioControls: React.FC = () => {
  const [muted, setMutedState] = useState(isMuted());

  useEffect(() => subscribeMute(setMutedState), []);

  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  return (
    <button
      type="button"
      className="btn ghost audio-mute"
      onClick={() => {
        unlockAudio();
        toggleMute();
      }}
      aria-label={muted ? '打开背景音乐' : '关闭背景音乐'}
      title={muted ? '打开音乐' : '关闭音乐'}
    >
      {muted ? '音乐关' : '音乐开'}
    </button>
  );
};

export default AudioControls;
