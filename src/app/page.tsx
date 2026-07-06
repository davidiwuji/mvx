import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';
import { tmdbFetch } from '@/lib/tmdb';
import type { TMDBResponse, TMDBMovie, TMDBTVShow } from '@/lib/types';

export default async function HomePage() {
  let trending, popular, topRated, nowPlaying, tvPopular, netflix, prime, anime, korean;
  try {
    [trending, popular, topRated, nowPlaying, tvPopular, netflix, prime, anime] = await Promise.all([
      tmdbFetch<TMDBResponse<TMDBMovie>>('/trending/movie/week'),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/popular'),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/top_rated'),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/now_playing'),
      tmdbFetch<TMDBResponse<TMDBTVShow>>('/tv/popular'),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_networks: '213', sort_by: 'popularity.desc' }),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_networks: '1024', sort_by: 'popularity.desc' }),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_genres: '16', sort_by: 'popularity.desc' }),
    ]);
    const kRes = await tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_original_language: 'ko', sort_by: 'popularity.desc' });
    korean = kRes;
  } catch {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading content...</p></div>;
  }

  return (
    <div>
      {/* Hero — full viewport */}
      <HeroBanner items={trending.results.slice(0, 8)} />

      {/* Content — overlaps hero to create ~80px peek of Trending Now */}
      <div className="relative z-20 -mt-48 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D] to-transparent pt-28">
        <div className="max-w-[1400px] mx-auto space-y-8 pb-16">

          {/* Trending Now */}
          <section className="flex items-start gap-4 md:gap-6 px-4 pt-4">
            <div className="flex-shrink-0 w-[90px] md:w-[130px] pt-1">
              <div className="flex items-start gap-2">
                <div className="w-1 h-5 bg-[#FF6B00] rounded-full mt-1 flex-shrink-0" />
                <div>
                  <h2 className="text-sm md:text-base font-bold leading-tight">Trending Now</h2>
                  <a href="/movies" className="text-[10px] md:text-xs text-[#FF6B00] hover:text-[#E65A00] font-medium mt-1 inline-block">View All &rarr;</a>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0 relative overflow-x-auto hide-scrollbar pb-2">
              <div className="flex gap-2 md:gap-3">
                {trending.results.slice(0, 12).map(m => (
                  <a key={m.id} href={`/detail/${m.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${m.id}?type=movie`}
                    className="flex-shrink-0 w-[140px] md:w-[160px] group">
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#222222]">
                      <img src={`https://image.tmdb.org/t/p/w300${m.poster_path}`} alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 truncate">{m.title}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <MovieRow title="Netflix" items={netflix.results} linkHref="/movies?genre=netflix" />
          <MovieRow title="Prime Video" items={prime.results} linkHref="/movies?genre=prime" />
          <MovieRow title="Anime" items={anime.results} linkHref="/movies?genre=animation" />
          <MovieRow title="Korean" items={korean.results} linkHref="/movies" />
          <MovieRow title="Popular Movies" items={popular.results} linkHref="/movies" />
          <MovieRow title="Top Rated" items={topRated.results} linkHref="/movies" />
          <MovieRow title="Now Playing" items={nowPlaying.results} linkHref="/movies" />
          <MovieRow title="Popular TV Series" items={tvPopular.results} linkHref="/tv-series" />
        </div>
      </div>
    </div>
  );
}
