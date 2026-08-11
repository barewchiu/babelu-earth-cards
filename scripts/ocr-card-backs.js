/**
 * Batch OCR card-back encyclopedia text into src/data/lore.json
 *
 * Usage:
 *   node scripts/ocr-card-backs.js
 *   node scripts/ocr-card-backs.js --limit=20
 *   node scripts/ocr-card-backs.js --force
 */
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size').imageSize || require('image-size');
const { createWorker, PSM } = require('tesseract.js');

const ROOT = path.join(__dirname, '..');
const CARDS_DIR = path.join(ROOT, 'public', '卡牌图片');
const LORE_PATH = path.join(ROOT, 'src', 'data', 'lore.json');
const PROGRESS_PATH = path.join(ROOT, 'src', 'data', 'lore.ocr-progress.json');

const SEED_LORE = {
  '0840':
    '日本画家狩野永德的传世之作，刻画了京都内外的生活繁华景象，画作布局精巧，细节丰富，是日版的《清明上河图》。织田信长曾钟爱该作品，后割爱赠于上杉谦信以示弱，以争取战略喘息的时间。上杉亦非常珍视，命后人妥善保管，现今所见的即为其珍藏。',
};

const args = process.argv.slice(2);
const limitArg = args.find((a) => a.startsWith('--limit='));
const LIMIT = limitArg ? Number(limitArg.split('=')[1]) : 0;
const FORCE = args.includes('--force');

function parseId(filename) {
  const m = filename.match(/^(\d{4})/);
  return m ? m[1] : null;
}

function collapseCjkSpaces(s) {
  return s
    .replace(/([\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])/g, '$1')
    .replace(/([\u4e00-\u9fff])\s+([《》「」『』（）()，。！？、：；])/g, '$1$2')
    .replace(/([《》「」『』（）()，。！？、：；])\s+([\u4e00-\u9fff])/g, '$1$2')
    .replace(/([，。！？、：；])\s+/g, '$1')
    .replace(/\s+/g, '');
}

function trimTrailingGarbage(text) {
  const marks = [...text.matchAll(/[。！？]/g)];
  if (!marks.length) return text;
  for (let i = marks.length - 1; i >= 0; i--) {
    const end = marks[i].index + 1;
    const prefix = text.slice(0, end);
    const cjk = (prefix.match(/[\u4e00-\u9fff]/g) || []).length;
    if (cjk >= 36 && cjk / prefix.length >= 0.78) return prefix;
  }
  return text;
}

function cleanLore(raw) {
  if (!raw) return '';

  let text = String(raw).replace(/\r/g, '\n');

  const afterNumber = text.split(/编号\s*[:：]?\s*[A-Z.]*\s*\d+/i);
  if (afterNumber.length > 1) {
    text = afterNumber.slice(1).join('\n');
  } else {
    const afterName = text.split(/名称\s*[:：][^\n]*/);
    if (afterName.length > 1) text = afterName.slice(1).join('\n');
  }

  const dropLine = [
    /^地域/,
    /^类别/,
    /^名称/,
    /^编号/,
    /^E\.?[A-Z]?\d+/i,
    /^美术/,
    /^生物/,
    /^宗教/,
    /^财宝/,
    /^地理/,
    /^Barew/i,
    /^贝贝鲁/,
  ];

  text = collapseCjkSpaces(
    text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .filter((l) => !dropLine.some((re) => re.test(l)))
      .join('')
  );

  text = text
    .replace(/[A-Za-z]{3,}/g, '')
    .replace(/[Oo0〇]{4,}/g, '')
    .replace(/[^\u4e00-\u9fff0-9《》「」『』（）()，。！？、：；·\-—]/g, '')
    .replace(/，{2,}/g, '，')
    .replace(/。{2,}/g, '。')
    .trim();

  const start = text.search(/[\u4e00-\u9fff]{2}/);
  if (start > 0) text = text.slice(start);

  // Drop short OCR noise prefixes before a clear clause opener
  const opener = text.search(
    /(?:位于|修建于|是一|是一种|传说|本体|日本|希腊|描绘|刻画|号称|最大长|波纳佩|吉萨金字塔|南马都尔)/
  );
  if (opener > 0 && opener <= 12) text = text.slice(opener);

  text = trimTrailingGarbage(text);
  if (!/[。！？]$/.test(text) && text.length > 20) text += '。';
  return text;
}

function isGoodLore(text) {
  if (!text) return false;
  if (text.length < 36) return false;
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  if (cjk < 30) return false;
  return cjk / text.length >= 0.72;
}

