import MovieRow from '@/components/MovieRow';
import { tmdbFetch } from '@/lib/tmdb';
import { getImdbAnimeSeries, getImdbAnimeMovies } from '@/lib/imdb';
import type { TMDBResponse, TMDBMovie, TMDBTVShow } from '@/lib/types';
import type { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Anime - Watch Japanese Anime Free Online | MVX',
  description: 'Stream thousands of Japanese anime episodes and movies for free in HD. Watch Attack on Titan, Demon Slayer, Jujutsu Kaisen, and One Piece on MVX.',
  keywords: ['watch anime free online', 'Japanese anime', 'anime streaming', 'free anime', 'MVX anime', 'subbed anime', 'dubbed anime'],
  openGraph: {
    title: 'Anime - Watch Japanese Anime Free Online | MVX',
    description: 'Stream thousands of Japanese anime episodes and movies for free in HD.',
  },
};

const ANIME_TV_GENRE = 16;
const ANIME_LANG = 'ja';

export default async function AnimePage() {
  const fallbackSeries = getImdbAnimeSeries();
  const fallbackMovies = getImdbAnimeMovies();

  let popularSeries: TMDBTVShow[] = fallbackSeries;
  let popularMovies: TMDBMovie[] = fallbackMovies;
  let topRated: TMDBMovie[] = fallbackMovies;
  let isImdb = true;

  try {
    const [ps, pm, trm] = await Promise.all([
      tmdbFetch<TMDBResponse<TMDBTVShow>>('/discover/tv', {
        with_genres: ANIME_TV_GENRE.toString(),
        with_original_language: ANIME_LANG,
        sort_by: 'popularity.desc',
      }),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', {
        with_genres: ANIME_TV_GENRE.toString(),
        with_original_language: ANIME_LANG,
        sort_by: 'popularity.desc',
      }),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', {
        with_genres: ANIME_TV_GENRE.toString(),
        with_original_language: ANIME_LANG,
        sort_by: 'vote_average.desc',
        'vote_count.gte': '50',
      }),
    ]);

    if (ps?.results?.length) {
      popularSeries = ps.results;
      isImdb = false;
    }
    if (pm?.results?.length) {
      popularMovies = pm.results;
    }
    if (trm?.results?.length) {
      topRated = trm.results;
    }
  } catch (err) {
    console.warn('Anime page fetch error, using IMDb anime dataset:', err);
  }

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-[1440px] mx-auto space-y-8">
      {/* Header */}
      <div className="px-4 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🌊</span>
            <h1 className="text-3xl md:text-4xl font-black text-white">Japanese Anime</h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400">
            Stream popular anime series and cinematic movies in Japanese with multi-language subtitles and dubs.
          </p>
        </div>
      </div>

      {/* Rows */}
      {popularSeries.length > 0 && (
        <MovieRow
          title="Trending Anime Series"
          subtitle="Top rated broadcasts and episodic adventures"
          items={popularSeries}
          isImdbSource={isImdb}
        />
      )}

      {popularMovies.length > 0 && (
        <MovieRow
          title="Anime Feature Films"
          subtitle="Theatrical releases and animated masterpieces"
          items={popularMovies}
          isImdbSource={isImdb}
        />
      )}

      {topRated.length > 0 && (
        <MovieRow
          title="All-Time Classics & Top Rated"
          subtitle="Critically acclaimed timeless gems"
          items={topRated}
          isImdbSource={isImdb}
        />
      )}
    </div>
  );
}
