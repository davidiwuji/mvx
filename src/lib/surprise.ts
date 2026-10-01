import { IMDB_TRENDING_MOVIES, IMDB_TRENDING_TV } from './imdb';
import { slugify } from './tmdb';

export interface SurpriseResult {
  id: number;
  imdbId?: string;
  title: string;
  mediaType: 'movie' | 'tv';
  slug: string;
  url: string;
  posterPath: string | null;
  backdropPath?: string | null;
  overview?: string;
  rating?: number;
  year?: string;
}

export function getRandomSurprise(): SurpriseResult {
  const allTitles = [
    ...IMDB_TRENDING_MOVIES.map(m => ({
      id: m.id,
      imdbId: m.imdbId,
      title: m.title,
      mediaType: 'movie' as const,
      poster_path: m.posterPath,
      backdrop_path: m.backdropPath,
      overview: m.overview,
      vote_average: m.imdbRating,
      year: m.year,
    })),
    ...IMDB_TRENDING_TV.map(t => ({
      id: t.id,
      imdbId: t.imdbId,
      title: t.title,
      mediaType: 'tv' as const,
      poster_path: t.posterPath,
      backdrop_path: t.backdropPath,
      overview: t.overview,
      vote_average: t.imdbRating,
      year: t.year,
    })),
  ];

  const randomIndex = Math.floor(Math.random() * allTitles.length);
  const picked = allTitles[randomIndex];
  const slug = slugify(picked.title, picked.id);

  return {
    id: picked.id,
    imdbId: picked.imdbId,
    title: picked.title,
    mediaType: picked.mediaType,
    slug,
    url: `/detail/${slug}?type=${picked.mediaType}`,
    posterPath: picked.poster_path,
    backdropPath: picked.backdrop_path,
    overview: picked.overview,
    rating: picked.vote_average,
    year: picked.year,
  };
}
