import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { tmdbFetch } from '@/lib/tmdb';
import type { TMDBResponse, TMDBTVShow, TMDBGenre } from '@/lib/types';
import { getYear } from '@/lib/tmdb';
import type { Metadata } from 'next';

const GENRES = [
  { s: 'action-adventure', id: 10759 }, { s: 'animation', id: 16 }, { s: 'comedy', id: 35 },
  { s: 'crime', id: 80 }, { s: 'documentary', id: 99 }, { s: 'drama', id: 18 },
  { s: 'family', id: 10751 }, { s: 'mystery', id: 9648 }, { s: 'reality', id: 10764 },
  { s: 'sci-fi', id: 10765 }, { s: 'soap', id: 10766 }, { s: 'talk', id: 10767 },
];

export async function generateMetadata({ searchParams }: { searchParams: { genre?: string } }): Promise<Metadata> {
  const GENRES_LOOKUP = [
    { s: 'action-adventure', id: 10759 }, { s: 'animation', id: 16 }, { s: 'comedy', id: 35 },
    { s: 'crime', id: 80 }, { s: 'documentary', id: 99 }, { s: 'drama', id: 18 },
    { s: 'family', id: 10751 }, { s: 'mystery', id: 9648 }, { s: 'reality', id: 10764 },
    { s: 'sci-fi', id: 10765 }, { s: 'soap', id: 10766 }, { s: 'talk', id: 10767 },
  ];
  const gs = searchParams?.genre || '';
  const genreName = gs ? GENRES_LOOKUP.find(x => x.s === gs)?.s.replace('-', ' & ') : null;
  const title = genreName
    ? `${genreName.charAt(0).toUpperCase() + genreName.slice(1)} TV Series - Watch Free Online | Boxo`
    : 'TV Series - Watch Free Online, Free TV Shows Streaming | Boxo';
  const description = genreName
    ? `Watch the latest ${genreName} TV series online free in HD. Stream top ${genreName} shows, binge-worthy series, and classics with no registration.`
    : 'Browse thousands of free TV series online in HD. Watch the latest shows, popular series, anime, and binge-worthy TV — all free to stream.';
  return {
    title,
    description,
    keywords: [
      'watch tv series free online', 'free tv shows', genreName || 'TV series',
      `${genreName || ''} shows stream`, 'binge watch free', 'TV streaming',
      'watch tv online free', 'popular TV series', 'free TV shows streaming',
    ].filter(Boolean),
    openGraph: { title, description },
    twitter: { title, description },
  };
};

export default async function TVSeriesPage({ searchParams }: { searchParams: { genre?: string; page?: string } }) {
  const gs = searchParams?.genre || '';
  const p = searchParams?.page || '1';
  const gid = gs ? GENRES.find(x => x.s === gs)?.id : undefined;

  let shows: TMDBTVShow[] = [], total = 1, gn = '';
  try {
    if (gid) {
      const d = await tmdbFetch<TMDBResponse<TMDBTVShow>>('/discover/tv', { with_genres: gid.toString(), sort_by: 'popularity.desc', page: p });
      shows = d.results; total = Math.min(d.total_pages, 500);
      const gen = await tmdbFetch<{ genres: TMDBGenre[] }>('/genre/tv/list');
      gn = gen.genres.find(g => g.id === gid)?.name || gs;
    } else {
      const d = await tmdbFetch<TMDBResponse<TMDBTVShow>>('/tv/popular', { page: p });
      shows = d.results; total = Math.min(d.total_pages, 500);
    }
  } catch { shows = []; }

  const cp = parseInt(p);
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar pb-2">
          <Link href="/tv-series" className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-lg ${!gs ? 'bg-orange-600 text-white' : 'bg-[#1a1d29] text-gray-400 hover:text-white'}`}>All</Link>
          {GENRES.map(({ s }) => (
            <Link key={s} href={`/tv-series?genre=${s}`} className={`flex-shrink-0 text-sm px-4 py-1.5 rounded-lg capitalize ${gs === s ? 'bg-orange-600 text-white' : 'bg-[#1a1d29] text-gray-400 hover:text-white'}`}>{s.replace('-', ' & ')}</Link>
          ))}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{gn || 'All TV Series'}</h1>
        {shows.length === 0 ? (
          <div className="text-center py-20 text-gray-500"><p>No TV series found</p></div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
              {shows.map(m => <MovieCard key={m.id} id={m.id} title={m.name} posterPath={m.poster_path} year={getYear(m.first_air_date)} rating={m.vote_average} mediaType="tv" />)}
            </div>
            {total > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                {cp > 1 && <Link href={`/tv-series?page=${cp - 1}${gs ? '&genre=' + gs : ''}`} className="px-5 py-2 bg-[#1a1d29] rounded-lg text-sm hover:bg-[#2d3247]">&larr; Previous</Link>}
                <span className="text-sm text-gray-500">Page {cp} of {total}</span>
                {cp < total && <Link href={`/tv-series?page=${cp + 1}${gs ? '&genre=' + gs : ''}`} className="px-5 py-2 bg-orange-600 rounded-lg text-sm hover:bg-orange-700">Next &rarr;</Link>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

