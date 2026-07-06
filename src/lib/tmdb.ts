const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p';

export function getTmdbKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error('TMDB_API_KEY environment variable is not set — add it to .env.local');
  return key;
}

export async function tmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${TMDB_BASE}${endpoint}`);
  url.searchParams.set('api_key', getTmdbKey());
  url.searchParams.set('language', 'en-US');
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`);
  return res.json();
}

export function tmdbImage(path: string | null, size: 'w500' | 'original' | 'w300' | 'w780' | 'w185' = 'w500'): string {
  if (!path) return '/placeholder.svg';
  return `${TMDB_IMG}/${size}${path}`;
}

export function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60); const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatVotes(votes: number): string {
  if (votes >= 1000000) return (votes / 1000000).toFixed(1) + 'M';
  if (votes >= 1000) return (votes / 1000).toFixed(1) + 'K';
  return votes.toString();
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getYear(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).getFullYear().toString();
}

export function slugify(title: string, id: number): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + id;
}

export function parseSlug(slug: string): { id: number } {
  const parts = slug.split('-');
  const id = parseInt(parts[parts.length - 1]);
  return { id };
}
