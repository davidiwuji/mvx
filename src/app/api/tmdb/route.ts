import { NextRequest, NextResponse } from 'next/server';
import { MOCK_MOVIES, MOCK_TV_SHOWS } from '@/lib/mockData';

const TMDB_BASE = 'https://api.themoviedb.org/3';

const ALLOWED_PREFIXES = [
  '/movie/', '/tv/', '/trending/', '/discover/', '/search/',
  '/genre/', '/configuration/', '/find/', 'movie/', 'tv/',
  'trending/', 'discover/', 'search/', 'genre/',
];

function isAllowed(endpoint: string): boolean {
  return ALLOWED_PREFIXES.some(p => endpoint.startsWith(p));
}

// In-memory sliding window rate limiter
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 100;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function getMockResponse(clean: string, searchParams: URLSearchParams) {
  // Detail endpoint like /movie/123 or /tv/123
  const movieMatch = clean.match(/^\/movie\/(\d+)/);
  const tvMatch = clean.match(/^\/tv\/(\d+)/);

  if (clean.includes('/credits')) {
    return {
      cast: [
        { id: 1, name: 'Lead Actor', character: 'Main Protagonist', profile_path: null },
        { id: 2, name: 'Co-Star', character: 'Supporting Character', profile_path: null },
        { id: 3, name: 'Notable Guest', character: 'Key Ally', profile_path: null },
      ],
    };
  }

  if (clean.includes('/recommendations')) {
    return { results: MOCK_MOVIES.slice(0, 10), page: 1, total_pages: 1 };
  }

  if (movieMatch) {
    const id = parseInt(movieMatch[1]);
    const found = MOCK_MOVIES.find(m => m.id === id) || MOCK_MOVIES[0];
    return {
      ...found,
      runtime: 124,
      genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Sci-Fi' }],
      tagline: 'The cinematic event of the year.',
      videos: { results: [{ key: 'dQw4w9WgXcQ', type: 'Trailer', site: 'YouTube' }] },
      seasons: [],
    };
  }

  if (tvMatch) {
    const id = parseInt(tvMatch[1]);
    const found = MOCK_TV_SHOWS.find(t => t.id === id) || MOCK_TV_SHOWS[0];
    return {
      ...found,
      genres: [{ id: 18, name: 'Drama' }, { id: 10765, name: 'Sci-Fi & Fantasy' }],
      tagline: 'Binge the impossible.',
      videos: { results: [{ key: 'dQw4w9WgXcQ', type: 'Trailer', site: 'YouTube' }] },
      seasons: [
        { season_number: 1, name: 'Season 1', episode_count: 10 },
        { season_number: 2, name: 'Season 2', episode_count: 8 },
      ],
    };
  }

  if (clean.includes('search')) {
    const q = (searchParams.get('query') || '').toLowerCase();
    const movieMatches = MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(q)).map(m => ({ ...m, media_type: 'movie' }));
    const tvMatches = MOCK_TV_SHOWS.filter(t => t.name.toLowerCase().includes(q)).map(t => ({ ...t, media_type: 'tv' }));
    const results = [...movieMatches, ...tvMatches];
    return { results: results.length > 0 ? results : MOCK_MOVIES.map(m => ({ ...m, media_type: 'movie' })), page: 1, total_pages: 1 };
  }

  if (clean.includes('/tv')) {
    return { results: MOCK_TV_SHOWS, page: 1, total_pages: 1 };
  }

  return { results: MOCK_MOVIES, page: 1, total_pages: 1 };
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get('endpoint');
  const append = searchParams.get('append_to_response');

  if (!endpoint) {
    return NextResponse.json({ error: 'Missing endpoint parameter' }, { status: 400 });
  }

  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!isAllowed(clean)) {
    return NextResponse.json({ error: 'Endpoint not allowed' }, { status: 403 });
  }

  const apiKey = process.env.TMDB_API_KEY;
  const apiToken = process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_READ_ACCESS_TOKEN;
  if (!apiKey && !apiToken) {
    // Return curated mock data instead of 500 failure
    return NextResponse.json(getMockResponse(clean, searchParams));
  }

  if (clean === '/configuration') {
    return NextResponse.json({ key: apiKey || 'bearer_authenticated' });
  }

  try {
    const params = new URLSearchParams();
    if (apiKey) {
      params.set('api_key', apiKey);
    }
    params.set('language', 'en-US');

    searchParams.forEach((v, k) => {
      if (k !== 'endpoint' && k !== 'append_to_response') params.set(k, v);
    });
    if (append) params.set('append_to_response', append);

    const url = `${TMDB_BASE}${clean}?${params}`;

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }

    const res = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(getMockResponse(clean, searchParams));
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
    });
  } catch {
    return NextResponse.json(getMockResponse(clean, searchParams));
  }
}
