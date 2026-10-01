'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import { getYear } from '@/lib/tmdb';
import { getRandomSurprise } from '@/lib/surprise';
import type { TMDBMovie, TMDBTVShow, ContentType } from '@/lib/types';

function SearchResults() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get('q') || '';
  const page = parseInt(sp.get('page') || '1', 10);

  const [results, setResults] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(q);

  useEffect(() => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    fetch(`/api/tmdb?endpoint=search/multi&query=${encodeURIComponent(q.trim())}&page=${page}`)
      .then(r => r.json())
      .then(d => {
        const filtered =
          d.results?.filter((r: any) => r.media_type === 'movie' || r.media_type === 'tv' || (!r.media_type && (r.title || r.name))) || [];
        setResults(filtered);
        setTotal(Math.min(d.total_pages || 1, 500));
      })
      .catch(() => {
        setResults([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [q, page]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSurpriseMe = () => {
    const s = getRandomSurprise();
    router.push(s.url);
  };

  return (
    <>
      {/* Search Bar */}
      <form onSubmit={onSubmit} className="mb-10">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search thousands of movies, TV series, and anime..."
            className="w-full bg-[#121624] border border-white/10 rounded-full px-6 py-3.5 pl-14 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B00] shadow-xl focus:shadow-[0_0_20px_rgba(255,107,0,0.3)] text-sm md:text-base transition-all"
          />
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-[#FF6B00] hover:bg-[#FF8A00] text-white text-xs font-bold transition-all"
          >
            Search
          </button>
        </div>
      </form>

      {/* Empty / Initial State */}
      {!q && (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-gray-500">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Find What to Stream</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto mb-6">
            Search by movie title, actor, or franchise. Or test your luck with our random discovery engine!
          </p>
          <button
            onClick={handleSurpriseMe}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold text-xs transition-all"
          >
            <span>🎲 Surprise Me with a Random Movie</span>
          </button>
        </div>
      )}

      {/* Loading */}
      {q && loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Searching title database...</p>
        </div>
      )}

      {/* No results */}
      {q && !loading && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-gray-300 mb-2">No matching titles for &ldquo;{q}&rdquo;</p>
          <p className="text-xs text-gray-500 mb-6">Try checking your spelling or search for another popular keyword.</p>
          <button
            onClick={handleSurpriseMe}
            className="px-5 py-2 rounded-full bg-[#FF6B00] text-white text-xs font-semibold hover:bg-[#FF8A00] transition-colors"
          >
            🎲 Roll Surprise Title
          </button>
        </div>
      )}

      {/* Results grid */}
      {results.length > 0 && !loading && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs sm:text-sm text-gray-400">
              Results for <span className="text-white font-bold">&ldquo;{q}&rdquo;</span>
            </p>
            <span className="text-xs text-gray-500">
              Page {page} of {total}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
            {results.map(r => {
              const isMovie = r.media_type !== 'tv' && ('title' in r || !('name' in r));
              const t = isMovie ? (r as TMDBMovie).title : (r as TMDBTVShow).name;
              const d = isMovie ? (r as TMDBMovie).release_date : (r as TMDBTVShow).first_air_date;

              return (
                <MovieCard
                  key={`${r.media_type || 'm'}-${r.id}`}
                  id={r.id}
                  title={t}
                  posterPath={r.poster_path}
                  backdropPath={r.backdrop_path}
                  year={getYear(d)}
                  rating={r.vote_average}
                  mediaType={(r.media_type as ContentType) || (isMovie ? 'movie' : 'tv')}
                />
              );
            })}
          </div>

          {/* Pagination */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              {page > 1 && (
                <button
                  onClick={() => router.push(`/search?q=${encodeURIComponent(q)}&page=${page - 1}`)}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-300 hover:text-white transition-all"
                >
                  &larr; Previous
                </button>
              )}
              <span className="text-xs text-gray-500">
                Page {page} of {total}
              </span>
              {page < total && (
                <button
                  onClick={() => router.push(`/search?q=${encodeURIComponent(q)}&page=${page + 1}`)}
                  className="px-5 py-2 bg-gradient-to-r from-[#FF6B00] to-[#FF8A00] rounded-full text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                >
                  Next &rarr;
                </button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      <Suspense
        fallback={
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}
