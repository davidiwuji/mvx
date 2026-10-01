'use client';

import React, { useState, useEffect } from 'react';
import MovieRow from '@/components/MovieRow';
import MovieCard from '@/components/MovieCard';
import { getWatchHistory, type WatchItem } from '@/lib/storage';
import type { TMDBMovie, TMDBTVShow } from '@/lib/types';

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

export default function HomeClient({
  trending,
  popular,
  tvPopular,
  action,
  comedy,
  horror,
  sciFi,
  anime,
  korean,
}: HomeClientProps) {
  const [history, setHistory] = useState<WatchItem[]>([]);

  useEffect(() => {
    setHistory(getWatchHistory());
  }, []);

  return (
    <div className="space-y-6 pb-20">
      {/* Continue Watching Section (if history exists) */}
      {history.length > 0 && (
        <section className="px-4 md:px-8 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <div>
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Continue Watching
                  <span className="text-xs font-normal text-gray-500">({history.length})</span>
                </h2>
                <p className="text-xs text-gray-400">Pick up right where you left off</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('boxo_watch_history');
                setHistory([]);
              }}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear History
            </button>
          </div>

          <div className="flex overflow-x-auto gap-3 md:gap-4 pb-3 hide-scrollbar snap-x">
            {history.slice(0, 10).map(item => (
              <div
                key={`${item.mediaType}-${item.id}`}
                className="snap-start w-[150px] min-w-[150px] sm:w-[170px] sm:min-w-[170px] md:w-[190px] md:min-w-[190px] flex-shrink-0"
              >
                <MovieCard
                  id={item.id}
                  title={item.title}
                  posterPath={item.posterPath}
                  year={item.year}
                  rating={item.rating}
                  mediaType={item.mediaType}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* IMDb Trending Movies */}
      {trending.length > 0 && (
        <MovieRow
          title="IMDb Trending Hits"
          subtitle="Top streamed titles based on the official IMDb MOVIEmeter"
          items={trending}
          isImdbSource={true}
          linkHref="/movies"
        />
      )}

      {/* IMDb Popular TV Series */}
      {tvPopular.length > 0 && (
        <MovieRow
          title="IMDb Most Popular Series"
          subtitle="Top rated binge-worthy shows on television"
          items={tvPopular}
          isImdbSource={true}
          linkHref="/tv-series"
        />
      )}

      {/* Popular Blockbusters */}
      {popular.length > 0 && (
        <MovieRow
          title="Global Blockbusters"
          subtitle="Box office sensations and audience favorites"
          items={popular}
          linkHref="/movies"
        />
      )}

      {/* Action */}
      {action.length > 0 && (
        <MovieRow
          title="Adrenaline & Action"
          subtitle="High-octane thrillers and martial arts"
          items={action}
          linkHref="/movies?genre=action"
        />
      )}

      {/* Anime */}
      {anime.length > 0 && (
        <MovieRow
          title="Anime Showcase"
          subtitle="Japanese animation, subbed & dubbed"
          items={anime}
          linkHref="/anime"
        />
      )}

      {/* Sci-Fi */}
      {sciFi.length > 0 && (
        <MovieRow
          title="Sci-Fi & Cyberpunk"
          subtitle="Mind-bending realities and future worlds"
          items={sciFi}
          linkHref="/movies?genre=scifi"
        />
      )}

      {/* Late Night Horror */}
      {horror.length > 0 && (
        <MovieRow
          title="Late Night Horror"
          subtitle="Spine-chilling scares and psychological thrillers"
          items={horror}
          linkHref="/movies?genre=horror"
        />
      )}

      {/* Comedy */}
      {comedy.length > 0 && (
        <MovieRow
          title="Comedy & Fun"
          subtitle="Laugh-out-loud favorites and family entertainment"
          items={comedy}
          linkHref="/movies?genre=comedy"
        />
      )}

      {/* Korean Cinema */}
      {korean.length > 0 && (
        <MovieRow
          title="K-Drama & Korean Cinema"
          subtitle="Critically acclaimed Korean hits"
          items={korean}
          linkHref="/movies"
        />
      )}
    </div>
  );
}