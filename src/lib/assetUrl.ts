/** Prefix public assets for GitHub Pages subpath (`/babelu-earth-cards`). */
export function assetUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;

  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const raw = path.startsWith('/') ? path : `/${path}`;
  const encoded = raw
    .split('/')
    .map((seg) => (seg ? encodeURIComponent(seg) : ''))
    .join('/');
  return `${base}${encoded}`;
}
