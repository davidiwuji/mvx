import { MOCK_MOVIES, MOCK_TV_SHOWS } from './mockData';
import type { TMDBMovie, TMDBTVShow, TMDBGenre } from './types';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG = 'https://image.tmdb.org/t/p';

export function getTmdbKey(): string | null {
  return process.env.TMDB_API_KEY || null;
}

export function getTmdbToken(): string | null {
  return process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_READ_ACCESS_TOKEN || null;
}

export const MOVIE_GENRES: TMDBGenre[] = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

export const TV_GENRES: TMDBGenre[] = [
  { id: 10759, name: 'Action & Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 10762, name: 'Kids' },
  { id: 9648, name: 'Mystery' },
  { id: 10763, name: 'News' },
  { id: 10764, name: 'Reality' },
  { id: 10765, name: 'Sci-Fi & Fantasy' },
  { id: 10766, name: 'Soap' },
  { id: 10767, name: 'Talk' },
  { id: 10768, name: 'War & Politics' },
  { id: 37, name: 'Western' },
];

function getMockFallback<T>(endpoint: string, params?: Record<string, string>): T {
  // Discover/trending TV endpoints
  if (endpoint.includes('/tv') || endpoint.includes('tv/popular') || endpoint.includes('tv/week')) {
    let results: TMDBTVShow[] = [...MOCK_TV_SHOWS];
    if (params?.with_genres) {
      const gid = parseInt(params.with_genres);
      results = results.filter(t => t.genre_ids?.includes(gid));
      if (results.length === 0) results = [...MOCK_TV_SHOWS];
    }
    return {
      page: 1,
      results,
      total_pages: 1,
      total_results: results.length,
    } as unknown as T;
  }

  // Genre lists
  if (endpoint.includes('/genre/movie/list')) {
    return { genres: MOVIE_GENRES } as unknown as T;
  }
  if (endpoint.includes('/genre/tv/list')) {
    return { genres: TV_GENRES } as unknown as T;
  }

  // Default to movies
  let results: TMDBMovie[] = [...MOCK_MOVIES];
  if (params?.with_genres) {
    const gid = parseInt(params.with_genres);
    const filtered = results.filter(m => m.genre_ids?.includes(gid));
    if (filtered.length > 0) results = filtered;
  }
  return {
    page: 1,
    results,
    total_pages: 1,
    total_results: results.length,
  } as unknown as T;
}

export async function tmdbFetch<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const key = getTmdbKey();
  const token = getTmdbToken();
  if (!key && !token) {
    return getMockFallback<T>(endpoint, params);
  }

  try {
    const url = new URL(`${TMDB_BASE}${endpoint}`);
    if (key) {
      url.searchParams.set('api_key', key);
    }
    url.searchParams.set('language', 'en-US');
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
      headers,
    });

    if (!res.ok) {
      console.warn(`TMDB API returned ${res.status} for ${endpoint}, falling back to mock`);
      return getMockFallback<T>(endpoint, params);
    }

    return await res.json();
  } catch (err) {
    console.warn(`TMDB fetch error for ${endpoint}:`, err);
    return getMockFallback<T>(endpoint, params);
  }
}

export function tmdbImage(
  path: string | null | undefined,
  size: 'w500' | 'original' | 'w300' | 'w780' | 'w185' = 'w500'
): string {
  if (!path || path === 'null' || path === 'undefined') return '/placeholder.svg';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMG}/${size}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatVotes(votes: number): string {
  if (!votes) return '0';
  if (votes >= 1000000) return (votes / 1000000).toFixed(1) + 'M';
  if (votes >= 1000) return (votes / 1000).toFixed(1) + 'K';
  return votes.toString();
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getYear(dateStr?: string | null): string {
  if (!dateStr) return '';
  return dateStr.split('-')[0] || '';
}

export function slugify(title: string, id: number): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') +
    '-' +
    id
  );
}

export function parseSlug(slug: string): { id: number } {
  const parts = slug.split('-');
  const id = parseInt(parts[parts.length - 1], 10);
  return { id: isNaN(id) ? 0 : id };
}
