import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { tmdbFetch, getYear } from '@/lib/tmdb';
import { getImdbTrendingMovies } from '@/lib/imdb';
import type { TMDBResponse, TMDBMovie, TMDBGenre } from '@/lib/types';
import type { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { genre?: string };
}): Promise<Metadata> {
  const gs = searchParams?.genre || '';
  const title = gs
    ? `${gs.charAt(0).toUpperCase() + gs.slice(1)} Movies - Stream Online in HD | MVX`
    : 'Movies - Watch Free Movies Online in HD | MVX';
  const description =
    'Browse thousands of free movies online in HD. Stream trending blockbusters, action, comedy, horror, sci-fi, and classics with zero registration on MVX.';
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

const GENRES = [
  { s: 'action', id: 28 },
  { s: 'adventure', id: 12 },
  { s: 'animation', id: 16 },
  { s: 'comedy', id: 35 },
  { s: 'crime', id: 80 },
  { s: 'documentary', id: 99 },
  { s: 'drama', id: 18 },
  { s: 'family', id: 10751 },
  { s: 'fantasy', id: 14 },
  { s: 'horror', id: 27 },
  { s: 'mystery', id: 9648 },
  { s: 'romance', id: 10749 },
  { s: 'scifi', id: 878 },
  { s: 'thriller', id: 53 },
  { s: 'war', id: 10752 },
];

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: { genre?: string; page?: string };
}) {
  const gs = searchParams?.genre || '';
  const p = searchParams?.page || '1';
  const gid = gs ? GENRES.find(x => x.s === gs)?.id : undefined;

  let movies: TMDBMovie[] = [];
  let total = 1;
  let genreName = '';

  try {
    if (gid) {
      const d = await tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', {
        with_genres: gid.toString(),
        sort_by: 'popularity.desc',
        page: p,
      });
      movies = d.results || [];
      total = Math.min(d.total_pages || 1, 500);

      const gen = await tmdbFetch<{ genres: TMDBGenre[] }>('/genre/movie/list');
      genreName = gen.genres?.find(g => g.id === gid)?.name || gs;
    } else {
      const d = await tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/popular', { page: p });
      movies = d.results || [];
      total = Math.min(d.total_pages || 1, 500);
    }
  } catch (err) {
    console.warn('Movies page fetch error:', err);
    movies = [];
  }

  if (movies.length === 0) {
    const imdb = getImdbTrendingMovies();
    if (gid) {
      movies = imdb.filter(m => m.genre_ids.includes(gid));
      if (movies.length === 0) movies = imdb;
    } else {
      movies = imdb;
    }
    total = 1;
  }

  const cp = parseInt(p, 10) || 1;

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-gradient-to-b from-[#FF6B00] to-[#FF8A00] rounded-full shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
          <h1 className="text-2xl md:text-3xl font-black text-white">
            {genreName ? `${genreName} Movies` : 'All Movies'}
          </h1>
        </div>
        <p className="text-xs text-gray-400">Page {cp} of {total}</p>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
        <Link
          href="/movies"
          className={`flex-shrink-0 text-xs md:text-sm px-4 py-2 rounded-full font-semibold transition-all ${
            !gs
              ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-white shadow-md'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          All
        </Link>
        {GENRES.map(({ s }) => (
          <Link
            key={s}
            href={`/movies?genre=${s}`}
            className={`flex-shrink-0 text-xs md:text-sm px-4 py-2 rounded-full font-semibold capitalize transition-all ${
              gs === s
                ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] text-white shadow-md'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {/* Movies Grid */}
      {movies.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-base">No movies found for this selection.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
            {movies.map(m => (
              <MovieCard
                key={m.id}
                id={m.id}
                title={m.title}
                posterPath={m.poster_path}
                backdropPath={m.backdrop_path}
                year={getYear(m.release_date)}
                rating={m.vote_average}
                mediaType="movie"
              />
            ))}
          </div>

          {/* Pagination */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              {cp > 1 && (
                <Link
                  href={`/movies?page=${cp - 1}${gs ? '&genre=' + gs : ''}`}
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
                  href={`/movies?page=${cp + 1}${gs ? '&genre=' + gs : ''}`}
                  className="px-5 py-2 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-full text-xs font-bold text-white shadow-md hover:scale-105 transition-all"
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
