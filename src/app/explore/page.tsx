import Link from 'next/link';
import MovieCard from '@/components/MovieCard';
import { tmdbFetch, getYear } from '@/lib/tmdb';
import type { TMDBResponse, TMDBMovie, TMDBTVShow } from '@/lib/types';
import type { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ provider?: string }> }): Promise<Metadata> {
  const params = await searchParams;
  const platformId = params.provider ? parseInt(params.provider) : null;
  const platform = platformId ? STREAMING_PLATFORMS.find(p => p.id === platformId) : null;

  if (platform) {
    return {
      title: `What's on ${platform.name} - Explore Movies & Series`,
      description: `Browse movies and TV series available on ${platform.name}. Discover trending, popular, and top-rated content streaming now.`,
      openGraph: {
        title: `What's on ${platform.name}`,
        description: `Browse movies and TV series streaming on ${platform.name}.`,
      },
    };
  }

  return {
    title: 'Explore - Discover Movies & TV Shows',
    description: 'Browse and discover thousands of movies and TV series by genre, popularity, and trending. Find your next favorite film or show.',
    keywords: ['discover movies', 'browse genres', 'popular movies', 'trending', 'movie categories', 'explore films', 'find movies'],
    openGraph: {
      title: 'Explore - Discover Movies & TV Shows',
      description: 'Discover thousands of movies and TV series. Browse by genre, trending, and popular picks.',
      url: 'https://boxo.name.ng/explore',
    },
    twitter: { title: 'Explore - Discover Movies & TV Shows', description: 'Discover your next favorite movie or show.' },
  };
}

// Comprehensive streaming platforms list
const STREAMING_PLATFORMS = [
  { id: 8, name: 'Netflix', slug: 'netflix', color: '#E50914', emoji: '🎬' },
  { id: 9, name: 'Amazon Prime Video', slug: 'prime', color: '#00A8E1', emoji: '📦' },
  { id: 384, name: 'HBO Max', slug: 'hbo-max', color: '#5822B4', emoji: '🟣' },
  { id: 337, name: 'Disney+', slug: 'disney-plus', color: '#113CCF', emoji: '✨' },
  { id: 15, name: 'Hulu', slug: 'hulu', color: '#1CE783', emoji: '🌿' },
  { id: 386, name: 'Peacock', slug: 'peacock', color: '#0169D9', emoji: '🦚' },
  { id: 531, name: 'Paramount+', slug: 'paramount', color: '#0064FF', emoji: '⛰️' },
  { id: 119, name: 'Apple TV+', slug: 'apple-tv', color: '#555555', emoji: '🍎' },
  { id: 1899, name: 'Max', slug: 'max', color: '#002BD4', emoji: '📺' },
  { id: 2, name: 'Apple iTunes', slug: 'itunes', color: '#888888', emoji: '🎵' },
  { id: 3, name: 'Google Play Movies', slug: 'google-play', color: '#3DDC84', emoji: '▶️' },
  { id: 10, name: 'Amazon Video', slug: 'amazon-video', color: '#FF9900', emoji: '📹' },
  { id: 62, name: 'MUBI', slug: 'mubi', color: '#A30000', emoji: '🎥' },
  { id: 11, name: 'MGM+', slug: 'mgm-plus', color: '#E32636', emoji: '🦁' },
  { id: 405, name: 'Showtime', slug: 'showtime', color: '#B30000', emoji: '🌟' },
  { id: 37, name: 'Starz', slug: 'starz', color: '#000000', emoji: '⭐' },
  { id: 188, name: 'YouTube Premium', slug: 'youtube-premium', color: '#FF0000', emoji: '▶️' },
  { id: 192, name: 'YouTube Free', slug: 'youtube-free', color: '#FF0000', emoji: '🆓' },
  { id: 273, name: 'Crunchyroll', slug: 'crunchyroll', color: '#F47521', emoji: '🍊' },
  { id: 283, name: 'Funimation', slug: 'funimation', color: '#5B0BB5', emoji: '🎭' },
  { id: 387, name: 'Tubi TV', slug: 'tubi', color: '#8A2BE8', emoji: '📺' },
  { id: 300, name: 'Pluto TV', slug: 'pluto-tv', color: '#FF6B00', emoji: '📡' },
  { id: 178, name: 'Kanopy', slug: 'kanopy', color: '#1D428A', emoji: '📚' },
  { id: 191, name: 'Plex', slug: 'plex', color: '#E5A00D', emoji: '📽️' },
  { id: 207, name: 'The Roku Channel', slug: 'roku', color: '#662D91', emoji: '📺' },
  { id: 163, name: 'Vudu', slug: 'vudu', color: '#3399FF', emoji: '📀' },
  { id: 508, name: 'AMC+', slug: 'amc-plus', color: '#E8B230', emoji: '📼' },
  { id: 467, name: 'Fandor', slug: 'fandor', color: '#D42020', emoji: '🎞️' },
  { id: 100, name: 'GuideDoc', slug: 'guidedoc', color: '#4A90D9', emoji: '📖' },
];

