import React, { useEffect, useState } from 'react';
import { CompanionCard } from '../../data/catalog';

interface CardFlipProps {
  card: CompanionCard;
  large?: boolean;
  /** Called when the card flips between front and back. */
  onFlipChange?: (flipped: boolean) => void;
}

const CardFlip: React.FC<CardFlipProps> = ({ card, large, onFlipChange }) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setFlipped(false);
    onFlipChange?.(false);
    // Only reset when the drawn card changes — not when parent callbacks refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.id]);

  const flipTo = (next: boolean) => {
    setFlipped(next);
    onFlipChange?.(next);
  };

  return (
    <div
      className={[
        'card-flip',
        large ? 'card-flip--large' : '',
        flipped ? 'is-flipped is-landscape' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {!flipped ? (
        <button
          type="button"
          className="card-flip__portrait"
          onClick={() => flipTo(true)}
          aria-label="查看背面百科"
        >
          <img src={card.frontImage} alt={card.name} loading="lazy" />
          <div className="card-flip__meta">
            <strong>{card.name}</strong>
            <span>
              {card.region} · {card.category}
            </span>
            <span className="card-flip__diamonds" aria-label={`${card.diamonds} 颗钻石`}>
              {'◆'.repeat(card.diamonds)}
              <span className="dim">{'◇'.repeat(4 - card.diamonds)}</span>
            </span>
          </div>
        </button>
      ) : (
        <button
          type="button"
          className="card-flip__landscape"
          onClick={() => flipTo(false)}
          aria-label="查看正面"
        >
          {card.backImage ? (
            <img src={card.backImage} alt={`${card.name} 背面百科`} loading="lazy" />
          ) : (
            <div className="card-flip__back-fallback">
              <p>{card.name}</p>
              <p>{card.region}</p>
              <p>暂无背面图</p>
            </div>
          )}
        </button>
      )}
      <p className="card-flip__hint">
        {flipped ? '点击返回正面插画' : '点击查看横版背面百科（将自动朗读）'}
      </p>
    </div>
  );
};

export default CardFlip;
