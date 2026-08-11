import React, { useCallback, useEffect, useRef, useState } from 'react';
import EarthDie from './EarthDie';
import CardFlip from './CardFlip';
import { RegionFace } from '../../data/regions';
import {
  CompanionCard,
  drawCardFromFace,
  pickRandomFaceWithCards,
} from '../../data/catalog';
import { CollectionMap, collectCard } from '../../lib/collection';
import { getCardLore } from '../../lib/lore';
import { speakLore, TtsHandle, TtsStatus } from '../../lib/tts';
import { assetUrl } from '../../lib/assetUrl';
import { duckBgm, playCardRevealSfx, unlockAudio } from '../../lib/audio';
import AudioControls from './AudioControls';

interface DrawScreenProps {
  collection: CollectionMap;
  onCollectionChange: (next: CollectionMap) => void;
  onBack: () => void;
}

type Phase = 'idle' | 'spinning' | 'reveal';

const DrawScreen: React.FC<DrawScreenProps> = ({
  collection,
  onCollectionChange,
  onBack,
}) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [targetFace, setTargetFace] = useState<RegionFace | null>(null);
  const [drawn, setDrawn] = useState<CompanionCard | null>(null);
  const [justCollected, setJustCollected] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [listenedComplete, setListenedComplete] = useState(false);
  const [ttsStatus, setTtsStatus] = useState<TtsStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [ttsError, setTtsError] = useState<string | null>(null);
  const [showReadFallback, setShowReadFallback] = useState(false);

  const handleRef = useRef<TtsHandle | null>(null);
  const loreRef = useRef('');

  const stopTts = useCallback(() => {
    handleRef.current?.stop();
    handleRef.current = null;
    duckBgm(false);
  }, []);

  useEffect(() => () => stopTts(), [stopTts]);

  useEffect(() => {
    stopTts();
    setFlipped(false);
    setListenedComplete(false);
    setTtsStatus('idle');
    setProgress(0);
    setTtsError(null);
    setShowReadFallback(false);
    if (drawn) {
      loreRef.current = getCardLore(drawn);
    } else {
      loreRef.current = '';
    }
  }, [drawn, stopTts]);

  const startReading = useCallback(async () => {
    if (!drawn || listenedComplete) return;
    stopTts();
    setTtsError(null);
    setShowReadFallback(false);
    setProgress(0);
    const text = loreRef.current || getCardLore(drawn);

    const handle = await speakLore({
      text,
      onStatus: (s) => {
        setTtsStatus(s);
        if (s === 'playing' || s === 'loading') duckBgm(true);
        if (s === 'ended' || s === 'idle' || s === 'error') duckBgm(false);
      },
      onProgress: setProgress,
      onEnded: () => {
        setListenedComplete(true);
        setProgress(1);
        duckBgm(false);
      },
      onError: (msg) => {
        setTtsError(msg);
        setShowReadFallback(true);
        duckBgm(false);
      },
    });
    handleRef.current = handle;

    // If Doubao failed immediately to browser and browser also fails silently,
    // offer read-confirm after a short wait while still loading.
    window.setTimeout(() => {
      setTtsStatus((s) => {
        if (s === 'loading' || s === 'error') {
          setShowReadFallback(true);
        }
        return s;
      });
    }, 8000);
  }, [drawn, listenedComplete, stopTts]);

  const handleFlipChange = useCallback(
    (next: boolean) => {
      setFlipped(next);
      if (next) {
        void startReading();
      } else {
        stopTts();
        setTtsStatus('idle');
      }
    },
    [startReading, stopTts]
  );

  const handleThrow = () => {
    if (phase === 'spinning') return;
    unlockAudio();
    stopTts();
    duckBgm(false);
    setJustCollected(false);
    setDrawn(null);
    const face = pickRandomFaceWithCards();
    setTargetFace(face);
    setPhase('spinning');
  };

  const handleSpinComplete = useCallback(() => {
    if (!targetFace) return;
    const card = drawCardFromFace(targetFace);
    setDrawn(card);
    setPhase('reveal');
    if (card) playCardRevealSfx();
  }, [targetFace]);

  const handleCollect = () => {
    if (!drawn || (!listenedComplete && !ownedAlready(collection, drawn))) return;
    onCollectionChange(collectCard(collection, drawn));
    setJustCollected(true);
  };

  const owned = drawn ? Boolean(collection[drawn.id]) : false;
  const canCollect = owned || justCollected || listenedComplete;

  const togglePause = () => {
    if (!handleRef.current) return;
    if (ttsStatus === 'playing') handleRef.current.pause();
    else if (ttsStatus === 'paused') handleRef.current.resume();
  };

  return (
    <div className="screen draw-screen">
      <header className="screen-bar">
        <button type="button" className="btn ghost" onClick={onBack}>
          ← 返回
        </button>
        <h1>掷地球 · 抽卡</h1>
        <div className="screen-bar__right">
          <AudioControls />
          <span className="pill">收藏 {Object.keys(collection).length}</span>
        </div>
      </header>

      <div className="draw-layout">
        <section className="draw-die-panel">
          <EarthDie
            spinning={phase === 'spinning'}
            targetFace={targetFace}
            highlighted={phase === 'reveal'}
            onSpinComplete={handleSpinComplete}
          />
          <div className="die-status">
            {phase === 'idle' && <p>点击下方按钮，转动神秘地球</p>}
            {phase === 'spinning' && <p className="pulse">穿越星辰选区中…</p>}
            {phase === 'reveal' && targetFace && (
              <p>
                停在{' '}
                <strong
                  className="region-badge"
                  style={{ background: targetFace.color }}
                >
                  {targetFace.label}
                </strong>
              </p>
            )}
          </div>
          <button
            type="button"
            className="btn primary throw-btn"
            onClick={handleThrow}
            disabled={phase === 'spinning'}
          >
            {phase === 'spinning' ? '旋转中…' : phase === 'reveal' ? '再转一次' : '转动地球抽卡'}
          </button>
          <p className="draw-tip">先选定地区，再抽取该地区百科卡</p>
        </section>

        <section className="draw-result-panel">
          {drawn ? (
            <>
              <CardFlip card={drawn} large onFlipChange={handleFlipChange} />

              {flipped && (
                <div className="lore-player" aria-live="polite">
                  <div className="lore-player__head">
                    <span className="lore-player__label">
                      {listenedComplete
                        ? '介绍听完啦'
                        : ttsStatus === 'loading'
                          ? '豆包语音准备中…'
                          : ttsStatus === 'playing'
                            ? '正在听百科介绍'
                            : ttsStatus === 'paused'
                              ? '已暂停'
                              : ttsStatus === 'error'
                                ? '朗读遇到问题'
                                : '准备朗读'}
                    </span>
                    {(ttsStatus === 'playing' || ttsStatus === 'paused') && (
                      <button type="button" className="btn ghost lore-player__pause" onClick={togglePause}>
                        {ttsStatus === 'paused' ? '继续' : '暂停'}
                      </button>
                    )}
                    {!listenedComplete && (ttsStatus === 'idle' || ttsStatus === 'error' || ttsStatus === 'ended') && (
                      <button type="button" className="btn ghost lore-player__pause" onClick={() => void startReading()}>
                        重新朗读
                      </button>
                    )}
                  </div>
                  <div className="lore-player__track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
                    <div className="lore-player__fill" style={{ width: `${Math.round(progress * 100)}%` }} />
                  </div>
                  <p className="lore-player__script">{loreRef.current || getCardLore(drawn)}</p>
                  {ttsError && <p className="lore-player__warn">{ttsError}</p>}
                  {showReadFallback && !listenedComplete && (
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={() => {
                        stopTts();
                        setListenedComplete(true);
                        setProgress(1);
                        setTtsStatus('ended');
                      }}
                    >
                      我已读完介绍
                    </button>
                  )}
                </div>
              )}

              <div className="draw-actions">
                <button
                  type="button"
                  className="btn primary"
                  onClick={handleCollect}
                  disabled={!canCollect || owned || justCollected}
                  title={
                    canCollect
                      ? undefined
                      : '请先翻到背面，听完百科介绍后再收藏'
                  }
                >
                  {owned || justCollected
                    ? '已收入收藏盒'
                    : canCollect
                      ? '收入收藏盒'
                      : flipped
                        ? '听完介绍后即可收藏'
                        : '先翻背面听介绍'}
                </button>
                {!canCollect && (
                  <p className="draw-lock-note">
                    听完 AI 朗读后，收藏按钮才会点亮哦
                  </p>
                )}
                {(justCollected || owned) && (
                  <p className="success-note">已放入 {drawn.region} 分区</p>
                )}
              </div>
            </>
          ) : (
            <div className="draw-placeholder">
              <img src={assetUrl('/brand/cartoon-earth.png')} alt="卡通地球" />
              <p>转动卡通地球选区 → 抽取该地区百科卡</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

function ownedAlready(collection: CollectionMap, card: CompanionCard) {
  return Boolean(collection[card.id]);
}

export default DrawScreen;