// ─── Sub-component: catalog for a single selected provider ───
async function ProviderCatalogPage({ platform }: { platform: typeof STREAMING_PLATFORMS[0] }) {
  // Fetch multiple pages of movies and shows for this provider
  let movies: TMDBMovie[] = [];
  let shows: TMDBTVShow[] = [];
  let trending: TMDBMovie[] = [];
  let topRated: TMDBMovie[] = [];

  try {
    const [movieRes1, movieRes2, showRes1, showRes2, trendingRes, topRatedRes] = await Promise.all([
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', {
        with_watch_providers: String(platform.id),
        watch_region: 'US',
        sort_by: 'popularity.desc',
        page: '1',
      }),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', {
        with_watch_providers: String(platform.id),
        watch_region: 'US',
        sort_by: 'vote_average.desc',
        'vote_count.gte': '50',
        page: '1',
      }),
      tmdbFetch<TMDBResponse<TMDBTVShow>>('/discover/tv', {
        with_watch_providers: String(platform.id),
        watch_region: 'US',
        sort_by: 'popularity.desc',
        page: '1',
      }),
      tmdbFetch<TMDBResponse<TMDBTVShow>>('/discover/tv', {
        with_watch_providers: String(platform.id),
        watch_region: 'US',
        sort_by: 'vote_average.desc',
        'vote_count.gte': '20',
        page: '1',
      }),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/trending/movie/week'),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/top_rated'),
    ]);

    movies = [...(movieRes1.results || []), ...(movieRes2.results || [])]
      .filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i)
      .slice(0, 30);
    shows = [...(showRes1.results || []), ...(showRes2.results || [])]
      .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i)
      .slice(0, 30);
    trending = (trendingRes.results || []).slice(0, 10);
    topRated = (topRatedRes.results || []).slice(0, 10);
  } catch {
    // fallback
  }

  // Filter trending/topRated to only those available on this platform
  const trendingOnPlatform = trending.filter(t => movies.some(m => m.id === t.id));
  const topRatedOnPlatform = topRated.filter(t => movies.some(m => m.id === t.id));

  return (
    <main className="min-h-screen pt-24 pb-16 space-y-12 max-w-[1400px] mx-auto">
      {/* Back + Header */}
      <div className="px-4 md:px-8">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Browse All Platforms
        </Link>

        <div className="flex items-center gap-4 mb-2">
          <span className="text-3xl">{platform.emoji}</span>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{platform.name}</h1>
            <p className="text-gray-400 text-sm mt-1">
              Popular movies and series available to stream
            </p>
          </div>
        </div>
      </div>

      {/* Trending on this platform */}
      {trendingOnPlatform.length > 0 && (
        <section>
          <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
            <div className="w-1 h-5 bg-blue-500 rounded-full flex-shrink-0" />
            <h2 className="text-sm md:text-base font-bold">Trending on {platform.name}</h2>
          </div>
          <div className="flex overflow-x-auto gap-2 md:gap-3 px-4 md:px-8 pb-2 hide-scrollbar">
            {trendingOnPlatform.map(movie => (
              <MovieCard
                key={movie.id} id={movie.id} title={movie.title}
                posterPath={movie.poster_path} year={getYear(movie.release_date)}
                rating={movie.vote_average} mediaType="movie"
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Movies on this platform */}
      {movies.length > 0 && (
        <section>
          <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
            <div className="w-1 h-5 bg-purple-500 rounded-full flex-shrink-0" />
            <h2 className="text-sm md:text-base font-bold">Popular Movies on {platform.name}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 px-4 md:px-8">
            {movies.slice(0, 20).map(movie => (
              <MovieCard
                key={movie.id} id={movie.id} title={movie.title}
                posterPath={movie.poster_path} year={getYear(movie.release_date)}
                rating={movie.vote_average} mediaType="movie"
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Series on this platform */}
      {shows.length > 0 && (
        <section>
          <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
            <div className="w-1 h-5 bg-emerald-500 rounded-full flex-shrink-0" />
            <h2 className="text-sm md:text-base font-bold">Popular Series on {platform.name}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 px-4 md:px-8">
            {shows.slice(0, 20).map(show => (
              <MovieCard
                key={show.id} id={show.id} title={show.name}
                posterPath={show.poster_path} year={getYear(show.first_air_date)}
                rating={show.vote_average} mediaType="tv"
              />
            ))}
          </div>
        </section>
      )}

      {/* Top Rated on this platform */}
      {topRatedOnPlatform.length > 0 && (
        <section>
          <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
            <div className="w-1 h-5 bg-amber-500 rounded-full flex-shrink-0" />
            <h2 className="text-sm md:text-base font-bold">Top Rated on {platform.name}</h2>
          </div>
          <div className="flex overflow-x-auto gap-2 md:gap-3 px-4 md:px-8 pb-2 hide-scrollbar">
            {topRatedOnPlatform.map(movie => (
              <MovieCard
                key={movie.id} id={movie.id} title={movie.title}
                posterPath={movie.poster_path} year={getYear(movie.release_date)}
                rating={movie.vote_average} mediaType="movie"
              />
            ))}
          </div>
        </section>
      )}

      {/* All remaining movies */}
      {movies.length > 0 && (
        <section>
          <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
            <div className="w-1 h-5 bg-pink-500 rounded-full flex-shrink-0" />
            <h2 className="text-sm md:text-base font-bold">All Movies on {platform.name}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 px-4 md:px-8">
            {movies.map(movie => (
              <MovieCard
                key={movie.id} id={movie.id} title={movie.title}
                posterPath={movie.poster_path} year={getYear(movie.release_date)}
                rating={movie.vote_average} mediaType="movie"
              />
            ))}
          </div>
        </section>
      )}

      {!movies.length && !shows.length && (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg">No content found for {platform.name}.</p>
          <Link href="/explore" className="text-blue-400 hover:underline mt-2 inline-block">
            Browse all platforms
          </Link>
        </div>
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
  const selectedProviderId = params.provider ? parseInt(params.provider) : null;
  const selectedPlatform = selectedProviderId
    ? STREAMING_PLATFORMS.find(p => p.id === selectedProviderId) || null
    : null;

  // If a specific provider is selected, show its catalog
  if (selectedPlatform) {
    return <ProviderCatalogPage platform={selectedPlatform} />;
  }

  let trending, popular, tvPopular, topRated;
  const platformResults: Record<number, { movies?: TMDBMovie[]; shows?: TMDBTVShow[] }> = {};

  try {
    const platformPromises = STREAMING_PLATFORMS.map(async (platform) => {
      try {
        const [movies, shows] = await Promise.all([
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
        ]);
        if (movies.results.length > 0 || shows.results.length > 0) {
          platformResults[platform.id] = {
            ...(movies.results.length > 0 ? { movies: movies.results.slice(0, 10) } : {}),
            ...(shows.results.length > 0 ? { shows: shows.results.slice(0, 10) } : {}),
          };
        }
      } catch {
        // Skip platforms that error
      }
    });

    const [[trendingRes, popularRes, tvPopularRes, topRatedRes]] = await Promise.all([
      Promise.all([
        tmdbFetch<TMDBResponse<TMDBMovie>>('/trending/movie/week'),
        tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/popular'),
        tmdbFetch<TMDBResponse<TMDBTVShow>>('/tv/popular'),
        tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/top_rated'),
      ]),
      Promise.all(platformPromises),
    ]);
    trending = trendingRes;
    popular = popularRes;
    tvPopular = tvPopularRes;
    topRated = topRatedRes;
  } catch {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-gray-500">Loading explore page...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16 space-y-12 max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="px-4 md:px-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl md:text-4xl font-bold">Explore</h1>
        </div>
        <p className="text-gray-400 text-sm ml-12">Discover what to watch across all streaming platforms</p>
      </div>

      {/* Browse by Streaming Platform Grid */}
      <section className="px-4 md:px-8">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 bg-[#FF6B00] rounded-full flex-shrink-0" />
          <h2 className="text-sm md:text-base font-bold">Browse by Streaming Platform</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {STREAMING_PLATFORMS.map(platform => (
            <Link
              key={platform.id}
              href={`/explore?provider=${platform.id}`}
              className="flex items-center gap-3 bg-[#1A1A1A] hover:bg-[#252525] border border-[#222222] hover:border-[#FF6B00]/30 rounded-xl px-4 py-3.5 transition-all group"
            >
              <span className="text-lg">{platform.emoji}</span>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{platform.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Now */}
      {trending?.results?.length > 0 && (
        <section>
          <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
            <div className="flex-shrink-0 w-[90px] md:w-[130px]">
              <div className="flex items-start gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                <h2 className="text-sm md:text-base font-bold">Trending Now</h2>
              </div>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-2 md:gap-3 px-4 md:px-8 pb-2 hide-scrollbar">
            {trending.results.slice(0, 20).map(movie => (
              <MovieCard
                key={movie.id} id={movie.id} title={movie.title}
                posterPath={movie.poster_path} year={getYear(movie.release_date)}
                rating={movie.vote_average} mediaType="movie"
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Movies */}
      {popular?.results?.length > 0 && (
        <section>
          <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
            <div className="flex-shrink-0 w-[90px] md:w-[130px]">
              <div className="flex items-start gap-2">
                <div className="w-1 h-5 bg-purple-500 rounded-full mt-1 flex-shrink-0" />
                <h2 className="text-sm md:text-base font-bold">Popular Movies</h2>
              </div>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-2 md:gap-3 px-4 md:px-8 pb-2 hide-scrollbar">
            {popular.results.slice(0, 20).map(movie => (
              <MovieCard
                key={movie.id} id={movie.id} title={movie.title}
                posterPath={movie.poster_path} year={getYear(movie.release_date)}
                rating={movie.vote_average} mediaType="movie"
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Series */}
      {tvPopular?.results?.length > 0 && (
        <section>
          <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
            <div className="flex-shrink-0 w-[90px] md:w-[130px]">
              <div className="flex items-start gap-2">
                <div className="w-1 h-5 bg-emerald-500 rounded-full mt-1 flex-shrink-0" />
                <h2 className="text-sm md:text-base font-bold">Popular Series</h2>
              </div>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-2 md:gap-3 px-4 md:px-8 pb-2 hide-scrollbar">
            {tvPopular.results.slice(0, 20).map(show => (
              <MovieCard
                key={show.id} id={show.id} title={show.name}
                posterPath={show.poster_path} year={getYear(show.first_air_date)}
                rating={show.vote_average} mediaType="tv"
              />
            ))}
          </div>
        </section>
      )}

      {/* Top Rated */}
      {topRated?.results?.length > 0 && (
        <section>
          <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
            <div className="flex-shrink-0 w-[90px] md:w-[130px]">
              <div className="flex items-start gap-2">
                <div className="w-1 h-5 bg-amber-500 rounded-full mt-1 flex-shrink-0" />
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

      {/* Streaming Platform Content Sections */}
      {STREAMING_PLATFORMS.filter(p => platformResults[p.id]).slice(0, 8).map((platform, idx) => {
        const data = platformResults[platform.id];
        if (!data) return null;
        const accentColors = ['blue', 'purple', 'emerald', 'amber', 'pink', 'cyan', 'rose', 'indigo'];
        const accent = accentColors[idx % accentColors.length];
        return (
          <section key={platform.id}>
            <div className="flex items-center gap-4 md:gap-6 px-4 md:px-8 mb-4">
              <div className="flex-shrink-0">
                <div className="flex items-start gap-2">
                  <div className={`w-1 h-5 bg-${accent}-500 rounded-full mt-1 flex-shrink-0`} />
                  <h2 className="text-sm md:text-base font-bold">
                    <span className="mr-1.5">{platform.emoji}</span>
                    {platform.name}
                  </h2>
                </div>
              </div>
            </div>
            <div className="flex overflow-x-auto gap-2 md:gap-3 px-4 md:px-8 pb-2 hide-scrollbar">
              {(data.movies || data.shows || []).slice(0, 15).map((item: TMDBMovie | TMDBTVShow) => (
                <MovieCard
                  key={item.id}
                  id={item.id}
                  title={'title' in item ? item.title : item.name!}
                  posterPath={item.poster_path}
                  year={getYear('release_date' in item ? item.release_date : item.first_air_date)}
                  rating={item.vote_average}
                  mediaType={'title' in item ? 'movie' : 'tv'}
                />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}
