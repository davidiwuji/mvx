export interface TMDBMovie {
  id: number; title: string; original_title: string; overview: string;
  poster_path: string | null; backdrop_path: string | null;
  release_date: string; vote_average: number; vote_count: number;
  genre_ids: number[]; popularity: number; media_type?: string;
}
export interface TMDBTVShow {
  id: number; name: string; original_name: string; overview: string;
  poster_path: string | null; backdrop_path: string | null;
  first_air_date: string; vote_average: number; vote_count: number;
  genre_ids: number[]; popularity: number; media_type?: string;
}
export interface TMDBGenre { id: number; name: string; }
export interface TMDBVideo { id: string; key: string; name: string; site: string; type: string; official: boolean; }
export interface TMDBSeason { id: number; name: string; overview: string; poster_path: string | null; season_number: number; episode_count: number; }
export interface TMDBEpisode { id: number; name: string; overview: string; still_path: string | null; episode_number: number; season_number: number; air_date: string; vote_average: number; }
export interface TMDBResponse<T> { page: number; results: T[]; total_pages: number; total_results: number; }
export interface MovieDetail extends TMDBMovie {
  genres: TMDBGenre[]; runtime: number; tagline: string; budget: number; revenue: number;
  videos: { results: TMDBVideo[] }; credits: { cast: CastMember[]; crew: CrewMember[] };
  belongs_to_collection: { id: number; name: string; poster_path: string | null; backdrop_path: string | null } | null;
  production_countries: { iso_3166_1: string; name: string }[];
}
export interface TVDetail extends TMDBTVShow {
  genres: TMDBGenre[]; seasons: TMDBSeason[]; number_of_seasons: number; number_of_episodes: number;
  videos: { results: TMDBVideo[] }; credits: { cast: CastMember[]; crew: CrewMember[] };
  created_by: { id: number; name: string }[]; status: string; type: string;
  production_countries: { iso_3166_1: string; name: string }[];
}
export interface CastMember { id: number; name: string; character: string; profile_path: string | null; order: number; }
export interface CrewMember { id: number; name: string; job: string; department: string; }
export interface StreamSource { url: string; type: 'mp4' | 'm3u8' | 'embed' | 'youtube'; quality?: string; name?: string; }

export type ContentType = 'movie' | 'tv';
