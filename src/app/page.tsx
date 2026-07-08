import HeroBanner from '@/components/HeroBanner';
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
  let trending, popular, tvPopular, action, comedy, horror, sciFi, anime, korean;
  try {
    [trending, popular, tvPopular, action, comedy, horror, sciFi, anime] = await Promise.all([
      tmdbFetch<TMDBResponse<TMDBMovie>>('/trending/movie/week'),
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

  return (
    <div>
      <HeroBanner items={trending.results.slice(0, 8)} />
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