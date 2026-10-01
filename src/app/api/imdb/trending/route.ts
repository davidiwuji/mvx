import { NextRequest, NextResponse } from 'next/server';
import { IMDB_TRENDING_MOVIES, IMDB_TRENDING_TV } from '@/lib/imdb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'all';

  let data;
  if (type === 'movie') {
    data = IMDB_TRENDING_MOVIES;
  } else if (type === 'tv') {
    data = IMDB_TRENDING_TV;
  } else {
    data = {
      movies: IMDB_TRENDING_MOVIES,
      tv: IMDB_TRENDING_TV,
    };
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
