/**
 * Vercel serverless proxy for Doubao / Volcengine TTS.
 * Keeps API key off the client and avoids browser CORS.
 */

const DOUBAO_URL = 'https://openspeech.bytedance.com/api/v3/tts/unidirectional';

function b64ToBytes(b64) {
  const bin = Buffer.from(b64, 'base64');
  return bin;
}

async function synthesize(text, apiKey, speaker, resourceId) {
  const res = await fetch(DOUBAO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
      'X-Api-Resource-Id': resourceId,
      'X-Api-Request-Id':
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `babelu-${Date.now()}`,
    },
    body: JSON.stringify({
      user: { uid: 'babelu-companion' },
      req_params: {
        text,
        speaker,
        audio_params: {
          format: 'mp3',
          sample_rate: 24000,
          speech_rate: 0,
        },
      },
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`Doubao ${res.status}: ${raw.slice(0, 400)}`);
  }

  const parts = [];
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let json;
    try {
      json = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (json.code && json.code !== 0 && json.code !== 20000000) {
      throw new Error(json.message || `Doubao code ${json.code}`);
    }
    if (typeof json.data === 'string' && json.data.length > 0) {
      parts.push(b64ToBytes(json.data));
    }
  }

  if (parts.length === 0) {
    throw new Error(`No audio in response: ${raw.slice(0, 400)}`);
  }

  return Buffer.concat(parts);
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.DOUBAO_API_KEY || process.env.REACT_APP_DOUBAO_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'DOUBAO_API_KEY not configured' });
  }

  const text = (req.body && req.body.text) || '';
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'text required' });
  }
  if (text.length > 800) {
    return res.status(400).json({ error: 'text too long' });
  }

  const speaker =
    process.env.DOUBAO_SPEAKER || 'zh_female_xiaohe_uranus_bigtts';
  const resourceId = process.env.DOUBAO_RESOURCE_ID || 'seed-tts-2.0';

  try {
    const audio = await synthesize(text, apiKey, speaker, resourceId);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(audio);
  } catch (err) {
    console.error('[api/tts]', err);
    return res.status(502).json({
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
