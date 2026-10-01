'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MovieCard from '@/components/MovieCard';
import { getWatchlist, removeFromWatchlist, subscribeToWatchlist, type WatchlistMovie } from '@/lib/watchlist';
import { getRandomSurprise } from '@/lib/surprise';

export default function WatchlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WatchlistMovie[]>([]);
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(getWatchlist());
    const unsub = subscribeToWatchlist(newItems => {
      setItems(newItems);
    });
    return () => unsub();
  }, []);

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.mediaType === filter;
  });

  const handleSurpriseMe = () => {
    const s = getRandomSurprise();
    router.push(s.url);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      localStorage.removeItem('mvx_user_watchlist');
      setItems([]);
      window.dispatchEvent(new CustomEvent('mvx_watchlist_updated', { detail: { count: 0 } }));
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-7 bg-gradient-to-b from-[#FF6B00] to-[#FF8A00] rounded-full" />
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              My Watchlist
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            {items.length === 0
              ? 'Save movies and series you want to watch later'
              : `You have ${items.length} ${items.length === 1 ? 'title' : 'titles'} saved in your collection`}
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2">
            {/* Filter Pills */}
            <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex items-center gap-1">
              <button
                onClick={() => setFilter('all')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filter === 'all'
                    ? 'bg-[#FF6B00] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilter('movie')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filter === 'movie'
                    ? 'bg-[#FF6B00] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Movies ({items.filter(i => i.mediaType === 'movie').length})
              </button>
              <button
                onClick={() => setFilter('tv')}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  filter === 'tv'
                    ? 'bg-[#FF6B00] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                TV Series ({items.filter(i => i.mediaType === 'tv').length})
              </button>
            </div>

            <button
              onClick={handleClearAll}
              className="text-xs text-gray-500 hover:text-red-400 px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-red-500/20 transition-colors"
              title="Clear all watchlist items"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Content Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-gray-500">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            {items.length === 0 ? 'Your watchlist is empty' : 'No titles matching this filter'}
          </h2>
          <p className="text-sm text-gray-400 max-w-md mb-8">
            Click the bookmark icon on any movie or show card to save it here for later. Or let our engine pick something for you!
          </p>
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <button
              onClick={handleSurpriseMe}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-[#FF6B00] text-white font-semibold text-sm shadow-lg shadow-purple-600/25 hover:scale-105 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
              </svg>
              Surprise Me
            </button>
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/15 transition-all"
            >
              Browse Movies
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-5">
          {filteredItems.map(item => (
            <div key={`${item.mediaType}-${item.id}`} className="relative group w-full h-full flex flex-col">
              <MovieCard
                id={item.id}
                title={item.title}
                posterPath={item.posterPath}
                year={item.year}
                rating={item.rating}
                mediaType={item.mediaType}
              />
              {/* Quick remove button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeFromWatchlist(item.id, item.mediaType);
                }}
                className="absolute top-2 left-2 z-20 w-7 h-7 rounded-full bg-black/80 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                title="Remove from Watchlist"
                aria-label="Remove item"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
