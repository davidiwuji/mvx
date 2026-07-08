import { NextRequest, NextResponse } from 'next/server';

const TMDB_BASE = 'https://api.themoviedb.org/3';

// Whitelist of allowed TMDB endpoint prefixes — prevents SSRF / proxy abuse
const ALLOWED_PREFIXES = [
  '/movie/', '/tv/', '/trending/', '/discover/', '/search/',
  '/genre/', '/configuration/', '/find/',
];

function isAllowed(endpoint: string): boolean {
  return ALLOWED_PREFIXES.some(p => endpoint.startsWith(p));
}

// Simple in-memory rate limiter (per IP, sliding window)
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 60;                // max requests
const RATE_WINDOW_MS = 60_000;        // per 60 seconds

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

export async function GET(req: NextRequest) {
  // Rate limiting
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

  // Endpoint whitelist validation
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!isAllowed(clean)) {
    return NextResponse.json({ error: 'Endpoint not allowed' }, { status: 403 });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'TMDB_API_KEY not configured on server' }, { status: 500 });
  }

  // Configuration endpoint returns the key so client can make direct TMDB calls
  if (clean === '/configuration') {
    return NextResponse.json({ key: apiKey });
  }

  try {
    const params = new URLSearchParams();
    params.set('api_key', apiKey);
    params.set('language', 'en-US');

    searchParams.forEach((v, k) => {
      if (k !== 'endpoint' && k !== 'append_to_response') params.set(k, v);
    });
    if (append) params.set('append_to_response', append);

    const url = `${TMDB_BASE}${clean}?${params}`;

    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `TMDB ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600' },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
