import type { TMDBMovie, TMDBTVShow } from './types';
import { getImdbTrendingMovies, getImdbTrendingTV } from './imdb';

export const MOCK_MOVIES: TMDBMovie[] = getImdbTrendingMovies();

export const MOCK_TV_SHOWS: TMDBTVShow[] = getImdbTrendingTV();
