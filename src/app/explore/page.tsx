import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { tmdbFetch, getYear } from '@/lib/tmdb';
import type { TMDBResponse, TMDBMovie, TMDBTVShow } from '@/lib/types';
import type { Metadata } from 'next';

export const revalidate = 3600;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const platformId = params.provider ? parseInt(params.provider, 10) : null;
  const platform = platformId ? STREAMING_PLATFORMS.find(p => p.id === platformId) : null;

  if (platform) {
    return {
      title: `What's on ${platform.name} - Explore Movies & Series | MVX`,
      description: `Browse movies and TV series available on ${platform.name}. Discover trending, popular, and top-rated content streaming now on MVX.`,
      openGraph: {
        title: `What's on ${platform.name}`,
        description: `Browse movies and TV series streaming on ${platform.name}.`,
      },
    };
  }

  return {
    title: 'Explore - Discover Movies & TV Shows Across Platforms | MVX',
    description: 'Browse and discover thousands of movies and TV series by platform, genre, and trending status on MVX.',
    keywords: ['discover movies', 'browse streaming platforms', 'popular movies', 'trending shows', 'MVX explore'],
  };
}

// Comprehensive streaming platforms list
const STREAMING_PLATFORMS = [
  { id: 8, name: 'Netflix', slug: 'netflix', color: '#E50914', emoji: '🎬' },
  { id: 9, name: 'Amazon Prime', slug: 'prime', color: '#00A8E1', emoji: '📦' },
  { id: 384, name: 'HBO Max', slug: 'hbo-max', color: '#5822B4', emoji: '🟣' },
  { id: 337, name: 'Disney+', slug: 'disney-plus', color: '#113CCF', emoji: '✨' },
  { id: 15, name: 'Hulu', slug: 'hulu', color: '#1CE783', emoji: '🌿' },
  { id: 386, name: 'Peacock', slug: 'peacock', color: '#0169D9', emoji: '🦚' },
  { id: 531, name: 'Paramount+', slug: 'paramount', color: '#0064FF', emoji: '⛰️' },
  { id: 119, name: 'Apple TV+', slug: 'apple-tv', color: '#555555', emoji: '🍎' },
  { id: 1899, name: 'Max', slug: 'max', color: '#002BD4', emoji: '📺' },
  { id: 273, name: 'Crunchyroll', slug: 'crunchyroll', color: '#F47521', emoji: '🍊' },
  { id: 387, name: 'Tubi TV', slug: 'tubi', color: '#8A2BE8', emoji: '📺' },
  { id: 300, name: 'Pluto TV', slug: 'pluto-tv', color: '#FF6B00', emoji: '📡' },
];

