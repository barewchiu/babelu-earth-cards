/**
 * Generate a cute cartoon equirectangular Earth texture (PNG).
 * Run: node scripts/generate-cartoon-earth.js
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const W = 1024;
const H = 512;

// Simple PNG writer (RGBA)
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (0xedb88320 ^ (c >>> 1)) : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  const crc = crc32(Buffer.concat([typeBuf, data]));
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function writePNG(file, width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const compressed = zlib.deflateSync(raw, { level: 9 });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const out = Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', Buffer.alloc(0))]);
  fs.writeFileSync(file, out);
}

function setPx(data, x, y, r, g, b, a = 255) {
  x = ((x % W) + W) % W;
  if (y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
  data[i + 3] = a;
}

function blendPx(data, x, y, r, g, b, a) {
  x = ((x % W) + W) % W;
  if (y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  const t = a / 255;
  data[i] = Math.round(data[i] * (1 - t) + r * t);
  data[i + 1] = Math.round(data[i + 1] * (1 - t) + g * t);
  data[i + 2] = Math.round(data[i + 2] * (1 - t) + b * t);
}

function fillEllipse(data, cx, cy, rx, ry, rgb, soft = 0.35) {
  const rOut = Math.ceil(Math.max(rx, ry) * (1 + soft));
  for (let dy = -rOut; dy <= rOut; dy++) {
    for (let dx = -rOut; dx <= rOut; dx++) {
      const nx = dx / rx;
      const ny = dy / ry;
      const d = Math.sqrt(nx * nx + ny * ny);
      if (d > 1 + soft) continue;
      const edge = d <= 1 ? 1 : 1 - (d - 1) / soft;
      const a = Math.floor(230 * edge);
      blendPx(data, Math.round(cx + dx), Math.round(cy + dy), rgb[0], rgb[1], rgb[2], a);
    }
  }
}

const data = Buffer.alloc(W * H * 4);

// Ocean base gradient
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const t = y / H;
    const r = Math.round(70 + t * 20);
    const g = Math.round(170 - t * 25);
    const b = Math.round(230 - t * 20);
    setPx(data, x, y, r, g, b, 255);
  }
}

// Soft wave stripes
for (let y = 0; y < H; y += 18) {
  for (let x = 0; x < W; x++) {
    const wave = Math.sin(x * 0.04 + y * 0.1) * 8;
    blendPx(data, x, Math.round(y + wave), 120, 200, 240, 28);
  }
}

const land = [92, 196, 110];
const landDark = [56, 160, 88];
const desert = [232, 196, 110];
const ice = [245, 250, 255];

// Continents as cute blobs (approx equirectangular positions)
const blobs = [
  // Eurasia
  [700, 170, 160, 70, land],
  [620, 200, 70, 40, land],
  [780, 210, 50, 35, landDark],
  // Africa
  [540, 260, 55, 90, land],
  [530, 230, 40, 35, desert],
  // Americas
  [220, 160, 50, 55, land],
  [240, 250, 45, 100, land],
  [250, 330, 35, 45, landDark],
  // Australia
  [850, 320, 55, 35, desert],
  // Greenland / north
  [350, 70, 40, 30, ice],
  // Antarctica band
  [512, 480, 400, 40, ice],
  // Indonesia / islands
  [800, 280, 40, 18, land],
  [180, 280, 25, 15, land],
];

for (const [cx, cy, rx, ry, color] of blobs) {
  fillEllipse(data, cx, cy, rx, ry, color, 0.4);
}

// Polar caps
for (let y = 0; y < 36; y++) {
  for (let x = 0; x < W; x++) {
    const a = Math.floor(200 * (1 - y / 36));
    blendPx(data, x, y, ice[0], ice[1], ice[2], a);
    blendPx(data, x, H - 1 - y, ice[0], ice[1], ice[2], a);
  }
}

// Cute sparkles
for (let i = 0; i < 80; i++) {
  const x = Math.floor(Math.random() * W);
  const y = Math.floor(80 + Math.random() * (H - 160));
  blendPx(data, x, y, 255, 255, 220, 90);
  blendPx(data, x + 1, y, 255, 255, 220, 40);
}

const out = path.join(__dirname, '..', 'public', 'brand', 'cartoon-earth.png');
fs.mkdirSync(path.dirname(out), { recursive: true });
writePNG(out, W, H, data);
console.log('Wrote', out);
