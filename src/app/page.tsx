import HeroBanner from '@/components/HeroBanner';
import type { BannerItem } from '@/components/HeroBanner';
import HomeClient from '@/components/HomeClient';
import { tmdbFetch } from '@/lib/tmdb';
import type { TMDBResponse, TMDBMovie, TMDBTVShow } from '@/lib/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boxo - Watch Free Movies & TV Series Online in HD',
  description: 'Watch thousands of free movies and TV series online in HD. No registration required. Browse trending films, popular shows, action, comedy, horror, anime, and more.',
  keywords: ['free movies online', 'watch movies free', 'free TV series', 'HD streaming', 'watch online free', 'movie streaming', 'TV shows free'],
  alternates: { canonical: 'https://boxo.name.ng' },
  openGraph: {
    title: 'Boxo - Watch Free Movies & TV Series Online in HD',
    description: 'Watch thousands of free movies and TV series online in HD. No registration required. Stream trending films and popular shows.',
    url: 'https://boxo.name.ng',
  },
  twitter: {
    title: 'Boxo - Watch Free Movies & TV Series Online in HD',
    description: 'Watch thousands of free movies and TV series online in HD. No registration required.',
  },
};

export default async function HomePage() {
  let trending, trendingTv, popular, tvPopular, action, comedy, horror, sciFi, anime, korean;
  try {
    [trending, trendingTv, popular, tvPopular, action, comedy, horror, sciFi, anime] = await Promise.all([
      tmdbFetch<TMDBResponse<TMDBMovie>>('/trending/movie/week'),
      tmdbFetch<TMDBResponse<TMDBTVShow>>('/trending/tv/week'),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/movie/popular'),
      tmdbFetch<TMDBResponse<TMDBTVShow>>('/tv/popular'),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_genres: '28', sort_by: 'popularity.desc' }),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_genres: '35', sort_by: 'popularity.desc' }),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_genres: '27', sort_by: 'popularity.desc' }),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_genres: '878', sort_by: 'popularity.desc' }),
      tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_genres: '16', sort_by: 'popularity.desc' }),
    ]);
    const kRes = await tmdbFetch<TMDBResponse<TMDBMovie>>('/discover/movie', { with_original_language: 'ko', sort_by: 'popularity.desc' });
    korean = kRes;
  } catch {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading content...</p></div>;
  }

  // Mix trending movies + TV shows into the banner
  const bannerItems: BannerItem[] = [];
  const movieSlice = trending.results.slice(0, 6);
  const tvSlice = trendingTv.results.slice(0, 6);
  const maxLen = Math.max(movieSlice.length, tvSlice.length);
  for (let i = 0; i < maxLen && bannerItems.length < 8; i++) {
    if (i < movieSlice.length) {
      const m = movieSlice[i];
      bannerItems.push({
        id: m.id,
        title: m.title,
        name: undefined,
        backdrop_path: m.backdrop_path,
        release_date: m.release_date,
        vote_average: m.vote_average,
        genre_ids: m.genre_ids,
        overview: m.overview,
        media_type: 'movie' as const,
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
        media_type: 'tv' as const,
      });
    }
  }

  return (
    <div>
      <HeroBanner items={bannerItems} />
      <div className="relative z-20 -mt-48 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D] to-transparent pt-28">
        <div className="max-w-[1400px] mx-auto">
          <HomeClient
            trending={trending.results}
            popular={popular.results}
            tvPopular={tvPopular.results}
            action={action.results}
            comedy={comedy.results}
            horror={horror.results}
            sciFi={sciFi.results}
            anime={anime.results}
            korean={korean.results}
          />
        </div>
      </div>
    </div>
  );
}