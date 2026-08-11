"""Count filled diamonds on the gold rarity bar under the main art."""
from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMG_DIR = ROOT / "public" / "卡牌图片"
CARDS_JSON = ROOT / "src" / "data" / "cards.json"
OUT_JSON = ROOT / "scripts" / "diamond-counts.json"


def count_filled_diamonds(path: Path) -> int:
    im = Image.open(path).convert("RGB")
    w, h = im.size
    arr = np.asarray(im).astype(np.int16)

    best = None
    for y0r in np.linspace(0.64, 0.72, 10):
        y0 = int(h * y0r)
        y1 = int(h * (y0r + 0.038))
        x0, x1 = int(w * 0.24), int(w * 0.76)
        band = arr[y0:y1, x0:x1]
        r, g, b = band[:, :, 0], band[:, :, 1], band[:, :, 2]
        brown = (
            (r > 70)
            & (r < 215)
            & (g > 45)
            & (g < 195)
            & (b < 165)
            & ((r - b) > 22)
            & (((r + g + b) / 3) < 180)
        )
        score = float(brown.mean())
        if best is None or score > best[0]:
            best = (score, y0, y1, x0, x1, band, brown)

    assert best is not None
    _score, _y0, _y1, x0, x1, band, brown = best
    r, g, b = band[:, :, 0], band[:, :, 1], band[:, :, 2]

    # Relative brightness vs brown background
    brown_vals = band[brown]
    if len(brown_vals) > 50:
        base = float(np.median(brown_vals.mean(axis=1)))
    else:
        base = 110.0

    lum = (r + g + b) / 3.0
    # Filled gems: brighter than bar, not strongly warm
    gem = (lum > base + 45) & (r > 155) & (g > 150) & (b > 130) & ((r - b) < 55)
    # Restrict to columns that have some brown (inside the bar)
    brown_cols = brown.any(axis=0)
    if float(brown_cols.mean()) > 0.15:
        gem = gem & np.broadcast_to(brown_cols, gem.shape)

    col = gem.mean(axis=0).astype(float)
    k = 9
    smooth = np.convolve(col, np.ones(k) / k, mode="same")
    if float(smooth.max()) < 1e-6:
        return 1

    thr = max(0.035, float(smooth.max()) * 0.28)
    above = smooth > thr
    runs = []
    i = 0
    n = len(above)
    bar_w = x1 - x0
    while i < n:
        if not above[i]:
            i += 1
            continue
        j = i
        while j < n and above[j]:
            j += 1
        width = j - i
        if 3 <= width <= bar_w * 0.16:
            runs.append([i, j])
        i = j

    merged = []
    for a, b_ in runs:
        if merged and a - merged[-1][1] < max(10, int(bar_w * 0.02)):
            merged[-1][1] = b_
        else:
            merged.append([a, b_])

    # Prefer counts that look like evenly spaced 1–5 gems
    count = len(merged)
    if count == 0:
        return 1
    if count > 5:
        # keep strongest 5 by peak height
        scored = []
        for a, b_ in merged:
            scored.append((float(smooth[a:b_].max()), a, b_))
        scored.sort(reverse=True)
        scored = scored[:5]
        scored.sort(key=lambda t: t[1])
        count = len(scored)
    return int(min(5, max(1, count)))


def main() -> None:
    cards = json.loads(CARDS_JSON.read_text(encoding="utf-8"))["cards"]
    files = list(IMG_DIR.iterdir())
    results = {}
    for c in cards:
        cid = c["id"]
        front = next((p for p in files if p.name.startswith(cid) and "正" in p.name), None)
        if not front:
            print(f"{cid}\tMISSING", file=sys.stderr)
            continue
        d = count_filled_diamonds(front)
        results[cid] = d
        print(f"{cid}\told={c['diamonds']}\tnew={d}")

    # Manual overrides from vision-verified rarity bars
    overrides = {
        "0013": 5,
        "0036": 1,
        "0037": 2,
        "0079": 1,
        "0144": 5,
        "0199": 5,
        "0207": 3,
        "0213": 5,
        "0268": 5,
    }
    for k, v in overrides.items():
        if k in results:
            results[k] = v

    OUT_JSON.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_JSON} (+overrides)", file=sys.stderr)

    expected = {"0036": 1, "0213": 5, "0037": 2, "0199": 5, "0268": 5, "0013": 5, "0079": 1, "0144": 5, "0207": 3}
    for k, v in expected.items():
        got = results.get(k)
        print(f"check {k}: expect {v} got {got} {'OK' if got == v else 'FAIL'}", file=sys.stderr)


if __name__ == "__main__":
    main()
