import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { tmdbFetch } from '@/lib/tmdb';
import type { TMDBResponse, TMDBMovie, TMDBGenre } from '@/lib/types';
import { getYear } from '@/lib/tmdb';
import type { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: { genre?: string } }): Promise<Metadata> {
  const GENRES_LOOKUP = [
    { s: 'action', id: 28 }, { s: 'adventure', id: 12 }, { s: 'animation', id: 16 }, { s: 'comedy', id: 35 },
    { s: 'crime', id: 80 }, { s: 'documentary', id: 99 }, { s: 'drama', id: 18 }, { s: 'family', id: 10751 },
    { s: 'fantasy', id: 14 }, { s: 'history', id: 36 }, { s: 'horror', id: 27 }, { s: 'music', id: 10402 },
    { s: 'mystery', id: 9648 }, { s: 'romance', id: 10749 }, { s: 'sci-fi', id: 878 }, { s: 'thriller', id: 53 },
    { s: 'war', id: 10752 }, { s: 'western', id: 37 },
  ];
  const gs = searchParams?.genre || '';
  const genreName = gs ? GENRES_LOOKUP.find(x => x.s === gs)?.s.replace('-', ' & ') : null;
  const title = genreName
    ? `${genreName.charAt(0).toUpperCase() + genreName.slice(1)} Movies - Watch Free Online | Boxo`
    : 'Movies - Watch Free Online, Free Movie Streaming | Boxo';
  const description = genreName
    ? `Watch the latest ${genreName} movies online free in HD. Stream top ${genreName} films, blockbusters, and classics with no registration required.`
    : 'Browse thousands of free movies online in HD. Watch the latest blockbusters, classic films, action, comedy, horror, and more — all free to stream.';
  return {
    title,
    description,
    keywords: [
      'free movies online', 'watch movies free', genreName || 'movies',
      `${genreName || ''} movies stream`, 'HD movies free', 'movie streaming',
      'watch full movies', 'latest movies online', 'free movie database',
    ].filter(Boolean),
    openGraph: { title, description },
    twitter: { title, description },
  };
};

const GENRES = [
  { s: 'action', id: 28 }, { s: 'adventure', id: 12 }, { s: 'animation', id: 16 }, { s: 'comedy', id: 35 },
  { s: 'crime', id: 80 }, { s: 'documentary', id: 99 }, { s: 'drama', id: 18 }, { s: 'family', id: 10751 },
  { s: 'fantasy', id: 14 }, { s: 'history', id: 36 }, { s: 'horror', id: 27 }, { s: 'music', id: 10402 },
  { s: 'mystery', id: 9648 }, { s: 'romance', id: 10749 }, { s: 'sci-fi', id: 878 }, { s: 'thriller', id: 53 },
  { s: 'war', id: 10752 }, { s: 'western', id: 37 },
];

export default async function MoviesPage({ searchParams }: { searchParams: { genre?: string; page?: string } }) {
  const gs = searchParams?.genre || '';
  const p = searchParams?.page || '1';
  const gid = gs ? GENRES.find(x => x.s === gs)?.id : undefined;

  let movies: TMDBMovie[] = [], total = 1, gn = '';
  try {
    if (gid) {
      const d = await tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_genres: gid.toString(), sort_by: 'popularity.desc', page: p });
      movies = d.results; total = Math.min(d.total_pages, 500);
      const gen = await tmdbFetch<{ genres: TMDBGenre[] }>('/genre/movie/list');
      gn = gen.genres.find(g => g.id === gid)?.name || gs;
    } else {
      const d = await tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/popular', { page: p });
      movies = d.results; total = Math.min(d.total_pages, 500);
    }
  } catch { movies = []; }

  const cp = parseInt(p);
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
          <Link href="/movies" className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-lg ${!gs ? 'bg-orange-600 text-white' : 'bg-[#1a1d29] text-gray-400 hover:text-white'}`}>All</Link>
          {GENRES.slice(0, 12).map(({ s }) => (
            <Link key={s} href={`/movies?genre=${s}`} className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-lg capitalize ${gs === s ? 'bg-orange-600 text-white' : 'bg-[#1a1d29] text-gray-400 hover:text-white'}`}>{s.replace('-', ' & ')}</Link>
          ))}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{gn || 'All Movies'}</h1>
        {movies.length === 0 ? (
          <div className="text-center py-20 text-gray-500"><p>No movies found</p></div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
              {movies.map(m => <MovieCard key={m.id} id={m.id} title={m.title} posterPath={m.poster_path} year={getYear(m.release_date)} rating={m.vote_average} />)}
            </div>
            {total > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                {cp > 1 && <Link href={`/movies?page=${cp - 1}${gs ? '&genre=' + gs : ''}`} className="px-5 py-2 bg-[#1a1d29] rounded-lg text-sm hover:bg-[#2d3247]">&larr; Previous</Link>}
                <span className="text-sm text-gray-500">Page {cp} of {total}</span>
                {cp < total && <Link href={`/movies?page=${cp + 1}${gs ? '&genre=' + gs : ''}`} className="px-5 py-2 bg-orange-600 rounded-lg text-sm hover:bg-orange-700">Next &rarr;</Link>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

