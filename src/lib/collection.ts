import { CompanionCard } from '../data/catalog';

const STORAGE_KEY = 'babelu-companion-collection-v1';

export type CollectionMap = Record<string, CompanionCard>;

export function loadCollection(): CollectionMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CollectionMap;
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
