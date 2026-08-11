const fs = require('fs');
const path = require('path');

const cardDir = path.join(__dirname, '..', '..', '卡牌图片');
const outDir = path.join(__dirname, '..', 'src', 'data');
const outFile = path.join(outDir, 'cards.json');

const files = fs.readdirSync(cardDir).filter((f) => f.toLowerCase().endsWith('.jpg'));

// Standard: 0013太平洋岛-宗教-筑-南马都尔遗迹（正）.jpg
// Alternate (no subcategory): 0518中亚-宗教-祆教战神像（正）_01.jpg
const reStandard = /^(\d{4})(.+?)-(.+?)-(.+?)-(.+?)（(正|反)）(?:_\d+(?:\(\d+\))?)?\.jpg$/;
const reAlt = /^(\d{4})(.+?)-(.+?)-(.+?)（(正|反)）(?:_\d+(?:\(\d+\))?)?\.jpg$/;

const map = new Map();
const unmatched = [];

for (const f of files) {
  if (f.startsWith('卡牌范例')) continue;
  let id;
  let region;
  let category;
  let subcategory;
  let name;
  let side;
  const m1 = f.match(reStandard);
  if (m1) {
    [, id, region, category, subcategory, name, side] = m1;
  } else {
    const m2 = f.match(reAlt);
    if (!m2) {
      unmatched.push(f);
      continue;
    }
    [, id, region, category, name, side] = m2;
    subcategory = category;
  }
  if (!map.has(id)) {
    map.set(id, { id, region, category, subcategory, name, front: null, back: null });
  }
  const card = map.get(id);
  if (side === '正') {
    if (!card.front || (!f.includes('_01') && card.front.includes('_01'))) {
      card.front = f;
      card.region = region;
      card.category = category;
      card.subcategory = subcategory;
      card.name = name;
    }
  } else if (!card.back || (!f.includes('_01') && card.back.includes('_01'))) {
    card.back = f;
  }
}

// Diamond rank from subcategory / category (1-5). Prefer scripts/count-diamonds.py for accuracy.
function diamondsFor(card) {
  const epicHints = ['大', '山', '经典', '遗', '筑', '迹', '宝藏', '艺术'];
  let d = 2;
  if (epicHints.some((h) => card.subcategory.includes(h) || card.category.includes(h))) d = 3;
  if (card.subcategory === '大' || card.subcategory === '山') d = 4;
  if (card.subcategory === '小') d = 2;
  if (['吉萨金字塔'].includes(card.name)) d = 1;
  if (['白虎', '万里长城', '复活节岛', '南马都尔遗迹'].includes(card.name)) d = 5;
  if (['蓝鲸'].includes(card.name)) d = 2;
  const n = parseInt(card.id, 10);
  if (n % 17 === 0) d = Math.min(5, d + 1);
  return Math.max(1, Math.min(5, d));
}

const cards = [...map.values()]
  .filter((c) => c.front)
  .sort((a, b) => a.id.localeCompare(b.id))
  .map((c) => ({
    id: c.id,
    name: c.name,
    region: c.region,
    category: c.category,
    subcategory: c.subcategory,
    frontImage: `/卡牌图片/${c.front}`,
    backImage: c.back ? `/卡牌图片/${c.back}` : null,
    diamonds: diamondsFor(c),
  }));

const regions = {};
for (const c of cards) {
  regions[c.region] = (regions[c.region] || 0) + 1;
}

const out = {
  generatedAt: new Date().toISOString(),
  total: cards.length,
  withBack: cards.filter((c) => c.backImage).length,
  regions,
  cards,
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(out, null, 2), 'utf8');

console.log(`Wrote ${out.total} cards (${out.withBack} with back) -> ${outFile}`);
console.log('Regions:', regions);
if (unmatched.length) {
  console.log('Unmatched:', unmatched.length);
  unmatched.slice(0, 20).forEach((f) => console.log(' -', f));
}
