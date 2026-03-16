/**
 * Resolves upload paths (e.g. /uploads/xxx.jpg) to full URLs on the API origin,
 * so images load correctly when frontend and backend run on different hosts/ports.
 */
export function getImageUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
