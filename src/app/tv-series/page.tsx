import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { tmdbFetch, getYear } from '@/lib/tmdb';
import { getImdbTrendingTV } from '@/lib/imdb';
import type { TMDBResponse, TMDBTVShow, TMDBGenre } from '@/lib/types';
import type { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { genre?: string };
}): Promise<Metadata> {
  const gs = searchParams?.genre || '';
  const title = gs
    ? `${gs.charAt(0).toUpperCase() + gs.slice(1)} Series - Stream Online in HD | MVX`
    : 'TV Series - Watch Free Shows Online in HD | MVX';
  const description =
    'Stream thousands of free TV series and dramas online in HD. Binge full seasons and episodes on MVX with no subscription required.';
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

const GENRES = [
  { s: 'action-adventure', id: 10759 },
  { s: 'animation', id: 16 },
  { s: 'comedy', id: 35 },
  { s: 'crime', id: 80 },
  { s: 'documentary', id: 99 },
  { s: 'drama', id: 18 },
  { s: 'family', id: 10751 },
  { s: 'mystery', id: 9648 },
  { s: 'reality', id: 10764 },
  { s: 'scifi', id: 10765 },
  { s: 'talk', id: 10767 },
  { s: 'war', id: 10768 },
];

export default async function TVSeriesPage({
  searchParams,
}: {
  searchParams: { genre?: string; page?: string };
}) {
  const gs = searchParams?.genre || '';
  const p = searchParams?.page || '1';
  const gid = gs ? GENRES.find(x => x.s === gs)?.id : undefined;

  let shows: TMDBTVShow[] = [];
  let total = 1;
  let genreName = '';

  try {
    if (gid) {
      const d = await tmdbFetch<TMDBResponse<TMDBTVShow>>('/discover/tv', {
        with_genres: gid.toString(),
        sort_by: 'popularity.desc',
        page: p,
      });
      shows = d.results || [];
      total = Math.min(d.total_pages || 1, 500);

      const gen = await tmdbFetch<{ genres: TMDBGenre[] }>('/genre/tv/list');
      genreName = gen.genres?.find(g => g.id === gid)?.name || gs;
    } else {
      const d = await tmdbFetch<TMDBResponse<TMDBTVShow>>('/tv/popular', { page: p });
      shows = d.results || [];
      total = Math.min(d.total_pages || 1, 500);
    }
  } catch (err) {
    console.warn('TV page fetch error:', err);
    shows = [];
  }

  if (shows.length === 0) {
    const imdb = getImdbTrendingTV();
    if (gid) {
      shows = imdb.filter(s => s.genre_ids.includes(gid));
      if (shows.length === 0) shows = imdb;
    } else {
      shows = imdb;
    }
    total = 1;
  }

  const cp = parseInt(p, 10) || 1;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-gradient-to-b from-purple-500 to-[#FF6B00] rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          <h1 className="text-2xl md:text-3xl font-black text-white">
            {genreName ? `${genreName} TV Series` : 'All TV Series'}
          </h1>
        </div>
        <p className="text-xs text-gray-400">Page {cp} of {total}</p>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
        <Link
          href="/tv-series"
          className={`flex-shrink-0 text-xs md:text-sm px-4 py-2 rounded-full font-semibold transition-all ${
            !gs
              ? 'bg-gradient-to-r from-purple-600 to-[#FF6B00] text-white shadow-md'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          All
        </Link>
        {GENRES.map(({ s }) => (
          <Link
            key={s}
            href={`/tv-series?genre=${s}`}
            className={`flex-shrink-0 text-xs md:text-sm px-4 py-2 rounded-full font-semibold capitalize transition-all ${
              gs === s
                ? 'bg-gradient-to-r from-purple-600 to-[#FF6B00] text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {s.replace('-', ' & ')}
          </Link>
        ))}
      </div>

      {/* TV Shows Grid */}
      {shows.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-base">No TV series found for this category.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
            {shows.map(m => (
              <MovieCard
                key={m.id}
                id={m.id}
                title={m.name}
                posterPath={m.poster_path}
                backdropPath={m.backdrop_path}
                year={getYear(m.first_air_date)}
                rating={m.vote_average}
                mediaType="tv"
              />
            ))}
          </div>

          {/* Pagination */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              {cp > 1 && (
                <Link
                  href={`/tv-series?page=${cp - 1}${gs ? '&genre=' + gs : ''}`}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  &larr; Previous
                </Link>
              )}
              <span className="text-xs text-gray-500">
                Page {cp} of {total}
              </span>
              {cp < total && (
                <Link
                  href={`/tv-series?page=${cp + 1}${gs ? '&genre=' + gs : ''}`}
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-[#FF6B00] rounded-full text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
                >
                  Next &rarr;
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
