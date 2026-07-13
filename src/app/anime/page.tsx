import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { tmdbFetch } from '@/lib/tmdb';
import type { TMDBResponse, TMDBMovie, TMDBTVShow } from '@/lib/types';
import { getYear } from '@/lib/tmdb';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Anime - Watch Japanese Anime Free Online',
  description: 'Stream thousands of Japanese anime episodes and movies for free in HD. Watch Attack on Titan, Demon Slayer, One Piece, Naruto, and more — no registration required.',
  keywords: [
    'watch anime free online', 'Japanese anime', 'anime streaming', 'free anime',
    'anime online HD', 'subbed anime', 'dubbed anime', 'anime series', 'anime movies',
    'Attack on Titan', 'Demon Slayer', 'One Piece', 'Naruto',
  ],
  alternates: { canonical: 'https://boxo.name.ng/anime' },
  openGraph: {
    title: 'Anime - Watch Japanese Anime Free Online',
    description: 'Stream thousands of Japanese anime episodes and movies for free in HD. No registration required.',
    url: 'https://boxo.name.ng/anime',
  },
  twitter: { title: 'Anime - Watch Japanese Anime Free Online', description: 'Stream thousands of Japanese anime episodes and movies for free in HD.' },
};

const ANIME_TV_GENRE = 16;
const ANIME_LANG = 'ja';

