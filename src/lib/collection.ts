import { CompanionCard } from '../data/catalog';
import { assetUrl } from './assetUrl';

const STORAGE_KEY = 'babelu-companion-collection-v1';

export type CollectionMap = Record<string, CompanionCard>;

/** Normalize stored paths so GitHub Pages PUBLIC_URL prefix stays correct. */
function fixCardAssets(card: CompanionCard): CompanionCard {
  const normalize = (p: string) => {
    const marker = '/卡牌图片/';
    const idx = p.indexOf(marker);
    const relative = idx >= 0 ? p.slice(idx) : p.startsWith('/') ? p : `/${p}`;
    return assetUrl(relative);
  };
  return {
    ...card,
    frontImage: normalize(card.frontImage),
    backImage: card.backImage ? normalize(card.backImage) : null,
  };
}

export function loadCollection(): CollectionMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CollectionMap;
    const next: CollectionMap = {};
    for (const [id, card] of Object.entries(parsed)) {
      next[id] = fixCardAssets(card);
    }
    return next;
  } catch {
    return {};
  }
}

export function saveCollection(collection: CollectionMap): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}

export function collectCard(collection: CollectionMap, card: CompanionCard): CollectionMap {
  const next = { ...collection, [card.id]: card };
  saveCollection(next);
  return next;
}

export function removeCard(collection: CollectionMap, cardId: string): CollectionMap {
  if (!collection[cardId]) return collection;
  const next = { ...collection };
  delete next[cardId];
  saveCollection(next);
  return next;
}
