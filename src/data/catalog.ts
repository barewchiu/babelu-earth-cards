import catalog from './cards.json';
import { RegionFace, REGION_FACES, cardMatchesFace } from './regions';
import { assetUrl } from '../lib/assetUrl';

export interface CompanionCard {
  id: string;
  name: string;
  region: string;
  category: string;
  subcategory: string;
  frontImage: string;
  backImage: string | null;
  diamonds: number;
}

function withAssetUrls(card: CompanionCard): CompanionCard {
  return {
    ...card,
    frontImage: assetUrl(card.frontImage),
    backImage: card.backImage ? assetUrl(card.backImage) : null,
  };
}

export const ALL_CARDS: CompanionCard[] = (catalog.cards as CompanionCard[]).map(withAssetUrls);
export const TOTAL_CARDS = catalog.total;

export function cardsForFace(face: RegionFace): CompanionCard[] {
  return ALL_CARDS.filter((c) => cardMatchesFace(c.region, face));
}

export function pickRandomFaceWithCards(): RegionFace {
  const playable = REGION_FACES.filter((f) => cardsForFace(f).length > 0);
  if (playable.length === 0) return REGION_FACES[0];
  return playable[Math.floor(Math.random() * playable.length)];
}

export function drawCardFromFace(face: RegionFace): CompanionCard | null {
  const pool = cardsForFace(face);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getCardById(id: string): CompanionCard | undefined {
  return ALL_CARDS.find((c) => c.id === id);
}
