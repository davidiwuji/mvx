'use client';
import { useState, useEffect } from 'react';
import MovieRow from '@/components/MovieRow';
import { slugify } from '@/lib/tmdb';
import type { TMDBMovie, TMDBTVShow } from '@/lib/types';

interface WatchItem {
  id: number;
  title: string;
  posterPath: string | null;
  mediaType: 'movie' | 'tv';
  year?: string;
  rating?: number;
  genreIds?: number[];
  watchedAt: number;
}

interface HomeClientProps {
  trending: TMDBMovie[];
  popular: TMDBMovie[];
  tvPopular: TMDBTVShow[];
  action: TMDBMovie[];
  comedy: TMDBMovie[];
  horror: TMDBMovie[];
  sciFi: TMDBMovie[];
  anime: TMDBMovie[];
  korean: TMDBMovie[];
}

function getHistory(): WatchItem[] {
  try {
    const raw = localStorage.getItem('boxo_watch_history');
    if (!raw) return [];
    return JSON.parse(raw).sort((a: WatchItem, b: WatchItem) => b.watchedAt - a.watchedAt);
  } catch {
    return [];
  }
}

function getLastWatched(): WatchItem | null {
  const h = getHistory();
  return h.length > 0 ? h[0] : null;
}

export default function HomeClient({ trending, popular, tvPopular, action, comedy, horror, sciFi, anime, korean }: HomeClientProps) {
  const [watchHistory, setWatchHistory] = useState<WatchItem[]>([]);
  const [recommendations, setRecommendations] = useState<(TMDBMovie | TMDBTVShow)[]>([]);

  useEffect(() => {
    setWatchHistory(getHistory());

    const lastWatched = getLastWatched();
    if (lastWatched?.genreIds && lastWatched.genreIds.length > 0) {
      fetch(`/api/tmdb?endpoint=/discover/movie&with_genres=${lastWatched.genreIds[0]}&sort_by=popularity.desc&page=1`)
        .then(r => r.json())
        .then(data => {
          if (data.results) {
            const filtered = data.results.filter((m: TMDBMovie) => m.id !== lastWatched.id);
            setRecommendations(filtered.slice(0, 12));
          }
        })
        .catch(() => {});
    }
  }, []);

  const getRow = (items: (TMDBMovie | TMDBTVShow)[]) => items.length > 0;

  return (
    <div className="space-y-8 pb-16">
      {/* Continue Watching */}
      {watchHistory.length > 0 && (
        <section className="flex items-start gap-4 md:gap-6 px-4">
          <div className="flex-shrink-0 w-[90px] md:w-[130px] pt-1">
            <div className="flex items-start gap-2">
              <div className="w-1 h-5 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-sm md:text-base font-bold leading-tight">Continue Watching</h2>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0 overflow-x-auto hide-scrollbar pb-2">
            <div className="flex gap-2 md:gap-3">
              {watchHistory.slice(0, 10).map(item => (
                <a key={`${item.mediaType}-${item.id}`} href={`/detail/${slugify(item.title, item.id)}?type=${item.mediaType}`}
                  className="flex-shrink-0 w-[140px] md:w-[160px] group">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#222222] relative">
                    {item.posterPath ? (
                      <img src={`https://image.tmdb.org/t/p/w300${item.posterPath}`} alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No poster</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="6,3 20,12 6,21"/></svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 truncate">{item.title}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recommended For You */}
      {recommendations.length > 0 && (
        <MovieRow title="Recommended For You" items={recommendations} linkHref="/movies" />
      )}

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
            {trending.slice(0, 12).map(m => (
              <a key={m.id} href={`/detail/${slugify(m.title, m.id)}?type=movie`}
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

      {getRow(action) && <MovieRow title="Action" items={action} linkHref="/movies?genre=action" />}
      {getRow(comedy) && <MovieRow title="Comedy" items={comedy} linkHref="/movies?genre=comedy" />}
      {getRow(horror) && <MovieRow title="Horror" items={horror} linkHref="/movies?genre=horror" />}
      {getRow(sciFi) && <MovieRow title="Sci-Fi" items={sciFi} linkHref="/movies?genre=scifi" />}
      {getRow(anime) && <MovieRow title="Anime" items={anime} linkHref="/movies?genre=animation" />}
      {getRow(korean) && <MovieRow title="Korean" items={korean} linkHref="/movies" />}
      {getRow(popular) && <MovieRow title="Popular Movies" items={popular} linkHref="/movies" />}
      {getRow(tvPopular) && <MovieRow title="Popular TV Series" items={tvPopular} linkHref="/tv-series" />}
    </div>
  );
}