async function ProviderCatalogPage({ platform }: { platform: typeof STREAMING_PLATFORMS[0] }) {
  let movies: TMDBMovie[] = [];
  let shows: TMDBTVShow[] = [];
  let trending: TMDBMovie[] = [];

  try {
    const [movieRes, showRes, trendingRes] = await Promise.all([
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', {
        with_watch_providers: String(platform.id),
        watch_region: 'US',
        sort_by: 'popularity.desc',
        page: '1',
      }),
      tmdbFetch<TMDBResponse<TMDBTVShow>>('/discover/tv', {
        with_watch_providers: String(platform.id),
        watch_region: 'US',
        sort_by: 'popularity.desc',
        page: '1',
      }),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/trending/movie/week'),
    ]);

    movies = movieRes.results || [];
    shows = showRes.results || [];
    trending = (trendingRes.results || []).slice(0, 10);
  } catch {
    // fallback
  }

  const trendingOnPlatform = trending.filter(t => movies.some(m => m.id === t.id));

  return (
    <main className="min-h-screen pt-28 pb-20 space-y-12 max-w-[1400px] mx-auto">
      {/* Back + Header */}
      <div className="px-4 md:px-8">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors mb-4 bg-white/5 px-3 py-1.5 rounded-full border border-white/10"
        >
          &larr; Browse All Platforms
        </Link>

        <div className="flex items-center gap-4 mb-2">
          <span className="text-3xl">{platform.emoji}</span>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white">{platform.name}</h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
              Popular movies and series available to stream
            </p>
          </div>
        </div>
      </div>

      {/* Trending on this platform */}
      {trendingOnPlatform.length > 0 && (
        <section className="px-4 md:px-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 bg-blue-500 rounded-full flex-shrink-0" />
            <h2 className="text-base font-bold text-white">Trending on {platform.name}</h2>
          </div>
          <div className="flex overflow-x-auto gap-3 md:gap-4 pb-3 hide-scrollbar snap-x">
            {trendingOnPlatform.map(movie => (
              <div
                key={movie.id}
                className="snap-start w-[150px] min-w-[150px] sm:w-[170px] sm:min-w-[170px] md:w-[190px] md:min-w-[190px] flex-shrink-0"
              >
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  year={getYear(movie.release_date)}
                  rating={movie.vote_average}
                  mediaType="movie"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Movies on this platform */}
      {movies.length > 0 && (
        <section className="px-4 md:px-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 bg-purple-500 rounded-full flex-shrink-0" />
            <h2 className="text-base font-bold text-white">Popular Movies on {platform.name}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
            {movies.slice(0, 18).map(movie => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                year={getYear(movie.release_date)}
                rating={movie.vote_average}
                mediaType="movie"
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Series on this platform */}
      {shows.length > 0 && (
        <section className="px-4 md:px-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 bg-emerald-500 rounded-full flex-shrink-0" />
            <h2 className="text-base font-bold text-white">Popular Series on {platform.name}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
            {shows.slice(0, 18).map(show => (
              <MovieCard
                key={show.id}
                id={show.id}
                title={show.name}
                posterPath={show.poster_path}
                year={getYear(show.first_air_date)}
                rating={show.vote_average}
                mediaType="tv"
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

// ─── Main Explore Page ───
export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string }>;
}) {
  const params = await searchParams;
  const selectedProviderId = params.provider ? parseInt(params.provider, 10) : null;
  const selectedPlatform = selectedProviderId
    ? STREAMING_PLATFORMS.find(p => p.id === selectedProviderId) || null
    : null;

  if (selectedPlatform) {
    return <ProviderCatalogPage platform={selectedPlatform} />;
  }

  let trending: TMDBResponse<TMDBMovie>;
  let tvPopular: TMDBResponse<TMDBTVShow>;
  let topRated: TMDBResponse<TMDBMovie>;

  try {
    const [t, tv, tr] = await Promise.all([
      tmdbFetch<TMDBResponse<TMDBMovie>>('/trending/movie/week'),
      tmdbFetch<TMDBResponse<TMDBTVShow>>('/tv/popular'),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/top_rated'),
    ]);
    trending = t;
    tvPopular = tv;
    topRated = tr;
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <p className="text-gray-400">Loading platform catalog...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-28 pb-20 space-y-12 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="px-4 md:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-7 bg-gradient-to-b from-[#FF6B00] to-[#FF8A00] rounded-full" />
          <h1 className="text-3xl md:text-4xl font-black text-white">Explore</h1>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm">
          Browse movies and series across Netflix, Disney+, Prime Video, Apple TV+, and more.
        </p>
      </div>

      {/* Streaming Platform Grid */}
      <section className="px-4 md:px-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1.5 h-5 bg-[#FF6B00] rounded-full flex-shrink-0" />
          <h2 className="text-sm md:text-base font-bold text-white">Browse by Network</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {STREAMING_PLATFORMS.map(platform => (
            <Link
              key={platform.id}
              href={`/explore?provider=${platform.id}`}
              className="flex items-center gap-3 bg-[#121624] hover:bg-[#1a1f33] border border-white/10 hover:border-[#FF6B00]/40 rounded-2xl px-4 py-3.5 transition-all group shadow-sm hover:scale-[1.02]"
            >
              <span className="text-2xl">{platform.emoji}</span>
              <span className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors">
                {platform.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      {trending?.results?.length > 0 && (
        <section className="px-4 md:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-[#F5C518] rounded-full flex-shrink-0" />
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>IMDb Popular Releases</span>
                <span className="bg-[#F5C518] text-black text-[10px] font-black px-1.5 py-0.5 rounded">
                  IMDb
                </span>
              </h2>
            </div>
            <Link href="/movies" className="text-xs text-[#FF8A00] font-semibold hover:underline">
              View All &rarr;
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-3 md:gap-4 pb-3 hide-scrollbar snap-x">
            {trending.results.slice(0, 15).map(movie => (
              <div
                key={movie.id}
                className="snap-start w-[150px] min-w-[150px] sm:w-[170px] sm:min-w-[170px] md:w-[190px] md:min-w-[190px] flex-shrink-0"
              >
                <MovieCard
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.poster_path}
                  year={getYear(movie.release_date)}
                  rating={movie.vote_average}
                  mediaType="movie"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Series */}
      {tvPopular?.results?.length > 0 && (
        <section className="px-4 md:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-purple-500 rounded-full flex-shrink-0" />
              <h2 className="text-base font-bold text-white">Top Streamed Series</h2>
            </div>
            <Link href="/tv-series" className="text-xs text-[#FF8A00] font-semibold hover:underline">
              View All &rarr;
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-3 md:gap-4 pb-3 hide-scrollbar snap-x">
            {tvPopular.results.slice(0, 15).map(show => (
              <div
                key={show.id}
                className="snap-start w-[150px] min-w-[150px] sm:w-[170px] sm:min-w-[170px] md:w-[190px] md:min-w-[190px] flex-shrink-0"
              >
                <MovieCard
                  id={show.id}
                  title={show.name}
                  posterPath={show.poster_path}
                  year={getYear(show.first_air_date)}
                  rating={show.vote_average}
                  mediaType="tv"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Rated */}
      {topRated?.results?.length > 0 && (
        <section className="px-4 md:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-5 bg-amber-500 rounded-full flex-shrink-0" />
              <h2 className="text-base font-bold text-white">Critically Acclaimed</h2>
            </div>
            <Link href="/movies" className="text-xs text-[#FF8A00] font-semibold hover:underline">
              View All &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
            {topRated.results.slice(0, 18).map(movie => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                posterPath={movie.poster_path}
                year={getYear(movie.release_date)}
                rating={movie.vote_average}
                mediaType="movie"
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
