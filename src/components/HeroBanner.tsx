'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { tmdbImage, slugify } from '@/lib/tmdb';

export interface BannerItem {
  id: number;
  title: string;
  name?: string;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
  overview: string;
  media_type?: 'movie' | 'tv';
}

export default function HeroBanner({ items }: { items: BannerItem[] }) {
  const [current, setCurrent] = useState(0);
  const featured = items.slice(0, 8);

  useEffect(() => {
    if (featured.length < 2) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % featured.length), 7000);
    return () => clearInterval(t);
  }, [featured.length]);

  if (featured.length === 0) return null;

  const item = featured[current];
  const isTv = item.media_type === 'tv';
  const displayTitle = item.title || item.name || '';
  const releaseYear = (item.release_date || item.first_air_date || '').split('-')[0] || '';

  // Genre names lookup
  const genreNames: Record<number, string> = {
    28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
    99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 27: 'Horror',
    878: 'Sci-Fi', 53: 'Thriller', 37: 'Western', 10749: 'Romance', 9648: 'Mystery',
    10759: 'Action & Adventure', 10762: 'Kids', 10763: 'News', 10764: 'Reality',
    10765: 'Sci-Fi & Fantasy', 10766: 'Soap', 10767: 'Talk', 10768: 'War & Politics',
  };

  const genreTags = item.genre_ids?.slice(0, 2).map(id => genreNames[id]).filter(Boolean) || [];

  return (
    <div className="relative w-full h-screen min-h-[600px] max-h-[900px] overflow-hidden">
      {/* Background Image */}
      {featured.map((m, i) => (
        <div
          key={m.id}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          style={{ backgroundImage: `url(${tmdbImage(m.backdrop_path, 'original')})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/60 to-[#0D0D0D]/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0D]/90 via-[#0D0D0D]/40 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full max-w-[1400px] mx-auto px-4 flex items-center">
        <div className="max-w-2xl animate-fadeIn">
          {/* Type badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              isTv
                ? 'bg-purple-600/30 text-purple-300 border border-purple-600/40'
                : 'bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30'
            }`}>
              {isTv ? 'TV Series' : 'Movie'}
            </span>
            {releaseYear && (
              <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-full">{releaseYear}</span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-3 drop-shadow-xl leading-tight">
            {displayTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
            {item.vote_average > 0 && (
              <span className="flex items-center gap-1 text-yellow-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                {item.vote_average.toFixed(1)}
              </span>
            )}
            {genreTags.map(g => (
              <span key={g} className="px-2 py-0.5 text-[11px] font-semibold bg-white/10 text-gray-300 rounded border border-white/10">
                {g}
              </span>
            ))}
          </div>
          {item.overview && (
            <p className="text-sm md:text-base text-gray-300 line-clamp-2 md:line-clamp-3 max-w-xl mb-6">
              {item.overview.length > 200 ? item.overview.slice(0, 200) + '...' : item.overview}
            </p>
          )}
          <div className="flex gap-3">
            <Link
              href={`/detail/${slugify(displayTitle, item.id)}?type=${isTv ? 'tv' : 'movie'}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B00] hover:bg-[#E65A00] text-white font-semibold rounded-lg transition-all shadow-lg shadow-orange-600/30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
              Watch Now
            </Link>
            <Link
              href={`/detail/${slugify(displayTitle, item.id)}?type=${isTv ? 'tv' : 'movie'}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-all border border-white/20"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
              More Info
            </Link>
          </div>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-[#FF6B00] w-6' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
