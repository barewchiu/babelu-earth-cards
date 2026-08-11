import { CompanionCard } from '../data/catalog';
import loreMap from '../data/lore.json';

const LORE = loreMap as Record<string, string>;

function withEnding(text: string): string {
  return text.endsWith('。') || text.endsWith('！') || text.endsWith('？')
    ? text
    : `${text}。`;
}

/** Prefer the card-back encyclopedia paragraph for TTS; always lead with the card name. */
export function getCardLore(card: CompanionCard): string {
  const nameLead = `${card.name}。`;
  const blurb = (LORE[card.id] || '').trim();

  if (blurb.length >= 28) {
    // Avoid "大海牛。大海牛……" if OCR somehow starts with the name
    const body = blurb.startsWith(card.name)
      ? blurb.slice(card.name.length).replace(/^[，,：:\s]+/, '')
      : blurb;
    return `${nameLead}${withEnding(body)}`;
  }

  return `${nameLead}它来自${card.region}，属于${card.category}中的「${card.subcategory}」。这是一张地球百科卡，翻开背面可以了解更多故事。`;
}