export default async function AnimePage() {
  let trending, popularSeries, popularMovies, newThisYear, topRated;
  try {
    [trending, popularSeries, popularMovies, newThisYear, topRated] = await Promise.all([
      // Trending anime (filter for Japanese animation only)
      tmdbFetch<TMDBResponse<TMDBTVShow>>('/trending/tv/week').then(r => ({
        ...r,
        results: r.results.filter(s =>
          s.genre_ids.includes(ANIME_TV_GENRE) && s.original_language === ANIME_LANG
        ),
      })),
      // Popular anime series
      tmdbFetch<TMDBResponse<TMDBTVShow>>('/discover/tv', {
        with_genres: ANIME_TV_GENRE.toString(),
        with_original_language: ANIME_LANG,
        sort_by: 'popularity.desc',
      }),
      // Popular anime movies
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', {
        with_genres: ANIME_TV_GENRE.toString(),
        with_original_language: ANIME_LANG,
        sort_by: 'popularity.desc',
      }),
      // New this year
      tmdbFetch<TMDBResponse<TMDBTVShow>>('/discover/tv', {
        with_genres: ANIME_TV_GENRE.toString(),
        with_original_language: ANIME_LANG,
        sort_by: 'first_air_date.desc',
        'first_air_date.gte': '2025-01-01',
      }),
      // Top rated
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', {
        with_genres: ANIME_TV_GENRE.toString(),
        with_original_language: ANIME_LANG,
        sort_by: 'vote_average.desc',
        'vote_count.gte': '50',
      }),
    ]);
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-gray-500">Loading anime...</p>
      </div>
    );
  }

  const hasContent = trending.results.length > 0 || popularSeries.results.length > 0;

  return (
    <main className="min-h-screen pt-24 pb-16 space-y-12 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="px-4 md:px-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🌊</span>
          <h1 className="text-3xl md:text-4xl font-bold">Anime</h1>
        </div>
        <p className="text-gray-400 text-sm ml-12">Japanese anime — subbed &amp; dubbed, no registration needed</p>
      </div>

      {!hasContent ? (
        <div className="text-center text-gray-500 pt-12 px-4">
          <p className="text-lg">No anime content available right now.</p>
          <p className="text-sm mt-2">
            Try again later or browse our{' '}
            <Link href="/movies" className="text-[#FF6B00] hover:underline">Movies</Link>
            {' '}or{' '}
            <Link href="/tv-series" className="text-[#FF6B00] hover:underline">Series</Link>.
          </p>
        </div>
      ) : (
        <>
          {/* Trending Anime */}
          {trending.results.length > 0 && (
            <section>
              <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
                <div className="flex-shrink-0 w-[90px] md:w-[130px]">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-5 bg-[#FF6B00] rounded-full mt-1 flex-shrink-0" />
                    <h2 className="text-sm md:text-base font-bold">Trending Anime</h2>
                  </div>
                </div>
              </div>
              <div className="flex overflow-x-auto gap-2 md:gap-3 px-4 md:px-8 pb-2 hide-scrollbar">
                {trending.results.slice(0, 20).map(show => (
                  <MovieCard
                    key={show.id} id={show.id} title={show.name}
                    posterPath={show.poster_path} year={getYear(show.first_air_date)}
                    rating={show.vote_average} mediaType="tv"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Popular Anime Series */}
          {popularSeries.results.length > 0 && (
            <section>
              <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
                <div className="flex-shrink-0 w-[90px] md:w-[130px]">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-5 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                    <h2 className="text-sm md:text-base font-bold">Popular Series</h2>
                  </div>
                </div>
              </div>
              <div className="flex overflow-x-auto gap-2 md:gap-3 px-4 md:px-8 pb-2 hide-scrollbar">
                {popularSeries.results.slice(0, 20).map(show => (
                  <MovieCard
                    key={show.id} id={show.id} title={show.name}
                    posterPath={show.poster_path} year={getYear(show.first_air_date)}
                    rating={show.vote_average} mediaType="tv"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Popular Anime Movies */}
          {popularMovies.results.length > 0 && (
            <section>
              <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
                <div className="flex-shrink-0 w-[90px] md:w-[130px]">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-5 bg-purple-500 rounded-full mt-1 flex-shrink-0" />
                    <h2 className="text-sm md:text-base font-bold">Anime Movies</h2>
                  </div>
                </div>
              </div>
              <div className="flex overflow-x-auto gap-2 md:gap-3 px-4 md:px-8 pb-2 hide-scrollbar">
                {popularMovies.results.slice(0, 20).map(movie => (
                  <MovieCard
                    key={movie.id} id={movie.id} title={movie.title}
                    posterPath={movie.poster_path} year={getYear(movie.release_date)}
                    rating={movie.vote_average} mediaType="movie"
                  />
                ))}
              </div>
            </section>
          )}

          {/* New This Year */}
          {newThisYear.results.length > 0 && (
            <section>
              <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
                <div className="flex-shrink-0 w-[90px] md:w-[130px]">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-5 bg-green-500 rounded-full mt-1 flex-shrink-0" />
                    <h2 className="text-sm md:text-base font-bold">New This Year</h2>
                  </div>
                </div>
              </div>
              <div className="flex overflow-x-auto gap-2 md:gap-3 px-4 md:px-8 pb-2 hide-scrollbar">
                {newThisYear.results.slice(0, 20).map(show => (
                  <MovieCard
                    key={show.id} id={show.id} title={show.name}
                    posterPath={show.poster_path} year={getYear(show.first_air_date)}
                    rating={show.vote_average} mediaType="tv"
                  />
                ))}
              </div>
            </section>
          )}

          {/* Top Rated Anime */}
          {topRated.results.length > 0 && (
            <section>
              <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
                <div className="flex-shrink-0 w-[90px] md:w-[130px]">
                  <div className="flex items-start gap-2">
                    <div className="w-1 h-5 bg-yellow-500 rounded-full mt-1 flex-shrink-0" />
                    <h2 className="text-sm md:text-base font-bold">Top Rated</h2>
                  </div>
                </div>
              </div>
              <div className="flex overflow-x-auto gap-2 md:gap-3 px-4 md:px-8 pb-2 hide-scrollbar">
                {topRated.results.slice(0, 20).map(movie => (
                  <MovieCard
                    key={movie.id} id={movie.id} title={movie.title}
                    posterPath={movie.poster_path} year={getYear(movie.release_date)}
                    rating={movie.vote_average} mediaType="movie"
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}
