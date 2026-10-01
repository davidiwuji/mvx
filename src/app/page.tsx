import HeroBanner from '@/components/HeroBanner';
import type { BannerItem } from '@/components/HeroBanner';
import HomeClient from '@/components/HomeClient';
import { tmdbFetch, getTmdbKey, getTmdbToken } from '@/lib/tmdb';
import { getImdbTrendingMovies, getImdbTrendingTV } from '@/lib/imdb';
import type { TMDBResponse, TMDBMovie, TMDBTVShow } from '@/lib/types';
import type { Metadata } from 'next';

export const revalidate = 1800;

export const metadata: Metadata = {
  title: 'MVX - Watch Free Movies & TV Series Online in HD',
  description: 'Stream thousands of free movies and TV series online in HD. Sourced from IMDb trending charts. No registration required.',
  keywords: [
    'free movies online', 'watch movies free', 'IMDb trending', 'free TV series', 'HD streaming', 'watch online free',
    'movie streaming', 'TV shows free', 'MVX streaming', 'anime streaming',
  ],
  alternates: { canonical: 'https://mvx.stream' },
  openGraph: {
    title: 'MVX - Watch Free Movies & TV Series Online in HD',
    description: 'Stream thousands of free movies and TV series online in HD sourced from IMDb trending charts.',
    url: 'https://mvx.stream',
  },
  twitter: {
    title: 'MVX - Watch Free Movies & TV Series Online in HD',
    description: 'Stream thousands of free movies and TV series online in HD.',
  },
};

export default async function HomePage() {
  const imdbMovies = getImdbTrendingMovies();
  const imdbTV = getImdbTrendingTV();

  let trending: TMDBMovie[] = imdbMovies;
  let trendingTv: TMDBTVShow[] = imdbTV;
  let popular: TMDBMovie[] = imdbMovies.slice(4);
  let tvPopular: TMDBTVShow[] = imdbTV;
  let action: TMDBMovie[] = imdbMovies.filter(m => m.genre_ids.includes(28));
  let comedy: TMDBMovie[] = imdbMovies.filter(m => m.genre_ids.includes(35));
  let horror: TMDBMovie[] = imdbMovies.filter(m => m.genre_ids.includes(27));
  let sciFi: TMDBMovie[] = imdbMovies.filter(m => m.genre_ids.includes(878));
  let anime: TMDBMovie[] = [];
  let korean: TMDBMovie[] = [];

  const hasApiKey = !!getTmdbKey() || !!getTmdbToken();

  if (hasApiKey) {
    try {
      const [t, tTv, pop, tvPop, act, com, hor, sci, ani, kRes] = await Promise.all([
        tmdbFetch<TMDBResponse<TMDBMovie>>('/trending/movie/week'),
        tmdbFetch<TMDBResponse<TMDBTVShow>>('/trending/tv/week'),
        tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/popular'),
        tmdbFetch<TMDBResponse<TMDBTVShow>>('/tv/popular'),
        tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_genres: '28', sort_by: 'popularity.desc' }),
        tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_genres: '35', sort_by: 'popularity.desc' }),
        tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_genres: '27', sort_by: 'popularity.desc' }),
        tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_genres: '878', sort_by: 'popularity.desc' }),
        tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_genres: '16', sort_by: 'popularity.desc' }),
        tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_original_language: 'ko', sort_by: 'popularity.desc' }),
      ]);

      // Blend IMDb top hits at the front of trending to ensure real IMDb alignment
      trending = [...imdbMovies.slice(0, 8), ...t.results.filter(m => !imdbMovies.some(im => im.id === m.id))];
      trendingTv = [...imdbTV.slice(0, 5), ...tTv.results.filter(s => !imdbTV.some(it => it.id === s.id))];
      popular = pop.results;
      tvPopular = tvPop.results;
      action = act.results;
      comedy = com.results;
      horror = hor.results;
      sciFi = sci.results;
      anime = ani.results;
      korean = kRes.results;
    } catch (err) {
      console.warn('TMDB API fetch failed, using IMDb curated catalog:', err);
    }
  }

  // Mixed Hero Banner with Top IMDb Titles
  const bannerItems: BannerItem[] = [];
  const movieSlice = trending.slice(0, 6);
  const tvSlice = trendingTv.slice(0, 4);
  const maxLen = Math.max(movieSlice.length, tvSlice.length);

  for (let i = 0; i < maxLen && bannerItems.length < 8; i++) {
    if (i < movieSlice.length) {
      const m = movieSlice[i];
      bannerItems.push({
        id: m.id,
        title: m.title,
        backdrop_path: m.backdrop_path,
        release_date: m.release_date,
        vote_average: m.vote_average,
        genre_ids: m.genre_ids,
        overview: m.overview,
        media_type: 'movie',
      });
    }
    if (i < tvSlice.length && bannerItems.length < 8) {
      const t = tvSlice[i];
      bannerItems.push({
        id: t.id,
        title: t.name,
        name: t.name,
        backdrop_path: t.backdrop_path,
        first_air_date: t.first_air_date,
        vote_average: t.vote_average,
        genre_ids: t.genre_ids,
        overview: t.overview,
        media_type: 'tv',
      });
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Cinematic Hero */}
      <HeroBanner items={bannerItems} />

      {/* Main Content Showcase */}
      <div className="relative z-20 -mt-32 md:-mt-44 bg-gradient-to-t from-[#090B10] via-[#090B10] to-transparent pt-20">
        <div className="max-w-[1440px] mx-auto">
          <HomeClient
            trending={trending}
            popular={popular}
            tvPopular={tvPopular}
            action={action}
            comedy={comedy}
            horror={horror}
            sciFi={sciFi}
            anime={anime}
            korean={korean}
          />
        </div>
      </div>
    </div>
  );
}