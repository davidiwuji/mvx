'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import SportsMatchCard from '@/components/SportsMatchCard';

const CATEGORIES = [
  { id: '', label: 'All Sports', emoji: '🏐' },
  { id: 'football', label: 'Football', emoji: '⚽' },
  { id: 'basketball', label: 'Basketball', emoji: '🏀' },
  { id: 'american-football', label: 'American Football', emoji: '🏈' },
  { id: 'baseball', label: 'Baseball', emoji: '⚾' },
  { id: 'cricket', label: 'Cricket', emoji: '🏏' },
  { id: 'tennis', label: 'Tennis', emoji: '🎾' },
  { id: 'fight', label: 'Fighting', emoji: '🥊' },
  { id: 'rugby', label: 'Rugby', emoji: '🏉' },
  { id: 'golf', label: 'Golf', emoji: '⛳' },
  { id: 'motor-sports', label: 'Motor Sports', emoji: '🏎️' },
  { id: 'darts', label: 'Darts', emoji: '🎯' },
];

export default function SportsPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    const params = activeCategory ? `?category=${activeCategory}` : '';
    fetch(`/api/sports${params}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          setMatches([]);
          setError(data?.error || 'Unexpected response');
        }
      })
      .catch(err => {
        setError(err.message);
        setMatches([]);
      })
      .finally(() => setLoading(false));
  }, [activeCategory]);

  // Group matches by category for the "all" view
  const groupedMatches: Record<string, any[]> = {};
  if (!activeCategory) {
    matches.forEach(m => {
      const cat = m.category || 'other';
      if (!groupedMatches[cat]) groupedMatches[cat] = [];
      groupedMatches[cat].push(m);
    });
  }

  const categoryOrder = ['football', 'basketball', 'american-football', 'baseball', 'cricket', 'tennis', 'fight', 'rugby', 'golf', 'motor-sports', 'darts', 'other'];

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏐</span>
            <h1 className="text-3xl md:text-4xl font-bold">Sports</h1>
          </div>
          <p className="text-gray-400 text-sm ml-12">Live &amp; upcoming matches — real streams</p>
        </div>

        {/* Category Filter Bar */}
        <div className="flex overflow-x-auto gap-2 pb-4 hide-scrollbar mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20'
                  : 'bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-[#252525] border border-[#222222]'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm">Loading matches...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Could not load sports data</p>
            <p className="text-gray-600 text-sm mt-2">{error}</p>
            <button
              onClick={() => setActiveCategory(activeCategory)}
              className="mt-4 px-4 py-2 bg-[#FF6B00] text-white rounded-lg text-sm hover:bg-[#E65A00] transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🏐</span>
            <p className="text-gray-400 text-lg">No matches available right now</p>
            <p className="text-gray-600 text-sm mt-2">Check back later for live sports events</p>
          </div>
        ) : activeCategory ? (
          /* Single category view */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {matches.map(match => (
              <SportsMatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          /* Grouped by category */
          <div className="space-y-8">
            {categoryOrder
              .filter(cat => groupedMatches[cat]?.length > 0)
              .map(cat => {
                const catInfo = CATEGORIES.find(c => c.id === cat);
                return (
                  <section key={cat}>
                    <div className="flex items-center gap-2 mb-3">
                      <span>{catInfo?.emoji || '🏆'}</span>
                      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                        {catInfo?.label || cat}
                      </h2>
                      <span className="text-xs text-gray-600">({groupedMatches[cat].length})</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {groupedMatches[cat].map(match => (
                        <SportsMatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </section>
                );
              })}
          </div>
        )}
      </div>
    </main>
  );
}
