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
  const canonicalUrl = gs
    ? `https://boxo.name.ng/movies?genre=${gs}`
    : 'https://boxo.name.ng/movies';
  return {
    title,
    description,
    keywords: [
      'free movies online', 'watch movies free', genreName || 'movies',
      `${genreName || ''} movies stream`, 'HD movies free', 'movie streaming',
      'watch full movies', 'latest movies online', 'free movie database',
    ].filter(Boolean),
    alternates: { canonical: canonicalUrl },
    openGraph: { title, description, url: canonicalUrl },
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
        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-7 bg-[#FF6B00] rounded-full" />
          <h1 className="text-2xl md:text-3xl font-bold">{gn || 'All Movies'}</h1>
        </div>

        {/* Genre filter pills */}
        <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
          <Link href="/movies" className={`flex-shrink-0 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all ${
            !gs ? 'bg-[#FF6B00] text-white shadow-sm shadow-orange-600/20' : 'bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-[#222222] border border-[#333333]'
          }`}>All</Link>
          {GENRES.map(({ s }) => (
            <Link key={s} href={`/movies?genre=${s}`} className={`flex-shrink-0 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium capitalize transition-all ${
              gs === s
                ? 'bg-[#FF6B00] text-white shadow-sm shadow-orange-500/20'
                : 'bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-[#222222] border border-[#333333]'
            }`}>{s.replace('-', ' & ')}</Link>
          ))}
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-3 opacity-30"><rect x="2" y="2" width="20" height="20" rx="2.18"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>
            <p>No movies found in this category</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
              {movies.map(m => <MovieCard key={m.id} id={m.id} title={m.title} posterPath={m.poster_path} year={getYear(m.release_date)} rating={m.vote_average} />)}
            </div>
            {total > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                {cp > 1 && (
                  <Link href={`/movies?page=${cp - 1}${gs ? '&genre=' + gs : ''}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] border border-[#333333] rounded-lg text-sm text-gray-400 hover:text-white hover:bg-[#222222] transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
                    Previous
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(total, 5) }, (_, i) => i + 1).map(pn => (
                    <Link key={pn} href={`/movies?page=${pn}${gs ? '&genre=' + gs : ''}`}
                      className={`w-8 h-8 flex items-center justify-center text-xs rounded-lg transition-all ${
                        pn === cp ? 'bg-[#FF6B00] text-white' : 'bg-[#1A1A1A] text-gray-400 hover:text-white border border-[#333333]'
                      }`}>{pn}</Link>
                  ))}
                  {total > 5 && <span className="text-gray-600 text-xs">...</span>}
                </div>
                {cp < total && (
                  <Link href={`/movies?page=${cp + 1}${gs ? '&genre=' + gs : ''}`} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF6B00] rounded-lg text-sm text-white hover:bg-[#E65A00] transition-all">
                    Next
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