function textRect(filePath) {
  const buf = fs.readFileSync(filePath);
  const dim = typeof sizeOf === 'function' ? sizeOf(buf) : sizeOf(buf);
  const w = dim.width;
  const h = dim.height;
  // Focus on the encyclopedia body box on landscape backs
  return {
    left: Math.floor(w * 0.06),
    top: Math.floor(h * 0.18),
    width: Math.floor(w * 0.88),
    height: Math.floor(h * 0.56),
  };
}

async function main() {
  if (!fs.existsSync(CARDS_DIR)) {
    console.error('Missing cards dir:', CARDS_DIR);
    process.exit(1);
  }

  const files = fs
    .readdirSync(CARDS_DIR)
    .filter((f) => f.includes('（反）') && /\.jpe?g$/i.test(f))
    .sort();

  let lore = {};
  if (fs.existsSync(LORE_PATH)) {
    lore = JSON.parse(fs.readFileSync(LORE_PATH, 'utf8'));
  }
  Object.assign(lore, SEED_LORE);

  const todo = [];
  for (const file of files) {
    const id = parseId(file);
    if (!id) continue;
    if (SEED_LORE[id] && !FORCE) continue;
    // Re-OCR short/weak entries even without --force
    if (!FORCE && isGoodLore(lore[id]) && lore[id].length >= 90) continue;
    todo.push({ id, file });
  }

  const queue = LIMIT > 0 ? todo.slice(0, LIMIT) : todo;
  console.log(`Backs: ${files.length}, to OCR: ${queue.length} (skip existing=${!FORCE})`);

  if (queue.length === 0) {
    fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2), 'utf8');
    console.log('Nothing to OCR. lore entries=', Object.keys(lore).length);
    return;
  }

  const worker = await createWorker('chi_sim', 1, {
    logger: () => undefined,
  });
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
    preserve_interword_spaces: '1',
  });

  let ok = 0;
  let weak = 0;
  const started = Date.now();

  for (let i = 0; i < queue.length; i++) {
    const { id, file } = queue[i];
    const abs = path.join(CARDS_DIR, file);
    try {
      const rectangle = textRect(abs);
      const cropped = await worker.recognize(abs, { rectangle });
      const cleanedCrop = cleanLore(cropped.data.text);

      const full = await worker.recognize(abs);
      const cleanedFull = cleanLore(full.data.text);

      const candidates = [cleanedCrop, cleanedFull]
        .filter(isGoodLore)
        .sort((a, b) => b.length - a.length);
      const best =
        candidates[0] ||
        (cleanedFull.length >= cleanedCrop.length ? cleanedFull : cleanedCrop);

      if (isGoodLore(best)) {
        // Keep existing if somehow longer/better already and not forcing quality upgrade
        if (!FORCE && isGoodLore(lore[id]) && lore[id].length > best.length + 10) {
          ok += 1;
          console.log(`[${i + 1}/${queue.length}] KEEP ${id} (${lore[id].length}字)`);
        } else {
          lore[id] = best;
          ok += 1;
          console.log(`[${i + 1}/${queue.length}] OK ${id} (${best.length}字) ${best.slice(0, 40)}…`);
        }
      } else {
        weak += 1;
        if (!isGoodLore(lore[id]) && best.length >= 24) lore[id] = best;
        console.warn(`[${i + 1}/${queue.length}] WEAK ${id} (${best.length}) ${best.slice(0, 70)}`);
      }
    } catch (err) {
      console.error(`[${i + 1}/${queue.length}] FAIL ${id}`, err.message || err);
    }

    if ((i + 1) % 5 === 0 || i === queue.length - 1) {
      Object.assign(lore, SEED_LORE);
      fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2), 'utf8');
      fs.writeFileSync(
        PROGRESS_PATH,
        JSON.stringify(
          {
            updatedAt: new Date().toISOString(),
            processed: i + 1,
            total: queue.length,
            ok,
            weak,
            loreCount: Object.keys(lore).length,
          },
          null,
          2
        ),
        'utf8'
      );
    }
  }

  await worker.terminate();
  Object.assign(lore, SEED_LORE);
  fs.writeFileSync(LORE_PATH, JSON.stringify(lore, null, 2), 'utf8');
  const sec = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`Done in ${sec}s. ok=${ok} weak=${weak} lore entries=${Object.keys(lore).length}`);
  console.log('Wrote', LORE_PATH);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
