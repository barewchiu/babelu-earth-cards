import React, { useMemo, useState } from 'react';
import { ALL_CARDS, CompanionCard } from '../../data/catalog';
import { CollectionMap } from '../../lib/collection';

interface BattleScreenProps {
  collection: CollectionMap;
  onBack: () => void;
}

type Side = 'you' | 'rival';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function dealHands(collection: CollectionMap): { you: CompanionCard[]; rival: CompanionCard[] } {
  const owned = Object.values(collection);
  const pool =
    owned.length >= 16
      ? shuffle(owned)
      : shuffle([...owned, ...ALL_CARDS.filter((c) => !collection[c.id])]).slice(0, 40);

  const deck = shuffle(pool.length >= 16 ? pool : shuffle(ALL_CARDS)).slice(0, 16);
  return {
    you: deck.slice(0, 8),
    rival: deck.slice(8, 16),
  };
}

const BattleScreen: React.FC<BattleScreenProps> = ({ collection, onBack }) => {
  const initial = useMemo(() => dealHands(collection), [collection]);
  const [youHand, setYouHand] = useState(initial.you);
  const [rivalHand, setRivalHand] = useState(initial.rival);
  const [pileTop, setPileTop] = useState<CompanionCard | null>(null);
  const [turn, setTurn] = useState<Side>('you');
  const [log, setLog] = useState<string[]>(['钻石对战练习开始 · 需打出 ≥ 桌面钻石数的牌']);
  const [winner, setWinner] = useState<Side | null>(null);
  const [demoNote] = useState(Object.keys(collection).length < 16);

  const required = pileTop?.diamonds ?? 1;

  const pushLog = (line: string) => setLog((prev) => [line, ...prev].slice(0, 6));

  const finishIfNeeded = (youNext: CompanionCard[], rivalNext: CompanionCard[]) => {
    if (youNext.length === 0) {
      setWinner('you');
      pushLog('你清空手牌，获胜！可从对方手牌中选一张讲解（实体规则）。');
      return true;
    }
    if (rivalNext.length === 0) {
      setWinner('rival');
      pushLog('对手清空手牌。请讲解一张你的牌（实体规则）。');
      return true;
    }
    return false;
  };

  const rivalAutoPlay = (youNext: CompanionCard[], rivalNext: CompanionCard[], top: CompanionCard | null) => {
    if (winner) return;
    const need = top?.diamonds ?? 1;
    const playable = rivalNext
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => c.diamonds >= need)
      .sort((a, b) => a.c.diamonds - b.c.diamonds);

    window.setTimeout(() => {
      if (playable.length > 0) {
        const pick = playable[0];
        const hand = rivalNext.filter((_, idx) => idx !== pick.i);
        setRivalHand(hand);
        setPileTop(pick.c);
        pushLog(`对手打出 ${pick.c.name}（◆${pick.c.diamonds}）`);
        if (!finishIfNeeded(youNext, hand)) {
          setTurn('you');
        }
      } else if (rivalNext.length > 0) {
        // draw: cycle last card as "摸牌" feel — move first to end / skip
        const [drawn, ...rest] = rivalNext;
        const hand = [...rest, drawn];
        setRivalHand(hand);
        pushLog(`对手无法跟牌，整理手牌后跳过`);
        setTurn('you');
      } else {
        setTurn('you');
      }
    }, 700);
  };

  const playCard = (index: number) => {
    if (winner || turn !== 'you') return;
    const card = youHand[index];
    if (card.diamonds < required) {
      pushLog(`需要至少 ◆${required}，这张只有 ◆${card.diamonds}`);
      return;
    }
    const youNext = youHand.filter((_, i) => i !== index);
    setYouHand(youNext);
    setPileTop(card);
    pushLog(`你打出 ${card.name}（◆${card.diamonds}）`);
    if (finishIfNeeded(youNext, rivalHand)) return;
    setTurn('rival');
    rivalAutoPlay(youNext, rivalHand, card);
  };

  const skipDraw = () => {
    if (winner || turn !== 'you') return;
    if (youHand.length === 0) return;
    const [first, ...rest] = youHand;
    setYouHand([...rest, first]);
    pushLog('你无法跟牌，跳过回合');
    setTurn('rival');
    rivalAutoPlay([...rest, first], rivalHand, pileTop);
  };

  const restart = () => {
    const next = dealHands(collection);
    setYouHand(next.you);
    setRivalHand(next.rival);
    setPileTop(null);
    setTurn('you');
    setWinner(null);
    setLog(['新的一局 · 钻石对战练习']);
  };

  return (
    <div className="screen battle-screen">
      <header className="screen-bar">
        <button type="button" className="btn ghost" onClick={onBack}>
          ← 返回
        </button>
        <h1>钻石对战 · 练习</h1>
        <span className="pill">{turn === 'you' ? '你的回合' : '对手回合'}</span>
      </header>

      {demoNote && (
        <p className="battle-note">
          收藏不足 16 张时，系统会补齐练习牌组。完整亲子对战需收集 50–100 张（实体规则）。
        </p>
      )}

      <div className="battle-board">
        <section className="battle-side">
          <h2>对手 · {rivalHand.length} 张</h2>
          <div className="battle-hand battle-hand--rival">
            {rivalHand.map((c) => (
              <div key={c.id + '-r'} className="battle-card-back" title={c.name} />
            ))}
          </div>
        </section>

        <section className="battle-center">
          {pileTop ? (
            <div className="battle-pile">
              <img src={pileTop.frontImage} alt={pileTop.name} />
              <div>
                <strong>{pileTop.name}</strong>
                <span>
                  当前需求 ◆{pileTop.diamonds} · {pileTop.region}
                </span>
              </div>
            </div>
          ) : (
            <div className="battle-pile empty">出第一张任意牌开始</div>
          )}
          {winner && (
            <div className="battle-winner">
              {winner === 'you' ? '你赢了！' : '对手获胜'}
              <button type="button" className="btn primary" onClick={restart}>
                再来一局
              </button>
            </div>
          )}
        </section>

        <section className="battle-side">
          <h2>你 · {youHand.length} 张</h2>
          <div className="battle-hand">
            {youHand.map((card, index) => {
              const canPlay = !winner && turn === 'you' && card.diamonds >= required;
              return (
                <button
                  key={card.id + '-' + index}
                  type="button"
                  className={`battle-card ${canPlay ? 'can-play' : 'disabled'}`}
                  onClick={() => playCard(index)}
                  disabled={!!winner || turn !== 'you'}
                >
                  <img src={card.frontImage} alt={card.name} />
                  <span className="battle-card__diamonds">{'◆'.repeat(card.diamonds)}</span>
                  <span className="battle-card__name">{card.name}</span>
                </button>
              );
            })}
          </div>
          <div className="battle-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={skipDraw}
              disabled={!!winner || turn !== 'you'}
            >
              无法跟牌 · 跳过
            </button>
            <button type="button" className="btn ghost" onClick={restart}>
              重新发牌
            </button>
          </div>
        </section>
      </div>

      <ul className="battle-log">
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>

      <p className="battle-roadmap">后续迭代：知识链关联出牌 · 亲子双人同屏 · 胜负讲解奖励</p>
    </div>
  );
};

export default BattleScreen;
