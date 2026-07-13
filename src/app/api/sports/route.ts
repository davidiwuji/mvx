/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import https from 'https';

const STREAMED_PK_BASE = 'https://streamed.pk';

// HTTPS agent that ignores SSL cert issues (streamed.pk uses a self-signed or custom cert)
const agent = new https.Agent({
  rejectUnauthorized: false,
});

// In-memory cache
let cache: { data: any[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 120_000; // 2 minutes

// Fallback sample matches when upstream is down
const FALLBACK_MATCHES: any[] = [
  {
    id: 'fb-sample-1', title: 'Manchester United vs Liverpool',
    category: 'football', date: Date.now() + 3600000,
    popular: true, poster: null, teams: { home: { name: 'Manchester United', badge: null, badgeUrl: null }, away: { name: 'Liverpool', badge: null, badgeUrl: null } },
    sources: [{ source: 'sample', id: 's1' }],
  },
  {
    id: 'bb-sample-2', title: 'Lakers vs Celtics',
    category: 'basketball', date: Date.now() + 7200000,
    popular: true, poster: null, teams: { home: { name: 'LA Lakers', badge: null, badgeUrl: null }, away: { name: 'Boston Celtics', badge: null, badgeUrl: null } },
    sources: [{ source: 'sample', id: 's2' }],
  },
  {
    id: 'fb-sample-3', title: 'Arsenal vs Chelsea',
    category: 'football', date: Date.now() + 5400000,
    popular: false, poster: null, teams: { home: { name: 'Arsenal', badge: null, badgeUrl: null }, away: { name: 'Chelsea', badge: null, badgeUrl: null } },
    sources: [{ source: 'sample', id: 's3' }, { source: 'sample2', id: 's4' }],
  },
  {
    id: 'tn-sample-4', title: 'Djokovic vs Alcaraz',
    category: 'tennis', date: Date.now() + 10800000,
    popular: false, poster: null, teams: { home: { name: 'N. Djokovic', badge: null, badgeUrl: null }, away: { name: 'C. Alcaraz', badge: null, badgeUrl: null } },
    sources: [{ source: 'sample', id: 's5' }],
  },
  {
    id: 'fb-sample-5', title: 'Real Madrid vs Barcelona',
    category: 'football', date: Date.now() + 9000000,
    popular: true, poster: null, teams: { home: { name: 'Real Madrid', badge: null, badgeUrl: null }, away: { name: 'Barcelona', badge: null, badgeUrl: null } },
    sources: [{ source: 'sample', id: 's6' }],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  const now = Date.now();
  if (cache && now - cache.timestamp < CACHE_TTL_MS) {
    let data = cache.data;
    if (category) {
      data = data.filter((m: any) => m.category === category);
    }
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, max-age=120, s-maxage=120' },
    });
  }

  try {
    // Use node:https with custom agent (handles self-signed certs)
    const res = await fetch(`${STREAMED_PK_BASE}/api/matches/all-today`, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      // @ts-expect-error custom agent not in fetch types
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      agent: agent as any,
    });

    if (!res.ok) {
      console.warn(`Sports upstream returned ${res.status}, using fallback`);
      cache = { data: FALLBACK_MATCHES, timestamp: now };
      let result = FALLBACK_MATCHES;
      if (category) result = result.filter((m: any) => m.category === category);
      return NextResponse.json(result);
    }

    const data: any[] = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('Sports upstream returned empty data, using fallback');
      cache = { data: FALLBACK_MATCHES, timestamp: now };
      let result = FALLBACK_MATCHES;
      if (category) result = result.filter((m: any) => m.category === category);
      return NextResponse.json(result);
    }

    const enriched = data.map((match: any) => ({
      ...match,
      teams: {
        home: {
          ...match.teams?.home,
          badgeUrl: match.teams?.home?.badge
            ? `${STREAMED_PK_BASE}/api/images/proxy/${match.teams.home.badge}`
            : null,
        },
        away: {
          ...match.teams?.away,
          badgeUrl: match.teams?.away?.badge
            ? `${STREAMED_PK_BASE}/api/images/proxy/${match.teams.away.badge}`
            : null,
        },
      },
      posterUrl: match.poster
        ? `${STREAMED_PK_BASE}${match.poster}`
        : null,
    }));

    cache = { data: enriched, timestamp: now };

    let result = enriched;
    if (category) {
      result = enriched.filter((m: any) => m.category === category);
    }

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'public, max-age=120, s-maxage=120' },
    });
  } catch (err: any) {
    console.warn('Sports fetch failed:', err.message);

    // Return cached data if available, otherwise fallback
    if (cache) {
      let data = cache.data;
      if (category) data = data.filter((m: any) => m.category === category);
      return NextResponse.json(data, {
        headers: { 'Cache-Control': 'public, max-age=60', 'X-Cache': 'stale' },
      });
    }

    // First load & upstream is down → use fallback
    cache = { data: FALLBACK_MATCHES, timestamp: now };
    let result = FALLBACK_MATCHES;
    if (category) result = result.filter((m: any) => m.category === category);
    return NextResponse.json(result);
  }
}
