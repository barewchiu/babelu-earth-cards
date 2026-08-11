import React, { useMemo, useState } from 'react';
import { REGION_FACES } from '../../data/regions';
import { ALL_CARDS, CompanionCard, TOTAL_CARDS } from '../../data/catalog';
import { CollectionMap } from '../../lib/collection';
import { cardMatchesFace } from '../../data/regions';
import CardFlip from './CardFlip';

interface CollectionBoxProps {
  collection: CollectionMap;
  onBack: () => void;
}

const CollectionBox: React.FC<CollectionBoxProps> = ({ collection, onBack }) => {
  const ownedList = useMemo(() => Object.values(collection), [collection]);
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [selected, setSelected] = useState<CompanionCard | null>(null);

  const filtered = useMemo(() => {
    if (activeRegion === 'all') return ownedList;
    const face = REGION_FACES.find((f) => f.id === activeRegion);
    if (!face) return ownedList;
    return ownedList.filter((c) => cardMatchesFace(c.region, face));
  }, [ownedList, activeRegion]);

  const slots = REGION_FACES.map((face) => {
    const totalInRegion = ALL_CARDS.filter((c) => cardMatchesFace(c.region, face)).length;
    const ownedInRegion = ownedList.filter((c) => cardMatchesFace(c.region, face)).length;
    return { face, totalInRegion, ownedInRegion };
  }).filter((s) => s.totalInRegion > 0);

  return (
    <div className="screen collection-screen">
      <header className="screen-bar">
        <button type="button" className="btn ghost" onClick={onBack}>
          ← 返回
        </button>
        <h1>收藏盒</h1>
        <span className="pill">
          {ownedList.length}/{TOTAL_CARDS}
        </span>
      </header>

      <div className="collection-progress">
        <div
          className="collection-progress__bar"
          style={{ width: `${Math.min(100, (ownedList.length / TOTAL_CARDS) * 100)}%` }}
        />
      </div>
      <p className="collection-lead">
        镜像实体分槽收纳盒 · 攒到 50–100 张后可开启亲子对战（后续迭代）
      </p>

      <div className="region-slots">
        <button
          type="button"
          className={`region-slot ${activeRegion === 'all' ? 'active' : ''}`}
          onClick={() => setActiveRegion('all')}
        >
          全部
          <small>{ownedList.length}</small>
        </button>
        {slots.map(({ face, ownedInRegion, totalInRegion }) => (
          <button
            key={face.id}
            type="button"
            className={`region-slot ${activeRegion === face.id ? 'active' : ''}`}
            style={{ ['--slot-color' as string]: face.color }}
            onClick={() => setActiveRegion(face.id)}
          >
            {face.label}
            <small>
              {ownedInRegion}/{totalInRegion}
            </small>
          </button>
        ))}
      </div>

      {selected ? (
        <div className="collection-detail">
          <button type="button" className="btn ghost" onClick={() => setSelected(null)}>
            ← 返回列表
          </button>
          <CardFlip card={selected} large />
        </div>
      ) : (
        <div className="collection-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>还没有卡牌。去掷地球抽一张吧。</p>
            </div>
          ) : (
            filtered.map((card) => (
              <button
                key={card.id}
                type="button"
                className="collection-thumb"
                onClick={() => setSelected(card)}
              >
                <img src={card.frontImage} alt={card.name} loading="lazy" />
                <span>{card.name}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionBox;
