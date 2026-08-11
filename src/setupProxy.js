/**
 * Dev-server TTS proxy (same contract as /api/tts on Vercel).
 */
const DOUBAO_URL = 'https://openspeech.bytedance.com/api/v3/tts/unidirectional';

function b64ToBytes(b64) {
  return Buffer.from(b64, 'base64');
}

async function synthesize(text, apiKey, speaker, resourceId) {
  const res = await fetch(DOUBAO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
      'X-Api-Resource-Id': resourceId,
      'X-Api-Request-Id': `babelu-dev-${Date.now()}`,
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

module.exports = function setupProxy(app) {
  app.post('/api/tts', (req, res) => {
    const apiKey = process.env.DOUBAO_API_KEY || process.env.REACT_APP_DOUBAO_API_KEY;
    if (!apiKey) {
      res.status(503).json({ error: 'DOUBAO_API_KEY not configured' });
      return;
    }

    let body = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        const text = parsed.text || '';
        if (!text || typeof text !== 'string') {
          res.status(400).json({ error: 'text required' });
          return;
        }
        if (text.length > 800) {
          res.status(400).json({ error: 'text too long' });
          return;
        }

        const speaker =
          process.env.DOUBAO_SPEAKER || 'zh_female_xiaohe_uranus_bigtts';
        const resourceId = process.env.DOUBAO_RESOURCE_ID || 'seed-tts-2.0';
        const audio = await synthesize(text, apiKey, speaker, resourceId);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'no-store');
        res.status(200).send(audio);
      } catch (err) {
        console.error('[setupProxy /api/tts]', err);
        res.status(502).json({
          error: err instanceof Error ? err.message : String(err),
        });
      }
    });
  });
};
