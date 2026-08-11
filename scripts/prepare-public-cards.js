/**
 * Materialize card images into public/ before production build.
 * DEMO_LIMIT=48 node scripts/prepare-public-cards.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, '..', '卡牌图片');
const dest = path.join(root, 'public', '卡牌图片');
const catalogPath = path.join(root, 'src', 'data', 'cards.json');
const catalogFullBackup = path.join(root, 'src', 'data', 'cards.full.json');
const demoLimit = Number(process.env.DEMO_LIMIT || 0);

function rimraf(p) {
  if (!fs.existsSync(p)) return;
  fs.rmSync(p, { recursive: true, force: true });
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

if (!fs.existsSync(src)) {
  console.error('Missing source card folder:', src);
  process.exit(1);
}

if (!fs.existsSync(catalogPath)) {
  console.error('Missing catalog:', catalogPath);
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
// Keep a full backup once
if (!fs.existsSync(catalogFullBackup)) {
  fs.writeFileSync(catalogFullBackup, JSON.stringify(catalog, null, 2), 'utf8');
  console.log('Backed up full catalog -> cards.full.json');
}

const sourceCatalog = fs.existsSync(catalogFullBackup)
  ? JSON.parse(fs.readFileSync(catalogFullBackup, 'utf8'))
  : catalog;

console.log('Preparing public/卡牌图片 from', src);
rimraf(dest);
ensureDir(dest);

let copied = 0;
let cards = sourceCatalog.cards;

if (demoLimit > 0) {
  cards = sourceCatalog.cards.slice(0, demoLimit);
  const names = new Set();
  for (const c of cards) {
    if (c.frontImage) names.add(path.basename(c.frontImage));
    if (c.backImage) names.add(path.basename(c.backImage));
  }
  for (const name of names) {
    const from = path.join(src, name);
    if (!fs.existsSync(from)) {
      console.warn('missing', name);
      continue;
    }
    fs.copyFileSync(from, path.join(dest, name));
    copied += 1;
  }
  const slim = {
    ...sourceCatalog,
    generatedAt: new Date().toISOString(),
    total: cards.length,
    withBack: cards.filter((c) => c.backImage).length,
    demo: true,
    cards,
  };
  fs.writeFileSync(catalogPath, JSON.stringify(slim, null, 2), 'utf8');
  console.log(`Demo mode: ${cards.length} cards, ${copied} image files (DEMO_LIMIT=${demoLimit}).`);
} else {
  cards = sourceCatalog.cards;
  for (const name of fs.readdirSync(src)) {
    if (!name.toLowerCase().endsWith('.jpg')) continue;
    fs.copyFileSync(path.join(src, name), path.join(dest, name));
    copied += 1;
  }
  fs.writeFileSync(
    catalogPath,
    JSON.stringify(
      {
        ...sourceCatalog,
        demo: false,
        total: sourceCatalog.cards.length,
        withBack: sourceCatalog.cards.filter((c) => c.backImage).length,
      },
      null,
      2
    ),
    'utf8'
  );
  console.log(`Full mode: copied ${copied} jpg files.`);
}
